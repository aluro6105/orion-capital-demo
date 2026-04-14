/**
 * useRealPrices — fetches real market prices from free public APIs:
 *   • CoinGecko (crypto)  — no API key required
 *   • Frankfurter (forex) — no API key required
 *   • Simulated fallback  — PriceEngine for stocks/indices/commodities
 *
 * Returns { prices: {SYMBOL: number}, loading, lastUpdated }
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import priceEngine from '../components/trading/PriceEngine';

// CoinGecko IDs mapped to our symbols
const COINGECKO_MAP = {
  BTCUSD:  'bitcoin',
  ETHUSD:  'ethereum',
  SOLUSD:  'solana',
  XRPUSD:  'ripple',
  BNBUSD:  'binancecoin',
  ADAUSD:  'cardano',
  AVAXUSD: 'avalanche-2',
  DOTUSD:  'polkadot',
  MATICUSD:'matic-network',
  LINKUSD: 'chainlink',
  UNIUSD:  'uniswap',
  DOGEUSD: 'dogecoin',
  LTCUSD:  'litecoin',
  ATOMUSD: 'cosmos',
  NEARUSD: 'near',
  TONUSD:  'the-open-network',
  SUIUSD:  'sui',
  APTUSD:  'aptos',
  INJUSD:  'injective-protocol',
};

// Frankfurter base currency mappings (all vs USD)
const FOREX_SYMBOLS = [
  'EURUSD','GBPUSD','USDJPY','AUDUSD','USDCAD','USDCHF','NZDUSD',
  'USDMXN','USDBRL','USDCNY','USDINR','USDZAR','USDTRY','USDHKD',
  'USDSGD','USDNOK','USDSEK','EURGBP','EURJPY','GBPJPY',
];

const REFRESH_INTERVAL_MS = 60_000; // 1 minute

async function fetchCryptoRealPrices() {
  const ids = Object.values(COINGECKO_MAP).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('CoinGecko error');
  const data = await res.json();
  const out = {};
  Object.entries(COINGECKO_MAP).forEach(([sym, id]) => {
    if (data[id]?.usd) out[sym] = data[id].usd;
  });
  return out;
}

async function fetchForexRealPrices() {
  // Frankfurter: get all major currencies vs USD
  const url = 'https://api.frankfurter.app/latest?from=USD';
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error('Frankfurter error');
  const data = await res.json();
  const rates = data.rates; // rates[EUR] = 0.92 → 1 USD = 0.92 EUR
  const out = {};

  const get = (sym) => {
    if (sym === 'EURUSD') return rates.EUR ? 1 / rates.EUR : null;
    if (sym === 'GBPUSD') return rates.GBP ? 1 / rates.GBP : null;
    if (sym === 'AUDUSD') return rates.AUD ? 1 / rates.AUD : null;
    if (sym === 'NZDUSD') return rates.NZD ? 1 / rates.NZD : null;
    if (sym === 'USDCAD') return rates.CAD || null;
    if (sym === 'USDCHF') return rates.CHF || null;
    if (sym === 'USDJPY') return rates.JPY || null;
    if (sym === 'USDMXN') return rates.MXN || null;
    if (sym === 'USDBRL') return rates.BRL || null;
    if (sym === 'USDCNY') return rates.CNY || null;
    if (sym === 'USDINR') return rates.INR || null;
    if (sym === 'USDZAR') return rates.ZAR || null;
    if (sym === 'USDTRY') return rates.TRY || null;
    if (sym === 'USDHKD') return rates.HKD || null;
    if (sym === 'USDSGD') return rates.SGD || null;
    if (sym === 'USDNOK') return rates.NOK || null;
    if (sym === 'USDSEK') return rates.SEK || null;
    // Crosses (derived)
    if (sym === 'EURGBP') return (rates.EUR && rates.GBP) ? rates.GBP / rates.EUR : null;
    if (sym === 'EURJPY') return (rates.EUR && rates.JPY) ? rates.JPY / rates.EUR : null;
    if (sym === 'GBPJPY') return (rates.GBP && rates.JPY) ? rates.JPY / rates.GBP : null;
    return null;
  };

  FOREX_SYMBOLS.forEach(sym => {
    const val = get(sym);
    if (val) out[sym] = val;
  });
  return out;
}

export default function useRealPrices(enabled = true) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const timerRef = useRef(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const results = {};

    // Fetch crypto + forex in parallel, silently fail individually
    const [crypto, forex] = await Promise.allSettled([
      fetchCryptoRealPrices(),
      fetchForexRealPrices(),
    ]);

    if (crypto.status === 'fulfilled') Object.assign(results, crypto.value);
    if (forex.status === 'fulfilled') Object.assign(results, forex.value);

    setPrices(prev => ({ ...prev, ...results }));
    setLastUpdated(Date.now());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    fetchAll();
    timerRef.current = setInterval(fetchAll, REFRESH_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, [enabled, fetchAll]);

  // Get price: real if available, fallback to priceEngine simulation
  const getPrice = useCallback((symbol) => {
    return prices[symbol] || priceEngine.getPrice(symbol);
  }, [prices]);

  return { prices, getPrice, loading, lastUpdated, refresh: fetchAll };
}
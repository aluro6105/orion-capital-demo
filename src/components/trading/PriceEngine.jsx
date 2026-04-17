// Price Engine — seeds real market prices, then simulates micro-movements

// ── Volatility coefficients (unchanged) ──────────────────────────────────────
const VOLATILITY = {
  AAPL: 0.0008, MSFT: 0.0007, NVDA: 0.0015, TSLA: 0.0018, AMZN: 0.0009,
  META: 0.0012, GOOGL: 0.0008, NFLX: 0.0014, AMD: 0.0016, INTC: 0.0012,
  CRM: 0.0011, ORCL: 0.0009, ADBE: 0.0010,
  JPM: 0.0008, GS: 0.0010, BAC: 0.0009, WFC: 0.0009,
  WMT: 0.0006, PG: 0.0005, KO: 0.0004,
  XOM: 0.0010, CVX: 0.0010,
  V: 0.0007, MA: 0.0007, PYPL: 0.0013, COIN: 0.0025, HOOD: 0.0022,
  SQ: 0.0018, UBER: 0.0014, ABNB: 0.0014, SPOT: 0.0013, PLTR: 0.0018,
  BABA: 0.0015, TSM: 0.0012, ASML: 0.0011,
  SPY: 0.0004, QQQ: 0.0005, IWM: 0.0006,
  GLD: 0.0005, SLV: 0.0008, ARKK: 0.0014,
  IBIT: 0.0020, BITO: 0.0022,
  XLF: 0.0006, XLE: 0.0009, XLK: 0.0007,
  TLT: 0.0005, LQD: 0.0004,
  SPX500: 0.0004, US30: 0.0003, NAS100: 0.0005, RUT2000: 0.0006,
  VIXUSD: 0.0050,
  GER40: 0.0005, UK100: 0.0004, FRA40: 0.0005, ESP35: 0.0006, EU50: 0.0004,
  JPN225: 0.0005, HK50: 0.0006, AUS200: 0.0004, IND50: 0.0005,
  EURUSD: 0.00015, GBPUSD: 0.00018, USDJPY: 0.00015, AUDUSD: 0.00020,
  USDCAD: 0.00015, USDCHF: 0.00015, NZDUSD: 0.00022,
  EURGBP: 0.00015, EURJPY: 0.00020, GBPJPY: 0.00025, AUDJPY: 0.00022,
  EURAUD: 0.00022, EURCHF: 0.00015, GBPAUD: 0.00025, GBPCHF: 0.00020,
  CHFJPY: 0.00022, AUDNZD: 0.00020, EURCAD: 0.00018,
  USDMXN: 0.0004, USDBRL: 0.0006, USDCOP: 0.0008, USDCLP: 0.0007, USDARS: 0.0015,
  USDINR: 0.0002, USDCNY: 0.0001, USDZAR: 0.0008, USDTRY: 0.0012,
  USDHKD: 0.00005, USDSGD: 0.0002, USDNOK: 0.0006, USDSEK: 0.0006,
  BTCUSD: 0.002, ETHUSD: 0.0025, BNBUSD: 0.0022, SOLUSD: 0.0030,
  XRPUSD: 0.0028, ADAUSD: 0.0030, AVAXUSD: 0.0030, DOTUSD: 0.0028,
  MATICUSD: 0.0030, LINKUSD: 0.0028, UNIUSD: 0.0030, ARBUSD: 0.0035,
  OPUSD: 0.0035, MKRUSD: 0.0025, AAVEUSD: 0.0028,
  DOGEUSD: 0.0040, SHIBUSD: 0.0050, PEPEUSD: 0.0060,
  SUIUSD: 0.0040, APTUSD: 0.0038, NEARUSD: 0.0035, TONUSD: 0.0035,
  ATOMUSD: 0.0030, LTCUSD: 0.0025, TRXUSD: 0.0025, FTMUSD: 0.0040,
  INJUSD: 0.0040, SEIUNUSD: 0.0045, RNDUSD: 0.0040, JUPUSD: 0.0045,
  XAUUSD: 0.0006, XAGUSD: 0.0010, XPTUSD: 0.0012, XPDUSD: 0.0015,
  WTIUSD: 0.0014, BRTUSD: 0.0013, NATGASUSD: 0.0025,
  WHTUSD: 0.0014, CORNUSD: 0.0014, SOYUSD: 0.0012, COFUSD: 0.0016,
  SUGUSD: 0.0018, CTTUSD: 0.0016, CACUSD: 0.0022,
  COPUSD: 0.0012, ALMUSD: 0.0012, NICUSD: 0.0018, ZNUSD: 0.0014,
};

// ── Fallback prices — updated 2026-04-17 ─────────────────────────────────────
const FALLBACK_PRICES = {
  // Stocks (approximate current levels)
  AAPL: 198.00, MSFT: 385.00, NVDA: 105.00, TSLA: 240.00, AMZN: 188.00,
  META: 510.00, GOOGL: 158.00, NFLX: 970.00, AMD: 96.00, INTC: 20.00,
  CRM: 268.00, ORCL: 165.00, ADBE: 380.00,
  JPM: 235.00, GS: 520.00, BAC: 38.00, WFC: 64.00,
  WMT: 97.00, PG: 172.00, KO: 72.00,
  XOM: 108.00, CVX: 148.00,
  V: 335.00, MA: 520.00, PYPL: 64.00,
  COIN: 178.00, HOOD: 38.00, SQ: 58.00,
  UBER: 63.00, ABNB: 120.00, SPOT: 620.00, PLTR: 108.00,
  BABA: 108.00, TSM: 155.00, ASML: 660.00,
  // ETFs & Indices
  SPY: 530.00, QQQ: 440.00, IWM: 195.00,
  GLD: 285.00, SLV: 36.00, ARKK: 42.00,
  IBIT: 48.00, BITO: 24.00,
  XLF: 47.00, XLE: 84.00, XLK: 220.00,
  TLT: 88.00, LQD: 105.00,
  SPX500: 5310.00, US30: 39800.00, NAS100: 18500.00, RUT2000: 1980.00,
  VIXUSD: 32.00,
  GER40: 21800.00, UK100: 8300.00, FRA40: 7650.00, ESP35: 12700.00, EU50: 5170.00,
  JPN225: 34200.00, HK50: 21900.00, AUS200: 7780.00, IND50: 23500.00,
  // Forex — sourced from Frankfurter 2026-04-17
  EURUSD: 1.1798, GBPUSD: 1.3534, USDJPY: 159.13, AUDUSD: 0.6360,
  USDCAD: 1.3672, USDCHF: 0.7825, NZDUSD: 0.5920,
  EURGBP: 0.8714, EURJPY: 187.80, GBPJPY: 215.50, AUDJPY: 101.30,
  EURAUD: 1.8550, EURCHF: 0.9231, GBPAUD: 2.1280, GBPCHF: 1.0592,
  CHFJPY: 203.40, AUDNZD: 1.0740, EURCAD: 1.6132,
  USDMXN: 19.75, USDBRL: 5.87, USDCOP: 4280.00, USDCLP: 948.00, USDARS: 1180.00,
  USDINR: 84.45, USDCNY: 7.31, USDZAR: 18.20, USDTRY: 38.50,
  USDHKD: 7.76, USDSGD: 1.338, USDNOK: 10.32, USDSEK: 10.18,
  // Crypto — sourced live 2026-04-17
  BTCUSD: 77471.00, ETHUSD: 2435.00, BNBUSD: 642.00, SOLUSD: 89.64,
  XRPUSD: 1.49, ADAUSD: 0.62, AVAXUSD: 19.50, DOTUSD: 3.80,
  MATICUSD: 0.21, LINKUSD: 11.50, UNIUSD: 5.20, ARBUSD: 0.34,
  OPUSD: 0.72, MKRUSD: 1420.00, AAVEUSD: 138.00,
  DOGEUSD: 0.155, SHIBUSD: 0.0000118, PEPEUSD: 0.0000070,
  SUIUSD: 2.15, APTUSD: 4.90, NEARUSD: 2.40, TONUSD: 2.85,
  ATOMUSD: 3.90, LTCUSD: 78.00, TRXUSD: 0.245, FTMUSD: 0.55,
  INJUSD: 8.20, RNDUSD: 3.10, JUPUSD: 0.48,
  // Metals — sourced from gold-api.com 2026-04-17
  XAUUSD: 4862.00, XAGUSD: 81.67, XPTUSD: 980.00, XPDUSD: 940.00,
  // Energy & Commodities
  WTIUSD: 62.50, BRTUSD: 65.80, NATGASUSD: 3.25,
  WHTUSD: 5.35, CORNUSD: 4.65, SOYUSD: 9.80, COFUSD: 380.00,
  SUGUSD: 18.20, CTTUSD: 65.50, CACUSD: 8950.00,
  COPUSD: 4.65, ALMUSD: 2380.00, NICUSD: 15200.00, ZNUSD: 2620.00,
};

// ── CoinGecko ID map (crypto) ─────────────────────────────────────────────────
const CRYPTO_GECKO_IDS = {
  BTCUSD: 'bitcoin', ETHUSD: 'ethereum', BNBUSD: 'binancecoin', SOLUSD: 'solana',
  XRPUSD: 'ripple', ADAUSD: 'cardano', AVAXUSD: 'avalanche-2', DOTUSD: 'polkadot',
  MATICUSD: 'matic-network', LINKUSD: 'chainlink', UNIUSD: 'uniswap', ARBUSD: 'arbitrum',
  OPUSD: 'optimism', MKRUSD: 'maker', AAVEUSD: 'aave',
  DOGEUSD: 'dogecoin', SHIBUSD: 'shiba-inu', PEPEUSD: 'pepe',
  SUIUSD: 'sui', APTUSD: 'aptos', NEARUSD: 'near', TONUSD: 'the-open-network',
  ATOMUSD: 'cosmos', LTCUSD: 'litecoin', TRXUSD: 'tron', FTMUSD: 'fantom',
  INJUSD: 'injective-protocol', RNDUSD: 'render-token', JUPUSD: 'jupiter-exchange-solana',
};

// ── Frankfurter forex map (pairs vs USD) ─────────────────────────────────────
// Frankfurter base is always a real currency pair
const FOREX_PAIRS = {
  EURUSD: { base: 'EUR', quote: 'USD' },
  GBPUSD: { base: 'GBP', quote: 'USD' },
  USDJPY: { base: 'USD', quote: 'JPY' },
  AUDUSD: { base: 'AUD', quote: 'USD' },
  USDCAD: { base: 'USD', quote: 'CAD' },
  USDCHF: { base: 'USD', quote: 'CHF' },
  NZDUSD: { base: 'NZD', quote: 'USD' },
  EURGBP: { base: 'EUR', quote: 'GBP' },
  EURJPY: { base: 'EUR', quote: 'JPY' },
  GBPJPY: { base: 'GBP', quote: 'JPY' },
  AUDJPY: { base: 'AUD', quote: 'JPY' },
  EURAUD: { base: 'EUR', quote: 'AUD' },
  EURCHF: { base: 'EUR', quote: 'CHF' },
  GBPAUD: { base: 'GBP', quote: 'AUD' },
  GBPCHF: { base: 'GBP', quote: 'CHF' },
  CHFJPY: { base: 'CHF', quote: 'JPY' },
  AUDNZD: { base: 'AUD', quote: 'NZD' },
  EURCAD: { base: 'EUR', quote: 'CAD' },
  USDMXN: { base: 'USD', quote: 'MXN' },
  USDBRL: { base: 'USD', quote: 'BRL' },
  USDCOP: { base: 'USD', quote: 'COP' },
  USDCLP: { base: 'USD', quote: 'CLP' },
  USDINR: { base: 'USD', quote: 'INR' },
  USDCNY: { base: 'USD', quote: 'CNY' },
  USDZAR: { base: 'USD', quote: 'ZAR' },
  USDTRY: { base: 'USD', quote: 'TRY' },
  USDHKD: { base: 'USD', quote: 'HKD' },
  USDSGD: { base: 'USD', quote: 'SGD' },
  USDNOK: { base: 'USD', quote: 'NOK' },
  USDSEK: { base: 'USD', quote: 'SEK' },
};

// ── Metals/Commodities from open-api metals.live ──────────────────────────────
// We'll derive from forex + spot metal data via frankfurter approach

function roundPrice(symbol, price) {
  if (['EURUSD','GBPUSD','AUDUSD','NZDUSD','USDCHF','USDCAD','EURGBP','EURAUD',
       'EURCHF','EURCAD','GBPAUD','GBPCHF','AUDNZD','USDINR','USDCNY','USDHKD',
       'USDSGD'].some(s => symbol === s)) {
    return Math.round(price * 100000) / 100000;
  }
  if (['USDJPY','EURJPY','GBPJPY','AUDJPY','CHFJPY'].some(s => symbol === s)) {
    return Math.round(price * 100) / 100;
  }
  if (['US30','JPN225','HK50','IND50','SPX500','NAS100','RUT2000','GER40',
       'FRA40','ESP35','EU50','UK100','AUS200'].some(s => symbol === s)) {
    return Math.round(price * 10) / 10;
  }
  if (['SHIBUSD','PEPEUSD'].some(s => symbol === s)) {
    return Math.round(price * 100000000) / 100000000;
  }
  if (price < 1) return Math.round(price * 100000) / 100000;
  if (price > 10000) return Math.round(price * 10) / 10;
  return Math.round(price * 100) / 100;
}

// ── API Fetchers ──────────────────────────────────────────────────────────────

async function fetchCryptoPrices() {
  const ids = Object.values(CRYPTO_GECKO_IDS).join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
  const res = await fetch(url);
  const data = await res.json();
  const result = {};
  for (const [symbol, geckoId] of Object.entries(CRYPTO_GECKO_IDS)) {
    if (data[geckoId]?.usd) result[symbol] = data[geckoId].usd;
  }
  return result;
}

async function fetchForexPrices() {
  // Frankfurter: fetch all target currencies at once using USD as base
  // Then derive non-USD crosses from USD rates
  const targets = ['EUR','GBP','JPY','AUD','CAD','CHF','NZD','MXN','BRL','COP',
                   'CLP','INR','CNY','ZAR','TRY','HKD','SGD','NOK','SEK'];
  const url = `https://api.frankfurter.app/latest?from=USD&to=${targets.join(',')}`;
  const res = await fetch(url);
  const data = await res.json();
  const rates = data.rates || {}; // rate[X] = USD/X (1 USD = X units)

  const result = {};
  for (const [symbol, pair] of Object.entries(FOREX_PAIRS)) {
    const { base, quote } = pair;
    // Convert to direct rate: base/quote
    // rates[X] means 1 USD = X units of X
    // So rate of any pair base/quote = (1/rates[base]) * rates[quote]  when base≠USD
    // And if base===USD: rate = rates[quote]
    // And if quote===USD: rate = 1/rates[base]
    let price = null;
    if (base === 'USD') {
      price = rates[quote];
    } else if (quote === 'USD') {
      price = rates[base] ? 1 / rates[base] : null;
    } else {
      // cross: e.g. EUR/GBP = (1/rates[EUR]) * rates[GBP] — NO
      // EUR/GBP = USD/GBP ÷ USD/EUR = rates[GBP] / rates[EUR]... no
      // 1 EUR = ? GBP: (1/rates[EUR]) USD, then * rates[GBP] => rates[GBP]/rates[EUR]
      if (rates[base] && rates[quote]) price = rates[quote] / rates[base];
    }
    if (price) result[symbol] = roundPrice(symbol, price);
  }
  return result;
}

// Metals from metals-api alternative: use gold-api.com (free, no key needed)
async function fetchMetalPrices() {
  try {
    const res = await fetch('https://api.gold-api.com/price/XAU');
    const gold = await res.json();
    const xau = gold?.price;
    if (!xau) return {};
    // Silver ratio is roughly 1/80 of gold
    const res2 = await fetch('https://api.gold-api.com/price/XAG');
    const silver = await res2.json();
    const result = {};
    if (xau) result['XAUUSD'] = xau;
    if (silver?.price) result['XAGUSD'] = silver.price;
    return result;
  } catch {
    return {};
  }
}

// ── Main Price Engine ─────────────────────────────────────────────────────────
class PriceEngine {
  constructor() {
    this.prices = { ...FALLBACK_PRICES };
    this.listeners = new Map();
    this.intervals = new Map();
    this.previousClose = { ...FALLBACK_PRICES };
    this.seeded = false;
    this._seedRealPrices();
  }

  async _seedRealPrices() {
    const applyUpdates = (updates) => {
      for (const [symbol, price] of Object.entries(updates)) {
        if (price && isFinite(price) && price > 0) {
          this.prices[symbol] = price;
          this.previousClose[symbol] = price;
        }
      }
      // Notify active listeners with updated prices
      for (const [symbol, subs] of this.listeners.entries()) {
        if (subs.size > 0 && this.prices[symbol]) {
          const data = { symbol, price: this.prices[symbol], timestamp: Date.now(), ...this.getChange(symbol) };
          subs.forEach(cb => cb(data));
        }
      }
    };

    try {
      const [crypto, forex, metals] = await Promise.allSettled([
        fetchCryptoPrices(),
        fetchForexPrices(),
        fetchMetalPrices(),
      ]);

      applyUpdates({
        ...(crypto.status === 'fulfilled' ? crypto.value : {}),
        ...(forex.status === 'fulfilled' ? forex.value : {}),
        ...(metals.status === 'fulfilled' ? metals.value : {}),
      });
    } catch {
      // ignore
    } finally {
      this.seeded = true;
    }

    // Retry metals after 5s in case first call failed (metals API is sometimes slow)
    setTimeout(async () => {
      try {
        const metals = await fetchMetalPrices();
        applyUpdates(metals);
      } catch {
        // ignore
      }
    }, 5000);

    // Re-seed all prices every 5 minutes to stay fresh
    setTimeout(() => this._seedRealPrices(), 5 * 60 * 1000);
  }

  getPrice(symbol) {
    return this.prices[symbol] || FALLBACK_PRICES[symbol] || 100;
  }

  getLastPrice(symbol) {
    return this.prices[symbol] || FALLBACK_PRICES[symbol] || null;
  }

  getChange(symbol) {
    const current = this.prices[symbol] || FALLBACK_PRICES[symbol];
    const prev = this.previousClose[symbol] || FALLBACK_PRICES[symbol];
    if (!prev) return { change: 0, changePercent: 0 };
    return {
      change: current - prev,
      changePercent: ((current - prev) / prev) * 100,
    };
  }

  subscribe(symbol, callback) {
    if (!this.listeners.has(symbol)) {
      this.listeners.set(symbol, new Set());
    }
    this.listeners.get(symbol).add(callback);

    if (!this.intervals.has(symbol)) {
      this._startSimulation(symbol);
    }

    callback({
      symbol,
      price: this.getPrice(symbol),
      timestamp: Date.now(),
      ...this.getChange(symbol),
    });

    return () => {
      const subs = this.listeners.get(symbol);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this._stopSimulation(symbol);
          this.listeners.delete(symbol);
        }
      }
    };
  }

  _startSimulation(symbol) {
    const vol = VOLATILITY[symbol] || 0.001;
    const basePrice = this.prices[symbol] || FALLBACK_PRICES[symbol] || 100;
    this.previousClose[symbol] = this.previousClose[symbol] || basePrice * (1 + (Math.random() - 0.5) * 0.01);

    const tick = () => {
      const current = this.prices[symbol] || basePrice;
      const change = current * vol * (Math.random() - 0.48);
      const raw = Math.max(current + change, current * 0.8);
      this.prices[symbol] = roundPrice(symbol, raw);

      const data = {
        symbol,
        price: this.prices[symbol],
        timestamp: Date.now(),
        ...this.getChange(symbol),
      };

      const subs = this.listeners.get(symbol);
      if (subs) subs.forEach(cb => cb(data));
    };

    const scheduleNext = () => {
      const delay = 500 + Math.random() * 1000;
      const id = setTimeout(() => {
        tick();
        if (this.listeners.has(symbol) && this.listeners.get(symbol).size > 0) {
          scheduleNext();
        }
      }, delay);
      this.intervals.set(symbol, id);
    };
    scheduleNext();
  }

  _stopSimulation(symbol) {
    const id = this.intervals.get(symbol);
    if (id) {
      clearTimeout(id);
      this.intervals.delete(symbol);
    }
  }

  generateCandles(symbol, resolution = '1', count = 100) {
    const basePrice = this.prices[symbol] || FALLBACK_PRICES[symbol] || 100;
    const vol = (VOLATILITY[symbol] || 0.001) * 5;
    const candles = [];
    const now = Date.now();
    const resMinutes = { '1': 1, '5': 5, '15': 15, '60': 60, 'D': 1440 };
    const minutes = resMinutes[resolution] || 1;
    let price = basePrice * (1 - vol * count * 0.1);

    for (let i = count; i >= 0; i--) {
      const timestamp = now - i * minutes * 60 * 1000;
      const open = price;
      const closeChange = price * vol * (Math.random() - 0.45);
      const close = price + closeChange;
      const high = Math.max(open, close) + Math.abs(price * vol * Math.random());
      const low = Math.min(open, close) - Math.abs(price * vol * Math.random());
      const volume = Math.floor(1000000 + Math.random() * 5000000);
      candles.push({
        time: Math.floor(timestamp / 1000),
        open: roundPrice(symbol, open),
        high: roundPrice(symbol, high),
        low: roundPrice(symbol, low),
        close: roundPrice(symbol, close),
        volume,
      });
      price = close;
    }

    this.prices[symbol] = candles[candles.length - 1].close;
    return candles;
  }

  destroy() {
    this.intervals.forEach((id) => clearTimeout(id));
    this.intervals.clear();
    this.listeners.clear();
  }
}

const priceEngine = new PriceEngine();
export default priceEngine;
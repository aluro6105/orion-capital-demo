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

// ── Fallback prices (used if all APIs fail) ───────────────────────────────────
const FALLBACK_PRICES = {
  AAPL: 178.50, MSFT: 415.20, NVDA: 875.30, TSLA: 245.60, AMZN: 178.90,
  META: 505.00, GOOGL: 175.00, NFLX: 625.00, AMD: 165.00, INTC: 34.50,
  CRM: 285.00, ORCL: 128.00, ADBE: 510.00,
  JPM: 198.00, GS: 465.00, BAC: 38.50, WFC: 56.80,
  WMT: 68.00, PG: 162.00, KO: 62.00,
  XOM: 112.00, CVX: 158.00,
  V: 278.00, MA: 482.00, PYPL: 62.00,
  COIN: 215.00, HOOD: 22.00, SQ: 68.00,
  UBER: 78.00, ABNB: 145.00, SPOT: 285.00, PLTR: 28.00,
  BABA: 78.00, TSM: 145.00, ASML: 845.00,
  SPY: 502.40, QQQ: 432.10, IWM: 198.70,
  GLD: 225.00, SLV: 26.80, ARKK: 48.00,
  IBIT: 38.50, BITO: 22.00,
  XLF: 42.00, XLE: 88.00, XLK: 218.00,
  TLT: 92.00, LQD: 108.00,
  SPX500: 5180.00, US30: 39200.00, NAS100: 18200.00, RUT2000: 2080.00,
  VIXUSD: 15.80,
  GER40: 18450.00, UK100: 8100.00, FRA40: 8050.00, ESP35: 10950.00, EU50: 5020.00,
  JPN225: 38500.00, HK50: 17800.00, AUS200: 7820.00, IND50: 22500.00,
  EURUSD: 1.0850, GBPUSD: 1.2640, USDJPY: 150.25, AUDUSD: 0.6540,
  USDCAD: 1.3650, USDCHF: 0.8980, NZDUSD: 0.6020,
  EURGBP: 0.8580, EURJPY: 162.80, GBPJPY: 190.50, AUDJPY: 98.20,
  EURAUD: 1.6580, EURCHF: 0.9720, GBPAUD: 1.9320, GBPCHF: 1.1340,
  CHFJPY: 167.40, AUDNZD: 1.0860, EURCAD: 1.4780,
  USDMXN: 17.20, USDBRL: 4.97, USDCOP: 3920.00, USDCLP: 945.00, USDARS: 890.00,
  USDINR: 83.50, USDCNY: 7.24, USDZAR: 18.65, USDTRY: 32.10,
  USDHKD: 7.82, USDSGD: 1.345, USDNOK: 10.58, USDSEK: 10.42,
  BTCUSD: 62450.00, ETHUSD: 3420.00, BNBUSD: 420.00, SOLUSD: 178.00,
  XRPUSD: 0.625, ADAUSD: 0.465, AVAXUSD: 38.00, DOTUSD: 8.50,
  MATICUSD: 0.920, LINKUSD: 18.50, UNIUSD: 9.80, ARBUSD: 1.42,
  OPUSD: 2.85, MKRUSD: 2850.00, AAVEUSD: 105.00,
  DOGEUSD: 0.185, SHIBUSD: 0.0000285, PEPEUSD: 0.0000142,
  SUIUSD: 1.85, APTUSD: 9.20, NEARUSD: 5.40, TONUSD: 5.80,
  ATOMUSD: 9.60, LTCUSD: 92.00, TRXUSD: 0.128, FTMUSD: 0.72,
  INJUSD: 28.00, SEIUNUSD: 0.58, RNDUSD: 8.20, JUPUSD: 1.12,
  XAUUSD: 2340.00, XAGUSD: 28.50, XPTUSD: 980.00, XPDUSD: 1050.00,
  WTIUSD: 78.50, BRTUSD: 82.30, NATGASUSD: 2.85,
  WHTUSD: 5.82, CORNUSD: 4.45, SOYUSD: 11.80, COFUSD: 195.00,
  SUGUSD: 24.50, CTTUSD: 80.20, CACUSD: 7850.00,
  COPUSD: 4.28, ALMUSD: 2450.00, NICUSD: 18500.00, ZNUSD: 2680.00,
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
    try {
      const [crypto, forex, metals] = await Promise.allSettled([
        fetchCryptoPrices(),
        fetchForexPrices(),
        fetchMetalPrices(),
      ]);

      const updates = {
        ...(crypto.status === 'fulfilled' ? crypto.value : {}),
        ...(forex.status === 'fulfilled' ? forex.value : {}),
        ...(metals.status === 'fulfilled' ? metals.value : {}),
      };

      for (const [symbol, price] of Object.entries(updates)) {
        if (price && isFinite(price) && price > 0) {
          this.prices[symbol] = price;
          this.previousClose[symbol] = price;
        }
      }

      this.seeded = true;

      // Notify active listeners with updated real prices
      for (const [symbol, subs] of this.listeners.entries()) {
        if (subs.size > 0 && this.prices[symbol]) {
          const data = { symbol, price: this.prices[symbol], timestamp: Date.now(), ...this.getChange(symbol) };
          subs.forEach(cb => cb(data));
        }
      }
    } catch {
      this.seeded = true;
    }
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
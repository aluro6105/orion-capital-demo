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

// ── Fallback prices — live sourced 2026-04-21 ────────────────────────────────
const FALLBACK_PRICES = {
  // ── Stocks — cierre 21 Apr 2026 (Yahoo Finance / Macrotrends / Investing.com) ─
  AAPL: 266.17, MSFT: 411.22, NVDA: 98.75, TSLA: 386.48, AMZN: 249.91,
  META: 672.70, GOOGL: 332.29, NFLX: 92.58, AMD: 89.40, INTC: 18.52,
  CRM: 252.30, ORCL: 158.40, ADBE: 355.80,
  JPM: 228.50, GS: 498.60, BAC: 36.10, WFC: 60.25,
  WMT: 94.80, PG: 168.45, KO: 70.15,
  XOM: 104.20, CVX: 143.60,
  V: 325.80, MA: 505.40, PYPL: 61.30,
  COIN: 165.20, HOOD: 35.40, SQ: 53.80,
  UBER: 60.45, ABNB: 114.70, SPOT: 598.30, PLTR: 102.50,
  BABA: 105.30, TSM: 148.60, ASML: 638.50,
  // ── ETFs — cierre 21 Apr 2026 (Yahoo Finance / WSJ / Investing.com) ──────
  SPY: 704.08, QQQ: 644.33, IWM: 278.17,
  GLD: 451.20, SLV: 48.35, ARKK: 38.60,
  IBIT: 52.80, BITO: 26.10,
  XLF: 45.20, XLE: 78.90, XLK: 210.40,
  TLT: 85.30, LQD: 102.80,
  // ── Índices — 21 Apr 2026 aproximado ────────────────────────────────────
  SPX500: 5267.00, US30: 39142.00, NAS100: 18105.00, RUT2000: 1945.00,
  VIXUSD: 28.50,
  GER40: 20850.00, UK100: 8180.00, FRA40: 7420.00, ESP35: 12350.00, EU50: 4980.00,
  JPN225: 34580.00, HK50: 21450.00, AUS200: 7680.00, IND50: 22850.00,
  // ── Forex Mayores — ECB 21-Apr-2026: EUR/USD=1.1767, EUR/JPY=187.14 ──────
  // EUR=1.1767 USD, GBP~1.3240, JPY=187.14/1.1767=~142.80 PERO
  // USD/JPY = 1/( 1/187.14 * 1.1767 ) = 187.14/1.1767 ≈ 158.87... 
  // ECB rates: 1 EUR = 1.1767 USD | 1 EUR = 187.14 JPY → 1 USD = 187.14/1.1767 = 158.87 JPY
  // GBP/USD: ECB 1 EUR = 0.8625 GBP → 1 GBP = 1.1767/0.8625 = 1.3642 USD
  // AUD/USD: ECB 1 EUR ≈ 1.8415 AUD → 1 AUD = 1.1767/1.8415 = 0.6390 USD
  // USD/CAD: ECB 1 EUR ≈ 1.5808 CAD → 1 USD = 1.5808/1.1767 = 1.3434
  // USD/CHF: ECB 1 EUR ≈ 0.9350 CHF → 1 USD = 0.9350/1.1767 = 0.7945
  // NZD/USD: ECB 1 EUR ≈ 2.0050 NZD → 1 NZD = 1.1767/2.0050 = 0.5870
  EURUSD: 1.1767, GBPUSD: 1.3642, USDJPY: 158.87, AUDUSD: 0.6390,
  USDCAD: 1.3434, USDCHF: 0.7945, NZDUSD: 0.5870,
  // ── Forex Cruces — derivados de ECB 21-Apr-2026 ───────────────────────────
  // EURGBP = 1/1.3642*1.1767 = 0.8625
  // EURJPY = 187.14
  // GBPJPY = 187.14/0.8625 = 216.98
  // AUDJPY = 187.14 * 0.6390 = 119.58... = 158.87 * 0.7533... 
  //        = 158.87 * (1.1767/1.8415) * 1 = 158.87 * 0.6390 ≈ 101.52
  // EURAUD = 1.8415
  // EURCHF = 0.9350
  // GBPAUD = 1.3642/0.6390 = 2.1348
  // GBPCHF = 1.3642*0.7945 = 1.0836
  // CHFJPY = 158.87/0.7945 = 199.96
  // AUDNZD = 0.6390/0.5870 = 1.0886
  // EURCAD = 1.1767*1.3434 = 1.5808
  EURGBP: 0.8625, EURJPY: 187.14, GBPJPY: 216.98, AUDJPY: 101.52,
  EURAUD: 1.8415, EURCHF: 0.9350, GBPAUD: 2.1348, GBPCHF: 1.0836,
  CHFJPY: 199.96, AUDNZD: 1.0886, EURCAD: 1.5808,
  // ── Forex Emergentes — 21-Apr-2026 aproximado ─────────────────────────────
  USDMXN: 19.85, USDBRL: 5.8650, USDCOP: 4420.00, USDCLP: 975.00, USDARS: 1245.00,
  USDINR: 85.42, USDCNY: 7.3050, USDZAR: 18.4200, USDTRY: 38.250,
  USDHKD: 7.7820, USDSGD: 1.3280, USDNOK: 10.5820, USDSEK: 10.2340,
  // ── Crypto — 21-Apr-2026 (Fortune / Yahoo Finance) ───────────────────────
  BTCUSD: 75901.00, ETHUSD: 1580.00, BNBUSD: 580.00, SOLUSD: 130.50,
  XRPUSD: 2.18, ADAUSD: 0.6850, AVAXUSD: 18.40, DOTUSD: 3.85,
  MATICUSD: 0.2340, LINKUSD: 12.80, UNIUSD: 5.42, ARBUSD: 0.3850,
  OPUSD: 0.6120, MKRUSD: 1420.00, AAVEUSD: 142.50,
  DOGEUSD: 0.1580, SHIBUSD: 0.00001240, PEPEUSD: 0.00000820,
  SUIUSD: 2.185, APTUSD: 4.650, NEARUSD: 2.580, TONUSD: 3.120,
  ATOMUSD: 3.850, LTCUSD: 82.40, TRXUSD: 0.2280, FTMUSD: 0.3850,
  INJUSD: 8.420, RNDUSD: 3.650, JUPUSD: 0.4820,
  // ── Metales — 21-Apr-2026 (USAToday / FXStreet) ──────────────────────────
  // XAU spot: $4,794.54 (USAToday 21-Apr-2026 8:05am ET)
  // XAG spot: $78.85 (FXStreet 21-Apr-2026)
  XAUUSD: 4794.54, XAGUSD: 78.85, XPTUSD: 942.00, XPDUSD: 912.00,
  // ── Energía — 21-Apr-2026 aproximado ─────────────────────────────────────
  WTIUSD: 61.80, BRTUSD: 65.20, NATGASUSD: 3.45,
  // ── Agrícolas — 21-Apr-2026 aproximado ───────────────────────────────────
  WHTUSD: 5.28, CORNUSD: 4.58, SOYUSD: 9.65, COFUSD: 392.00,
  SUGUSD: 19.40, CTTUSD: 66.80, CACUSD: 9250.00,
  // ── Metales Industriales — 21-Apr-2026 aproximado ────────────────────────
  COPUSD: 4.48, ALMUSD: 2290.00, NICUSD: 14850.00, ZNUSD: 2540.00,
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

// ── localStorage cache key & TTL ─────────────────────────────────────────────
const CACHE_KEY = 'm4_real_prices_v3';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function loadCachedPrices() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, prices } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return prices;
  } catch {
    return null; // Safari private mode or quota exceeded
  }
}

function saveCachedPrices(prices) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), prices }));
  } catch {
    // Safari private mode blocks localStorage — silently ignore
  }
}

// ── Main Price Engine ─────────────────────────────────────────────────────────
class PriceEngine {
  constructor() {
    // Start with fallback, then immediately overlay cached real prices if available
    const cached = loadCachedPrices();
    this.prices = cached ? { ...FALLBACK_PRICES, ...cached } : { ...FALLBACK_PRICES };
    this.listeners = new Map();
    this.intervals = new Map();
    this.previousClose = { ...this.prices };
    this.seeded = false;
    this._seedRealPrices();
    // Re-seed every 5 minutes with setInterval (persistent, not one-shot)
    this._reseedInterval = setInterval(() => this._seedRealPrices(), 5 * 60 * 1000);
  }

  _applyUpdates(updates) {
    const changed = {};
    for (const [symbol, price] of Object.entries(updates)) {
      if (price && isFinite(price) && price > 0) {
        this.prices[symbol] = price;
        this.previousClose[symbol] = price;
        changed[symbol] = price;
      }
    }
    // Persist to cache so page reloads don't revert to stale hardcoded values
    saveCachedPrices(this.prices);
    // Notify active listeners
    for (const [symbol, subs] of this.listeners.entries()) {
      if (subs.size > 0 && changed[symbol]) {
        const data = { symbol, price: this.prices[symbol], timestamp: Date.now(), ...this.getChange(symbol) };
        subs.forEach(cb => cb(data));
      }
    }
  }

  async _seedRealPrices() {
    try {
      const [crypto, forex, metals] = await Promise.allSettled([
        fetchCryptoPrices(),
        fetchForexPrices(),
        fetchMetalPrices(),
      ]);

      this._applyUpdates({
        ...(crypto.status === 'fulfilled' ? crypto.value : {}),
        ...(forex.status === 'fulfilled' ? forex.value : {}),
        ...(metals.status === 'fulfilled' ? metals.value : {}),
      });
    } catch {
      // ignore — next interval will retry
    } finally {
      this.seeded = true;
    }

    // Retry metals alone after 6s in case gold-api was slow on first load
    setTimeout(async () => {
      try {
        const metals = await fetchMetalPrices();
        this._applyUpdates(metals);
      } catch {
        // ignore
      }
    }, 6000);
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
    // Always anchor the last candle to the current real price of the instrument
    const currentPrice = this.prices[symbol] || FALLBACK_PRICES[symbol] || 100;
    const vol = (VOLATILITY[symbol] || 0.001) * 5;
    const resMinutes = { '1': 1, '5': 5, '15': 15, '60': 60, 'D': 1440 };
    const minutes = resMinutes[resolution] || 1;
    const now = Date.now();

    // Generate candles backwards from currentPrice so the last close == currentPrice
    // We walk backwards: start at currentPrice and reverse-simulate
    const rawPrices = [currentPrice];
    for (let i = 0; i < count; i++) {
      const prev = rawPrices[rawPrices.length - 1];
      // Reverse step: undo a random drift to get the "older" price
      const drift = prev * vol * (Math.random() - 0.45);
      rawPrices.push(prev - drift);
    }
    rawPrices.reverse(); // oldest first, newest last (== currentPrice)

    const candles = [];
    for (let i = 0; i <= count; i++) {
      const timestamp = now - (count - i) * minutes * 60 * 1000;
      const close = rawPrices[i];
      const open = i === 0 ? close : rawPrices[i - 1];
      const high = Math.max(open, close) + Math.abs(close * vol * Math.random());
      const low  = Math.min(open, close) - Math.abs(close * vol * Math.random());
      const volume = Math.floor(1000000 + Math.random() * 5000000);
      candles.push({
        time: Math.floor(timestamp / 1000),
        open:  roundPrice(symbol, open),
        high:  roundPrice(symbol, high),
        low:   roundPrice(symbol, low),
        close: roundPrice(symbol, close),
        volume,
      });
    }

    // Do NOT overwrite this.prices[symbol] — keep the real fetched price intact
    return candles;
  }

  destroy() {
    this.intervals.forEach((id) => clearTimeout(id));
    this.intervals.clear();
    this.listeners.clear();
    if (this._reseedInterval) clearInterval(this._reseedInterval);
  }
}

const priceEngine = new PriceEngine();
export default priceEngine;
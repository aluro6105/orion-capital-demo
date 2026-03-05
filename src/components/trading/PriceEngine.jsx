// Simulated price engine - generates realistic price movements
// Since Finnhub WebSocket requires a backend proxy (not available on this plan),
// we simulate real-time prices with random walk for the paper trading experience.

const BASE_PRICES = {
  AAPL: 178.50, MSFT: 415.20, NVDA: 875.30, TSLA: 245.60, AMZN: 178.90,
  SPY: 502.40, QQQ: 432.10, IWM: 198.70,
  EURUSD: 1.0850, GBPUSD: 1.2640, USDJPY: 150.25,
  BTCUSD: 62450.00, ETHUSD: 3420.00,
};

const VOLATILITY = {
  AAPL: 0.0008, MSFT: 0.0007, NVDA: 0.0015, TSLA: 0.0018, AMZN: 0.0009,
  SPY: 0.0004, QQQ: 0.0005, IWM: 0.0006,
  EURUSD: 0.0002, GBPUSD: 0.0003, USDJPY: 0.0003,
  BTCUSD: 0.002, ETHUSD: 0.0025,
};

class PriceEngine {
  constructor() {
    this.prices = { ...BASE_PRICES };
    this.listeners = new Map();
    this.intervals = new Map();
    this.candles = new Map();
    this.previousClose = { ...BASE_PRICES };
  }

  getPrice(symbol) {
    return this.prices[symbol] || BASE_PRICES[symbol] || 100;
  }

  getChange(symbol) {
    const current = this.prices[symbol] || BASE_PRICES[symbol];
    const prev = this.previousClose[symbol] || BASE_PRICES[symbol];
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

    // Immediately emit current price
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
    const basePrice = this.prices[symbol] || BASE_PRICES[symbol] || 100;
    
    // Set previous close with slight offset
    this.previousClose[symbol] = basePrice * (1 + (Math.random() - 0.5) * 0.01);

    const tick = () => {
      const current = this.prices[symbol] || basePrice;
      const change = current * vol * (Math.random() - 0.48); // slight upward bias
      const newPrice = Math.max(current + change, current * 0.8);
      
      // Round appropriately
      if (symbol.includes('USD') && !symbol.includes('BTC') && !symbol.includes('ETH')) {
        this.prices[symbol] = Math.round(newPrice * 10000) / 10000;
      } else if (symbol.includes('BTC')) {
        this.prices[symbol] = Math.round(newPrice * 100) / 100;
      } else {
        this.prices[symbol] = Math.round(newPrice * 100) / 100;
      }

      const data = {
        symbol,
        price: this.prices[symbol],
        timestamp: Date.now(),
        ...this.getChange(symbol),
      };

      const subs = this.listeners.get(symbol);
      if (subs) {
        subs.forEach(cb => cb(data));
      }
    };

    // Tick every 500-1500ms randomly
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
    const basePrice = BASE_PRICES[symbol] || 100;
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
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume,
      });
      price = close;
    }

    // Set current price to last candle close
    this.prices[symbol] = candles[candles.length - 1].close;
    return candles;
  }

  destroy() {
    this.intervals.forEach((id) => clearTimeout(id));
    this.intervals.clear();
    this.listeners.clear();
  }
}

// Singleton
const priceEngine = new PriceEngine();
export default priceEngine;
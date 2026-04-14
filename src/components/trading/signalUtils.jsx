// ── Technical indicator calculations ─────────────────────────────────────────

export function calcSMA(data, period) {
  if (data.length < period) return null;
  return data.slice(-period).reduce((s, v) => s + v, 0) / period;
}

export function calcEMA(data, period) {
  if (data.length < period) return null;
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((s, v) => s + v, 0) / period;
  for (let i = period; i < data.length; i++) ema = data[i] * k + ema * (1 - k);
  return ema;
}

export function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  const avgG = gains / period, avgL = losses / period;
  return avgL === 0 ? 100 : 100 - (100 / (1 + avgG / avgL));
}

export function calcMACD(closes) {
  if (closes.length < 26) return null;
  const ema12 = calcEMA(closes, 12);
  const ema26 = calcEMA(closes, 26);
  if (ema12 === null || ema26 === null) return null;
  const macdLine = ema12 - ema26;
  // Signal: EMA9 of macd values (simplified: use last 9 macd differences)
  const macdValues = [];
  for (let i = 26; i <= closes.length; i++) {
    const e12 = calcEMA(closes.slice(0, i), 12);
    const e26 = calcEMA(closes.slice(0, i), 26);
    if (e12 && e26) macdValues.push(e12 - e26);
  }
  const signal = macdValues.length >= 9 ? calcEMA(macdValues, 9) : null;
  return { macd: macdLine, signal, histogram: signal !== null ? macdLine - signal : null };
}

export function calcBollinger(closes, period = 20) {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  const sma = slice.reduce((s, v) => s + v, 0) / period;
  const variance = slice.reduce((s, v) => s + Math.pow(v - sma, 2), 0) / period;
  const stdDev = Math.sqrt(variance);
  return { upper: sma + 2 * stdDev, middle: sma, lower: sma - 2 * stdDev, stdDev };
}

export function calcATR(candles, period = 14) {
  if (candles.length < period + 1) return null;
  const trs = candles.slice(-period - 1).map((c, i, arr) => {
    if (i === 0) return c.high - c.low;
    const prevClose = arr[i - 1].close;
    return Math.max(c.high - c.low, Math.abs(c.high - prevClose), Math.abs(c.low - prevClose));
  });
  return trs.slice(1).reduce((s, v) => s + v, 0) / period;
}

export function calcStochastic(candles, kPeriod = 14) {
  if (candles.length < kPeriod) return null;
  const slice = candles.slice(-kPeriod);
  const highestHigh = Math.max(...slice.map(c => c.high));
  const lowestLow = Math.min(...slice.map(c => c.low));
  const currentClose = candles[candles.length - 1].close;
  if (highestHigh === lowestLow) return null;
  return ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
}

// ── Generate fake-but-seeded candles for demo mode ───────────────────────────
export function buildFakeCandles(symbol, basePrice, volatility = 0.012, count = 60) {
  const seed = symbol.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const vol = volatility;
  const candles = [];
  let p = basePrice * (1 - vol * 10);
  for (let i = 0; i < count; i++) {
    const noise = Math.sin(seed * 0.3 + i * 0.7) * vol * p;
    const open = p;
    const close = Math.max(p + noise, p * 0.8);
    const high = Math.max(open, close) * (1 + Math.abs(Math.sin(seed + i)) * vol * 0.5);
    const low  = Math.min(open, close) * (1 - Math.abs(Math.cos(seed + i)) * vol * 0.5);
    candles.push({ open, high, low, close });
    p = close;
  }
  // Last close is the current live price
  candles[candles.length - 1].close = basePrice;
  return candles;
}

// ── DEMO signal generator (basic) ────────────────────────────────────────────
export function generateDemoSignal(symbol, price, vol = 0.012) {
  const candles = buildFakeCandles(symbol, price, vol);
  const closes  = candles.map(c => c.close);

  const ema9  = calcEMA(closes, 9);
  const ema21 = calcEMA(closes, 21);
  const rsi   = calcRSI(closes, 14);
  const sma20 = calcSMA(closes, 20);

  let score = 0;
  const reasons = [];

  if (ema9 && ema21) {
    if (ema9 > ema21) { score += 2; reasons.push('EMA9 > EMA21 — cruce alcista'); }
    else               { score -= 2; reasons.push('EMA9 < EMA21 — cruce bajista'); }
  }
  if (rsi !== null) {
    if (rsi < 35)      { score += 2; reasons.push(`RSI ${rsi.toFixed(0)} — sobrevendido`); }
    else if (rsi > 65) { score -= 2; reasons.push(`RSI ${rsi.toFixed(0)} — sobrecomprado`); }
    else               { score += rsi > 50 ? 1 : -1; reasons.push(`RSI ${rsi.toFixed(0)} — zona neutra`); }
  }
  if (sma20) {
    if (price > sma20) { score += 1; reasons.push('Precio por encima de SMA20'); }
    else               { score -= 1; reasons.push('Precio por debajo de SMA20'); }
  }

  // Add time-based momentum variation
  const seed = symbol.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  score += Math.sin(seed * 0.11 + Date.now() / 1e7) * 1.5;

  return buildSignalResult(score, reasons, price, false);
}

// ── PRO signal generator (real data candles) ─────────────────────────────────
export function generateProSignal(symbol, price, realCandles) {
  const candles = realCandles && realCandles.length >= 30
    ? realCandles
    : buildFakeCandles(symbol, price, 0.012, 80);

  const closes = candles.map(c => c.close);

  const ema9   = calcEMA(closes, 9);
  const ema21  = calcEMA(closes, 21);
  const ema50  = calcEMA(closes, 50);
  const rsi    = calcRSI(closes, 14);
  const sma20  = calcSMA(closes, 20);
  const sma50  = calcSMA(closes, 50);
  const macd   = calcMACD(closes);
  const bb     = calcBollinger(closes, 20);
  const atr    = calcATR(candles, 14);
  const stoch  = calcStochastic(candles, 14);

  let score = 0;
  const reasons = [];

  // EMA cross (weight: 2)
  if (ema9 && ema21) {
    if (ema9 > ema21) { score += 2; reasons.push('EMA9 > EMA21 — tendencia alcista'); }
    else              { score -= 2; reasons.push('EMA9 < EMA21 — tendencia bajista'); }
  }
  // EMA 50 trend filter (weight: 1.5)
  if (ema50) {
    if (price > ema50) { score += 1.5; reasons.push('Precio > EMA50 — impulso positivo'); }
    else               { score -= 1.5; reasons.push('Precio < EMA50 — impulso negativo'); }
  }
  // RSI (weight: 2)
  if (rsi !== null) {
    if (rsi < 30)      { score += 3; reasons.push(`RSI ${rsi.toFixed(1)} — sobreventa extrema`); }
    else if (rsi < 40) { score += 2; reasons.push(`RSI ${rsi.toFixed(1)} — sobrevendido`); }
    else if (rsi > 70) { score -= 3; reasons.push(`RSI ${rsi.toFixed(1)} — sobrecompra extrema`); }
    else if (rsi > 60) { score -= 2; reasons.push(`RSI ${rsi.toFixed(1)} — sobrecomprado`); }
    else               { score += rsi > 50 ? 0.5 : -0.5; reasons.push(`RSI ${rsi.toFixed(1)} — neutro`); }
  }
  // MACD (weight: 2)
  if (macd && macd.histogram !== null) {
    if (macd.histogram > 0 && macd.macd > 0) { score += 2; reasons.push(`MACD +${macd.histogram.toFixed(4)} — señal alcista`); }
    else if (macd.histogram > 0)              { score += 1; reasons.push(`MACD cruce al alza`); }
    else if (macd.histogram < 0 && macd.macd < 0) { score -= 2; reasons.push(`MACD ${macd.histogram.toFixed(4)} — señal bajista`); }
    else                                      { score -= 1; reasons.push(`MACD cruce a la baja`); }
  }
  // Bollinger Bands (weight: 1.5)
  if (bb) {
    if (price < bb.lower)  { score += 1.5; reasons.push('Precio bajo banda Bollinger inferior'); }
    else if (price > bb.upper) { score -= 1.5; reasons.push('Precio sobre banda Bollinger superior'); }
    else { reasons.push(`Bollinger: precio en banda media (ancho ${((bb.upper - bb.lower) / bb.middle * 100).toFixed(1)}%)`); }
  }
  // SMA cross (weight: 1)
  if (sma20 && sma50) {
    if (sma20 > sma50) { score += 1; reasons.push('SMA20 > SMA50 — golden cross'); }
    else               { score -= 1; reasons.push('SMA20 < SMA50 — death cross'); }
  }
  // Stochastic (weight: 1)
  if (stoch !== null) {
    if (stoch < 20)    { score += 1; reasons.push(`Estocástico ${stoch.toFixed(0)} — sobreventa`); }
    else if (stoch > 80) { score -= 1; reasons.push(`Estocástico ${stoch.toFixed(0)} — sobrecompra`); }
    else { reasons.push(`Estocástico ${stoch.toFixed(0)} — zona media`); }
  }

  const extras = { atr, bb, macd, stoch };
  return buildSignalResult(score, reasons, price, true, extras);
}

function buildSignalResult(score, reasons, price, isPro, extras = {}) {
  let direction, confidence;
  const absScore = Math.abs(score);
  const maxScore = isPro ? 15 : 8;

  confidence = Math.min(Math.round((absScore / maxScore) * 100), 95);

  if (score >= (isPro ? 4 : 3)) direction = 'buy';
  else if (score <= -(isPro ? 4 : 3)) direction = 'sell';
  else direction = 'neutral';

  // TP/SL based on ATR if available, otherwise % based
  const atr = extras.atr || price * 0.012;
  const tpMultiplier = isPro ? 2.0 : 1.5;
  const slMultiplier = isPro ? 1.0 : 0.8;

  const tp = direction === 'buy'
    ? price + atr * tpMultiplier
    : direction === 'sell'
    ? price - atr * tpMultiplier
    : null;
  const sl = direction === 'buy'
    ? price - atr * slMultiplier
    : direction === 'sell'
    ? price + atr * slMultiplier
    : null;

  const rrr = tp && sl ? Math.abs(tp - price) / Math.abs(sl - price) : null;

  return { direction, confidence, score: score.toFixed(1), reasons, tp, sl, rrr, ...extras };
}
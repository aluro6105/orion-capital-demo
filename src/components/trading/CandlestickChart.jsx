import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

const COLORS = {
  bg: '#131722',
  grid: '#1e222d',
  text: '#787b86',
  textLight: '#d1d4dc',
  up: '#26a69a',
  down: '#ef5350',
  crosshair: '#758696',
  volumeUp: 'rgba(38,166,154,0.3)',
  volumeDown: 'rgba(239,83,80,0.3)',
  sma20: '#2196F3',
  sma50: '#FF9800',
  ema9: '#E91E63',
  ema21: '#9C27B0',
  ema50: '#FF5722',
  line: '#2196F3',
  fib: 'rgba(255,214,0,0.5)',
  rsiLine: '#00BCD4',
  rsiOB: 'rgba(239,83,80,0.3)',
  rsiOS: 'rgba(38,166,154,0.3)',
};

function calculateSMA(candles, period) {
  const result = [];
  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) { result.push(null); continue; }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) sum += candles[j].close;
    result.push(sum / period);
  }
  return result;
}

function calculateEMA(candles, period) {
  const result = new Array(candles.length).fill(null);
  if (candles.length < period) return result;
  const k = 2 / (period + 1);
  let sum = 0;
  for (let i = 0; i < period; i++) sum += candles[i].close;
  result[period - 1] = sum / period;
  for (let i = period; i < candles.length; i++) {
    result[i] = candles[i].close * k + result[i - 1] * (1 - k);
  }
  return result;
}

function calculateRSI(candles, period = 14) {
  const result = new Array(candles.length).fill(null);
  if (candles.length < period + 1) return result;
  let gains = 0, losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  result[period] = 100 - (100 / (1 + (avgLoss === 0 ? Infinity : avgGain / avgLoss)));
  for (let i = period + 1; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    result[i] = 100 - (100 / (1 + (avgLoss === 0 ? 100 : avgGain / avgLoss)));
  }
  return result;
}

function calculateFibonacci(candles, lookback = 50) {
  const recent = candles.slice(-lookback);
  if (recent.length === 0) return null;
  const high = Math.max(...recent.map(c => c.high));
  const low = Math.min(...recent.map(c => c.low));
  const diff = high - low;
  return {
    high, low,
    levels: [
      { pct: 0, price: high, label: '0%' },
      { pct: 0.236, price: high - diff * 0.236, label: '23.6%' },
      { pct: 0.382, price: high - diff * 0.382, label: '38.2%' },
      { pct: 0.5, price: high - diff * 0.5, label: '50%' },
      { pct: 0.618, price: high - diff * 0.618, label: '61.8%' },
      { pct: 0.786, price: high - diff * 0.786, label: '78.6%' },
      { pct: 1, price: low, label: '100%' },
    ],
  };
}

export default function CandlestickChart({ candles, chartType = 'candles', indicators = [], currentPrice, symbol }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [offset, setOffset] = useState(0);
  const [visibleCount, setVisibleCount] = useState(80);
  const [crosshair, setCrosshair] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width: Math.floor(width), height: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const showRSI = indicators.includes('RSI');
  const sma20 = useMemo(() => indicators.includes('SMA20') ? calculateSMA(candles, 20) : [], [candles, indicators]);
  const sma50 = useMemo(() => indicators.includes('SMA50') ? calculateSMA(candles, 50) : [], [candles, indicators]);
  const ema9  = useMemo(() => indicators.includes('EMA9')  ? calculateEMA(candles, 9)  : [], [candles, indicators]);
  const ema21 = useMemo(() => indicators.includes('EMA21') ? calculateEMA(candles, 21) : [], [candles, indicators]);
  const ema50 = useMemo(() => indicators.includes('EMA50') ? calculateEMA(candles, 50) : [], [candles, indicators]);
  const rsi   = useMemo(() => showRSI ? calculateRSI(candles, 14) : [], [candles, indicators]);
  const fibData = useMemo(() => indicators.includes('FIB') ? calculateFibonacci(candles) : null, [candles, indicators]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = dimensions;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 20, right: 80, bottom: 40, left: 10 };
    const chartW = width - padding.left - padding.right;
    const volumeH = height * 0.12;
    const rsiH = showRSI ? height * 0.18 : 0;
    const chartH = height - padding.top - padding.bottom - volumeH - rsiH;

    // Visible candles
    const startIdx = Math.max(0, candles.length - visibleCount - offset);
    const endIdx = Math.min(candles.length, startIdx + visibleCount);
    const visible = candles.slice(startIdx, endIdx);
    if (visible.length === 0) return;

    const candleW = chartW / visibleCount;
    const bodyW = Math.max(1, candleW * 0.6);

    // Price range
    let minP = Infinity, maxP = -Infinity, maxVol = 0;
    visible.forEach(c => {
      minP = Math.min(minP, c.low);
      maxP = Math.max(maxP, c.high);
      maxVol = Math.max(maxVol, c.volume || 0);
    });
    const priceRange = maxP - minP || 1;
    const pPadding = priceRange * 0.05;
    minP -= pPadding; maxP += pPadding;
    const totalRange = maxP - minP;

    const priceToY = (p) => padding.top + chartH * (1 - (p - minP) / totalRange);
    const volToY = (v) => {
      const volTop = padding.top + chartH + (showRSI ? rsiH : 0);
      return volTop + volumeH * (1 - v / (maxVol || 1));
    };

    // Background
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.5;
    const gridLines = 6;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke();
      const price = maxP - (totalRange / gridLines) * i;
      ctx.fillStyle = COLORS.text;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(formatPrice(price, symbol), width - padding.right + 8, y + 4);
    }

    // Volume bars
    const volAreaTop = padding.top + chartH + (showRSI ? rsiH : 0);
    visible.forEach((c, i) => {
      const x = padding.left + i * candleW + candleW / 2;
      const barH = ((c.volume || 0) / (maxVol || 1)) * volumeH;
      ctx.fillStyle = c.close >= c.open ? COLORS.volumeUp : COLORS.volumeDown;
      ctx.fillRect(x - bodyW / 2, volAreaTop + volumeH - barH, bodyW, barH);
    });

    if (chartType === 'line') {
      // Line chart
      ctx.beginPath();
      ctx.strokeStyle = COLORS.line;
      ctx.lineWidth = 2;
      visible.forEach((c, i) => {
        const x = padding.left + i * candleW + candleW / 2;
        const y = priceToY(c.close);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Fill area
      const lastX = padding.left + (visible.length - 1) * candleW + candleW / 2;
      ctx.lineTo(lastX, priceToY(minP));
      ctx.lineTo(padding.left + candleW / 2, priceToY(minP));
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      grad.addColorStop(0, 'rgba(33,150,243,0.15)');
      grad.addColorStop(1, 'rgba(33,150,243,0.01)');
      ctx.fillStyle = grad;
      ctx.fill();
    } else {
      // Candlesticks
      visible.forEach((c, i) => {
        const x = padding.left + i * candleW + candleW / 2;
        const isUp = c.close >= c.open;
        const color = isUp ? COLORS.up : COLORS.down;

        // Wick
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, priceToY(c.high));
        ctx.lineTo(x, priceToY(c.low));
        ctx.stroke();

        // Body
        const bodyTop = priceToY(Math.max(c.open, c.close));
        const bodyBot = priceToY(Math.min(c.open, c.close));
        const bodyH = Math.max(1, bodyBot - bodyTop);
        ctx.fillStyle = color;
        ctx.fillRect(x - bodyW / 2, bodyTop, bodyW, bodyH);
      });
    }

    // Overlay line helper
    const drawOverlay = (data, color, lineWidth = 1.5) => {
      if (!data.length) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      let started = false;
      for (let i = startIdx; i < endIdx; i++) {
        if (data[i] === null || data[i] === undefined) continue;
        const x = padding.left + (i - startIdx) * candleW + candleW / 2;
        const y = priceToY(data[i]);
        if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    };
    if (sma20.length) drawOverlay(sma20, COLORS.sma20);
    if (sma50.length) drawOverlay(sma50, COLORS.sma50);
    if (ema9.length)  drawOverlay(ema9,  COLORS.ema9);
    if (ema21.length) drawOverlay(ema21, COLORS.ema21);
    if (ema50.length) drawOverlay(ema50, COLORS.ema50);

    // Fibonacci retracements
    if (fibData) {
      fibData.levels.forEach(lvl => {
        const y = priceToY(lvl.price);
        if (y < padding.top || y > padding.top + chartH) return;
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = COLORS.fib;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255,214,0,0.8)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`Fib ${lvl.label}  ${formatPrice(lvl.price, symbol)}`, width - padding.right - 2, y - 2);
      });
    }

    // RSI panel
    if (showRSI && rsi.length) {
      const rsiTop = padding.top + chartH;
      const rsiBottom = rsiTop + rsiH;
      // RSI background
      ctx.fillStyle = '#0d1017';
      ctx.fillRect(padding.left, rsiTop, chartW, rsiH);
      // Separator line
      ctx.strokeStyle = COLORS.grid;
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(padding.left, rsiTop); ctx.lineTo(width - padding.right, rsiTop); ctx.stroke();
      // OB/OS zones
      const rsiToY = (v) => rsiTop + rsiH * (1 - (v - 0) / 100);
      const ob70Y = rsiToY(70), os30Y = rsiToY(30);
      ctx.fillStyle = COLORS.rsiOB; ctx.fillRect(padding.left, rsiTop, chartW, ob70Y - rsiTop);
      ctx.fillStyle = COLORS.rsiOS; ctx.fillRect(padding.left, os30Y, chartW, rsiBottom - os30Y);
      // 70 / 50 / 30 lines
      [70, 50, 30].forEach(v => {
        const y = rsiToY(v);
        ctx.strokeStyle = '#2a2e39'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke();
        ctx.fillStyle = COLORS.text; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'left';
        ctx.fillText(String(v), width - padding.right + 4, y + 3);
      });
      // RSI line
      ctx.beginPath(); ctx.strokeStyle = COLORS.rsiLine; ctx.lineWidth = 1.5;
      let rsStarted = false;
      for (let i = startIdx; i < endIdx; i++) {
        if (rsi[i] === null) continue;
        const x = padding.left + (i - startIdx) * candleW + candleW / 2;
        const y = rsiToY(rsi[i]);
        if (!rsStarted) { ctx.moveTo(x, y); rsStarted = true; } else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
      // RSI label
      ctx.fillStyle = COLORS.rsiLine; ctx.font = 'bold 10px Inter, sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('RSI(14)', padding.left + 6, rsiTop + 12);
      // Current RSI value
      const lastRsi = rsi[endIdx - 1];
      if (lastRsi !== null && lastRsi !== undefined) {
        const rsiColor = lastRsi >= 70 ? COLORS.down : lastRsi <= 30 ? COLORS.up : COLORS.rsiLine;
        ctx.fillStyle = rsiColor; ctx.font = 'bold 11px Inter, sans-serif';
        ctx.fillText(lastRsi.toFixed(1), padding.left + 55, rsiTop + 12);
      }
    }

    // Current price line
    if (currentPrice) {
      const y = priceToY(currentPrice);
      const isUp = visible.length > 0 ? currentPrice >= visible[visible.length - 1].open : true;
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = isUp ? COLORS.up : COLORS.down;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke();
      ctx.setLineDash([]);
      // Price label
      ctx.fillStyle = isUp ? COLORS.up : COLORS.down;
      ctx.fillRect(width - padding.right, y - 10, padding.right, 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(formatPrice(currentPrice, symbol), width - padding.right + 8, y + 4);
    }

    // Crosshair
    if (crosshair) {
      const { x: mx, y: my } = crosshair;
      if (mx > padding.left && mx < width - padding.right && my > padding.top && my < padding.top + chartH) {
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = COLORS.crosshair;
        ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(mx, padding.top); ctx.lineTo(mx, height - padding.bottom); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(padding.left, my); ctx.lineTo(width - padding.right, my); ctx.stroke();
        ctx.setLineDash([]);

        // Price at crosshair
        const price = maxP - ((my - padding.top) / chartH) * totalRange;
        ctx.fillStyle = '#363a45';
        ctx.fillRect(width - padding.right, my - 10, padding.right, 20);
        ctx.fillStyle = COLORS.textLight;
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(formatPrice(price, symbol), width - padding.right + 8, my + 4);

        // Candle info
        const candleIdx = Math.floor((mx - padding.left) / candleW);
        if (candleIdx >= 0 && candleIdx < visible.length) {
          const c = visible[candleIdx];
          const infoText = `O: ${formatPrice(c.open, symbol)}  H: ${formatPrice(c.high, symbol)}  L: ${formatPrice(c.low, symbol)}  C: ${formatPrice(c.close, symbol)}`;
          ctx.fillStyle = COLORS.textLight;
          ctx.font = '12px Inter, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(infoText, padding.left + 10, padding.top + 14);
        }
      }
    }

    // Time axis
    ctx.fillStyle = COLORS.text;
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    const step = Math.max(1, Math.floor(visible.length / 8));
    visible.forEach((c, i) => {
      if (i % step !== 0) return;
      const x = padding.left + i * candleW + candleW / 2;
      const d = new Date(c.time * 1000);
      const label = d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0');
      ctx.fillText(label, x, height - padding.bottom + 18);
    });

    // Indicator legend
    const legendItems = [];
    if (indicators.includes('SMA20')) legendItems.push({ label: 'SMA 20', color: COLORS.sma20 });
    if (indicators.includes('SMA50')) legendItems.push({ label: 'SMA 50', color: COLORS.sma50 });
    if (indicators.includes('EMA9'))  legendItems.push({ label: 'EMA 9',  color: COLORS.ema9 });
    if (indicators.includes('EMA21')) legendItems.push({ label: 'EMA 21', color: COLORS.ema21 });
    if (indicators.includes('EMA50')) legendItems.push({ label: 'EMA 50', color: COLORS.ema50 });
    if (indicators.includes('FIB'))   legendItems.push({ label: 'Fib', color: 'rgba(255,214,0,0.9)' });
    let legendX = padding.left + 10;
    const legendY = padding.top + 30;
    ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'left';
    legendItems.forEach(item => {
      ctx.fillStyle = item.color;
      ctx.fillText(item.label, legendX, legendY);
      legendX += ctx.measureText(item.label).width + 14;
    });
  }, [candles, dimensions, offset, visibleCount, crosshair, chartType, indicators, currentPrice,
      sma20, sma50, ema9, ema21, ema50, rsi, fibData, showRSI, symbol]);

  useEffect(() => { draw(); }, [draw]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (e.deltaY > 0) setVisibleCount(v => Math.min(200, v + 5));
    else setVisibleCount(v => Math.max(20, v - 5));
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCrosshair({ x, y });
    if (isDragging && dragStart.current !== null) {
      const dx = e.clientX - dragStart.current;
      if (Math.abs(dx) > 5) {
        const shift = dx > 0 ? 1 : -1;
        setOffset(o => Math.max(0, Math.min(candles.length - visibleCount, o + shift)));
        dragStart.current = e.clientX;
      }
    }
  }, [isDragging, candles.length, visibleCount]);

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    dragStart.current = e.clientX;
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCrosshair(null);
    setIsDragging(false);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: 300 }}>
      <canvas
        ref={canvasRef}
        style={{ width: dimensions.width, height: dimensions.height, cursor: 'crosshair' }}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}

function formatPrice(price, symbol) {
  if (!price && price !== 0) return '—';
  if (symbol && (symbol.includes('JPY') || symbol === 'USDJPY')) return price.toFixed(2);
  if (symbol && (symbol === 'EURUSD' || symbol === 'GBPUSD')) return price.toFixed(4);
  if (symbol && symbol.includes('BTC')) return price.toFixed(2);
  return price.toFixed(2);
}
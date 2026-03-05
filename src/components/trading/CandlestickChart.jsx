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
  line: '#2196F3',
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

  const sma20 = useMemo(() => indicators.includes('SMA20') ? calculateSMA(candles, 20) : [], [candles, indicators]);
  const sma50 = useMemo(() => indicators.includes('SMA50') ? calculateSMA(candles, 50) : [], [candles, indicators]);

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
    const volumeH = height * 0.15;
    const chartH = height - padding.top - padding.bottom - volumeH;

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
    const volToY = (v) => height - padding.bottom - (v / (maxVol || 1)) * volumeH;

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
    visible.forEach((c, i) => {
      const x = padding.left + i * candleW + candleW / 2;
      const vY = volToY(c.volume || 0);
      ctx.fillStyle = c.close >= c.open ? COLORS.volumeUp : COLORS.volumeDown;
      ctx.fillRect(x - bodyW / 2, vY, bodyW, height - padding.bottom - vY);
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

    // SMA lines
    const drawSMA = (smaData, color) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      let started = false;
      for (let i = startIdx; i < endIdx; i++) {
        if (smaData[i] === null || smaData[i] === undefined) continue;
        const x = padding.left + (i - startIdx) * candleW + candleW / 2;
        const y = priceToY(smaData[i]);
        if (!started) { ctx.moveTo(x, y); started = true; } else { ctx.lineTo(x, y); }
      }
      ctx.stroke();
    };
    if (sma20.length) drawSMA(sma20, COLORS.sma20);
    if (sma50.length) drawSMA(sma50, COLORS.sma50);

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
    let legendX = padding.left + 10;
    const legendY = padding.top + 30;
    if (indicators.includes('SMA20')) {
      ctx.fillStyle = COLORS.sma20;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('SMA 20', legendX, legendY);
      legendX += 60;
    }
    if (indicators.includes('SMA50')) {
      ctx.fillStyle = COLORS.sma50;
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('SMA 50', legendX, legendY);
    }
  }, [candles, dimensions, offset, visibleCount, crosshair, chartType, indicators, currentPrice, sma20, sma50, symbol]);

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
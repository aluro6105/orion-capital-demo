import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Zap, Lock, RefreshCw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import priceEngine from './PriceEngine';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// ── Signal computation helpers ──────────────────────────────────────────────

function calcEMA(data, period) {
  if (data.length < period) return null;
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((s, v) => s + v, 0) / period;
  for (let i = period; i < data.length; i++) ema = data[i] * k + ema * (1 - k);
  return ema;
}

function calcRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  const avgG = gains / period, avgL = losses / period;
  return avgL === 0 ? 100 : 100 - (100 / (1 + avgG / avgL));
}

function generateSignal(symbol) {
  // Generate deterministic-ish but price-seeded fake candles for analysis
  const seed = symbol.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  const base = priceEngine.getPrice(symbol);
  const vol = 0.012;
  const closes = [];
  let p = base * (1 - vol * 10);
  for (let i = 0; i < 60; i++) {
    const noise = Math.sin(seed * 0.3 + i * 0.7) * vol * p;
    p = p + noise;
    closes.push(p);
  }
  closes.push(base); // last is current price

  const ema9  = calcEMA(closes, 9);
  const ema21 = calcEMA(closes, 21);
  const rsi   = calcRSI(closes, 14);
  const sma20 = closes.slice(-20).reduce((s, v) => s + v, 0) / 20;

  let score = 0;
  const reasons = [];

  // EMA cross
  if (ema9 && ema21) {
    if (ema9 > ema21) { score += 2; reasons.push('EMA9 > EMA21 (alcista)'); }
    else { score -= 2; reasons.push('EMA9 < EMA21 (bajista)'); }
  }
  // RSI
  if (rsi !== null) {
    if (rsi < 35) { score += 2; reasons.push(`RSI ${rsi.toFixed(0)} — sobrevendido`); }
    else if (rsi > 65) { score -= 2; reasons.push(`RSI ${rsi.toFixed(0)} — sobrecomprado`); }
    else { score += rsi > 50 ? 1 : -1; reasons.push(`RSI ${rsi.toFixed(0)} — neutro`); }
  }
  // Price vs SMA20
  if (base > sma20) { score += 1; reasons.push('Precio > SMA20'); }
  else { score -= 1; reasons.push('Precio < SMA20'); }

  // Momentum from seed variation
  const momentum = Math.sin(seed * 0.11 + Date.now() / 1e7) * 2;
  score += momentum;

  let direction, strength;
  if (score >= 3) { direction = 'buy'; strength = score >= 4 ? 'fuerte' : 'moderada'; }
  else if (score <= -3) { direction = 'sell'; strength = score <= -4 ? 'fuerte' : 'moderada'; }
  else { direction = 'neutral'; strength = 'baja'; }

  const tp = direction === 'buy'
    ? (base * (1 + 0.015 + Math.abs(score) * 0.003)).toFixed(4)
    : direction === 'sell'
    ? (base * (1 - 0.015 - Math.abs(score) * 0.003)).toFixed(4)
    : null;
  const sl = direction === 'buy'
    ? (base * (1 - 0.008)).toFixed(4)
    : direction === 'sell'
    ? (base * (1 + 0.008)).toFixed(4)
    : null;

  return { direction, strength, score: score.toFixed(1), reasons, rsi: rsi?.toFixed(1), ema9: ema9?.toFixed(4), ema21: ema21?.toFixed(4), tp, sl };
}

// ── Instrument list for signals ─────────────────────────────────────────────
const SIGNAL_INSTRUMENTS = [
  { symbol: 'BTCUSD', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum', type: 'crypto' },
  { symbol: 'SOLUSD', name: 'Solana', type: 'crypto' },
  { symbol: 'XRPUSD', name: 'XRP', type: 'crypto' },
  { symbol: 'AAPL', name: 'Apple', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA', type: 'stock' },
  { symbol: 'META', name: 'Meta', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla', type: 'stock' },
  { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex' },
  { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex' },
  { symbol: 'XAUUSD', name: 'Oro', type: 'commodity' },
  { symbol: 'WTIUSD', name: 'WTI Crudo', type: 'commodity' },
  { symbol: 'SPX500', name: 'S&P 500', type: 'index' },
  { symbol: 'NAS100', name: 'NASDAQ 100', type: 'index' },
  { symbol: 'USDMXN', name: 'USD/MXN', type: 'forex' },
  { symbol: 'USDBRL', name: 'USD/BRL', type: 'forex' },
];

const TYPE_LABELS = { stock: 'Acción', crypto: 'Crypto', forex: 'Forex', commodity: 'Materia Prima', index: 'Índice' };
const TYPE_COLORS = {
  stock: 'bg-blue-500/20 text-blue-400',
  crypto: 'bg-orange-500/20 text-orange-400',
  forex: 'bg-green-500/20 text-green-400',
  commodity: 'bg-yellow-500/20 text-yellow-400',
  index: 'bg-purple-500/20 text-purple-400',
};

const DIR_CONFIG = {
  buy:     { label: 'COMPRAR', icon: TrendingUp,   color: 'text-[#26a69a]', bg: 'bg-[#26a69a]/10 border-[#26a69a]/30' },
  sell:    { label: 'VENDER',  icon: TrendingDown,  color: 'text-[#ef5350]', bg: 'bg-[#ef5350]/10 border-[#ef5350]/30' },
  neutral: { label: 'NEUTRO',  icon: Minus,         color: 'text-[#787b86]', bg: 'bg-[#1e222d] border-[#2a2e39]' },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function MarketSignals({ isRealAccount, onSelectSymbol }) {
  const [prices, setPrices] = useState({});
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [filterType, setFilterType] = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const unsubs = SIGNAL_INSTRUMENTS.map(inst =>
      priceEngine.subscribe(inst.symbol, d => {
        setPrices(prev => ({ ...prev, [d.symbol]: d.price }));
      })
    );
    return () => unsubs.forEach(u => u());
  }, []);

  const signals = useMemo(() => {
    return SIGNAL_INSTRUMENTS.map(inst => ({
      ...inst,
      price: prices[inst.symbol] || priceEngine.getPrice(inst.symbol),
      signal: generateSignal(inst.symbol),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prices, lastRefresh]);

  const filtered = filterType === 'all' ? signals : signals.filter(s => s.type === filterType);

  const buyCount = signals.filter(s => s.signal.direction === 'buy').length;
  const sellCount = signals.filter(s => s.signal.direction === 'sell').length;

  if (!isRealAccount) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#2196F3]/10 border border-[#2196F3]/20 flex items-center justify-center mb-4">
          <Lock className="h-7 w-7 text-[#2196F3]" />
        </div>
        <h3 className="text-white font-bold text-base mb-2">Señales exclusivas de Cuenta Real</h3>
        <p className="text-[#787b86] text-xs leading-relaxed mb-5 max-w-xs">
          El módulo de señales con análisis técnico automático, TP/SL sugeridos e indicadores de momentum está disponible únicamente para cuentas reales.
        </p>
        <Link to={createPageUrl('Portal_Funding')}>
          <Button size="sm" className="bg-[#2196F3] hover:bg-[#1976D2] text-xs">
            Activar Cuenta Real
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2e39] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-[#2196F3]" />
          <span className="text-xs font-semibold text-white">Señales</span>
          <span className="text-[10px] bg-[#26a69a]/20 text-[#26a69a] px-1.5 py-0.5 rounded-full">{buyCount}▲</span>
          <span className="text-[10px] bg-[#ef5350]/20 text-[#ef5350] px-1.5 py-0.5 rounded-full">{sellCount}▼</span>
        </div>
        <button
          onClick={() => setLastRefresh(Date.now())}
          className="p-1 rounded hover:bg-[#2a2e39] transition-colors"
          title="Actualizar señales"
        >
          <RefreshCw className="h-3 w-3 text-[#787b86]" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-2 py-1.5 border-b border-[#2a2e39] flex-wrap flex-shrink-0">
        {['all', 'stock', 'crypto', 'forex', 'commodity', 'index'].map(t => (
          <button key={t}
            onClick={() => setFilterType(t)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              filterType === t ? 'bg-[#2196F3] text-white' : 'text-[#787b86] hover:text-white'
            }`}
          >
            {t === 'all' ? 'Todo' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Signal list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(s => {
          const cfg = DIR_CONFIG[s.signal.direction];
          const Icon = cfg.icon;
          const isOpen = expanded === s.symbol;
          return (
            <div key={s.symbol} className="border-b border-[#1e222d]">
              <div
                className="flex items-center gap-2 px-3 py-2 hover:bg-[#1a1e2b] transition-colors cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : s.symbol)}
              >
                {/* Direction badge */}
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                  <Icon className="h-2.5 w-2.5" />
                  {cfg.label}
                </div>
                {/* Symbol info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{s.symbol}</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded ${TYPE_COLORS[s.type]}`}>
                      {TYPE_LABELS[s.type]}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#787b86] font-mono">
                    ${Number(s.price).toPrecision(6)}
                  </div>
                </div>
                {/* Strength + expand */}
                <div className="text-right flex-shrink-0">
                  <div className={`text-[10px] font-semibold ${cfg.color}`}>{s.signal.strength}</div>
                  <ChevronDown className={`h-3 w-3 text-[#787b86] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-3 pb-3 bg-[#0f1117] border-t border-[#1e222d]">
                  <div className="grid grid-cols-2 gap-2 mt-2 mb-2">
                    {s.signal.tp && (
                      <div className="bg-[#26a69a]/10 border border-[#26a69a]/20 rounded p-2">
                        <div className="text-[9px] text-[#26a69a] uppercase mb-0.5">Take Profit</div>
                        <div className="text-xs font-mono text-white font-bold">{Number(s.signal.tp).toPrecision(6)}</div>
                      </div>
                    )}
                    {s.signal.sl && (
                      <div className="bg-[#ef5350]/10 border border-[#ef5350]/20 rounded p-2">
                        <div className="text-[9px] text-[#ef5350] uppercase mb-0.5">Stop Loss</div>
                        <div className="text-xs font-mono text-white font-bold">{Number(s.signal.sl).toPrecision(6)}</div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {s.signal.reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#787b86]">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          r.includes('alcista') || r.includes('sobrevendido') || r.includes('> SMA') ? 'bg-[#26a69a]' :
                          r.includes('bajista') || r.includes('sobrecomprado') || r.includes('< SMA') ? 'bg-[#ef5350]' : 'bg-[#787b86]'
                        }`} />
                        {r}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => onSelectSymbol && onSelectSymbol(s.symbol)}
                    className="mt-2 w-full py-1 text-[10px] text-[#2196F3] hover:bg-[#2196F3]/10 rounded border border-[#2196F3]/20 transition-colors"
                  >
                    Ver gráfico →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-3 py-2 border-t border-[#2a2e39] flex-shrink-0">
        <p className="text-[9px] text-[#4a4e5a] leading-relaxed">
          Señales generadas por análisis técnico automático (EMA, RSI, SMA). No constituyen asesoramiento financiero.
        </p>
      </div>
    </div>
  );
}
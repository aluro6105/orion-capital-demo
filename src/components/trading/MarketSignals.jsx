import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Zap, RefreshCw,
  ChevronDown, Star, Wifi, WifiOff, Clock,
} from 'lucide-react';
import priceEngine from './PriceEngine';
import { generateDemoSignal, generateProSignal, buildFakeCandles } from './signalUtils';
import useRealPrices from '../../hooks/useRealPrices';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

// ── Instruments ──────────────────────────────────────────────────────────────

const DEMO_INSTRUMENTS = [
  { symbol: 'BTCUSD', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum', type: 'crypto' },
  { symbol: 'AAPL',   name: 'Apple',   type: 'stock'  },
  { symbol: 'NVDA',   name: 'NVIDIA',  type: 'stock'  },
  { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex'  },
  { symbol: 'XAUUSD', name: 'Oro',     type: 'commodity' },
  { symbol: 'SPX500', name: 'S&P 500', type: 'index'  },
  { symbol: 'SOLUSD', name: 'Solana',  type: 'crypto' },
];

const PRO_INSTRUMENTS = [
  // Crypto
  { symbol: 'BTCUSD',  name: 'Bitcoin',    type: 'crypto' },
  { symbol: 'ETHUSD',  name: 'Ethereum',   type: 'crypto' },
  { symbol: 'SOLUSD',  name: 'Solana',     type: 'crypto' },
  { symbol: 'XRPUSD',  name: 'XRP',        type: 'crypto' },
  { symbol: 'BNBUSD',  name: 'BNB',        type: 'crypto' },
  { symbol: 'ADAUSD',  name: 'Cardano',    type: 'crypto' },
  { symbol: 'AVAXUSD', name: 'Avalanche',  type: 'crypto' },
  { symbol: 'DOTUSD',  name: 'Polkadot',   type: 'crypto' },
  { symbol: 'LINKUSD', name: 'Chainlink',  type: 'crypto' },
  { symbol: 'NEARUSD', name: 'NEAR',       type: 'crypto' },
  // Stocks
  { symbol: 'AAPL',    name: 'Apple',      type: 'stock'  },
  { symbol: 'NVDA',    name: 'NVIDIA',     type: 'stock'  },
  { symbol: 'META',    name: 'Meta',       type: 'stock'  },
  { symbol: 'TSLA',    name: 'Tesla',      type: 'stock'  },
  { symbol: 'MSFT',    name: 'Microsoft',  type: 'stock'  },
  { symbol: 'GOOGL',   name: 'Alphabet',   type: 'stock'  },
  { symbol: 'AMZN',    name: 'Amazon',     type: 'stock'  },
  { symbol: 'COIN',    name: 'Coinbase',   type: 'stock'  },
  // Forex
  { symbol: 'EURUSD',  name: 'EUR/USD',    type: 'forex'  },
  { symbol: 'GBPUSD',  name: 'GBP/USD',    type: 'forex'  },
  { symbol: 'USDJPY',  name: 'USD/JPY',    type: 'forex'  },
  { symbol: 'USDMXN',  name: 'USD/MXN',    type: 'forex'  },
  { symbol: 'USDBRL',  name: 'USD/BRL',    type: 'forex'  },
  { symbol: 'AUDUSD',  name: 'AUD/USD',    type: 'forex'  },
  // Commodities
  { symbol: 'XAUUSD',  name: 'Oro',        type: 'commodity' },
  { symbol: 'XAGUSD',  name: 'Plata',      type: 'commodity' },
  { symbol: 'WTIUSD',  name: 'WTI Crudo',  type: 'commodity' },
  { symbol: 'NATGASUSD',name:'Gas Natural', type: 'commodity' },
  // Indices
  { symbol: 'SPX500',  name: 'S&P 500',    type: 'index'  },
  { symbol: 'NAS100',  name: 'NASDAQ 100', type: 'index'  },
  { symbol: 'GER40',   name: 'DAX 40',     type: 'index'  },
  { symbol: 'UK100',   name: 'FTSE 100',   type: 'index'  },
];

// ── UI helpers ───────────────────────────────────────────────────────────────

const TYPE_LABELS = { stock: 'Acción', crypto: 'Crypto', forex: 'Forex', commodity: 'Materia Prima', index: 'Índice', etf: 'ETF' };
const TYPE_COLORS = {
  stock: 'bg-blue-500/20 text-blue-400',
  crypto: 'bg-orange-500/20 text-orange-400',
  forex: 'bg-green-500/20 text-green-400',
  commodity: 'bg-yellow-500/20 text-yellow-400',
  index: 'bg-purple-500/20 text-purple-400',
  etf: 'bg-cyan-500/20 text-cyan-400',
};

const DIR_CONFIG = {
  buy:     { label: 'COMPRAR', icon: TrendingUp,  color: 'text-[#26a69a]', bg: 'bg-[#26a69a]/10 border-[#26a69a]/30' },
  sell:    { label: 'VENDER',  icon: TrendingDown, color: 'text-[#ef5350]', bg: 'bg-[#ef5350]/10 border-[#ef5350]/30' },
  neutral: { label: 'NEUTRO',  icon: Minus,        color: 'text-[#787b86]', bg: 'bg-[#1e222d] border-[#2a2e39]' },
};

function ConfidenceBar({ value, direction }) {
  const color = direction === 'buy' ? '#26a69a' : direction === 'sell' ? '#ef5350' : '#787b86';
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex-1 h-1 bg-[#1e222d] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[9px] font-mono" style={{ color }}>{value}%</span>
    </div>
  );
}

function formatPrice(price) {
  if (!price || isNaN(price)) return '—';
  if (price < 0.001) return price.toFixed(8);
  if (price < 1)     return price.toFixed(5);
  if (price > 10000) return price.toLocaleString('en-US', { maximumFractionDigits: 1 });
  if (price > 100)   return price.toFixed(2);
  return price.toFixed(4);
}

// ── Main component ───────────────────────────────────────────────────────────

export default function MarketSignals({ isRealAccount, onSelectSymbol }) {
  const [simPrices, setSimPrices] = useState({});
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [filterType, setFilterType] = useState('all');
  const [expanded, setExpanded] = useState(null);

  // Real prices hook — only active for REAL accounts
  const { prices: realPrices, loading: realLoading, lastUpdated, refresh } = useRealPrices(isRealAccount);

  const instruments = isRealAccount ? PRO_INSTRUMENTS : DEMO_INSTRUMENTS;

  // Subscribe to PriceEngine for live sim prices
  useEffect(() => {
    const unsubs = instruments.map(inst =>
      priceEngine.subscribe(inst.symbol, d => {
        setSimPrices(prev => ({ ...prev, [d.symbol]: d.price }));
      })
    );
    return () => unsubs.forEach(u => u());
  }, [isRealAccount]);

  // Merge: prefer real price if available, fallback to sim
  const getPrice = useCallback((symbol) => {
    return realPrices[symbol] || simPrices[symbol] || priceEngine.getPrice(symbol);
  }, [realPrices, simPrices]);

  const signals = useMemo(() => {
    return instruments.map(inst => {
      const price = getPrice(inst.symbol);
      const signal = isRealAccount
        ? generateProSignal(inst.symbol, price)
        : generateDemoSignal(inst.symbol, price);
      return { ...inst, price, signal };
    });
  }, [simPrices, realPrices, lastRefresh, isRealAccount]);

  const filtered = filterType === 'all' ? signals : signals.filter(s => s.type === filterType);
  const buyCount  = signals.filter(s => s.signal.direction === 'buy').length;
  const sellCount = signals.filter(s => s.signal.direction === 'sell').length;

  const hasRealData = Object.keys(realPrices).length > 0;

  const handleRefresh = () => {
    setLastRefresh(Date.now());
    if (isRealAccount) refresh();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a2e39] flex-shrink-0">
        <div className="flex items-center gap-2">
          {isRealAccount
            ? <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
            : <Zap className="h-3.5 w-3.5 text-[#787b86]" />
          }
          <span className="text-xs font-semibold text-white">
            {isRealAccount ? 'Señales PRO' : 'Señales'}
          </span>
          <span className="text-[10px] bg-[#26a69a]/20 text-[#26a69a] px-1.5 py-0.5 rounded-full">{buyCount}▲</span>
          <span className="text-[10px] bg-[#ef5350]/20 text-[#ef5350] px-1.5 py-0.5 rounded-full">{sellCount}▼</span>
          {isRealAccount && (
            <span className={`flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full border ${
              hasRealData ? 'bg-[#26a69a]/10 border-[#26a69a]/20 text-[#26a69a]' : 'bg-[#787b86]/10 border-[#787b86]/20 text-[#787b86]'
            }`}>
              {hasRealData ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
              {hasRealData ? 'datos reales' : 'simulado'}
            </span>
          )}
        </div>
        <button onClick={handleRefresh} className="p-1 rounded hover:bg-[#2a2e39] transition-colors" title="Actualizar">
          <RefreshCw className={`h-3 w-3 text-[#787b86] ${realLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Demo notice */}
      {!isRealAccount && (
        <div className="mx-3 mt-2 mb-1 px-2 py-1.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 flex-shrink-0">
          <Zap className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] text-amber-300/80 leading-relaxed">
            Señales básicas. Activa tu <Link to={createPageUrl('Portal_Funding')} className="underline font-semibold">Cuenta Real</Link> para acceder a señales PRO con datos reales (CoinGecko, Frankfurter), MACD, Bollinger, ATR y ratio R:R.
          </p>
        </div>
      )}

      {/* Real data timestamp */}
      {isRealAccount && lastUpdated && (
        <div className="px-3 py-1 flex items-center gap-1 flex-shrink-0">
          <Clock className="h-2.5 w-2.5 text-[#4a4e5a]" />
          <span className="text-[9px] text-[#4a4e5a]">
            Actualizado {new Date(lastUpdated).toLocaleTimeString()} · Crypto: CoinGecko · Forex: Frankfurter
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 px-2 py-1.5 border-b border-[#2a2e39] flex-wrap flex-shrink-0">
        {['all', 'stock', 'crypto', 'forex', 'commodity', 'index'].map(t => (
          <button key={t} onClick={() => setFilterType(t)}
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
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-bold flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
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
                    {/* Real price indicator */}
                    {isRealAccount && realPrices[s.symbol] && (
                      <span className="text-[8px] bg-[#26a69a]/10 text-[#26a69a] px-1 rounded">REAL</span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#787b86] font-mono">${formatPrice(s.price)}</div>
                  {isRealAccount && (
                    <ConfidenceBar value={s.signal.confidence} direction={s.signal.direction} />
                  )}
                </div>

                {/* Confidence + expand */}
                <div className="text-right flex-shrink-0 flex flex-col items-end">
                  {isRealAccount ? (
                    <span className={`text-[10px] font-bold ${cfg.color}`}>{s.signal.confidence}%</span>
                  ) : (
                    <span className={`text-[10px] font-semibold ${cfg.color}`}>
                      {s.signal.confidence > 60 ? 'fuerte' : s.signal.confidence > 40 ? 'moderada' : 'baja'}
                    </span>
                  )}
                  <ChevronDown className={`h-3 w-3 text-[#787b86] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-3 pb-3 bg-[#0f1117] border-t border-[#1e222d]">
                  {/* TP / SL */}
                  {(s.signal.tp || s.signal.sl) && (
                    <div className="grid grid-cols-2 gap-2 mt-2 mb-2">
                      {s.signal.tp && (
                        <div className="bg-[#26a69a]/10 border border-[#26a69a]/20 rounded p-2">
                          <div className="text-[9px] text-[#26a69a] uppercase mb-0.5">Take Profit</div>
                          <div className="text-xs font-mono text-white font-bold">${formatPrice(s.signal.tp)}</div>
                          {isRealAccount && s.signal.rrr && (
                            <div className="text-[9px] text-[#26a69a] mt-0.5">R:R {s.signal.rrr.toFixed(2)}</div>
                          )}
                        </div>
                      )}
                      {s.signal.sl && (
                        <div className="bg-[#ef5350]/10 border border-[#ef5350]/20 rounded p-2">
                          <div className="text-[9px] text-[#ef5350] uppercase mb-0.5">Stop Loss</div>
                          <div className="text-xs font-mono text-white font-bold">${formatPrice(s.signal.sl)}</div>
                          {isRealAccount && s.signal.atr && (
                            <div className="text-[9px] text-[#ef5350] mt-0.5">ATR ${formatPrice(s.signal.atr)}</div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reasons */}
                  <div className="space-y-1 mt-1">
                    {s.signal.reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[10px] text-[#787b86]">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${
                          r.includes('alcista') || r.includes('sobrevent') || r.includes('encima') || r.includes('positiv') || r.includes('golden') || r.includes('+')
                            ? 'bg-[#26a69a]'
                            : r.includes('bajista') || r.includes('sobrecomp') || r.includes('debajo') || r.includes('negativ') || r.includes('death') || r.includes('superior')
                            ? 'bg-[#ef5350]'
                            : 'bg-[#787b86]'
                        }`} />
                        {r}
                      </div>
                    ))}
                  </div>

                  {/* Pro: extra metrics */}
                  {isRealAccount && s.signal.bb && (
                    <div className="mt-2 grid grid-cols-3 gap-1">
                      {[
                        { l: 'BB Upper', v: formatPrice(s.signal.bb.upper) },
                        { l: 'BB Mid',   v: formatPrice(s.signal.bb.middle) },
                        { l: 'BB Lower', v: formatPrice(s.signal.bb.lower) },
                      ].map(({ l, v }) => (
                        <div key={l} className="bg-[#1e222d] rounded p-1.5 text-center">
                          <div className="text-[8px] text-[#4a4e5a]">{l}</div>
                          <div className="text-[10px] font-mono text-[#d1d4dc]">{v}</div>
                        </div>
                      ))}
                    </div>
                  )}

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
          {isRealAccount
            ? 'Señales PRO: precios reales via CoinGecko & Frankfurter API. Análisis técnico multi-indicador (EMA, RSI, MACD, Bollinger, ATR, Estocástico). Solo informativo.'
            : 'Señales básicas con datos simulados. No constituyen asesoramiento financiero.'}
        </p>
      </div>
    </div>
  );
}
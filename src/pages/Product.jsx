import React from 'react';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { BarChart3, Wifi, BookOpen, LineChart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const FEATURES = [
  {
    icon: BarChart3, color: 'text-[#2196F3]', bg: 'bg-[#2196F3]/10',
    title: 'Gráfico TradingView-like',
    desc: 'Velas japonesas OHLC, volumen, SMA 20 y SMA 50. Múltiples timeframes (1m, 5m, 15m, 1h, 1D). Toggle candle/line.',
    features: ['Candlestick + Line chart', 'SMA20 y SMA50', 'Volumen bars', '5 timeframes'],
  },
  {
    icon: Wifi, color: 'text-[#26a69a]', bg: 'bg-[#26a69a]/10',
    title: 'Datos en tiempo real',
    desc: 'WebSocket streaming con reconexión automática. Actualizaciones tick a tick para reaccionar al mercado al instante.',
    features: ['WebSocket live prices', 'Auto-reconnect', 'Feed institucional', 'Subscribe por símbolo'],
  },
  {
    icon: LineChart, color: 'text-purple-400', bg: 'bg-purple-500/10',
    title: 'Motor de trading avanzado',
    desc: 'Órdenes de mercado, validación de balance, P&L en tiempo real. Posiciones, trades journal y performance metrics.',
    features: ['Market orders', 'Balance validation', 'P&L unrealizado', 'Trade journal'],
  },
  {
    icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10',
    title: 'Portfolio & Métricas',
    desc: 'Equity curve, win rate, drawdown, realized vs unrealized P&L. Export CSV del historial de operaciones.',
    features: ['Equity curve', 'Win rate', 'Drawdown', 'Export CSV'],
  },
];

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <PublicNav currentPage="Product" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#2196F3]/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block text-xs font-semibold text-[#2196F3] uppercase tracking-widest mb-4">Plataforma</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
            Un simulador que se siente <span className="text-[#2196F3]">real</span>
          </h1>
          <p className="text-lg text-white/50 leading-relaxed mb-8">
            Construido con la misma tecnología que usan los brokers institucionales. Sin simplificaciones. Sin atajos.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-3 bg-[#2196F3]/10 border border-[#2196F3]/20 rounded-xl">
            <p className="text-xs text-[#60bbff] text-left">
              Tecnología WebSocket de nivel institucional. Gráficos avanzados, ejecución de órdenes y análisis de portafolio en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}>
                <div className="flex-1">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${f.bg} mb-4`}>
                    <Icon className={`h-7 w-7 ${f.color}`} />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-3">{f.title}</h2>
                  <p className="text-white/50 leading-relaxed mb-4">{f.desc}</p>
                  <ul className="space-y-2">
                    {f.features.map(feat => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 className={`h-4 w-4 ${f.color} flex-shrink-0`} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 h-48 flex items-center justify-center">
                  <div className={`w-20 h-20 rounded-2xl ${f.bg} flex items-center justify-center`}>
                    <Icon className={`h-10 w-10 ${f.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instruments */}
      <section className="py-16 px-4 bg-[#070910]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Instrumentos disponibles</h2>
          <p className="text-white/50 mb-8">Practica con los mismos activos que operan los profesionales</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['AAPL','MSFT','NVDA','TSLA','AMZN','SPY','QQQ','IWM','EUR/USD','GBP/USD','USD/JPY','BTC/USD','ETH/USD','XAU/USD'].map(s => (
              <span key={s} className="px-4 py-2 bg-[#0f1117] border border-[#1e2130] rounded-lg text-sm font-mono text-white/70 hover:border-[#2196F3]/30 hover:text-white transition-all">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-black mb-4">Abre tu cuenta hoy</h2>
        <p className="text-white/50 mb-8">Cuenta demo con $10,000 activada en 30 segundos</p>
        <button onClick={() => window.location.href = '/login'}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-[#2196F3]/25">
          Abrir cuenta <ArrowRight className="h-5 w-5" />
        </button>
      </section>

      <PublicFooter />
    </div>
  );
}
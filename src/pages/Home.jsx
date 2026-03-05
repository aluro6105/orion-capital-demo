import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ArrowRight, TrendingUp, BarChart3, Shield, Zap,
  Star, ChevronDown, CheckCircle2, Users, Award, Globe, Play
} from 'lucide-react';

const TICKER_DATA = [
  { symbol: 'AAPL', price: '178.52', change: '+1.23%', up: true },
  { symbol: 'MSFT', price: '415.20', change: '+0.87%', up: true },
  { symbol: 'NVDA', price: '875.30', change: '+3.21%', up: true },
  { symbol: 'BTCUSD', price: '62,450', change: '-0.42%', up: false },
  { symbol: 'EURUSD', price: '1.0850', change: '+0.12%', up: true },
  { symbol: 'SPY', price: '502.40', change: '+0.65%', up: true },
  { symbol: 'TSLA', price: '245.60', change: '-1.18%', up: false },
  { symbol: 'ETHUSD', price: '3,420', change: '+2.05%', up: true },
  { symbol: 'AMZN', price: '191.80', change: '+1.54%', up: true },
  { symbol: 'GBPUSD', price: '1.2640', change: '-0.08%', up: false },
];

const TRUST_BADGES = [
  { label: 'Sin dinero real', icon: Shield },
  { label: '$100K virtuales', icon: TrendingUp },
  { label: 'Datos en tiempo real', icon: Zap },
  { label: '+5,000 traders', icon: Users },
];

const STATS = [
  { value: '$100K', label: 'Capital virtual de inicio' },
  { value: '15+', label: 'Instrumentos disponibles' },
  { value: '0€', label: 'Coste de la plataforma' },
  { value: '<1ms', label: 'Latencia WebSocket' },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Gráficos profesionales',
    desc: 'Velas japonesas, indicadores SMA, múltiples timeframes. Una interfaz idéntica a la de los brokers reales.',
    accent: '#2196F3',
    tag: 'TradingView-like',
  },
  {
    icon: Zap,
    title: 'Datos en tiempo real',
    desc: 'WebSocket con actualizaciones tick a tick. Precios en vivo para tomar decisiones como un profesional.',
    accent: '#26a69a',
    tag: 'WebSocket Live',
  },
  {
    icon: TrendingUp,
    title: 'P&L y métricas reales',
    desc: 'Equity curve, win rate, drawdown máximo, P&L realizado e irealizado. Análisis de nivel institucional.',
    accent: '#7C3AED',
    tag: 'Analytics Pro',
  },
  {
    icon: Shield,
    title: 'Cero riesgo, 100% aprendizaje',
    desc: '$100,000 virtuales para practicar, equivocarte y crecer. Sin miedo, sin pérdidas reales.',
    accent: '#f59e0b',
    tag: 'Paper Trading',
  },
];

const MARKETS = [
  { emoji: '📈', label: 'Acciones', symbols: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'], color: '#2196F3' },
  { emoji: '🏦', label: 'ETFs', symbols: ['SPY', 'QQQ', 'IWM'], color: '#7C3AED' },
  { emoji: '💱', label: 'Forex', symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY'], color: '#26a69a' },
  { emoji: '₿', label: 'Crypto', symbols: ['BTC/USD', 'ETH/USD'], color: '#f59e0b' },
];

const STEPS = [
  { n: '1', title: 'Crea tu cuenta', desc: 'Registro en 30 segundos. Sin tarjeta. $100,000 virtuales al instante.' },
  { n: '2', title: 'Analiza mercados', desc: 'Accede a acciones, ETFs, forex y crypto con precios WebSocket en vivo.' },
  { n: '3', title: 'Opera y mejora', desc: 'Compra, vende, analiza tu P&L y perfecciona tu estrategia sin riesgo.' },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
      ))}
    </div>
  );
}

// Fake candlestick bars for hero
const CANDLES = [
  {o:40,h:55,l:35,c:52,up:true},{o:52,h:60,l:48,c:48,up:false},{o:48,h:58,l:44,c:56,up:true},
  {o:56,h:65,l:52,c:61,up:true},{o:61,h:63,l:54,c:55,up:false},{o:55,h:72,l:53,c:70,up:true},
  {o:70,h:75,l:65,c:68,up:false},{o:68,h:80,l:65,c:78,up:true},{o:78,h:85,l:74,c:82,up:true},
  {o:82,h:84,l:70,c:72,up:false},{o:72,h:82,l:70,c:80,up:true},{o:80,h:92,l:78,c:90,up:true},
  {o:90,h:95,l:82,c:84,up:false},{o:84,h:96,l:82,c:94,up:true},{o:94,h:98,l:88,c:92,up:false},
  {o:92,h:100,l:90,c:99,up:true},{o:99,h:102,l:88,c:90,up:false},{o:90,h:98,l:88,c:96,up:true},
];

export default function HomePage() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials-home'],
    queryFn: () => base44.entities.Testimonial.filter({ approved: true }),
  });
  const { data: awards = [] } = useQuery({
    queryKey: ['awards-home'],
    queryFn: () => base44.entities.Award.filter({ is_active: true }),
  });
  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs-home'],
    queryFn: () => base44.entities.Faq.filter({ is_active: true }),
  });

  const [openFaq, setOpenFaq] = useState(null);

  const displayFaqs = faqs.length > 0 ? faqs.slice(0, 6) : [
    { id: 1, question: '¿Es gratis SimuTrade TV-Lite?', answer: 'Sí, completamente gratis. Sin tarjeta de crédito ni compromisos.' },
    { id: 2, question: '¿Los precios son reales?', answer: 'Usamos datos de mercado con alta fidelidad via WebSocket para una experiencia educativa auténtica.' },
    { id: 3, question: '¿Puedo perder dinero real?', answer: 'No. Todo el trading se realiza con dinero virtual ($100,000 de inicio).' },
    { id: 4, question: '¿Qué instrumentos están disponibles?', answer: 'Acciones, ETFs, Forex y Crypto. Más de 15 instrumentos en tiempo real.' },
  ];

  return (
    <div className="min-h-screen bg-[#060810] text-white overflow-x-hidden">
      <PublicNav currentPage="Home" />

      {/* ── TICKER ── */}
      <div className="fixed top-16 left-0 right-0 z-40 h-9 flex items-center overflow-hidden bg-[#080b14]/95 backdrop-blur-md border-b border-white/5">
        <div className="flex gap-10 animate-[ticker_40s_linear_infinite] whitespace-nowrap px-6">
          {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs">
              <span className="font-bold text-white/90 tracking-wide">{t.symbol}</span>
              <span className="font-mono text-white/50">{t.price}</span>
              <span className={`font-mono font-bold text-xs ${t.up ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>{t.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* BG radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(33,150,243,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_90%_80%,rgba(124,58,237,0.07),transparent)]" />
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(33,150,243,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(33,150,243,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="relative max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            {/* badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2196F3]/10 border border-[#2196F3]/25 text-xs text-[#60bbff] font-semibold mb-8 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#26a69a] animate-pulse" />
              LIVE · Paper Trading con WebSocket
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6">
              Opera como<br />
              <span className="relative">
                <span className="bg-gradient-to-r from-[#2196F3] via-[#60bbff] to-[#7C3AED] bg-clip-text text-transparent">
                  un profesional.
                </span>
              </span>
              <br />
              <span className="text-white/90">Sin riesgo real.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/45 leading-relaxed mb-10 max-w-lg">
              La plataforma de paper trading más completa. Gráficos TradingView, precios en tiempo real y métricas institucionales. <strong className="text-white/70">Gratis.</strong>
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <button
                onClick={() => window.location.href = '/login'}
                className="group flex items-center gap-2 px-8 py-4 bg-[#2196F3] hover:bg-[#42a5f5] text-white font-bold rounded-xl transition-all text-base shadow-2xl shadow-[#2196F3]/30 hover:shadow-[#2196F3]/50 hover:scale-[1.03]"
              >
                Empezar gratis ahora
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to={createPageUrl('Product')}
                className="flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/8 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 transition-all text-base"
              >
                <Play className="h-4 w-4 text-[#2196F3]" />
                Ver la plataforma
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4">
              {TRUST_BADGES.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-white/50">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#26a69a] flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: platform mockup */}
          <div className="relative hidden lg:block">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-[#2196F3]/10 rounded-3xl blur-[60px]" />

            <div className="relative bg-[#0c0f1c] border border-[#1e2538] rounded-2xl shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#080b17]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef5350]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#26a69a]/60" />
                <div className="ml-3 flex-1 h-5 bg-white/5 rounded-md px-2 flex items-center">
                  <span className="text-[10px] text-white/20">simutrade.io/portal/charts</span>
                </div>
              </div>

              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#090c19]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">AAPL</span>
                    <span className="text-[10px] text-white/30">Apple Inc.</span>
                  </div>
                  <span className="text-lg font-mono font-black text-white">$178.52</span>
                  <span className="text-xs font-mono font-bold text-[#26a69a] bg-[#26a69a]/10 px-2 py-0.5 rounded">▲ +1.23%</span>
                </div>
                <div className="flex gap-1 text-[10px] text-white/30">
                  {['1m','5m','15m','1h','1D','1W'].map(t => (
                    <button key={t} className={`px-2 py-0.5 rounded transition-all ${t === '1D' ? 'bg-[#2196F3]/20 text-[#60bbff]' : 'hover:bg-white/5'}`}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Chart area */}
              <div className="relative h-44 bg-[#080b17] px-4 pt-4 pb-1">
                {/* Y-axis lines */}
                {[0,25,50,75,100].map(p => (
                  <div key={p} className="absolute left-4 right-0 border-t border-white/[0.04]" style={{ top: `${100 - p}%` }} />
                ))}
                {/* Candles */}
                <div className="flex items-end gap-1 h-full">
                  {CANDLES.map((c, i) => {
                    const scale = (v) => `${v}%`;
                    const bodyH = Math.abs(c.c - c.o);
                    const bodyTop = 100 - Math.max(c.o, c.c);
                    return (
                      <div key={i} className="flex-1 relative flex flex-col items-center" style={{ height: '100%' }}>
                        {/* wick */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-px" style={{
                          top: `${100 - c.h}%`,
                          height: `${c.h - c.l}%`,
                          background: c.up ? '#26a69a' : '#ef5350',
                          opacity: 0.6,
                        }} />
                        {/* body */}
                        <div className="absolute left-0.5 right-0.5 rounded-sm" style={{
                          top: `${bodyTop}%`,
                          height: `${Math.max(bodyH, 1.5)}%`,
                          background: c.up ? '#26a69a' : '#ef5350',
                          opacity: c.up ? 0.85 : 0.8,
                        }} />
                      </div>
                    );
                  })}
                </div>
                {/* Hover price line */}
                <div className="absolute right-12 top-8 w-px h-28 border-l border-[#2196F3]/40 border-dashed">
                  <div className="absolute -right-6 -top-3 bg-[#2196F3] text-white text-[9px] px-1.5 py-0.5 rounded font-mono">$178.52</div>
                </div>
              </div>

              {/* Trade panel */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#080b17] border-t border-white/5">
                <div className="bg-[#26a69a]/10 border border-[#26a69a]/20 rounded-xl p-3">
                  <div className="text-[10px] text-[#26a69a] font-semibold uppercase mb-1">Comprar</div>
                  <div className="text-xs text-white/50 mb-2">Qty: 10 acciones</div>
                  <div className="text-sm font-bold text-[#26a69a]">$1,785.20</div>
                </div>
                <div className="bg-[#ef5350]/10 border border-[#ef5350]/20 rounded-xl p-3">
                  <div className="text-[10px] text-[#ef5350] font-semibold uppercase mb-1">Vender</div>
                  <div className="text-xs text-white/50 mb-2">Posición: 50 acc.</div>
                  <div className="text-sm font-bold text-[#ef5350]">$8,926.00</div>
                </div>
              </div>

              {/* Portfolio mini row */}
              <div className="px-3 pb-3 flex items-center justify-between border-t border-white/5 pt-2">
                <div className="text-[10px] text-white/30">Equity total</div>
                <div className="text-xs font-bold text-white">$104,328.50</div>
                <div className="text-[10px] font-bold text-[#26a69a] bg-[#26a69a]/10 px-2 py-0.5 rounded-full">+4.33%</div>
              </div>
            </div>

            {/* Floating notification card */}
            <div className="absolute -bottom-4 -left-8 bg-[#0c0f1c] border border-[#1e2538] rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-[bounce_4s_ease-in-out_infinite]">
              <div className="w-8 h-8 rounded-full bg-[#26a69a]/15 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-[#26a69a]" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-white">Orden ejecutada</div>
                <div className="text-[10px] text-white/40">NVDA · Compra · 5 acc. · $875.30</div>
              </div>
            </div>

            {/* Floating PnL badge */}
            <div className="absolute -top-4 -right-6 bg-[#0c0f1c] border border-[#26a69a]/30 rounded-xl px-3 py-2 shadow-xl">
              <div className="text-[10px] text-white/40 mb-0.5">P&L Hoy</div>
              <div className="text-base font-black text-[#26a69a]">+$4,328</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ STATS BAND ══════════════════════════ */}
      <div className="bg-[#2196F3] py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-white/70 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════ HOW IT WORKS ══════════════════════════ */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#2196F3] uppercase tracking-[0.2em] mb-3 block">Cómo funciona</span>
            <h2 className="text-4xl sm:text-5xl font-black">Empieza en <span className="text-[#2196F3]">3 pasos</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* connector line desktop */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-[#2196F3]/30 to-transparent" />
            {STEPS.map((s, i) => (
              <div key={i} className="relative group text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2196F3]/20 to-[#7C3AED]/10 border border-[#2196F3]/20 text-[#2196F3] text-3xl font-black mb-5 mx-auto group-hover:scale-110 transition-transform">
                  {s.n}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ MARKETS ══════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 bg-[#070910]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#26a69a] uppercase tracking-[0.2em] mb-3 block">Mercados disponibles</span>
            <h2 className="text-4xl sm:text-5xl font-black">Opera en todos<br />los mercados</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKETS.map((m, i) => (
              <div key={i}
                className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0c0f1c] p-6 hover:border-white/10 hover:-translate-y-1 transition-all group cursor-pointer"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 opacity-60" style={{ background: m.color }} />
                <div className="text-3xl mb-4">{m.emoji}</div>
                <div className="font-bold text-white text-lg mb-3">{m.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {m.symbols.map(s => (
                    <span key={s} className="text-[11px] px-2 py-0.5 bg-white/5 rounded-full text-white/60 font-mono border border-white/5">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FEATURES ══════════════════════════ */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em] mb-4 block">Por qué SimuTrade</span>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
                Herramientas de<br /><span className="text-purple-400">nivel institucional.</span><br />Para todos.
              </h2>
              <p className="text-white/45 text-lg leading-relaxed mb-8">
                Aprende con la misma tecnología que usan los traders profesionales. Sin costes ocultos, sin limitaciones artificiales.
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="flex items-center gap-2 px-7 py-3.5 bg-white text-[#060810] font-bold rounded-xl hover:bg-white/90 transition-all text-sm"
              >
                Crear cuenta gratis <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="bg-[#0c0f1c] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${f.accent}18` }}>
                        <Icon className="h-4 w-4" style={{ color: f.accent }} />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${f.accent}18`, color: f.accent }}>{f.tag}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
                    <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ TESTIMONIALS ══════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 sm:px-6 bg-[#070910]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#26a69a] uppercase tracking-[0.2em] mb-3 block">Testimonios reales</span>
              <h2 className="text-4xl sm:text-5xl font-black">Ellos ya operan<br />con SimuTrade</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.slice(0, 6).map((t, idx) => (
                <div key={t.id} className={`bg-[#0c0f1c] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/10 transition-all ${idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                  <StarRating rating={t.rating || 5} />
                  <p className="text-sm text-white/65 leading-relaxed flex-1">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2196F3] to-[#7C3AED] flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-white/35">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to={createPageUrl('Testimonials')} className="text-sm text-[#2196F3] hover:text-[#60bbff] transition-colors font-medium">
                Ver todos los testimonios →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════ AWARDS ══════════════════════════ */}
      {awards.length > 0 && (
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-[0.2em] mb-3 block">Reconocimientos</span>
              <h2 className="text-4xl sm:text-5xl font-black">Premios & Logros</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.slice(0, 6).map(a => (
                <div key={a.id} className="flex items-start gap-4 bg-[#0c0f1c] border border-white/5 rounded-2xl p-5 hover:border-amber-500/20 transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm mb-0.5">{a.title}</div>
                    <div className="text-xs text-amber-400/70">{a.issuer} · {a.year}</div>
                    {a.description && <p className="text-xs text-white/40 mt-2 leading-relaxed line-clamp-2">{a.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════ FAQ ══════════════════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#070910]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#2196F3] uppercase tracking-[0.2em] mb-3 block">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-black">Preguntas<br />frecuentes</h2>
          </div>
          <div className="space-y-2">
            {displayFaqs.map(f => (
              <div key={f.id} className={`rounded-2xl border transition-all overflow-hidden ${openFaq === f.id ? 'border-[#2196F3]/30 bg-[#2196F3]/5' : 'border-white/5 bg-[#0c0f1c] hover:border-white/10'}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span className="font-semibold text-white text-sm">{f.question}</span>
                  <ChevronDown className={`h-4 w-4 text-white/30 flex-shrink-0 transition-transform duration-300 ${openFaq === f.id ? 'rotate-180 text-[#2196F3]' : ''}`} />
                </button>
                {openFaq === f.id && (
                  <div className="px-6 pb-5 text-sm text-white/55 leading-relaxed border-t border-white/5 pt-4">
                    {f.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={createPageUrl('FAQ')} className="text-sm text-[#2196F3] hover:text-[#60bbff] transition-colors font-medium">
              Ver todas las preguntas →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FINAL CTA ══════════════════════════ */}
      <section className="relative py-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(33,150,243,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(124,58,237,0.10),transparent)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#26a69a]/10 border border-[#26a69a]/20 text-xs text-[#26a69a] font-semibold mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#26a69a] animate-pulse" />
            Plataforma activa · Únete hoy
          </div>
          <h2 className="text-5xl sm:text-6xl font-black mb-5 leading-tight">
            ¿Listo para operar<br />como un <span className="text-[#2196F3]">pro?</span>
          </h2>
          <p className="text-lg text-white/40 mb-10">
            Sin tarjeta de crédito. Sin compromisos. $100,000 virtuales al instante.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#2196F3] hover:bg-[#42a5f5] text-white font-black rounded-2xl text-xl transition-all shadow-2xl shadow-[#2196F3]/30 hover:shadow-[#2196F3]/50 hover:scale-[1.04]"
          >
            Crear cuenta gratis
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/25">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#26a69a]" />100% gratis</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#26a69a]" />Sin riesgo real</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#26a69a]" />Activación inmediata</span>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
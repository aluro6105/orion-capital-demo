import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ArrowRight, Users, Shield, Globe, FileText,
  Star, ChevronDown, CheckCircle2, TrendingUp,
  BarChart3, Zap, Award, Trophy, Medal, Star as StarIcon, BadgeCheck, Gem
} from 'lucide-react';

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

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

const TRUST_CARDS = [
  { icon: Users, title: 'Social', desc: 'Más de 5,000 traders activos operando en la plataforma' },
  { icon: FileText, title: 'Fiable', desc: 'Líder en tecnología de trading simulado desde 2020' },
  { icon: Shield, title: 'Seguro', desc: 'Protegemos tu cuenta y tus activos con la máxima seguridad' },
  { icon: Globe, title: 'Global', desc: 'Ofrecemos nuestros servicios en todo el mundo' },
];

const STATS = [
  { value: '$10K', label: 'Capital de cuenta demo' },
  { value: '15+', label: 'Instrumentos disponibles' },
  { value: '5+', label: 'Años en el mercado' },
  { value: '<1ms', label: 'Latencia WebSocket' },
];

const FEATURES = [
  { icon: BarChart3, title: 'Gráficos profesionales', desc: 'Velas japonesas, indicadores técnicos, múltiples marcos temporales. Una interfaz idéntica a la de los brokers reales.', accent: '#00C853', tag: 'Análisis técnico' },
  { icon: Zap, title: 'Datos en tiempo real', desc: 'Precios actualizados al instante mediante conexión directa. Opera con información de mercado real y precisa.', accent: '#2196F3', tag: 'Tiempo real' },
  { icon: TrendingUp, title: 'Métricas avanzadas', desc: 'Curva de capital, tasa de acierto, caída máxima y ganancias realizadas. Análisis completo de tu rendimiento.', accent: '#7C3AED', tag: 'Analítica pro' },
  { icon: Shield, title: 'Cuenta demo incluida', desc: '$10,000 en cuenta demo para practicar estrategias. Empieza a operar al instante, sin depósito previo.', accent: '#f59e0b', tag: 'Cuenta demo' },
];

const MARKETS = [
  { emoji: '📈', label: 'Acciones', symbols: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'], color: '#2196F3' },
  { emoji: '🏦', label: 'ETFs', symbols: ['SPY', 'QQQ', 'IWM'], color: '#7C3AED' },
  { emoji: '💱', label: 'Forex', symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY'], color: '#00C853' },
  { emoji: '₿', label: 'Crypto', symbols: ['BTC/USD', 'ETH/USD'], color: '#f59e0b' },
];

const STEPS = [
  { n: '01', title: 'Abre tu cuenta', desc: 'Registro en 30 segundos. Cuenta demo con $10,000 activada al instante, sin depósito.' },
  { n: '02', title: 'Analiza mercados', desc: 'Accede a acciones, ETFs, forex y crypto con precios WebSocket en vivo.' },
  { n: '03', title: 'Opera y crece', desc: 'Compra, vende, analiza tu P&L y perfecciona tu estrategia con datos reales.' },
];

const CANDLES = [
  {o:40,h:55,l:35,c:52,up:true},{o:52,h:60,l:48,c:48,up:false},{o:48,h:58,l:44,c:56,up:true},
  {o:56,h:65,l:52,c:61,up:true},{o:61,h:63,l:54,c:55,up:false},{o:55,h:72,l:53,c:70,up:true},
  {o:70,h:75,l:65,c:68,up:false},{o:68,h:80,l:65,c:78,up:true},{o:78,h:85,l:74,c:82,up:true},
  {o:82,h:84,l:70,c:72,up:false},{o:72,h:82,l:70,c:80,up:true},{o:80,h:92,l:78,c:90,up:true},
  {o:90,h:95,l:82,c:84,up:false},{o:84,h:96,l:82,c:94,up:true},{o:94,h:98,l:88,c:92,up:false},
  {o:92,h:100,l:90,c:99,up:true},{o:99,h:102,l:88,c:90,up:false},{o:90,h:98,l:88,c:96,up:true},
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'text-[#00C853] fill-[#00C853]' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

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

  const displayFaqs = faqs.length > 0 ? faqs.slice(0, 5) : [
    { id: 1, question: '¿Cómo abro una cuenta?', answer: 'Registro en menos de 30 segundos. Tu cuenta demo con $10,000 queda activada inmediatamente.' },
    { id: 2, question: '¿Los precios son datos reales de mercado?', answer: 'Sí, usamos datos de mercado de alta fidelidad via WebSocket con actualizaciones tick a tick.' },
    { id: 3, question: '¿Qué instrumentos están disponibles?', answer: 'Acciones (AAPL, MSFT, NVDA...), ETFs (SPY, QQQ), Forex (EUR/USD) y Crypto (BTC, ETH). Más de 15 instrumentos.' },
    { id: 4, question: '¿Cuánto capital tiene la cuenta demo?', answer: 'La cuenta demo se activa con $10,000 virtuales. Puedes resetearla desde el dashboard en cualquier momento.' },
    { id: 5, question: '¿Hay comisiones?', answer: 'Sin comisiones ocultas. Sin letra pequeña. Siempre transparentes con nuestros usuarios.' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <PublicNav currentPage="Home" />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-screen flex items-center bg-white overflow-hidden pt-16">
        {/* Subtle bg grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f0fdf4] to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C853]/10 border border-[#00C853]/20 text-xs text-[#00a844] font-semibold mb-8 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
              LIVE · Datos de mercado en tiempo real
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6 text-gray-900">
              Sé el trader<br />
              <span className="bg-gradient-to-r from-[#00C853] to-[#2196F3] bg-clip-text text-transparent">
                que deseas ser.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-lg">
              Opera en miles de acciones, criptos y ETFs con tecnología de nivel institucional. Practica sin riesgo, aprende de verdad.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <button
                onClick={() => window.location.href = '/login'}
                className="group flex items-center gap-2 px-8 py-4 bg-[#00C853] hover:bg-[#00b34a] text-white font-bold rounded-full transition-all text-base shadow-lg shadow-[#00C853]/25 hover:scale-[1.03]"
              >
                Únete gratis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to={createPageUrl('Product')}
                className="flex items-center gap-2 px-6 py-4 bg-white text-gray-700 font-semibold rounded-full border border-gray-200 hover:border-gray-400 transition-all text-base"
              >
                Ver la plataforma
              </Link>
            </div>

            <div className="flex flex-wrap gap-5">
              {[
                { icon: CheckCircle2, label: '$10K en cuenta demo' },
                { icon: CheckCircle2, label: 'Sin comisiones ocultas' },
                { icon: CheckCircle2, label: 'Activación inmediata' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Icon className="h-4 w-4 text-[#00C853] flex-shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: platform mockup (dark card) */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-[#00C853]/5 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0c0f1c] border border-[#1e2538] rounded-2xl shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#080b17]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef5350]/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#00C853]/70" />
                <div className="ml-3 flex-1 h-5 bg-white/5 rounded-md px-2 flex items-center">
                  <span className="text-[10px] text-white/25">nexus.io/portal/charts</span>
                </div>
              </div>
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#090c19]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">AAPL</span>
                  <span className="text-[10px] text-white/30">Apple Inc.</span>
                  <span className="text-lg font-mono font-black text-white">$178.52</span>
                  <span className="text-xs font-mono font-bold text-[#00C853] bg-[#00C853]/10 px-2 py-0.5 rounded">▲ +1.23%</span>
                </div>
                <div className="flex gap-1 text-[10px] text-white/30">
                  {['1m','5m','1h','1D','1W'].map(t => (
                    <button key={t} className={`px-2 py-0.5 rounded ${t === '1D' ? 'bg-[#00C853]/20 text-[#00C853]' : 'hover:bg-white/5'}`}>{t}</button>
                  ))}
                </div>
              </div>
              {/* Chart */}
              <div className="relative h-44 bg-[#080b17] px-4 pt-4 pb-1">
                {[0,25,50,75,100].map(p => (
                  <div key={p} className="absolute left-4 right-0 border-t border-white/[0.04]" style={{ top: `${100 - p}%` }} />
                ))}
                <div className="flex items-end gap-1 h-full">
                  {CANDLES.map((c, i) => {
                    const bodyH = Math.abs(c.c - c.o);
                    const bodyTop = 100 - Math.max(c.o, c.c);
                    const color = c.up ? '#00C853' : '#ef5350';
                    return (
                      <div key={i} className="flex-1 relative flex flex-col items-center" style={{ height: '100%' }}>
                        <div className="absolute left-1/2 -translate-x-1/2 w-px" style={{ top: `${100 - c.h}%`, height: `${c.h - c.l}%`, background: color, opacity: 0.5 }} />
                        <div className="absolute left-0.5 right-0.5 rounded-sm" style={{ top: `${bodyTop}%`, height: `${Math.max(bodyH, 1.5)}%`, background: color, opacity: 0.85 }} />
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Trade panel */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#080b17] border-t border-white/5">
                <div className="bg-[#00C853]/10 border border-[#00C853]/20 rounded-xl p-3">
                  <div className="text-[10px] text-[#00C853] font-semibold uppercase mb-1">Comprar</div>
                  <div className="text-xs text-white/40 mb-1">10 acciones</div>
                  <div className="text-sm font-bold text-[#00C853]">$1,785.20</div>
                </div>
                <div className="bg-[#ef5350]/10 border border-[#ef5350]/20 rounded-xl p-3">
                  <div className="text-[10px] text-[#ef5350] font-semibold uppercase mb-1">Vender</div>
                  <div className="text-xs text-white/40 mb-1">50 acciones</div>
                  <div className="text-sm font-bold text-[#ef5350]">$8,926.00</div>
                </div>
              </div>
              {/* Equity */}
              <div className="px-3 pb-3 flex items-center justify-between border-t border-white/5 pt-2">
                <div className="text-[10px] text-white/30">Equity total</div>
                <div className="text-xs font-bold text-white">$10,432.85</div>
                <div className="text-[10px] font-bold text-[#00C853] bg-[#00C853]/10 px-2 py-0.5 rounded-full">+4.33%</div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-4 -left-8 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00C853]/15 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-[#00C853]" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Orden ejecutada</div>
                <div className="text-[10px] text-gray-400">NVDA · Compra · $875.30</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-6 bg-white border border-[#00C853]/20 rounded-2xl px-4 py-3 shadow-xl">
              <div className="text-[10px] text-gray-400 mb-0.5">P&L Hoy</div>
              <div className="text-lg font-black text-[#00C853]">+$4,328</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TICKER ══════════════ */}
      <div className="bg-gray-900 py-3 overflow-hidden border-y border-gray-800">
        <div className="flex gap-10 animate-[ticker_40s_linear_infinite] whitespace-nowrap px-6">
          {[...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs">
              <span className="font-bold text-white/80 tracking-wide">{t.symbol}</span>
              <span className="font-mono text-white/40">{t.price}</span>
              <span className={`font-mono font-bold ${t.up ? 'text-[#00C853]' : 'text-[#ef5350]'}`}>{t.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════ STATS BAND ══════════════ */}
      <div className="bg-[#00C853] py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-white/75 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ TRUST / WHY NEXUS ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="text-xs font-bold text-[#00C853] uppercase tracking-[0.2em] mb-3 block">Confiable a nivel mundial</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900">¿Por qué elegir NEXUS?</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">Miles de traders de más de 100 países confían en nuestra plataforma.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg hover:border-[#00C853]/30 transition-all group cursor-default">
                <div className="w-14 h-14 rounded-full bg-[#00C853]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#00C853]/20 transition-colors">
                  <Icon className="h-6 w-6 text-[#00C853]" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block">Cómo funciona</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Empieza en <span className="text-[#00C853]">3 pasos</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white border-2 border-gray-100 text-[#00C853] text-3xl font-black mb-5 mx-auto group-hover:border-[#00C853] group-hover:bg-[#00C853]/5 transition-all shadow-sm">
                  {s.n}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ MARKETS ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#2196F3] uppercase tracking-[0.2em] mb-3 block">Mercados disponibles</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Acceso a todos<br />los mercados globales</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {MARKETS.map((m, i) => (
                <div key={i} className="flex items-center gap-5 bg-white border border-gray-100 rounded-2xl px-6 py-4 hover:border-gray-300 hover:shadow-md transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{m.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 mb-1">{m.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {m.symbols.map(s => (
                        <span key={s} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs font-semibold flex-shrink-0" style={{ color: m.color }}>{m.symbols.length} activos</div>
                </div>
              ))}
            </div>
            {/* Live price mockup */}
            <div className="bg-[#0c0f1c] border border-[#1e2538] rounded-2xl overflow-hidden shadow-xl">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
                <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">Precios en vivo</span>
                <span className="flex items-center gap-1.5 text-[10px] text-[#00C853]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />LIVE
                </span>
              </div>
              {[
                { s: 'AAPL', n: 'Apple', p: '$178.52', c: '+1.23%', up: true },
                { s: 'NVDA', n: 'Nvidia', p: '$875.30', c: '+3.21%', up: true },
                { s: 'MSFT', n: 'Microsoft', p: '$415.20', c: '+0.87%', up: true },
                { s: 'BTC/USD', n: 'Bitcoin', p: '$62,450', c: '-0.42%', up: false },
                { s: 'EUR/USD', n: 'Euro / Dollar', p: '1.0850', c: '+0.12%', up: true },
                { s: 'SPY', n: 'S&P 500 ETF', p: '$502.40', c: '+0.65%', up: true },
                { s: 'ETH/USD', n: 'Ethereum', p: '$3,420', c: '+2.05%', up: true },
              ].map((r, i) => (
                <div key={i} className="flex items-center px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white/50 mr-3 flex-shrink-0">{r.s[0]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white">{r.s}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{r.n}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-semibold text-white">{r.p}</div>
                    <div className={`text-[11px] font-mono font-bold ${r.up ? 'text-[#00C853]' : 'text-[#ef5350]'}`}>{r.c}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES (dark section) ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0a0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-[#00C853] uppercase tracking-[0.2em] mb-4 block">Por qué NEXUS</span>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-white">
                Herramientas de<br /><span className="text-[#00C853]">nivel institucional.</span><br />Para todos.
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                Opera con la misma tecnología que usan los traders profesionales. Sin limitaciones artificiales.
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#00C853] hover:bg-[#00b34a] text-white font-bold rounded-full transition-all text-sm"
              >
                Abrir cuenta gratis <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-5 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${f.accent}18` }}>
                        <Icon className="h-4 w-4" style={{ color: f.accent }} />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: `${f.accent}15`, color: f.accent }}>{f.tag}</span>
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

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#00C853] uppercase tracking-[0.2em] mb-3 block">Testimonios reales</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Lo que dicen<br />nuestros traders</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.slice(0, 6).map((t) => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <StarRating rating={t.rating || 5} />
                  <p className="text-gray-600 text-sm leading-relaxed my-4">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C853] to-[#2196F3] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to={createPageUrl('Testimonials')} className="text-sm text-[#00C853] hover:text-[#00b34a] font-semibold transition-colors">
                Ver todos los testimonios →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ AWARDS ══════════════ */}
      {awards.length > 0 && (
        <section className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mb-3 block">Reconocimientos</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Premios & Logros</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.slice(0, 6).map(a => (
                <div key={a.id} className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:border-amber-200 hover:shadow-md transition-all group">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{a.title}</div>
                    <div className="text-xs text-amber-500">{a.issuer} · {a.year}</div>
                    {a.description && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{a.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ FAQ ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Preguntas<br />frecuentes</h2>
          </div>
          <div className="space-y-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {displayFaqs.map((f, idx) => (
              <div key={f.id} className={idx > 0 ? 'border-t border-gray-100' : ''}>
                <button
                  onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{f.question}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === f.id ? 'rotate-180 text-[#00C853]' : ''}`} />
                </button>
                {openFaq === f.id && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{f.answer}</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={createPageUrl('FAQ')} className="text-sm text-[#00C853] hover:text-[#00b34a] font-semibold transition-colors">
              Ver todas las preguntas →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ FINAL CTA (dark) ══════════════ */}
      <section className="relative py-32 px-4 sm:px-6 overflow-hidden bg-[#0a0d14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(0,200,83,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_20%,rgba(33,150,243,0.07),transparent)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C853]/10 border border-[#00C853]/20 text-xs text-[#00C853] font-semibold mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
            Plataforma activa · Únete hoy
          </div>
          <h2 className="text-5xl sm:text-6xl font-black mb-5 leading-tight text-white">
            ¿Listo para operar<br />como un <span className="text-[#00C853]">pro?</span>
          </h2>
          <p className="text-lg text-white/40 mb-10">
            Cuenta demo con $10,000 activada al instante. Sin esperas.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#00C853] hover:bg-[#00b34a] text-white font-black rounded-full text-xl transition-all shadow-2xl shadow-[#00C853]/25 hover:scale-[1.04]"
          >
            Abrir cuenta ahora
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/30">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#00C853]" />Cuenta demo $10K</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#00C853]" />Datos en tiempo real</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#00C853]" />Activación inmediata</span>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
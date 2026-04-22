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
  BarChart3, Zap, Award, Trophy, Medal, BadgeCheck, Gem, Lock, CreditCard, Banknote,
  Activity, LineChart, Layers
} from 'lucide-react';

// ── PALETA ────────────────────────────────────────────────────────────────────
// Primario oscuro : #0A1628  (azul marino profundo)
// Acento primario : #00D4FF  (cian eléctrico)
// Acento secundario: #7B61FF (violeta suave)
// Superficie media : #0F1E35
// ─────────────────────────────────────────────────────────────────────────────

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

const STATS = [
  { value: '50+', label: 'Instrumentos globales' },
  { value: '<5ms', label: 'Velocidad de ejecución' },
  { value: '1:500', label: 'Apalancamiento máx.' },
  { value: '24/5', label: 'Soporte especializado' },
];

const MARKETS = [
  { icon: Activity, label: 'Criptomonedas', desc: 'Opera BTC, ETH, SOL y más con alta liquidez y sin comisiones ocultas', symbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'], color: '#00D4FF', bg: '#00D4FF12' },
  { icon: BarChart3, label: 'Forex', desc: 'Los pares de divisas más líquidos del mundo en tiempo real', symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY'], color: '#7B61FF', bg: '#7B61FF12' },
  { icon: Globe, label: 'Materias Primas', desc: 'Oro, plata, petróleo y más. Diversifica tu portafolio global', symbols: ['XAUUSD', 'XAGUSD', 'WTI'], color: '#00D4FF', bg: '#00D4FF12' },
  { icon: LineChart, label: 'Índices bursátiles', desc: 'SP500, Nasdaq, DAX — los grandes índices en una sola plataforma', symbols: ['SPX500', 'NAS100', 'GER40'], color: '#7B61FF', bg: '#7B61FF12' },
];

const FEATURES = [
  { icon: BarChart3, title: 'Análisis técnico avanzado', desc: 'Velas japonesas, indicadores institucionales y múltiples temporalidades para operar con precisión quirúrgica.', accent: '#00D4FF', tag: 'Gráficos Pro' },
  { icon: Zap, title: 'Ejecución sin retrasos', desc: 'Órdenes procesadas en milisegundos. Opera con precio exacto, sin slippage ni requotes en ninguna condición.', accent: '#7B61FF', tag: 'Ultra-rápido' },
  { icon: TrendingUp, title: 'Rendimiento detallado', desc: 'Curva de equity, ratio de acierto, drawdown y P&L completo. Métricas que los mejores traders del mundo usan.', accent: '#00D4FF', tag: 'Analítica' },
  { icon: Shield, title: 'Demo $10,000 al instante', desc: 'Practica estrategias reales sin arriesgar un solo centavo. Actívate en segundos, sin papeleo ni depósito.', accent: '#7B61FF', tag: 'Sin riesgo' },
];

const TRUST_CARDS = [
  { icon: Users, title: '+5,000 traders activos', desc: 'Una comunidad global de inversores que confían en nuestra tecnología cada día' },
  { icon: Layers, title: 'Regulado y auditado', desc: 'Infraestructura con estándares FSA, CySEC y DFSA para la máxima protección' },
  { icon: Shield, title: 'Fondos segregados', desc: 'Tu capital siempre separado de los fondos operativos con protección total' },
  { icon: Globe, title: 'Presencia en 50+ países', desc: 'Operamos globalmente con soporte multilingüe disponible 24 horas, 5 días' },
];

const STEPS = [
  { n: '01', title: 'Crea tu cuenta', desc: 'Registro express en menos de 30 segundos. Cuenta demo activa al instante con $10,000 sin depósito.' },
  { n: '02', title: 'Explora los mercados', desc: 'Accede a cripto, forex, commodities e índices con precios reales y herramientas profesionales.' },
  { n: '03', title: 'Opera y escala', desc: 'Ejecuta tus estrategias, analiza tu rendimiento y lleva tu trading al siguiente nivel.' },
];

const SECURITY_ITEMS = [
  { icon: Lock, label: 'Encriptación bancaria de extremo a extremo' },
  { icon: Shield, label: 'Protección de saldo negativo garantizada' },
  { icon: CreditCard, label: 'Capital en cuentas completamente segregadas' },
  { icon: Zap, label: 'Depósitos y retiros procesados en tiempo récord' },
  { icon: Banknote, label: 'Alianzas con instituciones financieras de primer nivel' },
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
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'fill-[#00D4FF] text-[#00D4FF]' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials-home'],
    queryFn: () => base44.entities.Testimonial.filter({ approved: true }),
    staleTime: 5 * 60 * 1000,
  });
  const { data: awards = [] } = useQuery({
    queryKey: ['awards-home'],
    queryFn: () => base44.entities.Award.filter({ is_active: true }),
    staleTime: 5 * 60 * 1000,
  });
  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs-home'],
    queryFn: () => base44.entities.Faq.filter({ is_active: true }),
    staleTime: 5 * 60 * 1000,
  });

  const [openFaq, setOpenFaq] = useState(null);

  const displayFaqs = faqs.length > 0 ? faqs.slice(0, 5) : [
    { id: 1, question: '¿Cómo abro una cuenta en Orion Capital?', answer: 'El registro tarda menos de 30 segundos. Tu cuenta demo con $10,000 queda activada inmediatamente, sin ningún depósito previo ni verificación de documentos.' },
    { id: 2, question: '¿Los precios son datos reales de mercado?', answer: 'Sí, Orion Capital utiliza datos de mercado de alta fidelidad actualizados en tiempo real para ofrecerte una experiencia lo más cercana posible al mercado real con spreads competitivos.' },
    { id: 3, question: '¿Qué instrumentos están disponibles?', answer: 'Criptomonedas (BTC, ETH, SOL...), Forex (EUR/USD, GBP/USD...), Materias Primas (Oro, Plata, Petróleo) e Índices (SP500, Nasdaq, DAX). Más de 50 instrumentos disponibles.' },
    { id: 4, question: '¿Cuánto capital tiene la cuenta demo?', answer: 'La cuenta demo se activa con $10,000 virtuales. Puedes resetearla desde el panel de control en cualquier momento para empezar con capital fresco.' },
    { id: 5, question: '¿Existen cargos ocultos en Orion Capital?', answer: 'Cero cargos ocultos ni letra pequeña. Orion Capital es completamente transparente con todos sus usuarios. Los spreads y condiciones de trading se publican abiertamente.' },
  ];

  return (
    <div className="min-h-screen bg-[#0A1628] text-white overflow-x-hidden font-inter">
      <PublicNav currentPage="Home" />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-screen flex items-center bg-[#0A1628] overflow-hidden">
        {/* Gradient blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00D4FF]/8 rounded-full blur-[120px] -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7B61FF]/8 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(0,212,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.6)_1px,transparent_1px)] bg-[size:70px_70px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-center pt-28 pb-20">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-xs text-[#00D4FF] font-bold mb-8 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
              Mercados en tiempo real · 50+ instrumentos
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6">
              Domina los<br />mercados<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">con ventaja real.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 leading-relaxed mb-10 max-w-lg">
              Tecnología institucional, spreads competitivos y herramientas de análisis profesional. Todo en una sola plataforma diseñada para inversores serios.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <button
                onClick={() => window.location.href = createPageUrl('Register')}
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00D4FF] to-[#00AACC] hover:from-[#00BBEE] hover:to-[#009AB8] text-[#0A1628] font-black rounded-full transition-all text-base shadow-xl shadow-[#00D4FF]/20 hover:scale-[1.03]"
              >
                Empezar ahora
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to={createPageUrl('Register')}
                className="flex items-center gap-2 px-6 py-4 text-white/60 font-semibold rounded-full border border-white/15 hover:border-[#00D4FF]/40 hover:text-[#00D4FF] transition-all text-base"
              >
                Demo gratuita →
              </Link>
            </div>

            {/* Micro-stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { v: '$10,000', l: 'Demo sin depósito' },
                { v: '0.0 pips', l: 'Spreads mínimos' },
                { v: '1:500', l: 'Apalancamiento' },
              ].map(s => (
                <div key={s.l}>
                  <div className="text-lg font-black text-white">{s.v}</div>
                  <div className="text-xs text-white/35 font-medium">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: platform mockup */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 bg-[#00D4FF]/5 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0F1E35] border border-[#00D4FF]/15 rounded-2xl shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#0A1628]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef5350]/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]/70" />
                <div className="ml-3 flex-1 h-5 bg-white/5 rounded-md px-2 flex items-center">
                  <span className="text-[10px] text-white/25">orioncapital.io/portal/charts</span>
                </div>
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#0A1628]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">BTC/USD</span>
                  <span className="text-[10px] text-white/30">Bitcoin</span>
                  <span className="text-lg font-mono font-black text-white">62,450</span>
                  <span className="text-xs font-mono font-bold text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded">▲ +2.14%</span>
                </div>
                <div className="flex gap-1 text-[10px] text-white/30">
                  {['1m','5m','1h','1D','1W'].map(t => (
                    <button key={t} className={`px-2 py-0.5 rounded ${t === '1D' ? 'bg-[#00D4FF]/15 text-[#00D4FF]' : 'hover:bg-white/5'}`}>{t}</button>
                  ))}
                </div>
              </div>
              {/* Chart */}
              <div className="relative h-44 bg-[#0A1628] px-4 pt-4 pb-1">
                {[0,25,50,75,100].map(p => (
                  <div key={p} className="absolute left-4 right-0 border-t border-white/[0.04]" style={{ top: `${100 - p}%` }} />
                ))}
                <div className="flex items-end gap-1 h-full">
                  {CANDLES.map((c, i) => {
                    const bodyH = Math.abs(c.c - c.o);
                    const bodyTop = 100 - Math.max(c.o, c.c);
                    const color = c.up ? '#00D4FF' : '#ef5350';
                    return (
                      <div key={i} className="flex-1 relative flex flex-col items-center" style={{ height: '100%' }}>
                        <div className="absolute left-1/2 -translate-x-1/2 w-px" style={{ top: `${100 - c.h}%`, height: `${c.h - c.l}%`, background: color, opacity: 0.4 }} />
                        <div className="absolute left-0.5 right-0.5 rounded-sm" style={{ top: `${bodyTop}%`, height: `${Math.max(bodyH, 1.5)}%`, background: color, opacity: 0.8 }} />
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Trade panel */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#0A1628] border-t border-white/5">
                <div className="bg-[#00D4FF]/8 border border-[#00D4FF]/20 rounded-xl p-3">
                  <div className="text-[10px] text-[#00D4FF] font-semibold uppercase mb-1">Comprar</div>
                  <div className="text-xs text-white/40 mb-1">1.00 lote</div>
                  <div className="text-sm font-bold text-[#00D4FF]">62,450</div>
                </div>
                <div className="bg-[#ef5350]/8 border border-[#ef5350]/20 rounded-xl p-3">
                  <div className="text-[10px] text-[#ef5350] font-semibold uppercase mb-1">Vender</div>
                  <div className="text-xs text-white/40 mb-1">0.50 lote</div>
                  <div className="text-sm font-bold text-[#ef5350]">62,440</div>
                </div>
              </div>
              {/* Equity */}
              <div className="px-3 pb-3 flex items-center justify-between border-t border-white/5 pt-2">
                <div className="text-[10px] text-white/30">Equity</div>
                <div className="text-xs font-bold text-white">$14,230.80</div>
                <div className="text-[10px] font-bold text-[#00D4FF] bg-[#00D4FF]/10 px-2 py-0.5 rounded-full">+42.3%</div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -bottom-4 -left-10 bg-[#0F1E35] border border-[#00D4FF]/20 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#00D4FF]/15 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-[#00D4FF]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Orden ejecutada</div>
                <div className="text-[10px] text-white/40">BTC/USD · Buy · 62,450</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-6 bg-[#0F1E35] border border-[#7B61FF]/25 rounded-2xl px-4 py-3 shadow-2xl">
              <div className="text-[10px] text-white/40 mb-0.5">Ganancia del día</div>
              <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">+$4,230</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TICKER ══════════════ */}
      <div className="bg-[#0F1E35] border-y border-[#00D4FF]/10 py-2.5 overflow-hidden">
        <div className="flex gap-10 animate-ticker whitespace-nowrap px-6">
          {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs">
              <span className="font-bold text-[#00D4FF] tracking-wide">{t.symbol}</span>
              <span className="font-mono text-white/50">{t.price}</span>
              <span className={`font-mono font-bold ${t.up ? 'text-[#00D4FF]' : 'text-[#ef5350]'}`}>{t.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════ STATS BAND ══════════════ */}
      <div className="bg-[#0A1628] py-14 px-4 border-b border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] mb-1">{s.value}</div>
              <div className="text-xs text-white/40 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ MARKETS ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0A1628]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-[0.2em] mb-3 block">Mercados disponibles</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Opera cualquier activo,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">en un solo lugar.</span></h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">Cripto, Forex, Commodities e Índices. Más de 50 instrumentos con precios en vivo y spreads institucionales.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MARKETS.map((m, i) => {
              const MIcon = m.icon;
              return (
                <div key={i} className="bg-[#0F1E35] border border-white/8 rounded-2xl p-6 hover:border-[#00D4FF]/30 hover:bg-[#152030] transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: m.bg }}>
                    <MIcon className="h-6 w-6" style={{ color: m.color }} />
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{m.label}</h3>
                  <p className="text-xs text-white/40 leading-relaxed mb-4">{m.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.symbols.map(s => (
                      <span key={s} className="text-[10px] px-2 py-1 bg-white/5 border border-white/8 rounded-lg text-white/50 font-mono font-semibold">{s}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#00D4FF]">
                    Explorar <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ TRUST CARDS ══════════════ */}
      <section className="py-20 px-4 sm:px-6 bg-[#0F1E35]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#7B61FF] uppercase tracking-[0.2em] mb-3 block">¿Por qué Orion Capital?</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">La elección de inversores<br />exigentes en todo el mundo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="relative bg-[#0A1628] border border-white/8 rounded-2xl p-6 hover:border-[#7B61FF]/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#7B61FF]/12 flex items-center justify-center mb-4 group-hover:bg-[#7B61FF]/22 transition-colors">
                    <Icon className="h-6 w-6 text-[#7B61FF]" />
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{c.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0A1628]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-3 block">Simple. Rápido. Efectivo.</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Empieza en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">3 pasos</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <div key={i} className="relative text-center group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+44px)] right-[-calc(50%-44px)] h-px bg-gradient-to-r from-[#00D4FF]/30 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00D4FF]/12 to-[#7B61FF]/12 border border-[#00D4FF]/20 text-[#00D4FF] text-3xl font-black mb-5 mx-auto group-hover:border-[#00D4FF]/50 group-hover:from-[#00D4FF]/20 group-hover:to-[#7B61FF]/20 transition-all">
                  {s.n}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{s.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button
              onClick={() => window.location.href = createPageUrl('Register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-black rounded-full transition-all hover:opacity-90 hover:scale-[1.02] shadow-xl shadow-[#00D4FF]/15"
            >
              Crear mi cuenta ahora <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0F1E35]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-[0.2em] mb-4 block">Plataforma de última generación</span>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-white">
                Todo lo que un<br />inversor profesional<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">necesita.</span>
              </h2>
              <p className="text-white/45 text-lg leading-relaxed mb-8">
                Desde gráficos técnicos avanzados hasta análisis de rendimiento institucional. Orion Capital reúne las herramientas que marcan la diferencia.
              </p>
              <button
                onClick={() => window.location.href = createPageUrl('Register')}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#00D4FF] hover:bg-[#00BBDD] text-[#0A1628] font-black rounded-full transition-all text-sm shadow-lg shadow-[#00D4FF]/20"
              >
                Explorar la plataforma <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="bg-[#0A1628] border border-white/8 rounded-2xl p-5 hover:border-[#00D4FF]/20 transition-all group">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${f.accent}15` }}>
                        <Icon className="h-4 w-4" style={{ color: f.accent }} />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${f.accent}15`, color: f.accent }}>{f.tag}</span>
                    </div>
                    <h3 className="font-black text-white text-sm mb-2">{f.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SECURITY ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0A1628]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold text-[#7B61FF] uppercase tracking-[0.2em] mb-4 block">Seguridad de nivel bancario</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
              Tu capital,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">siempre protegido.</span>
            </h2>
            <p className="text-white/45 text-lg leading-relaxed mb-10">
              Operamos bajo estándares de seguridad institucional. Tus fondos están completamente segregados, auditados y protegidos con encriptación de grado militar.
            </p>
            <Link
              to={createPageUrl('About')}
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-[#00D4FF]/30 text-[#00D4FF] hover:bg-[#00D4FF]/10 font-black rounded-full transition-all text-sm"
            >
              Conoce más sobre nosotros <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {SECURITY_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 bg-[#0F1E35] border border-white/8 rounded-2xl px-5 py-4 hover:border-[#00D4FF]/25 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF]/12 to-[#7B61FF]/12 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-[#00D4FF]" />
                  </div>
                  <span className="font-semibold text-white/70 text-sm group-hover:text-white transition-colors">{item.label}</span>
                  <CheckCircle2 className="h-4 w-4 text-[#00D4FF]/50 ml-auto flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 sm:px-6 bg-[#0F1E35]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-[0.2em] mb-3 block">Opiniones reales</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Lo que dicen<br />nuestros inversores</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.slice(0, 6).map((t) => (
                <div key={t.id} className="bg-[#0A1628] border border-white/8 rounded-2xl p-6 hover:border-[#00D4FF]/20 transition-all">
                  <StarRating rating={t.rating || 5} />
                  <p className="text-white/55 text-sm leading-relaxed my-4">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B61FF] flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-xs text-white/35">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to={createPageUrl('Testimonials')} className="text-sm text-[#00D4FF] hover:text-[#00BBDD] font-bold transition-colors">
                Ver todos los testimonios →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ AWARDS ══════════════ */}
      {awards.length > 0 && (
        <section className="py-20 px-4 sm:px-6 bg-[#0A1628]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#7B61FF] uppercase tracking-[0.2em] mb-3 block">Reconocimientos del grupo</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white">Premios & Excelencia</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.slice(0, 6).map((a, idx) => {
                const awardIcons = [Trophy, Medal, BadgeCheck, Gem, Award, Star];
                const awardColors = ['#00D4FF', '#7B61FF', '#00D4FF', '#7B61FF', '#00D4FF', '#7B61FF'];
                const awardBgs = ['#00D4FF12', '#7B61FF12', '#00D4FF12', '#7B61FF12', '#00D4FF12', '#7B61FF12'];
                const AIcon = awardIcons[idx % awardIcons.length];
                const aColor = awardColors[idx % awardColors.length];
                const aBg = awardBgs[idx % awardBgs.length];
                return (
                  <div key={a.id} className="flex items-start gap-4 bg-[#0F1E35] border border-white/8 rounded-2xl p-5 hover:border-[#00D4FF]/20 transition-all group">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: aBg, border: `1px solid ${aColor}30` }}>
                      <AIcon className="h-5 w-5" style={{ color: aColor }} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm mb-0.5">{a.title}</div>
                      <div className="text-xs font-bold" style={{ color: aColor }}>{a.issuer} · {a.year}</div>
                      {a.description && <p className="text-xs text-white/35 mt-1.5 leading-relaxed line-clamp-2">{a.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════ FAQ ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0F1E35]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-white/25 uppercase tracking-[0.2em] mb-3 block">Soporte</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Preguntas<br />frecuentes</h2>
          </div>
          <div className="space-y-2">
            {displayFaqs.map((f) => (
              <div key={f.id} className="bg-[#0A1628] border border-white/8 rounded-2xl overflow-hidden hover:border-[#00D4FF]/20 transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-bold text-white/85 pr-4">{f.question}</span>
                  <ChevronDown className={`h-4 w-4 text-white/30 flex-shrink-0 transition-transform duration-300 ${openFaq === f.id ? 'rotate-180 text-[#00D4FF]' : ''}`} />
                </button>
                {openFaq === f.id && (
                  <div className="px-6 pb-5 text-sm text-white/45 leading-relaxed border-t border-white/5 pt-3">{f.answer}</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={createPageUrl('FAQ')} className="text-sm text-[#00D4FF] hover:text-[#00BBDD] font-bold transition-colors">
              Ver todas las preguntas →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="relative py-32 px-4 sm:px-6 overflow-hidden bg-[#0A1628]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(0,212,255,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_20%,rgba(123,97,255,0.06),transparent)]" />
        {/* Decorative ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-[#00D4FF]/5" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-[#7B61FF]/5" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-xs text-[#00D4FF] font-bold mb-8 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
            Únete a +5,000 inversores globales
          </div>
          <h2 className="text-5xl sm:text-6xl font-black mb-5 leading-tight text-white">
            Tu ventaja en los<br />mercados empieza<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-[#7B61FF]">aquí y ahora.</span>
          </h2>
          <p className="text-lg text-white/35 mb-10">
            Demo gratuita de $10,000 activada al instante. Sin depósito, sin papeleo.
          </p>
          <button
            onClick={() => window.location.href = createPageUrl('Register')}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#00D4FF] to-[#7B61FF] text-white font-black rounded-full text-xl transition-all hover:opacity-90 hover:scale-[1.03] shadow-2xl shadow-[#00D4FF]/15"
          >
            Abrir cuenta gratis
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/25 flex-wrap">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#00D4FF]/60" />Sin depósito inicial</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#00D4FF]/60" />Activación inmediata</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#00D4FF]/60" />50+ instrumentos</span>
          </div>
          <p className="text-xs text-white/15 mt-6">El trading de CFDs conlleva un riesgo significativo de pérdida de capital.</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
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
  BarChart3, Zap, Award, Trophy, Medal, BadgeCheck, Gem, Lock, CreditCard, Banknote
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
  { icon: Users, title: 'Somos Sociales', desc: 'Más de 5,000 traders activos operando en nuestra plataforma cada día' },
  { icon: FileText, title: 'Somos Fiables', desc: 'Referentes en tecnología de trading educacional desde 2020' },
  { icon: Shield, title: 'Somos Seguros', desc: 'Triple verificación y protección de cuentas con estándares institucionales' },
  { icon: Globe, title: 'Somos Globales', desc: 'Operamos en más de 50 países con soporte multilingüe 24/7' },
];

const STATS = [
  { value: '0.0', label: 'Spreads desde pips' },
  { value: '<5ms', label: 'Velocidad de ejecución' },
  { value: '$5', label: 'Depósito mínimo demo' },
  { value: '1:500', label: 'Apalancamiento máx.' },
];

const FEATURES = [
  { icon: BarChart3, title: 'Gráficos profesionales', desc: 'Velas japonesas, indicadores técnicos y múltiples marcos temporales. Una interfaz idéntica a la de los brokers reales del mercado.', accent: '#1a1aff', tag: 'Análisis técnico' },
  { icon: Zap, title: 'Ejecución ultrarrápida', desc: 'Órdenes procesadas en milisegundos mediante conexión directa a los mercados. Opera sin slippage y con precios reales al instante.', accent: '#80cc00', tag: 'Ultra-rápido' },
  { icon: TrendingUp, title: 'Métricas avanzadas', desc: 'Curva de capital, tasa de acierto, drawdown máximo y P&L detallado. Análisis institucional completo de tu rendimiento como trader.', accent: '#7C3AED', tag: 'Analítica pro' },
  { icon: Shield, title: 'Cuenta demo gratuita', desc: '$10,000 en cuenta demo para practicar estrategias reales sin arriesgar capital. Actívate al instante, sin depósito previo requerido.', accent: '#f59e0b', tag: 'Sin riesgo' },
];

const MARKETS = [
  { icon: TrendingUp, label: 'Criptomonedas', desc: 'Opera el valor de las criptomonedas más populares del mercado', symbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'], color: '#1a1aff', bg: '#1a1aff15' },
  { icon: BarChart3, label: 'Forex', desc: 'Opera el valor de una divisa frente a otra en tiempo real', symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY'], color: '#80cc00', bg: '#80cc0015' },
  { icon: Globe, label: 'Materias Primas', desc: 'Opera el valor de las commodities más importantes del mundo', symbols: ['XAUUSD', 'XAGUSD', 'WTI'], color: '#f59e0b', bg: '#f59e0b15' },
  { icon: Zap, label: 'Índices', desc: 'Opera cestas de acciones de los principales mercados globales', symbols: ['SPX500', 'NAS100', 'GER40'], color: '#7C3AED', bg: '#7C3AED15' },
];

const STEPS = [
  { n: '01', title: 'Abre tu cuenta', desc: 'Registro en 30 segundos. Cuenta demo con $10,000 activada al instante, sin depósito ni documentación previa.' },
  { n: '02', title: 'Elige tu mercado', desc: 'Accede a criptos, forex, commodities e índices con precios en tiempo real y herramientas institucionales.' },
  { n: '03', title: 'Opera y mejora', desc: 'Ejecuta operaciones, analiza tu P&L y perfecciona tu estrategia con métricas de nivel profesional.' },
];

const SECURITY_ITEMS = [
  { icon: Lock, label: 'Tus fondos están seguros y protegidos' },
  { icon: Shield, label: 'Sin cargos ocultos ni letra pequeña' },
  { icon: CreditCard, label: 'Fondos en cuentas segregadas' },
  { icon: Zap, label: 'Depósitos instantáneos y retiros rápidos' },
  { icon: Banknote, label: 'Alianzas con bancos de primer nivel' },
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
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'text-[#80cc00] fill-[#80cc00]' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

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
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-inter">
      <PublicNav currentPage="Home" />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0B0F1A] overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(201,168,76,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(201,168,76,0.06),transparent)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-12 items-center py-24">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 text-xs text-[#C9A84C] font-bold mb-8 tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
              En Vivo · Mercados en tiempo real
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6 text-white">
              Invierte con<br />precisión,<br />
              <span className="text-[#C9A84C]">crece con visión.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/55 leading-relaxed mb-10 max-w-lg">
              Tecnología de trading de nivel institucional al alcance de cualquier inversor. Spreads desde 0.0 pips, ejecución ultrarrápida y herramientas profesionales.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => window.location.href = createPageUrl('Register')}
                className="group flex items-center gap-2 px-8 py-4 bg-[#C9A84C] hover:bg-[#b8943f] text-[#0B0F1A] font-black rounded-full transition-all text-base shadow-xl shadow-[#C9A84C]/20 hover:scale-[1.03]"
              >
                Abrir Cuenta
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to={createPageUrl('Register')}
                className="flex items-center gap-2 px-6 py-4 bg-transparent text-white/70 font-semibold rounded-full border border-white/15 hover:border-white/35 hover:text-white transition-all text-base"
              >
                Cuenta demo gratuita
              </Link>
            </div>

            <div className="text-xs text-white/30 font-medium">
              El trading de CFDs conlleva un riesgo significativo de pérdida de capital.
            </div>
          </div>

          {/* Right: platform mockup */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 bg-[#C9A84C]/8 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0D1120] border border-[#C9A84C]/20 rounded-2xl shadow-2xl overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#090D18]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef5350]/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]/70" />
                <div className="ml-3 flex-1 h-5 bg-white/5 rounded-md px-2 flex items-center">
                  <span className="text-[10px] text-white/25">orioncapital.io/portal/charts</span>
                </div>
              </div>
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-[#090D18]">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">EUR/USD</span>
                  <span className="text-[10px] text-white/30">Euro / Dólar</span>
                  <span className="text-lg font-mono font-black text-white">1.0850</span>
                  <span className="text-xs font-mono font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded">▲ +0.12%</span>
                </div>
                <div className="flex gap-1 text-[10px] text-white/30">
                  {['1m','5m','1h','1D','1W'].map(t => (
                    <button key={t} className={`px-2 py-0.5 rounded ${t === '1D' ? 'bg-[#C9A84C]/20 text-[#E8C97A]' : 'hover:bg-white/5'}`}>{t}</button>
                  ))}
                </div>
              </div>
              {/* Chart */}
              <div className="relative h-44 bg-[#090D18] px-4 pt-4 pb-1">
                {[0,25,50,75,100].map(p => (
                  <div key={p} className="absolute left-4 right-0 border-t border-white/[0.04]" style={{ top: `${100 - p}%` }} />
                ))}
                <div className="flex items-end gap-1 h-full">
                  {CANDLES.map((c, i) => {
                    const bodyH = Math.abs(c.c - c.o);
                    const bodyTop = 100 - Math.max(c.o, c.c);
                    const color = c.up ? '#C9A84C' : '#ef5350';
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
              <div className="grid grid-cols-2 gap-2 p-3 bg-[#090D18] border-t border-white/5">
                <div className="bg-[#26a69a]/10 border border-[#26a69a]/20 rounded-xl p-3">
                  <div className="text-[10px] text-[#26a69a] font-semibold uppercase mb-1">Comprar</div>
                  <div className="text-xs text-white/40 mb-1">1.00 lote</div>
                  <div className="text-sm font-bold text-[#26a69a]">1.0850</div>
                </div>
                <div className="bg-[#ef5350]/10 border border-[#ef5350]/20 rounded-xl p-3">
                  <div className="text-[10px] text-[#ef5350] font-semibold uppercase mb-1">Vender</div>
                  <div className="text-xs text-white/40 mb-1">0.50 lote</div>
                  <div className="text-sm font-bold text-[#ef5350]">1.0848</div>
                </div>
              </div>
              {/* Equity */}
              <div className="px-3 pb-3 flex items-center justify-between border-t border-white/5 pt-2">
                <div className="text-[10px] text-white/30">Balance total</div>
                <div className="text-xs font-bold text-white">$12,840.50</div>
                <div className="text-[10px] font-bold text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-0.5 rounded-full">+28.4%</div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -bottom-4 -left-10 bg-[#0D1120] border border-[#C9A84C]/30 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-[#C9A84C]" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Orden ejecutada</div>
                <div className="text-[10px] text-white/40">EUR/USD · Buy · 1.0850</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-6 bg-[#0D1120] border border-[#C9A84C]/25 rounded-2xl px-4 py-3 shadow-2xl">
              <div className="text-[10px] text-white/40 mb-0.5">P&L Hoy</div>
              <div className="text-lg font-black text-[#C9A84C]">+$2,840</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ TICKER ══════════════ */}
      <div className="bg-[#C9A84C] py-2.5 overflow-hidden">
        <div className="flex gap-10 animate-ticker whitespace-nowrap px-6">
          {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs">
              <span className="font-bold text-[#0B0F1A] tracking-wide">{t.symbol}</span>
              <span className="font-mono text-[#0B0F1A]/70">{t.price}</span>
              <span className={`font-mono font-bold ${t.up ? 'text-[#0B0F1A]' : 'text-red-800'}`}>{t.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════ STATS BAND ══════════════ */}
      <div className="bg-white border-b border-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#C9A84C] mb-1">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ MARKETS ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-3 block">Nuestros Mercados</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Del forex al cripto,<br />commodities a acciones.</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Elige tu mercado, personaliza tu enfoque y opera a tu manera con las herramientas de precisión que necesitas.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MARKETS.map((m, i) => {
              const MIcon = m.icon;
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-[#1a1aff]/20 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: m.bg }}>
                    <MIcon className="h-6 w-6" style={{ color: m.color }} />
                  </div>
                  <h3 className="font-black text-gray-900 text-base mb-2">{m.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{m.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.symbols.map(s => (
                      <span key={s} className="text-[10px] px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-gray-500 font-mono font-semibold">{s}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold" style={{ color: m.color }}>
                    Ver más <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ TRADE WITH US ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0B0F1A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_80%_50%,rgba(201,168,76,0.08),transparent)]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-3 block">Opera con Orion Capital</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Elección de traders<br />en todo el mundo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRUST_CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-[#C9A84C]/30 transition-all group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center mb-4 group-hover:bg-[#C9A84C]/25 transition-colors">
                    <Icon className="h-6 w-6 text-[#C9A84C]" />
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{c.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block">Cómo funciona</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Empieza en <span className="text-[#C9A84C]">3 pasos</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <div key={i} className="relative text-center group">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#C9A84C]/8 border-2 border-[#C9A84C]/25 text-[#C9A84C] text-3xl font-black mb-5 mx-auto group-hover:border-[#C9A84C]/60 group-hover:bg-[#C9A84C]/12 transition-all">
                  {s.n}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FEATURES (dark) ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0B0F1A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-4 block">Herramientas y recursos</span>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-white">
                Empieza tu viaje<br /><span className="text-[#C9A84C]">con Orion Capital.</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8">
                Todo lo que necesitas para operar como un profesional. Desde gráficos avanzados hasta calendarios económicos y cursos de formación.
              </p>
              <button
                onClick={() => window.location.href = createPageUrl('Register')}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#C9A84C] hover:bg-[#b8943f] text-[#0B0F1A] font-black rounded-full transition-all text-sm shadow-lg shadow-[#C9A84C]/20"
              >
                Abrir cuenta gratis <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:border-white/15 hover:bg-white/[0.06] transition-all group">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${f.accent}18` }}>
                        <Icon className="h-4 w-4" style={{ color: f.accent }} />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: `${f.accent}18`, color: f.accent }}>{f.tag}</span>
                    </div>
                    <h3 className="font-black text-white text-sm mb-2">{f.title}</h3>
                    <p className="text-xs text-white/45 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ SECURITY ══════════════ */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-4 block">Seguridad de fortaleza</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Trading seguro,<br />tranquilidad total.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Tu capital merece protección de nivel militar y gestión transparente. Nuestra tecnología de vanguardia garantiza ejecución al instante y te ayuda a identificar las mejores oportunidades con precisión.
            </p>
            <Link
              to={createPageUrl('About')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#C9A84C] hover:bg-[#b8943f] text-[#0B0F1A] font-black rounded-full transition-all text-sm shadow-lg shadow-[#C9A84C]/25"
            >
              Conoce nuestras cuentas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {SECURITY_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/3 transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A84C]/20 transition-colors">
                    <Icon className="h-5 w-5 text-[#C9A84C]" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#C9A84C] uppercase tracking-[0.2em] mb-3 block">Confiado globalmente</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Lo que dicen<br />nuestros traders</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.slice(0, 6).map((t) => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-[#C9A84C]/20">
                  <StarRating rating={t.rating || 5} />
                  <p className="text-gray-600 text-sm leading-relaxed my-4">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#0B0F1A] flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to={createPageUrl('Testimonials')} className="text-sm text-[#C9A84C] hover:text-[#b8943f] font-bold transition-colors">
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
              <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mb-3 block">Reconocimientos del grupo</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Premios & Excelencia</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.slice(0, 6).map((a, idx) => {
                const awardIcons = [Trophy, Medal, BadgeCheck, Gem, Award, Star];
                const awardColors = ['#f59e0b', '#1a1aff', '#80cc00', '#7C3AED', '#ef5350', '#06b6d4'];
                const awardBgs = ['#f59e0b15', '#1a1aff15', '#80cc0015', '#7C3AED15', '#ef535015', '#06b6d415'];
                const AIcon = awardIcons[idx % awardIcons.length];
                const aColor = awardColors[idx % awardColors.length];
                const aBg = awardBgs[idx % awardBgs.length];
                return (
                  <div key={a.id} className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all group cursor-default">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border" style={{ background: aBg, borderColor: aColor + '30' }}>
                      <AIcon className="h-5 w-5" style={{ color: aColor }} />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm mb-0.5">{a.title}</div>
                      <div className="text-xs font-bold" style={{ color: aColor }}>{a.issuer} · {a.year}</div>
                      {a.description && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{a.description}</p>}
                    </div>
                  </div>
                );
              })}
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
                  <span className="font-bold text-gray-900 pr-4">{f.question}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === f.id ? 'rotate-180 text-[#1a1aff]' : ''}`} />
                </button>
                {openFaq === f.id && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{f.answer}</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to={createPageUrl('FAQ')} className="text-sm text-[#C9A84C] hover:text-[#b8943f] font-bold transition-colors">
              Ver todas las preguntas →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section className="relative py-32 px-4 sm:px-6 overflow-hidden bg-[#0B0F1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(201,168,76,0.10),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_85%_15%,rgba(201,168,76,0.05),transparent)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/25 text-xs text-[#C9A84C] font-bold mb-8 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
            Plataforma activa · Únete hoy
          </div>
          <h2 className="text-5xl sm:text-6xl font-black mb-5 leading-tight text-white">
            ¿Listo para invertir<br />como un <span className="text-[#C9A84C]">profesional?</span>
          </h2>
          <p className="text-lg text-white/40 mb-10">
            Cuenta demo gratuita activada al instante. Sin esperas, sin depósito previo.
          </p>
          <button
            onClick={() => window.location.href = createPageUrl('Register')}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-[#C9A84C] hover:bg-[#b8943f] text-[#0B0F1A] font-black rounded-full text-xl transition-all shadow-2xl shadow-[#C9A84C]/20 hover:scale-[1.04]"
          >
            Abrir cuenta ahora
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/30 flex-wrap">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#C9A84C]" />Cuenta demo $10K</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#C9A84C]" />Spreads desde 0.0 pips</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#C9A84C]" />Activación inmediata</span>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
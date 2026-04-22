import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import {
  BarChart3, Wifi, BookOpen, LineChart, ArrowRight, CheckCircle2,
  Globe, TrendingUp, ShieldCheck, Layers, Activity, CandlestickChart,
  Zap, Lock, BarChart2, Target
} from 'lucide-react';

// ── TRADING ──────────────────────────────────────────────────────────────────
const TRADING_FEATURES = [
  {
    icon: CandlestickChart, color: '#1E40AF', bg: '#1E40AF15',
    title: 'Gráficos de velas profesionales',
    tag: 'Análisis técnico',
    desc: 'Visualiza el mercado con velas japonesas OHLC completas, barras de volumen y cambios de marco temporal al instante. Diseñado para el análisis técnico serio.',
    features: ['Velas japonesas y gráfico de línea', 'SMA 20 y SMA 50 integradas', 'Barras de volumen en tiempo real', '5 marcos temporales: 1m, 5m, 15m, 1h, 1D'],
    mockup: [
      { label: 'AAPL', val: '$266.17', chg: '+1.2%', up: true },
      { label: 'TSLA', val: '$386.48', chg: '+3.1%', up: true },
      { label: 'NVDA', val: '$98.75', chg: '-0.9%', up: false },
    ]
  },
  {
    icon: Zap, color: '#2563EB', bg: '#2563EB15',
    title: 'Ejecución de órdenes instantánea',
    tag: 'Motor de trading',
    desc: 'Envía órdenes de mercado en milisegundos. Validación de saldo automática, protección de saldo negativo y confirmación inmediata en cada operación.',
    features: ['Órdenes de mercado con 1 clic', 'Validación de saldo automática', 'Take Profit y Stop Loss configurables', 'Historial de operaciones completo'],
    mockup: [
      { label: 'Orden ejecutada', val: 'BUY 10 AAPL', chg: '@$266.17', up: true },
      { label: 'Margen usado', val: '$532.34', chg: '2x apal.', up: null },
      { label: 'P&L no realizado', val: '+$24.80', chg: '+4.6%', up: true },
    ]
  },
  {
    icon: BarChart2, color: '#1D4ED8', bg: '#1D4ED815',
    title: 'Indicadores técnicos avanzados',
    tag: 'Indicadores',
    desc: 'Activa medias móviles, RSI, bandas de Fibonacci y EMAs directamente sobre el gráfico. Sin configuración compleja, todo en un solo clic.',
    features: ['RSI (14) con zonas OB/OS', 'EMA 9, 21 y 50 superpuestas', 'Retrocesos de Fibonacci automáticos', 'Leyenda de indicadores activos'],
    mockup: [
      { label: 'RSI(14)', val: '58.4', chg: 'Neutral', up: null },
      { label: 'SMA 20', val: '$263.80', chg: 'Soporte', up: true },
      { label: 'Fib 61.8%', val: '$258.42', chg: 'Nivel clave', up: null },
    ]
  },
];

// ── MERCADOS ──────────────────────────────────────────────────────────────────
const MARKET_SECTIONS = [
  {
    icon: TrendingUp, color: '#1E40AF', bg: '#1E40AF15',
    title: 'Acciones y ETFs',
    tag: 'Renta variable',
    desc: 'Opera las empresas más influyentes del mundo, listadas en NYSE y NASDAQ. Desde gigantes tecnológicos hasta líderes de consumo, con precios en tiempo real y análisis técnico integrado.',
    features: ['AAPL, MSFT, NVDA, TSLA, AMZN, META', 'ETFs: SPY, QQQ, IWM, GLD, SLV', 'Datos de mercado en tiempo real', 'Gráficos históricos desde 1 minuto'],
    mockup: [
      { label: 'AAPL', val: '$266.17', chg: '+1.50%', up: true },
      { label: 'SPY', val: '$704.08', chg: '+0.31%', up: true },
      { label: 'META', val: '$672.70', chg: '+0.91%', up: true },
    ]
  },
  {
    icon: Globe, color: '#2563EB', bg: '#2563EB15',
    title: 'Forex y Divisas',
    tag: 'Mercado de cambio',
    desc: 'El mercado de divisas más líquido del mundo, disponible 24/5. Opera los principales pares (EUR/USD, GBP/USD, USD/JPY) y cruces con spreads competitivos.',
    features: ['Pares mayores: EUR/USD, GBP/USD, USD/JPY', 'Cruces: EUR/GBP, GBP/JPY, AUD/JPY', 'Forex emergentes: USD/MXN, USD/BRL', 'Spreads desde 0.0 pips'],
    mockup: [
      { label: 'EUR/USD', val: '1.1767', chg: '+0.22%', up: true },
      { label: 'GBP/USD', val: '1.3642', chg: '+0.18%', up: true },
      { label: 'USD/MXN', val: '19.85', chg: '-0.41%', up: false },
    ]
  },
  {
    icon: Activity, color: '#1D4ED8', bg: '#1D4ED815',
    title: 'Criptomonedas y Materias Primas',
    tag: 'Activos alternativos',
    desc: 'Diversifica tu portafolio con los principales activos digitales y materias primas. Oro, plata, petróleo y las principales criptomonedas del mercado en un solo lugar.',
    features: ['Bitcoin (BTC), Ethereum (ETH), Solana', 'Oro (XAU/USD), Plata (XAG/USD)', 'Petróleo WTI y Brent', 'Más de 30 criptomonedas disponibles'],
    mockup: [
      { label: 'BTC/USD', val: '$75,901', chg: '+1.33%', up: true },
      { label: 'XAU/USD', val: '$4,794', chg: '+0.85%', up: true },
      { label: 'ETH/USD', val: '$1,580', chg: '-1.20%', up: false },
    ]
  },
];

// ── PLATAFORMA ────────────────────────────────────────────────────────────────
const PLATFORM_SECTIONS = [
  {
    icon: ShieldCheck, color: '#1E40AF', bg: '#1E40AF15',
    title: 'Seguridad y protección de capital',
    tag: 'Seguridad',
    desc: 'Tu capital está protegido con los más altos estándares de la industria financiera. Fondos segregados, cifrado AES-256 y protección automática de saldo negativo.',
    features: ['Fondos completamente segregados', 'Cifrado bancario AES-256 en tránsito', 'Protección contra saldo negativo', 'Autenticación de dos factores (2FA)'],
  },
  {
    icon: Layers, color: '#2563EB', bg: '#2563EB15',
    title: 'Cartera y análisis de rendimiento',
    tag: 'Analítica',
    desc: 'Sigue la evolución de tu portafolio con métricas institucionales. Curva de capital, tasa de acierto, caída máxima y exportación del historial de operaciones en CSV.',
    features: ['Curva de capital en tiempo real', 'Tasa de acierto y ratio R/R', 'Caída máxima (drawdown)', 'Exportación CSV de historial'],
  },
  {
    icon: BookOpen, color: '#1D4ED8', bg: '#1D4ED815',
    title: 'Cuenta demo con capital virtual',
    tag: 'Práctica sin riesgo',
    desc: 'Empieza a operar de inmediato con $10,000 de capital virtual. Practica estrategias, familiarízate con la plataforma y gana confianza antes de invertir capital real.',
    features: ['$10,000 virtuales activados al instante', 'Acceso completo a todos los instrumentos', 'Condiciones de mercado idénticas a la cuenta real', 'Posibilidad de resetear el saldo demo'],
  },
  {
    icon: Target, color: '#1E40AF', bg: '#1E40AF15',
    title: 'Soporte y acompañamiento 24/5',
    tag: 'Soporte',
    desc: 'Nuestro equipo de especialistas está disponible durante toda la sesión de mercado para resolver dudas técnicas, ayudarte con depósitos y acompañarte en tus primeras operaciones.',
    features: ['Chat en vivo durante sesión de mercado', 'Soporte por correo y ticket', 'Guías y tutoriales integrados', 'Centro de ayuda con preguntas frecuentes'],
  },
];

function MockupCard({ items }) {
  return (
    <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-[#1E40AF] px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
        </div>
        <span className="text-xs text-white/60 font-medium ml-1">Orion Capital · Portal</span>
      </div>
      <div className="divide-y divide-gray-50">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm font-bold text-gray-700">{item.label}</span>
            <div className="text-right">
              <div className="text-sm font-black text-gray-900">{item.val}</div>
              <div className={`text-[11px] font-semibold ${item.up === true ? 'text-green-600' : item.up === false ? 'text-red-500' : 'text-gray-400'}`}>{item.chg}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const getInitialTab = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'mercados' || tab === 'plataforma') return tab;
    return 'trading';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  const TABS = [
    { id: 'trading', label: 'Trading' },
    { id: 'mercados', label: 'Mercados' },
    { id: 'plataforma', label: 'Plataforma' },
  ];

  const TAB_HERO = {
    trading: {
      badge: 'Herramientas de Trading',
      title: <>Opera con precisión y<br /><span className="text-[#1E40AF]">análisis profesional</span></>,
      desc: 'Gráficos avanzados, ejecución ultrarrápida e indicadores técnicos en tiempo real. Todo lo que un trader serio necesita para tomar decisiones informadas.',
    },
    mercados: {
      badge: 'Mercados Globales',
      title: <>Accede a los mercados<br /><span className="text-[#1E40AF]">más importantes del mundo</span></>,
      desc: '184 instrumentos en un solo lugar: acciones, ETFs, Forex, criptomonedas y materias primas. Opera cualquier activo global desde una sola cuenta.',
    },
    plataforma: {
      badge: 'Tecnología de Nivel Institucional',
      title: <>Una plataforma construida<br /><span className="text-[#1E40AF]">para traders de verdad</span></>,
      desc: 'Seguridad bancaria, análisis de rendimiento, cuenta demo y soporte 24/5. La infraestructura que necesitas para operar con confianza cada día.',
    },
  };

  const hero = TAB_HERO[activeTab];
  const sections = activeTab === 'trading' ? TRADING_FEATURES : activeTab === 'mercados' ? MARKET_SECTIONS : PLATFORM_SECTIONS;

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <PublicNav currentPage="Product" />

      {/* Tabs — sticky, encima del hero para que el estado ya esté listo */}
      <div className="sticky top-[88px] z-30 bg-white border-b border-gray-200 shadow-sm pt-[88px] -mt-[88px]">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 py-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1E40AF] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero — cambia según tab activo */}
      <section className="relative pt-16 pb-12 px-4 text-center overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#EFF6FF] to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E40AF] font-semibold mb-6 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#1E40AF] animate-pulse" />
            {hero.badge}
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-5 leading-tight text-gray-900">
            {hero.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-4 max-w-2xl mx-auto">
            {hero.desc}
          </p>
        </div>
      </section>

      {/* Tab content */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto space-y-20">
          {sections.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={`${activeTab}-${i}`} className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: f.bg }}>
                      <Icon className="h-5 w-5" style={{ color: f.color }} />
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold border" style={{ color: f.color, background: f.bg, borderColor: f.color + '30' }}>{f.tag}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">{f.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-6">{f.desc}</p>
                  <ul className="space-y-2.5">
                    {f.features.map(feat => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#1E40AF]" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 flex flex-col gap-4">
                  {f.mockup ? (
                    <MockupCard items={f.mockup} />
                  ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl p-10 flex items-center justify-center shadow-sm h-52">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: f.bg }}>
                        <Icon className="h-10 w-10" style={{ color: f.color }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instruments strip */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">184 instrumentos disponibles</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Opera los activos que mueven el mercado</h2>
          <p className="text-gray-500 mb-8">Acciones, ETFs, Forex, Criptomonedas y Materias Primas en una sola cuenta.</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {['AAPL','MSFT','NVDA','TSLA','AMZN','META','GOOGL','SPY','QQQ','IWM','EUR/USD','GBP/USD','USD/JPY','USD/MXN','BTC/USD','ETH/USD','SOL/USD','XAU/USD','XAG/USD','WTI'].map(s => (
              <span key={s} className="px-3.5 py-1.5 bg-[#F8FAFC] border border-gray-200 rounded-lg text-sm font-mono text-gray-600 hover:border-[#1E40AF]/40 hover:text-[#1E40AF] transition-all">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-4 text-center overflow-hidden bg-[#1E40AF]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(255,255,255,0.06),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-white">Abre tu cuenta hoy</h2>
          <p className="text-white/60 mb-8">Cuenta demo con $10,000 virtuales activada en segundos</p>
          <button onClick={() => window.location.href = createPageUrl('Register')}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-[#1E40AF] font-bold rounded-lg transition-all shadow-lg hover:scale-[1.02]">
            Abrir cuenta gratis <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
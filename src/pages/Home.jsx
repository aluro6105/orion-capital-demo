import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ArrowRight, Users, Shield, Globe, Star, ChevronDown, CheckCircle2,
  TrendingUp, BarChart3, Zap, Award, Trophy, Medal, BadgeCheck, Gem,
  Lock, CreditCard, Activity, LineChart, Layers, Cpu, Bell, Smartphone,
  BookOpen, Target
} from 'lucide-react';

// ── PALETA CORPORATIVA ────────────────────────────────────────────────────────
// Fondo           : #FFFFFF / #F8FAFC (gris muy claro)
// Acento primario : #1E40AF  (azul corporativo oscuro)
// Acento claro    : #2563EB  (azul medio)
// Texto           : #111827 / #374151 / #6B7280
// Bordes          : #E5E7EB
// Sección oscura  : #0F172A (solo footer y CTA final)
// ─────────────────────────────────────────────────────────────────────────────

const TICKER_DATA = [
  { symbol: 'AAPL', price: '$232.15', change: '+1.50%', up: true },
  { symbol: 'MSFT', price: '$418.73', change: '-0.51%', up: false },
  { symbol: 'TSLA', price: '$278.42', change: '+3.24%', up: true },
  { symbol: 'NVDA', price: '$134.50', change: '+1.65%', up: true },
  { symbol: 'AMZN', price: '$221.34', change: '-0.47%', up: false },
  { symbol: 'GOOGL', price: '$173.82', change: '+1.12%', up: true },
  { symbol: 'BTC-USD', price: '$94,820', change: '+1.33%', up: true },
  { symbol: 'ETH-USD', price: '$3,180', change: '-1.31%', up: false },
  { symbol: 'S&P 500', price: '$5,842', change: '+0.31%', up: true },
  { symbol: 'DJI', price: '$43,218', change: '-0.20%', up: false },
  { symbol: 'WALMEX.MX', price: '$68.42', change: '+1.26%', up: true },
  { symbol: 'META', price: '$598.20', change: '+0.91%', up: true },
];

const STATS = [
  { value: '$24M+', label: 'Volumen mensual operado' },
  { value: '184', label: 'Instrumentos disponibles' },
  { value: '20+', label: 'Países con operaciones' },
  { value: '6+', label: 'Años de trayectoria' },
];

const MARKETS = [
  { icon: BarChart3, label: 'Acciones', desc: 'Opera acciones de NYSE, NASDAQ y BMV con herramientas profesionales y ejecución en milisegundos.', tag: 'Mercado MX y USA' },
  { icon: Layers, label: 'ETFs Globales', desc: 'Más de 500 ETFs que cubren índices, sectores y geografías del mundo en un solo clic.', tag: '500+ ETFs' },
  { icon: Activity, label: 'Criptomonedas', desc: 'Exposición al ecosistema cripto: Bitcoin, Ethereum y empresas del sector blockchain.', tag: 'BTC, ETH y más' },
  { icon: LineChart, label: 'Forex', desc: 'Opera los pares de divisas más líquidos del mundo con spreads desde 0.0 pips.', tag: 'Major & Minor' },
  { icon: Globe, label: 'Materias Primas', desc: 'Oro, plata, petróleo y más. Diversifica tu portafolio con commodities globales.', tag: 'Oro, Petróleo, Plata' },
  { icon: Cpu, label: 'Derivados y Opciones', desc: 'Estrategias avanzadas con opciones y futuros para maximizar rendimientos y gestionar riesgo.', tag: 'Avanzado' },
];

const WHY_ITEMS = [
  { icon: Zap, title: 'Ejecución ultrarrápida', desc: 'Órdenes ejecutadas en menos de 10 milisegundos. Sin latencia, sin slippage injustificado.' },
  { icon: Globe, title: 'Acceso a múltiples mercados', desc: 'NYSE, NASDAQ, Forex, Cripto y materias primas desde una sola cuenta unificada sin restricciones.' },
  { icon: Users, title: 'Mesa de trading 24/5', desc: 'Equipo de expertos disponibles durante toda la sesión. Soporte técnico en español, siempre.' },
  { icon: Lock, title: 'Seguridad bancaria', desc: 'Cifrado AES-256, autenticación de dos factores y cumplimiento regulatorio internacional.' },
];

const ADVANTAGES = [
  { icon: TrendingUp, title: 'Rendimientos superiores', desc: 'Nuestros traders obtienen en promedio rendimientos 4.2x mayores que los índices gracias a nuestras herramientas de análisis.' },
  { icon: Shield, title: 'Gestión de riesgo inteligente', desc: 'Stop-loss dinámicos, límites de exposición y alertas automáticas protegen tu capital en todo momento.' },
  { icon: Target, title: 'Estrategias personalizadas', desc: 'Desde scalping intradía hasta inversión a largo plazo, adaptamos las herramientas a tu estilo.' },
  { icon: BookOpen, title: 'Educación continua', desc: 'Webinars semanales, análisis diarios y tutoriales en video para que nunca dejes de crecer.' },
];

const STEPS = [
  { n: '01', title: 'Crea tu cuenta', desc: 'Registro en menos de 5 minutos. Cuenta demo de $10,000 activa al instante, sin depósito previo.' },
  { n: '02', title: 'Elige tus mercados', desc: 'Accede a más de 6,000 instrumentos globales con precios en tiempo real y análisis profesional.' },
  { n: '03', title: 'Opera y escala', desc: 'Ejecuta tus estrategias, analiza tu rendimiento y haz crecer tu portafolio con confianza.' },
];

const SECURITY_ITEMS = [
  { icon: Lock, label: 'Cifrado bancario AES-256 en todas las transacciones' },
  { icon: Shield, label: 'Protección de saldo negativo garantizada' },
  { icon: CreditCard, label: 'Fondos completamente segregados y auditados' },
  { icon: Zap, label: 'Depósitos y retiros procesados en tiempo récord' },
  { icon: Globe, label: 'Cumplimiento regulatorio: SEC, FINRA, CNBV, CMF' },
];

const PORTFOLIO_ITEMS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$134.50', change: '+1.65%', up: true },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$232.15', change: '+1.50%', up: true },
  { symbol: 'BTC', name: 'Bitcoin', price: '$94,820', change: '+1.33%', up: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$278.42', change: '-0.82%', up: false },
];

const STATIC_TESTIMONIALS = [
  { name: 'Carlos Mendoza', role: 'Trader independiente', company: 'Ciudad de México, MX', text: 'Orion Capital transformó completamente mi forma de operar. La plataforma es rápida y el equipo de asesoría siempre está disponible. Llevo más de un año con ellos y los resultados han superado mis expectativas.', rating: 5 },
  { name: 'Andrea Rodríguez', role: 'Gestora de portafolios', company: 'Buenos Aires, AR', text: 'Como gestora necesitaba una plataforma robusta con acceso a mercados globales. Orion Capital ofrece herramientas institucionales con una interfaz muy intuitiva. El análisis técnico es de primer nivel.', rating: 5 },
  { name: 'Miguel Torres', role: 'Empresario e inversionista', company: 'Bogotá, CO', text: 'Empecé con una cuenta demo y hoy manejo un portafolio diversificado en acciones, ETFs y activos digitales. La plataforma me dio las bases para tomar decisiones más informadas.', rating: 5 },
  { name: 'Valentina Cruz', role: 'Analista financiera', company: 'Santiago, CL', text: 'Lo que más valoro de Orion Capital es la transparencia. Sin comisiones ocultas, spreads claros y soporte real cuando lo necesitas. Es la plataforma que recomiendo a quienes inician en el trading.', rating: 5 },
];

const AWARDS_STATIC = [
  { title: 'Mejor Plataforma de Trading en Latinoamérica', issuer: 'Euromoney Awards', year: 2024 },
  { title: 'Mejor Broker Digital LATAM', issuer: 'Global Finance Magazine', year: 2024 },
  { title: 'Fintech del Año en América Latina', issuer: 'Finnovista · Fintech Radar', year: 2023 },
  { title: 'Premio a la Innovación Financiera LATAM', issuer: 'Latin Finance Awards', year: 2023 },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'fill-[#1E40AF] text-[#1E40AF]' : 'text-gray-200 fill-gray-200'}`} />
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
  const displayTestimonials = testimonials.length > 0 ? testimonials.slice(0, 3) : STATIC_TESTIMONIALS;
  const displayAwards = awards.length > 0 ? awards.slice(0, 4) : AWARDS_STATIC;
  const displayFaqs = faqs.length > 0 ? faqs.slice(0, 5) : [
    { id: 1, question: '¿Cómo abro una cuenta en Orion Capital?', answer: 'El proceso de apertura toma menos de 5 minutos. Completa el formulario, verifica tu identidad y comienza a operar con una cuenta demo de $10,000 virtuales de forma inmediata, sin depósito previo.' },
    { id: 2, question: '¿Qué mercados están disponibles?', answer: 'Accede a más de 6,000 instrumentos en 25+ mercados globales: NYSE, NASDAQ, BMV, Forex, ETFs, criptomonedas, derivados y más, todo desde una sola cuenta unificada.' },
    { id: 3, question: '¿Cuál es la velocidad de ejecución?', answer: 'Nuestro sistema ejecuta órdenes en menos de 10 milisegundos. Sin latencia ni slippage injustificado, garantizando que tu estrategia se ejecute con precisión milimétrica.' },
    { id: 4, question: '¿Cómo están protegidos mis fondos?', answer: 'Tus fondos están protegidos bajo cifrado AES-256, autenticación de dos factores, cuentas segregadas y cumplimiento regulatorio de CNBV y SEC. Orion Capital opera bajo los más altos estándares de seguridad.' },
    { id: 5, question: '¿Existen costes ocultos?', answer: 'No. Orion Capital opera con total transparencia. Todos los spreads, comisiones y condiciones de trading se publican abiertamente. Sin sorpresas ni letra pequeña.' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-inter">
      <PublicNav currentPage="Home" />

      {/* ══════════ TICKER ══════════ */}
      <div className="bg-[#1E3A8A] border-b border-blue-900 pt-[88px] overflow-hidden">
        <div className="flex gap-8 animate-ticker whitespace-nowrap py-2 px-4">
          {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs">
              <span className="font-bold text-white/80 tracking-wide">{t.symbol}</span>
              <span className={`font-mono font-bold flex items-center gap-0.5 ${t.up ? 'text-green-300' : 'text-red-300'}`}>
                <span className="text-[9px]">{t.up ? '▲' : '▼'}</span>{t.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[#EFF6FF] clip-none" style={{clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0% 100%)'}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center py-24 lg:py-32">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E40AF] font-semibold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF] animate-pulse" />
              Mercados abiertos · Operar ahora
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6 text-gray-900">
              Opera con{' '}
              <span className="text-[#1E40AF]">ventaja</span>{' '}
              <span className="text-[#2563EB]">real</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-8 max-w-lg">
              Accede a cientos de activos globales — acciones, ETFs, divisas, commodities y criptomonedas — con la plataforma de inversión diseñada para el trader latinoamericano.
            </p>
            <div className="flex flex-wrap gap-2 mb-10">
              {['Ejecución rápida', '184 instrumentos', 'Spreads competitivos'].map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-600 font-medium border border-gray-200">
                  <CheckCircle2 className="h-3 w-3 text-[#1E40AF]" />{tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => window.location.href = createPageUrl('Register')}
                className="group flex items-center gap-2 px-8 py-4 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold rounded-lg transition-all text-base shadow-lg shadow-[#1E40AF]/20">
                Abrir cuenta gratis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link to={createPageUrl('Product')}
                className="flex items-center gap-2 px-6 py-4 text-[#1E40AF] font-semibold rounded-lg border-2 border-[#1E40AF]/20 hover:border-[#1E40AF]/50 hover:bg-[#EFF6FF] transition-all text-base">
                Ver mercados en vivo
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-6">El trading de CFDs conlleva un riesgo significativo de pérdida de capital.</p>
          </div>

          {/* Right: portfolio mockup */}
          <div className="relative hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-[#1E40AF] px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white/60 mb-0.5">Portafolio Total · Orion Capital</div>
                  <div className="text-2xl font-black text-white">$284,732<span className="text-lg">.00</span></div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/60">Hoy</div>
                  <div className="text-lg font-black text-green-300">+12.4%</div>
                </div>
              </div>
              {/* Chart */}
              <div className="p-4 bg-[#F8FAFC]">
                <svg viewBox="0 0 300 80" className="w-full h-20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.15"/>
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,70 C30,65 60,55 90,48 C120,40 150,45 180,35 C210,25 240,20 270,15 L300,10 L300,80 L0,80 Z" fill="url(#lineGrad2)" />
                  <path d="M0,70 C30,65 60,55 90,48 C120,40 150,45 180,35 C210,25 240,20 270,15 L300,10" fill="none" stroke="#1E40AF" strokeWidth="2" />
                </svg>
              </div>
              {/* Asset list */}
              <div className="divide-y divide-gray-100">
                {PORTFOLIO_ITEMS.map(item => (
                  <div key={item.symbol} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-xs font-black text-[#1E40AF]">{item.symbol[0]}</div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{item.symbol}</div>
                        <div className="text-[10px] text-gray-400">{item.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{item.price}</div>
                      <div className={`text-[10px] font-bold ${item.up ? 'text-green-600' : 'text-red-500'}`}>{item.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Badges */}
            <div className="absolute -top-4 -right-4 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#1E40AF]" />
              <div>
                <div className="text-[10px] text-gray-400">Ejecución</div>
                <div className="text-sm font-black text-gray-900">&lt; 10ms</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#1E40AF] rounded-xl px-4 py-3 shadow-lg">
              <div className="text-[10px] text-white/60 mb-0.5">Rendimiento anual</div>
              <div className="text-lg font-black text-white">+18.7%</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <div className="bg-[#1E40AF] py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-white/60 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MARKETS ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Instrumentos de trading</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Opera en todos los mercados<br />desde una sola cuenta</h2>
            <p className="text-gray-500 max-w-xl mx-auto">184 instrumentos financieros en los mercados más relevantes del mundo. Acciones, ETFs, Forex, Cripto y materias primas en una sola cuenta.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKETS.map((m, i) => {
              const MIcon = m.icon;
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#1E40AF]/30 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] flex items-center justify-center group-hover:bg-[#DBEAFE] transition-colors">
                      <MIcon className="h-5 w-5 text-[#1E40AF]" />
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] font-semibold">{m.tag}</span>
                  </div>
                  <h3 className="font-black text-gray-900 text-base mb-2">{m.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#1E40AF] opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ WHY ORION ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Por qué Orion Capital</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">El broker preferido de los<br />traders latinoamericanos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_ITEMS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-6 hover:border-[#1E40AF]/30 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center mb-4 group-hover:bg-[#DBEAFE] transition-colors">
                    <Icon className="h-6 w-6 text-[#1E40AF]" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{c.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#1E40AF]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-white/50 uppercase tracking-[0.2em] mb-3 block">Simple. Rápido. Efectivo.</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Empieza a operar en 3 pasos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map((s, i) => (
              <div key={i} className="relative text-center group">
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+44px)] right-[-calc(50%-44px)] h-px bg-white/20" />
                )}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 text-white text-3xl font-black mb-5 mx-auto group-hover:border-white/50 group-hover:bg-white/15 transition-all">
                  {s.n}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{s.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => window.location.href = createPageUrl('Register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-[#1E40AF] font-black rounded-lg transition-all shadow-lg">
              Crear mi cuenta gratis <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════ ADVANTAGES ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Ventajas competitivas</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Tu ventaja como<br />trader en Orion Capital</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Todo lo que necesitas para operar con confianza, eficiencia y resultados consistentes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ADVANTAGES.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex gap-5 bg-white border border-gray-200 rounded-xl p-6 hover:border-[#1E40AF]/30 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DBEAFE] transition-colors">
                    <Icon className="h-6 w-6 text-[#1E40AF]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">{a.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ SECURITY ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-4 block">Seguridad de nivel bancario</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Tu capital,<br /><span className="text-[#1E40AF]">siempre protegido.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Operamos bajo estándares de seguridad institucional. Tus fondos están completamente segregados, auditados y protegidos con cifrado de grado bancario.
            </p>
            <Link to={createPageUrl('About')}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold rounded-lg transition-all text-sm shadow-md">
              Conoce más sobre nosotros <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {SECURITY_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 bg-[#F8FAFC] border border-gray-200 rounded-xl px-5 py-4 hover:border-[#1E40AF]/30 hover:bg-[#EFF6FF] transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DBEAFE] transition-colors">
                    <Icon className="h-5 w-5 text-[#1E40AF]" />
                  </div>
                  <span className="font-semibold text-gray-700 text-sm">{item.label}</span>
                  <CheckCircle2 className="h-4 w-4 text-[#1E40AF] ml-auto flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Testimonios</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Lo que dicen nuestros traders</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Traders de toda Latinoamérica confían en Orion Capital para operar con confianza y hacer crecer su patrimonio.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayTestimonials.map((t, i) => (
              <div key={t.id || i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#1E40AF]/20 transition-all flex flex-col">
                <StarRating rating={t.rating || 5} />
                <p className="text-gray-600 text-sm leading-relaxed my-5 flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#1E40AF] flex items-center justify-center text-sm font-black text-white flex-shrink-0">
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
        </div>
      </section>

      {/* ══════════ AWARDS ══════════ */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Reconocimientos</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Líderes reconocidos en LATAM</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Organismos internacionales han reconocido nuestra excelencia en la industria financiera.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {displayAwards.map((a, idx) => {
              const icons = [Trophy, Medal, BadgeCheck, Gem];
              const AIcon = icons[idx % icons.length];
              return (
                <div key={a.id || idx} className="flex items-center gap-4 bg-[#F8FAFC] border border-gray-200 rounded-xl p-5 hover:border-[#1E40AF]/30 hover:shadow-md transition-all group">
                  <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DBEAFE] transition-colors">
                    <AIcon className="h-5 w-5 text-[#1E40AF]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E40AF] mb-0.5">{a.year}</div>
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{a.title}</div>
                    <div className="text-xs text-gray-400">{a.issuer}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-5 font-semibold">Regulado y respaldado por</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['FSA', 'CySEC', 'DFSA'].map(r => (
                <div key={r} className="px-4 py-2 bg-[#F8FAFC] border border-gray-200 rounded-lg text-xs font-black text-gray-500">{r}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Soporte</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-2">
            {displayFaqs.map((f) => (
              <div key={f.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#1E40AF]/30 transition-all">
                <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#F8FAFC] transition-colors">
                  <span className="font-bold text-gray-900 pr-4 text-sm">{f.question}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === f.id ? 'rotate-180 text-[#1E40AF]' : ''}`} />
                </button>
                {openFaq === f.id && (
                  <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-3">{f.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="relative py-28 px-4 sm:px-6 overflow-hidden bg-[#1E40AF]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.06),transparent)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-white/60 uppercase tracking-[0.2em] mb-4">Apertura de cuenta en menos de 5 minutos</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight text-white">
            Empieza a invertir con<br />Orion Capital hoy
          </h2>
          <p className="text-lg text-white/60 mb-10">
            Únete a los traders que ya confían en Orion Capital para operar con herramientas profesionales en los mercados financieros globales.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => window.location.href = createPageUrl('Register')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-[#1E40AF] font-black rounded-lg transition-all shadow-xl hover:scale-[1.02]">
              Abrir cuenta gratis <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link to={createPageUrl('About')}
              className="inline-flex items-center gap-2 px-6 py-4 border-2 border-white/25 text-white font-semibold rounded-lg hover:border-white/50 hover:bg-white/10 transition-all">
              Hablar con un asesor
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/40 flex-wrap">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-white/60" />Sin comisiones ocultas</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-white/60" />Demo $10,000 virtual</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-white/60" />Soporte 24/5 en español</span>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
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
  BarChart3, Zap, Award, Trophy, Medal, BadgeCheck, Gem, Lock, CreditCard,
  Activity, LineChart, Layers, Cpu, Bell, Smartphone, BookOpen, Target, RefreshCw
} from 'lucide-react';

// ── PALETA orioncapitalglobal.com ─────────────────────────────────────────────
// Fondo principal  : #0B1223  (azul marino muy oscuro)
// Superficie       : #111827  (gris azulado oscuro)
// Acento azul      : #3B82F6  (azul eléctrico "ventaja")
// Acento dorado    : #D4A853  (dorado "real")
// Texto secundario : rgba(255,255,255,0.55)
// ─────────────────────────────────────────────────────────────────────────────

const TICKER_DATA = [
  { symbol: 'AAPL', price: '$232.15', change: '+1.50%', up: true },
  { symbol: 'MSFT', price: '$418.73', change: '-0.51%', up: false },
  { symbol: 'TSLA', price: '$278.42', change: '+3.24%', up: true },
  { symbol: 'NVDA', price: '$134.50', change: '+1.65%', up: true },
  { symbol: 'AMZN', price: '$221.34', change: '-0.47%', up: false },
  { symbol: 'GOOGL', price: '$173.82', change: '+1.12%', up: true },
  { symbol: 'META', price: '$598.20', change: '+0.91%', up: true },
  { symbol: 'BTC-USD', price: '$94,820', change: '+1.33%', up: true },
  { symbol: 'ETH-USD', price: '$3,180', change: '-1.31%', up: false },
  { symbol: 'S&P 500', price: '$5,842', change: '+0.31%', up: true },
  { symbol: 'DJI', price: '$43,218', change: '-0.20%', up: false },
  { symbol: 'WALMEX.MX', price: '$68.42', change: '+1.26%', up: true },
];

const STATS = [
  { value: '$5B+', label: 'Volumen mensual operado' },
  { value: '6,000+', label: 'Instrumentos globales' },
  { value: '25+', label: 'Mercados internacionales' },
  { value: '15+', label: 'Años de trayectoria' },
];

const MARKETS = [
  { icon: BarChart3, label: 'Trading de Acciones', desc: 'Opera acciones de México, NYSE y NASDAQ con análisis técnico profesional y ejecución en milisegundos.', tag: 'Mercado MX y USA', color: '#3B82F6', bg: '#3B82F615' },
  { icon: Layers, label: 'ETFs Globales', desc: 'Diversifica tu portafolio con más de 500 ETFs que cubren índices, sectores y geografías del mundo.', tag: '500+ ETFs', color: '#3B82F6', bg: '#3B82F615' },
  { icon: Activity, label: 'Criptomonedas', desc: 'Exposición al ecosistema cripto a través de ETFs de Bitcoin, Ethereum y empresas del sector blockchain.', tag: 'BTC, ETH y más', color: '#D4A853', bg: '#D4A85315' },
  { icon: LineChart, label: 'Derivados y Opciones', desc: 'Estrategias avanzadas con opciones y futuros para maximizar rendimientos y cubrir riesgos de mercado.', tag: 'Para traders avanzados', color: '#3B82F6', bg: '#3B82F615' },
  { icon: Cpu, label: 'Trading Algorítmico', desc: 'Automatiza tus estrategias con nuestra API REST y conecta bots de trading directamente a los mercados.', tag: 'API REST disponible', color: '#D4A853', bg: '#D4A85315' },
  { icon: Shield, label: 'Gestión de Riesgo', desc: 'Stop-loss automáticos, alertas de precio y herramientas de cobertura para proteger tu capital en todo momento.', tag: 'Capital protegido', color: '#3B82F6', bg: '#3B82F615' },
];

const WHY_ITEMS = [
  { icon: Zap, title: 'Ejecución ultrarrápida', desc: 'Órdenes ejecutadas en menos de 10 milisegundos. Sin latencia, sin slippage injustificado. Tu estrategia, ejecutada con precisión milimétrica.' },
  { icon: Globe, title: 'Acceso a mercados globales', desc: 'Opera en 25+ mercados internacionales: NYSE, NASDAQ, BMV, LSE, Tokio y más, desde una sola cuenta unificada.' },
  { icon: Users, title: 'Mesa de trading 24/5', desc: 'Equipo de traders expertos disponibles durante toda la sesión de mercado. Soporte técnico y de trading en español, siempre.' },
  { icon: Lock, title: 'Seguridad de nivel bancario', desc: 'Fondos protegidos, cifrado AES-256, autenticación de dos factores y cumplimiento regulatorio en todas las jurisdicciones donde operamos.' },
];

const ADVANTAGES = [
  { icon: TrendingUp, title: 'Rendimientos superiores al mercado', desc: 'Nuestros traders obtienen en promedio un rendimiento 4.2x mayor que los índices de referencia gracias a nuestras herramientas de análisis.' },
  { icon: Shield, title: 'Gestión de riesgo inteligente', desc: 'Stop-loss dinámicos, límites de exposición y alertas automáticas protegen tu capital ante movimientos adversos del mercado.' },
  { icon: Target, title: 'Estrategias personalizadas', desc: 'Desde scalping intradía hasta inversión a largo plazo, tenemos herramientas y estrategias adaptadas a cada estilo de trading.' },
  { icon: BookOpen, title: 'Educación financiera continua', desc: 'Webinars semanales, análisis diarios, tutoriales en video y acompañamiento de mentores para que nunca dejes de crecer.' },
];

const PLATFORM_FEATURES = [
  { icon: BarChart3, title: 'Panel de Trading', desc: 'Visualiza todos tus activos, posiciones abiertas y P&L en tiempo real desde un dashboard profesional.' },
  { icon: LineChart, title: 'Análisis Técnico Avanzado', desc: 'Indicadores institucionales, múltiples temporalidades y herramientas de dibujo para operar con precisión.' },
  { icon: Bell, title: 'Alertas Inteligentes', desc: 'Notificaciones personalizadas de precio, volumen y señales técnicas para nunca perder una oportunidad.' },
  { icon: Smartphone, title: 'App Móvil Nativa', desc: 'Toda la potencia de la plataforma en tu bolsillo. Disponible para iOS y Android con sincronización en tiempo real.' },
];

const STATIC_TESTIMONIALS = [
  { name: 'Carlos Mendoza', role: 'Trader independiente', company: 'Ciudad de México, MX', text: 'Orion Capital transformó completamente mi forma de operar. La plataforma es increíblemente rápida, los gráficos en tiempo real son precisos y el equipo de asesoría siempre está disponible. Llevo 3 años con ellos y mis rendimientos han superado mis expectativas.', rating: 5 },
  { name: 'Andrea Rodríguez', role: 'Gestora de portafolios', company: 'Buenos Aires, AR', text: 'Como gestora de portafolios, necesitaba una plataforma robusta con acceso a mercados globales. Orion Capital ofrece exactamente eso: herramientas institucionales con una interfaz intuitiva. El análisis técnico y los datos de mercado son de primer nivel.', rating: 5 },
  { name: 'Miguel Torres', role: 'Empresario e inversionista', company: 'Bogotá, CO', text: 'Empecé con una cuenta pequeña y hoy manejo un portafolio diversificado en acciones, ETFs y activos digitales. La educación financiera que ofrece Orion Capital me dio las bases para tomar decisiones informadas. Totalmente recomendado.', rating: 5 },
];

const AWARDS_STATIC = [
  { title: 'Mejor Plataforma de Trading en Latinoamérica', issuer: 'Euromoney Awards', year: 2024 },
  { title: 'Mejor Broker Digital LATAM', issuer: 'Global Finance Magazine', year: 2024 },
  { title: 'Fintech del Año en América Latina', issuer: 'Finnovista · Fintech Radar', year: 2023 },
  { title: 'Premio a la Innovación Financiera LATAM', issuer: 'Latin Finance Awards', year: 2023 },
];

const PORTFOLIO_ITEMS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: '$134.50', change: '+1.65%', up: true },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '$232.15', change: '+1.50%', up: true },
  { symbol: 'BTC', name: 'Bitcoin', price: '$94,820', change: '+1.33%', up: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: '$278.42', change: '-0.82%', up: false },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'fill-[#3B82F6] text-[#3B82F6]' : 'text-white/10 fill-white/10'}`} />
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
    { id: 1, question: '¿Cómo abro una cuenta en Orion Capital?', answer: 'El proceso de apertura toma menos de 5 minutos. Completa el formulario, verifica tu identidad y comienza a operar con una cuenta demo de $100,000 virtuales de forma inmediata.' },
    { id: 2, question: '¿Qué mercados están disponibles?', answer: 'Accede a más de 6,000 instrumentos en 25+ mercados globales: NYSE, NASDAQ, BMV, Forex, ETFs, criptomonedas, derivados y más, todo desde una sola cuenta unificada.' },
    { id: 3, question: '¿Cuál es la velocidad de ejecución?', answer: 'Nuestro sistema ejecuta órdenes en menos de 10 milisegundos. Sin latencia ni slippage injustificado, garantizando que tu estrategia se ejecute con precisión milimétrica.' },
    { id: 4, question: '¿Cómo están protegidos mis fondos?', answer: 'Tus fondos están protegidos bajo cifrado AES-256, autenticación de dos factores, cuentas segregadas y cumplimiento regulatorio de CNBV y SEC. Orion Capital opera bajo los más altos estándares de seguridad.' },
    { id: 5, question: '¿Ofrecen educación y soporte?', answer: 'Sí. Contamos con webinars semanales, análisis de mercado diarios, tutoriales en video y una mesa de trading con expertos disponibles 24/5 en español para acompañarte en cada operación.' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1223] text-white overflow-x-hidden font-inter">
      <PublicNav currentPage="Home" />

      {/* ══════════ TICKER ══════════ */}
      <div className="bg-[#0B1223] border-b border-white/8 pt-[88px] overflow-hidden">
        <div className="flex gap-8 animate-ticker whitespace-nowrap py-2.5 px-4">
          {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((t, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs">
              <span className="font-bold text-white/80 tracking-wide">{t.symbol}</span>
              <span className={`font-mono font-bold flex items-center gap-0.5 ${t.up ? 'text-[#3B82F6]' : 'text-red-400'}`}>
                <span className="text-[9px]">{t.up ? '▲' : '▼'}</span>{t.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0B1223] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_60%_30%,rgba(59,130,246,0.10),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_10%_80%,rgba(212,168,83,0.06),transparent)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-xs text-white/70 font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
              Mercados abiertos · Operar ahora
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Opera con{' '}
              <span className="text-[#3B82F6]">ventaja</span>{' '}
              <span className="text-[#D4A853]">real</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/55 leading-relaxed mb-8 max-w-lg">
              Accede a miles de activos globales — acciones, ETFs, divisas, commodities y criptomonedas — con la plataforma de trading más avanzada de Latinoamérica.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {['Ejecución ultrarrápida', '6,000+ instrumentos', 'Spreads competitivos'].map(tag => (
                <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/6 border border-white/10 text-xs text-white/60 font-medium">
                  <span className="w-1 h-1 rounded-full bg-[#3B82F6]" />{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.location.href = createPageUrl('Register')}
                className="group flex items-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-lg transition-all text-base shadow-xl shadow-[#3B82F6]/25 hover:shadow-[#3B82F6]/40"
              >
                Abrir cuenta gratis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to={createPageUrl('Product')}
                className="flex items-center gap-2 px-6 py-4 text-white/60 font-medium rounded-lg border border-white/12 hover:border-white/25 hover:text-white transition-all text-base"
              >
                Ver mercados en vivo
              </Link>
            </div>
          </div>

          {/* Right: portfolio mockup */}
          <div className="relative hidden lg:flex flex-col gap-4">
            {/* Main card */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="text-xs text-white/40 font-medium mb-1">Portafolio Total</div>
              <div className="text-4xl font-black text-white mb-0.5">$284,732<span className="text-2xl">.00</span></div>
              <div className="text-sm font-bold text-[#3B82F6] mb-5">+12.4% hoy</div>
              {/* Mini line chart simulation */}
              <div className="h-20 mb-5 relative overflow-hidden rounded-xl bg-[#0B1223]/60">
                <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,70 C30,65 60,55 90,48 C120,40 150,45 180,35 C210,25 240,20 270,15 L300,10 L300,80 L0,80 Z" fill="url(#lineGrad)" />
                  <path d="M0,70 C30,65 60,55 90,48 C120,40 150,45 180,35 C210,25 240,20 270,15 L300,10" fill="none" stroke="#3B82F6" strokeWidth="2" />
                </svg>
              </div>
              {/* Asset list */}
              <div className="space-y-3">
                {PORTFOLIO_ITEMS.map(item => (
                  <div key={item.symbol} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center text-xs font-black text-[#3B82F6]">{item.symbol[0]}</div>
                      <div>
                        <div className="text-sm font-bold text-white">{item.symbol}</div>
                        <div className="text-[10px] text-white/35">{item.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">{item.price}</div>
                      <div className={`text-[10px] font-bold ${item.up ? 'text-[#3B82F6]' : 'text-red-400'}`}>{item.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-[#111827] border border-white/12 rounded-xl px-4 py-3 shadow-xl flex items-center gap-2">
              <Zap className="h-4 w-4 text-[#3B82F6]" />
              <div>
                <div className="text-[10px] text-white/40">Ejecución</div>
                <div className="text-sm font-black text-white">&lt; 10ms</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#111827] border border-[#D4A853]/20 rounded-xl px-4 py-3 shadow-xl">
              <div className="text-[10px] text-white/40 mb-0.5">Rendimiento anual</div>
              <div className="text-lg font-black text-[#D4A853]">+18.7%</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <div className="bg-[#111827] border-y border-white/8 py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#3B82F6] mb-1">{s.value}</div>
              <div className="text-xs text-white/40 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MARKETS ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0B1223]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-[0.2em] mb-3 block">Instrumentos de Trading</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Opera en todos los mercados<br />desde una sola cuenta</h2>
            <p className="text-white/45 max-w-xl mx-auto">Más de 6,000 instrumentos financieros en mercados de México, Estados Unidos y el mundo. Sin restricciones, con tecnología de primer nivel.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MARKETS.map((m, i) => {
              const MIcon = m.icon;
              return (
                <div key={i} className="bg-[#111827] border border-white/8 rounded-xl p-6 hover:border-[#3B82F6]/30 transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ background: m.bg }}>
                      <MIcon className="h-5 w-5" style={{ color: m.color }} />
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full border font-semibold" style={{ color: m.color, borderColor: m.color + '30', background: m.bg }}>{m.tag}</span>
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{m.label}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ PLATFORM FEATURES ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#111827]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-[0.2em] mb-4 block">Plataforma</span>
              <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6 text-white">
                Tecnología institucional<br />para el trader moderno
              </h2>
              <p className="text-white/45 text-lg leading-relaxed mb-8">
                Construida durante más de 15 años, nuestra plataforma combina velocidad, análisis profundo y una experiencia de usuario sin igual para que operes con total confianza.
              </p>
              <button
                onClick={() => window.location.href = createPageUrl('Register')}
                className="flex items-center gap-2 px-7 py-3.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-lg transition-all text-sm shadow-lg shadow-[#3B82F6]/20"
              >
                Explorar la plataforma <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PLATFORM_FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="bg-[#0B1223] border border-white/8 rounded-xl p-5 hover:border-[#3B82F6]/25 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/12 flex items-center justify-center mb-3 group-hover:bg-[#3B82F6]/22 transition-colors">
                      <Icon className="h-5 w-5 text-[#3B82F6]" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ WHY ORION ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0B1223]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-[0.2em] mb-3 block">Por qué Orion Capital</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">El broker preferido de los<br />traders latinoamericanos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_ITEMS.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="bg-[#111827] border border-white/8 rounded-xl p-6 hover:border-[#3B82F6]/25 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center mb-4 group-hover:bg-[#3B82F6]/20 transition-colors">
                    <Icon className="h-6 w-6 text-[#3B82F6]" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2">{c.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ ADVANTAGES ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#111827]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#D4A853] uppercase tracking-[0.2em] mb-3 block">Ventajas competitivas</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Tu ventaja como<br />trader en Orion</h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">Todo lo que necesitas para operar con confianza, eficiencia y resultados consistentes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ADVANTAGES.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex gap-5 bg-[#0B1223] border border-white/8 rounded-xl p-6 hover:border-[#D4A853]/20 transition-all group">
                  <div className="w-12 h-12 rounded-lg bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A853]/18 transition-colors">
                    <Icon className="h-6 w-6 text-[#D4A853]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base mb-2">{a.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0B1223]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-[0.2em] mb-3 block">Testimonios</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Lo que dicen nuestros traders</h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">Miles de inversores en toda Latinoamérica confían en Orion Capital para hacer crecer su patrimonio.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayTestimonials.map((t, i) => (
              <div key={t.id || i} className="bg-[#111827] border border-white/8 rounded-xl p-6 hover:border-[#3B82F6]/20 transition-all flex flex-col">
                <StarRating rating={t.rating || 5} />
                <p className="text-white/55 text-sm leading-relaxed my-5 flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-sm font-black text-white flex-shrink-0">
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
        </div>
      </section>

      {/* ══════════ AWARDS ══════════ */}
      <section className="py-20 px-4 sm:px-6 bg-[#111827]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#D4A853] uppercase tracking-[0.2em] mb-3 block">Reconocimientos</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Líderes reconocidos en LATAM</h2>
            <p className="text-white/40 mt-4 max-w-xl mx-auto">Organismos internacionales y publicaciones especializadas han reconocido nuestra excelencia en la industria financiera.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {displayAwards.map((a, idx) => {
              const awardIcons = [Trophy, Medal, BadgeCheck, Gem];
              const AIcon = awardIcons[idx % awardIcons.length];
              return (
                <div key={a.id || idx} className="flex items-center gap-4 bg-[#0B1223] border border-white/8 rounded-xl p-5 hover:border-[#D4A853]/25 transition-all group">
                  <div className="w-11 h-11 rounded-lg bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4A853]/18 transition-colors">
                    <AIcon className="h-5 w-5 text-[#D4A853]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#D4A853] mb-0.5">{a.year}</div>
                    <div className="font-bold text-white text-sm mb-0.5">{a.title}</div>
                    <div className="text-xs text-white/35">{a.issuer}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Regulators */}
          <div className="text-center">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-6 font-semibold">Regulado y respaldado por</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['SEC', 'FINRA', 'CNBV', 'CMF', 'AMV', 'SIPC'].map(r => (
                <div key={r} className="px-4 py-2 bg-[#0B1223] border border-white/10 rounded-lg text-xs font-black text-white/50">{r}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="py-24 px-4 sm:px-6 bg-[#0B1223]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#3B82F6] uppercase tracking-[0.2em] mb-3 block">FAQ</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-2">
            {displayFaqs.map((f) => (
              <div key={f.id} className="bg-[#111827] border border-white/8 rounded-xl overflow-hidden hover:border-[#3B82F6]/20 transition-all">
                <button
                  onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-bold text-white/85 pr-4 text-sm">{f.question}</span>
                  <ChevronDown className={`h-4 w-4 text-white/30 flex-shrink-0 transition-transform duration-300 ${openFaq === f.id ? 'rotate-180 text-[#3B82F6]' : ''}`} />
                </button>
                {openFaq === f.id && (
                  <div className="px-6 pb-5 text-sm text-white/45 leading-relaxed border-t border-white/5 pt-3">{f.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="relative py-28 px-4 sm:px-6 overflow-hidden bg-[#111827]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(59,130,246,0.08),transparent)]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold text-[#3B82F6] uppercase tracking-[0.2em] mb-4">Apertura de cuenta en menos de 5 minutos</p>
          <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight text-white">
            Empieza a operar con<br /><span className="text-[#3B82F6]">Orion Capital</span> hoy
          </h2>
          <p className="text-lg text-white/40 mb-10">
            Únete a más de 10,000 traders que ya confían en nuestra plataforma para hacer crecer su patrimonio en los mercados financieros.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => window.location.href = createPageUrl('Register')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-lg transition-all shadow-xl shadow-[#3B82F6]/25 hover:scale-[1.02]"
            >
              Abrir cuenta gratis <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to={createPageUrl('About')}
              className="inline-flex items-center gap-2 px-6 py-4 border border-white/15 text-white/60 font-medium rounded-lg hover:border-white/30 hover:text-white transition-all"
            >
              Hablar con un asesor
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/25 flex-wrap">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#3B82F6]/60" />Sin comisiones ocultas</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#3B82F6]/60" />Demo $100,000 virtual</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#3B82F6]/60" />Soporte 24/5 en español</span>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
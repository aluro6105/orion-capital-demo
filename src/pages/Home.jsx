import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ArrowRight, Users, Shield, Globe, FileText,
  Star, ChevronDown, CheckCircle2, TrendingUp, BarChart3, Zap
} from 'lucide-react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const TRUST_CARDS = [
  { icon: Users, title: 'Social', desc: 'Más de 5,000 traders activos en la plataforma a nivel global', color: '#00C853' },
  { icon: FileText, title: 'Fiable', desc: 'Líder en tecnología de trading simulado desde 2020', color: '#00C853' },
  { icon: Shield, title: 'Seguro', desc: 'Protegemos tu cuenta y tus activos con la máxima seguridad', color: '#00C853' },
  { icon: Globe, title: 'Global', desc: 'Ofrecemos nuestros servicios en todo el mundo', color: '#00C853' },
];

const AWARDS_TICKER = [
  'Mejor plataforma de simulación · Fintech Awards 2025',
  'Innovación en negociación de acciones · TechFinance 2025',
  'La mejor plataforma educativa · Trader Awards 2026',
  'Mejor broker simulado · Forbes Advisor\'s 2026',
  'Lo mejor para invertir en criptos · Investopedia 2025',
];

const FEE_CARDS = [
  { value: '$0', label: 'COMISIÓN EN ACCIONES', sub: 'Opera sin costes ocultos' },
  { value: '0%', label: 'DE COMISIÓN EN ETF', sub: 'Diversifica sin comisiones' },
  { value: '1%', label: 'EN CRIPTOACTIVOS', sub: 'La tarifa más competitiva' },
];

const CRYPTO_ICONS = [
  { symbol: 'SOL', color: '#9945FF', bg: '#1a0a33' },
  { symbol: 'EOS', color: '#ffffff', bg: '#1a1a2e' },
  { symbol: 'FRAX', color: '#ffffff', bg: '#e91e8c' },
  { symbol: 'DASH', color: '#008CE7', bg: '#0d1b2a' },
  { symbol: 'LTC', color: '#b4b4b4', bg: '#1a1a2e' },
  { symbol: 'XRP', color: '#00AAE4', bg: '#0d2137' },
  { symbol: 'ETH', color: '#627EEA', bg: '#1a1a2e' },
  { symbol: 'SHIB', color: '#E0A817', bg: '#1a1a0d' },
  { symbol: 'BTC', color: '#F7931A', bg: '#1a0d00' },
];

const PORTFOLIO_CARDS = [
  { label: 'iShares Russell 2000 ETF', pct: '10%', color: '#1a1a2e', text: 'white' },
  { label: 'Bitcoin', pct: '30%', color: '#F7931A', text: 'white' },
  { label: 'Apple', pct: '7%', color: '#555', text: 'white' },
  { label: 'SPDR S&P 500 ETF', pct: '14%', color: '#00C853', text: 'white' },
  { label: 'Ethereum', pct: '5%', color: '#627EEA', text: 'white' },
];

const INSTITUTIONS = ['J.P.Morgan', 'UBS', 'Citi', 'Deutsche Bank', 'Goldman Sachs', 'BlackRock'];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'text-[#00C853] fill-[#00C853]' : 'text-gray-200 fill-gray-200'}`} />
      ))}
    </div>
  );
}

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
    { id: 5, question: '¿Hay comisiones?', answer: 'Sin comisiones en acciones y ETFs. Solo 1% en criptoactivos. Sin costes ocultos.' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Nav with white bg */}
      <div className="[&_nav]:bg-white [&_nav]:border-b [&_nav]:border-gray-100 [&_nav]:shadow-sm [&_a]:text-gray-700 [&_span.font-black]:text-gray-900">
        <PublicNav currentPage="Home" />
      </div>

      {/* ══ HERO ══ */}
      <section className="pt-20 min-h-screen flex items-center bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-0 items-center min-h-[calc(100vh-80px)]">
          {/* Left */}
          <div className="py-16 lg:py-0 pr-0 lg:pr-16 order-2 lg:order-1">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tight mb-6 text-gray-900 uppercase">
              Sé el trader<br />
              <span className="text-gray-900">que deseas</span><br />
              <span className="text-[#00C853]">ser.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-md leading-relaxed">
              Opera en miles de acciones, criptos, ETFs... todo en una plataforma fácil de usar con tecnología de nivel institucional.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00C853] hover:bg-[#00b34a] text-white font-bold rounded-full text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]"
            >
              Únete ya
            </button>
            <p className="mt-4 text-xs text-gray-400">* Los CFD son instrumentos complejos. Su capital está en riesgo.</p>
          </div>

          {/* Right: hero image */}
          <div className="relative order-1 lg:order-2 h-[50vh] lg:h-screen">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80"
              alt="Trader profesional"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Gradient overlay left side */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />

            {/* Floating badges */}
            <div className="absolute bottom-1/3 left-4 lg:left-8 bg-white rounded-2xl shadow-2xl px-5 py-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-0.5">Capital inicial</div>
              <div className="text-xl font-black text-gray-900">$10,000</div>
              <div className="text-xs font-semibold text-[#00C853]">Cuenta demo</div>
            </div>
            <div className="absolute top-1/3 right-4 lg:right-8 bg-white rounded-2xl shadow-2xl px-5 py-3 border border-gray-100">
              <div className="text-xs text-gray-400 mb-0.5">Instrumentos</div>
              <div className="text-xl font-black text-[#00C853]">15+</div>
              <div className="text-xs text-gray-500">activos disponibles</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ AWARDS TICKER ══ */}
      <div className="bg-[#0d1117] py-4 overflow-hidden">
        <div className="flex gap-16 animate-[ticker_35s_linear_infinite] whitespace-nowrap">
          {[...AWARDS_TICKER, ...AWARDS_TICKER].map((a, i) => (
            <span key={i} className="inline-flex items-center gap-3 text-xs text-white/70">
              <span className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <span key={s} className="w-2.5 h-2.5 text-[#00C853]">✦</span>)}
              </span>
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* ══ TRUST SECTION ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">Confiable a nivel mundial</h2>
          <p className="text-gray-500">Descubra por qué miles de traders de más de 100 países se han unido a NEXUS</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="border border-gray-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all hover:border-[#00C853]/30 group">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-[#00C853]/10 flex items-center justify-center group-hover:bg-[#00C853]/20 transition-colors">
                    <Icon className="h-7 w-7 text-[#00C853]" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ DIVERSIFY / PORTFOLIO ══ */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Diversifica tu cartera</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Invierte en diversas clases de activos, incluidas acciones de 20 bolsas mundiales y más de 100 criptomonedas, y gestiona todas tus participaciones desde un único lugar.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#00C853] text-[#00C853] font-semibold rounded-full hover:bg-[#00C853] hover:text-white transition-all text-sm"
            >
              Explora los principales mercados
            </button>
          </div>
          {/* Right: stacked portfolio cards */}
          <div className="relative h-64 flex items-center justify-center">
            {PORTFOLIO_CARDS.map((c, i) => (
              <div
                key={i}
                className="absolute rounded-2xl shadow-xl px-5 py-4 min-w-[130px] text-center"
                style={{
                  background: c.color,
                  color: c.text,
                  transform: `rotate(${(i - 2) * 8}deg) translate(${(i - 2) * 30}px, ${Math.abs(i - 2) * 10}px)`,
                  zIndex: i === 2 ? 10 : 5 - Math.abs(i - 2),
                }}
              >
                <div className="text-2xl font-black">{c.pct}</div>
                <div className="text-[10px] opacity-80 mt-1">{c.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CRYPTO SECTION ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: crypto grid */}
          <div className="grid grid-cols-3 gap-3">
            {CRYPTO_ICONS.map((c, i) => (
              <div key={i}
                className="aspect-square rounded-2xl flex items-center justify-center text-sm font-black shadow-md hover:scale-105 transition-transform cursor-pointer"
                style={{ background: c.bg, color: c.color, fontSize: '11px' }}>
                {c.symbol}
              </div>
            ))}
          </div>
          {/* Right copy */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Lo mejor de la inversión en cripto</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Invierte y gestione más de 15 criptoactivos en una plataforma global de confianza que ofrece seguridad de primer nivel, herramientas potentes y comisiones transparentes. Opera sin complicaciones.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#00C853] text-[#00C853] font-semibold rounded-full hover:bg-[#00C853] hover:text-white transition-all text-sm"
            >
              Invierte en cripto
            </button>
            <p className="mt-3 text-xs text-gray-400">Las inversiones en criptos son arriesgadas y altamente volátiles. Su capital está en riesgo.</p>
          </div>
        </div>
      </section>

      {/* ══ COPY TRADING / SOCIAL SECTION ══ */}
      <section className="py-20 px-4 sm:px-6 bg-[#0d1117] overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Copia a los mejores traders de NEXUS</h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Con nuestra innovadora función Social Trading, puedes copiar automáticamente las operaciones de otros inversores. Encuentra traders que se ajusten a tu estrategia y replica sus inversiones en tiempo real.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#00C853] text-[#00C853] font-semibold rounded-full hover:bg-[#00C853] hover:text-white transition-all text-sm"
            >
              Descubre Social Trading
            </button>
            <p className="mt-4 text-xs text-white/30">El Social Trading no representa un consejo de inversión. Su capital está en riesgo.</p>
          </div>
          {/* Right: trader card mockup */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
              alt="Top trader"
              className="rounded-3xl object-cover w-full h-72 lg:h-96"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-[#1a1f2e]/90 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-white font-bold text-sm">Top Trader NEXUS</div>
                  <div className="text-white/50 text-xs">Retorno 12 meses</div>
                </div>
                <div className="text-right">
                  <div className="text-[#00C853] font-black text-xl">+18.4%</div>
                  <div className="text-white/50 text-xs">RETURN (12M)</div>
                </div>
              </div>
              {/* Mini chart */}
              <div className="flex items-end gap-1 h-8">
                {[3,5,4,7,6,8,7,9,8,10,9,11].map((v, i) => (
                  <div key={i} className="flex-1 rounded-sm bg-[#00C853]" style={{ height: `${v * 8}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEE SECTION ══ */}
      <section className="py-20 px-4 sm:px-6 bg-[#0d1117]">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-2">Comisiones bajas, sin sorpresas</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEE_CARDS.map((c, i) => (
            <div key={i} className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden group hover:border-[#00C853]/40 transition-all">
              {/* bg chart decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end gap-0.5 opacity-20">
                {[2,4,3,6,5,7,6,8,7,9].map((v,j) => (
                  <div key={j} className="flex-1 bg-[#00C853] rounded-t-sm" style={{ height: `${v * 8}%` }} />
                ))}
              </div>
              <div className="relative">
                <div className="text-5xl font-black text-white mb-1">{c.value}</div>
                <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">{c.label}</div>
                <div className="text-sm text-white/40">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-white/30 mt-6">* Se aplican otras comisiones. Para más información consulte la página de comisiones.</p>
      </section>

      {/* ══ INSTITUCIONES ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Tus fondos en instituciones de primer nivel</h2>
          <p className="text-gray-500 text-sm">En NEXUS trabajamos con los mejores socios financieros del mundo:</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
            {INSTITUTIONS.map((inst, i) => (
              <span key={i} className="text-xl sm:text-2xl font-bold text-gray-400 hover:text-gray-700 transition-colors cursor-default tracking-tight">{inst}</span>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">* Estas instituciones son socios tecnológicos y no brindan servicios a todas las entidades del grupo.</p>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Lo que dicen nuestros traders</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.slice(0, 6).map((t) => (
                <div key={t.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <StarRating rating={t.rating || 5} />
                  <p className="text-gray-600 text-sm leading-relaxed my-4">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C853] to-[#00695C] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
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
              <Link to={createPageUrl('Testimonials')} className="text-sm text-[#00C853] hover:text-[#00b34a] transition-colors font-semibold">
                Ver todos los testimonios →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══ TRADERS COMMUNITY PHOTO SECTION ══ */}
      <section className="py-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
              alt="Trading community"
              className="w-full h-full object-cover min-h-[350px]"
            />
            <div className="absolute inset-0 bg-[#00C853]/10" />
          </div>
          <div className="bg-[#0d1117] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-16">
            <span className="text-[#00C853] text-xs font-bold uppercase tracking-widest mb-4">Plataforma activa</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
              Opera con tecnología<br />de nivel institucional.<br /><span className="text-[#00C853]">Para todos.</span>
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              Gráficos profesionales, precios en tiempo real via WebSocket y métricas avanzadas de P&L. La plataforma que los traders profesionales usan, ahora disponible para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="px-7 py-3.5 bg-[#00C853] hover:bg-[#00b34a] text-white font-bold rounded-full transition-all text-sm"
              >
                Abrir cuenta gratis
              </button>
              <Link
                to={createPageUrl('Product')}
                className="px-7 py-3.5 border border-white/20 text-white font-semibold rounded-full hover:border-white/40 transition-all text-sm text-center"
              >
                Ver la plataforma
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-1">
            {displayFaqs.map(f => (
              <div key={f.id} className="border-b border-gray-100">
                <button
                  onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="font-semibold text-gray-900">{f.question}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === f.id ? 'rotate-180 text-[#00C853]' : ''}`} />
                </button>
                {openFaq === f.id && (
                  <div className="pb-5 text-sm text-gray-500 leading-relaxed">{f.answer}</div>
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

      {/* ══ FINAL CTA ══ */}
      <section className="py-24 px-4 sm:px-6 bg-gray-50 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">¿Listo para empezar?</h2>
        <p className="text-gray-500 text-lg mb-8">Cuenta demo con $10,000. Sin depósito. Activación inmediata.</p>
        <button
          onClick={() => window.location.href = '/login'}
          className="inline-flex items-center gap-2 px-10 py-4 bg-[#00C853] hover:bg-[#00b34a] text-white font-black rounded-full text-lg transition-all shadow-xl hover:scale-[1.03]"
        >
          Únete gratis
          <ArrowRight className="h-5 w-5" />
        </button>
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#00C853]" />Sin comisiones en acciones</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#00C853]" />Datos en tiempo real</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-[#00C853]" />Activación inmediata</span>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
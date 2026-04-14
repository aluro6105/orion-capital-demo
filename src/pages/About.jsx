import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import {
  ArrowRight, CheckCircle2, Shield, Zap, Globe2, Users,
  HeadphonesIcon, BarChart3, Lock, CreditCard, Banknote,
  TrendingUp, Star, Trophy, Medal, BadgeCheck, Gem, Award
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// ── CORE PILLARS ────────────────────────────────────────────────────────────
const CORE_PILLARS = [
  {
    title: 'Fundado por Expertos',
    sub: 'Con licencia. De confianza. Global.',
    desc: 'Creado en 2020, NexusTrade ha crecido hasta convertirse en una referencia global con infraestructura regulada y tecnología de primer nivel. Fundado por veteranos de la industria financiera, priorizamos el cumplimiento estricto, la liquidez profunda y la precisión en los precios para que operes con confianza real.',
  },
  {
    title: 'Nuestra Historia',
    sub: 'Construido para traders que piensan.',
    desc: 'Muchos brokers se enfocan en spreads y ganancias rápidas. Nosotros lo hacemos diferente. NexusTrade está diseñado para traders serios que valoran el conocimiento, la visión y un camino claro hacia el crecimiento sostenido. Con tecnología avanzada y soporte dedicado, te ayudamos a dominar el arte del trading inteligente.',
  },
  {
    title: 'Nuestros Valores',
    sub: 'Transparencia e integridad ante todo.',
    desc: 'En NexusTrade, todo se construye sobre transparencia, integridad y una mentalidad centrada en el trader, garantizando comunicación abierta y decisiones siempre en tu mejor interés. Impulsados por la pasión por los mercados, abrazamos la innovación para darte una ventaja competitiva real.',
  },
  {
    title: 'Nuestra Promesa',
    sub: 'A tu lado. En cada operación.',
    desc: 'Estamos aquí para ayudarte a captar oportunidades de mercado con trading de bajo coste, tecnología de clase mundial y soporte continuo 24/7. Sin ruido. Solo un socio en quien puedes confiar cuando los mercados están abiertos y cuando no lo están.',
  },
];

// ── WHY NEXUS ───────────────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    icon: HeadphonesIcon,
    title: 'Soporte en Vivo 24/5 en Múltiples Idiomas',
    desc: 'Opera con la tranquilidad de saber que nuestro equipo está disponible las 24 horas del día, 5 días a la semana, en múltiples idiomas, listo para asistirte en cualquier momento. Además, nuestro centro de ayuda con preguntas frecuentes ofrece respuestas inmediatas a las consultas más comunes.',
    accent: '#1a1aff',
  },
  {
    icon: BarChart3,
    title: 'Spreads desde 0.0 pips sin comisiones ocultas',
    desc: 'Disfruta de precios altamente competitivos con spreads desde 0.0 pips y cero comisiones escondidas. Elige el tipo de cuenta que mejor se adapte a tu estilo de trading y comienza a operar hoy mismo con posibles ahorros en cada operación.',
    accent: '#80cc00',
  },
  {
    icon: Globe2,
    title: 'Opera Forex, Materias Primas, Índices y Criptomonedas',
    desc: 'Accede al instante a una amplia gama de mercados globales. Opera con pares de divisas populares, commodities diversas, índices principales y criptomonedas líderes, todo disponible en un solo lugar con un simple clic.',
    accent: '#7C3AED',
  },
  {
    icon: Lock,
    title: 'Fondos Segregados y Protección de Saldo Negativo',
    desc: 'Ten la seguridad de que tus fondos se mantienen en cuentas segregadas, completamente separadas de nuestro capital operativo. Nuestra protección contra saldo negativo garantiza que nunca puedas perder más de tu depósito inicial.',
    accent: '#f59e0b',
  },
  {
    icon: CreditCard,
    title: 'Depósitos Instantáneos y Retiros Rápidos',
    desc: 'Disfruta de financiación de cuenta sin interrupciones con opciones de depósito instantáneo y retiros procesados con rapidez. Ofrecemos una variedad de métodos de pago a través de instituciones financieras consolidadas.',
    accent: '#06b6d4',
  },
  {
    icon: Zap,
    title: 'Ejecución Ultrarrápida sin Requotes',
    desc: 'Experimenta un trading fluido con nuestra ejecución de órdenes ultrarrápida, diseñada para minimizar retrasos y garantizar que tus operaciones se procesen al precio solicitado, sin slippage ni requotes.',
    accent: '#80cc00',
  },
];

// ── STEPS ───────────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: '01',
    title: 'Regístrate y Verifica tu Perfil',
    desc: 'Completa el formulario de registro en menos de 30 segundos. Envía tu documentación KYC y tu perfil económico para validar tu identidad y habilitar todas las funciones de la plataforma.',
  },
  {
    n: '02',
    title: 'Abre tu Cuenta y Deposita',
    desc: 'Elige el tipo de cuenta que mejor se adapte a tu perfil: Demo con $10,000 virtuales o Real con depósito mínimo de $5. Selecciona tu método de financiación favorito y actívate al instante.',
  },
  {
    n: '03',
    title: 'Descarga la Plataforma y Empieza',
    desc: 'Accede a NexusTrade desde el navegador o la app móvil. Configura tu watchlist, analiza los mercados con herramientas profesionales y ejecuta tu primera operación con confianza.',
  },
];

// ── STATS ───────────────────────────────────────────────────────────────────
const STATS = [
  { v: '2020', l: 'Año de fundación' },
  { v: '5K+', l: 'Traders activos' },
  { v: '50+', l: 'Países con operaciones' },
  { v: '24/5', l: 'Soporte disponible' },
];

// ── TRUST ───────────────────────────────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: Lock, label: 'Tus fondos están completamente seguros' },
  { icon: Shield, label: 'Sin comisiones ocultas ni letra pequeña' },
  { icon: CreditCard, label: 'Capital en cuentas segregadas y auditadas' },
  { icon: Zap, label: 'Depósitos instantáneos y retiros en 24h' },
  { icon: Banknote, label: 'Asociaciones con bancos de primer nivel global' },
];

export default function AboutPage() {
  const { data: awards = [] } = useQuery({
    queryKey: ['awards-about'],
    queryFn: () => base44.entities.Award.filter({ is_active: true }),
    staleTime: 5 * 60 * 1000,
  });

  const awardIcons = [Trophy, Medal, BadgeCheck, Gem, Award, Star];
  const awardColors = ['#f59e0b', '#1a1aff', '#80cc00', '#7C3AED', '#ef5350', '#06b6d4'];
  const awardBgs = ['#f59e0b15', '#1a1aff15', '#80cc0015', '#7C3AED15', '#ef535015', '#06b6d415'];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-inter">
      <PublicNav currentPage="About" />

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center bg-[#04052e] overflow-hidden px-4 pt-28 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_40%,rgba(26,26,255,0.22),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_10%_80%,rgba(128,204,0,0.08),transparent)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:70px_70px]" />

        <div className="relative max-w-4xl mx-auto">
          <p className="text-xs font-bold text-[#80cc00] uppercase tracking-[0.25em] mb-4">Acerca de NexusTrade</p>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6 text-white uppercase">
            ACERCA DE<br /><span className="text-[#80cc00]">NEXUSTRADE</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed">
            Los Traders Empoderados Rinden Mejor
          </p>
          <p className="text-white/40 text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            NexusTrade te ayuda a navegar los mercados financieros con el conocimiento, la tecnología, las ideas estratégicas y el soporte que necesitas para operar con mayor confianza y consistencia.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.href = createPageUrl('Register')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#80cc00] hover:bg-[#72b800] text-[#0d0d0d] font-black rounded-full transition-all shadow-xl shadow-[#80cc00]/20 hover:scale-[1.03]"
            >
              Abrir Cuenta <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to={createPageUrl('Register')}
              className="inline-flex items-center gap-2 px-6 py-4 text-white/60 font-semibold rounded-full border border-white/15 hover:border-white/35 hover:text-white transition-all"
            >
              Prueba una cuenta demo sin riesgo
            </Link>
          </div>
          <p className="text-xs text-white/25 mt-6">Operar con CFDs implica un riesgo significativo de pérdida de capital.</p>
        </div>
      </section>

      {/* ══════════ STATS BAND ══════════ */}
      <div className="bg-[#1a1aff] py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.v}</div>
              <div className="text-xs text-white/70 font-medium uppercase tracking-wide">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ NUESTRO NÚCLEO ══════════ */}
      <section className="py-24 px-4 bg-[#04052e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_30%,rgba(26,26,255,0.12),transparent)]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#80cc00] uppercase tracking-[0.2em] mb-3 block">Quiénes somos</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Nuestro Núcleo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CORE_PILLARS.map((p, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 hover:border-[#1a1aff]/40 hover:bg-white/[0.06] transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#80cc00]/15 border border-[#80cc00]/25 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-[#80cc00]">0{i + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-1">{p.title}</h3>
                <p className="text-sm text-[#80cc00] font-semibold mb-3">{p.sub}</p>
                <p className="text-sm text-white/50 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PARTNERSHIP / PRECISION ══════════ */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold text-[#1a1aff] uppercase tracking-[0.2em] mb-4 block">Alianza de precisión</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
              NexusTrade y la<br /><span className="text-[#1a1aff]">Excelencia Técnica</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-5">
              Nuestra filosofía refleja los mismos valores que importan en las disciplinas de alto rendimiento: decisiones instantáneas, excelencia técnica y rendimiento consistente bajo presión.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Así como los competidores de élite optimizan cada variable en su entorno, proporcionamos a nuestros traders las herramientas sofisticadas necesarias para navegar los mercados financieros con la misma precisión y disciplina. Este compromiso representa nuestra dedicación a quienes entienden que el éxito sostenible se basa en la preparación estratégica y la ejecución disciplinada.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Precisión en la ejecución', 'Decisiones en tiempo real', 'Rendimiento constante', 'Tecnología de vanguardia'].map(tag => (
                <div key={tag} className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[#80cc00] flex-shrink-0" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1aff]/8 to-[#80cc00]/5 rounded-3xl blur-2xl" />
            <div className="relative bg-[#04052e] rounded-2xl p-10 border border-[#1a1aff]/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: '0.0', u: 'pips', l: 'Spreads en bruto' },
                  { v: '<5ms', u: '', l: 'Tiempo de ejecución' },
                  { v: '$5', u: '', l: 'Depósito mínimo' },
                  { v: '1:500', u: '', l: 'Apalancamiento máx.' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-5 text-center">
                    <div className="text-2xl font-black text-[#80cc00] mb-1">{s.v}<span className="text-sm">{s.u}</span></div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wide font-semibold">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 bg-[#80cc00]/10 border border-[#80cc00]/20 rounded-xl text-center">
                <p className="text-sm font-bold text-[#80cc00]">Plataforma activa · Datos en tiempo real</p>
                <p className="text-xs text-white/40 mt-1">Spreads competitivos en más de 50 instrumentos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ¿POR QUÉ NEXUSTRADE? ══════════ */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#1a1aff] uppercase tracking-[0.2em] mb-3 block">Ventajas únicas</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">¿Por qué NexusTrade?</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Herramientas, condiciones y soporte diseñados para que operes mejor cada día.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-[#1a1aff]/15 transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${item.accent}15` }}>
                    <Icon className="h-6 w-6" style={{ color: item.accent }} />
                  </div>
                  <h3 className="font-black text-gray-900 mb-3 leading-tight">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => window.location.href = createPageUrl('Register')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#1a1aff] hover:bg-[#1515ee] text-white font-black rounded-full transition-all shadow-lg shadow-[#1a1aff]/25"
            >
              Abre una cuenta con nosotros <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-gray-400 mt-3">Operar con CFDs implica un riesgo significativo de pérdida de capital.</p>
          </div>
        </div>
      </section>

      {/* ══════════ PRESENCIA GLOBAL ══════════ */}
      <section className="py-24 px-4 bg-[#04052e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(26,26,255,0.15),transparent)]" />
        <div className="relative max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold text-[#80cc00] uppercase tracking-[0.2em] mb-4 block">Alcance mundial</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Nuestra Presencia Global</h2>
          <p className="text-white/40 max-w-2xl mx-auto mb-12 text-lg">
            Descubre por qué miles de traders de más de 50 países han elegido NexusTrade como su plataforma de referencia.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Somos Sociales', desc: 'Más de 5,000 traders activos en todo el mundo', color: '#80cc00' },
              { icon: Shield, label: 'Somos Fiables', desc: 'Referente en tecnología educacional desde 2020', color: '#1a1aff' },
              { icon: Lock, label: 'Somos Seguros', desc: 'Infraestructura robusta y socios certificados', color: '#7C3AED' },
              { icon: Globe2, label: 'Somos Globales', desc: 'Operamos en más de 50 países con soporte multilingüe', color: '#f59e0b' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 hover:border-white/15 transition-all group text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform" style={{ background: `${item.color}18` }}>
                    <Icon className="h-6 w-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="font-black text-white text-sm mb-2">{item.label}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ SEGURIDAD / FORTALEZA ══════════ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold text-[#1a1aff] uppercase tracking-[0.2em] mb-4 block">Seguridad de fortaleza</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
              Trading Seguro,<br /><span className="text-[#1a1aff]">Tranquilidad Mental.</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-10">
              Tu capital merece protección de nivel institucional y gestión completamente transparente. Por eso, nuestra tecnología de vanguardia garantiza ejecución instantánea y te ayuda a identificar las mejores oportunidades de mercado con herramientas diseñadas para tu éxito.
            </p>
            <div className="space-y-3">
              {TRUST_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 hover:border-[#1a1aff]/20 hover:bg-[#1a1aff]/3 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-[#1a1aff]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#1a1aff]/18 transition-colors">
                      <Icon className="h-5 w-5 text-[#1a1aff]" />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
                    <CheckCircle2 className="h-4 w-4 text-[#80cc00] ml-auto flex-shrink-0" />
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <Link
                to={createPageUrl('Register')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1a1aff] hover:bg-[#1515ee] text-white font-black rounded-full transition-all text-sm shadow-lg shadow-[#1a1aff]/25"
              >
                Descubre nuestras cuentas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#80cc00]/5 to-[#1a1aff]/10 rounded-3xl blur-3xl" />
            <div className="relative bg-[#04052e] rounded-2xl border border-[#1a1aff]/20 overflow-hidden shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#1a1aff]/15 border border-[#1a1aff]/25 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-8 w-8 text-[#1a1aff]" />
                </div>
                <h3 className="text-xl font-black text-white">Protección Total</h3>
                <p className="text-white/40 text-sm mt-1">Tu capital, siempre protegido</p>
              </div>
              <div className="space-y-3">
                {['Encriptación de nivel bancario', 'Cuentas auditadas anualmente', 'Protección contra saldo negativo', 'Verificación 2FA disponible', 'Monitoreo de riesgo en tiempo real'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[#80cc00] flex-shrink-0" />
                    <span className="text-white/60">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ PREMIOS ══════════ */}
      {awards.length > 0 && (
        <section className="py-24 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em] mb-3 block">Reconocimientos</span>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Premios del Grupo</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.slice(0, 9).map((a, idx) => {
                const AIcon = awardIcons[idx % awardIcons.length];
                const aColor = awardColors[idx % awardColors.length];
                const aBg = awardBgs[idx % awardBgs.length];
                return (
                  <div key={a.id} className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all group">
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

      {/* ══════════ 3 PASOS ══════════ */}
      <section className="py-24 px-4 bg-[#04052e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(26,26,255,0.12),transparent)]" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#80cc00] uppercase tracking-[0.2em] mb-3 block">Simple y rápido</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white">3 Pasos para<br />Abrir tu Cuenta</h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto">¿Listo para sumergirte en los mercados? Comenzar a operar es un proceso sencillo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative text-center group">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] right-[-calc(50%-40px)] h-px bg-gradient-to-r from-[#1a1aff]/40 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#1a1aff]/12 border-2 border-[#1a1aff]/25 text-[#80cc00] text-3xl font-black mb-6 mx-auto group-hover:border-[#1a1aff]/60 group-hover:bg-[#1a1aff]/20 transition-all">
                  {s.n}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{s.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="relative py-28 px-4 text-center overflow-hidden bg-[#04052e]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(26,26,255,0.18),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_85%_15%,rgba(128,204,0,0.08),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white leading-tight">
            ¿Listo para operar<br /><span className="text-[#80cc00]">como un profesional?</span>
          </h2>
          <p className="text-white/40 mb-10 text-lg">Cuenta demo gratuita con $10,000 activada al instante. Sin riesgo real.</p>
          <button
            onClick={() => window.location.href = createPageUrl('Register')}
            className="group inline-flex items-center gap-2 px-10 py-5 bg-[#80cc00] hover:bg-[#72b800] text-[#0d0d0d] font-black rounded-full text-lg transition-all shadow-2xl shadow-[#80cc00]/20 hover:scale-[1.04]"
          >
            Abrir Cuenta Gratis <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-white/20 mt-6">Operar con CFDs implica un riesgo significativo de pérdida de capital.</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
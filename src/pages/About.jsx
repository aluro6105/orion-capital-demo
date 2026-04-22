import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import {
  ArrowRight, CheckCircle2, Shield, Zap, Globe2, Users,
  HeadphonesIcon, BarChart3, Lock, CreditCard, Banknote,
  TrendingUp, Trophy, Medal, BadgeCheck, Gem, Award, Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const CORE_PILLARS = [
  {
    title: 'Fundado por Expertos',
    sub: 'Con licencia. De confianza. Global.',
    desc: 'Creado en 2020, Orion Capital ha crecido hasta convertirse en una referencia para traders latinoamericanos, con infraestructura segura y tecnología de primer nivel. Fundado por veteranos de la industria financiera, priorizamos el cumplimiento estricto, la liquidez y la precisión en los precios para que operes con confianza real.',
  },
  {
    title: 'Nuestra Historia',
    sub: 'Construido para traders que piensan.',
    desc: 'Muchos brokers se enfocan en volumen y ganancias rápidas. Nosotros lo hacemos diferente. Orion Capital está diseñado para traders serios que valoran el conocimiento y un camino claro hacia el crecimiento sostenido. Con tecnología avanzada y soporte dedicado, te ayudamos a dominar el arte del trading inteligente.',
  },
  {
    title: 'Nuestros Valores',
    sub: 'Transparencia e integridad ante todo.',
    desc: 'En Orion Capital, todo se construye sobre transparencia, integridad y una mentalidad centrada en el trader, garantizando comunicación abierta y decisiones siempre en tu mejor interés. Impulsados por la pasión por los mercados, abrazamos la innovación para darte una ventaja competitiva real.',
  },
  {
    title: 'Nuestra Promesa',
    sub: 'A tu lado. En cada operación.',
    desc: 'Estamos aquí para ayudarte a captar oportunidades de mercado con trading de bajo coste, tecnología de clase mundial y soporte continuo 24/5. Sin ruido. Solo un socio en quien puedes confiar cuando los mercados están abiertos y cuando no lo están.',
  },
];

const WHY_ITEMS = [
  {
    icon: HeadphonesIcon,
    title: 'Soporte en Vivo 24/5',
    desc: 'Nuestro equipo está disponible las 24 horas del día, 5 días a la semana, listo para asistirte en cualquier momento. Además, nuestro centro de ayuda ofrece respuestas inmediatas a las consultas más comunes.',
    accent: '#1E40AF',
  },
  {
    icon: BarChart3,
    title: 'Spreads competitivos sin comisiones ocultas',
    desc: 'Disfruta de condiciones de trading transparentes sin costes escondidos. Elige el tipo de cuenta que mejor se adapte a tu estilo y comienza a operar hoy mismo con costes claros en cada operación.',
    accent: '#2563EB',
  },
  {
    icon: Globe2,
    title: 'Opera Forex, Acciones, Índices y Cripto',
    desc: 'Accede al instante a 184 instrumentos globales. Opera pares de divisas populares, acciones internacionales, índices principales y criptomonedas líderes, todo en un solo lugar.',
    accent: '#1D4ED8',
  },
  {
    icon: Lock,
    title: 'Fondos Segregados y Protección de Saldo Negativo',
    desc: 'Tus fondos se mantienen en cuentas segregadas, completamente separadas de nuestro capital operativo. La protección de saldo negativo garantiza que nunca pierdas más de tu depósito inicial.',
    accent: '#1E40AF',
  },
  {
    icon: CreditCard,
    title: 'Depósitos y Retiros sin complicaciones',
    desc: 'Financiación de cuenta sin interrupciones con depósito mínimo accesible y retiros procesados con rapidez. Ofrecemos variedad de métodos de pago a través de instituciones financieras consolidadas.',
    accent: '#2563EB',
  },
  {
    icon: Zap,
    title: 'Ejecución Rápida sin Requotes',
    desc: 'Trading fluido con ejecución de órdenes veloz, diseñada para minimizar retrasos y garantizar que tus operaciones se procesen al precio solicitado, sin slippage injustificado.',
    accent: '#1D4ED8',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Regístrate y Verifica tu Perfil',
    desc: 'Completa el formulario de registro en minutos. Envía tu documentación KYC para validar tu identidad y habilitar todas las funciones de la plataforma.',
  },
  {
    n: '02',
    title: 'Abre tu Cuenta y Deposita',
    desc: 'Elige entre cuenta Demo con $10,000 virtuales o cuenta Real. Selecciona tu método de financiación favorito y actívate al instante.',
  },
  {
    n: '03',
    title: 'Accede a la Plataforma y Empieza',
    desc: 'Accede a Orion Capital desde el navegador o la app móvil. Configura tu watchlist, analiza los mercados y ejecuta tu primera operación con confianza.',
  },
];

const STATS = [
  { v: '2020', l: 'Año de fundación' },
  { v: '2,000+', l: 'Traders activos' },
  { v: '20+', l: 'Países con operaciones' },
  { v: '24/5', l: 'Soporte disponible' },
];

const TRUST_ITEMS = [
  { icon: Lock, label: 'Tus fondos están completamente seguros' },
  { icon: Shield, label: 'Sin comisiones ocultas ni letra pequeña' },
  { icon: CreditCard, label: 'Capital en cuentas segregadas y auditadas' },
  { icon: Zap, label: 'Depósitos y retiros procesados con agilidad' },
  { icon: Banknote, label: 'Asociaciones con instituciones financieras reguladas' },
];

const AWARDS_STATIC = [
  { title: 'Mejor Plataforma Emergente LATAM', issuer: 'FinTech Americas', year: 2024, icon: Trophy, color: '#1E40AF', bg: '#1E40AF15' },
  { title: 'Excelencia en Educación Financiera', issuer: 'Latin Finance Awards', year: 2023, icon: Medal, color: '#2563EB', bg: '#2563EB15' },
  { title: 'Innovación en Trading Digital', issuer: 'Finnovista · Fintech Radar', year: 2023, icon: BadgeCheck, color: '#1D4ED8', bg: '#1D4ED815' },
];

export default function AboutPage() {
  const { data: awardsDB = [] } = useQuery({
    queryKey: ['awards-about'],
    queryFn: () => base44.entities.Award.filter({ is_active: true }),
    staleTime: 5 * 60 * 1000,
  });

  const awards = awardsDB.length > 0 ? awardsDB : AWARDS_STATIC;
  const awardIcons = [Trophy, Medal, BadgeCheck, Gem, Award, Star];
  const awardColors = ['#1E40AF', '#2563EB', '#1D4ED8', '#3B82F6', '#60A5FA', '#1E40AF'];
  const awardBgs   = ['#1E40AF15', '#2563EB15', '#1D4ED815', '#3B82F615', '#60A5FA15', '#1E40AF15'];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-inter">
      <PublicNav currentPage="About" />

      {/* ══════════ HERO ══════════ */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center bg-white overflow-hidden px-4 pt-28 pb-20">
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#EFF6FF] to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E40AF] font-semibold mb-6 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E40AF]" />
            Acerca de Orion Capital
          </div>
          <h1 className="text-5xl sm:text-7xl font-black leading-none tracking-tight mb-6 text-gray-900">
            ACERCA DE<br /><span className="text-[#1E40AF]">ORION CAPITAL</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-6 leading-relaxed">
            Los Traders Empoderados Rinden Mejor
          </p>
          <p className="text-gray-400 text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Orion Capital te ayuda a navegar los mercados financieros con el conocimiento, la tecnología y el soporte que necesitas para operar con mayor confianza y consistencia.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => window.location.href = createPageUrl('Register')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-black rounded-lg transition-all shadow-lg hover:scale-[1.03]"
            >
              Abrir Cuenta <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              to={createPageUrl('Register')}
              className="inline-flex items-center gap-2 px-6 py-4 text-[#1E40AF] font-semibold rounded-lg border-2 border-[#1E40AF]/20 hover:border-[#1E40AF]/50 hover:bg-[#EFF6FF] transition-all"
            >
              Prueba una cuenta demo sin riesgo
            </Link>
          </div>
          <p className="text-xs text-gray-400 mt-6">Operar con CFDs implica un riesgo significativo de pérdida de capital.</p>
        </div>
      </section>

      {/* ══════════ STATS BAND ══════════ */}
      <div className="bg-[#1E40AF] py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.v}</div>
              <div className="text-xs text-white/60 font-medium uppercase tracking-wide">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ NUESTRO NÚCLEO ══════════ */}
      <section className="py-24 px-4 bg-[#F8FAFC] relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Quiénes somos</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Nuestro Núcleo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CORE_PILLARS.map((p, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#1E40AF]/30 hover:shadow-md transition-all group">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-[#1E40AF]">0{i + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">{p.title}</h3>
                <p className="text-sm text-[#1E40AF] font-semibold mb-3">{p.sub}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PRECISION PANEL ══════════ */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-4 block">Tecnología y precisión</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
              Orion Capital y la<br /><span className="text-[#1E40AF]">Excelencia Técnica</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-5">
              Nuestra filosofía refleja los mismos valores que importan en las disciplinas de alto rendimiento: decisiones rápidas, excelencia técnica y rendimiento consistente bajo presión.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Proporcionamos a nuestros traders las herramientas necesarias para navegar los mercados financieros con precisión y disciplina. Este compromiso representa nuestra dedicación a quienes entienden que el éxito sostenible se basa en la preparación estratégica.
            </p>
            <div className="flex flex-wrap gap-4">
              {['Precisión en la ejecución', 'Decisiones en tiempo real', 'Rendimiento constante', 'Tecnología de vanguardia'].map(tag => (
                <div key={tag} className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[#1E40AF] flex-shrink-0" />
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF]/8 to-[#2563EB]/5 rounded-3xl blur-2xl" />
            <div className="relative bg-[#0F172A] rounded-2xl p-10 border border-[#1E40AF]/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { v: '184', u: '', l: 'Instrumentos' },
                  { v: '<10ms', u: '', l: 'Ejecución' },
                  { v: '$100', u: '', l: 'Depósito mínimo' },
                  { v: '1:500', u: '', l: 'Apalancamiento máx.' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-5 text-center">
                    <div className="text-2xl font-black text-blue-300 mb-1">{s.v}<span className="text-sm">{s.u}</span></div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wide font-semibold">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 bg-[#1E40AF]/20 border border-[#1E40AF]/30 rounded-xl text-center">
                <p className="text-sm font-bold text-blue-200">Plataforma activa · Datos en tiempo real</p>
                <p className="text-xs text-white/40 mt-1">184 instrumentos disponibles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ¿POR QUÉ ORION CAPITAL? ══════════ */}
      <section className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Ventajas únicas</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">¿Por qué Orion Capital?</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Herramientas, condiciones y soporte diseñados para que operes mejor cada día.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#1E40AF]/25 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-4 group-hover:bg-[#DBEAFE] transition-colors">
                    <Icon className="h-6 w-6 text-[#1E40AF]" />
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
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-black rounded-lg transition-all shadow-lg shadow-[#1E40AF]/25"
            >
              Abre una cuenta con nosotros <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-gray-400 mt-3">Operar con CFDs implica un riesgo significativo de pérdida de capital.</p>
          </div>
        </div>
      </section>

      {/* ══════════ PRESENCIA GLOBAL ══════════ */}
      <section className="py-24 px-4 bg-[#F8FAFC] relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto text-center">
          <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-4 block">Alcance regional</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">Nuestra Presencia</h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-12 text-lg">
            Traders de más de 20 países confían en Orion Capital como su plataforma de referencia.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Somos Sociales', desc: 'Más de 2,000 traders activos' },
              { icon: Shield, label: 'Somos Fiables', desc: 'Plataforma en operación desde 2020' },
              { icon: Lock, label: 'Somos Seguros', desc: 'Infraestructura robusta y certificada' },
              { icon: Globe2, label: 'Somos Globales', desc: 'Operamos en más de 20 países' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#1E40AF]/30 hover:shadow-md transition-all group text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center mb-4 mx-auto group-hover:bg-[#DBEAFE] transition-colors">
                    <Icon className="h-6 w-6 text-[#1E40AF]" />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-2">{item.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ SEGURIDAD ══════════ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-4 block">Seguridad de nivel bancario</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
              Trading Seguro,<br /><span className="text-[#1E40AF]">Tranquilidad Mental.</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-10">
              Tu capital merece protección de nivel institucional y gestión completamente transparente. Nuestra tecnología garantiza ejecución rápida y te ayuda a identificar las mejores oportunidades con herramientas diseñadas para tu éxito.
            </p>
            <div className="space-y-3">
              {TRUST_ITEMS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 bg-[#F8FAFC] border border-gray-200 rounded-xl px-5 py-4 hover:border-[#1E40AF]/25 hover:bg-[#EFF6FF] transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#DBEAFE] transition-colors">
                      <Icon className="h-5 w-5 text-[#1E40AF]" />
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
                    <CheckCircle2 className="h-4 w-4 text-[#1E40AF] ml-auto flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>
            <div className="mt-8">
              <Link
                to={createPageUrl('Register')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-black rounded-lg transition-all text-sm shadow-md"
              >
                Descubre nuestras cuentas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E40AF]/5 to-[#2563EB]/10 rounded-3xl blur-3xl" />
            <div className="relative bg-[#0F172A] rounded-2xl border border-[#1E40AF]/20 overflow-hidden shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#1E40AF]/15 border border-[#1E40AF]/25 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="text-xl font-black text-white">Protección Total</h3>
                <p className="text-white/40 text-sm mt-1">Tu capital, siempre protegido</p>
              </div>
              <div className="space-y-3">
                {['Cifrado AES-256 de nivel bancario', 'Cuentas auditadas anualmente', 'Protección contra saldo negativo', 'Verificación 2FA disponible', 'Monitoreo de riesgo en tiempo real'].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-blue-300 flex-shrink-0" />
                    <span className="text-white/60">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ PREMIOS ══════════ */}
      <section className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Reconocimientos</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Premios & Logros</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Nuestro trabajo ha sido reconocido por instituciones y organizaciones líderes en fintech y educación financiera.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.slice(0, 9).map((a, idx) => {
              const AIcon = a.icon || awardIcons[idx % awardIcons.length];
              const aColor = a.color || awardColors[idx % awardColors.length];
              const aBg = a.bg || awardBgs[idx % awardBgs.length];
              return (
                <div key={a.id || idx} className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-[#1E40AF]/25 transition-all group">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border" style={{ background: aBg, borderColor: aColor + '30' }}>
                    <AIcon className="h-5 w-5" style={{ color: aColor }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm mb-0.5">{a.title}</div>
                    <div className="text-xs font-bold text-[#1E40AF]">{a.issuer} · {a.year}</div>
                    {a.description && <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-2">{a.description}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ 3 PASOS ══════════ */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#1E40AF] uppercase tracking-[0.2em] mb-3 block">Simple y rápido</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">3 Pasos para<br />Abrir tu Cuenta</h2>
            <p className="text-gray-500 mt-4 max-w-lg mx-auto">¿Listo para empezar? Abrir tu cuenta es un proceso sencillo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative text-center group">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] right-[-calc(50%-40px)] h-px bg-gray-200" />
                )}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#EFF6FF] border-2 border-[#BFDBFE] text-[#1E40AF] text-3xl font-black mb-6 mx-auto group-hover:border-[#1E40AF]/60 group-hover:bg-[#DBEAFE] transition-all">
                  {s.n}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="relative py-28 px-4 text-center overflow-hidden bg-[#1E40AF]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(255,255,255,0.06),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white leading-tight">
            ¿Listo para operar<br />con Orion Capital?
          </h2>
          <p className="text-white/60 mb-10 text-lg">Cuenta demo gratuita con $10,000 activada al instante. Sin riesgo real.</p>
          <button
            onClick={() => window.location.href = createPageUrl('Register')}
            className="group inline-flex items-center gap-2 px-10 py-5 bg-white hover:bg-gray-50 text-[#1E40AF] font-black rounded-lg text-lg transition-all shadow-xl hover:scale-[1.03]"
          >
            Abrir Cuenta Gratis <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-white/30 mt-6">Operar con CFDs implica un riesgo significativo de pérdida de capital.</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
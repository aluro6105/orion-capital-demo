import React from 'react';
import { createPageUrl } from '@/utils';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { Zap, Target, Heart, Globe2, Cpu, Shield, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

const TEAM = [
  { name: 'Alejandro Ruiz', role: 'CEO & Co-fundador', bio: 'Ex-trader institucional con 15 años de experiencia en mercados globales de forex y derivados.', initials: 'AR', gradient: 'from-[#1a1aff] to-[#80cc00]' },
  { name: 'María González', role: 'CTO & Co-fundadora', bio: 'Ingeniera de sistemas con experiencia en plataformas fintech de alto rendimiento y baja latencia.', initials: 'MG', gradient: 'from-[#7C3AED] to-[#1a1aff]' },
  { name: 'Carlos Morales', role: 'Head of Product', bio: 'Product manager especializado en UX financiero y educación de traders e inversores.', initials: 'CM', gradient: 'from-[#1a1aff] to-[#06b6d4]' },
  { name: 'Laura Fernández', role: 'Head of Data', bio: 'Especialista en ingeniería de datos y feeds de mercado en tiempo real con cobertura global.', initials: 'LF', gradient: 'from-[#f59e0b] to-[#80cc00]' },
];

const VALUES = [
  { icon: Target, title: 'Tecnología institucional', desc: 'La misma infraestructura que usan los brokers de primer nivel, ahora en tus manos sin barreras.', color: '#1a1aff', bg: '#1a1aff15' },
  { icon: Shield, title: 'Transparencia total', desc: 'Sin cargos ocultos ni letra pequeña. Siempre completamente claros con cada uno de nuestros usuarios.', color: '#80cc00', bg: '#80cc0015' },
  { icon: Zap, title: 'Velocidad de ejecución', desc: 'Precios actualizados en tiempo real, latencia mínima inferior a 5ms y confirmaciones al instante.', color: '#7C3AED', bg: '#7C3AED15' },
  { icon: Heart, title: 'Comunidad global', desc: 'Construido por traders para traders. Tu feedback da forma a cada nueva funcionalidad de la plataforma.', color: '#f59e0b', bg: '#f59e0b15' },
];

const HISTORY = [
  { year: '2020', title: 'Los orígenes', desc: 'Alejandro y María, frustrados por la falta de herramientas educativas de trading de calidad, deciden construir la plataforma que siempre quisieron tener.' },
  { year: '2021', title: 'Primera versión', desc: 'Lanzamos la beta privada con 500 usuarios. El feedback fue claro: los traders querían algo que se sintiera auténtico y de nivel profesional.' },
  { year: '2023', title: 'Datos en tiempo real', desc: 'Integramos feeds de precios en vivo con spreads reales. La plataforma alcanza los 10,000 usuarios activos mensuales.' },
  { year: '2025', title: 'NexusTrade', desc: 'Rediseño completo de la plataforma. Motor de trading avanzado, métricas institucionales, forex, crypto y commodities. La versión que ves ahora.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <PublicNav currentPage="About" />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f0fdf4] to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1aff]/10 border border-[#1a1aff]/20 text-xs text-[#1a1aff] font-semibold mb-6 tracking-wide">
            <Users className="h-3 w-3" />
            Quiénes somos
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-gray-900">
            Trading global para <span className="bg-gradient-to-r from-[#1a1aff] to-[#80cc00] bg-clip-text text-transparent">todos</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Somos un equipo de traders e ingenieros unidos por una misión: democratizar el acceso a tecnología institucional de mercados financieros para cualquier persona del mundo.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <div className="bg-[#1a1aff] py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { v: '2020', l: 'Año de fundación' },
            { v: '5K+', l: 'Traders activos' },
            { v: '50+', l: 'Países' },
            { v: '24/7', l: 'Soporte disponible' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.v}</div>
              <div className="text-xs text-white/75 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission / Vision */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#1a1aff] uppercase tracking-[0.2em] mb-3 block">Nuestra razón de ser</span>
            <h2 className="text-4xl font-black text-gray-900">Misión y visión</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#80cc00]/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-[#80cc00]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Nuestra Misión</h3>
              <p className="text-gray-500 leading-relaxed">
                Proporcionar a cualquier persona, sin importar su experiencia ni capital, acceso a herramientas de trading de nivel institucional con spreads competitivos, ejecución ultrarrápida y sin riesgo financiero real.
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#2196F3]/10 flex items-center justify-center mb-4">
                <Globe2 className="h-6 w-6 text-[#2196F3]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Nuestra Visión</h3>
              <p className="text-gray-500 leading-relaxed">
                Ser el broker educacional de referencia global, formando a la próxima generación de traders informados con tecnología real, datos en vivo y comunidad activa en más de 50 países.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block">Trayectoria</span>
            <h2 className="text-4xl font-black text-gray-900">Nuestra historia</h2>
          </div>
          <div className="space-y-6">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-[#1a1aff]/10 border border-[#1a1aff]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-black text-[#1a1aff]">{h.year}</span>
                  </div>
                  {i < HISTORY.length - 1 && <div className="w-0.5 flex-1 bg-gray-100 mt-2" />}
                </div>
                <div className="pb-6 pt-1">
                  <h3 className="font-black text-gray-900 mb-1.5">{h.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-[#1a1aff] uppercase tracking-[0.2em] mb-3 block">Lo que nos guía</span>
            <h2 className="text-4xl font-black text-gray-900">Nuestros valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-gray-200 transition-all group cursor-default">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: v.bg }}>
                    <Icon className="h-6 w-6" style={{ color: v.color }} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block">El equipo</span>
            <h2 className="text-4xl font-black text-gray-900">Las personas detrás de NEXUS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-xl font-black text-white mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {m.initials}
                </div>
                <div className="font-bold text-gray-900">{m.name}</div>
                <div className="text-xs text-[#1a1aff] font-semibold mt-0.5 mb-3">{m.role}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-12 h-12 rounded-xl bg-[#1a1aff]/10 flex items-center justify-center mx-auto mb-4">
            <Cpu className="h-6 w-6 text-[#1a1aff]" />
          </div>
          <span className="text-xs font-bold text-[#1a1aff] uppercase tracking-[0.2em] mb-3 block">Stack tecnológico</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Nuestra tecnología</h2>
          <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
            Feeds de precios en tiempo real de proveedores institucionales, arquitectura de baja latencia y una interfaz construida con los mismos estándares que los mejores brokers del mundo.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {['Bloomberg', 'Refinitiv', 'Alpha Vantage', 'Polygon.io', 'FactSet', 'ICE Data', 'LSEG', 'Morningstar'].map(t => (
              <div key={t} className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-[#1a1aff]/30 transition-all">
                <div className="text-sm font-bold text-gray-900">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA dark */}
      <section className="relative py-24 px-4 text-center overflow-hidden bg-[#0a0d14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(26,26,255,0.12),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-white">¿Listo para operar como un pro?</h2>
          <p className="text-white/40 mb-8">Cuenta demo con $10,000 activada en 30 segundos. Sin riesgo real.</p>
          <button onClick={() => window.location.href = createPageUrl('Register')}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#80cc00] hover:bg-[#72b800] text-[#0d0d0d] font-bold rounded-full transition-all shadow-lg shadow-[#80cc00]/25 hover:scale-[1.03]">
            Abrir cuenta gratis <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
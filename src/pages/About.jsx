import React from 'react';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { Zap, Target, Heart, Globe2, Cpu, Shield, Users, ArrowRight } from 'lucide-react';

const TEAM = [
  { name: 'Alejandro Ruiz', role: 'CEO & Co-fundador', bio: 'Ex-trader institucional con 15 años de experiencia en mercados globales.', initials: 'AR', gradient: 'from-blue-500 to-cyan-500' },
  { name: 'María González', role: 'CTO & Co-fundadora', bio: 'Ingeniera de sistemas con experiencia en plataformas fintech de alto rendimiento.', initials: 'MG', gradient: 'from-purple-500 to-pink-500' },
  { name: 'Carlos Morales', role: 'Head of Product', bio: 'Product manager enfocado en UX financiero y educación de inversores.', initials: 'CM', gradient: 'from-green-500 to-emerald-500' },
  { name: 'Laura Fernández', role: 'Head of Data', bio: 'Especialista en data engineering y streams de datos de mercado en tiempo real.', initials: 'LF', gradient: 'from-orange-500 to-red-500' },
];

const VALUES = [
  { icon: Target, title: 'Tecnología de primer nivel', desc: 'La misma infraestructura que usan los brokers institucionales, en tus manos.', color: 'text-[#2196F3]', bg: 'bg-[#2196F3]/10' },
  { icon: Shield, title: 'Transparencia', desc: 'Sin costes ocultos. Sin letra pequeña. Siempre claros con nuestros usuarios.', color: 'text-[#26a69a]', bg: 'bg-[#26a69a]/10' },
  { icon: Zap, title: 'Velocidad real', desc: 'WebSocket tick a tick, latencia mínima, actualizaciones en tiempo real.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: Heart, title: 'Comunidad', desc: 'Construido por traders para traders. Escuchamos a nuestra comunidad.', color: 'text-pink-400', bg: 'bg-pink-500/10' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <PublicNav currentPage="About" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block text-xs font-semibold text-purple-400 uppercase tracking-widest mb-4">Quiénes somos</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight">
            Tecnología de <span className="bg-gradient-to-r from-[#2196F3] to-purple-400 bg-clip-text text-transparent">trading</span> para todos
          </h1>
          <p className="text-lg text-white/50 leading-relaxed">
            Somos un equipo de traders e ingenieros unidos por una misión: dar acceso a tecnología institucional de mercados financieros a cualquier persona del mundo.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 px-4 bg-[#070910]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-8">
            <Target className="h-8 w-8 text-[#2196F3] mb-4" />
            <h2 className="text-xl font-black text-white mb-3">Nuestra Misión</h2>
            <p className="text-white/60 leading-relaxed">
              Proporcionar a cualquier persona, independientemente de su experiencia o capital, acceso a una plataforma de trading profesional para aprender sin riesgo financiero real.
            </p>
          </div>
          <div className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-8">
            <Globe2 className="h-8 w-8 text-purple-400 mb-4" />
            <h2 className="text-xl font-black text-white mb-3">Nuestra Visión</h2>
            <p className="text-white/60 leading-relaxed">
              Ser la plataforma de referencia mundial para la educación en trading simulado, formando a la próxima generación de inversores informados y responsables.
            </p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black">Nuestra historia</h2>
          </div>
          <div className="space-y-6">
            {[
              { year: '2022', title: 'El inicio', desc: 'Alejandro y María, ambos frustrados con la falta de herramientas educativas de trading de calidad, deciden construir lo que siempre quisieron tener.' },
              { year: '2023', title: 'Primer prototipo', desc: 'Lanzamos la beta privada con 200 usuarios. El feedback fue brutal pero revelador: la gente quería algo que se sintiera "real".' },
              { year: '2024', title: 'WebSocket & tiempo real', desc: 'Integramos streaming de datos via WebSocket. La plataforma empieza a sentirse como un broker de verdad. Llegamos a 10,000 usuarios.' },
              { year: '2025', title: 'Nexus', desc: 'Rediseño completo de la plataforma. Motor de trading avanzado, métricas institucionales y la interfaz que tienes delante ahora.' },
            ].map((h, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#2196F3]/10 border border-[#2196F3]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#2196F3]">{h.year}</span>
                  </div>
                  {i < 3 && <div className="w-0.5 h-full bg-[#1e2130] mt-2" />}
                </div>
                <div className="pb-6">
                  <h3 className="font-bold text-white mb-1">{h.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-[#070910]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black">Nuestros valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 hover:border-white/10 transition-all">
                  <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${v.color}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-white/50">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black">El equipo</h2>
            <p className="text-white/50 mt-2">Las personas detrás de Nexus</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m, i) => (
              <div key={i} className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 text-center hover:border-white/10 transition-all">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-xl font-black text-white mx-auto mb-4`}>
                  {m.initials}
                </div>
                <div className="font-bold text-white">{m.name}</div>
                <div className="text-xs text-[#2196F3] mt-0.5 mb-3">{m.role}</div>
                <p className="text-xs text-white/50 leading-relaxed">{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech */}
      <section className="py-16 px-4 bg-[#070910]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Cpu className="h-10 w-10 text-[#2196F3] mx-auto mb-4" />
            <h2 className="text-3xl font-black">Nuestra tecnología</h2>
            <p className="text-white/50 mt-2 max-w-2xl mx-auto">
              WebSocket streaming con proveedores de datos institucionales, arquitectura segura con proxy de backend para proteger las conexiones, y una interfaz construida con las mismas tecnologías que usan los mejores brokers del mundo.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['WebSocket', 'React + Vite', 'Canvas Charts', 'Proxy seguro'].map(t => (
              <div key={t} className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-4 text-center">
                <div className="text-sm font-semibold text-white">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
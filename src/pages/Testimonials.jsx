import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { Star, MessageSquare } from 'lucide-react';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
      ))}
    </div>
  );
}

export default function TestimonialsPage() {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.filter({ approved: true }),
  });

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <PublicNav currentPage="Testimonials" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#26a69a]/10 mb-6 mx-auto">
          <MessageSquare className="h-8 w-8 text-[#26a69a]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Lo que dicen nuestros usuarios</h1>
        <p className="text-white/50 max-w-xl mx-auto">
          Miles de traders operan con Nexus. Estas son sus historias.
        </p>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 bg-[#070910]">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 py-4">
          {[
            { v: '10,000+', l: 'Usuarios activos' },
            { v: '4.9/5', l: 'Valoración media' },
            { v: '98%', l: 'Recomendarían la plataforma' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-black text-white">{s.v}</div>
              <div className="text-sm text-white/40 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center text-white/40 py-20">Cargando testimonios…</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="h-12 w-12 text-[#1e2130] mx-auto mb-4" />
              <p className="text-white/40">Los testimonios aprobados aparecerán aquí.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {testimonials.map(t => (
                <div key={t.id} className="break-inside-avoid bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 hover:border-white/10 transition-all">
                  <StarRating rating={t.rating || 5} />
                  <p className="text-sm text-white/70 mt-3 mb-4 leading-relaxed italic">"{t.text}"</p>
                  {t.use_case && (
                    <div className="text-xs text-[#2196F3] mb-4 font-medium">📌 {t.use_case}</div>
                  )}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2196F3] to-[#7C3AED] flex items-center justify-center text-sm font-bold">
                        {t.name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-white text-sm">{t.name}</div>
                      <div className="text-xs text-white/40">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#070910] text-center">
        <h2 className="text-2xl font-black mb-3">¿Listo para empezar a operar?</h2>
        <p className="text-white/50 mb-6">Abre tu cuenta hoy con $10,000 en cuenta demo.</p>
        <button onClick={() => window.location.href = '/login'}
          className="px-8 py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold rounded-xl transition-all">
          Abrir cuenta
        </button>
      </section>

      <PublicFooter />
    </div>
  );
}
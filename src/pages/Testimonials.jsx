import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { Star, MessageSquare, ArrowRight } from 'lucide-react';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'text-[#00C853] fill-[#00C853]' : 'text-gray-200 fill-gray-200'}`} />
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
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <PublicNav currentPage="Testimonials" />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f0fdf4] to-transparent pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00C853]/10 border border-[#00C853]/20 mb-6 mx-auto">
            <MessageSquare className="h-8 w-8 text-[#00C853]" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C853]/10 border border-[#00C853]/20 text-xs text-[#00a844] font-semibold mb-6 mx-auto w-fit block tracking-wide">
            Testimonios reales
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 text-gray-900">Lo que dicen<br />nuestros traders</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Miles de traders operan con NEXUS. Estas son sus historias.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <div className="bg-[#00C853] py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8">
          {[
            { v: '10,000+', l: 'Usuarios activos' },
            { v: '4.9/5', l: 'Valoración media' },
            { v: '98%', l: 'Recomendarían NEXUS' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.v}</div>
              <div className="text-xs text-white/75 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center text-gray-400 py-20">Cargando testimonios…</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">Los testimonios aprobados aparecerán aquí.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {testimonials.map(t => (
                <div key={t.id} className="break-inside-avoid bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                  <StarRating rating={t.rating || 5} />
                  <p className="text-gray-600 text-sm leading-relaxed my-4">"{t.text}"</p>
                  {t.use_case && (
                    <div className="text-xs text-[#00C853] mb-4 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />{t.use_case}
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C853] to-[#2196F3] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                        {t.name?.[0]}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA dark */}
      <section className="relative py-24 px-4 text-center overflow-hidden bg-[#0a0d14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(0,200,83,0.08),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-white">¿Listo para empezar a operar?</h2>
          <p className="text-white/40 mb-8">Abre tu cuenta hoy con $10,000 en cuenta demo. Sin riesgo real.</p>
          <button onClick={() => window.location.href = '/login'}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#00C853] hover:bg-[#00b34a] text-white font-bold rounded-full transition-all shadow-lg shadow-[#00C853]/25 hover:scale-[1.03]">
            Abrir cuenta gratis <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
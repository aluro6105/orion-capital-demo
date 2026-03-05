import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { Award, Trophy, Star } from 'lucide-react';

const CATEGORY_COLORS = {
  innovation: 'text-[#2196F3] bg-[#2196F3]/10',
  education: 'text-[#26a69a] bg-[#26a69a]/10',
  technology: 'text-purple-400 bg-purple-500/10',
  community: 'text-pink-400 bg-pink-500/10',
  best_platform: 'text-amber-400 bg-amber-500/10',
};

export default function AwardsPage() {
  const { data: awards = [], isLoading } = useQuery({
    queryKey: ['awards'],
    queryFn: () => base44.entities.Award.filter({ is_active: true }),
  });

  const byYear = awards.reduce((acc, a) => {
    const y = a.year || 'Sin año';
    if (!acc[y]) acc[y] = [];
    acc[y].push(a);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <PublicNav currentPage="Awards" />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 mb-6 mx-auto">
          <Trophy className="h-8 w-8 text-amber-400" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Premios & Reconocimientos</h1>
        <p className="text-white/50 max-w-xl mx-auto">
          El trabajo de nuestro equipo ha sido reconocido por instituciones y organizaciones líderes en fintech y educación financiera.
        </p>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center text-white/40 py-20">Cargando premios…</div>
          ) : awards.length === 0 ? (
            <div className="text-center py-20">
              <Award className="h-12 w-12 text-[#1e2130] mx-auto mb-4" />
              <p className="text-white/40">Los premios aparecerán aquí una vez sean añadidos desde el panel de administración.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {years.map(year => (
                <div key={year}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-3xl font-black text-white/20">{year}</div>
                    <div className="flex-1 h-px bg-[#1e2130]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {byYear[year].map(a => {
                      const colorClass = CATEGORY_COLORS[a.category] || 'text-amber-400 bg-amber-500/10';
                      return (
                        <div key={a.id} className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 flex gap-4 hover:border-amber-500/20 transition-all group">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            {a.logo_url ? (
                              <img src={a.logo_url} alt={a.issuer} className="w-8 h-8 object-contain" />
                            ) : (
                              <Award className="h-6 w-6 text-amber-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white">{a.title}</div>
                            <div className="text-xs text-[#8b8fa8] mt-0.5 mb-2">{a.issuer}</div>
                            {a.category && (
                              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
                                {a.category.replace('_', ' ').toUpperCase()}
                              </span>
                            )}
                            {a.description && <p className="text-xs text-white/50 mt-2 leading-relaxed">{a.description}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
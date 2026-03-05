import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { Trophy, Medal, BadgeCheck, Gem, Award, Star } from 'lucide-react';

const AWARD_ICONS = [Trophy, Medal, BadgeCheck, Gem, Award, Star];
const AWARD_COLORS = ['#f59e0b', '#2196F3', '#00C853', '#7C3AED', '#ef5350', '#06b6d4'];
const AWARD_BGS = ['#f59e0b15', '#2196F315', '#00C85315', '#7C3AED15', '#ef535015', '#06b6d415'];

const CATEGORY_LABELS = {
  innovation: 'Innovación',
  education: 'Educación',
  technology: 'Tecnología',
  community: 'Comunidad',
  best_platform: 'Mejor plataforma',
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

  // global index to assign unique icon/color per award
  let globalIdx = 0;

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <PublicNav currentPage="Awards" />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#fffbeb] to-transparent pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 mb-6 mx-auto">
            <Trophy className="h-8 w-8 text-amber-500" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs text-amber-600 font-semibold mb-6 tracking-wide block mx-auto w-fit">
            Reconocimientos
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 text-gray-900">Premios & Logros</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            El trabajo de nuestro equipo ha sido reconocido por instituciones y organizaciones líderes en fintech y educación financiera.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <div className="bg-[#00C853] py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12">
          {[
            { v: awards.length || '10+', l: 'Premios recibidos' },
            { v: years.length || '3+', l: 'Años de reconocimientos' },
            { v: '5', l: 'Categorías premiadas' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.v}</div>
              <div className="text-xs text-white/75 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="text-center text-gray-400 py-20">Cargando premios…</div>
          ) : awards.length === 0 ? (
            <div className="text-center py-20">
              <Award className="h-12 w-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">Los premios aparecerán aquí una vez sean añadidos desde el panel de administración.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {years.map(year => (
                <div key={year}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-3xl font-black text-gray-200">{year}</div>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {byYear[year].map(a => {
                      const idx = globalIdx++;
                      const AIcon = AWARD_ICONS[idx % AWARD_ICONS.length];
                      const aColor = AWARD_COLORS[idx % AWARD_COLORS.length];
                      const aBg = AWARD_BGS[idx % AWARD_BGS.length];
                      return (
                        <div key={a.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all group flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border" style={{ background: aBg, borderColor: aColor + '30' }}>
                            {a.logo_url ? (
                              <img src={a.logo_url} alt={a.issuer} className="w-7 h-7 object-contain" />
                            ) : (
                              <AIcon className="h-5 w-5" style={{ color: aColor }} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 text-sm">{a.title}</div>
                            <div className="text-xs font-semibold mt-0.5 mb-2" style={{ color: aColor }}>{a.issuer}</div>
                            {a.category && (
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: aColor, background: aBg }}>
                                {CATEGORY_LABELS[a.category] || a.category}
                              </span>
                            )}
                            {a.description && <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-2">{a.description}</p>}
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

      {/* CTA dark */}
      <section className="relative py-24 px-4 text-center overflow-hidden bg-[#0a0d14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(0,200,83,0.08),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-white">Forma parte de la historia</h2>
          <p className="text-white/40 mb-8">Únete a los miles de traders que ya confían en NEXUS.</p>
          <button onClick={() => window.location.href = '/login'}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#00C853] hover:bg-[#00b34a] text-white font-bold rounded-full transition-all shadow-lg shadow-[#00C853]/25 hover:scale-[1.03]">
            Abrir cuenta gratis
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { Trophy, Medal, BadgeCheck, Gem, Award, Star, ArrowRight } from 'lucide-react';

const AWARD_ICONS = [Trophy, Medal, BadgeCheck, Gem, Award, Star];
const AWARD_COLORS = ['#1E40AF', '#2563EB', '#1D4ED8', '#3B82F6', '#1E40AF', '#2563EB'];
const AWARD_BGS   = ['#1E40AF15', '#2563EB15', '#1D4ED815', '#3B82F615', '#1E40AF15', '#2563EB15'];

const CATEGORY_LABELS = {
  innovation: 'Innovación',
  education: 'Educación',
  technology: 'Tecnología',
  community: 'Comunidad',
  best_platform: 'Mejor plataforma',
};

const STATIC_AWARDS = [
  { id: 's1', title: 'Mejor Plataforma Emergente LATAM', issuer: 'FinTech Americas', year: 2024, category: 'best_platform' },
  { id: 's2', title: 'Excelencia en Educación Financiera', issuer: 'Latin Finance Awards', year: 2023, category: 'education' },
  { id: 's3', title: 'Innovación en Trading Digital', issuer: 'Finnovista · Fintech Radar', year: 2023, category: 'innovation' },
];

export default function AwardsPage() {
  const { data: awardsDB = [], isLoading } = useQuery({
    queryKey: ['awards'],
    queryFn: () => base44.entities.Award.filter({ is_active: true }),
  });

  const awards = awardsDB.length > 0 ? awardsDB : STATIC_AWARDS;

  const byYear = awards.reduce((acc, a) => {
    const y = a.year || 'Sin año';
    if (!acc[y]) acc[y] = [];
    acc[y].push(a);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => b - a);
  let globalIdx = 0;

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <PublicNav currentPage="Awards" />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#EFF6FF] to-transparent pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] mb-6 mx-auto">
            <Trophy className="h-7 w-7 text-[#1E40AF]" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E40AF] font-semibold mb-5 tracking-wide">
            Reconocimientos
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 text-gray-900">Premios & Logros</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Nuestro trabajo ha sido reconocido por instituciones y organizaciones líderes en fintech y educación financiera.
          </p>
        </div>
      </section>

      {/* Stats band */}
      <div className="bg-[#1E40AF] py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12">
          {[
            { v: awards.length || '3+', l: 'Premios recibidos' },
            { v: years.length || '2+', l: 'Años de reconocimientos' },
            { v: '4', l: 'Categorías premiadas' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">{s.v}</div>
              <div className="text-xs text-white/60 font-medium uppercase tracking-wide">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="text-center text-gray-400 py-20">Cargando premios…</div>
          ) : (
            <div className="space-y-14">
              {years.map(year => (
                <div key={year}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-3xl font-black text-gray-300">{year}</div>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {byYear[year].map(a => {
                      const idx = globalIdx++;
                      const AIcon = AWARD_ICONS[idx % AWARD_ICONS.length];
                      const aColor = AWARD_COLORS[idx % AWARD_COLORS.length];
                      const aBg = AWARD_BGS[idx % AWARD_BGS.length];
                      return (
                        <div key={a.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-[#1E40AF]/25 transition-all group flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform border" style={{ background: aBg, borderColor: aColor + '30' }}>
                            {a.logo_url ? (
                              <img src={a.logo_url} alt={a.issuer} className="w-7 h-7 object-contain" />
                            ) : (
                              <AIcon className="h-5 w-5" style={{ color: aColor }} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 text-sm">{a.title}</div>
                            <div className="text-xs font-semibold mt-0.5 mb-2 text-[#1E40AF]">{a.issuer}</div>
                            {a.category && (
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1E40AF]">
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

      {/* CTA */}
      <section className="relative py-24 px-4 text-center overflow-hidden bg-[#1E40AF]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(255,255,255,0.06),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-white">Forma parte de la historia</h2>
          <p className="text-white/60 mb-8">Únete a los traders que ya confían en Orion Capital.</p>
          <button onClick={() => window.location.href = createPageUrl('Register')}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-[#1E40AF] font-bold rounded-lg transition-all shadow-lg hover:scale-[1.02]">
            Abrir cuenta gratis <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
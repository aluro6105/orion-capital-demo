import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { HelpCircle, Search, ChevronDown, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const STATIC_FAQS = [
  { id: 's1', category: 'cuenta', question: '¿Cómo abro una cuenta en NEXUS?', answer: 'Introduce tu email y elige una contraseña. El proceso tarda menos de 30 segundos y tu cuenta demo queda activada al instante.' },
  { id: 's2', category: 'cuenta', question: '¿Cuánto capital tiene la cuenta demo de NEXUS?', answer: 'La cuenta demo de NEXUS se activa con $10,000 virtuales. Puedes resetearla desde el panel de control en cualquier momento.' },
  { id: 's3', category: 'cuenta', question: '¿Puedo tener múltiples cuentas?', answer: 'Puedes tener una cuenta Demo y una cuenta Real. La cuenta Real requiere verificación de identidad para operar.' },
  { id: 's5', category: 'mercado', question: '¿Con qué frecuencia se actualizan los precios?', answer: 'Los precios de NEXUS se actualizan en tiempo real, con múltiples actualizaciones por segundo para máxima precisión.' },
  { id: 's6', category: 'mercado', question: '¿Qué instrumentos están disponibles?', answer: 'Acciones (AAPL, MSFT, NVDA, TSLA, AMZN), Fondos cotizados (SPY, QQQ, IWM), Divisas (EUR/USD, GBP/USD, USD/JPY) y Criptomonedas (BTC/USD, ETH/USD).' },
  { id: 's7', category: 'trading', question: '¿Qué tipos de órdenes puedo usar?', answer: 'Órdenes de mercado con validación de saldo en tiempo real. Las órdenes limitadas están en desarrollo y estarán disponibles próximamente.' },
  { id: 's8', category: 'trading', question: '¿Puedo hacer posiciones cortas?', answer: 'No en esta versión. Las posiciones cortas están planificadas para una fase futura de NEXUS.' },
  { id: 's9', category: 'trading', question: '¿Cómo se calculan las ganancias y pérdidas?', answer: 'Las ganancias no realizadas se calculan en tiempo real: (precio actual - precio promedio) × cantidad. Las ganancias realizadas se registran al cerrar posiciones.' },
  { id: 's10', category: 'seguridad', question: '¿Es segura mi información en NEXUS?', answer: 'Sí. Toda la información en NEXUS se almacena de forma segura. Las conexiones de datos se realizan a través de un sistema de backend protegido.' },
  { id: 's11', category: 'seguridad', question: '¿Qué datos guarda NEXUS de mí?', answer: 'Correo electrónico, nombre, historial de operaciones y preferencias de cuenta. Nunca datos bancarios sin proceso de verificación previo.' },
  { id: 's12', category: 'precios', question: '¿Cuánto cuesta la plataforma NEXUS?', answer: 'Consulta nuestros planes disponibles en la sección de precios. NEXUS cuenta con opciones para todos los perfiles de inversión.' },
  { id: 's13', category: 'precios', question: '¿Habrá planes premium en NEXUS?', answer: 'Sí. Los planes premium de NEXUS añadirán más instrumentos, indicadores avanzados, herramientas de análisis multicharts y soporte prioritario.' },
];

const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'cuenta', label: 'Cuenta' },
  { id: 'mercado', label: 'Datos de mercado' },
  { id: 'trading', label: 'Trading' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'precios', label: 'Precios' },
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState(null);

  const { data: dbFaqs = [] } = useQuery({
    queryKey: ['faqs'],
    queryFn: () => base44.entities.Faq.filter({ is_active: true }),
  });

  const allFaqs = dbFaqs.length > 0 ? dbFaqs : STATIC_FAQS;

  const filtered = allFaqs.filter(f => {
    const matchCat = activeCategory === 'all' || f.category === activeCategory;
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <PublicNav currentPage="FAQ" />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f0fdf4] to-transparent pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#00C853]/10 border border-[#00C853]/20 mb-6 mx-auto">
            <HelpCircle className="h-8 w-8 text-[#00C853]" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C853]/10 border border-[#00C853]/20 text-xs text-[#00a844] font-semibold mb-6 mx-auto w-fit block tracking-wide">
            Soporte
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 text-gray-900">Preguntas<br />frecuentes</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg mb-10">
            Todo lo que necesitas saber sobre NEXUS.
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar pregunta…"
              className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/10 transition-all bg-white"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <div className="px-4 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === c.id
                  ? 'bg-[#00C853] text-white shadow-md shadow-[#00C853]/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ list */}
      <section className="py-16 px-4 pb-24 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No se encontraron resultados para "{search}"</div>
          ) : (
            <div className="space-y-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {filtered.map((f, idx) => (
                <div key={f.id} className={idx > 0 ? 'border-t border-gray-100' : ''}>
                  <button onClick={() => setOpenId(openId === f.id ? null : f.id)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-900 text-sm">{f.question}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-300 ml-4 ${openId === f.id ? 'rotate-180 text-[#00C853]' : ''}`} />
                  </button>
                  {openId === f.id && (
                    <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">{f.answer}</div>
                  )}
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
          <h2 className="text-3xl font-black mb-3 text-white">¿No encontraste tu respuesta?</h2>
          <p className="text-white/40 mb-8 text-sm">Nuestro equipo de soporte está aquí para ayudarte.</p>
          <button onClick={() => window.location.href = createPageUrl('Register')}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#00C853] hover:bg-[#00b34a] text-white font-bold rounded-full transition-all shadow-lg shadow-[#00C853]/25 hover:scale-[1.03]">
            Contactar soporte <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
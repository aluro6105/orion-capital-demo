import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { HelpCircle, Search, ChevronDown } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <PublicNav currentPage="FAQ" />

      {/* Hero */}
      <section className="pt-32 pb-10 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2196F3]/10 mb-6 mx-auto">
          <HelpCircle className="h-8 w-8 text-[#2196F3]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Preguntas frecuentes</h1>
        <p className="text-white/50 max-w-xl mx-auto mb-8">
          Todo lo que necesitas saber sobre NEXUS.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar pregunta…"
            className="pl-10 bg-[#0f1117] border-[#1e2130] text-white placeholder:text-white/30" />
        </div>
      </section>

      {/* Categories */}
      <div className="px-4 pb-8">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                activeCategory === c.id ? 'bg-[#2196F3] text-white font-semibold' : 'bg-[#0f1117] border border-[#1e2130] text-white/60 hover:text-white hover:border-white/20'
              }`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ list */}
      <section className="py-8 px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-white/40">No se encontraron resultados para "{search}"</div>
          ) : (
            <div className="space-y-3">
              {filtered.map(f => (
                <div key={f.id} className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
                  <button onClick={() => setOpenId(openId === f.id ? null : f.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/2 transition-all">
                    <span className="font-medium text-white text-sm">{f.question}</span>
                    <ChevronDown className={`h-4 w-4 text-white/40 flex-shrink-0 transition-transform ${openId === f.id ? 'rotate-180' : ''}`} />
                  </button>
                  {openId === f.id && (
                    <div className="px-5 pb-5 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">{f.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still need help */}
      <section className="py-12 px-4 bg-[#070910] text-center">
        <h2 className="text-xl font-black mb-2">¿No encontraste tu respuesta?</h2>
        <p className="text-white/50 text-sm mb-5">Nuestro equipo de soporte está aquí para ayudarte.</p>
        <button onClick={() => window.location.href = '/login'}
          className="px-6 py-2.5 bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold rounded-xl text-sm transition-all">
          Contactar soporte
        </button>
      </section>

      <PublicFooter />
    </div>
  );
}
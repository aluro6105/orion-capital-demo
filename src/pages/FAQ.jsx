import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { HelpCircle, Search, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';

const STATIC_FAQS = [
  { id: 's1', category: 'cuenta', question: '¿Es gratis SimuTrade TV-Lite?', answer: 'Sí, completamente gratis. Sin tarjeta de crédito, sin compromisos, sin límites de tiempo.' },
  { id: 's2', category: 'cuenta', question: '¿Cómo creo una cuenta?', answer: 'Haz clic en "Crear cuenta gratis", introduce tu email, elige una contraseña y listo. El proceso tarda menos de 30 segundos.' },
  { id: 's3', category: 'cuenta', question: '¿Puedo tener múltiples cuentas?', answer: 'Puedes tener una cuenta Demo y una cuenta Real. La cuenta Demo tiene $100,000 virtuales, mientras que la Real requiere verificación KYC.' },
  { id: 's4', category: 'mercado', question: '¿Los precios son datos reales?', answer: 'Usamos datos de mercado de alta fidelidad a través de WebSocket. Los datos pueden ser de proveedores como Finnhub o Twelve Data según la configuración del administrador.' },
  { id: 's5', category: 'mercado', question: '¿Con qué frecuencia se actualizan los precios?', answer: 'Los precios se actualizan en tiempo real via WebSocket, con un máximo de 5-10 actualizaciones por segundo para garantizar la estabilidad de la interfaz.' },
  { id: 's6', category: 'mercado', question: '¿Qué instrumentos están disponibles?', answer: 'Acciones (AAPL, MSFT, NVDA, TSLA, AMZN), ETFs (SPY, QQQ, IWM), Forex (EUR/USD, GBP/USD, USD/JPY) y Crypto (BTC/USD, ETH/USD). También oro (XAU/USD) si el proveedor lo soporta.' },
  { id: 's7', category: 'trading', question: '¿Puedo perder dinero real?', answer: 'No. Todo el trading se realiza con dinero virtual. La cuenta Demo tiene $100,000 virtuales y puedes resetearla cuando quieras.' },
  { id: 's8', category: 'trading', question: '¿Qué tipos de órdenes puedo usar?', answer: 'En el MVP puedes usar órdenes de mercado (Market). Las órdenes Limit están en desarrollo como Fase 2.' },
  { id: 's9', category: 'trading', question: '¿Puedo hacer posiciones cortas?', answer: 'No en esta versión. Los cortos (short selling) están planificados para una fase futura de desarrollo.' },
  { id: 's10', category: 'trading', question: '¿Cómo se calcula el P&L?', answer: 'El P&L no realizado se calcula en tiempo real: (precio actual - precio promedio) × cantidad. El P&L realizado se registra al cerrar posiciones.' },
  { id: 's11', category: 'seguridad', question: '¿Es segura mi información?', answer: 'Sí. Toda la información se almacena de forma segura. Las API keys de proveedores de datos nunca se exponen al frontend.' },
  { id: 's12', category: 'seguridad', question: '¿Qué datos guardáis de mí?', answer: 'Email, nombre, historial de operaciones virtuales y preferencias de cuenta. Nunca datos bancarios reales.' },
  { id: 's13', category: 'seguridad', question: '¿Sois un broker regulado?', answer: 'No. SimuTrade TV-Lite es una plataforma educativa, no un broker. No está sujeta a regulación financiera ya que no gestiona dinero real.' },
  { id: 's14', category: 'precios', question: '¿Cuánto cuesta?', answer: 'Actualmente SimuTrade TV-Lite es completamente gratuito. En el futuro podrían existir planes premium con funciones adicionales.' },
  { id: 's15', category: 'precios', question: '¿Habrá versión de pago?', answer: 'Posiblemente en el futuro. El plan básico siempre será gratuito. Los planes premium añadirán más instrumentos, indicadores avanzados y funciones de análisis.' },
];

const CATEGORIES = [
  { id: 'all', label: 'Todas' },
  { id: 'cuenta', label: 'Cuenta' },
  { id: 'mercado', label: 'Datos de mercado' },
  { id: 'trading', label: 'Trading simulado' },
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
          Todo lo que necesitas saber sobre Nexus.
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
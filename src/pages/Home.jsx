import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ArrowRight, Play, Zap, Shield, TrendingUp, BarChart3, Globe2,
  Star, ChevronDown, CheckCircle2, Cpu, Wifi, LineChart, Users, Award
} from 'lucide-react';

const INSTRUMENTS = [
  { type: 'Acciones', symbols: ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'AMZN'], color: 'from-blue-500/20 to-blue-600/5', icon: '📈' },
  { type: 'ETFs', symbols: ['SPY', 'QQQ', 'IWM'], color: 'from-purple-500/20 to-purple-600/5', icon: '🏦' },
  { type: 'Forex', symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY'], color: 'from-green-500/20 to-green-600/5', icon: '💱' },
  { type: 'Crypto', symbols: ['BTC/USD', 'ETH/USD'], color: 'from-orange-500/20 to-orange-600/5', icon: '₿' },
];

const FEATURES = [
  { icon: Wifi, title: 'WebSocket en tiempo real', desc: 'Precios actualizados via WebSocket con latencia mínima, igual que los brokers profesionales.', color: 'text-[#2196F3]', bg: 'bg-[#2196F3]/10' },
  { icon: BarChart3, title: 'Interfaz TradingView-like', desc: 'Gráficos OHLC, velas japonesas, indicadores técnicos SMA y herramientas profesionales.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { icon: TrendingUp, title: 'P&L y métricas reales', desc: 'Seguimiento completo de posiciones, trades, win rate, drawdown y equity curve.', color: 'text-[#26a69a]', bg: 'bg-[#26a69a]/10' },
  { icon: Shield, title: 'Sin riesgo real', desc: '$100,000 virtuales para practicar sin arriesgar un solo euro. Aprende y equivócate gratis.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

const STEPS = [
  { n: '01', title: 'Crea tu cuenta gratis', desc: 'Registro en 30 segundos. Sin tarjeta de crédito. $100,000 virtuales listos instantáneamente.' },
  { n: '02', title: 'Explora los mercados', desc: 'Accede a acciones, ETFs, forex y crypto con precios en tiempo real via WebSocket.' },
  { n: '03', title: 'Opera y aprende', desc: 'Compra y vende, analiza tu rendimiento y mejora tu estrategia con métricas reales.' },
];

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [ticker, setTicker] = useState([
    { symbol: 'AAPL', price: '178.52', change: '+1.23%', up: true },
    { symbol: 'MSFT', price: '415.20', change: '+0.87%', up: true },
    { symbol: 'NVDA', price: '875.30', change: '+3.21%', up: true },
    { symbol: 'BTCUSD', price: '62,450', change: '-0.42%', up: false },
    { symbol: 'EURUSD', price: '1.0850', change: '+0.12%', up: true },
    { symbol: 'SPY', price: '502.40', change: '+0.65%', up: true },
    { symbol: 'TSLA', price: '245.60', change: '-1.18%', up: false },
    { symbol: 'ETHUSD', price: '3,420', change: '+2.05%', up: true },
  ]);

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials-home'],
    queryFn: () => base44.entities.Testimonial.filter({ approved: true }),
  });

  const { data: awards = [] } = useQuery({
    queryKey: ['awards-home'],
    queryFn: () => base44.entities.Award.filter({ is_active: true }),
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ['faqs-home'],
    queryFn: () => base44.entities.Faq.filter({ is_active: true }),
  });

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-white">
      <PublicNav currentPage="Home" />

      {/* ── TICKER BAR ── */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-[#0f1117]/90 backdrop-blur-sm border-b border-white/5 overflow-hidden h-8 flex items-center">
        <div className="flex gap-8 animate-[ticker_30s_linear_infinite] whitespace-nowrap px-4">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs">
              <span className="font-bold text-white/80">{t.symbol}</span>
              <span className="font-mono text-white/60">{t.price}</span>
              <span className={`font-mono font-semibold ${t.up ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>{t.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-4 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(33,150,243,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(33,150,243,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2196F3]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2196F3]/10 border border-[#2196F3]/20 text-xs text-[#2196F3] font-medium mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#26a69a] animate-pulse" />
              Paper Trading con WebSocket en tiempo real
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
              Opera como un <br />
              <span className="bg-gradient-to-r from-[#2196F3] to-[#7C3AED] bg-clip-text text-transparent">
                profesional.
              </span>
              <br />
              Sin riesgo real.
            </h1>

            <p className="text-lg text-white/50 mb-8 max-w-xl leading-relaxed">
              Practica trading en acciones, ETFs, forex y crypto con $100,000 virtuales. 
              Interfaz TradingView, WebSocket en tiempo real y métricas de nivel institucional.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <button onClick={() => window.location.href = '/login'}
                className="flex items-center gap-2 px-6 py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#2196F3]/25 hover:shadow-[#2196F3]/40 hover:scale-[1.02]">
                Crear cuenta gratis
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link to={createPageUrl('Product')}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all">
                <Play className="h-4 w-4" />
                Ver demo
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { v: '$100K', l: 'Capital virtual inicial' },
                { v: '15+', l: 'Instrumentos disponibles' },
                { v: '0€', l: 'Sin coste, sin tarjeta' },
              ].map(s => (
                <div key={s.l}>
                  <div className="text-2xl font-black text-white">{s.v}</div>
                  <div className="text-xs text-white/40">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero chart mockup */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45%]">
            <div className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold text-white">AAPL</span>
                <span className="text-xs text-white/40">Apple Inc.</span>
                <span className="ml-auto text-lg font-mono font-bold text-white">$178.52</span>
                <span className="text-xs font-mono text-[#26a69a]">+1.23%</span>
              </div>
              <div className="h-40 flex items-end gap-0.5">
                {[65,72,68,75,70,80,77,85,82,90,87,88,86,92,95,91,97,94,100,96,98,102,99,104].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                    <div className={`rounded-sm ${i % 3 === 0 ? 'bg-[#ef5350]' : 'bg-[#26a69a]'}`} style={{height: `${v}%`, minHeight: 2}} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2 text-[10px] text-[#8b8fa8]">
                {['1m','5m','15m','1h','1D'].map(t => (
                  <button key={t} className={`px-2 py-0.5 rounded ${t === '1D' ? 'bg-[#2196F3]/20 text-[#2196F3]' : 'hover:text-white'}`}>{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-semibold text-[#2196F3] uppercase tracking-widest mb-3">Cómo funciona</div>
            <h2 className="text-3xl sm:text-4xl font-black">Empieza en 3 pasos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={i} className="relative group">
                <div className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 h-full hover:border-[#2196F3]/30 transition-all hover:-translate-y-1">
                  <div className="text-5xl font-black text-[#2196F3]/15 mb-4 font-mono">{s.n}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 text-white/20 text-2xl z-10">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTRUMENTS ── */}
      <section className="py-20 px-4 bg-[#070910]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-semibold text-[#26a69a] uppercase tracking-widest mb-3">Mercados disponibles</div>
            <h2 className="text-3xl sm:text-4xl font-black">Opera en todos los mercados</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {INSTRUMENTS.map((inst, i) => (
              <div key={i} className={`bg-gradient-to-br ${inst.color} border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all`}>
                <div className="text-2xl mb-3">{inst.icon}</div>
                <div className="font-bold text-white mb-2">{inst.type}</div>
                <div className="flex flex-wrap gap-1">
                  {inst.symbols.map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-white/70 font-mono">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Por qué nosotros</div>
            <h2 className="text-3xl sm:text-4xl font-black">Todo lo que necesitas para aprender</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 hover:border-white/10 transition-all group hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AWARDS ── */}
      {awards.length > 0 && (
        <section className="py-20 px-4 bg-[#070910]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-block text-xs font-semibold text-amber-400 uppercase tracking-widest mb-3">Reconocimientos</div>
              <h2 className="text-3xl sm:text-4xl font-black">Premios & Logros</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.slice(0, 6).map(a => (
                <div key={a.id} className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 flex items-start gap-4 hover:border-amber-500/20 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white">{a.title}</div>
                    <div className="text-xs text-[#8b8fa8] mt-0.5">{a.issuer} · {a.year}</div>
                    <p className="text-xs text-white/50 mt-2 leading-relaxed">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {awards.length > 6 && (
              <div className="text-center mt-6">
                <Link to={createPageUrl('Awards')} className="text-sm text-[#2196F3] hover:underline">Ver todos los premios →</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-block text-xs font-semibold text-[#26a69a] uppercase tracking-widest mb-3">Testimonios</div>
              <h2 className="text-3xl sm:text-4xl font-black">Lo que dicen nuestros usuarios</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map(t => (
                <div key={t.id} className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 hover:border-white/10 transition-all">
                  <StarRating rating={t.rating || 5} />
                  <p className="text-sm text-white/70 mt-3 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2196F3] to-[#7C3AED] flex items-center justify-center text-xs font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-white/40">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="py-20 px-4 bg-[#070910]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-semibold text-[#2196F3] uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-3xl sm:text-4xl font-black">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-3">
            {(faqs.length > 0 ? faqs.slice(0, 8) : [
              { id: 1, question: '¿Es gratis SimuTrade TV-Lite?', answer: 'Sí, completamente gratis. Sin tarjeta de crédito ni compromisos.' },
              { id: 2, question: '¿Los precios son reales?', answer: 'Usamos datos de mercado simulados con alta fidelidad para la experiencia educativa.' },
              { id: 3, question: '¿Puedo perder dinero real?', answer: 'No. Todo el trading se realiza con dinero virtual ($100,000 de inicio).' },
              { id: 4, question: '¿Qué instrumentos están disponibles?', answer: 'Acciones (AAPL, MSFT, NVDA...), ETFs (SPY, QQQ), Forex (EUR/USD) y Crypto (BTC, ETH).' },
            ]).map(f => (
              <div key={f.id} className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/2 transition-all">
                  <span className="font-medium text-white text-sm">{f.question}</span>
                  <ChevronDown className={`h-4 w-4 text-white/40 flex-shrink-0 transition-transform ${openFaq === f.id ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === f.id && (
                  <div className="px-5 pb-4 text-sm text-white/60 leading-relaxed border-t border-white/5 pt-4">{f.answer}</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to={createPageUrl('FAQ')} className="text-sm text-[#2196F3] hover:underline">Ver todas las preguntas →</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2196F3]/10 to-[#7C3AED]/10" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">¿Listo para empezar?</h2>
          <p className="text-white/50 mb-8">Únete a miles de traders que aprenden con SimuTrade TV-Lite. Gratis para siempre.</p>
          <button onClick={() => window.location.href = '/login'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold rounded-xl text-lg transition-all shadow-2xl shadow-[#2196F3]/30 hover:scale-105">
            Crear cuenta gratis
            <ArrowRight className="h-5 w-5" />
          </button>
          <p className="text-xs text-white/30 mt-4">Sin tarjeta de crédito · Sin compromisos · 100% educativo</p>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
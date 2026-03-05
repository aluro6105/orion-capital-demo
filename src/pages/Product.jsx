import React from 'react';
import PublicNav from '../components/public/PublicNav';
import PublicFooter from '../components/public/PublicFooter';
import { BarChart3, Wifi, BookOpen, LineChart, ArrowRight, CheckCircle2 } from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3, color: '#2196F3', bg: '#2196F315',
    accent: '#2196F3',
    title: 'Gráficos profesionales',
    tag: 'Análisis técnico',
    desc: 'Velas japonesas OHLC, volumen, medias móviles SMA 20 y SMA 50. Múltiples marcos temporales (1m, 5m, 15m, 1h, 1D). Alterna entre gráfico de velas y línea.',
    features: ['Velas japonesas y gráfico de línea', 'SMA 20 y SMA 50', 'Barras de volumen', '5 marcos temporales'],
  },
  {
    icon: Wifi, color: '#00C853', bg: '#00C85315',
    accent: '#00C853',
    title: 'Datos en tiempo real',
    tag: 'Tiempo real',
    desc: 'Precios actualizados al instante con reconexión automática. Actualizaciones continuas para reaccionar al mercado al instante.',
    features: ['Precios en vivo', 'Reconexión automática', 'Datos institucionales', 'Suscripción por símbolo'],
  },
  {
    icon: LineChart, color: '#7C3AED', bg: '#7C3AED15',
    accent: '#7C3AED',
    title: 'Motor de trading avanzado',
    tag: 'Ejecución',
    desc: 'Órdenes de mercado, validación de saldo, ganancias y pérdidas en tiempo real. Posiciones, diario de operaciones y métricas de rendimiento.',
    features: ['Órdenes de mercado', 'Validación de saldo', 'P&L no realizado', 'Diario de operaciones'],
  },
  {
    icon: BookOpen, color: '#f59e0b', bg: '#f59e0b15',
    accent: '#f59e0b',
    title: 'Cartera y métricas',
    tag: 'Analítica pro',
    desc: 'Curva de capital, tasa de acierto, caída máxima, ganancias realizadas y no realizadas. Exporta el historial de operaciones en CSV.',
    features: ['Curva de capital', 'Tasa de acierto', 'Caída máxima', 'Exportar CSV'],
  },
];

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <PublicNav currentPage="Product" />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden bg-white">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#f0fdf4] to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C853]/10 border border-[#00C853]/20 text-xs text-[#00a844] font-semibold mb-6 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
            Plataforma
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight text-gray-900">
            Un simulador que se siente <span className="bg-gradient-to-r from-[#00C853] to-[#2196F3] bg-clip-text text-transparent">real</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-2xl mx-auto">
            Construido con la misma tecnología que usan los brokers institucionales. Sin simplificaciones. Sin atajos.
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-3.5 bg-[#00C853]/8 border border-[#00C853]/20 rounded-2xl">
            <p className="text-sm text-[#00a844] text-left font-medium">
              Tecnología de nivel institucional. Gráficos avanzados, ejecución de órdenes y análisis de cartera en tiempo real.
            </p>
          </div>
        </div>
      </section>

      {/* Features alternating */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-16">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: f.bg }}>
                      <Icon className="h-5 w-5" style={{ color: f.color }} />
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ color: f.color, background: f.bg }}>{f.tag}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">{f.title}</h2>
                  <p className="text-gray-500 leading-relaxed mb-5">{f.desc}</p>
                  <ul className="space-y-2.5">
                    {f.features.map(feat => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: f.color }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-8 h-52 flex items-center justify-center shadow-sm">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center" style={{ background: f.bg }}>
                    <Icon className="h-12 w-12" style={{ color: f.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Instruments */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-bold text-[#2196F3] uppercase tracking-[0.2em] mb-3 block">Instrumentos disponibles</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Practica con los activos que mueven el mundo</h2>
          <p className="text-gray-500 mb-10">Los mismos instrumentos que operan los profesionales.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['AAPL','MSFT','NVDA','TSLA','AMZN','SPY','QQQ','IWM','EUR/USD','GBP/USD','USD/JPY','BTC/USD','ETH/USD','XAU/USD'].map(s => (
              <span key={s} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-600 hover:border-[#00C853]/40 hover:text-gray-900 transition-all">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA dark */}
      <section className="relative py-24 px-4 text-center overflow-hidden bg-[#0a0d14]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(0,200,83,0.08),transparent)]" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl font-black mb-4 text-white">Abre tu cuenta hoy</h2>
          <p className="text-white/40 mb-8">Cuenta demo con $10,000 activada en 30 segundos</p>
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
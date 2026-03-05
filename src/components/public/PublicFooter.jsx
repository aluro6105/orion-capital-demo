import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C853] to-[#2196F3] flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="font-black text-white text-lg">NEXUS</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Plataforma de trading simulado con tecnología institucional. Aprende sin riesgo, opera como un profesional.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
              <span className="text-xs text-[#00C853] font-semibold">Plataforma activa</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Plataforma</div>
            <ul className="space-y-2.5">
              {[
                { label: 'Inicio', page: 'Home' },
                { label: 'Plataforma', page: 'Product' },
                { label: 'Premios', page: 'Awards' },
              ].map(l => (
                <li key={l.page}>
                  <Link to={createPageUrl(l.page)} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Empresa</div>
            <ul className="space-y-2.5">
              {[
                { label: 'Nosotros', page: 'About' },
                { label: 'Testimonios', page: 'Testimonials' },
                { label: 'FAQ', page: 'FAQ' },
              ].map(l => (
                <li key={l.page}>
                  <Link to={createPageUrl(l.page)} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} NEXUS. Todos los derechos reservados.</p>
          <p className="text-xs text-gray-600">Plataforma educativa de trading simulado. No es asesoramiento financiero.</p>
        </div>
      </div>
    </footer>
  );
}
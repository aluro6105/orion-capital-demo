import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Shield, Globe } from 'lucide-react';

const LINKS = {
  'Trading': [
    { label: 'Plataforma', href: createPageUrl('Product') },
    { label: 'Mercados', href: createPageUrl('Explore') },
    { label: 'Gráficos', href: createPageUrl('Portal_Charts') },
  ],
  'Empresa': [
    { label: 'Sobre Nosotros', href: createPageUrl('About') },
    { label: 'Premios', href: createPageUrl('Awards') },
    { label: 'Testimonios', href: createPageUrl('Testimonials') },
  ],
  'Soporte': [
    { label: 'Preguntas Frecuentes', href: createPageUrl('FAQ') },
    { label: 'Portal del Trader', href: createPageUrl('Dashboard') },
    { label: 'Registrarse', href: createPageUrl('Register') },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="bg-[#060820] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-1 mb-4">
            <span className="text-2xl font-black text-[#1a1aff]">NEXUS</span>
            <span className="text-2xl font-black text-[#80cc00]">Trade</span>
          </div>
          <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-6">
            Plataforma de trading educacional con datos en tiempo real. Opera, aprende y perfecciona tu estrategia sin riesgo financiero real.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Shield className="h-3.5 w-3.5 text-[#80cc00]" />
            Plataforma educacional · Sin inversión real
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40 mt-2">
            <Globe className="h-3.5 w-3.5 text-[#1a1aff]" />
            Disponible globalmente
          </div>
        </div>

        {/* Links */}
        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section}>
            <div className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">{section}</div>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-sm text-white/55 hover:text-[#80cc00] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06] px-4 sm:px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
        <span>© 2025 NexusTrade. Todos los derechos reservados.</span>
        <span className="text-center">
          El trading conlleva un riesgo significativo de pérdida. Esta es una plataforma educacional simulada.
        </span>
        <div className="flex gap-4">
          <span className="hover:text-white/60 cursor-pointer transition-colors">Privacidad</span>
          <span className="hover:text-white/60 cursor-pointer transition-colors">Términos</span>
          <span className="hover:text-white/60 cursor-pointer transition-colors">Cookies</span>
        </div>
      </div>
    </footer>
  );
}
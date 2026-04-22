import React from 'react';
import { createPageUrl } from '@/utils';

const FOOTER_LINKS = {
  'Trading': [
    { label: 'Criptomonedas', href: createPageUrl('Product') },
    { label: 'Forex CFD', href: createPageUrl('Product') },
    { label: 'Materias Primas', href: createPageUrl('Product') },
    { label: 'Índices', href: createPageUrl('Product') },
    { label: 'Acciones', href: createPageUrl('Product') },
  ],
  'Plataforma': [
    { label: 'Gráficos Pro', href: createPageUrl('Product') },
    { label: 'Spreads y Comisiones', href: createPageUrl('Product') },
    { label: 'Cuenta Demo', href: createPageUrl('Register') },
    { label: 'Cuenta Real', href: createPageUrl('Register') },
  ],
  'Empresa': [
    { label: 'Sobre Nosotros', href: createPageUrl('About') },
    { label: 'Premios', href: createPageUrl('Awards') },
    { label: 'Testimonios', href: createPageUrl('Testimonials') },
    { label: 'FAQ', href: createPageUrl('FAQ') },
  ],
  'Cuenta': [
    { label: 'Iniciar Sesión', href: createPageUrl('Acceso') },
    { label: 'Crear Cuenta', href: createPageUrl('Register') },
    { label: 'Portal', href: createPageUrl('Dashboard') },
  ],
};

export default function PublicFooter() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href={createPageUrl('Home')} className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-[#1E40AF] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-xs">OC</span>
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                Orion <span className="text-[#60A5FA]">Capital</span>
              </span>
            </a>
            <p className="text-xs text-white/40 leading-relaxed mb-4">
              Plataforma de inversión de nivel institucional con datos de mercado en tiempo real. Opera con confianza desde cualquier parte del mundo.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['FSA', 'CySEC', 'DFSA', 'SEC'].map(lic => (
                <span key={lic} className="text-[10px] font-bold px-2 py-1 bg-[#1E40AF]/20 border border-[#1E40AF]/30 text-[#93C5FD] rounded">
                  {lic}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-black text-white uppercase tracking-[0.15em] mb-5">{section}</h4>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-white/40 hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Orion Capital. Todos los derechos reservados.
          </p>
          <p className="text-xs text-white/20 text-center max-w-lg">
            Operar con CFDs implica un riesgo significativo de pérdida de capital. Esta plataforma es de uso educativo. Los resultados en cuentas demo no garantizan rendimientos reales.
          </p>
        </div>
      </div>
    </footer>
  );
}
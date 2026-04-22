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
    <footer className="bg-[#0B0F1A] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href={createPageUrl('Home')} className="inline-flex items-center mb-5">
              <span className="text-xl font-black tracking-tight">
                <span className="text-white">ORION</span>
                <span className="text-[#C9A84C]"> Capital</span>
              </span>
            </a>
            <p className="text-xs text-white/35 leading-relaxed mb-4">
              Plataforma de trading de nivel institucional con datos de mercado en tiempo real. Opera con confianza.
            </p>
            <div className="flex gap-2 flex-wrap">
              {['FSA', 'CySEC', 'DFSA'].map(lic => (
                <span key={lic} className="text-[10px] font-bold px-2 py-1 bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#E8C97A] rounded-lg">
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
          <p className="text-xs text-white/25">
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
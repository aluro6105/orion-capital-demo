import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Trading', href: createPageUrl('Product') + '?tab=trading' },
  { label: 'Mercados', href: createPageUrl('Product') + '?tab=mercados' },
  { label: 'Plataforma', href: createPageUrl('Product') + '?tab=plataforma' },
  { label: 'Sobre Nosotros', href: createPageUrl('About') },
  { label: 'Premios', href: createPageUrl('Awards') },
];

export default function PublicNav({ currentPage }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-[#1E3A8A] py-1.5 px-4 text-center">
        <p className="text-xs text-white/80 font-medium tracking-wide">
          <span className="font-bold text-white">LICENCIAS GRUPALES:</span>&nbsp;&nbsp;
          <span className="text-white/90">FSA</span>&nbsp;&nbsp;·&nbsp;&nbsp;
          <span className="text-white/90">CySEC</span>&nbsp;&nbsp;·&nbsp;&nbsp;
          <span className="text-white/90">DFSA</span>&nbsp;&nbsp;·&nbsp;&nbsp;
          <span className="text-white/90">SEC · FINRA</span>
        </p>
      </div>

      {/* Main nav */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <a href={createPageUrl('Home')} className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#1E40AF] flex items-center justify-center">
              <span className="text-white font-black text-xs tracking-tight">OC</span>
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">
              Orion <span className="text-[#1E40AF]">Capital</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-gray-600 hover:text-[#1E40AF] font-medium transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={createPageUrl('Acceso')}
              className="text-sm text-gray-600 hover:text-[#1E40AF] font-semibold transition-colors px-4 py-2 rounded-lg border border-gray-200 hover:border-[#1E40AF]/30 hover:bg-blue-50"
            >
              Iniciar sesión
            </a>
            <a
              href={createPageUrl('Register')}
              className="text-sm font-bold px-5 py-2.5 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white rounded-lg transition-all shadow-sm"
            >
              Abrir Cuenta
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-600 hover:text-[#1E40AF]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="block text-sm text-gray-600 hover:text-[#1E40AF] font-medium py-2 transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <a href={createPageUrl('Acceso')} className="text-sm text-center font-semibold px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:text-[#1E40AF] hover:border-[#1E40AF]/30 transition-all">
                Iniciar sesión
              </a>
              <a href={createPageUrl('Register')} className="text-sm text-center font-bold px-4 py-2.5 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white rounded-lg transition-all">
                Abrir Cuenta
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
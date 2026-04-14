import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Trading', href: createPageUrl('Product') },
  { label: 'Mercados', href: createPageUrl('Product') },
  { label: 'Plataforma', href: createPageUrl('Product') },
  { label: 'Sobre Nosotros', href: createPageUrl('About') },
  { label: 'Premios', href: createPageUrl('Awards') },
];

export default function PublicNav({ currentPage }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-[#1a1aff] py-1.5 px-4 text-center">
        <p className="text-xs text-white/80 font-medium tracking-wide">
          <span className="font-bold text-white">LICENCIAS GRUPALES:</span>&nbsp;&nbsp;
          <span className="text-white/90">FSA</span>&nbsp;&nbsp;·&nbsp;&nbsp;
          <span className="text-white/90">CySEC</span>&nbsp;&nbsp;·&nbsp;&nbsp;
          <span className="text-white/90">DFSA</span>
        </p>
      </div>

      {/* Main nav */}
      <nav className="bg-[#04052e]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <a href={createPageUrl('Home')} className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl font-black tracking-tight">
              <span className="text-white">M4</span>
              <span className="text-[#80cc00]"> Markets Latam</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-white/65 hover:text-white font-medium transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={createPageUrl('Acceso')}
              className="text-sm text-white/70 hover:text-white font-semibold transition-colors px-4 py-2 rounded-full border border-white/15 hover:border-white/30"
            >
              Iniciar sesión
            </a>
            <a
              href={createPageUrl('Register')}
              className="text-sm font-black px-5 py-2.5 bg-[#80cc00] hover:bg-[#72b800] text-[#0d0d0d] rounded-full transition-all shadow-lg shadow-[#80cc00]/20"
            >
              Abrir Cuenta
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden bg-[#04052e] border-t border-white/[0.06] px-4 py-4 space-y-3">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="block text-sm text-white/65 hover:text-white font-medium py-2 transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <a href={createPageUrl('Acceso')} className="text-sm text-center font-semibold px-4 py-2.5 border border-white/20 text-white/70 rounded-full hover:text-white hover:border-white/40 transition-all">
                Iniciar sesión
              </a>
              <a href={createPageUrl('Register')} className="text-sm text-center font-black px-4 py-2.5 bg-[#80cc00] hover:bg-[#72b800] text-[#0d0d0d] rounded-full transition-all">
                Abrir Cuenta
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
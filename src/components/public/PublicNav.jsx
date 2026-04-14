import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Trading', href: createPageUrl('Product') },
  { label: 'Mercados', href: createPageUrl('Explore') },
  { label: 'Plataforma', href: createPageUrl('Product') },
  { label: 'Sobre Nosotros', href: createPageUrl('About') },
  { label: 'Premios', href: createPageUrl('Awards') },
];

export default function PublicNav({ currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Top license bar */}
      <div className="bg-[#1a1aff] text-white text-[11px] font-medium py-1.5 px-4 text-center tracking-wide">
        LICENCIAS GRUPALES: &nbsp;
        <span className="opacity-70 mx-2">FSA</span>
        <span className="opacity-70 mx-2">CySEC</span>
        <span className="opacity-70 mx-2">DFSA</span>
      </div>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight text-[#1a1aff]">NEXUS</span>
              <span className="text-2xl font-black tracking-tight text-[#80cc00]">Trade</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                  currentPage === l.label
                    ? 'text-[#1a1aff] bg-[#1a1aff]/8'
                    : 'text-gray-700 hover:text-[#1a1aff] hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to={createPageUrl('Acceso')}
              className="px-5 py-2 text-sm font-bold text-gray-800 border border-gray-200 rounded-full hover:border-[#1a1aff] hover:text-[#1a1aff] transition-all"
            >
              Iniciar sesión
            </Link>
            <Link
              to={createPageUrl('Register')}
              className="px-5 py-2 text-sm font-bold text-[#0d0d0d] bg-[#80cc00] hover:bg-[#72b800] rounded-full transition-all shadow-sm hover:shadow-md"
            >
              Abrir Cuenta
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:text-[#1a1aff] hover:bg-gray-50 rounded-xl transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link
                to={createPageUrl('Acceso')}
                className="w-full text-center px-5 py-3 text-sm font-bold text-gray-800 border border-gray-200 rounded-full hover:border-[#1a1aff] transition-all"
              >
                Iniciar sesión
              </Link>
              <Link
                to={createPageUrl('Register')}
                className="w-full text-center px-5 py-3 text-sm font-bold text-[#0d0d0d] bg-[#80cc00] rounded-full transition-all"
              >
                Abrir Cuenta
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
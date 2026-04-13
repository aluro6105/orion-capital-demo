import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, TrendingUp } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', page: 'Home' },
  { label: 'Plataforma', page: 'Product' },
  { label: 'Sobre nosotros', page: 'About' },
  { label: 'Premios', page: 'Awards' },
  { label: 'Testimonios', page: 'Testimonials' },
  { label: 'FAQ', page: 'FAQ' },
];

export default function PublicNav({ currentPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#00C853] flex items-center justify-center">
              <span className="text-white font-black text-sm tracking-tight">N</span>
            </div>
            <span className="font-black text-xl text-gray-900 tracking-tight">NEXUS</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.page}
                to={createPageUrl(l.page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === l.page
                    ? 'bg-[#00C853]/10 text-[#00a844]'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={createPageUrl('Acceso')}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
            >
              Iniciar sesión
            </a>
            <a
              href={createPageUrl('Acceso')}
              className="px-5 py-2 bg-[#00C853] hover:bg-[#00b34a] text-white font-bold rounded-full text-sm transition-all shadow-sm"
            >
              Abrir cuenta
            </a>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(o => !o)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.page}
              to={createPageUrl(l.page)}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === l.page
                  ? 'bg-[#00C853]/10 text-[#00a844]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <a href={createPageUrl('Acceso')} className="block px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg">
              Iniciar sesión
            </a>
            <a href={createPageUrl('Acceso')} className="block px-4 py-2.5 bg-[#00C853] text-white font-bold rounded-lg text-sm text-center">
              Abrir cuenta
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
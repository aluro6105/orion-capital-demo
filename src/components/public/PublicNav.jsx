import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', page: 'Home' },
  { label: 'Plataforma', page: 'Product' },
  { label: 'Sobre nosotros', page: 'About' },
  { label: 'FAQ', page: 'FAQ' },
];

const goToLogin = () => {
  base44.auth.redirectToLogin(window.location.origin + createPageUrl('Dashboard'));
};

export default function PublicNav({ currentPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-md bg-[#00C853] flex items-center justify-center">
              <span className="text-white font-black text-xs tracking-tight">N</span>
            </div>
            <span className="font-black text-lg text-gray-900 tracking-tight">NEXUS</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, page }) => (
              <Link
                key={page}
                to={createPageUrl(page)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'text-[#00C853] bg-[#00C853]/8'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={goToLogin}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
            >
              Iniciar sesión
            </button>
            <Link
              to={createPageUrl('Register')}
              className="px-5 py-2 bg-[#00C853] hover:bg-[#00b34a] text-white font-semibold rounded-full text-sm transition-all shadow-sm shadow-[#00C853]/20"
            >
              Abrir cuenta
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ label, page }) => (
            <Link
              key={page}
              to={createPageUrl(page)}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'text-[#00C853] bg-[#00C853]/8'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <button
              onClick={() => { setMenuOpen(false); goToLogin(); }}
              className="w-full px-4 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-50 transition-all"
            >
              Iniciar sesión
            </button>
            <Link
              to={createPageUrl('Register')}
              onClick={() => setMenuOpen(false)}
              className="block w-full px-4 py-2.5 bg-[#00C853] hover:bg-[#00b34a] text-white font-semibold rounded-lg text-sm text-center transition-all"
            >
              Abrir cuenta
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
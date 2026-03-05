import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', page: 'Home' },
  { label: 'Plataforma', page: 'Product' },
  { label: 'Premios', page: 'Awards' },
  { label: 'Testimonios', page: 'Testimonials' },
  { label: 'FAQ', page: 'FAQ' },
  { label: 'Nosotros', page: 'About' },
];

export default function PublicNav({ currentPage }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C853] to-[#2196F3] flex items-center justify-center">
              <span className="text-white font-black text-sm">N</span>
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tight">NEXUS</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link
                key={l.page}
                to={createPageUrl(l.page)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentPage === l.page
                    ? 'bg-[#00C853]/10 text-[#00a844] font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="px-5 py-2 bg-[#00C853] hover:bg-[#00b34a] text-white font-semibold rounded-full text-sm transition-all shadow-md shadow-[#00C853]/20 hover:scale-[1.02]"
            >
              Abrir cuenta
            </button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.page}
              to={createPageUrl(l.page)}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentPage === l.page
                  ? 'bg-[#00C853]/10 text-[#00a844] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full mt-2 px-5 py-2.5 bg-[#00C853] hover:bg-[#00b34a] text-white font-semibold rounded-xl text-sm transition-all"
          >
            Abrir cuenta
          </button>
        </div>
      )}
    </nav>
  );
}
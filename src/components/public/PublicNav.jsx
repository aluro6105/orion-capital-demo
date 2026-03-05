import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BarChart3, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', page: 'Home' },
  { label: 'Producto', page: 'Product' },
  { label: 'Premios', page: 'Awards' },
  { label: 'Testimonios', page: 'Testimonials' },
  { label: 'FAQ', page: 'FAQ' },
  { label: 'Nosotros', page: 'About' },
];

export default function PublicNav({ currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLight = currentPage === 'Home';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = isLight
    ? 'bg-white border-b border-gray-100 shadow-sm'
    : scrolled
      ? 'bg-[#060810]/95 backdrop-blur-xl border-b border-white/5 shadow-xl'
      : 'bg-transparent';

  const textColor = isLight ? 'text-gray-700' : 'text-white/60';
  const activeText = isLight ? 'text-gray-900 bg-gray-100' : 'text-white bg-white/10';
  const hoverText = isLight ? 'hover:text-gray-900 hover:bg-gray-50' : 'hover:text-white hover:bg-white/5';
  const logoText = isLight ? 'text-gray-900' : 'text-white';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 sm:px-6 lg:px-8 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        {/* Logo */}
        <Link to={createPageUrl('Home')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#00C853] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className={`font-black text-lg tracking-widest ${logoText}`}>NEXUS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.page}
              to={createPageUrl(l.page)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === l.page ? activeText : `${textColor} ${hoverText}`
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
            className={`px-5 py-2 text-sm font-semibold transition-colors ${isLight ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white'}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-5 py-2 bg-[#00C853] hover:bg-[#00b34a] text-white text-sm font-bold rounded-full transition-all shadow-lg hover:scale-105"
          >
            Abrir cuenta
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 ${isLight ? 'text-gray-700' : 'text-white/70 hover:text-white'}`}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`absolute top-16 left-0 right-0 ${isLight ? 'bg-white border-b border-gray-100' : 'bg-[#060810]/98 backdrop-blur-xl border-b border-white/10'} px-4 py-4 flex flex-col gap-1 md:hidden`}>
          {NAV_LINKS.map(l => (
            <Link
              key={l.page}
              to={createPageUrl(l.page)}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentPage === l.page ? activeText : `${textColor} ${hoverText}`
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => window.location.href = '/login'}
              className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 transition-all"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="flex-1 py-2.5 bg-[#00C853] text-white text-sm font-bold rounded-full hover:bg-[#00b34a] transition-all"
            >
              Abrir cuenta
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
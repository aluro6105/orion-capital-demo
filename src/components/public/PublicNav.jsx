import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BarChart3, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { label: 'Inicio', page: 'Home' },
  { label: 'Quiénes Somos', page: 'About' },
  { label: 'Producto', page: 'Product' },
  { label: 'Premios', page: 'Awards' },
  { label: 'Testimonios', page: 'Testimonials' },
  { label: 'FAQ', page: 'FAQ' },
];

export default function PublicNav({ currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0d14]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2196F3] to-[#7C3AED] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">
              SimuTrade <span className="text-[#2196F3]">TV-Lite</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link key={l.page} to={createPageUrl(l.page)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  currentPage === l.page ? 'text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={() => window.location.href = '/login'}
              className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">
              Iniciar sesión
            </button>
            <Button onClick={() => window.location.href = '/login'}
              className="bg-[#2196F3] hover:bg-[#1976D2] text-white text-sm h-9 px-4 shadow-lg shadow-[#2196F3]/20">
              Crear cuenta gratis
            </Button>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white/70 hover:text-white">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0a0d14]/98 backdrop-blur-md border-t border-white/5 px-4 py-4 space-y-1">
          {NAV_LINKS.map(l => (
            <Link key={l.page} to={createPageUrl(l.page)} onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <button onClick={() => window.location.href = '/login'}
              className="w-full px-4 py-2.5 text-sm text-center text-white/70 hover:text-white border border-white/10 rounded-lg">
              Iniciar sesión
            </button>
            <Button onClick={() => window.location.href = '/login'}
              className="w-full bg-[#2196F3] hover:bg-[#1976D2] text-white text-sm">
              Crear cuenta gratis
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
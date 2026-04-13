import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PublicFooter() {
  return (
    <footer className="bg-[#0a0d14] border-t border-white/5 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-md bg-[#00C853] flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="font-black text-xl text-white tracking-tight">NEXUS</span>
            </div>
            <p className="text-white/30 text-sm max-w-xs leading-relaxed">
              Plataforma de trading simulado con fines educativos. Los resultados en cuentas demo no garantizan rendimientos reales.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            <div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Plataforma</div>
              <div className="space-y-2">
                {[
                  { label: 'Inicio', page: 'Home' },
                  { label: 'Producto', page: 'Product' },
                  { label: 'Sobre nosotros', page: 'About' },
                ].map(l => (
                  <Link key={l.page} to={createPageUrl(l.page)} className="block text-sm text-white/40 hover:text-white transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Soporte</div>
              <div className="space-y-2">
                {[
                  { label: 'FAQ', page: 'FAQ' },
                  { label: 'Testimonios', page: 'Testimonials' },
                  { label: 'Premios', page: 'Awards' },
                ].map(l => (
                  <Link key={l.page} to={createPageUrl(l.page)} className="block text-sm text-white/40 hover:text-white transition-colors">{l.label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Cuenta</div>
              <div className="space-y-2">
                <a href={createPageUrl('Acceso')} className="block text-sm text-white/40 hover:text-white transition-colors">Iniciar sesión</a>
                <a href={createPageUrl('Acceso')} className="block text-sm text-white/40 hover:text-white transition-colors">Crear cuenta</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-white/20">© {new Date().getFullYear()} NEXUS Trading. Todos los derechos reservados.</span>
          <span className="text-xs text-white/20">Plataforma educativa · No constituye asesoramiento financiero</span>
        </div>
      </div>
    </footer>
  );
}
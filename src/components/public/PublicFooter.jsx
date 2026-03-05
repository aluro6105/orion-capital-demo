import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BarChart3, Twitter, Linkedin, Github } from 'lucide-react';

const SOCIAL_ICONS = [Twitter, Linkedin, Github];

export default function PublicFooter() {
  return (
    <footer className="bg-[#0a0d14] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#00C853] flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="font-black text-white text-sm tracking-widest">NEXUS</span>
            </div>
            <p className="text-xs text-white/30 leading-relaxed">
              La plataforma de trading más avanzada. Tecnología institucional al alcance de todos.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {SOCIAL_ICONS.map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                  <Icon className="h-3.5 w-3.5 text-white/40" />
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Plataforma</h4>
            <div className="space-y-2">
              {[
                { label: 'Inicio', page: 'Home' },
                { label: 'Producto', page: 'Product' },
                { label: 'Quiénes Somos', page: 'About' },
                { label: 'Premios', page: 'Awards' },
              ].map(l => (
                <Link key={l.page} to={createPageUrl(l.page)}
                  className="block text-sm text-white/35 hover:text-white/80 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Recursos</h4>
            <div className="space-y-2">
              {[
                { label: 'FAQ', page: 'FAQ' },
                { label: 'Testimonios', page: 'Testimonials' },
                { label: 'Soporte', page: 'Portal_Support' },
              ].map(l => (
                <Link key={l.page} to={createPageUrl(l.page)}
                  className="block text-sm text-white/35 hover:text-white/80 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Legal</h4>
            <div className="space-y-2">
              {['Términos de servicio', 'Política de privacidad', 'Cookies'].map(l => (
                <button key={l} className="block text-sm text-white/35 hover:text-white/80 transition-colors">{l}</button>
              ))}
            </div>
            <p className="text-xs text-white/20 mt-4 leading-relaxed">
              La inversión conlleva riesgos. Su capital está en riesgo.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20">© 2026 NEXUS Trading. Todos los derechos reservados.</p>
          <p className="text-xs text-white/20">NEXUS · Trading · Markets · Technology</p>
        </div>
      </div>
    </footer>
  );
}
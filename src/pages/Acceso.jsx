import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, BarChart3, CheckCircle2 } from 'lucide-react';
import { safeSet } from '@/lib/safeStorage';

const FIELD_CLASS = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/10 transition-all bg-white";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AccesoPage() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', full_name: '', confirm_password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Completa todos los campos.'); return; }
    setLoading(true);
    const hashed = await hashPassword(form.password);
    const users = await base44.entities.AppUser.filter({ email: form.email.toLowerCase().trim() });
    const user = users.find(u => u.password_hash === hashed && u.is_active !== false);
    if (!user) { setError('Correo o contraseña incorrectos.'); setLoading(false); return; }
    safeSet('nexus_user', JSON.stringify({ id: user.id, email: user.email, full_name: user.full_name, role: user.role }));
    window.location.href = createPageUrl('Dashboard');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.full_name || !form.email || !form.password) { setError('Completa todos los campos obligatorios.'); return; }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (form.password !== form.confirm_password) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    const existing = await base44.entities.AppUser.filter({ email: form.email.toLowerCase().trim() });
    if (existing.length > 0) { setError('Ya existe una cuenta con ese correo.'); setLoading(false); return; }
    const hashed = await hashPassword(form.password);
    const user = await base44.entities.AppUser.create({
      full_name: form.full_name.trim(),
      email: form.email.toLowerCase().trim(),
      password_hash: hashed,
      role: 'user',
      is_active: true,
    });
    safeSet('nexus_user', JSON.stringify({ id: user.id, email: user.email, full_name: user.full_name, role: user.role }));
    window.location.href = createPageUrl('Dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1E40AF] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,rgba(255,255,255,0.06),transparent)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-sm">OC</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tight">Orion Capital</span>
        </div>

        {/* Center */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-8">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Tecnología institucional<br />al alcance de todos.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-xs">
            Opera en más de 6,000 instrumentos globales con las mismas herramientas que usan los inversores profesionales.
          </p>
          <div className="space-y-4">
            {[
              { title: '$10,000 en cuenta demo', desc: 'Activa al instante, sin depósito' },
              { title: '6,000+ instrumentos', desc: 'Acciones, ETFs, Forex, Cripto' },
              { title: 'Métricas avanzadas', desc: 'P&L, curva de capital y rendimiento' },
              { title: 'Sin costes ocultos', desc: 'Spreads competitivos y transparentes' },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-white/50 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            {['SEC', 'FINRA', 'CNBV', 'CMF'].map(r => (
              <span key={r} className="text-[10px] font-bold px-2 py-1 bg-white/10 text-white/70 rounded">{r}</span>
            ))}
          </div>
          <p className="text-xs text-white/30 leading-relaxed">
            Orion Capital es una plataforma de inversión con fines educativos. Los resultados en cuentas demo no garantizan rendimientos reales.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16">
        {/* Mobile logo */}
        <div className="lg:hidden mb-10">
          <a href={createPageUrl('Home')} className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#1E40AF] flex items-center justify-center">
              <span className="text-white font-black text-xs">OC</span>
            </div>
            <span className="text-xl font-black text-gray-900">Orion Capital</span>
          </a>
        </div>

        <div className="max-w-sm w-full mx-auto lg:mx-0">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              {tab === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
            </h1>
            <p className="text-gray-500 text-sm">
              {tab === 'login' ? 'Inicia sesión en tu cuenta de Orion Capital' : 'Acceso inmediato con $10,000 en cuenta demo'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Iniciar sesión
            </button>
            <button onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              Registrarse
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Correo electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="email" required value={form.email} onChange={e => handleChange('email', e.target.value)}
                    placeholder="correo@ejemplo.com" className={`${FIELD_CLASS} pl-10`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => handleChange('password', e.target.value)}
                    placeholder="Tu contraseña" className={`${FIELD_CLASS} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#1E40AF] hover:bg-[#1E3A8A] disabled:opacity-60 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 mt-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Iniciar sesión <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nombre completo *</label>
                <input type="text" required value={form.full_name} onChange={e => handleChange('full_name', e.target.value)}
                  placeholder="Tu nombre completo" className={FIELD_CLASS} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Correo electrónico *</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="email" required value={form.email} onChange={e => handleChange('email', e.target.value)}
                    placeholder="correo@ejemplo.com" className={`${FIELD_CLASS} pl-10`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => handleChange('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres" className={`${FIELD_CLASS} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && form.password.length < 8 && <p className="text-xs text-red-400 mt-1">Mínimo 8 caracteres</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirmar contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="password" required value={form.confirm_password} onChange={e => handleChange('confirm_password', e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`${FIELD_CLASS} pl-10 ${form.confirm_password && form.confirm_password !== form.password ? 'border-red-300' : ''}`} />
                </div>
                {form.confirm_password && form.confirm_password !== form.password && <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#1E40AF] hover:bg-[#1E3A8A] disabled:opacity-60 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 mt-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Crear cuenta <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <a href={createPageUrl('Home')} className="hover:text-gray-600 transition-colors">← Volver al inicio</a>
            <a href={createPageUrl('Register')} className="text-[#1E40AF] font-semibold hover:underline">Registro completo →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
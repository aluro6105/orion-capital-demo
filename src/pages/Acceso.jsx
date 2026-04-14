import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const FIELD_CLASS = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/10 transition-all bg-white";

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
    localStorage.setItem('nexus_user', JSON.stringify({ id: user.id, email: user.email, full_name: user.full_name, role: user.role }));
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
    localStorage.setItem('nexus_user', JSON.stringify({ id: user.id, email: user.email, full_name: user.full_name, role: user.role }));
    window.location.href = createPageUrl('Dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#00C853]/15 border border-[#00C853]/30 flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-[#00C853]" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Bienvenido a M4 Markets Latam</h1>
          <p className="text-white/40 text-sm">{tab === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratuita'}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
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
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input type="email" required value={form.email} onChange={e => handleChange('email', e.target.value)}
                    placeholder="correo@ejemplo.com" className={`${FIELD_CLASS} pl-10`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => handleChange('password', e.target.value)}
                    placeholder="Tu contraseña" className={`${FIELD_CLASS} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#00C853] hover:bg-[#00b34a] disabled:opacity-60 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 mt-2">
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
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input type="email" required value={form.email} onChange={e => handleChange('email', e.target.value)}
                    placeholder="correo@ejemplo.com" className={`${FIELD_CLASS} pl-10`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={e => handleChange('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres" className={`${FIELD_CLASS} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && form.password.length < 8 && <p className="text-xs text-red-400 mt-1">Mínimo 8 caracteres</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirmar contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input type="password" required value={form.confirm_password} onChange={e => handleChange('confirm_password', e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`${FIELD_CLASS} pl-10 ${form.confirm_password && form.confirm_password !== form.password ? 'border-red-300' : ''}`} />
                </div>
                {form.confirm_password && form.confirm_password !== form.password && <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#00C853] hover:bg-[#00b34a] disabled:opacity-60 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 mt-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Crear cuenta <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <a href={createPageUrl('Home')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← Volver al inicio</a>
          </div>
        </div>
      </div>
    </div>
  );
}
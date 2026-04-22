import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle2, User, Mail, Phone, ChevronDown, Lock, Eye, EyeOff, Shield } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', abbr: 'US', name: 'Estados Unidos' },
  { code: '+52', abbr: 'MX', name: 'México' },
  { code: '+34', abbr: 'ES', name: 'España' },
  { code: '+54', abbr: 'AR', name: 'Argentina' },
  { code: '+57', abbr: 'CO', name: 'Colombia' },
  { code: '+56', abbr: 'CL', name: 'Chile' },
  { code: '+51', abbr: 'PE', name: 'Perú' },
  { code: '+58', abbr: 'VE', name: 'Venezuela' },
  { code: '+593', abbr: 'EC', name: 'Ecuador' },
  { code: '+502', abbr: 'GT', name: 'Guatemala' },
  { code: '+504', abbr: 'HN', name: 'Honduras' },
  { code: '+503', abbr: 'SV', name: 'El Salvador' },
  { code: '+506', abbr: 'CR', name: 'Costa Rica' },
  { code: '+507', abbr: 'PA', name: 'Panamá' },
  { code: '+595', abbr: 'PY', name: 'Paraguay' },
  { code: '+598', abbr: 'UY', name: 'Uruguay' },
  { code: '+591', abbr: 'BO', name: 'Bolivia' },
  { code: '+44', abbr: 'GB', name: 'Reino Unido' },
  { code: '+55', abbr: 'BR', name: 'Brasil' },
  { code: '+49', abbr: 'DE', name: 'Alemania' },
  { code: '+33', abbr: 'FR', name: 'Francia' },
];

const FIELD_CLASS = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/10 transition-all bg-white";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', country_code: '+52',
    account_type: 'Demo', password: '', confirm_password: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) { setError('Por favor completa los campos obligatorios.'); return; }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (form.password !== form.confirm_password) { setError('Las contraseñas no coinciden.'); return; }
    setLoading(true);
    setError('');
    const existing = await base44.entities.AppUser.filter({ email: form.email.toLowerCase().trim() });
    if (existing.length > 0) { setError('Ya existe una cuenta con ese correo. Inicia sesión.'); setLoading(false); return; }
    const hashed = await hashPassword(form.password);
    await base44.entities.AppUser.create({
      full_name: form.full_name.trim(),
      email: form.email.toLowerCase().trim(),
      password_hash: hashed,
      role: 'user',
      is_active: true,
    });
    await base44.entities.CrmLead.create({
      full_name: form.full_name,
      email: form.email,
      phone: form.country_code + ' ' + form.phone,
      account_type: form.account_type,
      stage: 'nuevo',
      source: 'registro_web',
    });
    await base44.integrations.Core.SendEmail({
      to: form.email.toLowerCase().trim(),
      from_name: 'Orion Capital',
      subject: '¡Bienvenido a Orion Capital! Tus datos de acceso',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111827; padding: 40px; border-radius: 12px; border: 1px solid #E5E7EB;">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display:inline-flex; align-items:center; gap:10px; margin-bottom:8px;">
              <div style="width:36px;height:36px;background:#1E40AF;border-radius:8px;display:flex;align-items:center;justify-content:center;">
                <span style="color:white;font-weight:900;font-size:12px;">OC</span>
              </div>
              <span style="font-size:22px;font-weight:900;color:#111827;">Orion <span style="color:#1E40AF;">Capital</span></span>
            </div>
            <p style="color:#6B7280;margin:0;">Bienvenido a la plataforma</p>
          </div>
          <p style="color:#374151;">Hola <strong>${form.full_name}</strong>,</p>
          <p style="color:#6B7280;line-height:1.6;">Tu cuenta en <strong style="color:#1E40AF;">Orion Capital</strong> ha sido creada exitosamente. A continuación encontrarás tus datos de acceso:</p>
          <div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin:24px 0;">
            <p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Datos de acceso</p>
            <p style="margin:8px 0;color:#111827;"><strong>Correo:</strong> ${form.email.toLowerCase().trim()}</p>
            <p style="margin:8px 0;color:#111827;"><strong>Contraseña:</strong> ${form.password}</p>
            <p style="margin:8px 0;color:#111827;"><strong>Tipo de cuenta:</strong> ${form.account_type === 'Demo' ? 'Cuenta Demo ($10,000 virtuales)' : 'Cuenta Real'}</p>
          </div>
          <div style="text-align:center;margin:32px 0;">
            <a href="https://orioncapitalglobal.base44.app/Acceso" style="background:#1E40AF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:15px;">Acceder a mi cuenta</a>
          </div>
          <p style="color:#9CA3AF;font-size:12px;text-align:center;margin-top:32px;">
            Por seguridad, te recomendamos cambiar tu contraseña después del primer acceso.<br/>
            Operar con CFDs implica un riesgo significativo de pérdida de capital.
          </p>
        </div>
      `,
    });
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-2xl p-10 shadow-lg border border-gray-100">
          <div className="w-16 h-16 rounded-full bg-[#1E40AF]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-[#1E40AF]" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Solicitud recibida</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Nuestro equipo activará tu cuenta en breve. Recibirás un correo con los detalles de acceso.
          </p>
          <button onClick={() => window.location.href = createPageUrl('Acceso')}
            className="w-full py-3.5 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-2 mb-3">
            Ir al inicio de sesión <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => window.location.href = createPageUrl('Home')}
            className="w-full py-3 border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium rounded-lg transition-all text-sm">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">

        {/* ── Left: form ── */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16 bg-white">
          {/* Logo */}
          <div className="mb-10 flex items-center justify-between">
            <a href={createPageUrl('Home')} className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#1E40AF] flex items-center justify-center">
                <span className="text-white font-black text-xs">OC</span>
              </div>
              <span className="font-black text-xl text-gray-900 tracking-tight">Orion <span className="text-[#1E40AF]">Capital</span></span>
            </a>
            <a href={createPageUrl('Home')} className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowRight className="h-4 w-4 rotate-180" /> Inicio
            </a>
          </div>

          <div className="max-w-sm w-full">
            <p className="text-xs font-bold text-[#1E40AF] uppercase tracking-widest mb-3">Apertura de cuenta</p>
            <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight">Crea tu cuenta gratuita</h1>
            <p className="text-gray-400 text-sm mb-8">Acceso inmediato a la plataforma con $10,000 en cuenta demo.</p>

            {error && <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Nombre completo <span className="text-red-400">*</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input type="text" required value={form.full_name} onChange={e => handleChange('full_name', e.target.value)}
                    placeholder="Nombre y apellidos" className={`${FIELD_CLASS} pl-10`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Correo electrónico <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input type="email" required value={form.email} onChange={e => handleChange('email', e.target.value)}
                    placeholder="correo@ejemplo.com" className={`${FIELD_CLASS} pl-10`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Contraseña <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => handleChange('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres" className={`${FIELD_CLASS} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && form.password.length < 8 && <p className="text-xs text-red-400 mt-1">Mínimo 8 caracteres</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Confirmar contraseña <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input type={showConfirm ? 'text' : 'password'} required value={form.confirm_password} onChange={e => handleChange('confirm_password', e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`${FIELD_CLASS} pl-10 pr-10 ${form.confirm_password && form.confirm_password !== form.password ? 'border-red-300' : ''}`} />
                  <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.confirm_password && form.confirm_password !== form.password && <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Teléfono</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select value={form.country_code} onChange={e => handleChange('country_code', e.target.value)}
                      className="appearance-none pl-3 pr-8 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/10 transition-all bg-white cursor-pointer">
                      {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.abbr} {c.code}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)}
                      placeholder="Número de teléfono" className={`${FIELD_CLASS} pl-10`} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Tipo de cuenta</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'Demo', label: 'Cuenta Demo', sub: '$10,000 virtuales · Sin riesgo' },
                    { type: 'Real', label: 'Cuenta Real', sub: 'Capital real · Depósito requerido' },
                  ].map(({ type, label, sub }) => (
                    <button key={type} type="button" onClick={() => handleChange('account_type', type)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${form.account_type === type ? 'border-[#1E40AF] bg-[#1E40AF]' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                      <div className={`text-sm font-bold mb-1 ${form.account_type === type ? 'text-white' : 'text-gray-800'}`}>{label}</div>
                      <div className={`text-xs leading-tight font-medium ${form.account_type === type ? 'text-white/75' : 'text-gray-500'}`}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#1E40AF] hover:bg-[#1E3A8A] disabled:opacity-60 text-white font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-2 mt-2">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Procesando...</span>
                  : <><Shield className="h-4 w-4" />Crear cuenta segura</>}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>¿Ya tienes cuenta?</span>
              <button onClick={() => window.location.href = createPageUrl('Acceso')}
                className="text-[#1E40AF] font-semibold hover:underline">Iniciar sesión</button>
            </div>
          </div>
        </div>

        {/* ── Right: info panel ── */}
        <div className="hidden lg:flex flex-col justify-between bg-[#1E40AF] px-16 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(255,255,255,0.08),transparent)]" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-white/70 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Plataforma activa · Orion Capital
            </div>
          </div>

          <div className="relative">
            <h2 className="text-4xl font-black text-white mb-4 leading-snug">
              Invierte con la plataforma<br /><span className="text-blue-200">más avanzada de LATAM.</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs">
              Más de 10,000 traders en toda Latinoamérica ya confían en Orion Capital para hacer crecer su patrimonio.
            </p>
            <div className="space-y-4">
              {[
                { title: '6,000+ instrumentos globales', desc: 'Acciones, ETFs, Forex, Cripto e Índices' },
                { title: 'Ejecución en menos de 10ms', desc: 'Sin latencia ni slippage injustificado' },
                { title: 'Demo de $10,000 virtuales', desc: 'Practica sin arriesgar capital real' },
                { title: 'Soporte 24/5 en español', desc: 'Mesa de trading con expertos disponibles' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.title}</div>
                    <div className="text-xs text-white/45 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              {['SEC', 'FINRA', 'CNBV', 'CMF', 'AMV'].map(r => (
                <span key={r} className="text-[10px] font-bold px-2 py-1 bg-white/10 text-white/60 rounded">{r}</span>
              ))}
            </div>
            <p className="text-xs text-white/25 leading-relaxed max-w-xs">
              Orion Capital opera bajo regulación internacional. Los resultados en cuentas demo no garantizan rendimientos reales.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
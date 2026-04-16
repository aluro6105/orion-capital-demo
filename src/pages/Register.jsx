import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle2, User, Mail, Phone, ChevronDown, TrendingUp, Lock, Eye, EyeOff } from 'lucide-react';

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

const FIELD_CLASS = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/10 transition-all bg-white";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country_code: '+52',
    account_type: 'Demo',
    password: '',
    confirm_password: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.password) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    setError('');

    // Verificar si ya existe un AppUser con ese email
    const existing = await base44.entities.AppUser.filter({ email: form.email.toLowerCase().trim() });
    if (existing.length > 0) {
      setError('Ya existe una cuenta con ese correo. Inicia sesión.');
      setLoading(false);
      return;
    }

    const hashed = await hashPassword(form.password);

    // Crear AppUser para el login
    await base44.entities.AppUser.create({
      full_name: form.full_name.trim(),
      email: form.email.toLowerCase().trim(),
      password_hash: hashed,
      role: 'user',
      is_active: true,
    });

    // Crear CrmLead para el seguimiento
    await base44.entities.CrmLead.create({
      full_name: form.full_name,
      email: form.email,
      phone: form.country_code + ' ' + form.phone,
      account_type: form.account_type,
      stage: 'nuevo',
      source: 'registro_web',
    });

    // Enviar email de bienvenida con datos de acceso
    await base44.integrations.Core.SendEmail({
      to: form.email.toLowerCase().trim(),
      from_name: 'M4 Markets Latam',
      subject: '¡Bienvenido a M4 Markets Latam! Tus datos de acceso',
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #04052e; color: #ffffff; padding: 40px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #80cc00; font-size: 28px; margin: 0;">M4 Markets Latam</h1>
            <p style="color: rgba(255,255,255,0.5); margin: 8px 0 0;">Bienvenido a la plataforma</p>
          </div>
          <p style="color: rgba(255,255,255,0.8);">Hola <strong>${form.full_name}</strong>,</p>
          <p style="color: rgba(255,255,255,0.6); line-height: 1.6;">Tu cuenta en <strong style="color:#80cc00;">M4 Markets Latam</strong> ha sido creada exitosamente. A continuación encontrarás tus datos de acceso:</p>
          <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="margin: 0 0 8px; color: rgba(255,255,255,0.5); font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Datos de acceso</p>
            <p style="margin: 8px 0; color: #ffffff;"><strong>Correo:</strong> ${form.email.toLowerCase().trim()}</p>
            <p style="margin: 8px 0; color: #ffffff;"><strong>Contraseña:</strong> ${form.password}</p>
            <p style="margin: 8px 0; color: #ffffff;"><strong>Tipo de cuenta:</strong> ${form.account_type === 'Demo' ? 'Cuenta Demo ($10,000 virtuales)' : 'Cuenta Real'}</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://m4marketslatam.base44.app/Acceso" style="background: #80cc00; color: #0d0d0d; padding: 14px 32px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 15px;">Acceder a mi cuenta</a>
          </div>
          <p style="color: rgba(255,255,255,0.3); font-size: 12px; text-align: center; margin-top: 32px;">
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
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#00C853]/15 border border-[#00C853]/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-[#00C853]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Solicitud recibida</h1>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Nuestro equipo activará tu cuenta en breve. Recibirás un correo de confirmación con los detalles de acceso.
          </p>
          <button
            onClick={() => window.location.href = createPageUrl('Acceso')}
            className="w-full py-3.5 bg-[#00C853] hover:bg-[#00b34a] text-white font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            Acceder a mi cuenta
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => window.location.href = createPageUrl('Home')}
            className="mt-3 w-full py-3 border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 font-medium rounded-lg transition-all text-sm"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">

        {/* ── Left: form ── */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16">

          {/* Logo + back */}
          <div className="mb-12 flex items-center justify-between">
            <a href={createPageUrl('Home')} className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#00C853] flex items-center justify-center">
                <span className="text-white font-black text-sm tracking-tight">N</span>
              </div>
              <span className="font-black text-xl text-gray-900 tracking-tight">M4 Markets Latam</span>
            </a>
            <a
              href={createPageUrl('Home')}
              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Inicio
            </a>
          </div>

          <div className="max-w-sm w-full">
            <p className="text-xs font-semibold text-[#00C853] uppercase tracking-widest mb-3">Apertura de cuenta</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">Crea tu cuenta gratuita</h1>
            <p className="text-gray-400 text-sm mb-8">Acceso inmediato a la plataforma con $10,000 en cuenta demo.</p>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Nombre completo <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={e => handleChange('full_name', e.target.value)}
                    placeholder="Nombre y apellidos"
                    className={`${FIELD_CLASS} pl-10`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Correo electrónico <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className={`${FIELD_CLASS} pl-10`}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Contraseña <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={`${FIELD_CLASS} pl-10 pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.password && form.password.length < 8 && (
                  <p className="text-xs text-red-400 mt-1">Mínimo 8 caracteres</p>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Confirmar contraseña <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={form.confirm_password}
                    onChange={e => handleChange('confirm_password', e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`${FIELD_CLASS} pl-10 pr-10 ${form.confirm_password && form.confirm_password !== form.password ? 'border-red-300 focus:border-red-400' : ''}`}
                  />
                  <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.confirm_password && form.confirm_password !== form.password && (
                  <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Teléfono
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={form.country_code}
                      onChange={e => handleChange('country_code', e.target.value)}
                      className="appearance-none pl-3 pr-8 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/10 transition-all bg-white cursor-pointer"
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code} value={c.code}>{c.abbr} {c.code}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="Número de teléfono"
                      className={`${FIELD_CLASS} pl-10`}
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de cuenta */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Tipo de cuenta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'Demo', label: 'Cuenta Demo', sub: '$10,000 virtuales · Sin riesgo' },
                    { type: 'Real', label: 'Cuenta Real', sub: 'Capital real · Depósito requerido' },
                  ].map(({ type, label, sub }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('account_type', type)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        form.account_type === type
                          ? 'border-[#00C853] bg-[#00C853] shadow-lg shadow-[#00C853]/25'
                          : 'border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`text-sm font-bold mb-1 ${form.account_type === type ? 'text-white' : 'text-gray-800'}`}>
                        {label}
                      </div>
                      <div className={`text-xs leading-tight font-medium ${form.account_type === type ? 'text-white/75' : 'text-gray-500'}`}>
                        {sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#00C853] hover:bg-[#00b34a] disabled:opacity-60 text-white font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <>
                    Crear cuenta gratuita
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
              <span>¿Ya tienes cuenta?</span>
              <button
                onClick={() => window.location.href = createPageUrl('Acceso')}
                className="text-[#00C853] font-semibold hover:underline"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: dark panel ── */}
        <div className="hidden lg:flex flex-col justify-between bg-[#0a0d14] px-16 py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,200,83,0.07),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_80%,rgba(33,150,243,0.05),transparent)]" />

          {/* Top badge */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
              Plataforma activa · Datos en tiempo real
            </div>
          </div>

          {/* Center content */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-[#00C853]/10 border border-[#00C853]/20 flex items-center justify-center mb-6">
              <TrendingUp className="h-6 w-6 text-[#00C853]" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-snug">
              Tecnología institucional<br />
              <span className="text-[#00C853]">al alcance de todos.</span>
            </h2>
            <p className="text-white/35 text-sm leading-relaxed mb-10 max-w-xs">
              Opera con las mismas herramientas que utilizan los traders profesionales. Sin barreras de entrada.
            </p>
            <div className="space-y-4">
              {[
                { title: '$10,000 en cuenta demo', desc: 'Disponible al instante, sin depósito' },
                { title: 'Mercados globales', desc: 'Acciones, ETFs, Forex y Criptomonedas' },
                { title: 'Métricas avanzadas', desc: 'P&L, curva de capital y rendimiento' },
                { title: 'Sin costes ocultos', desc: 'Transparencia total en todo momento' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00C853]/15 border border-[#00C853]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-[#00C853]" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white/80">{item.title}</div>
                    <div className="text-xs text-white/35 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom disclaimer */}
          <div className="relative text-xs text-white/20 leading-relaxed max-w-xs">
            M4 Markets Latam es una plataforma de trading simulado con fines educativos. Los resultados obtenidos en cuentas demo no garantizan rendimientos reales.
          </div>
        </div>

      </div>
    </div>
  );
}
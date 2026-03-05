import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { ArrowRight, CheckCircle2, User, Mail, Phone, ChevronDown } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'EE.UU.' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: '+49', flag: '🇩🇪', name: 'Alemania' },
  { code: '+33', flag: '🇫🇷', name: 'Francia' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country_code: '+52',
    account_type: 'Demo',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }
    setLoading(true);
    setError('');

    await base44.entities.CrmLead.create({
      full_name: form.full_name,
      email: form.email,
      phone: form.country_code + ' ' + form.phone,
      account_type: form.account_type,
      stage: 'nuevo',
      source: 'registro_web',
    });

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-[#00C853]/15 border border-[#00C853]/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-[#00C853]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">¡Registro completado!</h1>
          <p className="text-white/50 mb-8 leading-relaxed">
            Tu solicitud ha sido recibida. Nuestro equipo activará tu cuenta y recibirás acceso en breve.
          </p>
          <button
            onClick={() => base44.auth.redirectToLogin(createPageUrl('Dashboard'))}
            className="w-full py-4 bg-[#00C853] hover:bg-[#00b34a] text-white font-bold rounded-full transition-all text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00C853]/25"
          >
            Acceder a mi cuenta <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => window.location.href = createPageUrl('Home')}
            className="mt-3 w-full py-3 border border-white/10 text-white/50 hover:text-white hover:border-white/20 font-medium rounded-full transition-all text-sm"
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
        {/* Left: form */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-16">
          {/* Logo */}
          <div className="mb-10">
            <a href={createPageUrl('Home')} className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00C853] flex items-center justify-center">
                <span className="text-white font-black text-sm">N</span>
              </div>
              <span className="font-black text-xl text-gray-900">NEXUS</span>
            </a>
          </div>

          <div className="max-w-sm w-full">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Abre tu cuenta</h1>
            <p className="text-gray-500 text-sm mb-8">Completa el formulario y accede a la plataforma.</p>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nombre completo *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={form.full_name}
                    onChange={e => handleChange('full_name', e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/10 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Correo electrónico *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/10 transition-all"
                  />
                </div>
              </div>

              {/* Teléfono con lada */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Teléfono</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={form.country_code}
                      onChange={e => handleChange('country_code', e.target.value)}
                      className="appearance-none pl-3 pr-8 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/10 transition-all bg-white cursor-pointer"
                    >
                      {COUNTRY_CODES.map(c => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="Número de teléfono"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#00C853] focus:ring-2 focus:ring-[#00C853]/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de cuenta */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Tipo de cuenta</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Demo', 'Real'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('account_type', type)}
                      className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                        form.account_type === type
                          ? 'border-[#00C853] bg-[#00C853]/8 text-[#00a844]'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {type === 'Demo' ? '🎯 Demo' : '💰 Real'}
                      <div className={`text-[10px] font-normal mt-0.5 ${form.account_type === type ? 'text-[#00a844]/70' : 'text-gray-400'}`}>
                        {type === 'Demo' ? '$10,000 virtuales' : 'Depósito real'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#00C853] hover:bg-[#00b34a] disabled:opacity-60 text-white font-bold rounded-full transition-all text-base flex items-center justify-center gap-2 shadow-lg shadow-[#00C853]/20 mt-2"
              >
                {loading ? 'Registrando...' : 'Crear mi cuenta'}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-5">
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => base44.auth.redirectToLogin(createPageUrl('Dashboard'))} className="text-[#00C853] font-semibold hover:underline">
                Iniciar sesión
              </button>
            </p>
          </div>
        </div>

        {/* Right: dark panel */}
        <div className="hidden lg:flex flex-col justify-center items-center bg-[#0a0d14] px-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(0,200,83,0.08),transparent)]" />
          <div className="relative text-center max-w-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C853]/10 border border-[#00C853]/20 text-xs text-[#00C853] font-semibold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
              Plataforma activa · Datos en vivo
            </div>
            <h2 className="text-4xl font-black text-white mb-4 leading-tight">
              Opera como<br /><span className="text-[#00C853]">un profesional</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-10">
              Accede a gráficos avanzados, datos en tiempo real y herramientas institucionales desde el primer día.
            </p>
            <div className="space-y-3 text-left">
              {[
                '$10,000 en cuenta demo al instante',
                'Acciones, ETFs, Forex y Crypto',
                'Panel de cartera y métricas avanzadas',
                'Sin comisiones ocultas',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="h-4 w-4 text-[#00C853] flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
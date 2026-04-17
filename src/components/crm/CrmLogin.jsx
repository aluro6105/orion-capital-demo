import React, { useState } from 'react';
import { ArrowRight, Users, Lock, User } from 'lucide-react';

const CRM_USER = 'm4crm';
const CRM_PASS = 'M4Markets@CRM2025!';

export default function CrmLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handle = (e) => {
    e.preventDefault();
    if (username === CRM_USER && pass === CRM_PASS) {
      sessionStorage.setItem('m4crm_auth', '1');
      onLogin();
    } else {
      setErr('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#2196F3]/15 border border-[#2196F3]/30 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-[#2196F3]" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">M4 Markets CRM</h1>
          <p className="text-white/40 text-sm">Acceso restringido · Solo administradores</p>
        </div>

        <form onSubmit={handle} className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 space-y-4">
          {err && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">{err}</div>
          )}
          <div>
            <label className="block text-xs text-[#8b8fa8] uppercase tracking-wide mb-1.5">
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> Usuario</span>
            </label>
            <input
              type="text" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="off"
              className="w-full px-3 py-2.5 bg-[#131722] border border-[#1e2130] rounded-lg text-white text-sm focus:outline-none focus:border-[#2196F3] transition-colors"
              placeholder="usuario"
            />
          </div>
          <div>
            <label className="block text-xs text-[#8b8fa8] uppercase tracking-wide mb-1.5">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Contraseña</span>
            </label>
            <input
              type="password" value={pass} onChange={e => setPass(e.target.value)} required
              className="w-full px-3 py-2.5 bg-[#131722] border border-[#1e2130] rounded-lg text-white text-sm focus:outline-none focus:border-[#2196F3] transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button type="submit"
            className="w-full py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
            Acceder al CRM <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <p className="text-center text-xs text-white/20 mt-4">M4 Markets Latam · Uso interno</p>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Shield, FileText, Save, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const STATUS_LABELS = { active: 'Activa', suspended: 'Suspendida', pending: 'Pendiente', closed: 'Cerrada' };

const LEGAL_DOCS = [
  { title: 'Términos de Servicio', content: 'Estos Términos de Servicio rigen el uso de la plataforma NEXUS. Esta es una plataforma de trading simulado con fines educativos. No se maneja dinero real en las cuentas Demo. Las cuentas Reales requieren verificación de identidad. Al usar esta plataforma, aceptas estos términos.' },
  { title: 'Política de Privacidad', content: 'Recopilamos y procesamos tus datos personales para ofrecer el servicio NEXUS. Tus datos se almacenan de forma segura y nunca se venden a terceros. Puedes solicitar la eliminación de tus datos en cualquier momento contactando con soporte.' },
  { title: 'Declaración de Riesgos', content: 'El trading de instrumentos financieros conlleva un riesgo significativo. Los resultados pasados no son indicativos de resultados futuros. Esta plataforma es solo para fines educativos y de simulación. Busca siempre asesoramiento financiero profesional antes de tomar decisiones de inversión reales.' },
];

function SettingsContent() {
  const { user, activeAccount } = useAccount();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', timezone: 'Europe/Madrid' });

  useEffect(() => {
    if (user) setForm(p => ({ ...p, full_name: user.full_name || '' }));
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    await base44.entities.AppUser.update(user.id, { full_name: form.full_name });
    const stored = JSON.parse(localStorage.getItem('nexus_user') || '{}');
    localStorage.setItem('nexus_user', JSON.stringify({ ...stored, full_name: form.full_name }));
    toast.success('Perfil actualizado');
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_user');
    window.location.href = '/';
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Ajustes</h1>

      {/* Profile */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e2130]">
          <User className="h-4 w-4 text-[#2196F3]" />
          <h2 className="text-sm font-semibold text-white">Perfil</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2196F3] to-[#9C27B0] flex items-center justify-center text-xl font-bold text-white">
              {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-white font-semibold">{user?.full_name || 'Usuario'}</div>
              <div className="text-sm text-[#8b8fa8]">{user?.email}</div>
              <div className="text-xs text-[#8b8fa8] mt-0.5">Rol: {user?.role}</div>
            </div>
          </div>
          <div>
            <Label className="text-xs text-[#8b8fa8] uppercase">Nombre mostrado</Label>
            <Input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
              className="mt-1 bg-[#131722] border-[#1e2130] text-white" />
          </div>
          <div>
            <Label className="text-xs text-[#8b8fa8] uppercase">Zona horaria</Label>
            <Select value={form.timezone} onValueChange={v => setForm(p => ({ ...p, timezone: v }))}>
              <SelectTrigger className="mt-1 bg-[#131722] border-[#1e2130] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1e2130] border-[#2a2e3f]">
                {[
                  ['America/New_York', 'Este (ET)'],
                  ['America/Chicago', 'Central (CT)'],
                  ['America/Los_Angeles', 'Pacífico (PT)'],
                  ['Europe/London', 'Londres (GMT)'],
                  ['Europe/Madrid', 'Madrid (CET)'],
                  ['Asia/Tokyo', 'Tokio (JST)'],
                  ['Asia/Hong_Kong', 'Hong Kong (HKT)'],
                ].map(([v, l]) => <SelectItem key={v} value={v} className="text-[#d1d4dc] text-sm">{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving} className="bg-[#2196F3] hover:bg-[#1976D2]">
            <Save className="h-3.5 w-3.5 mr-1.5" /> {saving ? 'Guardando…' : 'Guardar perfil'}
          </Button>
        </div>
      </div>

      {/* Account info */}
      {activeAccount && (
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e2130]">
            <Shield className="h-4 w-4 text-[#26a69a]" />
            <h2 className="text-sm font-semibold text-white">Cuenta activa</h2>
          </div>
          <div className="p-5 grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-[#8b8fa8]">Nombre:</span> <span className="text-white">{activeAccount.display_name}</span></div>
            <div><span className="text-[#8b8fa8]">Tipo:</span> <span className="text-white font-semibold">{activeAccount.type}</span></div>
            <div><span className="text-[#8b8fa8]">Divisa:</span> <span className="text-white">{activeAccount.base_currency}</span></div>
            <div><span className="text-[#8b8fa8]">Estado:</span>
              <span className={`ml-1 font-semibold ${activeAccount.status === 'active' ? 'text-[#26a69a]' : 'text-yellow-400'}`}>
                {STATUS_LABELS[activeAccount.status] || activeAccount.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Legal */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e2130]">
          <FileText className="h-4 w-4 text-[#8b8fa8]" />
          <h2 className="text-sm font-semibold text-white">Documentos legales</h2>
        </div>
        <div className="divide-y divide-[#1e2130]">
          {LEGAL_DOCS.map(doc => (
            <details key={doc.title} className="group px-5 py-3">
              <summary className="text-sm text-[#d1d4dc] cursor-pointer hover:text-white list-none flex items-center justify-between">
                {doc.title}
                <span className="text-xs text-[#8b8fa8] group-open:hidden">Ver</span>
              </summary>
              <p className="text-xs text-[#8b8fa8] mt-3 leading-relaxed">{doc.content}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Cerrar sesión</div>
          <div className="text-xs text-[#8b8fa8]">Salir de tu cuenta</div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ef5350]/40 text-[#ef5350] hover:bg-[#ef5350]/10 text-xs font-medium transition-all">
          <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default function PortalSettingsPage() {
  return <PortalLayout currentPageName="Portal_Settings"><SettingsContent /></PortalLayout>;
}
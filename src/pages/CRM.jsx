import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  Users, Calendar, ChevronDown, ChevronRight, Plus, Edit3, Trash2,
  X, Check, Phone, Mail, Globe, FileText, Clock, Tag, Search,
  BarChart2, LogOut, ArrowRight, RefreshCw
} from 'lucide-react';

// ─── Auth guard ──────────────────────────────────────────────────────────────
const CRM_EMAIL = 'caromejia088@gmail.com';
const CRM_PASS  = 'Capital2026!';

const STAGES = [
  { id: 'nuevo',         label: 'Nuevo',          color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'contactado',    label: 'Contactado',      color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'interesado',    label: 'Interesado',      color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'demo_agendada', label: 'Demo agendada',   color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'cliente',       label: 'Cliente',         color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'perdido',       label: 'Perdido',         color: 'bg-red-100 text-red-700 border-red-200' },
];

const APPT_TYPES = ['demo', 'seguimiento', 'onboarding', 'soporte'];
const APPT_STATUS = [
  { id: 'pendiente',   label: 'Pendiente',   color: 'bg-yellow-100 text-yellow-700' },
  { id: 'confirmada',  label: 'Confirmada',  color: 'bg-blue-100 text-blue-700' },
  { id: 'completada',  label: 'Completada',  color: 'bg-green-100 text-green-700' },
  { id: 'cancelada',   label: 'Cancelada',   color: 'bg-red-100 text-red-700' },
];

function stageStyle(id) {
  return STAGES.find(s => s.id === id)?.color || 'bg-gray-100 text-gray-600 border-gray-200';
}
function apptStatusStyle(id) {
  return APPT_STATUS.find(s => s.id === id)?.color || 'bg-gray-100 text-gray-600';
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handle = (e) => {
    e.preventDefault();
    if (email === CRM_EMAIL && pass === CRM_PASS) {
      sessionStorage.setItem('crm_auth', '1');
      onLogin();
    } else {
      setErr('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00C853] to-[#2196F3] mb-4">
            <span className="text-white font-black text-xl">N</span>
          </div>
          <h1 className="text-2xl font-black text-white">NEXUS CRM</h1>
          <p className="text-slate-400 text-sm mt-1">Acceso restringido</p>
        </div>
        <form onSubmit={handle} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contraseña</label>
            <input
              type="password" value={pass} onChange={e => setPass(e.target.value)} required
              className="mt-1.5 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-[#00C853] focus:ring-1 focus:ring-[#00C853]"
              placeholder="••••••••"
            />
          </div>
          {err && <p className="text-red-400 text-xs text-center">{err}</p>}
          <button type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#00C853] to-[#2196F3] text-white font-bold rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            Entrar al CRM <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Lead Modal ───────────────────────────────────────────────────────────────
function LeadModal({ lead, onClose, onSave }) {
  const [form, setForm] = useState(lead || {
    full_name: '', email: '', phone: '', country: '', stage: 'nuevo', notes: '', source: '', account_type: '', kyc_status: ''
  });

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{lead ? 'Editar lead' : 'Nuevo lead'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Nombre completo *</label>
              <input value={form.full_name} onChange={e => f('full_name', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Email *</label>
              <input value={form.email} onChange={e => f('email', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Teléfono</label>
              <input value={form.phone} onChange={e => f('phone', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">País</label>
              <input value={form.country} onChange={e => f('country', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Etapa</label>
              <select value={form.stage} onChange={e => f('stage', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853] bg-white">
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Fuente</label>
              <input value={form.source} onChange={e => f('source', e.target.value)}
                placeholder="Orgánico, referido…"
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Tipo de cuenta</label>
              <input value={form.account_type} onChange={e => f('account_type', e.target.value)}
                placeholder="DEMO / REAL"
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Estado KYC</label>
              <input value={form.kyc_status} onChange={e => f('kyc_status', e.target.value)}
                placeholder="not_started / approved…"
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Notas</label>
              <textarea value={form.notes} onChange={e => f('notes', e.target.value)} rows={3}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853] resize-none" />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button onClick={() => { if (!form.full_name || !form.email) { toast.error('Nombre y email requeridos'); return; } onSave(form); }}
            className="px-5 py-2 text-sm bg-[#00C853] hover:bg-[#00b34a] text-white font-semibold rounded-lg flex items-center gap-1.5">
            <Check className="h-4 w-4" /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Appointment Modal ────────────────────────────────────────────────────────
function AppointmentModal({ appt, leads, onClose, onSave }) {
  const [form, setForm] = useState(appt || {
    lead_id: leads[0]?.id || '', lead_name: leads[0]?.full_name || '', lead_email: leads[0]?.email || '',
    date: '', time: '10:00', type: 'demo', status: 'pendiente', notes: '', link: ''
  });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const pickLead = (id) => {
    const l = leads.find(x => x.id === id);
    if (l) setForm(p => ({ ...p, lead_id: id, lead_name: l.full_name, lead_email: l.email }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">{appt ? 'Editar cita' : 'Nueva cita'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Lead *</label>
            <select value={form.lead_id} onChange={e => pickLead(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853] bg-white">
              {leads.map(l => <option key={l.id} value={l.id}>{l.full_name} ({l.email})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Fecha *</label>
              <input type="date" value={form.date} onChange={e => f('date', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Hora</label>
              <input type="time" value={form.time} onChange={e => f('time', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Tipo</label>
              <select value={form.type} onChange={e => f('type', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#00C853]">
                {APPT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Estado</label>
              <select value={form.status} onChange={e => f('status', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#00C853]">
                {APPT_STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Link de reunión</label>
            <input value={form.link} onChange={e => f('link', e.target.value)}
              placeholder="https://meet.google.com/…"
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Notas</label>
            <textarea value={form.notes} onChange={e => f('notes', e.target.value)} rows={2}
              className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853] resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancelar</button>
          <button onClick={() => { if (!form.lead_id || !form.date) { toast.error('Lead y fecha requeridos'); return; } onSave(form); }}
            className="px-5 py-2 text-sm bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold rounded-lg flex items-center gap-1.5">
            <Check className="h-4 w-4" /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main CRM ─────────────────────────────────────────────────────────────────
export default function CRMPage() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('crm_auth') === '1');
  const [tab, setTab] = useState('pipeline');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [leadModal, setLeadModal] = useState(null); // null | 'new' | lead object
  const [apptModal, setApptModal] = useState(null);
  const [expandedLead, setExpandedLead] = useState(null);
  const qc = useQueryClient();

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['crm-leads'],
    queryFn: () => base44.entities.CrmLead.list('-created_date', 200),
    enabled: auth,
  });

  const { data: appts = [] } = useQuery({
    queryKey: ['crm-appts'],
    queryFn: () => base44.entities.CrmAppointment.list('-date', 200),
    enabled: auth,
  });

  // Auto-sync registered users as leads
  const { data: brokerAccounts = [] } = useQuery({
    queryKey: ['broker-accounts-crm'],
    queryFn: () => base44.entities.BrokerAccount.list('-created_date', 200),
    enabled: auth,
  });

  // Sync broker accounts to leads (if not already present)
  useEffect(() => {
    if (!auth || !brokerAccounts.length || !leads.length === undefined) return;
    const existingEmails = new Set(leads.map(l => l.email?.toLowerCase()));
    const newAccounts = brokerAccounts.filter(a => a.user_email && !existingEmails.has(a.user_email.toLowerCase()));
    if (newAccounts.length === 0) return;
    Promise.all(newAccounts.map(a =>
      base44.entities.CrmLead.create({
        full_name: a.display_name || a.user_email.split('@')[0],
        email: a.user_email,
        stage: 'nuevo',
        source: 'registro_app',
        account_type: a.type,
        user_id: a.user_id,
        user_email: a.user_email,
      })
    )).then(() => qc.invalidateQueries({ queryKey: ['crm-leads'] }));
  }, [auth, brokerAccounts, leads]);

  const saveLead = async (form) => {
    if (leadModal?.id) {
      await base44.entities.CrmLead.update(leadModal.id, form);
      toast.success('Lead actualizado');
    } else {
      await base44.entities.CrmLead.create(form);
      toast.success('Lead creado');
    }
    qc.invalidateQueries({ queryKey: ['crm-leads'] });
    setLeadModal(null);
  };

  const deleteLead = async (id) => {
    await base44.entities.CrmLead.delete(id);
    qc.invalidateQueries({ queryKey: ['crm-leads'] });
    toast.success('Lead eliminado');
  };

  const saveAppt = async (form) => {
    if (apptModal?.id) {
      await base44.entities.CrmAppointment.update(apptModal.id, form);
      toast.success('Cita actualizada');
    } else {
      await base44.entities.CrmAppointment.create(form);
      toast.success('Cita agendada');
    }
    qc.invalidateQueries({ queryKey: ['crm-appts'] });
    setApptModal(null);
  };

  const deleteAppt = async (id) => {
    await base44.entities.CrmAppointment.delete(id);
    qc.invalidateQueries({ queryKey: ['crm-appts'] });
    toast.success('Cita eliminada');
  };

  const logout = () => { sessionStorage.removeItem('crm_auth'); setAuth(false); };

  if (!auth) return <LoginScreen onLogin={() => setAuth(true)} />;

  const filteredLeads = leads.filter(l => {
    const matchStage = stageFilter === 'all' || l.stage === stageFilter;
    const matchSearch = !search || l.full_name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

  // Stats
  const stats = STAGES.map(s => ({ ...s, count: leads.filter(l => l.stage === s.id).length }));
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appts.filter(a => a.date === todayStr);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00C853] to-[#2196F3] flex items-center justify-center">
              <span className="text-white font-black text-xs">N</span>
            </div>
            <span className="font-black text-gray-900">NEXUS CRM</span>
          </div>
          <div className="flex items-center gap-1">
            {[
              { id: 'pipeline', label: 'Pipeline', icon: Users },
              { id: 'appointments', label: 'Citas', icon: Calendar },
              { id: 'stats', label: 'Métricas', icon: BarChart2 },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === id ? 'bg-[#00C853]/10 text-[#00a844]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}>
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
            <button onClick={logout} className="ml-2 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">

        {/* ── PIPELINE TAB ── */}
        {tab === 'pipeline' && (
          <div className="space-y-5">
            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar lead…"
                    className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00C853] bg-white w-48" />
                </div>
                <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-[#00C853]">
                  <option value="all">Todas las etapas</option>
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => qc.invalidateQueries({ queryKey: ['crm-leads'] })}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                  <RefreshCw className="h-3.5 w-3.5" /> Sincronizar
                </button>
                <button onClick={() => setLeadModal('new')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00C853] hover:bg-[#00b34a] text-white text-xs font-semibold rounded-lg">
                  <Plus className="h-3.5 w-3.5" /> Nuevo lead
                </button>
              </div>
            </div>

            {/* Stage summary chips */}
            <div className="flex flex-wrap gap-2">
              {STAGES.map(s => (
                <button key={s.id} onClick={() => setStageFilter(stageFilter === s.id ? 'all' : s.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${stageFilter === s.id || stageFilter === 'all' ? s.color : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                  {s.label} <span className="ml-1 font-bold">{stats.find(x => x.id === s.id)?.count}</span>
                </button>
              ))}
            </div>

            {/* Leads list */}
            {leadsLoading ? (
              <div className="text-center py-12 text-gray-400 text-sm">Cargando leads…</div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay leads aún. Crea uno o sincroniza los registros de la app.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLeads.map(lead => {
                  const leadAppts = appts.filter(a => a.lead_id === lead.id);
                  const isExpanded = expandedLead === lead.id;
                  return (
                    <div key={lead.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 px-4 py-3">
                        <button onClick={() => setExpandedLead(isExpanded ? null : lead.id)} className="text-gray-400 hover:text-gray-600">
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center min-w-0">
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 text-sm truncate">{lead.full_name}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1 truncate"><Mail className="h-3 w-3 flex-shrink-0" />{lead.email}</div>
                          </div>
                          <div className="hidden sm:block text-xs text-gray-500">
                            {lead.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</div>}
                            {lead.country && <div className="flex items-center gap-1 mt-0.5"><Globe className="h-3 w-3" />{lead.country}</div>}
                          </div>
                          <div className="hidden sm:block text-xs text-gray-400">
                            {lead.account_type && <div className="flex items-center gap-1"><Tag className="h-3 w-3" />{lead.account_type}</div>}
                            {lead.source && <div className="mt-0.5">📍 {lead.source}</div>}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${stageStyle(lead.stage)}`}>
                              {STAGES.find(s => s.id === lead.stage)?.label || lead.stage}
                            </span>
                            {leadAppts.length > 0 && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                                {leadAppts.length} cita{leadAppts.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => setApptModal({ lead_id: lead.id, lead_name: lead.full_name, lead_email: lead.email, date: '', time: '10:00', type: 'demo', status: 'pendiente', notes: '', link: '' })}
                            className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-[#2196F3]" title="Agendar cita">
                            <Calendar className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => setLeadModal(lead)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => deleteLead(lead.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      {/* Expanded row */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-10 py-4 bg-gray-50 space-y-3">
                          {lead.notes && (
                            <div>
                              <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Notas</div>
                              <p className="text-sm text-gray-700">{lead.notes}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-500">
                            {lead.kyc_status && <div><span className="font-semibold text-gray-400">KYC:</span> {lead.kyc_status}</div>}
                            {lead.user_id && <div><span className="font-semibold text-gray-400">User ID:</span> <span className="font-mono">{lead.user_id.slice(0,12)}…</span></div>}
                            <div><span className="font-semibold text-gray-400">Registrado:</span> {lead.created_date ? new Date(lead.created_date).toLocaleDateString('es') : '—'}</div>
                          </div>
                          {/* Appointments for this lead */}
                          {leadAppts.length > 0 && (
                            <div>
                              <div className="text-xs font-semibold text-gray-400 uppercase mb-2">Citas</div>
                              <div className="space-y-1.5">
                                {leadAppts.map(a => (
                                  <div key={a.id} className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-2 text-xs">
                                    <Calendar className="h-3.5 w-3.5 text-[#2196F3] flex-shrink-0" />
                                    <span className="font-semibold text-gray-700">{a.date} {a.time}</span>
                                    <span className="capitalize text-gray-500">{a.type}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apptStatusStyle(a.status)}`}>{a.status}</span>
                                    {a.link && <a href={a.link} target="_blank" rel="noreferrer" className="text-[#2196F3] hover:underline ml-auto">Unirse</a>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── APPOINTMENTS TAB ── */}
        {tab === 'appointments' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Citas agendadas</h2>
                {todayAppts.length > 0 && (
                  <p className="text-xs text-[#00C853] font-semibold mt-0.5">🗓 {todayAppts.length} cita{todayAppts.length !== 1 ? 's' : ''} hoy</p>
                )}
              </div>
              <button onClick={() => setApptModal('new')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-semibold rounded-lg">
                <Plus className="h-3.5 w-3.5" /> Nueva cita
              </button>
            </div>

            {appts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No hay citas agendadas.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {appts.map(a => (
                  <div key={a.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-4">
                    <div className="flex-shrink-0 text-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <div className="text-xs font-bold text-gray-400 uppercase">{a.date ? new Date(a.date + 'T00:00').toLocaleDateString('es', { month: 'short' }) : '—'}</div>
                      <div className="text-xl font-black text-gray-800">{a.date ? new Date(a.date + 'T00:00').getDate() : '—'}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{a.lead_name}</div>
                      <div className="text-xs text-gray-400">{a.lead_email}</div>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-gray-500"><Clock className="h-3 w-3" />{a.time}</span>
                        <span className="text-xs text-gray-400 capitalize">{a.type}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${apptStatusStyle(a.status)}`}>{a.status}</span>
                      </div>
                      {a.notes && <p className="text-xs text-gray-400 mt-1">{a.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {a.link && <a href={a.link} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-xs bg-[#2196F3]/10 text-[#2196F3] rounded-lg font-semibold hover:bg-[#2196F3]/20">Unirse</a>}
                      <button onClick={() => setApptModal(a)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700"><Edit3 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => deleteAppt(a.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Métricas del pipeline</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stats.map(s => (
                <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border mb-3 ${s.color}`}>{s.label}</div>
                  <div className="text-3xl font-black text-gray-900">{s.count}</div>
                  <div className="text-xs text-gray-400 mt-1">{leads.length > 0 ? Math.round((s.count / leads.length) * 100) : 0}% del total</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Total leads</div>
                <div className="text-3xl font-black text-gray-900">{leads.length}</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Total citas</div>
                <div className="text-3xl font-black text-gray-900">{appts.length}</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Clientes convertidos</div>
                <div className="text-3xl font-black text-[#00C853]">{stats.find(s => s.id === 'cliente')?.count || 0}</div>
              </div>
            </div>
            {/* Conversion bar */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-bold text-gray-700 mb-4">Distribución por etapa</div>
              <div className="space-y-3">
                {stats.map(s => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className="w-24 text-xs text-gray-500 text-right">{s.label}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className={`h-3 rounded-full transition-all ${s.id === 'cliente' ? 'bg-[#00C853]' : s.id === 'perdido' ? 'bg-red-400' : 'bg-[#2196F3]'}`}
                        style={{ width: leads.length > 0 ? `${(s.count / leads.length) * 100}%` : '0%' }} />
                    </div>
                    <div className="w-8 text-xs font-bold text-gray-700">{s.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {leadModal && (
        <LeadModal
          lead={leadModal === 'new' ? null : leadModal}
          onClose={() => setLeadModal(null)}
          onSave={saveLead}
        />
      )}
      {apptModal && (
        <AppointmentModal
          appt={apptModal === 'new' ? null : apptModal}
          leads={leads}
          onClose={() => setApptModal(null)}
          onSave={saveAppt}
        />
      )}
    </div>
  );
}
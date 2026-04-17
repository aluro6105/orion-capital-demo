import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  Users, Calendar, BarChart2, LogOut, Plus, Search,
  RefreshCw, List, LayoutGrid, Bell
} from 'lucide-react';

import CrmLogin from '@/components/crm/CrmLogin';
import CrmLeadModal from '@/components/crm/CrmLeadModal';
import CrmAppointmentModal from '@/components/crm/CrmAppointmentModal';
import CrmKanban from '@/components/crm/CrmKanban';
import CrmAgenda from '@/components/crm/CrmAgenda';

const STAGES = [
  { id: 'sin_asignar', label: 'Sin asignar', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { id: 'contactado',  label: 'Contactado',  color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'seguimiento', label: 'Seguimiento', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'convertido',  label: 'Convertido',  color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'rechazado',   label: 'Rechazado',   color: 'bg-red-100 text-red-700 border-red-200' },
];

function stageStyle(id) {
  return STAGES.find(s => s.id === id)?.color || 'bg-gray-100 text-gray-600 border-gray-200';
}

// ── Stats cards ────────────────────────────────────────────────────────────────
function StatsTab({ leads, appts }) {
  const stats = STAGES.map(s => ({ ...s, count: leads.filter(l => l.stage === s.id).length }));
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map(s => (
          <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
            <div className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-2 ${s.color}`}>{s.label}</div>
            <div className="text-3xl font-black text-gray-900">{s.count}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{leads.length > 0 ? Math.round((s.count / leads.length) * 100) : 0}%</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Total leads</div>
          <div className="text-3xl font-black text-gray-900">{leads.length}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Citas hoy</div>
          <div className="text-3xl font-black text-[#2196F3]">{appts.filter(a => a.date === todayStr).length}</div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-1">Convertidos</div>
          <div className="text-3xl font-black text-green-600">{stats.find(s => s.id === 'convertido')?.count || 0}</div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="text-sm font-bold text-gray-700 mb-4">Distribución del pipeline</div>
        <div className="space-y-3">
          {stats.map(s => (
            <div key={s.id} className="flex items-center gap-3">
              <div className="w-24 text-xs text-gray-500 text-right truncate">{s.label}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className={`h-3 rounded-full transition-all ${
                  s.id === 'convertido' ? 'bg-green-500' :
                  s.id === 'rechazado' ? 'bg-red-400' :
                  s.id === 'seguimiento' ? 'bg-yellow-400' :
                  s.id === 'contactado' ? 'bg-blue-400' : 'bg-gray-400'
                }`} style={{ width: leads.length > 0 ? `${(s.count / leads.length) * 100}%` : '0%' }} />
              </div>
              <div className="w-6 text-xs font-bold text-gray-700 text-right">{s.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Lead list view ─────────────────────────────────────────────────────────────
function LeadListView({ leads, appts, onEdit, onDelete, onAddAppt, onStageChange }) {
  return (
    <div className="space-y-1">
      {leads.map(lead => {
        const leadAppts = appts.filter(a => a.lead_id === lead.id);
        return (
          <div key={lead.id} className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center min-w-0">
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{lead.full_name}</div>
                <div className="text-xs text-gray-400 truncate">{lead.email}</div>
              </div>
              <div className="hidden sm:block text-xs text-gray-500 space-y-0.5">
                {lead.phone && <div>{lead.phone}</div>}
                {lead.country && <div>{lead.country}</div>}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${stageStyle(lead.stage)}`}>
                  {STAGES.find(s => s.id === lead.stage)?.label || lead.stage}
                </span>
                {leadAppts.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#2196F3]/10 text-[#2196F3] font-semibold">
                    {leadAppts.length} cita{leadAppts.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-xs text-gray-400">
                {lead.account_type && <div>{lead.account_type}</div>}
                {lead.source && <div className="text-gray-300">{lead.source}</div>}
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <select
                value={lead.stage}
                onChange={e => onStageChange(lead.id, e.target.value)}
                className="text-[10px] border border-gray-200 rounded-lg px-1.5 py-1 bg-white text-gray-600 focus:outline-none focus:border-[#2196F3]"
              >
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
              <button onClick={() => onAddAppt(lead)} className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors" title="Agendar cita">
                <Calendar className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => onEdit(lead)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button onClick={() => onDelete(lead.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        );
      })}
      {leads.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay leads. Crea uno o sincroniza los registros.</p>
        </div>
      )}
    </div>
  );
}

// ── Main CRM ──────────────────────────────────────────────────────────────────
export default function CRMPage() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('m4crm_auth') === '1');
  const [tab, setTab] = useState('leads');
  const [view, setView] = useState('kanban'); // 'kanban' | 'list'
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [leadModal, setLeadModal] = useState(null);
  const [apptModal, setApptModal] = useState(null);
  const qc = useQueryClient();

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['crm-leads'],
    queryFn: () => base44.entities.CrmLead.list('-created_date', 500),
    enabled: auth,
  });

  const { data: appts = [] } = useQuery({
    queryKey: ['crm-appts'],
    queryFn: () => base44.entities.CrmAppointment.list('-date', 500),
    enabled: auth,
  });

  // Sync: AppUser registrations → CRM leads
  const { data: appUsers = [] } = useQuery({
    queryKey: ['app-users-crm'],
    queryFn: () => base44.entities.AppUser.list('-created_date', 500),
    enabled: auth,
  });

  // Sync: BrokerAccount registrations → CRM leads
  const { data: brokerAccounts = [] } = useQuery({
    queryKey: ['broker-accounts-crm'],
    queryFn: () => base44.entities.BrokerAccount.list('-created_date', 500),
    enabled: auth,
  });

  // Auto-sync on data load
  useEffect(() => {
    if (!auth || leads.length === undefined) return;
    const existingEmails = new Set(leads.map(l => l.email?.toLowerCase().trim()).filter(Boolean));

    const toCreate = [];

    // From AppUsers
    appUsers.forEach(u => {
      if (u.email && !existingEmails.has(u.email.toLowerCase().trim())) {
        existingEmails.add(u.email.toLowerCase().trim());
        toCreate.push({
          full_name: u.full_name || u.email.split('@')[0],
          email: u.email.toLowerCase().trim(),
          stage: 'sin_asignar',
          source: 'registro_app',
          user_id: u.id,
          user_email: u.email,
        });
      }
    });

    // From BrokerAccounts (may have different emails)
    brokerAccounts.forEach(a => {
      if (a.user_email && !existingEmails.has(a.user_email.toLowerCase().trim())) {
        existingEmails.add(a.user_email.toLowerCase().trim());
        toCreate.push({
          full_name: a.display_name || a.user_email.split('@')[0],
          email: a.user_email.toLowerCase().trim(),
          stage: 'sin_asignar',
          source: 'broker_account',
          account_type: a.type,
          user_id: a.user_id,
          user_email: a.user_email,
        });
      }
    });

    if (toCreate.length === 0) return;

    Promise.all(toCreate.map(d => base44.entities.CrmLead.create(d)))
      .then(() => qc.invalidateQueries({ queryKey: ['crm-leads'] }));
  }, [auth, appUsers, brokerAccounts, leads]);

  // Send reminder email when appointment is created
  const sendReminderEmail = async (apptForm) => {
    if (!apptForm.reminder_email || !apptForm.date) return;
    const dateFormatted = new Date(apptForm.date + 'T00:00').toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    await base44.integrations.Core.SendEmail({
      to: apptForm.reminder_email,
      from_name: 'M4 Markets Latam',
      subject: `Recordatorio de cita: ${apptForm.type} — ${dateFormatted} a las ${apptForm.time}`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #04052e; color: #ffffff; padding: 40px; border-radius: 12px;">
          <h1 style="color: #80cc00; font-size: 22px; margin: 0 0 8px;">M4 Markets Latam</h1>
          <p style="color: rgba(255,255,255,0.6); margin: 0 0 24px; font-size: 13px;">Confirmación de cita</p>
          <p style="color: rgba(255,255,255,0.8);">Hola <strong>${apptForm.lead_name}</strong>,</p>
          <p style="color: rgba(255,255,255,0.6); line-height: 1.6;">Te confirmamos tu cita de <strong style="color:#80cc00;">${apptForm.type}</strong> con el equipo de M4 Markets Latam:</p>
          <div style="background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 6px 0; color: #fff;"><strong>📅 Fecha:</strong> ${dateFormatted}</p>
            <p style="margin: 6px 0; color: #fff;"><strong>🕐 Hora:</strong> ${apptForm.time}</p>
            <p style="margin: 6px 0; color: #fff;"><strong>📋 Tipo:</strong> ${apptForm.type.charAt(0).toUpperCase() + apptForm.type.slice(1)}</p>
            ${apptForm.link ? `<p style="margin: 6px 0; color: #fff;"><strong>🔗 Enlace:</strong> <a href="${apptForm.link}" style="color: #80cc00;">${apptForm.link}</a></p>` : ''}
            ${apptForm.notes ? `<p style="margin: 10px 0 0; color: rgba(255,255,255,0.5); font-style: italic; font-size: 13px;">${apptForm.notes}</p>` : ''}
          </div>
          <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin-top: 24px;">
            Si tienes alguna pregunta, responde a este correo o contáctanos directamente.<br/>
            M4 Markets Latam · Operar con CFDs implica un riesgo significativo de pérdida de capital.
          </p>
        </div>
      `
    }).catch(() => {}); // silently fail if email fails
  };

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
    if (!window.confirm('¿Eliminar este lead?')) return;
    await base44.entities.CrmLead.delete(id);
    qc.invalidateQueries({ queryKey: ['crm-leads'] });
    toast.success('Lead eliminado');
  };

  const saveAppt = async (form) => {
    const isNew = !apptModal?.id;
    if (isNew) {
      await base44.entities.CrmAppointment.create(form);
      await sendReminderEmail(form);
      toast.success('Cita agendada · Recordatorio enviado');
    } else {
      await base44.entities.CrmAppointment.update(apptModal.id, form);
      toast.success('Cita actualizada');
    }
    qc.invalidateQueries({ queryKey: ['crm-appts'] });
    setApptModal(null);
  };

  const deleteAppt = async (id) => {
    await base44.entities.CrmAppointment.delete(id);
    qc.invalidateQueries({ queryKey: ['crm-appts'] });
    toast.success('Cita eliminada');
  };

  const handleStageChange = async (leadId, newStage) => {
    await base44.entities.CrmLead.update(leadId, { stage: newStage });
    qc.invalidateQueries({ queryKey: ['crm-leads'] });
    toast.success(`Movido a ${STAGES.find(s => s.id === newStage)?.label}`);
  };

  const handleAddApptFromLead = (lead) => {
    setApptModal({
      lead_id: lead.id, lead_name: lead.full_name, lead_email: lead.email,
      date: '', time: '10:00', type: 'llamada', status: 'pendiente', notes: '', link: '',
      reminder_email: lead.email,
    });
    setTab('agenda');
  };

  const logout = () => { sessionStorage.removeItem('m4crm_auth'); setAuth(false); };

  if (!auth) return <CrmLogin onLogin={() => setAuth(true)} />;

  const filteredLeads = leads.filter(l => {
    const matchStage = stageFilter === 'all' || l.stage === stageFilter;
    const q = search.toLowerCase();
    const matchSearch = !search
      || l.full_name?.toLowerCase().includes(q)
      || l.email?.toLowerCase().includes(q)
      || l.phone?.toLowerCase().includes(q)
      || l.country?.toLowerCase().includes(q);
    return matchStage && matchSearch;
  });

  const todayAppts = appts.filter(a => a.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2196F3] flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="font-black text-gray-900 text-sm">M4 Markets CRM</span>
              <span className="text-gray-400 text-xs ml-2">· Panel de Gestión</span>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {[
              { id: 'leads', label: 'Leads', icon: Users, badge: leads.length },
              { id: 'agenda', label: 'Agenda', icon: Calendar, badge: todayAppts.length || null },
              { id: 'stats', label: 'Métricas', icon: BarChart2 },
            ].map(({ id, label, icon: Icon, badge }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  tab === id ? 'bg-[#2196F3]/10 text-[#2196F3]' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}>
                <Icon className="h-3.5 w-3.5" /> {label}
                {badge != null && badge > 0 && (
                  <span className={`absolute -top-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-[#2196F3] text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
            <button onClick={logout} className="ml-2 p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Cerrar sesión">
              <LogOut className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 py-6">

        {/* ── LEADS TAB ── */}
        {tab === 'leads' && (
          <div className="space-y-4">
            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, email, país…"
                    className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3] bg-white w-56" />
                </div>
                <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2196F3]">
                  <option value="all">Todas las etapas</option>
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label} ({leads.filter(l => l.stage === s.id).length})</option>)}
                </select>
              </div>

              <div className="flex gap-2 items-center">
                {/* View toggle */}
                <div className="flex bg-gray-100 rounded-lg p-0.5">
                  <button onClick={() => setView('kanban')} className={`p-1.5 rounded-md transition-all ${view === 'kanban' ? 'bg-white shadow-sm text-[#2196F3]' : 'text-gray-400 hover:text-gray-600'}`} title="Kanban">
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-[#2196F3]' : 'text-gray-400 hover:text-gray-600'}`} title="Lista">
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <button onClick={() => { qc.invalidateQueries({ queryKey: ['crm-leads'] }); qc.invalidateQueries({ queryKey: ['app-users-crm'] }); qc.invalidateQueries({ queryKey: ['broker-accounts-crm'] }); toast.success('Sincronizando registros…'); }}
                  className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5" /> Sincronizar
                </button>
                <button onClick={() => setLeadModal({})}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-semibold rounded-xl transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Nuevo lead
                </button>
              </div>
            </div>

            {/* Stage pills */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setStageFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${stageFilter === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'}`}>
                Todos ({leads.length})
              </button>
              {STAGES.map(s => (
                <button key={s.id} onClick={() => setStageFilter(stageFilter === s.id ? 'all' : s.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${stageFilter === s.id ? s.color : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'}`}>
                  {s.label} <span className="font-bold ml-1">{leads.filter(l => l.stage === s.id).length}</span>
                </button>
              ))}
            </div>

            {leadsLoading ? (
              <div className="text-center py-16 text-gray-400 text-sm">Cargando leads…</div>
            ) : view === 'kanban' ? (
              <CrmKanban
                leads={filteredLeads}
                appts={appts}
                onEdit={setLeadModal}
                onDelete={deleteLead}
                onAddAppt={handleAddApptFromLead}
                onStageChange={handleStageChange}
              />
            ) : (
              <LeadListView
                leads={filteredLeads}
                appts={appts}
                onEdit={setLeadModal}
                onDelete={deleteLead}
                onAddAppt={handleAddApptFromLead}
                onStageChange={handleStageChange}
              />
            )}
          </div>
        )}

        {/* ── AGENDA TAB ── */}
        {tab === 'agenda' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Agenda de citas</h2>
                {todayAppts.length > 0 && (
                  <p className="text-xs text-green-600 font-semibold mt-0.5 flex items-center gap-1">
                    <Bell className="h-3 w-3" /> {todayAppts.length} cita{todayAppts.length !== 1 ? 's' : ''} programada{todayAppts.length !== 1 ? 's' : ''} para hoy
                  </p>
                )}
              </div>
              <button onClick={() => setApptModal({ date: '', time: '10:00', type: 'llamada', status: 'pendiente', notes: '', link: '', reminder_email: '' })}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2196F3] hover:bg-[#1976D2] text-white text-xs font-semibold rounded-xl transition-colors">
                <Plus className="h-3.5 w-3.5" /> Nueva cita
              </button>
            </div>
            <CrmAgenda appts={appts} onEdit={setApptModal} onDelete={deleteAppt} />
          </div>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && <StatsTab leads={leads} appts={appts} />}

      </main>

      {/* ── Modals ── */}
      {leadModal !== null && (
        <CrmLeadModal
          lead={leadModal?.id ? leadModal : null}
          onClose={() => setLeadModal(null)}
          onSave={saveLead}
        />
      )}
      {apptModal !== null && (
        <CrmAppointmentModal
          appt={apptModal?.id ? apptModal : null}
          leads={leads}
          onClose={() => setApptModal(null)}
          onSave={saveAppt}
        />
      )}
    </div>
  );
}
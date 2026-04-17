import React, { useState } from 'react';
import { X, Check, Bell } from 'lucide-react';
import { toast } from 'sonner';

const APPT_TYPES = [
  { id: 'llamada', label: 'Llamada' },
  { id: 'demo', label: 'Demo' },
  { id: 'seguimiento', label: 'Seguimiento' },
  { id: 'reunion', label: 'Reunión' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'soporte', label: 'Soporte' },
];

const APPT_STATUS = [
  { id: 'pendiente', label: 'Pendiente' },
  { id: 'confirmada', label: 'Confirmada' },
  { id: 'completada', label: 'Completada' },
  { id: 'cancelada', label: 'Cancelada' },
];

export default function CrmAppointmentModal({ appt, leads, onClose, onSave }) {
  const defaultLead = leads[0];
  const [form, setForm] = useState(appt && appt.lead_id ? appt : {
    lead_id: defaultLead?.id || '',
    lead_name: defaultLead?.full_name || '',
    lead_email: defaultLead?.email || '',
    date: '',
    time: '10:00',
    type: 'llamada',
    status: 'pendiente',
    notes: '',
    link: '',
    reminder_email: defaultLead?.email || '',
  });

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const pickLead = (id) => {
    const l = leads.find(x => x.id === id);
    if (l) setForm(p => ({ ...p, lead_id: id, lead_name: l.full_name, lead_email: l.email, reminder_email: l.email }));
  };

  const handleSave = () => {
    if (!form.lead_id) { toast.error('Selecciona un lead'); return; }
    if (!form.date) { toast.error('La fecha es requerida'); return; }
    onSave(form);
    toast.success('Cita guardada. Se enviará recordatorio por email.');
  };

  // Get today for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">{appt?.id ? 'Editar Cita' : 'Nueva Cita'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Lead */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lead *</label>
            <select value={form.lead_id} onChange={e => pickLead(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3] bg-white">
              {leads.map(l => (
                <option key={l.id} value={l.id}>{l.full_name} — {l.email}</option>
              ))}
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fecha *</label>
              <input type="date" value={form.date} min={today} onChange={e => f('date', e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hora</label>
              <input type="time" value={form.time} onChange={e => f('time', e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3]" />
            </div>
          </div>

          {/* Tipo y Estado */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo</label>
              <select value={form.type} onChange={e => f('type', e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2196F3]">
                {APPT_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</label>
              <select value={form.status} onChange={e => f('status', e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#2196F3]">
                {APPT_STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Link reunión */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Link de reunión</label>
            <input value={form.link} onChange={e => f('link', e.target.value)}
              placeholder="https://meet.google.com/…"
              className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3]" />
          </div>

          {/* Recordatorio email */}
          <div className="bg-[#2196F3]/5 border border-[#2196F3]/20 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="h-3.5 w-3.5 text-[#2196F3]" />
              <span className="text-xs font-semibold text-[#2196F3] uppercase tracking-wide">Recordatorio por email</span>
            </div>
            <input value={form.reminder_email} onChange={e => f('reminder_email', e.target.value)}
              placeholder="email del lead"
              className="w-full px-3 py-2 border border-[#2196F3]/20 rounded-lg text-sm focus:outline-none focus:border-[#2196F3] bg-white" />
            <p className="text-[10px] text-gray-400 mt-1.5">Se enviará un email de confirmación al guardar la cita.</p>
          </div>

          {/* Notas */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notas de la cita</label>
            <textarea value={form.notes} onChange={e => f('notes', e.target.value)} rows={3}
              placeholder="Agenda, temas a tratar, contexto…"
              className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3] resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 pb-5">
          <button onClick={onClose}
            className="px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave}
            className="px-5 py-2.5 text-sm bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold rounded-xl flex items-center gap-1.5 transition-colors">
            <Check className="h-4 w-4" /> Guardar cita
          </button>
        </div>
      </div>
    </div>
  );
}
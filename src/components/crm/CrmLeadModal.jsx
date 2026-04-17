import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';

const STAGES = [
  { id: 'sin_asignar', label: 'Sin asignar' },
  { id: 'contactado',  label: 'Contactado' },
  { id: 'seguimiento', label: 'Seguimiento' },
  { id: 'convertido',  label: 'Convertido' },
  { id: 'rechazado',   label: 'Rechazado' },
];

export default function CrmLeadModal({ lead, onClose, onSave }) {
  const [form, setForm] = useState(lead || {
    full_name: '', email: '', phone: '', country: '',
    stage: 'sin_asignar', notes: '', source: '', account_type: '', kyc_status: ''
  });

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.full_name || !form.email) { toast.error('Nombre y email son requeridos'); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">{lead?.id ? 'Editar Lead' : 'Nuevo Lead'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nombre completo *</label>
            <input value={form.full_name} onChange={e => f('full_name', e.target.value)}
              className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3] focus:ring-1 focus:ring-[#2196F3]/20" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email *</label>
              <input type="email" value={form.email} onChange={e => f('email', e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Teléfono</label>
              <input value={form.phone} onChange={e => f('phone', e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">País</label>
              <input value={form.country} onChange={e => f('country', e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Etapa</label>
              <select value={form.stage} onChange={e => f('stage', e.target.value)}
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3] bg-white">
                {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fuente</label>
              <input value={form.source} onChange={e => f('source', e.target.value)}
                placeholder="registro_web, referido…"
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3]" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo de cuenta</label>
              <input value={form.account_type} onChange={e => f('account_type', e.target.value)}
                placeholder="DEMO / REAL"
                className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2196F3]" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Comentarios / Notas</label>
            <textarea value={form.notes} onChange={e => f('notes', e.target.value)} rows={4}
              placeholder="Agrega observaciones, seguimientos, comentarios del agente…"
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
            <Check className="h-4 w-4" /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
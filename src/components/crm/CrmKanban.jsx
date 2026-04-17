import React from 'react';
import { Calendar, Edit3, Trash2, Phone, Mail, Globe, Tag } from 'lucide-react';

const STAGES = [
  { id: 'sin_asignar', label: 'Sin asignar', color: 'bg-gray-100 text-gray-600 border-gray-300', header: 'bg-gray-200 text-gray-700', dot: 'bg-gray-400' },
  { id: 'contactado',  label: 'Contactado',  color: 'bg-blue-100 text-blue-700 border-blue-200',  header: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  { id: 'seguimiento', label: 'Seguimiento', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', header: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  { id: 'convertido',  label: 'Convertido',  color: 'bg-green-100 text-green-700 border-green-200',  header: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  { id: 'rechazado',   label: 'Rechazado',   color: 'bg-red-100 text-red-700 border-red-200',   header: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
];

function LeadCard({ lead, onEdit, onDelete, onAddAppt, apptCount }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 text-sm truncate">{lead.full_name}</div>
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 truncate">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => onAddAppt(lead)} className="p-1 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-500" title="Agendar cita">
            <Calendar className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onEdit(lead)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700">
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => onDelete(lead.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 space-y-0.5">
        {lead.phone && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Phone className="h-3 w-3" /> {lead.phone}
          </div>
        )}
        {lead.country && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Globe className="h-3 w-3" /> {lead.country}
          </div>
        )}
        {lead.account_type && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Tag className="h-3 w-3" /> {lead.account_type}
          </div>
        )}
      </div>

      {lead.notes && (
        <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-2 py-1.5 line-clamp-2">
          {lead.notes}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="text-[10px] text-gray-300">
          {lead.created_date ? new Date(lead.created_date).toLocaleDateString('es') : ''}
        </div>
        {apptCount > 0 && (
          <span className="text-[10px] px-2 py-0.5 bg-[#2196F3]/10 text-[#2196F3] rounded-full font-semibold">
            {apptCount} cita{apptCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}

export default function CrmKanban({ leads, appts, onEdit, onDelete, onAddAppt, onStageChange }) {
  const getApptCount = (leadId) => appts.filter(a => a.lead_id === leadId).length;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map(stage => {
        const stageLeads = leads.filter(l => l.stage === stage.id);
        return (
          <div key={stage.id} className="flex-shrink-0 w-64">
            {/* Column header */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-3 ${stage.header}`}>
              <div className={`w-2 h-2 rounded-full ${stage.dot}`} />
              <span className="text-xs font-bold">{stage.label}</span>
              <span className="ml-auto text-xs font-bold opacity-60">{stageLeads.length}</span>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {stageLeads.map(lead => (
                <div key={lead.id}>
                  {/* Quick stage move buttons */}
                  <div className="flex gap-1 mb-1">
                    {STAGES.filter(s => s.id !== stage.id).map(s => (
                      <button
                        key={s.id}
                        onClick={() => onStageChange(lead.id, s.id)}
                        className="flex-1 py-0.5 text-[9px] font-semibold bg-gray-50 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded transition-colors truncate px-0.5"
                        title={`Mover a ${s.label}`}
                      >
                        → {s.label.slice(0, 4)}
                      </button>
                    ))}
                  </div>
                  <LeadCard
                    lead={lead}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddAppt={onAddAppt}
                    apptCount={getApptCount(lead.id)}
                  />
                </div>
              ))}
              {stageLeads.length === 0 && (
                <div className="text-center py-8 text-gray-300 text-xs border-2 border-dashed border-gray-100 rounded-xl">
                  Sin leads
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
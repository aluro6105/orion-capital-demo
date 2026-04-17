import React, { useState } from 'react';
import { Calendar, Clock, Edit3, Trash2, ExternalLink, Bell, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const STATUS_CONFIG = {
  pendiente:  { label: 'Pendiente',  icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  confirmada: { label: 'Confirmada', icon: CheckCircle2, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  completada: { label: 'Completada', icon: CheckCircle2, color: 'text-green-600 bg-green-50 border-green-200' },
  cancelada:  { label: 'Cancelada',  icon: XCircle,     color: 'text-red-600 bg-red-50 border-red-200' },
};

const TYPE_COLORS = {
  llamada:     'bg-purple-50 text-purple-700',
  demo:        'bg-blue-50 text-blue-700',
  seguimiento: 'bg-yellow-50 text-yellow-700',
  reunion:     'bg-orange-50 text-orange-700',
  onboarding:  'bg-green-50 text-green-700',
  soporte:     'bg-red-50 text-red-700',
};

function isToday(dateStr) {
  return dateStr === new Date().toISOString().split('T')[0];
}
function isTomorrow(dateStr) {
  const tom = new Date(); tom.setDate(tom.getDate() + 1);
  return dateStr === tom.toISOString().split('T')[0];
}
function isPast(dateStr) {
  return dateStr < new Date().toISOString().split('T')[0];
}

export default function CrmAgenda({ appts, onEdit, onDelete }) {
  const [filter, setFilter] = useState('proximas');

  const sorted = [...appts].sort((a, b) => (a.date + a.time) > (b.date + b.time) ? 1 : -1);

  const filtered = sorted.filter(a => {
    if (filter === 'hoy') return isToday(a.date);
    if (filter === 'proximas') return !isPast(a.date) || isToday(a.date);
    if (filter === 'pasadas') return isPast(a.date) && !isToday(a.date);
    return true;
  });

  // Group by date
  const groups = filtered.reduce((acc, a) => {
    if (!acc[a.date]) acc[a.date] = [];
    acc[a.date].push(a);
    return acc;
  }, {});

  const FILTERS = [
    { id: 'hoy', label: 'Hoy', count: sorted.filter(a => isToday(a.date)).length },
    { id: 'proximas', label: 'Próximas', count: sorted.filter(a => !isPast(a.date) || isToday(a.date)).length },
    { id: 'pasadas', label: 'Pasadas', count: sorted.filter(a => isPast(a.date) && !isToday(a.date)).length },
    { id: 'todas', label: 'Todas', count: sorted.length },
  ];

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === f.id ? 'bg-[#2196F3] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === f.id ? 'bg-white/20' : 'bg-gray-200'}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {Object.keys(groups).length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay citas en este período.</p>
        </div>
      )}

      {Object.entries(groups).map(([date, dayAppts]) => {
        const d = new Date(date + 'T00:00');
        const dayLabel = isToday(date) ? '🟢 Hoy' : isTomorrow(date) ? '🟡 Mañana' : d.toLocaleDateString('es', { weekday: 'long', month: 'long', day: 'numeric' });
        return (
          <div key={date}>
            <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${isToday(date) ? 'text-green-600' : isTomorrow(date) ? 'text-yellow-600' : 'text-gray-400'}`}>
              {dayLabel}
            </div>
            <div className="space-y-2">
              {dayAppts.map(a => {
                const sc = STATUS_CONFIG[a.status] || STATUS_CONFIG.pendiente;
                const StatusIcon = sc.icon;
                return (
                  <div key={a.id} className={`bg-white border rounded-xl px-4 py-3 shadow-sm flex items-center gap-4 ${isToday(date) ? 'border-green-200' : 'border-gray-100'}`}>
                    {/* Time */}
                    <div className="flex-shrink-0 text-center w-14">
                      <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {a.time || '—'}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900 text-sm">{a.lead_name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${TYPE_COLORS[a.type] || 'bg-gray-100 text-gray-600'}`}>
                          {a.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${sc.color}`}>
                          <StatusIcon className="h-2.5 w-2.5" /> {sc.label}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{a.lead_email}</div>
                      {a.notes && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{a.notes}</p>}
                      {a.reminder_email && (
                        <div className="flex items-center gap-1 text-[10px] text-[#2196F3] mt-1">
                          <Bell className="h-2.5 w-2.5" /> Recordatorio → {a.reminder_email}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {a.link && (
                        <a href={a.link} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-[#2196F3]/10 text-[#2196F3] rounded-lg font-semibold hover:bg-[#2196F3]/20 transition-colors">
                          <ExternalLink className="h-3 w-3" /> Unirse
                        </a>
                      )}
                      <button onClick={() => onEdit(a)} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => onDelete(a.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
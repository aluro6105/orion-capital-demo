import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Plus, Send, ChevronRight, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const FAQ = [
  { q: '¿Cómo reseteo mi cuenta Demo?', a: 'Ve a Panel → Acciones rápidas → Resetear cuenta Demo. Se borrarán todas las posiciones y operaciones, y se restaurará el saldo virtual.' },
  { q: '¿Qué es la verificación KYC?', a: 'El KYC (Know Your Customer) es un requisito legal para las cuentas reales. Debes subir un documento de identidad y un comprobante de domicilio para retirar fondos.' },
  { q: '¿Cuánto tarda la verificación KYC?', a: 'La revisión KYC suele tardar entre 1 y 2 días hábiles. Recibirás una notificación cuando finalice la revisión.' },
  { q: '¿Los precios son reales?', a: 'Esta es una plataforma de trading simulado. Los precios son simulados con fines educativos. En las cuentas Demo no se maneja dinero real.' },
  { q: '¿Cómo deposito fondos?', a: 'Ve a Fondos → Depósito, selecciona tu método preferido, introduce el importe y envía la solicitud. Solo disponible para cuentas Reales.' },
  { q: '¿Puedo exportar mi historial de operaciones?', a: 'Sí. Ve a Órdenes y Operaciones → Exportar CSV, o usa Informes y Extractos para obtener un estado de cuenta completo.' },
];

const CATEGORIES = [
  { value: 'account', label: 'Cuenta' },
  { value: 'funding', label: 'Fondos' },
  { value: 'trading', label: 'Trading' },
  { value: 'kyc', label: 'KYC' },
  { value: 'technical', label: 'Técnico' },
  { value: 'other', label: 'Otro' },
];

const STATUS_LABELS = {
  open: 'ABIERTO',
  pending: 'PENDIENTE',
  resolved: 'RESUELTO',
  closed: 'CERRADO',
};

function SupportContent() {
  const { user } = useAccount();
  const queryClient = useQueryClient();
  const [view, setView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [newForm, setNewForm] = useState({ subject: '', category: 'other', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data: tickets = [] } = useQuery({
    queryKey: ['tickets', user?.id],
    queryFn: () => base44.entities.SupportTicket.filter({ user_id: user.id }),
    enabled: !!user?.id,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['ticket-messages', selectedTicket?.id],
    queryFn: () => base44.entities.TicketMessage.filter({ ticket_id: selectedTicket.id }),
    enabled: !!selectedTicket?.id,
  });

  const sorted = [...tickets].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const handleNewTicket = async () => {
    if (!newForm.subject || !newForm.message) { toast.error('El asunto y el mensaje son obligatorios'); return; }
    setSubmitting(true);
    const ticket = await base44.entities.SupportTicket.create({
      user_id: user.id, user_email: user.email,
      subject: newForm.subject, category: newForm.category, status: 'open', priority: 'normal',
    });
    await base44.entities.TicketMessage.create({
      ticket_id: ticket.id, user_id: user.id, sender_role: 'user',
      sender_name: user.full_name || user.email, message: newForm.message,
    });
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
    setNewForm({ subject: '', category: 'other', message: '' });
    toast.success('Ticket creado correctamente');
    setView('list');
    setSubmitting(false);
  };

  const handleReply = async () => {
    if (!replyMsg.trim()) return;
    setSubmitting(true);
    await base44.entities.TicketMessage.create({
      ticket_id: selectedTicket.id, user_id: user.id, sender_role: 'user',
      sender_name: user.full_name || user.email, message: replyMsg,
    });
    await base44.entities.SupportTicket.update(selectedTicket.id, { status: 'open', last_reply_by: 'user' });
    queryClient.invalidateQueries({ queryKey: ['ticket-messages', selectedTicket.id] });
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
    setReplyMsg('');
    setSubmitting(false);
  };

  const statusConfig = {
    open: { color: 'text-[#26a69a]', bg: 'bg-[#26a69a]/20', icon: MessageSquare },
    pending: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: Clock },
    resolved: { color: 'text-[#2196F3]', bg: 'bg-[#2196F3]/20', icon: CheckCircle2 },
    closed: { color: 'text-[#8b8fa8]', bg: 'bg-[#8b8fa8]/20', icon: XCircle },
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">Soporte</h1>
        {view === 'list' && (
          <Button onClick={() => setView('new')} className="bg-[#2196F3] hover:bg-[#1976D2] text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Nuevo Ticket
          </Button>
        )}
        {view !== 'list' && (
          <Button variant="ghost" onClick={() => { setView('list'); setSelectedTicket(null); }}
            className="text-[#d1d4dc] hover:text-white hover:bg-[#1e2130] text-xs">← Volver</Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2">
          {view === 'list' && (
            <div className="space-y-2">
              {sorted.length === 0 ? (
                <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-10 text-center">
                  <MessageSquare className="h-10 w-10 text-[#1e2130] mx-auto mb-3" />
                  <p className="text-sm text-[#8b8fa8]">Sin tickets aún. Crea uno si necesitas ayuda.</p>
                </div>
              ) : sorted.map(t => {
                const cfg = statusConfig[t.status] || statusConfig.open;
                const Icon = cfg.icon;
                return (
                  <button key={t.id} onClick={() => { setSelectedTicket(t); setView('detail'); }}
                    className="w-full flex items-center gap-4 p-4 bg-[#0f1117] border border-[#1e2130] rounded-xl hover:border-[#2a2e3f] transition-all text-left">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                      <Icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">{t.subject}</div>
                      <div className="text-xs text-[#8b8fa8]">{t.category} · {new Date(t.created_date).toLocaleDateString('es-ES')}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>{STATUS_LABELS[t.status] || t.status.toUpperCase()}</span>
                    <ChevronRight className="h-4 w-4 text-[#8b8fa8]" />
                  </button>
                );
              })}
            </div>
          )}

          {view === 'new' && (
            <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white">Crear nuevo ticket</h2>
              <div>
                <Label className="text-xs text-[#8b8fa8] uppercase">Categoría</Label>
                <Select value={newForm.category} onValueChange={v => setNewForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger className="mt-1 bg-[#131722] border-[#1e2130] text-white text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1e2130] border-[#2a2e3f]">
                    {CATEGORIES.map(c => (
                      <SelectItem key={c.value} value={c.value} className="text-[#d1d4dc] text-sm">{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-[#8b8fa8] uppercase">Asunto</Label>
                <Input value={newForm.subject} onChange={e => setNewForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Breve descripción del problema..." className="mt-1 bg-[#131722] border-[#1e2130] text-white" />
              </div>
              <div>
                <Label className="text-xs text-[#8b8fa8] uppercase">Mensaje</Label>
                <Textarea value={newForm.message} onChange={e => setNewForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Describe tu problema en detalle..." rows={5}
                  className="mt-1 bg-[#131722] border-[#1e2130] text-white resize-none" />
              </div>
              <Button onClick={handleNewTicket} disabled={submitting} className="bg-[#2196F3] hover:bg-[#1976D2]">
                <Send className="h-3.5 w-3.5 mr-1.5" /> {submitting ? 'Enviando…' : 'Enviar Ticket'}
              </Button>
            </div>
          )}

          {view === 'detail' && selectedTicket && (
            <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#1e2130]">
                <div className="font-semibold text-white">{selectedTicket.subject}</div>
                <div className="text-xs text-[#8b8fa8]">#{selectedTicket.id?.slice(-6)} · {selectedTicket.category}</div>
              </div>
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {[...messages].sort((a, b) => new Date(a.created_date) - new Date(b.created_date)).map(m => (
                  <div key={m.id} className={`flex gap-3 ${m.sender_role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs rounded-xl px-4 py-2.5 text-sm ${m.sender_role === 'user' ? 'bg-[#2196F3]/20 text-white' : 'bg-[#1e2130] text-[#d1d4dc]'}`}>
                      <div className="text-[10px] text-[#8b8fa8] mb-1">{m.sender_name} · {new Date(m.created_date).toLocaleString('es-ES')}</div>
                      {m.message}
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-xs text-[#8b8fa8] text-center py-4">Sin mensajes aún</p>}
              </div>
              {selectedTicket.status !== 'closed' && (
                <div className="p-4 border-t border-[#1e2130] flex gap-2">
                  <Input value={replyMsg} onChange={e => setReplyMsg(e.target.value)}
                    placeholder="Escribe una respuesta..." onKeyDown={e => e.key === 'Enter' && handleReply()}
                    className="bg-[#131722] border-[#1e2130] text-white text-sm" />
                  <Button onClick={handleReply} disabled={submitting || !replyMsg.trim()} size="icon" className="bg-[#2196F3] hover:bg-[#1976D2]">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Preguntas frecuentes</h3>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group">
                <summary className="text-xs text-[#d1d4dc] cursor-pointer hover:text-white list-none flex items-center justify-between gap-2">
                  {f.q}
                  <ChevronRight className="h-3 w-3 flex-shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs text-[#8b8fa8] mt-2 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortalSupportPage() {
  return <PortalLayout currentPageName="Portal_Support"><SupportContent /></PortalLayout>;
}
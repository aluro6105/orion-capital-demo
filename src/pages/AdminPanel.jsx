import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Settings, Award, MessageSquare, HelpCircle, Users, Plus, Trash2,
  CheckCircle2, XCircle, Edit3, Save, DollarSign, ArrowUpRight, ArrowDownRight, LogOut, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_USER = 'm4admin';
const ADMIN_PASS = 'M4Markets@2025!';

const TABS = [
  { id: 'settings', label: 'Configuración', icon: Settings },
  { id: 'deposits', label: 'Depósitos', icon: DollarSign },
  { id: 'awards', label: 'Premios', icon: Award },
  { id: 'testimonials', label: 'Testimonios', icon: MessageSquare },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'instruments', label: 'Instrumentos', icon: Users },
];

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (u === ADMIN_USER && p === ADMIN_PASS) {
      sessionStorage.setItem('m4_admin_auth', '1');
      onLogin();
    } else {
      setErr('Credenciales incorrectas.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#2196F3]/15 border border-[#2196F3]/30 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-[#2196F3]" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">Área de Administración</h1>
          <p className="text-white/40 text-sm">Acceso restringido · M4 Markets Latam</p>
        </div>
        <form onSubmit={handleLogin} className="bg-[#0f1117] border border-[#1e2130] rounded-2xl p-6 space-y-4">
          {err && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{err}</div>
          )}
          <div>
            <label className="block text-xs text-[#8b8fa8] uppercase tracking-wide mb-1.5">Usuario</label>
            <input type="text" value={u} onChange={e => setU(e.target.value)} required autoComplete="off"
              className="w-full px-3 py-2.5 bg-[#131722] border border-[#1e2130] rounded-lg text-white text-sm focus:outline-none focus:border-[#2196F3] transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-[#8b8fa8] uppercase tracking-wide mb-1.5">Contraseña</label>
            <input type="password" value={p} onChange={e => setP(e.target.value)} required
              className="w-full px-3 py-2.5 bg-[#131722] border border-[#1e2130] rounded-lg text-white text-sm focus:outline-none focus:border-[#2196F3] transition-colors" />
          </div>
          <button type="submit"
            className="w-full py-3 bg-[#2196F3] hover:bg-[#1976D2] text-white font-bold rounded-lg transition-colors">
            Acceder al panel
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
function SettingsTab() {
  const { data: settings = [] } = useQuery({ queryKey: ['admin-settings'], queryFn: () => base44.entities.AdminSettings.list() });
  const qc = useQueryClient();
  const cfg = settings[0];
  const [form, setForm] = useState({ cash_default: 100000, fee_type: 'fixed', fee_value: 0 });
  useEffect(() => { if (cfg) setForm({ cash_default: cfg.cash_default || 100000, fee_type: cfg.fee_type || 'fixed', fee_value: cfg.fee_value || 0 }); }, [cfg]);
  const save = async () => {
    if (cfg) await base44.entities.AdminSettings.update(cfg.id, form);
    else await base44.entities.AdminSettings.create(form);
    qc.invalidateQueries({ queryKey: ['admin-settings'] });
    toast.success('Configuración guardada');
  };
  return (
    <div className="space-y-6 max-w-lg">
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-white">Cuenta Demo</h3>
        <div>
          <Label className="text-xs text-[#8b8fa8] uppercase">Capital inicial por defecto ($)</Label>
          <Input type="number" value={form.cash_default} onChange={e => setForm(p => ({ ...p, cash_default: +e.target.value }))} className="mt-1 bg-[#131722] border-[#1e2130] text-white" />
        </div>
      </div>
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-white">Comisiones simuladas</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-[#8b8fa8] uppercase">Tipo</Label>
            <Select value={form.fee_type} onValueChange={v => setForm(p => ({ ...p, fee_type: v }))}>
              <SelectTrigger className="mt-1 bg-[#131722] border-[#1e2130] text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1e2130] border-[#2a2e3f]">
                <SelectItem value="fixed" className="text-white">Fijo ($)</SelectItem>
                <SelectItem value="percentage" className="text-white">Porcentaje (%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-[#8b8fa8] uppercase">Valor</Label>
            <Input type="number" step="0.01" value={form.fee_value} onChange={e => setForm(p => ({ ...p, fee_value: +e.target.value }))} className="mt-1 bg-[#131722] border-[#1e2130] text-white" />
          </div>
        </div>
      </div>
      <Button onClick={save} className="bg-[#2196F3] hover:bg-[#1976D2]"><Save className="h-4 w-4 mr-1.5" /> Guardar</Button>
    </div>
  );
}

function DepositsTab() {
  const { data: ledger = [], isLoading } = useQuery({ queryKey: ['admin-ledger'], queryFn: () => base44.entities.LedgerEntry.list('-created_date', 100) });
  const { data: accounts = [] } = useQuery({ queryKey: ['admin-broker-accounts'], queryFn: () => base44.entities.BrokerAccount.list() });
  const qc = useQueryClient();
  const pending = ledger.filter(l => l.status === 'pending');
  const others = ledger.filter(l => l.status !== 'pending');

  const approve = async (entry) => {
    await base44.entities.LedgerEntry.update(entry.id, { status: 'completed' });
    const account = accounts.find(a => a.id === entry.account_id);
    if (account) {
      if (entry.type === 'deposit') await base44.entities.BrokerAccount.update(account.id, { cash_balance: (account.cash_balance || 0) + entry.amount });
      if (entry.type === 'withdrawal') await base44.entities.BrokerAccount.update(account.id, { cash_balance: Math.max(0, (account.cash_balance || 0) - entry.amount) });
    }
    qc.invalidateQueries();
    toast.success('Transacción aprobada y balance actualizado');
  };
  const reject = async (entry) => {
    await base44.entities.LedgerEntry.update(entry.id, { status: 'rejected' });
    qc.invalidateQueries({ queryKey: ['admin-ledger'] });
    toast.success('Transacción rechazada');
  };

  const typeLabel = { deposit: 'Depósito', withdrawal: 'Retiro', fee: 'Comisión', adjustment: 'Ajuste', trade_buy: 'Compra', trade_sell: 'Venta', virtual_add: 'Adición virtual' };
  const statusColor = { pending: 'text-yellow-400 bg-yellow-500/15', completed: 'text-[#26a69a] bg-[#26a69a]/15', rejected: 'text-[#ef5350] bg-[#ef5350]/15', cancelled: 'text-[#8b8fa8] bg-[#8b8fa8]/15' };

  if (isLoading) return <div className="text-center text-[#8b8fa8] py-12">Cargando...</div>;
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          Pendientes de aprobación ({pending.length})
        </h3>
        {pending.length === 0 ? (
          <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-6 text-center text-[#8b8fa8] text-sm">No hay transacciones pendientes.</div>
        ) : (
          <div className="space-y-2">
            {pending.map(entry => {
              const account = accounts.find(a => a.id === entry.account_id);
              return (
                <div key={entry.id} className="flex items-center gap-4 p-4 bg-[#0f1117] border border-yellow-500/20 rounded-xl">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${entry.type === 'deposit' ? 'bg-[#26a69a]/15' : 'bg-[#ef5350]/15'}`}>
                    {entry.type === 'deposit' ? <ArrowUpRight className="h-4 w-4 text-[#26a69a]" /> : <ArrowDownRight className="h-4 w-4 text-[#ef5350]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{typeLabel[entry.type] || entry.type}</div>
                    <div className="text-xs text-[#8b8fa8] truncate">{account ? `${account.display_name || account.user_email} · ${account.type}` : entry.account_id}</div>
                    {entry.notes && <div className="text-xs text-white/40 italic mt-0.5">{entry.notes}</div>}
                    <div className="text-[10px] text-[#8b8fa8] mt-1">{new Date(entry.created_date).toLocaleString()}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-base font-black ${entry.type === 'deposit' ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                      {entry.type === 'deposit' ? '+' : '-'}${entry.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-[#8b8fa8]">{entry.currency || 'USD'}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approve(entry)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#26a69a]/15 hover:bg-[#26a69a]/25 text-[#26a69a] text-xs font-semibold transition-colors">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Aprobar
                    </button>
                    <button onClick={() => reject(entry)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ef5350]/15 hover:bg-[#ef5350]/25 text-[#ef5350] text-xs font-semibold transition-colors">
                      <XCircle className="h-3.5 w-3.5" /> Rechazar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#8b8fa8] mb-3">Historial reciente</h3>
        <div className="space-y-1.5">
          {others.slice(0, 20).map(entry => {
            const account = accounts.find(a => a.id === entry.account_id);
            return (
              <div key={entry.id} className="flex items-center gap-3 px-4 py-3 bg-[#0f1117] border border-[#1e2130] rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white">{typeLabel[entry.type] || entry.type}</div>
                  <div className="text-[10px] text-[#8b8fa8] truncate">{account ? (account.display_name || account.user_email) : entry.account_id}</div>
                </div>
                <div className={`text-xs font-bold font-mono ${entry.type === 'deposit' ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                  {entry.type === 'deposit' ? '+' : '-'}${entry.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[entry.status] || 'text-white/40 bg-white/5'}`}>{entry.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AwardsTab() {
  const { data: awards = [] } = useQuery({ queryKey: ['awards-admin'], queryFn: () => base44.entities.Award.list() });
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: '', year: new Date().getFullYear(), issuer: '', description: '', category: 'innovation', is_active: true });
  const [editing, setEditing] = useState(null);
  const save = async () => {
    if (editing) await base44.entities.Award.update(editing, form);
    else await base44.entities.Award.create(form);
    qc.invalidateQueries({ queryKey: ['awards-admin'] });
    toast.success(editing ? 'Premio actualizado' : 'Premio creado');
    setForm({ title: '', year: new Date().getFullYear(), issuer: '', description: '', category: 'innovation', is_active: true });
    setEditing(null);
  };
  return (
    <div className="space-y-5">
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-white text-sm">{editing ? 'Editar premio' : 'Añadir premio'}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Label className="text-xs text-[#8b8fa8]">Título</Label><Input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="mt-1 bg-[#131722] border-[#1e2130] text-white" /></div>
          <div><Label className="text-xs text-[#8b8fa8]">Año</Label><Input type="number" value={form.year} onChange={e => setForm(p => ({...p, year: +e.target.value}))} className="mt-1 bg-[#131722] border-[#1e2130] text-white" /></div>
          <div><Label className="text-xs text-[#8b8fa8]">Emisor</Label><Input value={form.issuer} onChange={e => setForm(p => ({...p, issuer: e.target.value}))} className="mt-1 bg-[#131722] border-[#1e2130] text-white" /></div>
          <div className="col-span-2"><Label className="text-xs text-[#8b8fa8]">Descripción</Label><Textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={2} className="mt-1 bg-[#131722] border-[#1e2130] text-white resize-none" /></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={save} className="bg-[#2196F3] hover:bg-[#1976D2] text-xs"><Plus className="h-3.5 w-3.5 mr-1" />{editing ? 'Actualizar' : 'Añadir'}</Button>
          {editing && <Button variant="outline" onClick={() => { setEditing(null); setForm({ title: '', year: new Date().getFullYear(), issuer: '', description: '', category: 'innovation', is_active: true }); }} className="border-[#1e2130] text-[#d1d4dc] text-xs">Cancelar</Button>}
        </div>
      </div>
      <div className="space-y-2">
        {awards.map(a => (
          <div key={a.id} className="flex items-center gap-3 p-3 bg-[#0f1117] border border-[#1e2130] rounded-xl">
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">{a.title}</div>
              <div className="text-xs text-[#8b8fa8]">{a.issuer} · {a.year}</div>
            </div>
            <button onClick={() => { setEditing(a.id); setForm({ title: a.title, year: a.year, issuer: a.issuer, description: a.description || '', category: a.category || 'innovation', is_active: a.is_active !== false }); }} className="p-1.5 rounded hover:bg-[#1e2130] text-[#8b8fa8] hover:text-white"><Edit3 className="h-3.5 w-3.5" /></button>
            <button onClick={async () => { await base44.entities.Award.delete(a.id); qc.invalidateQueries({ queryKey: ['awards-admin'] }); toast.success('Eliminado'); }} className="p-1.5 rounded hover:bg-[#ef5350]/10 text-[#8b8fa8] hover:text-[#ef5350]"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialsTab() {
  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials-admin'], queryFn: () => base44.entities.Testimonial.list() });
  const qc = useQueryClient();
  const toggle = async (t) => { await base44.entities.Testimonial.update(t.id, { approved: !t.approved }); qc.invalidateQueries({ queryKey: ['testimonials-admin'] }); toast.success(t.approved ? 'Desaprobado' : 'Aprobado'); };
  const del = async (id) => { await base44.entities.Testimonial.delete(id); qc.invalidateQueries({ queryKey: ['testimonials-admin'] }); toast.success('Eliminado'); };
  return (
    <div className="space-y-2">
      {testimonials.length === 0 && <p className="text-sm text-[#8b8fa8] text-center py-8">No hay testimonios aún.</p>}
      {testimonials.map(t => (
        <div key={t.id} className="flex items-start gap-3 p-4 bg-[#0f1117] border border-[#1e2130] rounded-xl">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{t.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${t.approved ? 'bg-[#26a69a]/20 text-[#26a69a]' : 'bg-yellow-500/20 text-yellow-400'}`}>{t.approved ? 'APROBADO' : 'PENDIENTE'}</span>
            </div>
            <div className="text-xs text-[#8b8fa8]">{t.role}{t.company ? ` · ${t.company}` : ''}</div>
            <p className="text-xs text-white/60 mt-1.5 italic">"{t.text?.slice(0, 120)}…"</p>
          </div>
          <div className="flex gap-1">
            <button onClick={() => toggle(t)} className={`p-1.5 rounded transition-colors ${t.approved ? 'hover:bg-[#ef5350]/10 text-[#26a69a] hover:text-[#ef5350]' : 'hover:bg-[#26a69a]/10 text-[#8b8fa8] hover:text-[#26a69a]'}`}>
              {t.approved ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            </button>
            <button onClick={() => del(t.id)} className="p-1.5 rounded hover:bg-[#ef5350]/10 text-[#8b8fa8] hover:text-[#ef5350]"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

function FaqsTab() {
  const { data: faqs = [] } = useQuery({ queryKey: ['faqs-admin'], queryFn: () => base44.entities.Faq.list() });
  const qc = useQueryClient();
  const [form, setForm] = useState({ category: 'cuenta', question: '', answer: '', order_index: 0, is_active: true });
  const [editing, setEditing] = useState(null);
  const save = async () => {
    if (!form.question || !form.answer) { toast.error('Pregunta y respuesta requeridas'); return; }
    if (editing) await base44.entities.Faq.update(editing, form);
    else await base44.entities.Faq.create(form);
    qc.invalidateQueries({ queryKey: ['faqs-admin'] });
    toast.success(editing ? 'FAQ actualizado' : 'FAQ creado');
    setForm({ category: 'cuenta', question: '', answer: '', order_index: 0, is_active: true });
    setEditing(null);
  };
  return (
    <div className="space-y-5">
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-white text-sm">{editing ? 'Editar FAQ' : 'Añadir FAQ'}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-[#8b8fa8]">Categoría</Label>
            <Select value={form.category} onValueChange={v => setForm(p => ({...p, category: v}))}>
              <SelectTrigger className="mt-1 bg-[#131722] border-[#1e2130] text-white text-sm"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1e2130] border-[#2a2e3f]">
                {['cuenta','mercado','trading','seguridad','precios'].map(c => <SelectItem key={c} value={c} className="text-white text-sm capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs text-[#8b8fa8]">Orden</Label><Input type="number" value={form.order_index} onChange={e => setForm(p => ({...p, order_index: +e.target.value}))} className="mt-1 bg-[#131722] border-[#1e2130] text-white" /></div>
          <div className="col-span-2"><Label className="text-xs text-[#8b8fa8]">Pregunta</Label><Input value={form.question} onChange={e => setForm(p => ({...p, question: e.target.value}))} className="mt-1 bg-[#131722] border-[#1e2130] text-white" /></div>
          <div className="col-span-2"><Label className="text-xs text-[#8b8fa8]">Respuesta</Label><Textarea value={form.answer} onChange={e => setForm(p => ({...p, answer: e.target.value}))} rows={3} className="mt-1 bg-[#131722] border-[#1e2130] text-white resize-none" /></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={save} className="bg-[#2196F3] hover:bg-[#1976D2] text-xs"><Plus className="h-3.5 w-3.5 mr-1" />{editing ? 'Actualizar' : 'Añadir'}</Button>
          {editing && <Button variant="outline" onClick={() => { setEditing(null); setForm({ category: 'cuenta', question: '', answer: '', order_index: 0, is_active: true }); }} className="border-[#1e2130] text-[#d1d4dc] text-xs">Cancelar</Button>}
        </div>
      </div>
      <div className="space-y-2">
        {faqs.map(f => (
          <div key={f.id} className="flex items-center gap-3 p-3 bg-[#0f1117] border border-[#1e2130] rounded-xl">
            <div className="flex-1">
              <div className="text-sm text-white">{f.question}</div>
              <div className="text-xs text-[#8b8fa8] mt-0.5">{f.category} · orden: {f.order_index}</div>
            </div>
            <button onClick={() => { setEditing(f.id); setForm({ category: f.category, question: f.question, answer: f.answer, order_index: f.order_index || 0, is_active: f.is_active !== false }); }} className="p-1.5 rounded hover:bg-[#1e2130] text-[#8b8fa8] hover:text-white"><Edit3 className="h-3.5 w-3.5" /></button>
            <button onClick={async () => { await base44.entities.Faq.delete(f.id); qc.invalidateQueries({ queryKey: ['faqs-admin'] }); toast.success('Eliminado'); }} className="p-1.5 rounded hover:bg-[#ef5350]/10 text-[#8b8fa8] hover:text-[#ef5350]"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PANEL ───────────────────────────────────────────────────────────────
function PanelContent() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('m4_admin_auth') === '1');
  const [tab, setTab] = useState('settings');

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-[#131722]">
      {/* Header */}
      <div className="bg-[#0a0d14] border-b border-[#1e2130] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2196F3]/20 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-[#2196F3]" />
          </div>
          <div>
            <span className="text-white font-bold text-sm">M4 Markets Latam</span>
            <span className="text-[#8b8fa8] text-xs ml-2">· Panel Admin</span>
          </div>
        </div>
        <button onClick={() => { sessionStorage.removeItem('m4_admin_auth'); setAuthed(false); }}
          className="flex items-center gap-1.5 text-xs text-[#8b8fa8] hover:text-[#ef5350] transition-colors">
          <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
        </button>
      </div>

      {/* Body */}
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
        <div className="flex flex-wrap gap-1 bg-[#0f1117] border border-[#1e2130] rounded-xl p-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.id ? 'bg-[#2196F3]/20 text-[#2196F3]' : 'text-[#8b8fa8] hover:text-white'}`}>
                <Icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            );
          })}
        </div>
        {tab === 'settings' && <SettingsTab />}
        {tab === 'deposits' && <DepositsTab />}
        {tab === 'awards' && <AwardsTab />}
        {tab === 'testimonials' && <TestimonialsTab />}
        {tab === 'faqs' && <FaqsTab />}
      </div>
    </div>
  );
}

export default function AdminPanelPage() {
  return (
    <>
      <PanelContent />
    </>
  );
}
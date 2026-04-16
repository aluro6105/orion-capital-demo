import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ShieldCheck, LogOut, DollarSign, ArrowUpRight, ArrowDownRight,
  CheckCircle2, XCircle, ArrowRight, RefreshCw, Clock, Activity, Archive
} from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_USER = 'm4admin';
const ADMIN_PASS = 'M4Markets@2025!';

const TYPE_LABEL = {
  deposit: 'Depósito', withdrawal: 'Retiro', fee: 'Comisión',
  adjustment: 'Ajuste', trade_buy: 'Compra', trade_sell: 'Venta', virtual_add: 'Adición virtual'
};

// status mapping per tab
// pending  → tab "pendientes"
// completed → tab "activos"
// rejected | cancelled → tab "inactivos"

function statusTab(status) {
  if (status === 'pending') return 'pendientes';
  if (status === 'completed') return 'activos';
  return 'inactivos';
}

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

// ─── ENTRY CARD ───────────────────────────────────────────────────────────────
function EntryCard({ entry, account, tab, onMove, processing }) {
  const isDeposit = entry.type === 'deposit';
  const amountColor = isDeposit ? 'text-[#26a69a]' : 'text-[#ef5350]';
  const iconBg = isDeposit ? 'bg-[#26a69a]/15' : 'bg-[#ef5350]/15';

  return (
    <div className={`flex items-center gap-4 p-4 bg-[#0f1117] rounded-xl border transition-all ${
      tab === 'pendientes' ? 'border-yellow-500/25' :
      tab === 'activos'   ? 'border-[#26a69a]/20'  :
                            'border-[#1e2130]'
    }`}>
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        {isDeposit
          ? <ArrowUpRight className="h-5 w-5 text-[#26a69a]" />
          : <ArrowDownRight className="h-5 w-5 text-[#ef5350]" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white">{TYPE_LABEL[entry.type] || entry.type}</div>
        <div className="text-xs text-[#8b8fa8] truncate">
          {account ? `${account.display_name || account.user_email} · ${account.type}` : entry.account_id}
        </div>
        {entry.method && <div className="text-xs text-white/35 mt-0.5">Método: {entry.method}</div>}
        {entry.notes && <div className="text-xs text-white/35 italic mt-0.5">{entry.notes}</div>}
        <div className="text-[10px] text-[#8b8fa8] mt-1">{new Date(entry.created_date).toLocaleString()}</div>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0 mr-2">
        <div className={`text-base font-black ${amountColor}`}>
          {isDeposit ? '+' : '-'}${entry.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className="text-[10px] text-[#8b8fa8]">{entry.currency || 'USD'}</div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        {tab === 'pendientes' && (
          <>
            <button
              onClick={() => onMove(entry, 'completed')}
              disabled={processing === entry.id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#26a69a]/15 hover:bg-[#26a69a]/25 text-[#26a69a] text-xs font-semibold transition-colors disabled:opacity-50">
              {processing === entry.id
                ? <span className="w-3 h-3 border-2 border-[#26a69a]/30 border-t-[#26a69a] rounded-full animate-spin" />
                : <CheckCircle2 className="h-3.5 w-3.5" />}
              Activar
            </button>
            <button
              onClick={() => onMove(entry, 'rejected')}
              disabled={processing === entry.id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ef5350]/15 hover:bg-[#ef5350]/25 text-[#ef5350] text-xs font-semibold transition-colors disabled:opacity-50">
              <XCircle className="h-3.5 w-3.5" /> Rechazar
            </button>
          </>
        )}
        {tab === 'activos' && (
          <>
            <button
              onClick={() => onMove(entry, 'pending')}
              disabled={processing === entry.id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-400 text-xs font-semibold transition-colors disabled:opacity-50">
              <Clock className="h-3.5 w-3.5" /> Pendiente
            </button>
            <button
              onClick={() => onMove(entry, 'cancelled')}
              disabled={processing === entry.id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8b8fa8]/10 hover:bg-[#8b8fa8]/20 text-[#8b8fa8] text-xs font-semibold transition-colors disabled:opacity-50">
              <Archive className="h-3.5 w-3.5" /> Inactivar
            </button>
          </>
        )}
        {tab === 'inactivos' && (
          <>
            <button
              onClick={() => onMove(entry, 'pending')}
              disabled={processing === entry.id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-400 text-xs font-semibold transition-colors disabled:opacity-50">
              <Clock className="h-3.5 w-3.5" /> Pendiente
            </button>
            <button
              onClick={() => onMove(entry, 'completed')}
              disabled={processing === entry.id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#26a69a]/15 hover:bg-[#26a69a]/25 text-[#26a69a] text-xs font-semibold transition-colors disabled:opacity-50">
              <Activity className="h-3.5 w-3.5" /> Activar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── DEPOSITS SECTION ─────────────────────────────────────────────────────────
function DepositsSection() {
  const [subTab, setSubTab] = useState('pendientes');
  const [processing, setProcessing] = useState(null);

  const { data: ledger = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-ledger'],
    queryFn: () => base44.entities.LedgerEntry.list('-created_date', 200),
    refetchInterval: 20000,
  });
  const { data: accounts = [], refetch: refetchAccounts } = useQuery({
    queryKey: ['admin-broker-accounts'],
    queryFn: () => base44.entities.BrokerAccount.list(),
    refetchInterval: 20000,
  });

  const pending  = ledger.filter(l => statusTab(l.status) === 'pendientes');
  const activos  = ledger.filter(l => statusTab(l.status) === 'activos');
  const inactivos = ledger.filter(l => statusTab(l.status) === 'inactivos');

  const currentList = subTab === 'pendientes' ? pending : subTab === 'activos' ? activos : inactivos;

  const handleMove = async (entry, newStatus) => {
    setProcessing(entry.id);
    const prevStatus = entry.status;

    await base44.entities.LedgerEntry.update(entry.id, { status: newStatus });

    const account = accounts.find(a => a.id === entry.account_id);
    if (account) {
      // Si se activa un depósito que no estaba completed → sumar
      if (newStatus === 'completed' && prevStatus !== 'completed' && entry.type === 'deposit') {
        await base44.entities.BrokerAccount.update(account.id, {
          cash_balance: (account.cash_balance || 0) + entry.amount,
        });
      }
      // Si se activa un retiro que no estaba completed → descontar
      if (newStatus === 'completed' && prevStatus !== 'completed' && entry.type === 'withdrawal') {
        await base44.entities.BrokerAccount.update(account.id, {
          cash_balance: Math.max(0, (account.cash_balance || 0) - entry.amount),
        });
      }
      // Si se mueve de completed a otro estado → revertir balance
      if (prevStatus === 'completed' && newStatus !== 'completed') {
        if (entry.type === 'deposit') {
          await base44.entities.BrokerAccount.update(account.id, {
            cash_balance: Math.max(0, (account.cash_balance || 0) - entry.amount),
          });
        }
        if (entry.type === 'withdrawal') {
          await base44.entities.BrokerAccount.update(account.id, {
            cash_balance: (account.cash_balance || 0) + entry.amount,
          });
        }
      }
    }

    await Promise.all([refetch(), refetchAccounts()]);
    setProcessing(null);

    const labels = { pending: 'Pendientes', completed: 'Activos', rejected: 'Inactivos', cancelled: 'Inactivos' };
    toast.success(`Movido a ${labels[newStatus]}`);
  };

  const SUB_TABS = [
    { id: 'pendientes', label: 'Pendientes', icon: Clock, count: pending.length, color: 'text-yellow-400', activeBg: 'bg-yellow-500/15', activeText: 'text-yellow-400', dot: 'bg-yellow-400' },
    { id: 'activos',   label: 'Activos',    icon: Activity, count: activos.length,  color: 'text-[#26a69a]', activeBg: 'bg-[#26a69a]/15',  activeText: 'text-[#26a69a]',  dot: 'bg-[#26a69a]' },
    { id: 'inactivos', label: 'Inactivos',  icon: Archive, count: inactivos.length, color: 'text-[#8b8fa8]', activeBg: 'bg-[#8b8fa8]/15',  activeText: 'text-[#8b8fa8]',  dot: 'bg-[#8b8fa8]' },
  ];

  if (isLoading) return (
    <div className="flex items-center justify-center py-24 text-[#8b8fa8]">
      <span className="w-5 h-5 border-2 border-[#8b8fa8]/30 border-t-[#8b8fa8] rounded-full animate-spin mr-2" />
      Cargando depósitos…
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Sub-tabs */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 bg-[#0f1117] border border-[#1e2130] rounded-xl p-1 flex-1">
          {SUB_TABS.map(t => {
            const Icon = t.icon;
            const isActive = subTab === t.id;
            return (
              <button key={t.id} onClick={() => setSubTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive ? `${t.activeBg} ${t.activeText}` : 'text-[#8b8fa8] hover:text-white'
                }`}>
                <Icon className="h-4 w-4" />
                {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/10' : 'bg-[#1e2130]'
                }`}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Refresh */}
        <button
          onClick={() => { refetch(); refetchAccounts(); }}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0f1117] border border-[#1e2130] text-xs text-[#8b8fa8] hover:text-white transition-colors">
          <RefreshCw className="h-3.5 w-3.5" />
          Actualizar
        </button>
      </div>

      {/* Description */}
      <div className={`px-4 py-3 rounded-xl border text-xs ${
        subTab === 'pendientes' ? 'bg-yellow-500/5 border-yellow-500/15 text-yellow-400/70' :
        subTab === 'activos'   ? 'bg-[#26a69a]/5 border-[#26a69a]/15 text-[#26a69a]/70' :
                                 'bg-[#8b8fa8]/5 border-[#8b8fa8]/15 text-[#8b8fa8]/70'
      }`}>
        {subTab === 'pendientes' && '⏳ Solicitudes en espera de revisión. Puedes activarlas o rechazarlas.'}
        {subTab === 'activos'    && '✅ Depósitos aprobados y con balance actualizado. Puedes moverlos a pendiente o inactivar.'}
        {subTab === 'inactivos'  && '🚫 Transacciones rechazadas o canceladas. Puedes reactivarlas si es necesario.'}
      </div>

      {/* List */}
      {currentList.length === 0 ? (
        <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-12 text-center">
          <DollarSign className="h-10 w-10 text-[#1e2130] mx-auto mb-3" />
          <p className="text-[#8b8fa8] text-sm">No hay depósitos en esta sección.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {currentList.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              account={accounts.find(a => a.id === entry.account_id)}
              tab={subTab}
              onMove={handleMove}
              processing={processing}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PANEL ───────────────────────────────────────────────────────────────
function PanelContent() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('m4_admin_auth') === '1');

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
        <button
          onClick={() => { sessionStorage.removeItem('m4_admin_auth'); setAuthed(false); }}
          className="flex items-center gap-1.5 text-xs text-[#8b8fa8] hover:text-[#ef5350] transition-colors">
          <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
        </button>
      </div>

      {/* Body */}
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2196F3]/15 border border-[#2196F3]/25 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-[#2196F3]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Gestión de Depósitos</h1>
            <p className="text-xs text-[#8b8fa8]">Administra y mueve depósitos entre estados</p>
          </div>
        </div>

        <DepositsSection />
      </div>
    </div>
  );
}

export default function AdminPanelPage() {
  return <PanelContent />;
}
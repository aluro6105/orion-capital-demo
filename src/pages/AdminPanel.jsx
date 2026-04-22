import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import {
  ShieldCheck, LogOut, DollarSign, ArrowUpRight, ArrowDownRight,
  CheckCircle2, XCircle, ArrowRight, RefreshCw, Clock, Activity, Archive,
  TrendingUp, Edit2, Trash2, Save, X, Users, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

const ADMIN_USER = 'orion_admin';
const ADMIN_PASS = 'OrionAdmin@2026!';

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
          <p className="text-white/40 text-sm">Acceso restringido · Orion Capital</p>
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

const BONUS_OPTIONS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

// ─── CONFIRM BONUS MODAL ──────────────────────────────────────────────────────
function ConfirmBonusModal({ entry, bonusPct, onConfirm, onCancel, processing, extraOnly }) {
  const bonus = entry.amount * (bonusPct / 100);
  const total = entry.amount + bonus;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm bg-[#0f1117] border border-[#2196F3]/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-1">
          {extraOnly ? 'Confirmar bono adicional' : 'Confirmar activación con bono'}
        </h2>
        <p className="text-[#8b8fa8] text-xs mb-5">Revisa los montos antes de confirmar.</p>
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-[#8b8fa8]">Depósito base</span>
            <span className="text-white font-mono">${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#8b8fa8]">Bono ({bonusPct}%)</span>
            <span className="text-[#2196F3] font-mono font-bold">+${bonus.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          {!extraOnly && (
            <div className="border-t border-[#1e2130] pt-2 flex justify-between text-base font-bold">
              <span className="text-white">Total a acreditar</span>
              <span className="text-[#26a69a] font-mono">${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          {extraOnly && (
            <div className="border-t border-[#1e2130] pt-2 flex justify-between text-base font-bold">
              <span className="text-white">Bono a acreditar</span>
              <span className="text-[#2196F3] font-mono">+${bonus.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-[#1e2130] text-[#8b8fa8] text-sm font-semibold hover:text-white transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={processing}
            className="flex-1 py-2.5 rounded-xl bg-[#26a69a] hover:bg-[#2bbbad] text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {processing
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <CheckCircle2 className="h-4 w-4" />}
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ENTRY CARD ───────────────────────────────────────────────────────────────
function EntryCard({ entry, account, tab, onMove, onActivateWithBonus, onApplyExtraBonus, processing }) {
  const isDeposit = entry.type === 'deposit';
  const amountColor = isDeposit ? 'text-[#26a69a]' : 'text-[#ef5350]';
  const iconBg = isDeposit ? 'bg-[#26a69a]/15' : 'bg-[#ef5350]/15';
  const [bonusPct, setBonusPct] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showExtraConfirm, setShowExtraConfirm] = useState(false);

  const handleActivate = () => {
    if (isDeposit && tab === 'pendientes' && bonusPct > 0) {
      setShowConfirm(true);
    } else {
      onMove(entry, 'completed');
    }
  };

  const handleConfirmBonus = async () => {
    await onActivateWithBonus(entry, bonusPct);
    setShowConfirm(false);
    setBonusPct(0);
  };

  const handleConfirmExtraBonus = async () => {
    await onApplyExtraBonus(entry, bonusPct);
    setShowExtraConfirm(false);
    setBonusPct(0);
  };

  const showBonusBar = entry.type === 'deposit' && (tab === 'pendientes' || tab === 'activos');

  return (
    <>
      {showConfirm && (
        <ConfirmBonusModal
          entry={entry} bonusPct={bonusPct}
          onConfirm={handleConfirmBonus}
          onCancel={() => setShowConfirm(false)}
          processing={processing === entry.id}
          extraOnly={false}
        />
      )}
      {showExtraConfirm && (
        <ConfirmBonusModal
          entry={entry} bonusPct={bonusPct}
          onConfirm={handleConfirmExtraBonus}
          onCancel={() => setShowExtraConfirm(false)}
          processing={processing === entry.id}
          extraOnly={true}
        />
      )}
      <div className={`p-4 bg-[#0f1117] rounded-xl border transition-all ${
        tab === 'pendientes' ? 'border-yellow-500/25' :
        tab === 'activos'   ? 'border-[#26a69a]/20'  :
                              'border-[#1e2130]'
      }`}>
        <div className="flex items-center gap-4">
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
                  onClick={handleActivate}
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

        {/* Bonus selector — depósitos pendientes Y activos */}
        {entry.type === 'deposit' && tab === 'pendientes' && (
          <div className="mt-3 pt-3 border-t border-[#1e2130] flex items-center gap-3">
            <span className="text-xs text-[#8b8fa8] flex-shrink-0">Bono:</span>
            <select
              value={bonusPct}
              onChange={e => setBonusPct(Number(e.target.value))}
              className="flex-1 bg-[#131722] border border-[#1e2130] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#2196F3] transition-colors"
            >
              {BONUS_OPTIONS.map(pct => (
                <option key={pct} value={pct}>{pct === 0 ? 'Sin bono' : `${pct}% (+$${(entry.amount * pct / 100).toFixed(2)})`}</option>
              ))}
            </select>
            {bonusPct > 0 && (
              <span className="text-xs font-bold text-[#2196F3] flex-shrink-0">
                Total: ${(entry.amount * (1 + bonusPct / 100)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
        )}
        {entry.type === 'deposit' && tab === 'activos' && (
          <div className="mt-3 pt-3 border-t border-[#1e2130] flex items-center gap-3">
            <span className="text-xs text-[#8b8fa8] flex-shrink-0">Bono adicional:</span>
            <select
              value={bonusPct}
              onChange={e => setBonusPct(Number(e.target.value))}
              className="flex-1 bg-[#131722] border border-[#1e2130] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#2196F3] transition-colors"
            >
              {BONUS_OPTIONS.map(pct => (
                <option key={pct} value={pct}>{pct === 0 ? 'Sin bono' : `${pct}% (+$${(entry.amount * pct / 100).toFixed(2)})`}</option>
              ))}
            </select>
            {bonusPct > 0 && (
              <button
                onClick={() => setShowExtraConfirm(true)}
                disabled={processing === entry.id}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2196F3]/15 hover:bg-[#2196F3]/25 text-[#2196F3] text-xs font-semibold transition-colors disabled:opacity-50 flex-shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" /> Aplicar
              </button>
            )}
          </div>
        )}
      </div>
    </>
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
      if (newStatus === 'completed' && prevStatus !== 'completed' && entry.type === 'deposit') {
        await base44.entities.BrokerAccount.update(account.id, {
          cash_balance: (account.cash_balance || 0) + entry.amount,
        });
      }
      if (newStatus === 'completed' && prevStatus !== 'completed' && entry.type === 'withdrawal') {
        await base44.entities.BrokerAccount.update(account.id, {
          cash_balance: Math.max(0, (account.cash_balance || 0) - entry.amount),
        });
      }
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

  const handleApplyExtraBonus = async (entry, bonusPct) => {
    setProcessing(entry.id);
    const bonus = entry.amount * (bonusPct / 100);

    // Solo crear entrada de bono y acreditar, sin tocar el depósito original
    await base44.entities.LedgerEntry.create({
      account_id: entry.account_id,
      user_id: entry.user_id,
      type: 'virtual_add',
      amount: bonus,
      currency: entry.currency || 'USD',
      status: 'completed',
      notes: `Bono adicional ${bonusPct}% sobre depósito $${entry.amount.toFixed(2)}`,
    });

    const account = accounts.find(a => a.id === entry.account_id);
    if (account) {
      await base44.entities.BrokerAccount.update(account.id, {
        cash_balance: (account.cash_balance || 0) + bonus,
      });
    }

    await Promise.all([refetch(), refetchAccounts()]);
    setProcessing(null);
    toast.success(`Bono adicional de $${bonus.toFixed(2)} acreditado`);
  };

  const handleActivateWithBonus = async (entry, bonusPct) => {
    setProcessing(entry.id);
    const bonus = entry.amount * (bonusPct / 100);
    const total = entry.amount + bonus;

    // Activar el depósito original
    await base44.entities.LedgerEntry.update(entry.id, { status: 'completed' });

    // Crear entrada de ledger para el bono
    if (bonus > 0) {
      await base44.entities.LedgerEntry.create({
        account_id: entry.account_id,
        user_id: entry.user_id,
        type: 'virtual_add',
        amount: bonus,
        currency: entry.currency || 'USD',
        status: 'completed',
        notes: `Bono del ${bonusPct}% sobre depósito $${entry.amount.toFixed(2)}`,
      });
    }

    // Acreditar el total (depósito + bono) al balance
    const account = accounts.find(a => a.id === entry.account_id);
    if (account) {
      await base44.entities.BrokerAccount.update(account.id, {
        cash_balance: (account.cash_balance || 0) + total,
      });
    }

    await Promise.all([refetch(), refetchAccounts()]);
    setProcessing(null);
    toast.success(`Activado con bono ${bonusPct}% · Total acreditado: $${total.toFixed(2)}`);
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
              onActivateWithBonus={handleActivateWithBonus}
              onApplyExtraBonus={handleApplyExtraBonus}
              processing={processing}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── EDIT TRADE MODAL ─────────────────────────────────────────────────────────
function EditTradeModal({ trade, onSave, onCancel, saving }) {
  const [pnl, setPnl] = useState(String(trade.realized_pnl ?? 0));
  const [qty, setQty] = useState(String(trade.qty ?? 0));
  const [price, setPrice] = useState(String(trade.price ?? 0));

  const handleSave = () => {
    onSave(trade.id, {
      realized_pnl: parseFloat(pnl) || 0,
      qty: parseFloat(qty) || 0,
      price: parseFloat(price) || 0,
      total: (parseFloat(qty) || 0) * (parseFloat(price) || 0),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm bg-[#0f1117] border border-[#2196F3]/30 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-1">Editar Orden</h2>
        <p className="text-[#8b8fa8] text-xs mb-5">{trade.symbol} · {trade.side?.toUpperCase()} · {new Date(trade.created_date).toLocaleDateString()}</p>
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs text-[#8b8fa8] uppercase tracking-wide mb-1">Cantidad</label>
            <input type="number" value={qty} onChange={e => setQty(e.target.value)}
              className="w-full px-3 py-2 bg-[#131722] border border-[#1e2130] rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[#2196F3]" />
          </div>
          <div>
            <label className="block text-xs text-[#8b8fa8] uppercase tracking-wide mb-1">Precio</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-[#131722] border border-[#1e2130] rounded-lg text-white text-sm font-mono focus:outline-none focus:border-[#2196F3]" />
          </div>
          <div>
            <label className="block text-xs text-[#8b8fa8] uppercase tracking-wide mb-1">G/P Realizada</label>
            <input type="number" value={pnl} onChange={e => setPnl(e.target.value)}
              className="w-full px-3 py-2 bg-[#131722] border border-[#2196F3]/40 rounded-lg text-[#26a69a] text-sm font-mono font-bold focus:outline-none focus:border-[#2196F3]" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-[#1e2130] text-[#8b8fa8] text-sm font-semibold hover:text-white transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ACCOUNT TRADES SECTION ───────────────────────────────────────────────────
function AccountTradesPanel({ account, onClose }) {
  const queryClient = useQueryClient();
  const [editingTrade, setEditingTrade] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingPnl, setEditingPnl] = useState(false);
  const [unrealizedPnl, setUnrealizedPnl] = useState('0');

  const { data: trades = [], refetch } = useQuery({
    queryKey: ['admin-trades', account.id],
    queryFn: () => base44.entities.BrokerTrade.filter({ account_id: account.id }, '-created_date', 100),
  });

  const totalRealizedPnl = trades.reduce((s, t) => s + (t.realized_pnl || 0), 0);

  const handleSaveTrade = async (id, updates) => {
    setSaving(true);

    // Calcular diferencia de PnL para reflejarla en el balance
    const originalTrade = trades.find(t => t.id === id);
    const oldPnl = originalTrade?.realized_pnl || 0;
    const newPnl = updates.realized_pnl ?? oldPnl;
    const pnlDiff = newPnl - oldPnl;

    await base44.entities.BrokerTrade.update(id, updates);

    // Actualizar cash_balance con la diferencia de PnL
    if (pnlDiff !== 0) {
      const freshAccounts = await base44.entities.BrokerAccount.filter({ id: account.id });
      const freshAccount = freshAccounts[0];
      if (freshAccount) {
        await base44.entities.BrokerAccount.update(account.id, {
          cash_balance: (freshAccount.cash_balance || 0) + pnlDiff,
        });
      }
    }

    await refetch();
    setSaving(false);
    setEditingTrade(null);
    toast.success(`Orden actualizada${pnlDiff !== 0 ? ` · Balance ajustado ${pnlDiff >= 0 ? '+' : ''}$${pnlDiff.toFixed(2)}` : ''}`);
  };

  const handleDeleteTrade = async (trade) => {
    if (!confirm(`¿Eliminar orden ${trade.symbol} ${trade.side}?`)) return;
    setDeletingId(trade.id);

    // Revertir el PnL de esta orden del balance
    const pnlToRevert = trade.realized_pnl || 0;
    await base44.entities.BrokerTrade.delete(trade.id);

    if (pnlToRevert !== 0) {
      const freshAccounts = await base44.entities.BrokerAccount.filter({ id: account.id });
      const freshAccount = freshAccounts[0];
      if (freshAccount) {
        await base44.entities.BrokerAccount.update(account.id, {
          cash_balance: (freshAccount.cash_balance || 0) - pnlToRevert,
        });
      }
    }

    await refetch();
    setDeletingId(null);
    toast.success(`Orden eliminada${pnlToRevert !== 0 ? ` · Balance ajustado -$${pnlToRevert.toFixed(2)}` : ''}`);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
      {editingTrade && (
        <EditTradeModal
          trade={editingTrade}
          onSave={handleSaveTrade}
          onCancel={() => setEditingTrade(null)}
          saving={saving}
        />
      )}
      <div className="w-full max-w-4xl bg-[#0f1117] border border-[#1e2130] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2130]">
          <div>
            <h2 className="text-white font-bold text-base">{account.display_name || account.user_email}</h2>
            <p className="text-xs text-[#8b8fa8]">{account.type} · Saldo: <span className="text-white font-mono">${(account.cash_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#1e2130] text-[#8b8fa8] hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* PNL summary */}
        <div className="px-6 py-4 border-b border-[#1e2130] flex items-center gap-6">
          <div className="flex-1">
            <div className="text-xs text-[#8b8fa8] uppercase tracking-wide mb-1">G/P Realizada Total</div>
            <div className={`text-xl font-black font-mono ${totalRealizedPnl >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
              {totalRealizedPnl >= 0 ? '+' : ''}${totalRealizedPnl.toFixed(2)}
            </div>
            <div className="text-xs text-[#8b8fa8]">{trades.length} operaciones totales</div>
          </div>
        </div>

        {/* Trades table */}
        <div className="flex-1 overflow-auto">
          {trades.length === 0 ? (
            <div className="p-12 text-center text-[#8b8fa8] text-sm">No hay órdenes registradas.</div>
          ) : (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-[#0a0d14]">
                <tr className="text-[#8b8fa8] uppercase text-[10px]">
                  <th className="text-left px-4 py-3 font-medium">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium">Símbolo</th>
                  <th className="text-left px-4 py-3 font-medium">Lado</th>
                  <th className="text-right px-4 py-3 font-medium">Cant.</th>
                  <th className="text-right px-4 py-3 font-medium">Precio</th>
                  <th className="text-right px-4 py-3 font-medium">Total</th>
                  <th className="text-right px-4 py-3 font-medium">G/P Real.</th>
                  <th className="text-center px-4 py-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {trades.map(t => {
                  const pnl = t.realized_pnl || 0;
                  return (
                    <tr key={t.id} className="border-t border-[#1e2130] hover:bg-[#1e222d]/50">
                      <td className="px-4 py-3 text-[#8b8fa8] font-mono whitespace-nowrap">
                        {new Date(t.created_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 font-bold text-white">{t.symbol}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.side === 'buy' ? 'bg-[#26a69a]/20 text-[#26a69a]' : 'bg-[#ef5350]/20 text-[#ef5350]'}`}>
                          {t.side === 'buy' ? 'COMPRA' : 'VENTA'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-[#d1d4dc] font-mono">{t.qty}</td>
                      <td className="px-4 py-3 text-right text-[#d1d4dc] font-mono">{t.price?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-[#d1d4dc] font-mono">${t.total?.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right font-mono font-bold ${pnl >= 0 ? 'text-[#26a69a]' : 'text-[#ef5350]'}`}>
                        {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setEditingTrade(t)}
                            className="p-1.5 rounded bg-[#2196F3]/15 hover:bg-[#2196F3]/30 text-[#2196F3] transition-colors" title="Editar">
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button onClick={() => handleDeleteTrade(t)}
                            disabled={deletingId === t.id}
                            className="p-1.5 rounded bg-[#ef5350]/15 hover:bg-[#ef5350]/30 text-[#ef5350] transition-colors disabled:opacity-50" title="Eliminar">
                            {deletingId === t.id
                              ? <span className="w-3 h-3 border border-[#ef5350]/30 border-t-[#ef5350] rounded-full animate-spin block" />
                              : <Trash2 className="h-3 w-3" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ACCOUNTS SECTION ─────────────────────────────────────────────────────────
function AccountsSection() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [editingAccount, setEditingAccount] = useState(null);
  const [savingAccount, setSavingAccount] = useState(false);

  const { data: accounts = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-all-accounts'],
    queryFn: () => base44.entities.BrokerAccount.list('-created_date', 200),
    refetchInterval: 30000,
  });

  const handleEditBalance = (acc) => {
    setEditingAccount({ ...acc, _newBalance: String(acc.cash_balance || 0) });
  };

  const handleSaveBalance = async () => {
    if (!editingAccount) return;
    setSavingAccount(true);
    await base44.entities.BrokerAccount.update(editingAccount.id, {
      cash_balance: parseFloat(editingAccount._newBalance) || 0,
    });
    await refetch();
    setSavingAccount(false);
    setEditingAccount(null);
    toast.success('Balance actualizado');
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-24 text-[#8b8fa8]">
      <span className="w-5 h-5 border-2 border-[#8b8fa8]/30 border-t-[#8b8fa8] rounded-full animate-spin mr-2" />
      Cargando cuentas…
    </div>
  );

  return (
    <div className="space-y-4">
      {selectedAccount && (
        <AccountTradesPanel account={selectedAccount} onClose={() => setSelectedAccount(null)} />
      )}
      {editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm bg-[#0f1117] border border-[#2196F3]/30 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-white font-bold text-lg mb-1">Editar Saldo</h2>
            <p className="text-[#8b8fa8] text-xs mb-5">{editingAccount.display_name || editingAccount.user_email}</p>
            <div className="mb-5">
              <label className="block text-xs text-[#8b8fa8] uppercase tracking-wide mb-1">Nuevo saldo (cash_balance)</label>
              <input type="number" value={editingAccount._newBalance}
                onChange={e => setEditingAccount(a => ({ ...a, _newBalance: e.target.value }))}
                className="w-full px-3 py-2 bg-[#131722] border border-[#2196F3]/40 rounded-lg text-white text-sm font-mono font-bold focus:outline-none focus:border-[#2196F3]" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingAccount(null)} className="flex-1 py-2.5 rounded-xl bg-[#1e2130] text-[#8b8fa8] text-sm font-semibold hover:text-white transition-colors">
                Cancelar
              </button>
              <button onClick={handleSaveBalance} disabled={savingAccount}
                className="flex-1 py-2.5 rounded-xl bg-[#2196F3] hover:bg-[#1976D2] text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {savingAccount ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8b8fa8]">{accounts.length} cuentas encontradas</p>
        <button onClick={refetch} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0f1117] border border-[#1e2130] text-xs text-[#8b8fa8] hover:text-white transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Actualizar
        </button>
      </div>

      <div className="space-y-2">
        {accounts.map(acc => (
          <div key={acc.id} className={`p-4 bg-[#0f1117] rounded-xl border border-[#1e2130] flex items-center gap-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${acc.type === 'DEMO' ? 'bg-amber-500/15' : 'bg-[#26a69a]/15'}`}>
              <TrendingUp className={`h-5 w-5 ${acc.type === 'DEMO' ? 'text-amber-400' : 'text-[#26a69a]'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{acc.display_name || acc.user_email}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${acc.type === 'DEMO' ? 'bg-amber-500/15 text-amber-400' : 'bg-[#26a69a]/15 text-[#26a69a]'}`}>{acc.type}</span>
                <span className="text-xs text-[#8b8fa8]">{acc.status}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-base font-black text-white font-mono">${(acc.cash_balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-[10px] text-[#8b8fa8]">saldo actual</div>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button onClick={() => setSelectedAccount(acc)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2196F3]/15 hover:bg-[#2196F3]/25 text-[#2196F3] text-xs font-semibold transition-colors">
                <Edit2 className="h-3.5 w-3.5" /> Órdenes
              </button>
              <button onClick={() => handleEditBalance(acc)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#8b8fa8]/10 hover:bg-[#8b8fa8]/20 text-[#8b8fa8] text-xs font-semibold transition-colors">
                <DollarSign className="h-3.5 w-3.5" /> Saldo
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PANEL ───────────────────────────────────────────────────────────────
function PanelContent() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('m4_admin_auth') === '1');
  const [mainTab, setMainTab] = useState('depositos');

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const MAIN_TABS = [
    { id: 'depositos', label: 'Depósitos', icon: DollarSign },
    { id: 'cuentas', label: 'Cuentas & Órdenes', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#131722]">
      {/* Header */}
      <div className="bg-[#0a0d14] border-b border-[#1e2130] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2196F3]/20 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-[#2196F3]" />
          </div>
          <div>
            <span className="text-white font-bold text-sm">Orion Capital</span>
            <span className="text-[#8b8fa8] text-xs ml-2">· Panel Admin</span>
          </div>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem('m4_admin_auth'); setAuthed(false); }}
          className="flex items-center gap-1.5 text-xs text-[#8b8fa8] hover:text-[#ef5350] transition-colors">
          <LogOut className="h-3.5 w-3.5" /> Cerrar sesión
        </button>
      </div>

      {/* Main tabs */}
      <div className="bg-[#0a0d14] border-b border-[#1e2130] px-6">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {MAIN_TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setMainTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
                  mainTab === t.id
                    ? 'border-[#2196F3] text-[#2196F3]'
                    : 'border-transparent text-[#8b8fa8] hover:text-white'
                }`}>
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {mainTab === 'depositos' && (
          <>
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
          </>
        )}
        {mainTab === 'cuentas' && (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#26a69a]/15 border border-[#26a69a]/25 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-[#26a69a]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Cuentas & Órdenes</h1>
                <p className="text-xs text-[#8b8fa8]">Edita G/P y órdenes de cualquier cuenta</p>
              </div>
            </div>
            <AccountsSection />
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminPanelPage() {
  return <PanelContent />;
}
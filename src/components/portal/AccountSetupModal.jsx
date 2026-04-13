import React, { useState } from 'react';
import { FlaskConical, Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount } from './AccountContext';
import { useQueryClient } from '@tanstack/react-query';

export default function AccountSetupModal({ onDone }) {
  const [step, setStep] = useState('welcome');
  const [choice, setChoice] = useState('DEMO');
  const { createDemoAccount, createRealAccount, switchAccount } = useAccount();
  const queryClient = useQueryClient();

  const handleContinue = async () => {
    setStep('creating');
    await createDemoAccount();
    if (choice === 'REAL') {
      await createRealAccount();
      switchAccount('REAL');
    } else {
      switchAccount('DEMO');
    }
    queryClient.invalidateQueries({ queryKey: ['broker-accounts'] });
    onDone?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0f1117] border border-[#1e2130] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2196F3]/20 to-[#9C27B0]/20 px-6 pt-6 pb-4 border-b border-[#1e2130]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2196F3] to-[#1565C0] flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Bienvenido a NEXUS</h2>
              <p className="text-xs text-[#8b8fa8]">Selecciona cómo quieres comenzar a operar</p>
            </div>
          </div>
        </div>

        {step === 'welcome' && (
          <div className="p-6 space-y-4">
            {/* DEMO option */}
            <button
              onClick={() => setChoice('DEMO')}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                choice === 'DEMO' ? 'border-amber-500 bg-amber-500/10' : 'border-[#1e2130] hover:border-[#2a2e3f]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">Cuenta Demo</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">DEMO</span>
                  </div>
                  <p className="text-xs text-[#8b8fa8] mt-0.5">Practica con $10,000 virtuales. Sin necesidad de verificación.</p>
                </div>
                {choice === 'DEMO' && <CheckCircle2 className="h-5 w-5 text-amber-400 flex-shrink-0" />}
              </div>
            </button>

            {/* REAL option */}
            <button
              onClick={() => setChoice('REAL')}
              className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                choice === 'REAL' ? 'border-[#2196F3] bg-[#2196F3]/10' : 'border-[#1e2130] hover:border-[#2a2e3f]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#2196F3]/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-[#2196F3]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">Cuenta Real</span>
                    <span className="text-[10px] bg-[#2196F3]/20 text-[#2196F3] px-1.5 py-0.5 rounded font-bold">REAL</span>
                  </div>
                  <p className="text-xs text-[#8b8fa8] mt-0.5">Abre una cuenta real. Requiere verificación de identidad (KYC). Depósitos y retiros disponibles.</p>
                </div>
                {choice === 'REAL' && <CheckCircle2 className="h-5 w-5 text-[#2196F3] flex-shrink-0" />}
              </div>
            </button>

            <div className="bg-[#1e2130] rounded-lg p-3 text-xs text-[#8b8fa8]">
              <strong className="text-[#d1d4dc]">Nota:</strong> La cuenta Demo se creará siempre. Puedes cambiar entre DEMO y REAL en cualquier momento desde la barra superior.
            </div>

            <Button
              onClick={handleContinue}
              className="w-full bg-[#2196F3] hover:bg-[#1976D2] text-white font-semibold"
            >
              Comenzar <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {step === 'creating' && (
          <div className="p-6 flex flex-col items-center gap-4 py-12">
            <div className="w-12 h-12 rounded-full border-2 border-[#2196F3] border-t-transparent animate-spin" />
            <p className="text-[#8b8fa8] text-sm">Configurando tu cuenta…</p>
          </div>
        )}
      </div>
    </div>
  );
}
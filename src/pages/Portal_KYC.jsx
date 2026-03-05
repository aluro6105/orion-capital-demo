import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PortalLayout from '../components/portal/PortalLayout';
import { useAccount } from '../components/portal/AccountContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Clock, AlertTriangle, Shield, Upload, User, FileText, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const STEPS = [
  { id: 'personal', label: 'Personal Data', icon: User },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'questionnaire', label: 'Questionnaire', icon: HelpCircle },
];

function KYCContent() {
  const { activeAccount, activeType } = useAccount();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const { data: kycList = [] } = useQuery({
    queryKey: ['kyc-profile', activeAccount?.id],
    queryFn: () => base44.entities.KycProfile.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });
  const kyc = kycList[0];

  const { data: docs = [] } = useQuery({
    queryKey: ['kyc-docs', activeAccount?.id],
    queryFn: () => base44.entities.KycDocument.filter({ account_id: activeAccount.id }),
    enabled: !!activeAccount?.id,
  });

  const [form, setForm] = useState({
    legal_first_name: '', legal_last_name: '', date_of_birth: '', nationality: '',
    country_of_residence: '', address_line1: '', address_line2: '', city: '',
    postal_code: '', phone: '', employment_status: '', annual_income: '',
    trading_experience: 'beginner', risk_tolerance: 'medium',
  });

  useEffect(() => {
    if (kyc) {
      setForm(prev => ({
        ...prev,
        legal_first_name: kyc.legal_first_name || '',
        legal_last_name: kyc.legal_last_name || '',
        date_of_birth: kyc.date_of_birth || '',
        nationality: kyc.nationality || '',
        country_of_residence: kyc.country_of_residence || '',
        address_line1: kyc.address_line1 || '',
        address_line2: kyc.address_line2 || '',
        city: kyc.city || '',
        postal_code: kyc.postal_code || '',
        phone: kyc.phone || '',
        employment_status: kyc.employment_status || '',
        annual_income: kyc.annual_income || '',
        trading_experience: kyc.trading_experience || 'beginner',
        risk_tolerance: kyc.risk_tolerance || 'medium',
      }));
    }
  }, [kyc]);

  if (activeType !== 'REAL') {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-center">
          <Shield className="h-8 w-8 text-amber-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">DEMO Account</h2>
          <p className="text-sm text-[#8b8fa8]">KYC verification is only required for Real accounts. Demo accounts can trade without verification.</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    not_started: { label: 'Not Started', color: 'text-[#8b8fa8]', bg: 'bg-[#8b8fa8]/10', icon: Shield },
    in_review: { label: 'Under Review', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: Clock },
    approved: { label: 'Approved', color: 'text-[#26a69a]', bg: 'bg-[#26a69a]/10', icon: CheckCircle2 },
    action_required: { label: 'Action Required', color: 'text-[#ef5350]', bg: 'bg-[#ef5350]/10', icon: AlertTriangle },
  };
  const status = kyc?.status || 'not_started';
  const cfg = statusConfig[status];
  const Icon = cfg.icon;

  const handleSavePersonal = async () => {
    setSaving(true);
    if (kyc) {
      await base44.entities.KycProfile.update(kyc.id, { ...form });
    } else {
      await base44.entities.KycProfile.create({ account_id: activeAccount.id, user_id: activeAccount.user_id, ...form, status: 'not_started' });
    }
    queryClient.invalidateQueries({ queryKey: ['kyc-profile', activeAccount.id] });
    toast.success('Personal data saved');
    setSaving(false);
    setStep(1);
  };

  const handleSubmitKYC = async () => {
    setSaving(true);
    const profileId = kyc?.id;
    if (profileId) {
      await base44.entities.KycProfile.update(profileId, { status: 'in_review', submitted_at: new Date().toISOString() });
    }
    await base44.entities.Notification.create({
      user_id: activeAccount.user_id, type: 'kyc', title: 'KYC Submitted',
      message: 'Your identity verification is under review. We will notify you within 1-2 business days.',
      read: false,
    });
    queryClient.invalidateQueries({ queryKey: ['kyc-profile', activeAccount.id] });
    toast.success('KYC submitted for review!');
    setSaving(false);
  };

  const handleUploadDoc = async (docType, file) => {
    if (!file) return;
    setUploadingDoc(docType);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    const existing = docs.find(d => d.doc_type === docType);
    if (existing) {
      await base44.entities.KycDocument.update(existing.id, { file_url, file_name: file.name, status: 'pending' });
    } else {
      await base44.entities.KycDocument.create({ account_id: activeAccount.id, user_id: activeAccount.user_id, doc_type: docType, file_url, file_name: file.name, status: 'pending' });
    }
    queryClient.invalidateQueries({ queryKey: ['kyc-docs', activeAccount.id] });
    toast.success(`${docType.replace('_', ' ')} uploaded`);
    setUploadingDoc(null);
  };

  const docTypes = [
    { type: 'passport', label: 'Passport or National ID', desc: 'Clear photo of your document (front and back if applicable)' },
    { type: 'proof_of_address', label: 'Proof of Address', desc: 'Bank statement or utility bill (less than 3 months old)' },
    { type: 'selfie', label: 'Selfie with ID', desc: 'A photo of yourself holding your identity document' },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">Identity Verification</h1>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${cfg.bg}`}>
          <Icon className={`h-4 w-4 ${cfg.color}`} />
          <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>

      {status === 'approved' && (
        <div className="bg-[#26a69a]/10 border border-[#26a69a]/30 rounded-xl p-5 flex items-center gap-4">
          <CheckCircle2 className="h-8 w-8 text-[#26a69a] flex-shrink-0" />
          <div>
            <div className="text-white font-semibold">Verification Complete</div>
            <div className="text-sm text-[#8b8fa8]">Your account is fully verified. All features are unlocked.</div>
          </div>
        </div>
      )}

      {status !== 'approved' && (
        <>
          {/* Steps */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => {
              const StepIcon = s.icon;
              return (
                <React.Fragment key={s.id}>
                  <button onClick={() => setStep(i)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${step === i ? 'bg-[#2196F3]/20 text-[#2196F3]' : i < step ? 'text-[#26a69a]' : 'text-[#8b8fa8]'}`}>
                    <StepIcon className="h-3.5 w-3.5" /> {s.label}
                  </button>
                  {i < STEPS.length - 1 && <div className="h-px flex-1 bg-[#1e2130]" />}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step 0: Personal Data */}
          {step === 0 && (
            <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ['legal_first_name', 'First Name (Legal)'], ['legal_last_name', 'Last Name (Legal)'],
                  ['date_of_birth', 'Date of Birth', 'date'], ['phone', 'Phone Number'],
                  ['nationality', 'Nationality'], ['country_of_residence', 'Country of Residence'],
                  ['address_line1', 'Address Line 1'], ['address_line2', 'Address Line 2'],
                  ['city', 'City'], ['postal_code', 'Postal Code'],
                  ['employment_status', 'Employment Status'], ['annual_income', 'Annual Income Range'],
                ].map(([field, lbl, type]) => (
                  <div key={field}>
                    <Label className="text-xs text-[#8b8fa8] uppercase">{lbl}</Label>
                    <Input type={type || 'text'} value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                      className="mt-1 bg-[#131722] border-[#1e2130] text-white text-sm" />
                  </div>
                ))}
              </div>
              <Button onClick={handleSavePersonal} disabled={saving} className="bg-[#2196F3] hover:bg-[#1976D2]">
                Save & Continue →
              </Button>
            </div>
          )}

          {/* Step 1: Documents */}
          {step === 1 && (
            <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white mb-4">Upload Documents</h2>
              {docTypes.map(dt => {
                const uploaded = docs.find(d => d.doc_type === dt.type);
                return (
                  <div key={dt.type} className="border border-[#1e2130] rounded-xl p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-white">{dt.label}</div>
                      <div className="text-xs text-[#8b8fa8]">{dt.desc}</div>
                      {uploaded && <div className="text-xs text-[#26a69a] mt-1">✓ {uploaded.file_name}</div>}
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*,application/pdf" className="hidden"
                        onChange={e => handleUploadDoc(dt.type, e.target.files?.[0])} />
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        uploadingDoc === dt.type ? 'bg-[#1e2130] text-[#8b8fa8]' :
                        uploaded ? 'bg-[#26a69a]/20 text-[#26a69a]' : 'bg-[#2196F3]/20 text-[#2196F3] hover:bg-[#2196F3]/30'
                      }`}>
                        <Upload className="h-3.5 w-3.5" />
                        {uploadingDoc === dt.type ? 'Uploading…' : uploaded ? 'Replace' : 'Upload'}
                      </div>
                    </label>
                  </div>
                );
              })}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)} className="border-[#1e2130] text-[#d1d4dc]">← Back</Button>
                <Button onClick={() => setStep(2)} className="bg-[#2196F3] hover:bg-[#1976D2]">Save & Continue →</Button>
              </div>
            </div>
          )}

          {/* Step 2: Questionnaire */}
          {step === 2 && (
            <div className="bg-[#0f1117] border border-[#1e2130] rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white mb-4">Trading Experience Questionnaire</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-[#8b8fa8] uppercase">Trading Experience Level</Label>
                  <Select value={form.trading_experience} onValueChange={v => setForm(p => ({ ...p, trading_experience: v }))}>
                    <SelectTrigger className="mt-1 bg-[#131722] border-[#1e2130] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1e2130] border-[#2a2e3f]">
                      {['none', 'beginner', 'intermediate', 'advanced'].map(v => <SelectItem key={v} value={v} className="text-[#d1d4dc] text-sm capitalize">{v.charAt(0).toUpperCase() + v.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-[#8b8fa8] uppercase">Risk Tolerance</Label>
                  <Select value={form.risk_tolerance} onValueChange={v => setForm(p => ({ ...p, risk_tolerance: v }))}>
                    <SelectTrigger className="mt-1 bg-[#131722] border-[#1e2130] text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#1e2130] border-[#2a2e3f]">
                      {['low', 'medium', 'high'].map(v => <SelectItem key={v} value={v} className="text-[#d1d4dc] text-sm capitalize">{v.charAt(0).toUpperCase() + v.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-[#1e2130] rounded-lg p-4 text-xs text-[#8b8fa8]">
                By submitting, you confirm all information provided is accurate. False information may result in account suspension.
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="border-[#1e2130] text-[#d1d4dc]">← Back</Button>
                <Button onClick={handleSubmitKYC} disabled={saving || !kyc} className="bg-[#26a69a] hover:bg-[#26a69a]/90">
                  {saving ? 'Submitting…' : 'Submit for Verification'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PortalKYCPage() {
  return <PortalLayout currentPageName="Portal_KYC"><KYCContent /></PortalLayout>;
}
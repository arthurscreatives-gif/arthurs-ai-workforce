'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  Mail,
  User as UserIcon,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import { User, Workspace } from '@/types/workspace';
import { LegalTab } from '@/components/LegalPagesModal';

interface CustomerAuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'register';
  initialPlanId?: string;
  onClose: () => void;
  onAuthSuccess: (user: User, workspace: Workspace, token: string) => void;
  onOpenPolicy?: (tab: LegalTab) => void;
}

const PLANS = [
  { id: 'starter', name: 'Starter', price: '$49/mo', desc: '1 Location • Drift Audits • Repairs' },
  { id: 'growth', name: 'Growth', price: '$99/mo', desc: '3 Locations • Content Engine • Alerts', popular: true },
  { id: 'enterprise', name: 'Enterprise', price: '$199/mo', desc: '10 Locations • Multi-Agent • Full Queue' },
];

export function CustomerAuthModal({
  isOpen,
  initialMode,
  initialPlanId = 'starter',
  onClose,
  onAuthSuccess,
  onOpenPolicy,
}: CustomerAuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlanId);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);
  if (prevInitialMode !== initialMode) {
    setPrevInitialMode(initialMode);
    setMode(initialMode);
  }

  const [prevInitialPlanId, setPrevInitialPlanId] = useState(initialPlanId);
  if (prevInitialPlanId !== initialPlanId) {
    setPrevInitialPlanId(initialPlanId);
    if (initialPlanId) {
      setSelectedPlan(initialPlanId);
    }
  }

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      onAuthSuccess(data.user, data.workspace, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!termsAccepted) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy to activate your account.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName,
          businessName,
          planId: selectedPlan,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      onAuthSuccess(data.user, data.workspace, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-md bg-[#0b0f26] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Authentication Dialog"
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#00F3FF] p-[2px] mx-auto shadow-lg shadow-[#00F3FF]/20">
            <div className="w-full h-full bg-[#0b0f26] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#00F3FF]" />
            </div>
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Sign In to Workspace' : 'Select Plan & Start Trial'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'signin'
              ? 'Enter your account email to access your private business control center.'
              : 'Choose your package to launch your 14-day free trial with zero mock data.'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-[#111738] p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none ${
              mode === 'signin'
                ? 'bg-[#18204c] text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none ${
              mode === 'register'
                ? 'bg-[#18204c] text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Start Free Trial
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div
            role="alert"
            className="p-3 bg-rose-500/10 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start gap-2"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="auth-email-signin" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Email</span>
              </label>
              <input
                id="auth-email-signin"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-bold text-xs rounded-xl shadow-lg shadow-[#00F3FF]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
            >
              <span>{isLoading ? 'Signing In...' : 'Continue to Control Center'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Package Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Select Package:</span>
                <span className="text-[10px] text-emerald-400 font-mono">14-Day Free Trial</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      selectedPlan === plan.id
                        ? 'border-[#00F3FF] bg-[#00F3FF]/10 text-white'
                        : 'border-slate-800 bg-[#111738] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 right-1.5 bg-[#D4AF37] text-[#0b0f26] text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                        Popular
                      </span>
                    )}
                    <div className="text-[11px] font-bold flex items-center justify-between">
                      <span>{plan.name}</span>
                      {selectedPlan === plan.id && <Check className="w-3 h-3 text-[#00F3FF]" />}
                    </div>
                    <div className="text-[10px] font-mono text-[#00F3FF] mt-0.5">{plan.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-fullname" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Your Name</span>
              </label>
              <input
                id="reg-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2.5 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-bizname" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Business Name</span>
              </label>
              <input
                id="reg-bizname"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Metro Dental Clinic"
                className="w-full px-3.5 py-2.5 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Work Email</span>
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@metrodental.com"
                className="w-full px-3.5 py-2.5 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
              />
            </div>

            <div className="p-3 bg-[#111738] border border-slate-800 rounded-xl text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Isolated Workspace Architecture</span>
              </div>
              <p className="text-slate-400">
                Zero shared credentials or cross-business data. You start with clean zero data and full administrative control.
              </p>
            </div>

            {/* Terms of Service & Privacy Acceptance Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  id="reg-terms-checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-[#00F3FF] accent-[#00F3FF] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
                />
                <span className="leading-snug text-[11px] text-slate-300">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenPolicy) onOpenPolicy('terms');
                      else window.open('/terms', '_blank');
                    }}
                    className="text-[#00F3FF] underline hover:text-white font-medium focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded"
                  >
                    Terms of Service
                  </button>{' '}
                  and acknowledge the{' '}
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenPolicy) onOpenPolicy('privacy');
                      else window.open('/privacy', '_blank');
                    }}
                    className="text-[#00F3FF] underline hover:text-white font-medium focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !termsAccepted}
              className="w-full py-3.5 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-bold text-xs rounded-xl shadow-lg shadow-[#00F3FF]/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
            >
              <span>{isLoading ? 'Authorizing...' : 'Start 14-Day Free Trial & Enter Control Center'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

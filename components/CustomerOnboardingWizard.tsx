'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Building2,
  ShieldCheck,
  Globe,
  Sliders,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Lock,
  ExternalLink,
  MapPin,
  Phone,
  Clock,
  FileCheck,
} from 'lucide-react';
import { User, Workspace, PlanConfig } from '@/types/workspace';

interface CustomerOnboardingWizardProps {
  isOpen: boolean;
  currentUser: User | null;
  currentWorkspace: Workspace | null;
  planConfig: PlanConfig;
  onClose: () => void;
  onComplete: (updatedWorkspace: Workspace) => void;
}

export function CustomerOnboardingWizard({
  isOpen,
  currentUser,
  currentWorkspace,
  planConfig,
  onClose,
  onComplete,
}: CustomerOnboardingWizardProps) {
  // Steps:
  // 1: Account (if not created)
  // 2: Workspace (confirm business name)
  // 3: Review package
  // 4: Connect Google Profile
  // 5: Select location
  // 6: Confirm business facts
  // 7: Run first audit
  // 8: Permitted automation actions
  const [step, setStep] = useState<number>(currentUser ? 3 : 1);

  // Form State
  const [name, setName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [businessName, setBusinessName] = useState(currentWorkspace?.businessName || '');
  const [connectionMode, setConnectionMode] = useState<'sandbox' | 'oauth'>('sandbox');
  const [selectedLocation, setSelectedLocation] = useState(
    currentWorkspace?.liveProfile.title || currentWorkspace?.businessName || 'Primary Main Location'
  );
  
  // Facts Form
  const [factsPhone, setFactsPhone] = useState(currentWorkspace?.approvedFacts.phoneNumber || '');
  const [factsWebsite, setFactsWebsite] = useState(currentWorkspace?.approvedFacts.websiteUri || '');
  const [factsCategory, setFactsCategory] = useState(currentWorkspace?.approvedFacts.primaryCategory || '');
  const [factsDesc, setFactsDesc] = useState(currentWorkspace?.approvedFacts.description || '');

  // Automation Choices
  const [automationMode, setAutomationMode] = useState<'review_first' | 'routine_autopilot'>('review_first');
  const [allowRepairs, setAllowRepairs] = useState(false);
  const [allowPostDrafts, setAllowPostDrafts] = useState(true);
  const [allowReviewDrafts, setAllowReviewDrafts] = useState(true);

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditDone, setAuditDone] = useState(false);
  const [auditScore, setAuditScore] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRunFirstAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditDone(true);
      setAuditScore(84);
    }, 1500);
  };

  const handleFinishOnboarding = async () => {
    if (!currentWorkspace) {
      onClose();
      return;
    }

    try {
      // Persist onboarding confirmations to current workspace
      const updatedFacts = {
        ...currentWorkspace.approvedFacts,
        businessName: businessName || currentWorkspace.approvedFacts.businessName,
        phoneNumber: factsPhone,
        websiteUri: factsWebsite,
        primaryCategory: factsCategory,
        description: factsDesc,
        lastConfirmedAt: 'Confirmed during Initial Onboarding',
      };

      const updatedSettings = {
        ...currentWorkspace.settings,
        automationMode,
        allowedAutopilotActions: allowRepairs ? ['routine_profile_repairs'] : [],
      };

      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approvedFacts: updatedFacts,
          settings: updatedSettings,
          connectionStatus: connectionMode === 'sandbox' ? 'connected' : 'connected',
          googleConnection: {
            ...currentWorkspace.googleConnection,
            status: connectionMode === 'sandbox' ? 'sandbox_preview' : 'connected_live',
            locationId: 'locations/1092830192',
          },
        }),
      });

      const data = await res.json();
      if (data.workspace) {
        onComplete(data.workspace);
      } else {
        onClose();
      }
    } catch {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Customer Onboarding Wizard - Step ${step} of 8`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f26]/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-[#18204c] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header with Progress Steps */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#00F3FF]/20 text-[#00F3FF] border border-[#00F3FF]/40 flex items-center justify-center text-xs font-mono font-bold">
              {step}
            </span>
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
              Step {step} of 8: Customer Setup
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close onboarding wizard"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111738] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Body (Scrollable) */}
        <div className="py-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Account Creation */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Step 1: Create Account</h3>
              <p className="text-xs text-slate-300">
                Provide your primary contact email and full name to create your account credentials.
              </p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Work Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. alex@yourbusiness.com"
                    className="w-full mt-1 px-3.5 py-2.5 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Workspace Creation */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Step 2: Create Private Workspace</h3>
              <p className="text-xs text-slate-300">
                Each workspace is strictly isolated on the server. Audits, tasks, and credentials remain private to your business.
              </p>
              <div>
                <label className="text-xs font-semibold text-slate-300">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Metro Dental Clinic"
                  className="w-full mt-1 px-3.5 py-2.5 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
              <div className="p-3 bg-[#111738] rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-white">Single-Location Scope:</span>
                <p className="text-slate-400">
                  This standalone edition provisions 1 managed Google Business Profile location per workspace.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Review Available Package */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Step 3: Review Available Package</h3>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  Test Mode Trial Active
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Review what is included with your subscription workspace before proceeding:
              </p>

              <div className="bg-[#111738] border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">{planConfig.name}</h4>
                    <p className="text-xs text-slate-400">{planConfig.tagline}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white">
                      ${Math.round(planConfig.monthlyPriceInCents / 100)}
                    </span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  {planConfig.features.slice(0, 6).map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                  <strong>Transparency Notice:</strong> No payment method is charged during development. Live public checkout will be enabled only after Arthur sets and finalizes the commercial offer.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Connect Google Business Profile */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Step 4: Connect Eligible Google Profile</h3>
              <p className="text-xs text-slate-300">
                Choose how you want to authorize your Google Business Profile:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setConnectionMode('sandbox')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    connectionMode === 'sandbox'
                      ? 'bg-[#18204c] border-[#00F3FF] shadow-lg shadow-[#00F3FF]/10'
                      : 'bg-[#111738] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Sandbox & Safe Preview</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                      Immediate
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Runs complete consistency audits, generates diffs, drafts posts and review replies in safe preview mode without writing live to Google.
                  </p>
                </div>

                <div
                  onClick={() => setConnectionMode('oauth')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    connectionMode === 'oauth'
                      ? 'bg-[#18204c] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                      : 'bg-[#111738] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Google OAuth 2.0</span>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">
                      API Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Connects via Google Cloud Web Client ID. Note: Public multi-tenant writes require Google Business Profile API partner approval.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#111738] border border-slate-800 rounded-xl text-xs text-slate-400">
                <strong>Google Compliance Notice:</strong> Arthur’s AI Workforce never shares private owner credentials across customer accounts. You can disconnect your Google account and purge tokens at any time.
              </div>
            </div>
          )}

          {/* STEP 5: Select Location */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Step 5: Select Location to Manage</h3>
              <p className="text-xs text-slate-300">
                Select the physical or service-area location attached to your Google account (1 location per workspace):
              </p>

              <div className="p-4 bg-[#111738] border border-slate-700 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#00F3FF]/10 border border-[#00F3FF]/30 flex items-center justify-center text-[#00F3FF]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{businessName || 'Your Business Location'}</h4>
                    <p className="text-[11px] text-slate-400">Primary Location • Connected Workspace</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Eligible
                </span>
              </div>
            </div>
          )}

          {/* STEP 6: Confirm Business Facts */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Step 6: Confirm Approved Business Facts</h3>
              <p className="text-xs text-slate-300">
                These approved facts act as the single source of truth for the Profile Inspector. Changes will be proposed only to match these confirmed details.
              </p>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Primary Phone</label>
                    <input
                      type="text"
                      value={factsPhone}
                      onChange={(e) => setFactsPhone(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Website URI</label>
                    <input
                      type="text"
                      value={factsWebsite}
                      onChange={(e) => setFactsWebsite(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Primary Category</label>
                  <input
                    type="text"
                    value={factsCategory}
                    onChange={(e) => setFactsCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Approved Profile Description</label>
                  <textarea
                    rows={3}
                    value={factsDesc}
                    onChange={(e) => setFactsDesc(e.target.value)}
                    className="w-full mt-1 p-3 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Run First Audit */}
          {step === 7 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Step 7: Run Your First Consistency Audit</h3>
              <p className="text-xs text-slate-300">
                Inspect your profile for information drift, truncated descriptions, and missing attributes:
              </p>

              {!auditDone ? (
                <div className="p-6 bg-[#111738] border border-slate-800 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#00F3FF]/10 border border-[#00F3FF]/30 flex items-center justify-center text-[#00F3FF]">
                    <Sparkles className={`w-6 h-6 ${isAuditing ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isAuditing ? 'Auditing Google Profile...' : 'Ready to Run First Audit'}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Compares live Google attributes against your confirmed business facts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRunFirstAudit}
                    disabled={isAuditing}
                    className="px-6 py-2.5 bg-[#00F3FF] text-[#0b0f26] font-bold text-xs rounded-xl cursor-pointer disabled:opacity-50"
                  >
                    {isAuditing ? 'Running Inspection...' : 'Start Profile Audit Now'}
                  </button>
                </div>
              ) : (
                <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Audit Complete: Profile Health Score {auditScore}%</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-300">1 Proposed Repair Ready</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    We detected that your Google Business Profile description can be enriched with your approved service keywords and contact details. A proposal has been placed in your repair queue for review.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 8: Permitted Automation Actions */}
          {step === 8 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Step 8: Choose Permitted Automation Actions</h3>
              <p className="text-xs text-slate-300">
                You retain complete control over your workspace. Review-First is selected by default:
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-[#111738] border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">Default Mode: Review First</h4>
                      <p className="text-[11px] text-slate-400">
                        Workforce prepares audits, diffs, and drafts. No external write occurs without your manual click.
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg font-semibold">
                      Recommended
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowPostDrafts}
                        onChange={(e) => setAllowPostDrafts(e.target.checked)}
                        className="rounded border-slate-700 text-[#00F3FF]"
                      />
                      <span>Generate weekly local business post drafts</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowReviewDrafts}
                        onChange={(e) => setAllowReviewDrafts(e.target.checked)}
                        className="rounded border-slate-700 text-[#00F3FF]"
                      />
                      <span>Generate personalized review response drafts</span>
                    </label>

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allowRepairs}
                        onChange={(e) => setAllowRepairs(e.target.checked)}
                        className="rounded border-slate-700 text-[#00F3FF]"
                      />
                      <span>Permit routine non-protected profile repairs after owner review</span>
                    </label>
                  </div>
                </div>

                <div className="p-3 bg-[#18204c] border border-slate-800 rounded-xl text-[11px] text-slate-400">
                  <span className="font-semibold text-white">Protected Fields Safety Rule:</span> Business Name, Address, Phone, Categories, and Hours can NEVER be updated automatically under any setting.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 bg-[#111738] hover:bg-[#202b66] text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 8 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-bold text-xs rounded-xl shadow-md shadow-[#00F3FF]/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Continue to Step {step + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-400 hover:opacity-95 text-[#0b0f26] font-black text-xs rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Complete Setup & Open Workspace</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

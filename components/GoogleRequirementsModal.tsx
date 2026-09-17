'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  AlertTriangle,
  Lock,
  CheckCircle2,
  FileText,
  Building2,
  KeyRound,
  Trash2,
  Info,
} from 'lucide-react';

interface GoogleRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GoogleRequirementsModal({ isOpen, onClose }: GoogleRequirementsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f26]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#18204c] border border-[#00F3FF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00F3FF]/20 border border-[#00F3FF]/40 flex items-center justify-center text-[#00F3FF]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Google Business Profile API: Multi-Tenant Compliance & Access
              </h2>
              <p className="text-xs text-slate-400">
                Official Google Cloud & OAuth Requirements for Public Software
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#111738] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="py-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300">
          {/* Summary Box */}
          <div className="p-4 bg-[#111738] border border-amber-500/40 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Architectural Mandate: Zero Shared Credentials</span>
            </div>
            <p className="leading-relaxed">
              Arthur’s private Google Cloud credentials are never shared, exposed, or proxied to third-party customer accounts. All multi-tenant public access strictly follows the official Google Business Profile API partner architecture.
            </p>
          </div>

          {/* Section 1: Supported Authorization Model */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#00F3FF]" />
              <span>1. Supported Authorization Model</span>
            </h3>
            <p className="leading-relaxed">
              For a multi-tenant public application, Google requires a <strong>Google Cloud OAuth 2.0 Web Application</strong> authorization flow with an External User Type:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong>Sensitive Scope Required:</strong> <code className="text-[#00F3FF]">https://www.googleapis.com/auth/business.manage</code>
              </li>
              <li>
                <strong>User Profile Scopes:</strong> <code className="text-slate-400">userinfo.email</code> and <code className="text-slate-400">userinfo.profile</code>
              </li>
              <li>
                <strong>Token Lifecycle:</strong> Refresh tokens are stored encrypted and isolated per-workspace. Tokens are refreshed server-side and never sent to client browsers.
              </li>
            </ul>
          </div>

          {/* Section 2: Required Google Project Approval */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>2. Required Google Business Profile API Partner Approval</span>
            </h3>
            <p className="leading-relaxed">
              Unlike public Google Workspace APIs (Drive, Gmail), the <strong>Google Business Profile API</strong> is a restricted partner API requiring a formal application:
            </p>
            <div className="bg-[#111738] p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Google Partner Application Form:</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                  Prerequisite for Live Writes
                </span>
              </div>
              <p className="text-slate-400">
                The Google Cloud project owner (Arthur) must submit the official <em>Google Business Profile API Access Request</em>, providing company verification, privacy policy URLs, and explicit use-case justification.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-cyan-300 pt-1">
                <Info className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Status: API access request documentation prepared. Safe Preview Mode is active while partner verification proceeds.</span>
              </div>
            </div>
          </div>

          {/* Section 3: OAuth Consent Screen & App Verification */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>3. OAuth Consent Screen & Google App Verification</span>
            </h3>
            <p className="leading-relaxed">
              Because <code className="text-[#00F3FF]">business.manage</code> is classified as a sensitive and restricted scope:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>Google Cloud Trust & Safety performs security assessments, domain verification, and terms review.</li>
              <li>Until verification is granted, OAuth is restricted to pre-registered test users (up to 100 users).</li>
              <li>Unverified projects display an &quot;Unverified App&quot; warning during consent, which is why Arthur’s AI Workforce uses the Compliant Sandbox Preview model for public evaluation.</li>
            </ul>
          </div>

          {/* Section 4: Bring Your Own Project (BYOP) Option */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>4. Bring Your Own Project (BYOP) Support</span>
            </h3>
            <p className="leading-relaxed">
              For technical enterprise customers or agencies with existing approved Google Cloud projects, Arthur’s AI Workforce supports a BYOP model where the customer enters their own GCP Client ID and Secret in workspace settings, allowing immediate live operations without waiting for central app verification.
            </p>
          </div>

          {/* Section 5: Data Storage, Retention & Deletion Rules */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>5. Rules for Storing and Deleting Google-Derived Data</span>
            </h3>
            <p className="leading-relaxed">
              In accordance with Google’s API Services User Data Policy:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong>Instant Disconnection Purge:</strong> When a user disconnects their profile, all OAuth access tokens, refresh tokens, and cached Google profile responses are purged from the database immediately.
              </li>
              <li>
                <strong>No Permanent Storage of Raw Secrets:</strong> Client secrets are hashed or encrypted using AES-256 GCM.
              </li>
              <li>
                <strong>Workspace Deletion:</strong> Complete workspace deletion purges all audit records, drafted posts, and confirmed facts irrevocably.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#00F3FF] text-[#0b0f26] font-bold text-xs rounded-xl cursor-pointer"
          >
            I Understand Google Requirements
          </button>
        </div>
      </div>
    </div>
  );
}

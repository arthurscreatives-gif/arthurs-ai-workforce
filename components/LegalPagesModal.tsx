'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  HelpCircle,
  Mail,
  Building2,
  AlertCircle,
  CheckCircle2,
  Send,
  CreditCard,
  Eye,
  Cookie,
  ExternalLink,
  Lock,
  LifeBuoy,
} from 'lucide-react';
import {
  TERMS_OF_SERVICE,
  PRIVACY_POLICY,
  BILLING_POLICY,
  ACCESSIBILITY_STATEMENT,
  COOKIE_POLICY,
  BUSINESS_SUPPORT_INFO,
  POLICY_METADATA,
} from '@/lib/legal-policies';

export type LegalTab = 'terms' | 'privacy' | 'billing' | 'accessibility' | 'cookies' | 'support';

interface LegalPagesModalProps {
  isOpen: boolean;
  initialTab?: LegalTab;
  onClose: () => void;
}

export function LegalPagesModal({
  isOpen,
  initialTab = 'privacy',
  onClose,
}: LegalPagesModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState<LegalTab>(initialTab);

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  const [supportSubject, setSupportSubject] = useState('');
  const [supportCategory, setSupportCategory] = useState<
    'google_oauth' | 'billing' | 'profile_sync' | 'accessibility' | 'deletion' | 'other'
  >('google_oauth');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: supportSubject,
          message: supportMessage,
          category: supportCategory,
        }),
      });
      if (res.ok) {
        setSentSuccess(true);
        setSupportSubject('');
        setSupportMessage('');
      }
    } catch {
      // handled
    } finally {
      setIsSending(false);
    }
  };

  const getStandaloneRoute = (tab: LegalTab) => {
    switch (tab) {
      case 'terms':
        return '/terms';
      case 'privacy':
        return '/privacy';
      case 'billing':
        return '/billing-policy';
      case 'accessibility':
        return '/accessibility';
      case 'cookies':
        return '/cookies';
      case 'support':
        return '/support';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f26]/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-[#18204c] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00F3FF]/10 border border-[#00F3FF]/30 flex items-center justify-center text-[#00F3FF] flex-shrink-0 mt-0.5">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="legal-modal-title" className="text-lg font-bold text-white">
                  Public Policies & Customer Support
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Official • Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Velo Website Development LLC, operating as Arthur’s Creatives •{' '}
                <a
                  href="mailto:arthurscreatives@gmail.com"
                  className="text-[#00F3FF] hover:underline focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded"
                >
                  arthurscreatives@gmail.com
                </a>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={getStandaloneRoute(activeTab)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${activeTab} policy in full page`}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#111738] transition-colors cursor-pointer text-xs flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
              title="Open full standalone page"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Full Page</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close policies dialog"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#111738] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Policy sections"
          className="flex overflow-x-auto bg-[#111738] p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold my-4 gap-1 no-scrollbar"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'terms'}
            id="tab-terms"
            aria-controls="panel-terms"
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none ${
              activeTab === 'terms'
                ? 'bg-[#18204c] text-white shadow-sm border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Terms of Service</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'privacy'}
            id="tab-privacy"
            aria-controls="panel-privacy"
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none ${
              activeTab === 'privacy'
                ? 'bg-[#18204c] text-white shadow-sm border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Privacy Policy</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'billing'}
            id="tab-billing"
            aria-controls="panel-billing"
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none ${
              activeTab === 'billing'
                ? 'bg-[#18204c] text-white shadow-sm border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
            <span>Billing & Refunds</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'accessibility'}
            id="tab-accessibility"
            aria-controls="panel-accessibility"
            onClick={() => setActiveTab('accessibility')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none ${
              activeTab === 'accessibility'
                ? 'bg-[#18204c] text-white shadow-sm border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#00F3FF]" aria-hidden="true" />
            <span>Accessibility</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'cookies'}
            id="tab-cookies"
            aria-controls="panel-cookies"
            onClick={() => setActiveTab('cookies')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none ${
              activeTab === 'cookies'
                ? 'bg-[#18204c] text-white shadow-sm border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cookie className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>Cookies</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'support'}
            id="tab-support"
            aria-controls="panel-support"
            onClick={() => setActiveTab('support')}
            className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none ${
              activeTab === 'support'
                ? 'bg-[#18204c] text-white shadow-sm border border-slate-700 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span>Support & Identity</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 text-xs text-slate-300 space-y-4">
          {/* TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div role="tabpanel" id="panel-terms" aria-labelledby="tab-terms" className="space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-[11px] text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Ratified Agreement:</strong> Official Terms of Service approved and ratified by Arthur (Velo Website Development LLC). Governing law: Florida, USA.
                </div>
              </div>

              <div className="space-y-4">
                {TERMS_OF_SERVICE.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-2">
                    <h3 className="text-sm font-bold text-white">{sec.heading}</h3>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="leading-relaxed text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div role="tabpanel" id="panel-privacy" aria-labelledby="tab-privacy" className="space-y-4">
              <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-[11px] text-cyan-200 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Google Limited Use & Disconnect Guarantee:</strong> Data received from Google APIs is restricted strictly to profile management and is never sold, leased, or used for generalized AI training. You may disconnect Google anytime in Settings.
                </div>
              </div>

              <div className="space-y-4">
                {PRIVACY_POLICY.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-2">
                    <h3 className="text-sm font-bold text-white">{sec.heading}</h3>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="leading-relaxed text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BILLING & REFUNDS */}
          {activeTab === 'billing' && (
            <div role="tabpanel" id="panel-billing" aria-labelledby="tab-billing" className="space-y-4">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-[11px] text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Commercial Offer Approved:</strong> Standalone subscription finalized at $49.00 USD/month ($470/yr) with 14-day refund window on initial charges.
                </div>
              </div>

              <div className="space-y-4">
                {BILLING_POLICY.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-2">
                    <h3 className="text-sm font-bold text-white">{sec.heading}</h3>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="leading-relaxed text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCESSIBILITY STATEMENT */}
          {activeTab === 'accessibility' && (
            <div role="tabpanel" id="panel-accessibility" aria-labelledby="tab-accessibility" className="space-y-4">
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-[11px] text-emerald-200 flex items-start gap-2">
                <Eye className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Honest Conformance Baseline:</strong> We design to conform with WCAG 2.1 Level AA principles (semantic landmarks, keyboard controls, visible outlines, AA contrast, reduced motion). We do not claim formal third-party certification.
                </div>
              </div>

              <div className="space-y-4">
                {ACCESSIBILITY_STATEMENT.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-2">
                    <h3 className="text-sm font-bold text-white">{sec.heading}</h3>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="leading-relaxed text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COOKIE POLICY */}
          {activeTab === 'cookies' && (
            <div role="tabpanel" id="panel-cookies" aria-labelledby="tab-cookies" className="space-y-4">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200 flex items-start gap-2">
                <Cookie className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Cookie Transparency:</strong> Only strictly necessary session tokens and functional workspace preferences exist. Third-party marketing trackers are completely absent.
                </div>
              </div>

              <div className="space-y-4">
                {COOKIE_POLICY.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-2">
                    <h3 className="text-sm font-bold text-white">{sec.heading}</h3>
                    {sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="leading-relaxed text-slate-300">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}

                <div className="p-4 bg-[#111738] rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Manage In-App Cookie Consent</h4>
                    <p className="text-[11px] text-slate-400">
                      Open interactive cookie settings to view or update your stored choices.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('open_arthur_cookie_settings'));
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-[#00F3FF]/10 text-[#00F3FF] border border-[#00F3FF]/30 font-bold rounded-xl hover:bg-[#00F3FF]/20 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
                  >
                    Open Cookie Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUPPORT & IDENTITY */}
          {activeTab === 'support' && (
            <div role="tabpanel" id="panel-support" aria-labelledby="tab-support" className="space-y-4">
              {/* Confirmed Business Identity Card */}
              <div className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Confirmed Business Operator Identity</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Legal Entity:</span>
                    <strong className="text-white">{BUSINESS_SUPPORT_INFO.legalEntity}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Operating Brand / DBA:</span>
                    <strong className="text-[#00F3FF]">{BUSINESS_SUPPORT_INFO.tradeName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Software Product:</span>
                    <span className="text-white">{BUSINESS_SUPPORT_INFO.productName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Support Email:</span>
                    <a
                      href={`mailto:${BUSINESS_SUPPORT_INFO.primaryEmail}`}
                      className="text-[#00F3FF] font-mono hover:underline focus-visible:ring-1 focus-visible:ring-[#00F3FF]"
                    >
                      {BUSINESS_SUPPORT_INFO.primaryEmail}
                    </a>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="text-white font-medium">Business Address Notice: </span>
                  {BUSINESS_SUPPORT_INFO.mailingAddressNotice}
                </div>
              </div>

              {/* Working In-App Support Form */}
              <div className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#00F3FF]" />
                    <span>Submit Customer Support Inquiry</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Typical response: within 1 business day
                  </span>
                </div>

                {sentSuccess ? (
                  <div
                    role="alert"
                    className="p-4 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>
                      Inquiry received. Arthur’s Creatives support team will respond to your registered email address within 1 business day.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSendSupport} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="sup-cat" className="block text-slate-300 font-semibold mb-1 text-[11px]">
                          Inquiry Category
                        </label>
                        <select
                          id="sup-cat"
                          value={supportCategory}
                          onChange={(e: any) => setSupportCategory(e.target.value)}
                          className="w-full bg-[#18204c] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
                        >
                          <option value="google_oauth">Google Business Profile Connection</option>
                          <option value="profile_sync">Profile Repair or Discrepancy</option>
                          <option value="billing">Billing, Subscription & Refunds</option>
                          <option value="accessibility">Accessibility Barrier / Feedback</option>
                          <option value="deletion">Account & Data Deletion Request</option>
                          <option value="other">General Inquiries</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="sup-sub" className="block text-slate-300 font-semibold mb-1 text-[11px]">
                          Subject
                        </label>
                        <input
                          id="sup-sub"
                          type="text"
                          required
                          value={supportSubject}
                          onChange={(e) => setSupportSubject(e.target.value)}
                          placeholder="Brief summary of issue"
                          className="w-full bg-[#18204c] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="sup-msg" className="block text-slate-300 font-semibold mb-1 text-[11px]">
                        Message Details
                      </label>
                      <textarea
                        id="sup-msg"
                        required
                        rows={3}
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        placeholder="Please describe your question, listing details, or issue..."
                        className="w-full bg-[#18204c] border border-slate-700 rounded-xl p-3 text-white text-xs outline-none focus-visible:ring-2 focus-visible:ring-[#00F3FF] resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSending}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
                      >
                        {isSending ? (
                          <span>Submitting...</span>
                        ) : (
                          <>
                            <span>Send Support Inquiry</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>
            {POLICY_METADATA.legalEntity} • {POLICY_METADATA.productName}
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-slate-500">Effective: {POLICY_METADATA.effectiveDate}</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-[#111738] hover:bg-[#202b66] text-white border border-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

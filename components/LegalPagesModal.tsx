'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

interface LegalPagesModalProps {
  isOpen: boolean;
  initialTab?: 'terms' | 'privacy' | 'support';
  onClose: () => void;
}

export function LegalPagesModal({
  isOpen,
  initialTab = 'privacy',
  onClose,
}: LegalPagesModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'support'>(initialTab);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportCategory, setSupportCategory] = useState<'google_oauth' | 'billing' | 'profile_sync' | 'other'>('google_oauth');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

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
      // ignore
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f26]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#18204c] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00F3FF]/10 border border-[#00F3FF]/30 flex items-center justify-center text-[#00F3FF]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Policies & Customer Support</h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-mono">
                  Draft Policies • Subject to Legal Review
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Contact Arthur’s Creatives at <code className="text-slate-300">arthurscreatives@gmail.com</code>
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

        {/* Tab Switcher */}
        <div className="flex bg-[#111738] p-1 rounded-xl border border-slate-800 text-xs font-semibold my-4">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'privacy' ? 'bg-[#18204c] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Privacy Policy (Draft)
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'terms' ? 'bg-[#18204c] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Terms of Service (Draft)
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'support' ? 'bg-[#18204c] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Customer Support
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed pr-1">
          {/* PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px]">
                <strong>Notice:</strong> This draft policy is provided for public preview evaluation and has not been finalized by external legal counsel.
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">1. Scope and Operator</h3>
                <p>
                  Arthur’s AI Workforce is operated by Arthur’s Creatives (contact: arthurscreatives@gmail.com). This Privacy Policy describes how we collect, use, and handle business information when you use our Google Business Profile automation software.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. Google API Data & Compliance</h3>
                <p>
                  Arthur’s AI Workforce strictly adheres to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>We only request access to scopes necessary to inspect, repair, and publish authorized profile updates (<code className="text-[#00F3FF]">business.manage</code>).</li>
                  <li>We do not transfer or sell Google user data to third parties, advertising brokers, or data exchanges.</li>
                  <li>We do not use Google user data to train generalized AI models without explicit, informed customer consent.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Data Retention and Deletion</h3>
                <p>
                  Customers maintain full ownership of their data. When you disconnect your Google Account via Settings, all authorization tokens and cached Google profile attributes are wiped from our active servers immediately. You may request permanent deletion of your workspace and all historic logs at any time.
                </p>
              </div>
            </div>
          )}

          {/* TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-[11px]">
                <strong>Notice:</strong> Unfinished draft text. Do not represent as finalized commercial terms.
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">1. Authorized Profile Management</h3>
                <p>
                  By connecting a Google Business Profile, you represent that you are the verified owner or authorized representative of the business location. You agree that all approved facts and instructions you provide are truthful and accurate.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">2. No Guaranteed Rankings or Placement</h3>
                <p>
                  Arthur’s AI Workforce provides software tools for profile accuracy, consistency audits, and customer communication assistance. We do NOT guarantee specific search rankings, map positions, or customer conversion rates.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white">3. Human Oversight & Autopilot Safety</h3>
                <p>
                  Protected business fields (including legal business name, address, phone numbers, categories, and regular hours) require explicit manual approval before changes are published to Google. The customer remains responsible for final verification of all published materials.
                </p>
              </div>
            </div>
          )}

          {/* CUSTOMER SUPPORT */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              {sentSuccess ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-sm font-bold text-white">Support Inquiry Received</h3>
                  <p className="text-xs text-slate-300">
                    Arthur has received your ticket and will follow up with you at your account email. You can also reach out directly at <strong className="text-white">arthurscreatives@gmail.com</strong>.
                  </p>
                  <button
                    onClick={() => setSentSuccess(false)}
                    className="px-4 py-2 bg-[#111738] text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendSupport} className="space-y-3">
                  <div className="p-3 bg-[#111738] rounded-xl border border-slate-800 text-xs text-slate-400">
                    Need help with Google OAuth verification, profile synchronization, or billing? Submit a ticket directly to Arthur’s administration team.
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Category</label>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value as any)}
                      className="w-full mt-1 px-3 py-2 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white"
                    >
                      <option value="google_oauth">Google OAuth & API Verification</option>
                      <option value="profile_sync">Profile Drift & Sync Inconsistency</option>
                      <option value="billing">Subscription & Billing Questions</option>
                      <option value="other">General Technical Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Subject</label>
                    <input
                      type="text"
                      required
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="e.g. Questions regarding Google API partner status"
                      className="w-full mt-1 px-3 py-2 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full mt-1 p-3 bg-[#111738] border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending Inquiry...' : 'Submit Support Ticket'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

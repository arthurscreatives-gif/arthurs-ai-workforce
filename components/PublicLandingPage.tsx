'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Building2,
  FileEdit,
  Sliders,
  BarChart3,
  History,
  Lock,
  ExternalLink,
  MessageSquare,
  RefreshCw,
  Info,
  ChevronRight,
  FileText,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { PlanConfig, User, Workspace } from '@/types/workspace';

interface PublicLandingPageProps {
  currentUser: User | null;
  currentWorkspace: Workspace | null;
  planConfig: PlanConfig;
  onOpenAuth: (mode: 'signin' | 'register') => void;
  onStartOnboarding: () => void;
  onEnterWorkspace: () => void;
  onOpenGoogleRequirements: () => void;
  onOpenLegal: (tab: 'terms' | 'privacy' | 'support') => void;
  onOpenAdmin: () => void;
}

export function PublicLandingPage({
  currentUser,
  currentWorkspace,
  planConfig,
  onOpenAuth,
  onStartOnboarding,
  onEnterWorkspace,
  onOpenGoogleRequirements,
  onOpenLegal,
  onOpenAdmin,
}: PublicLandingPageProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'audit' | 'repairs' | 'content' | 'reviews' | 'operations'>('audit');

  return (
    <div className="min-h-screen bg-[#0b0f26] text-slate-100 selection:bg-[#00F3FF]/30 selection:text-white">
      {/* Top Banner: Standalone Pricing / Test Mode Notice */}
      <div className="bg-[#18204c] border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
        <span>
          <strong>Public App Development Preview:</strong> Standalone subscription pricing is in test mode pending Arthur’s final package approval. Live credit card charging is kept disabled.
        </span>
        <button
          onClick={onOpenGoogleRequirements}
          className="underline font-semibold hover:text-white ml-2 cursor-pointer inline-flex items-center gap-1"
        >
          Google API Status <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Main Public Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0b0f26]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#00F3FF] p-[1.5px] shadow-lg shadow-[#00F3FF]/10">
              <div className="w-full h-full bg-[#0b0f26] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#00F3FF]" />
              </div>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                Arthur’s AI Workforce
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.2 rounded font-mono font-medium">
                  GBP Edition
                </span>
              </span>
              <p className="text-[10px] text-slate-400 -mt-0.5">Google Business Profile Automation</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-[#00F3FF] transition-colors">
              Features
            </a>
            <a href="#benefits" className="hover:text-[#00F3FF] transition-colors">
              Practical Benefits
            </a>
            <a href="#pricing" className="hover:text-[#00F3FF] transition-colors">
              Pricing
            </a>
            <button
              onClick={onOpenGoogleRequirements}
              className="hover:text-[#00F3FF] transition-colors cursor-pointer flex items-center gap-1"
            >
              Google Access & Compliance
            </button>
          </nav>

          {/* User Account / Auth Actions */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.role === 'owner' && (
                  <button
                    onClick={onOpenAdmin}
                    className="px-2.5 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Platform Owner Administration"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Admin</span>
                  </button>
                )}
                <button
                  onClick={onEnterWorkspace}
                  className="px-4 py-2 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-bold text-xs rounded-xl shadow-lg shadow-[#00F3FF]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onStartOnboarding}
                  className="px-4 py-2 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-bold text-xs rounded-xl shadow-lg shadow-[#00F3FF]/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 border-b border-slate-800">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#18204c]/40 via-[#00F3FF]/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18204c] border border-[#D4AF37]/40 text-xs font-medium text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5 text-[#00F3FF]" />
            <span>Dedicated Google Business Profile Management Software</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight sm:leading-snug">
            Build, Train, and Deploy Your Digital Workforce.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Arthur’s AI Workforce is a business automation platform that helps local companies maintain accurate Google Business Profiles, repair information drift, draft timely updates, and respond to customer reviews with complete human oversight.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartOnboarding}
              className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#00F3FF] via-[#00d0db] to-blue-500 hover:opacity-95 text-[#0b0f26] font-extrabold text-sm rounded-xl shadow-xl shadow-[#00F3FF]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Build Your AI Workforce</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#18204c] hover:bg-[#202b66] text-white border border-slate-700 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore AI Agents</span>
            </a>
          </div>

          {/* Reassurance pills: Honest expectations without marketing hype */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Review First by Default</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#00F3FF]" />
              <span>Isolated Private Workspaces</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>No Unsolicited Automated Writes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Benefits (Explicitly requested by user) */}
      <section id="benefits" className="py-16 border-b border-slate-800 bg-[#111738]/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs uppercase tracking-widest text-[#00F3FF] font-mono font-bold">
              Core Capabilities
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              Practical, Measurable Profile Management
            </p>
            <p className="text-xs text-slate-400">
              Clear outcomes designed to keep local business information verified and responsive across Google Search and Maps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Benefit 1 */}
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#00F3FF]/10 border border-[#00F3FF]/30 flex items-center justify-center text-[#00F3FF]">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Find Incomplete or Inconsistent Business Information
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The Profile Inspector continuously audits your Google listing against your confirmed business facts, catching missing services, truncated descriptions, and mismatched operating hours.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Prepare and Apply Supported Profile Improvements
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Review proposed text repairs side-by-side with clear evidence and rollback history. Apply verified updates with one click or hold protected fields for owner review.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileEdit className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Plan and Publish Approved Business Posts
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Draft high-value service spotlights, helpful local business tips, and seasonal offers grounded exclusively in your verified services and approved brand guidelines.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Draft Personalized Review Responses
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automatically receive tailored response drafts for customer feedback. Sensitive complaints are flagged immediately for personal owner handling with professional de-escalation guidance.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Monitor Available Profile Performance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Track verified Google Maps views, search impressions, call button clicks, and website visits with factual reporting delays explicitly noted. No exaggerated ranking claims.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-3 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Keep a Clear History of Work Performed
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every inspection, proposed diff, authorized edit, and published post is recorded in a timestamped activity ledger formatted in Eastern Time with authorization attribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Deep Dive */}
      <section id="features" className="py-16 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-xs uppercase tracking-widest text-[#D4AF37] font-mono font-bold">
              Product Overview
            </h2>
            <p className="text-2xl font-bold text-white">
              The Five Pillars of Your Digital Workforce
            </p>
          </div>

          {/* Feature Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: 'audit', label: '1. Fact Inspection', icon: Building2 },
              { id: 'repairs', label: '2. Profile Repairs', icon: CheckCircle2 },
              { id: 'content', label: '3. Content Engine', icon: FileEdit },
              { id: 'reviews', label: '4. Review Workflows', icon: MessageSquare },
              { id: 'operations', label: '5. Daily Operations', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeFeatureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#00F3FF] text-[#0b0f26] shadow-md shadow-[#00F3FF]/20'
                      : 'bg-[#18204c] text-slate-300 hover:bg-[#202b66] border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Preview Card */}
          <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 sm:p-8">
            {activeFeatureTab === 'audit' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#00F3FF]">Inspection Engine</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    Continuous Consistency Check
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Approved Business Facts as the Single Source of Truth
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Before any automation touches your live Google listing, you establish confirmed facts: exact legal name, verified address, phone numbers, core categories, services, and operating hours. The engine compares live data against these approved facts, generating structured findings whenever discrepancies appear.
                </p>
                <div className="bg-[#111738] p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Protected Attributes:</span>
                    <span className="text-white font-semibold">Name, Address, Phone, Hours</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Detection Scope:</span>
                    <span className="text-white font-semibold">NAP Consistency & Attribute Drift</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Default Guardrail:</span>
                    <span className="text-emerald-300 font-semibold">Manual Owner Confirmation</span>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'repairs' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#D4AF37]">Profile Repairs</span>
                  <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                    Side-by-Side Diffs
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Transparent Repair Proposals with Rollback Capability
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every detected inconsistency creates a clear repair proposal showing current live value vs proposed value, the exact reason, and cited evidence. Business owners can approve, reject, or customize changes with an instant rollback button available if needed.
                </p>
                <div className="bg-[#111738] p-4 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-rose-300 font-mono line-through block">Current: Truncated 84-char description</span>
                    <span className="text-emerald-300 font-mono block">Proposed: Comprehensive service overview with verified keywords</span>
                  </div>
                  <span className="px-3 py-1.5 bg-[#00F3FF]/20 text-[#00F3FF] font-bold rounded-lg border border-[#00F3FF]/40 flex-shrink-0">
                    One-Click Apply
                  </span>
                </div>
              </div>
            )}

            {activeFeatureTab === 'content' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400">Content Engine</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                    Structured Google Posts
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Drafts Anchored Exclusively in Confirmed Facts
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Avoid generic AI fluff. Arthur’s AI Workforce drafts Google Business Profile updates strictly around verified services, real tips, and owner-approved specials. Posts are saved as drafts until the customer explicitly clicks publish.
                </p>
              </div>
            )}

            {activeFeatureTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-300">Customer Feedback</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    De-escalation Safeguards
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Thoughtful Review Responses with Sensitive Complaint Flagging
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Positive reviews receive warm, personalized gratitude reflecting specific services mentioned. Critical or sub-4-star reviews are instantly flagged as sensitive, providing calm offline resolution contact info rather than public arguments.
                </p>
              </div>
            )}

            {activeFeatureTab === 'operations' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#00F3FF]">Daily Operations Cockpit</span>
                  <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                    Emergency Global Pause
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Centralized Task Queue, Alert Urgency Tiers, and Today’s Work Ledger
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Monitor every scheduled inspection, approved write, and pending review reply. A prominent global pause toggle halts external Google writes across your workspace instantly whenever you need manual control.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscription Pricing Section (Honest, Configurable Package) */}
      <section id="pricing" className="py-16 border-b border-slate-800 bg-[#111738]/40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-xs uppercase tracking-widest text-[#00F3FF] font-mono font-bold">
              Subscription Foundation
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              One Transparent Package. Full Control.
            </p>
            <p className="text-xs text-slate-400">
              Start with 1 connected business location per workspace. Additional locations and team invitations will be added in future updates.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="bg-[#18204c] border-2 border-[#D4AF37]/50 rounded-3xl p-8 shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0b0f26] font-bold text-[11px] px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
              Standalone Software Edition
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white">{planConfig.name}</h3>
                <p className="text-xs text-slate-300 mt-1">{planConfig.tagline}</p>
              </div>
              <div className="text-left md:text-right">
                <div className="text-3xl font-black text-white">
                  ${Math.round(planConfig.monthlyPriceInCents / 100)}
                  <span className="text-xs font-normal text-slate-400"> / month</span>
                </div>
                <span className="text-[10px] text-amber-300 block mt-1 font-mono">
                  (Test Mode Preview — Pending Arthur’s Final Offer Approval)
                </span>
              </div>
            </div>

            {/* Inclusions */}
            <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {planConfig.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-200">{feature}</span>
                </div>
              ))}
            </div>

            {/* Quota breakdown */}
            <div className="bg-[#111738] p-4 rounded-xl border border-slate-800 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Locations</span>
                <span className="text-white font-bold">{planConfig.entitlements.maxLocations} Location</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">AI Analyses</span>
                <span className="text-white font-bold">{planConfig.entitlements.monthlyAiAnalysesQuota}/mo</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Drafts</span>
                <span className="text-white font-bold">{planConfig.entitlements.monthlyDraftsQuota}/mo</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Automated Tasks</span>
                <span className="text-white font-bold">{planConfig.entitlements.monthlyAutomatedActionsQuota}/mo</span>
              </div>
            </div>

            {/* Checkout Action & Safety Notice */}
            <div className="space-y-3">
              <button
                onClick={onStartOnboarding}
                className="w-full py-4 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-black text-sm rounded-xl shadow-xl shadow-[#00F3FF]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Get Started with 14-Day Guided Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-slate-400">
                Credit card is not charged during test mode preview. Workspaces receive isolated sandbox data and inspection drafts immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Google API Requirements & Transparency Section */}
      <section className="py-14 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 bg-[#18204c] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="w-5 h-5 text-[#00F3FF]" />
            <h3 className="text-base font-bold text-white">
              Google Business Profile API & Public Authorization Requirements
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In compliance with Google API Services policies, connecting external client accounts requires an approved Google Cloud Project with the Google Business Profile API enabled and a verified OAuth Consent Screen for the <code className="text-amber-300">business.manage</code> scope. While partner review is pending, all workspaces can run complete local consistency inspections, generate repair drafts, and test daily workflows in safe draft mode.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenGoogleRequirements}
              className="px-4 py-2 bg-[#111738] hover:bg-[#1a2353] text-[#00F3FF] border border-[#00F3FF]/40 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>View Google Access Documentation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Data Retention & Deletion Policy
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#080c20] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-semibold text-white">Arthur’s AI Workforce</span>
            <span className="text-slate-500">|</span>
            <span>Google Business Profile Automation</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Terms of Service (Draft)
            </button>
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Privacy Policy (Draft)
            </button>
            <button
              onClick={() => onOpenLegal('support')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Customer Support
            </button>
            <button
              onClick={onOpenAdmin}
              className="text-[#D4AF37] hover:underline transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            >
              <Lock className="w-3 h-3" /> Arthur Owner Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

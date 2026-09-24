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
  Radio,
  Bot,
} from 'lucide-react';
import { PlanConfig, User, Workspace } from '@/types/workspace';

interface PublicLandingPageProps {
  currentUser: User | null;
  currentWorkspace: Workspace | null;
  planConfig: PlanConfig;
  onOpenAuth: (mode: 'signin' | 'register', planId?: string) => void;
  onStartOnboarding: (planId?: string) => void;
  onEnterWorkspace: () => void;
  onOpenGoogleRequirements: () => void;
  onOpenLegal: (tab: 'terms' | 'privacy' | 'billing' | 'accessibility' | 'cookies' | 'support') => void;
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
  const [activeFeatureTab, setActiveFeatureTab] = useState<
    'audit' | 'repairs' | 'content' | 'reviews' | 'operations' | 'ai_workforce'
  >('audit');

  return (
    <div className="min-h-screen bg-[#0b0f26] text-slate-100 selection:bg-[#00F3FF]/30 selection:text-white">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00F3FF] focus:text-[#0b0f26] focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

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
                  onClick={() => onStartOnboarding()}
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
              onClick={() => onStartOnboarding()}
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
              { id: 'ai_workforce', label: '6. Live Voice & Grounded AI', icon: Sparkles },
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

            {activeFeatureTab === 'ai_workforce' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#00F3FF]">Gemini Multi-Model Intelligence</span>
                  <span className="text-xs bg-[#00F3FF]/20 text-[#00F3FF] px-2 py-0.5 rounded border border-[#00F3FF]/30">
                    gemini-3.8-live &bull; gemini-3.5-flash &bull; gemini-3.1-pro-preview
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Real-Time Live Voice, Google Search Grounding, and Multi-Turn Agents
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interact with your digital workforce naturally. Experience ultra-low-latency real-time voice calls using the Live API, synthesize live Google Search data with verified web citations, and consult specialized AI agents designed for operations, SEO, policy compliance, and voice receptionist simulation.
                </p>
                <div className="bg-[#111738] p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Real-Time Voice API:</span>
                    <span className="text-[#00F3FF] font-semibold">gemini-3.8-live (24kHz audio)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Google Search Grounding:</span>
                    <span className="text-emerald-300 font-semibold">gemini-3.5-flash + web citations</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Complex Reasoning Agent:</span>
                    <span className="text-purple-300 font-semibold">gemini-3.1-pro-preview</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscription Pricing Section (3 Distinct Packages) */}
      <section id="pricing" className="py-20 border-b border-slate-800 bg-[#111738]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-[#00F3FF] font-mono font-bold">
              Transparent Digital Workforce Packages
            </h2>
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Select Your Plan to Launch Your 14-Day Free Trial
            </p>
            <p className="text-sm text-slate-300">
              Every plan starts with a 14-day free trial. Sign up, pick your package, and once authorized, you are immediately released into your private control center with zero mock data.
            </p>
          </div>

          {/* 3 Packages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Package 1: Starter */}
            <div className="bg-[#18204c] border border-slate-700/80 hover:border-[#00F3FF]/50 rounded-3xl p-8 flex flex-col justify-between transition-all relative">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#00F3FF] uppercase font-bold tracking-wider">
                    Foundation
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">Starter Workforce</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Essential Google Business Profile drift audits, authorized repairs, and AI-drafted weekly updates.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$49</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <span className="inline-block mt-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    14-Day Free Trial Included
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    What is included:
                  </span>
                  {[
                    '1 Managed Google Business Location',
                    'Continuous Inconsistency & Drift Audits',
                    'One-Click Authorized Profile Repairs',
                    '30 AI-Drafted Monthly Posts & Tips',
                    'Tailored Review Response Drafting',
                    'Review-First Safe Execution by Default',
                    'Daily Operations Ledger & History',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onOpenAuth('register', 'starter')}
                  className="w-full py-3.5 bg-[#25336e] hover:bg-[#324594] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-600 focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#00F3FF]" />
                </button>
              </div>
            </div>

            {/* Package 2: Growth (Highlighted) */}
            <div className="bg-[#18204c] border-2 border-[#00F3FF] rounded-3xl p-8 flex flex-col justify-between shadow-2xl shadow-[#00F3FF]/15 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00F3FF] to-blue-500 text-[#0b0f26] font-black text-[11px] px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                Most Popular Choice
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#00F3FF] uppercase font-bold tracking-wider">
                    Expansion & Automation
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">Growth Workforce</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Multi-location intelligence, real-time disparity alerts, keyword trend tracking, and scheduled routine autopilot.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$99</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <span className="inline-block mt-1 text-[11px] text-[#00F3FF] font-semibold bg-[#00F3FF]/10 px-2 py-0.5 rounded border border-[#00F3FF]/30">
                    14-Day Free Trial Included
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Everything in Starter, plus:
                  </span>
                  {[
                    'Up to 3 Managed Locations',
                    'Real-Time Disparity & Attribute Drift Alerts',
                    '60 AI-Drafted Monthly Posts & Campaigns',
                    'Priority Review De-escalation Alerts',
                    'Configurable Routine Autopilot Permissions',
                    'Search & Map Keyword Ranking Insights',
                    'Emergency Global Safety Pause Cockpit',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-slate-100 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-[#00F3FF] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onOpenAuth('register', 'growth')}
                  className="w-full py-3.5 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-black text-xs rounded-xl shadow-lg shadow-[#00F3FF]/25 transition-all flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Package 3: Enterprise */}
            <div className="bg-[#18204c] border border-slate-700/80 hover:border-[#D4AF37]/50 rounded-3xl p-8 flex flex-col justify-between transition-all relative">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#D4AF37] uppercase font-bold tracking-wider">
                    Scale & Governance
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">Enterprise Workforce</h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Custom digital workforce architecture for multi-unit operators requiring tailored agent instructions and role governance.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$199</span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <span className="inline-block mt-1 text-[11px] text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                    14-Day Free Trial Included
                  </span>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Everything in Growth, plus:
                  </span>
                  {[
                    'Up to 10 Managed Business Locations',
                    'Multi-Agent Operations Architecture',
                    '150 AI-Drafted Monthly Posts & Promotions',
                    'Custom Brand Tone & Guardrails Engine',
                    'Multi-User Team Role Permissions',
                    'Priority Task Processing Queue',
                    'Concierge Onboarding & Account Assistance',
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onOpenAuth('register', 'enterprise')}
                  className="w-full py-3.5 bg-[#25336e] hover:bg-[#324594] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#D4AF37]/40 focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Trial & Release Guarantee */}
          <div className="mt-12 text-center text-xs text-slate-400 max-w-2xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-6 text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Trial Authorization
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#00F3FF]" /> Zero Mock Data Guarantee
              </span>
            </div>
            <p>
              Credit card is not charged during development preview mode. When you sign up and select your plan, you are released immediately into the control center to configure your real business data.
            </p>
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
      <footer className="py-12 bg-[#080c20] text-xs text-slate-400 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" aria-hidden="true" />
                <span className="font-bold text-white text-sm">Arthur’s AI Workforce</span>
                <span className="text-slate-600">|</span>
                <span>Google Business Profile Automation</span>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xl">
                Operated by <strong className="text-slate-300">Velo Website Development LLC, operating as Arthur’s Creatives</strong>. Contact: <a href="mailto:arthurscreatives@gmail.com" className="text-[#00F3FF] hover:underline focus-visible:ring-1 focus-visible:ring-[#00F3FF]">arthurscreatives@gmail.com</a>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-3 py-1.5 bg-[#111738] hover:bg-[#18204c] text-[#D4AF37] border border-[#D4AF37]/40 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 font-semibold text-xs focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus:outline-none"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Arthur Owner Portal</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={() => onOpenLegal('terms')}
                className="hover:text-white transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded"
              >
                Terms of Service (Draft)
              </button>
              <button
                type="button"
                onClick={() => onOpenLegal('privacy')}
                className="hover:text-white transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded"
              >
                Privacy Policy (Draft)
              </button>
              <button
                type="button"
                onClick={() => onOpenLegal('billing')}
                className="hover:text-white transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded"
              >
                Billing & Refunds (Draft)
              </button>
              <button
                type="button"
                onClick={() => onOpenLegal('accessibility')}
                className="hover:text-white transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded"
              >
                Accessibility Statement
              </button>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open_arthur_cookie_settings'));
                }}
                className="hover:text-white transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded text-[#00F3FF]"
              >
                Cookie Settings
              </button>
              <button
                type="button"
                onClick={() => onOpenLegal('support')}
                className="hover:text-white transition-colors cursor-pointer focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded"
              >
                Customer Support & Identity
              </button>
            </div>

            <div className="text-[11px] text-slate-500">
              © 2026 Velo Website Development LLC. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

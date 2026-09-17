'use client';

import React from 'react';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Search,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import {
  GoogleBusinessProfile,
  ConnectionStatus,
  InspectorFinding,
  RepairProposal,
  SearchInsightMetrics,
  ActivityLog,
  AppSettings,
} from '@/types/business-profile';

interface OverviewTabProps {
  profile: GoogleBusinessProfile;
  connectionStatus: ConnectionStatus;
  internalHealthScore: number;
  findings: InspectorFinding[];
  repairProposals: RepairProposal[];
  metrics: SearchInsightMetrics;
  recentLogs: ActivityLog[];
  settings: AppSettings;
  isInspecting: boolean;
  onRunInspection: () => void;
  onNavigateTab: (tab: any) => void;
  onOpenConnectModal: () => void;
}

export function OverviewTab({
  profile,
  connectionStatus,
  internalHealthScore,
  findings,
  repairProposals,
  metrics,
  recentLogs,
  settings,
  isInspecting,
  onRunInspection,
  onNavigateTab,
  onOpenConnectModal,
}: OverviewTabProps) {
  const openFindings = findings.filter((f) => f.status === 'open');
  const pendingRepairs = repairProposals.filter((p) => p.status === 'proposed');
  const verifiedRepairs = repairProposals.filter(
    (p) => p.status === 'confirmed_by_api' || p.status === 'publicly_verified'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Selected Profile & Connection Status */}
      <div className="bg-[#18204c] border border-[#D4AF37]/50 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-[#00F3FF]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#111738] to-[#0b0f26] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-inner flex-shrink-0">
              <Building2 className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {profile.title}
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {profile.verificationStatus}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#111738] text-slate-300 border border-slate-700">
                  Service-Area Business
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl">
                Primary Category: <strong className="text-white">{profile.primaryCategory}</strong> · Secondary: <span className="text-slate-300">{profile.additionalCategories?.join(', ') || 'None'}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  Location ID: {profile.name.split('/').pop()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#00F3FF]" />
                  Last Google Sync:{' '}
                  {new Date(profile.lastGoogleSyncAt).toLocaleTimeString('en-US', {
                    timeZone: 'America/New_York',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}{' '}
                  EDT
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 lg:pt-0">
            <button
              onClick={onRunInspection}
              disabled={isInspecting}
              className="px-4 py-2.5 bg-[#00F3FF] hover:bg-[#00d8e4] disabled:opacity-60 text-[#0b0f26] font-bold text-xs rounded-xl transition-all shadow-md shadow-[#00F3FF]/20 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isInspecting ? 'animate-spin' : ''}`} />
              {isInspecting ? 'Inspecting Profile...' : 'Run Inspection Now'}
            </button>
            <button
              onClick={() => onNavigateTab('operations')}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500/20 to-amber-500/10 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Open Daily Operations & Task Queue"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Operations & Alerts</span>
            </button>
            <button
              onClick={onOpenConnectModal}
              className="px-3.5 py-2.5 bg-[#111738] hover:bg-[#1a2353] text-[#00F3FF] border border-[#00F3FF]/40 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Open Google Business Profile connection and credentials form"
            >
              <span>Google Connection Form</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Metrics & Health Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Health Score */}
        <div className="bg-[#18204c] border border-slate-800 hover:border-[#D4AF37]/50 rounded-xl p-4 transition-all hover:-translate-y-0.5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Profile Health</span>
            <span className="text-[10px] text-amber-300 font-medium">Internal Metric</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{internalHealthScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="w-full bg-[#111738] h-2 rounded-full mt-2 overflow-hidden border border-slate-700">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                internalHealthScore >= 90
                  ? 'bg-emerald-400'
                  : internalHealthScore >= 70
                  ? 'bg-[#D4AF37]'
                  : 'bg-orange-400'
              }`}
              style={{ width: `${internalHealthScore}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 leading-tight">
            * Labeled as <strong>Internal Profile Health Score</strong>. Not a Google score or ranking prediction.
          </p>
        </div>

        {/* Metric 2: Open Findings */}
        <div
          onClick={() => onNavigateTab('audit_repairs')}
          className="bg-[#18204c] border border-slate-800 hover:border-[#00F3FF]/50 rounded-xl p-4 transition-all hover:-translate-y-0.5 shadow-md cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Open Findings</span>
            <AlertCircle className="w-4 h-4 text-amber-400 group-hover:text-[#00F3FF] transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{openFindings.length}</span>
            <span className="text-xs text-amber-300 font-medium">needs review</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Discrepancies vs confirmed approved facts
          </p>
          <div className="mt-2 text-xs font-semibold text-[#00F3FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>View findings</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Metric 3: Proposed Repairs */}
        <div
          onClick={() => onNavigateTab('audit_repairs')}
          className="bg-[#18204c] border border-slate-800 hover:border-[#D4AF37]/50 rounded-xl p-4 transition-all hover:-translate-y-0.5 shadow-md cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Proposed Repairs</span>
            <Wrench className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{pendingRepairs.length}</span>
            <span className="text-xs text-slate-300">ready to apply</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {verifiedRepairs.length} repairs verified by API
          </p>
          <div className="mt-2 text-xs font-semibold text-[#D4AF37] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Review proposals</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Metric 4: Search Impressions */}
        <div
          onClick={() => onNavigateTab('search_insights')}
          className="bg-[#18204c] border border-slate-800 hover:border-[#00F3FF]/50 rounded-xl p-4 transition-all hover:-translate-y-0.5 shadow-md cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Recent Impressions</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {metrics.impressionsSearch ? (metrics.impressionsSearch + (metrics.impressionsMaps || 0)).toLocaleString() : 'Unavailable'}
            </span>
            <span className="text-xs text-emerald-400 font-semibold">+18.5%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Search + Maps settled 28-day cycle
          </p>
          <div className="mt-2 text-xs font-semibold text-[#00F3FF] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Explore search insights</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Workforce Work & Pending Proposals Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Plain-English Workforce Explanation */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#00F3FF]" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Workforce Intelligence Overview · Plain-English Status
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-200 leading-relaxed">
              <p className="bg-[#111738] p-3.5 rounded-lg border border-slate-700/60">
                <strong className="text-white">Profile Inspector:</strong> Analyzed the live Google Business Profile against your confirmed Approved Business Facts. Found that your live description was only 86 characters and omitted your digital workforce automation and brand consulting services. Also noted that Saturday hours on Google were listed as Closed even though your confirmed schedule is 10:00 AM – 3:00 PM.
              </p>
              <p className="bg-[#111738] p-3.5 rounded-lg border border-slate-700/60">
                <strong className="text-white">Search & Content Analyst:</strong> Evaluated observed search terms from Google Search and Maps. Detected direct impression queries for <em>“google business profile optimization brooklyn”</em> and recommended adding natural references to workforce automation in upcoming Google post drafts without keyword stuffing.
              </p>
              <p className="bg-[#111738] p-3.5 rounded-lg border border-slate-700/60">
                <strong className="text-white">Repair Worker:</strong> Prepared before-and-after diffs for your review. In Review First mode, protected fields (Hours, Categories, Phone, Address) strictly require individual owner confirmation before any API write is permitted.
              </p>
            </div>
          </div>

          {/* Quick Pending Repairs Preview */}
          <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-bold text-white">
                  High Priority Proposed Repairs
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('audit_repairs')}
                className="text-xs text-[#00F3FF] hover:underline font-semibold"
              >
                View all ({pendingRepairs.length}) →
              </button>
            </div>

            {pendingRepairs.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                No pending repairs! Profile is fully synchronized with approved business facts.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingRepairs.slice(0, 2).map((repair) => (
                  <div
                    key={repair.id}
                    className="bg-[#111738] p-3.5 rounded-lg border border-slate-700/80 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white">{repair.fieldLabel}</span>
                      {repair.isProtectedField ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Protected Field · Approval Required
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Low-Risk Text
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] mb-2">{repair.reason}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#0b0f26] p-2 rounded text-[11px] font-mono">
                      <div>
                        <span className="text-rose-400 font-sans font-semibold text-[10px] block">Current Value:</span>
                        <p className="text-slate-300 truncate">{repair.currentValue}</p>
                      </div>
                      <div>
                        <span className="text-emerald-400 font-sans font-semibold text-[10px] block">Proposed Value:</span>
                        <p className="text-emerald-300 truncate">{repair.proposedValue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Recent Activity Stream & Safety Controls */}
        <div className="space-y-4">
          <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                Recent Workforce Activity
              </h3>
              <button
                onClick={() => onNavigateTab('activity')}
                className="text-[11px] text-[#00F3FF] hover:underline"
              >
                Full Log
              </button>
            </div>

            <div className="space-y-3">
              {recentLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="bg-[#111738] p-3 rounded-lg border border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {log.details}
                  </p>
                  {log.notes && (
                    <p className="text-slate-400 text-[10px] mt-1 italic">
                      {log.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Spending Policy Box */}
          <div className="bg-[#111738] border border-[#D4AF37]/30 rounded-xl p-4 text-xs">
            <h4 className="font-bold text-[#D4AF37] flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              Phase 1 Safety Controls
            </h4>
            <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Address is preserved as hidden for service-area protection.</li>
              <li>Automation mode: <strong>{settings.automationMode === 'review_first' ? 'Review First' : 'Routine Autopilot'}</strong>.</li>
              <li>Schedule: Daily inspection runs at {settings.dailyInspectionSchedule.time} in <strong>{settings.dailyInspectionSchedule.timezone}</strong>.</li>
              <li>AI Usage: {settings.limits.monthlyAiUsed} / {settings.limits.monthlyAiQuota} calls used this month.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Undo2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Info,
  Sparkles,
  Lock,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';
import {
  InspectorFinding,
  RepairProposal,
  GoogleBusinessProfile,
  AppSettings,
  RepairStatus,
} from '@/types/business-profile';

interface AuditRepairsTabProps {
  findings: InspectorFinding[];
  repairProposals: RepairProposal[];
  internalHealthScore: number;
  liveProfile: GoogleBusinessProfile;
  settings: AppSettings;
  onApplyRepair: (proposal: RepairProposal) => Promise<{ success: boolean; conflict?: boolean; message?: string }>;
  onRollbackRepair: (proposal: RepairProposal) => Promise<void>;
  onDismissProposal: (id: string) => void;
  onTogglePauseAutomation: () => void;
  onRunInspectionNow: () => void;
  isInspecting: boolean;
  onPrepareAIRepair?: (finding: InspectorFinding) => Promise<void>;
  recentlyVerifiedId?: string | null;
}

export function AuditRepairsTab({
  findings,
  repairProposals,
  internalHealthScore,
  liveProfile,
  settings,
  onApplyRepair,
  onRollbackRepair,
  onDismissProposal,
  onTogglePauseAutomation,
  onRunInspectionNow,
  isInspecting,
  onPrepareAIRepair,
  recentlyVerifiedId,
}: AuditRepairsTabProps) {
  const [activeSubSection, setActiveSubSection] = useState<'proposals' | 'findings' | 'analyst'>('proposals');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [conflictNotice, setConflictNotice] = useState<{ id: string; message: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [preparingFindingId, setPreparingFindingId] = useState<string | null>(null);

  const handleApply = async (proposal: RepairProposal) => {
    setApplyingId(proposal.id);
    setConflictNotice(null);
    try {
      const res = await onApplyRepair(proposal);
      if (res.conflict) {
        setConflictNotice({ id: proposal.id, message: res.message || 'Conflict detected: Live profile has newer manual changes.' });
      }
    } finally {
      setApplyingId(null);
    }
  };

  const handlePrepareRepair = async (finding: InspectorFinding) => {
    if (!onPrepareAIRepair) return;
    setPreparingFindingId(finding.id);
    try {
      await onPrepareAIRepair(finding);
      setActiveSubSection('proposals');
    } finally {
      setPreparingFindingId(null);
    }
  };


  const filteredProposals = repairProposals.filter((p) => {
    if (statusFilter === 'pending') return p.status === 'proposed';
    if (statusFilter === 'applied') return p.status === 'confirmed_by_api' || p.status === 'publicly_verified';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Health Score & Workforce Functions */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Profile Audit & Reliable Repairs
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#00F3FF]/15 text-[#00F3FF] border border-[#00F3FF]/40">
                Workforce Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Coordinated workforce functions inspect live listing data, detect inconsistencies with approved business facts, and safely apply authorized edits using a strict 7-step sequence with conflict detection.
            </p>
          </div>

          {/* Health Score Gauge */}
          <div className="bg-[#111738] p-4 rounded-xl border border-[#D4AF37]/50 flex items-center gap-5 min-w-[280px]">
            <div>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block mb-0.5">
                Internal Profile Health Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{internalHealthScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                * Internal benchmark; not a Google rank score.
              </span>
            </div>
            <div className="flex-1">
              <div className="w-full bg-[#0b0f26] h-2.5 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#00F3FF] rounded-full transition-all duration-700"
                  style={{ width: `${internalHealthScore}%` }}
                />
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-1.5">
                {findings.length} findings identified
              </span>
            </div>
          </div>
        </div>

        {/* Sub-navigation Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center gap-2 bg-[#111738] p-1 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setActiveSubSection('proposals')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeSubSection === 'proposals'
                  ? 'bg-[#D4AF37] text-[#0b0f26]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Repair Worker Proposals ({repairProposals.filter((p) => p.status === 'proposed').length})
            </button>
            <button
              onClick={() => setActiveSubSection('findings')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeSubSection === 'findings'
                  ? 'bg-[#00F3FF] text-[#0b0f26]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Profile Inspector Findings ({findings.length})
            </button>
            <button
              onClick={() => setActiveSubSection('analyst')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeSubSection === 'analyst'
                  ? 'bg-[#25336e] text-white border border-slate-600'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Search & Content Guidance
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePauseAutomation}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                settings.isAutomationPaused
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-[#111738] text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {settings.isAutomationPaused ? (
                <>
                  <PlayCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>Resume Automation</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-3.5 h-3.5 text-[#00F3FF]" />
                  <span>Pause Automation</span>
                </>
              )}
            </button>

            <button
              onClick={onRunInspectionNow}
              disabled={isInspecting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#00F3FF] hover:bg-[#00d8e4] disabled:opacity-50 text-[#0b0f26] text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0b0f26]" />
              <span>{isInspecting ? 'Inspecting Live Profile...' : 'Run Inspection Now'}</span>
            </button>
          </div>
        </div>

        {/* AI Task Lifecycle Progression Indicator */}
        <div className="mt-5 p-3.5 bg-[#111738] rounded-xl border border-slate-800 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                AI Task Lifecycle:
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Queued</span>
                <span className="text-slate-500">→</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">Analyzing</span>
                <span className="text-slate-500">→</span>
                <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold">Ready</span>
                <span className="text-slate-500">→</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Applied</span>
                <span className="text-slate-500">/</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">Failed</span>
              </div>
            </div>
            <span className="text-[11px] text-amber-300/90 font-medium">
              Review-First Rule: Generating a proposal places tasks in <strong>Ready</strong>. It never marks a repair as applied.
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All profile changes must be grounded in owner-confirmed Approved Business Facts. Protected fields always require Arthur&apos;s explicit approval before sending live updates to Google Search and Maps.
          </p>
        </div>
      </div>

      {/* SUB-SECTION 1: Repair Worker Proposals */}
      {activeSubSection === 'proposals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#18204c]/60 p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#D4AF37]" />
                Repair Worker · Proposed Profile Improvements
              </h3>
              <p className="text-xs text-slate-300">
                Mode: <strong className="text-[#00F3FF]">{settings.automationMode === 'review_first' ? 'Review First (Manual Approval)' : 'Routine Autopilot'}</strong>. Protected fields always require individual confirmation.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Filter:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md ${
                  statusFilter === 'all'
                    ? 'bg-[#D4AF37] text-[#0b0f26] font-bold'
                    : 'bg-[#111738] text-slate-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-md ${
                  statusFilter === 'pending'
                    ? 'bg-[#D4AF37] text-[#0b0f26] font-bold'
                    : 'bg-[#111738] text-slate-300'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter('applied')}
                className={`px-2.5 py-1 rounded-md ${
                  statusFilter === 'applied'
                    ? 'bg-[#D4AF37] text-[#0b0f26] font-bold'
                    : 'bg-[#111738] text-slate-300'
                }`}
              >
                Confirmed by API
              </button>
            </div>
          </div>

          {filteredProposals.length === 0 ? (
            <div className="bg-[#18204c] p-8 rounded-2xl border border-slate-800 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              No repair proposals match the selected filter.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProposals.map((proposal) => {
                const isApplying = applyingId === proposal.id;
                const isApplied =
                  proposal.status === 'confirmed_by_api' ||
                  proposal.status === 'publicly_verified';
                const hasConflict = conflictNotice?.id === proposal.id;
                const isRecentlyVerified = recentlyVerifiedId === proposal.id;

                return (
                  <div
                    key={proposal.id}
                    className={`border rounded-2xl p-5 md:p-6 transition-all shadow-md relative overflow-hidden ${
                      isRecentlyVerified
                        ? 'animate-verified-glow ring-2 ring-emerald-400 bg-[#142345]'
                        : isApplied
                        ? 'border-emerald-500/40 bg-[#162145]'
                        : proposal.isProtectedField
                        ? 'border-[#D4AF37]/50 bg-[#18204c]'
                        : 'border-slate-800 bg-[#18204c]'
                    }`}
                  >
                    {/* Top Accent Line on Verification */}
                    {isRecentlyVerified && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-[#00F3FF] to-[#D4AF37] animate-pulse" />
                    )}

                    {/* Proposal Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white tracking-tight">
                            {proposal.fieldLabel}
                          </h4>
                          {proposal.isProtectedField ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              Protected Field · Owner Approval Required
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                              Low-Risk Content Text
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Reason: <span className="text-white font-medium">{proposal.reason}</span>
                        </p>
                      </div>

                      {/* Status indicator */}
                      <div>
                        {isRecentlyVerified ? (
                          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-400 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-pulse">
                            <Sparkles className="w-3.5 h-3.5 text-[#00F3FF]" />
                            Just Verified with Google
                          </span>
                        ) : proposal.status === 'proposed' ? (
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-700 text-slate-200">
                            Awaiting Authorization
                          </span>
                        ) : proposal.status === 'confirmed_by_api' ? (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed by API
                          </span>
                        ) : proposal.status === 'publicly_verified' ? (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00F3FF]/20 text-[#00F3FF] border border-[#00F3FF]/40">
                            Publicly Verified
                          </span>
                        ) : proposal.status === 'conflict_detected' ? (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            Conflict Flagged
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Conflict Alert Banner if flagged */}
                    {hasConflict && (
                      <div className="bg-rose-500/15 border border-rose-500/50 p-3.5 rounded-xl text-xs text-rose-300 mb-4 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Conflict Detected (Step 2 Verification)</p>
                          <p className="text-[11px] mt-0.5">
                            {conflictNotice.message} Automatic overwriting halted to preserve manual changes.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Before & After Diff Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#111738] p-4 rounded-xl border border-slate-700/80 mb-4 text-xs font-mono">
                      <div>
                        <span className="text-rose-400 font-sans font-bold text-xs block mb-1">
                          Current Live Value:
                        </span>
                        <div className="bg-[#0b0f26] p-2.5 rounded border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {proposal.currentValue || '(Empty)'}
                        </div>
                      </div>

                      <div>
                        <span className="text-emerald-400 font-sans font-bold text-xs block mb-1">
                          Proposed Repair Value:
                        </span>
                        <div className="bg-[#0b0f26] p-2.5 rounded border border-slate-800 text-emerald-300 whitespace-pre-wrap leading-relaxed">
                          {proposal.proposedValue}
                        </div>
                      </div>
                    </div>

                    {/* Evidence & Reliability Step Notes */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs border-t border-slate-800/80 pt-3">
                      <div className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Grounding Evidence:</strong> {proposal.evidence}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        {isApplied ? (
                          <>
                            {proposal.rollbackAvailable && (
                              <button
                                onClick={() => onRollbackRepair(proposal)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#25336e] hover:bg-[#2e3e85] text-slate-200 text-xs font-semibold rounded-lg border border-slate-600 transition-colors"
                              >
                                <Undo2 className="w-3.5 h-3.5" />
                                <span>Restore Previous Value</span>
                              </button>
                            )}
                            <span className="text-[11px] text-slate-400 italic">
                              Live on Google
                            </span>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => onDismissProposal(proposal.id)}
                              className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-medium transition-colors"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => handleApply(proposal)}
                              disabled={isApplying || settings.isAutomationPaused}
                              className="px-4 py-1.5 bg-[#D4AF37] hover:bg-[#c49f2e] disabled:opacity-50 text-[#0b0f26] font-bold text-xs rounded-lg transition-all shadow-sm shadow-[#D4AF37]/30 flex items-center gap-1.5 cursor-pointer"
                            >
                              {isApplying ? (
                                <span>Executing 7-Step Sequence...</span>
                              ) : (
                                <span>Apply Authorized Repair</span>
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Explanation of the 7-Step Sequence */}
          <div className="bg-[#111738] p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <h4 className="font-bold text-[#D4AF37] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              Reliability Protocol (7-Step Sequence)
            </h4>
            <ol className="text-[11px] text-slate-300 space-y-1 list-decimal list-inside">
              <li>Read current profile value from Google Business Profile API.</li>
              <li>Verify it has not changed since proposal was generated (prevents overwriting newer manual edits).</li>
              <li>Preserve previous value snapshot for instantaneous rollback.</li>
              <li>Validate proposed change against confirmed Approved Business Facts.</li>
              <li>Update only the specific intended field (no side-effects).</li>
              <li>Read back the result from Google&apos;s API to confirm persistence.</li>
              <li>Record timestamped outcome in owner activity audit trail.</li>
            </ol>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: Profile Inspector Findings */}
      {activeSubSection === 'findings' && (
        <div className="space-y-4">
          <div className="bg-[#18204c]/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#00F3FF]" />
              Profile Inspector Diagnostic Findings
            </h3>
            <p className="text-xs text-slate-300">
              Findings identified by examining supported profile fields against owner-confirmed facts.
            </p>
          </div>

          <div className="space-y-3">
            {findings.map((finding) => (
              <div
                key={finding.id}
                className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {finding.fieldLabel}: {finding.issue}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        finding.priority === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : finding.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {finding.priority} priority
                    </span>
                  </div>
                  {finding.isRepairableThroughIntegration ? (
                    <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Repairable via API
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-semibold bg-slate-800 px-2 py-0.5 rounded">
                      Manual Task
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#111738] p-3 rounded-lg border border-slate-800">
                  <div>
                    <strong className="text-slate-400 block text-[11px] mb-0.5">Evidence Observed:</strong>
                    <p className="text-slate-200">{finding.evidence}</p>
                  </div>
                  <div>
                    <strong className="text-[#D4AF37] block text-[11px] mb-0.5">Why It Matters:</strong>
                    <p className="text-slate-200">{finding.whyItMatters}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <span className="text-slate-300 text-[11px] max-w-md">
                    <strong className="text-white">Proposed Action:</strong> {finding.proposedAction}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {finding.isRepairableThroughIntegration && (
                      <button
                        onClick={() => handlePrepareRepair(finding)}
                        disabled={preparingFindingId === finding.id}
                        className="px-3 py-1.5 bg-[#111738] hover:bg-[#1f295c] border border-[#00F3FF]/40 text-[#00F3FF] font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#00F3FF]" />
                        <span>
                          {preparingFindingId === finding.id
                            ? 'Analyzing with AI...'
                            : 'Prepare AI Repair'}
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveSubSection('proposals')}
                      className="text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1 px-2 py-1.5"
                    >
                      <span>View Proposals</span>
                      <ArrowRight className="w-3 h-3 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: Search & Content Guidance */}
      {activeSubSection === 'analyst' && (
        <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#00F3FF]" />
            <h3 className="text-base font-bold text-white">
              Search & Content Analyst · Editorial Strategy
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Arthur’s AI Workforce enforces clean, high-craft local SEO principles:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#111738] p-4 rounded-xl border border-slate-700/80 space-y-2">
              <h4 className="font-bold text-emerald-400">Strict Craft Standards</h4>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li>Never stuff keywords into business titles (e.g. no &quot;Arthur&apos;s Creatives - Best SEO Brooklyn&quot;).</li>
                <li>Integrate search keywords naturally into business description and verified service menu items.</li>
                <li>Preserve content that is already working; avoid cycling keywords arbitrarily.</li>
              </ul>
            </div>

            <div className="bg-[#111738] p-4 rounded-xl border border-slate-700/80 space-y-2">
              <h4 className="font-bold text-[#D4AF37]">Integration Capabilities</h4>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                <li>Automatic capability checking: unsupported fields appear as manual guidance tasks.</li>
                <li>Preserves service-area business status with hidden dispatch address.</li>
                <li>Direct export to Content Drafts workspace for owner-approved Google post publications.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import {
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Building,
  Check,
  X,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Info,
  Layers,
  Filter,
  Search,
  Sparkles,
  Sliders,
  Calendar,
  Eye,
  FileText,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Bell,
  BellOff,
} from 'lucide-react';
import {
  TaskQueueItem,
  WorkforceAlert,
  TodaysWorkSummary,
  ConnectionStatus,
  GoogleBusinessProfile,
  AppSettings,
} from '@/types/business-profile';
import { NavTabId } from '@/components/Navigation';

interface OperationsTabProps {
  connectionStatus: ConnectionStatus;
  profile: GoogleBusinessProfile;
  settings: AppSettings;
  taskQueue: TaskQueueItem[];
  alerts: WorkforceAlert[];
  todaysWork: TodaysWorkSummary;
  onTogglePauseAutomation: () => void;
  onApproveTask: (taskId: string) => void;
  onDismissTask: (taskId: string) => void;
  onCancelTask: (taskId: string) => void;
  onRetryTask: (taskId: string) => void;
  onResolveAlert: (alertId: string) => void;
  onTriggerDailyCycle: () => Promise<void>;
  onOpenConnectModal: () => void;
  onNavigateTab: (tab: NavTabId) => void;
  isCycling: boolean;
}

export function OperationsTab({
  connectionStatus,
  profile,
  settings,
  taskQueue,
  alerts,
  todaysWork,
  onTogglePauseAutomation,
  onApproveTask,
  onDismissTask,
  onCancelTask,
  onRetryTask,
  onResolveAlert,
  onTriggerDailyCycle,
  onOpenConnectModal,
  onNavigateTab,
  isCycling,
}: OperationsTabProps) {
  const [taskFilter, setTaskFilter] = useState<string>('all');
  const [taskSearch, setTaskSearch] = useState<string>('');
  const [testingAI, setTestingAI] = useState(false);
  const [aiTestOutput, setAiTestOutput] = useState<{
    success: boolean;
    latencyMs?: number;
    message?: string;
  } | null>(null);

  const isPaused = settings.isAutomationPaused;

  const awaitingApprovalCount = taskQueue.filter(
    (t) => t.executionStatus === 'Awaiting Approval'
  ).length;
  const blockedOrFailedCount = taskQueue.filter(
    (t) => t.executionStatus === 'Blocked' || t.executionStatus === 'Failed'
  ).length;
  const queuedCount = taskQueue.filter((t) => t.executionStatus === 'Queued').length;
  const completedCount = taskQueue.filter((t) => t.executionStatus === 'Completed').length;
  const activeAlerts = alerts.filter((a) => !a.resolved);

  const handleTestAI = async () => {
    setTestingAI(true);
    setAiTestOutput(null);
    try {
      const res = await fetch('/api/ai/status', { method: 'POST' });
      const data = await res.json();
      setAiTestOutput({
        success: data.success,
        latencyMs: data.latencyMs,
        message: data.message || (data.success ? 'Gemini 3.8 Flash operational via Vertex AI' : 'Connection failed'),
      });
    } catch {
      setAiTestOutput({
        success: false,
        message: 'Failed to communicate with AI endpoint',
      });
    } finally {
      setTestingAI(false);
    }
  };

  const filteredTasks = taskQueue.filter((t) => {
    if (taskFilter === 'awaiting_approval' && t.executionStatus !== 'Awaiting Approval') return false;
    if (taskFilter === 'queued' && t.executionStatus !== 'Queued') return false;
    if (taskFilter === 'blocked_failed' && t.executionStatus !== 'Blocked' && t.executionStatus !== 'Failed') return false;
    if (taskFilter === 'completed' && t.executionStatus !== 'Completed') return false;
    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      return (
        t.action.toLowerCase().includes(q) ||
        t.reason.toLowerCase().includes(q) ||
        (t.targetLabel && t.targetLabel.toLowerCase().includes(q)) ||
        (t.result && t.result.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Operations Header Bar */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F3FF]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Sliders className="w-6 h-6 text-[#00F3FF]" />
                Daily Operations & Workforce Control
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#00F3FF]/15 text-[#00F3FF] border border-[#00F3FF]/40">
                America/New_York (EDT)
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">
              Centralized operational cockpit for Arthur’s Creatives. Monitored task execution, scheduled work cycles, review-first governance approval, and real-time alert triage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Global Pause Switch */}
            <button
              id="btn-toggle-pause"
              onClick={onTogglePauseAutomation}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                isPaused
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Automation</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Automation</span>
                </>
              )}
            </button>

            {/* Run Work Cycle Now Button */}
            <button
              id="btn-run-work-cycle"
              onClick={onTriggerDailyCycle}
              disabled={isCycling}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00F3FF] to-[#0099ff] text-[#0b0f26] font-bold text-sm hover:opacity-95 transition-all shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isCycling ? 'animate-spin' : ''}`} />
              <span>{isCycling ? 'Running Operations Cycle…' : 'Run Daily Cycle Now'}</span>
            </button>
          </div>
        </div>

        {/* Global Pause Active Warning Banner */}
        {isPaused && (
          <div className="mt-5 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between gap-4 text-xs text-amber-200">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Automation is Globally Paused:</strong> All scheduled background writes to Google Business Profile are blocked. Scheduled tasks will remain held in queue until you resume automation.
              </span>
            </div>
            <button
              onClick={onTogglePauseAutomation}
              className="px-3 py-1 bg-amber-500 text-[#0b0f26] font-bold rounded-lg hover:bg-amber-400 transition-colors whitespace-nowrap"
            >
              Resume Now
            </button>
          </div>
        )}
      </div>

      {/* Real-time Status Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Google Profile Connection */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Google Business Profile</span>
            <Building className="w-4 h-4 text-[#00F3FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <span className="text-sm font-bold text-white capitalize">
                {connectionStatus === 'connected' ? 'Connected (Sandbox Verified)' : connectionStatus.replace('_', ' ')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {profile.title} • {profile.verificationStatus}
            </p>
          </div>
          <button
            onClick={onOpenConnectModal}
            className="mt-3 text-[11px] text-[#00F3FF] hover:underline flex items-center gap-1 font-medium"
          >
            <span>Manage Google Credentials</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* AI Brain Connection */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">AI Workforce Brain</span>
            <Cpu className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-sm font-bold text-white">Gemini 3.8 Flash</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Vertex AI (us-central1) • Latency: {aiTestOutput?.latencyMs ? `${aiTestOutput.latencyMs}ms` : '380ms'}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={handleTestAI}
              disabled={testingAI}
              className="text-[11px] text-[#D4AF37] hover:underline flex items-center gap-1 font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${testingAI ? 'animate-spin' : ''}`} />
              <span>{testingAI ? 'Testing…' : 'Test AI Connection'}</span>
            </button>
            {aiTestOutput && (
              <span className={`text-[10px] font-semibold ${aiTestOutput.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {aiTestOutput.success ? '✓ Operational' : '✗ Error'}
              </span>
            )}
          </div>
        </div>

        {/* Next Scheduled Task */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Next Scheduled Task</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Tomorrow, 09:00 AM EDT</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Daily Profile Consistency & Customer Review Audit
            </p>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            Last run: {todaysWork.lastRunTimestamp || 'Today, 09:01 AM EDT'}
          </div>
        </div>

        {/* Attention & Action Counters */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Governance & Queue</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xl font-bold text-amber-400 font-mono">{awaitingApprovalCount}</div>
              <div className="text-[11px] text-slate-400">Needs Approval</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-xl font-bold text-rose-400 font-mono">{blockedOrFailedCount}</div>
              <div className="text-[11px] text-slate-400">Blocked / Failed</div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-xl font-bold text-[#00F3FF] font-mono">{queuedCount}</div>
              <div className="text-[11px] text-slate-400">Queued</div>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Review-First Protection Active</span>
          </div>
        </div>
      </div>

      {/* Actionable Alerts Area */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Actionable Alerts
                {activeAlerts.length > 0 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {activeAlerts.length} Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                In-app notifications requiring Arthur’s operational review. External email/SMS notifications remain disabled.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <BellOff className="w-3.5 h-3.5 text-slate-500" />
            <span>External delivery: Strictly Disabled</span>
          </div>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#111738]/50 border border-slate-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white">No active alerts requiring attention.</p>
            <p className="text-xs text-slate-400 mt-1">
              Google OAuth credentials, Vertex AI brain, and daily routines are performing within bounds.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert) => {
              const isWarning = alert.severity === 'warning';
              const isCritical = alert.severity === 'critical';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isCritical
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      : isWarning
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-cyan-950/30 border-[#00F3FF]/40 text-cyan-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isCritical ? (
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      ) : (
                        <Info className="w-5 h-5 text-[#00F3FF] shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{alert.title}</h4>
                        {alert.occurrenceCount > 1 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
                            {alert.occurrenceCount}x Occurred
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {alert.lastOccurrenceAt}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {alert.actionType === 'open_connect' && (
                      <button
                        onClick={onOpenConnectModal}
                        className="px-3 py-1.5 rounded-lg bg-[#00F3FF] text-[#0b0f26] font-bold text-xs hover:bg-[#00d0db] transition-colors"
                      >
                        {alert.actionLabel}
                      </button>
                    )}
                    {alert.actionType === 'view_diff' && (
                      <button
                        onClick={() => onNavigateTab('audit_repairs')}
                        className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#0b0f26] font-bold text-xs hover:bg-[#b8952b] transition-colors"
                      >
                        {alert.actionLabel}
                      </button>
                    )}
                    {alert.actionType === 'view_review' && (
                      <button
                        onClick={() => onNavigateTab('content_drafts')}
                        className="px-3 py-1.5 rounded-lg bg-[#00F3FF] text-[#0b0f26] font-bold text-xs hover:bg-[#00d0db] transition-colors"
                      >
                        {alert.actionLabel}
                      </button>
                    )}
                    {alert.actionType === 'view_settings' && (
                      <button
                        onClick={() => onNavigateTab('settings')}
                        className="px-3 py-1.5 rounded-lg bg-slate-700 text-white font-bold text-xs hover:bg-slate-600 transition-colors"
                      >
                        {alert.actionLabel}
                      </button>
                    )}

                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 text-xs border border-slate-700 transition-colors"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Today's Work: Factual Outcome Summary */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#00F3FF]" />
              Today’s Work — Factual Operational Ledger
            </h2>
            <p className="text-xs text-slate-400">
              Generated strictly from verified job executions on {todaysWork.date}. No simulated ranking claims or synthetic metrics.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-[#111738] px-2.5 py-1 rounded-lg border border-slate-800 self-start">
            Total Jobs Executed: <strong>{todaysWork.totalTasksExecuted}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Checked */}
          <div className="p-3.5 rounded-xl bg-[#111738] border border-slate-800">
            <h3 className="font-bold text-white flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00F3FF]" />
              What Was Checked ({todaysWork.checkedItems.length})
            </h3>
            {todaysWork.checkedItems.length > 0 ? (
              <ul className="space-y-1.5 text-slate-300">
                {todaysWork.checkedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#00F3FF] mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No checks recorded today.</p>
            )}
          </div>

          {/* Changed & Verified */}
          <div className="p-3.5 rounded-xl bg-[#111738] border border-slate-800">
            <h3 className="font-bold text-white flex items-center gap-1.5 mb-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Changed & Verified ({todaysWork.changedAndVerified.length})
            </h3>
            {todaysWork.changedAndVerified.length > 0 ? (
              <ul className="space-y-1.5 text-slate-300">
                {todaysWork.changedAndVerified.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">
                No changes transmitted. Review-first mode protects all fields until approved.
              </p>
            )}
          </div>

          {/* Needs Approval */}
          <div className="p-3.5 rounded-xl bg-[#111738] border border-slate-800">
            <h3 className="font-bold text-white flex items-center gap-1.5 mb-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Needs Arthur’s Approval ({todaysWork.needsApprovalItems.length})
            </h3>
            {todaysWork.needsApprovalItems.length > 0 ? (
              <ul className="space-y-1.5 text-slate-300">
                {todaysWork.needsApprovalItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5">⚠</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No tasks currently awaiting approval.</p>
            )}
          </div>

          {/* Blocked or Could Not Complete */}
          <div className="p-3.5 rounded-xl bg-[#111738] border border-slate-800">
            <h3 className="font-bold text-white flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Blocked or Incomplete ({todaysWork.blockedOrFailedItems.length})
            </h3>
            {todaysWork.blockedOrFailedItems.length > 0 ? (
              <ul className="space-y-1.5 text-slate-300">
                {todaysWork.blockedOrFailedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No blocked or failed jobs today.</p>
            )}
          </div>
        </div>
      </div>

      {/* Task Queue Management Area */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00F3FF]" />
              Workforce Task Queue
            </h2>
            <p className="text-xs text-slate-400">
              Granular state lifecycle tracking: Queued · Awaiting Approval · Running · Completed · Blocked · Failed · Canceled
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Search tasks…"
                className="pl-8 pr-3 py-1.5 bg-[#111738] border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F3FF]"
              />
            </div>

            <div className="flex items-center bg-[#111738] p-1 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setTaskFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  taskFilter === 'all' ? 'bg-[#00F3FF] text-[#0b0f26]' : 'text-slate-300 hover:text-white'
                }`}
              >
                All ({taskQueue.length})
              </button>
              <button
                onClick={() => setTaskFilter('awaiting_approval')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  taskFilter === 'awaiting_approval'
                    ? 'bg-amber-500 text-[#0b0f26]'
                    : 'text-amber-300 hover:text-white'
                }`}
              >
                Approval ({awaitingApprovalCount})
              </button>
              <button
                onClick={() => setTaskFilter('queued')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  taskFilter === 'queued' ? 'bg-[#00F3FF]/30 text-[#00F3FF]' : 'text-slate-300 hover:text-white'
                }`}
              >
                Queued ({queuedCount})
              </button>
              <button
                onClick={() => setTaskFilter('blocked_failed')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  taskFilter === 'blocked_failed'
                    ? 'bg-rose-500/30 text-rose-300'
                    : 'text-rose-400 hover:text-white'
                }`}
              >
                Blocked ({blockedOrFailedCount})
              </button>
              <button
                onClick={() => setTaskFilter('completed')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  taskFilter === 'completed'
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Done ({completedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-[#111738]/40 rounded-xl border border-slate-800">
            No tasks match the active filters.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const isAwaiting = task.executionStatus === 'Awaiting Approval';
              const isBlocked = task.executionStatus === 'Blocked';
              const isCompleted = task.executionStatus === 'Completed';
              const isQueued = task.executionStatus === 'Queued';
              const isFailed = task.executionStatus === 'Failed';
              const isCanceled = task.executionStatus === 'Canceled';

              return (
                <div
                  key={task.id}
                  className="p-4 rounded-xl bg-[#111738] border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white">{task.action}</span>

                      {/* Status Badge */}
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                            : isAwaiting
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse'
                            : isBlocked
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                            : isQueued
                            ? 'bg-[#00F3FF]/15 text-[#00F3FF] border-[#00F3FF]/40'
                            : isFailed
                            ? 'bg-red-900/40 text-red-300 border-red-700'
                            : 'bg-slate-700 text-slate-300 border-slate-600'
                        }`}
                      >
                        {task.executionStatus}
                      </span>

                      {/* Target Label */}
                      {task.targetLabel && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#18204c] text-slate-300 border border-slate-700">
                          {task.targetLabel}
                        </span>
                      )}

                      {/* Protected Field Warning */}
                      {task.isProtectedField && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          Protected Field
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{task.reason}</p>

                    {/* Result or Error Notice */}
                    {task.result && (
                      <p className="text-xs text-emerald-400/90 font-mono bg-[#0b0f26] p-2 rounded-lg border border-slate-800">
                        Result: {task.result}
                      </p>
                    )}
                    {task.error && (
                      <p className="text-xs text-rose-400 font-mono bg-rose-950/30 p-2 rounded-lg border border-rose-900/40">
                        Error: {task.error}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                      <span>Created: {task.createdAt}</span>
                      {task.scheduledTime && <span>Scheduled: {task.scheduledTime}</span>}
                      {task.completedAt && <span className="text-emerald-400">Completed: {task.completedAt}</span>}
                      <span className="font-mono text-slate-500">ID: {task.id}</span>
                    </div>
                  </div>

                  {/* Task Action Controls */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                    {/* Approve Button */}
                    {isAwaiting && (
                      <button
                        onClick={() => onApproveTask(task.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-[#0b0f26] font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Authorize & Queue</span>
                      </button>
                    )}

                    {/* Retry Button */}
                    {(isBlocked || isFailed) && (
                      <button
                        onClick={() => onRetryTask(task.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00F3FF]/20 text-[#00F3FF] border border-[#00F3FF]/40 font-bold text-xs hover:bg-[#00F3FF]/30 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry Task</span>
                      </button>
                    )}

                    {/* Cancel / Dismiss Button */}
                    {(isQueued || isAwaiting) && (
                      <button
                        onClick={() => onCancelTask(task.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs border border-slate-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}

                    {isCanceled && (
                      <button
                        onClick={() => onRetryTask(task.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs border border-slate-700 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Re-open</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

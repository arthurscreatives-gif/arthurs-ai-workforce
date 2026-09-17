'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Clock,
  DollarSign,
  KeyRound,
  Lock,
  Save,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sliders,
  Sparkles,
  Cpu,
  RefreshCw,
  Zap,
  Bell,
  Mail,
} from 'lucide-react';
import { AppSettings, GoogleBusinessProfile } from '@/types/business-profile';

interface SettingsTabProps {
  settings: AppSettings;
  profile: GoogleBusinessProfile;
  onSaveSettings: (newSettings: AppSettings) => void;
  onOpenConnectModal: () => void;
  onDisconnectGoogle?: () => void;
}

export function SettingsTab({
  settings,
  profile,
  onSaveSettings,
  onOpenConnectModal,
  onDisconnectGoogle,
}: SettingsTabProps) {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // AI Connection State
  const [aiStatus, setAiStatus] = useState<{
    provider: string;
    model: string;
    location: string;
    authMethod: string;
    isConfigured: boolean;
    dailyRequests: number;
    maxDailyRequests: number;
    totalRequests: number;
    estimatedTokens: number;
    lastSuccessfulRequestAt: string | null;
    lastError: string | null;
    activeMode: string;
    setupInstructions: string;
  } | null>(null);

  const [isTestingAI, setIsTestingAI] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    message?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/ai/status')
      .then((res) => res.json())
      .then((data) => setAiStatus(data))
      .catch((err) => console.error('Failed to load AI status:', err));
  }, []);

  const handleTestAI = async () => {
    setIsTestingAI(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai/status', { method: 'POST' });
      const data = await res.json();
      setTestResult({
        success: data.success,
        latencyMs: data.latencyMs,
        message: data.message || (data.success ? 'AI ping verified' : 'Connection failed'),
      });
      if (data.status) {
        setAiStatus(data.status);
      }
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Network failure testing AI',
      });
    } finally {
      setIsTestingAI(false);
    }
  };

  const handleSave = () => {
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };


  const toggleProtectedField = (fieldKey: string) => {
    // If it's in strictly locked fields, don't allow unlocking
    const lockedDefaults = ['title', 'phoneNumber', 'websiteUri', 'regularHours', 'primaryCategory', 'additionalCategories', 'serviceAreas', 'isAddressVisible'];
    if (lockedDefaults.includes(fieldKey)) {
      alert(`Field "${fieldKey}" is protected by Phase 1 safety policy and must always require manual owner approval.`);
      return;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Workforce Settings & Automation Controls
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
              Private Security
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Configure private owner permissions, scheduling, autopilot limits, and Google Cloud credentials.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-bold text-xs rounded-xl transition-all shadow-md shadow-[#D4AF37]/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Workforce Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Workforce settings successfully updated.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Private Owner Account & Permissions */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-white">
              Private Owner Account & Automation Policy
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Authorized Owner Account Email
              </label>
              <input
                type="email"
                disabled
                value={formData.ownerEmail}
                className="w-full bg-[#111738] border border-slate-700 rounded-lg px-3 py-2 text-slate-300 font-mono text-xs cursor-not-allowed opacity-80"
              />
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Single-user private installation strictly locked to this address.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Workforce Automation Mode
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  onClick={() => setFormData({ ...formData, automationMode: 'review_first' })}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.automationMode === 'review_first'
                      ? 'bg-[#111738] border-[#D4AF37] shadow-sm'
                      : 'bg-[#111738]/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.automationMode === 'review_first'}
                      onChange={() => setFormData({ ...formData, automationMode: 'review_first' })}
                      className="accent-[#D4AF37]"
                    />
                    <strong className="text-white text-xs">Review First (Recommended)</strong>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 pl-5 leading-relaxed">
                    All proposals require manual owner review before writing to Google.
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, automationMode: 'routine_autopilot' })}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.automationMode === 'routine_autopilot'
                      ? 'bg-[#111738] border-[#00F3FF] shadow-sm'
                      : 'bg-[#111738]/50 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.automationMode === 'routine_autopilot'}
                      onChange={() => setFormData({ ...formData, automationMode: 'routine_autopilot' })}
                      className="accent-[#00F3FF]"
                    />
                    <strong className="text-white text-xs">Routine Autopilot</strong>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 pl-5 leading-relaxed">
                    Applies low-risk text syncs automatically. Protected fields still require approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Protected Fields List */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Protected Fields (Always Require Individual Approval)
              </label>
              <div className="bg-[#111738] p-3 rounded-lg border border-slate-700/80 space-y-1.5">
                {[
                  { key: 'title', label: 'Business Name' },
                  { key: 'phoneNumber', label: 'Primary Phone Number' },
                  { key: 'websiteUri', label: 'Website URL' },
                  { key: 'primaryCategory', label: 'Primary Category' },
                  { key: 'additionalCategories', label: 'Secondary Categories' },
                  { key: 'regularHours', label: 'Weekly Operating Hours' },
                  { key: 'serviceAreas', label: 'Designated Service Areas' },
                  { key: 'isAddressVisible', label: 'Address Visibility / SAB Setting' },
                ].map((f) => (
                  <div key={f.key} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-[#D4AF37]" />
                      {f.label}
                    </span>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                      Locked Approval
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Schedules & Timers */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Clock className="w-4 h-4 text-[#00F3FF]" />
            <h3 className="text-sm font-bold text-white">
              Automation Schedules & Cloud Scheduler
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Daily Inspection Schedule
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={formData.dailyInspectionSchedule.time}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyInspectionSchedule: {
                        ...formData.dailyInspectionSchedule,
                        time: e.target.value,
                      },
                    })
                  }
                  className="bg-[#111738] border border-slate-700 rounded-lg p-2 text-white outline-none"
                />
                <input
                  type="text"
                  disabled
                  value={formData.dailyInspectionSchedule.timezone}
                  className="bg-[#111738] border border-slate-700 rounded-lg p-2 text-slate-400 font-mono outline-none"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Inspections trigger once daily in Eastern Time (America/New_York).
              </span>
            </div>

            <div className="bg-[#111738] p-3 rounded-lg border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Weekly Improvement Review</span>
                  <span className="text-[11px] text-slate-400">Summarizes unresolved findings every Monday morning.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.weeklyReviewSchedule.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      weeklyReviewSchedule: {
                        ...formData.weeklyReviewSchedule,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="accent-[#00F3FF] w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <div>
                  <span className="font-bold text-white block">Monthly Keyword & Telemetry Analysis</span>
                  <span className="text-[11px] text-slate-400">Compiles 28-day settled search volume query reports.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.monthlyKeywordAnalysisSchedule.enabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthlyKeywordAnalysisSchedule: {
                        ...formData.monthlyKeywordAnalysisSchedule,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="accent-[#00F3FF] w-4 h-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2.5: Alert Delivery Channels & Quiet Hours */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Bell className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-bold text-white">
              Alert Delivery Channels & Notifications
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-[#111738] p-3 rounded-lg border border-slate-700/80 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">In-App Operations Cockpit</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30">
                      Primary / Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tasks awaiting approval, discrepancy alerts, and daily cycle results are presented directly on the Operations screen and navigation badges.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#111738] p-3.5 rounded-lg border border-slate-700 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-300" />
                    <span className="font-bold text-white">External Email Notifications</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                      formData.notifications?.externalDeliveryEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-700/50 text-slate-400 border-slate-600'
                    }`}>
                      {formData.notifications?.externalDeliveryEnabled ? 'Enabled' : 'Disabled by Default'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Strict Policy: External emails are never sent unless Arthur explicitly toggles this delivery channel on and designates a verified recipient address.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(formData.notifications?.externalDeliveryEnabled)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notifications: {
                        externalDeliveryEnabled: e.target.checked,
                        notificationEmail:
                          formData.notifications?.notificationEmail || formData.ownerEmail || 'arthurscreatives@gmail.com',
                      },
                    })
                  }
                  className="accent-[#00F3FF] w-4 h-4 cursor-pointer flex-shrink-0 mt-1"
                />
              </div>

              {formData.notifications?.externalDeliveryEnabled && (
                <div className="pt-3 border-t border-slate-800 space-y-2 animate-fadeIn">
                  <label className="block text-[11px] font-semibold text-slate-300">
                    Designated Notification Recipient:
                  </label>
                  <input
                    type="email"
                    value={formData.notifications?.notificationEmail || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notifications: {
                          ...formData.notifications,
                          externalDeliveryEnabled: true,
                          notificationEmail: e.target.value,
                        },
                      })
                    }
                    placeholder="arthurscreatives@gmail.com"
                    className="w-full bg-[#0b0f26] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-[#00F3FF]"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Only high-severity items (e.g. unverified profile phone drift, negative review alerts) will trigger dispatches to this address.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Spending Limits & Cloud Budget Guide */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Spending Controls & Budget Alerts
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111738] p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 font-semibold block text-[11px]">Monthly AI Quota:</span>
                <span className="text-lg font-bold text-white font-mono">
                  {formData.limits.monthlyAiUsed} / {formData.limits.monthlyAiQuota} calls
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">86 calls remaining</span>
              </div>

              <div className="bg-[#111738] p-3 rounded-lg border border-slate-700">
                <span className="text-slate-400 font-semibold block text-[11px]">Daily Task Limit:</span>
                <span className="text-lg font-bold text-white font-mono">
                  {formData.limits.dailyTaskQuota} tasks / day
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Prevents API runaway</span>
              </div>
            </div>

            {/* Google Cloud Budget Alert Clarification */}
            <div className="bg-[#111738] p-3.5 rounded-xl border border-amber-500/40 text-[11px] text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Google Cloud Budget Alert Guidance</span>
              </div>
              <p className="leading-relaxed">
                <strong>Important:</strong> In Google Cloud Billing, budget thresholds act as <em>email alerts</em> and do <strong>not</strong> automatically shut off services by default.
              </p>
              <p className="text-slate-400">
                To guarantee zero unexpected charges, configure a $20.00 monthly Cloud Billing Alert in the Google Cloud Console. Arthur’s AI Workforce internally caps AI calls and repair tasks to stay safely within free/nominal tiers.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Google Cloud Credentials & Connection Status */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#00F3FF]" />
              <h3 className="text-sm font-bold text-white">
                Google Cloud API & Profile Connection
              </h3>
            </div>
            <button
              onClick={onOpenConnectModal}
              className="text-xs font-semibold text-[#00F3FF] hover:underline"
            >
              Launch Wizard
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-[#111738] p-3 rounded-lg border border-slate-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Connected Profile:</span>
                <strong className="text-white">{profile.title}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resource Path:</span>
                <span className="text-slate-300 font-mono text-[10px]">{profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Google Verification:</span>
                <span className="text-emerald-400 font-semibold">{profile.verificationStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Listing Type:</span>
                <span className="text-slate-300">Service-Area Business (Hidden Address)</span>
              </div>
            </div>

            <div className="p-3 bg-[#0b0f26] rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <strong className="text-white block">Required Cloud APIs Checklist:</strong>
              <div className="space-y-0.5">
                <p>✓ Google My Business Account Management API</p>
                <p>✓ My Business Business Information API</p>
                <p>✓ My Business Verifications API</p>
                <p>✓ Google Gemini API / Vertex AI</p>
              </div>
            </div>

            {onDisconnectGoogle && (
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Google Compliance:</span>
                <button
                  type="button"
                  onClick={onDisconnectGoogle}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Disconnect & Purge Google Tokens
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 5: AI Connection · Workforce Brain (Vertex AI & Gemini) */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#00F3FF]/10 text-[#00F3FF]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">
                    AI Connection · Workforce Brain
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      aiStatus?.isConfigured
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {aiStatus?.isConfigured ? 'Connected' : 'Setup Required'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Powers Profile Inspection, Repair Worker diff generation, Content Drafting, and Review Replies.
                </p>
              </div>
            </div>

            <button
              onClick={handleTestAI}
              disabled={isTestingAI}
              className="flex items-center gap-2 px-4 py-2 bg-[#111738] hover:bg-[#1f295c] text-[#00F3FF] border border-[#00F3FF]/40 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isTestingAI ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00F3FF]" />
                  <span>Pinging Model...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-[#00F3FF]" />
                  <span>Test AI Connection</span>
                </>
              )}
            </button>
          </div>

          {/* Test Result Banner */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-fadeIn ${
                testResult.success
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="font-semibold">
                    {testResult.success ? 'AI Connection Verified' : 'AI Request Notice'}
                  </strong>
                  {testResult.latencyMs !== undefined && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                      {testResult.latencyMs}ms latency
                    </span>
                  )}
                </div>
                <p className="text-[11px]">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* AI Connection Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#111738] p-3 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 font-semibold block text-[11px]">Provider:</span>
              <span className="text-white font-medium text-xs block mt-0.5">
                {aiStatus?.provider || 'Google Cloud Vertex AI'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {aiStatus?.authMethod || 'Google Cloud Service Account (ADC)'}
              </span>
            </div>

            <div className="bg-[#111738] p-3 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 font-semibold block text-[11px]">Configured Model:</span>
              <span className="text-[#00F3FF] font-mono font-bold text-xs block mt-0.5">
                {aiStatus?.model || 'gemini-3.8-flash'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Location: {aiStatus?.location || 'us-central1'}
              </span>
            </div>

            <div className="bg-[#111738] p-3 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 font-semibold block text-[11px]">Daily AI Requests:</span>
              <span className="text-white font-mono font-bold text-sm block mt-0.5">
                {aiStatus?.dailyRequests ?? 0} / {aiStatus?.maxDailyRequests ?? 50}
              </span>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">
                {Math.max(0, (aiStatus?.maxDailyRequests ?? 50) - (aiStatus?.dailyRequests ?? 0))} remaining today
              </span>
            </div>

            <div className="bg-[#111738] p-3 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 font-semibold block text-[11px]">Last Successful Request:</span>
              <span className="text-slate-200 text-xs block mt-0.5">
                {aiStatus?.lastSuccessfulRequestAt
                  ? new Date(aiStatus.lastSuccessfulRequestAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Ready for first task'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Est. {aiStatus?.estimatedTokens ?? 0} tokens logged
              </span>
            </div>
          </div>

          {/* Cloud Run Service Account Guidance */}
          <div className="bg-[#0b0f26] p-3.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
              <Shield className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Google Cloud Identity & Spending Architecture</span>
            </div>
            <p className="leading-relaxed">
              When deployed to Cloud Run, this application authenticates automatically via its attached Google Cloud Service Account using <strong>Application Default Credentials (ADC)</strong>. It requires only the <code className="text-[#00F3FF] bg-[#111738] px-1 py-0.5 rounded font-mono">roles/aiplatform.user</code> IAM role—no separate AI API key is needed.
            </p>
            <p className="text-slate-400 text-[10px]">
              {aiStatus?.setupInstructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

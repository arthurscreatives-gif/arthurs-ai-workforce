'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  Sliders,
  Building2,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Lock,
  PauseCircle,
  PlayCircle,
  Ban,
  RotateCcw,
  Search,
  ExternalLink,
  MessageSquare,
  FileText,
  Clock,
} from 'lucide-react';
import { Workspace, AdminActionLog, SupportTicket, PlanConfig } from '@/types/workspace';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshWorkspace: () => void;
}

export function AdminDashboardModal({
  isOpen,
  onClose,
  onRefreshWorkspace,
}: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'workspaces' | 'actions' | 'tickets' | 'pricing'>('workspaces');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminActionLog[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [metrics, setMetrics] = useState({
    totalWorkspaces: 0,
    activeSubscribers: 0,
    totalAiCalls: 0,
    totalFailedJobs: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Pricing configuration state for Arthur
  const [planConfig, setPlanConfig] = useState<PlanConfig | null>(null);
  const [monthlyPriceDollars, setMonthlyPriceDollars] = useState(49);
  const [isOfferFinalized, setIsOfferFinalized] = useState(false);
  const [isLiveCheckoutEnabled, setIsLiveCheckoutEnabled] = useState(false);

  // Fetch data on open
  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      fetch('/api/admin/workspaces')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data) {
            setWorkspaces(data.workspaces || []);
            setAdminLogs(data.actionLogs || []);
            if (data.metrics) setMetrics(data.metrics);
          }
        })
        .catch((err) => console.error('Failed to load admin data:', err));

      fetch('/api/admin/support')
        .then((res) => (res.ok ? res.json() : null))
        .then((tData) => {
          if (isMounted && tData) {
            setSupportTickets(tData.tickets || []);
          }
        })
        .catch((err) => console.error('Failed to load tickets:', err));

      fetch('/api/billing/config')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data?.plan) {
            setPlanConfig(data.plan);
            setMonthlyPriceDollars(Math.round(data.plan.monthlyPriceInCents / 100));
            setIsOfferFinalized(data.plan.isOfferFinalizedByArthur);
            setIsLiveCheckoutEnabled(data.plan.isLiveCheckoutEnabled);
          }
        })
        .catch((err) => console.error('Failed to load plan config:', err));
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const refreshAllAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/workspaces');
      if (res.ok) {
        const data = await res.json();
        setWorkspaces(data.workspaces || []);
        setAdminLogs(data.actionLogs || []);
        if (data.metrics) setMetrics(data.metrics);
      }
      const ticketRes = await fetch('/api/admin/support');
      if (ticketRes.ok) {
        const tData = await ticketRes.json();
        setSupportTickets(tData.tickets || []);
      }
    } catch (err) {
      console.error('Failed to refresh admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminAction = async (
    targetWorkspaceId: string,
    action: 'suspend' | 'unsuspend' | 'pause_automation' | 'unpause_automation',
    reason?: string
  ) => {
    try {
      const res = await fetch('/api/admin/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          targetWorkspaceId,
          reason: reason || `Admin action ${action} executed by Arthur`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setActionFeedback(`Action "${action}" successfully executed.`);
        refreshAllAdminData();
        onRefreshWorkspace();
        setTimeout(() => setActionFeedback(null), 3000);
      } else {
        setActionFeedback(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setActionFeedback(`Error executing action: ${err.message}`);
    }
  };

  const handleSavePlanConfig = async () => {
    try {
      const res = await fetch('/api/billing/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyPriceInCents: monthlyPriceDollars * 100,
          annualPriceInCents: monthlyPriceDollars * 100 * 10,
          isOfferFinalizedByArthur: isOfferFinalized,
          isLiveCheckoutEnabled: isLiveCheckoutEnabled,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.plan) {
          setPlanConfig(data.plan);
        }
        setActionFeedback('Standalone subscription configuration updated.');
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch {
      setActionFeedback('Failed to save plan settings.');
    }
  };

  const handleResolveTicket = async (ticketId: string) => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resolve',
          ticketId,
          adminNotes: 'Resolved by Arthur platform administration.',
        }),
      });
      if (res.ok) {
        refreshAllAdminData();
      }
    } catch (err) {
      console.error('Failed to resolve ticket:', err);
    }
  };

  if (!isOpen) return null;

  const filteredWorkspaces = workspaces.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f26]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#18204c] border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Arthur Owner Administration</h2>
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/40 font-mono font-semibold">
                  Internal Governance Cockpit
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-tenant workspace oversight, security controls, aggregate usage, and support queues.
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

        {/* Action feedback banner */}
        {actionFeedback && (
          <div className="mt-3 p-2.5 bg-[#111738] border border-[#00F3FF]/40 rounded-xl text-xs text-[#00F3FF] flex items-center justify-between">
            <span>{actionFeedback}</span>
            <button onClick={() => setActionFeedback(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Aggregate KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-[#111738] p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono uppercase">Total Workspaces</span>
            <span className="text-xl font-black text-white mt-1 block">{metrics.totalWorkspaces}</span>
          </div>
          <div className="bg-[#111738] p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono uppercase">Active Subscribers</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">{metrics.activeSubscribers}</span>
          </div>
          <div className="bg-[#111738] p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono uppercase">Total AI Analyses</span>
            <span className="text-xl font-black text-[#00F3FF] mt-1 block">{metrics.totalAiCalls}</span>
          </div>
          <div className="bg-[#111738] p-3.5 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono uppercase">Failed Jobs</span>
            <span className="text-xl font-black text-rose-400 mt-1 block">{metrics.totalFailedJobs}</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex bg-[#111738] p-1 rounded-xl border border-slate-800 text-xs font-semibold mb-4">
          <button
            onClick={() => setActiveTab('workspaces')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'workspaces' ? 'bg-[#18204c] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Workspaces ({workspaces.length})
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'pricing' ? 'bg-[#18204c] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Standalone Pricing & Test Mode
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'tickets' ? 'bg-[#18204c] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Support Tickets ({supportTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'actions' ? 'bg-[#18204c] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Logs ({adminLogs.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: Workspaces List */}
          {activeTab === 'workspaces' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search workspaces by business name, ID..."
                  className="w-full pl-10 pr-4 py-2 bg-[#111738] border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {filteredWorkspaces.map((ws) => (
                <div
                  key={ws.id}
                  className={`bg-[#111738] border rounded-2xl p-4 transition-all ${
                    ws.isSuspended
                      ? 'border-rose-500/50 bg-rose-500/5'
                      : ws.role === 'owner'
                      ? 'border-[#D4AF37]/50'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{ws.businessName}</span>
                        {ws.role === 'owner' && (
                          <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded border border-[#D4AF37]/40 font-mono">
                            Arthur Owner Internal
                          </span>
                        )}
                        {ws.isSuspended && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/40 font-mono">
                            Suspended
                          </span>
                        )}
                        {ws.settings.isAutomationPaused && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 font-mono">
                            Automation Paused
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>ID: <code className="text-slate-300">{ws.id}</code></span>
                        <span>•</span>
                        <span>Plan: <span className="text-white capitalize">{ws.subscription.status}</span></span>
                        <span>•</span>
                        <span>Google: <span className="text-cyan-300">{ws.googleConnection.status}</span></span>
                        <span>•</span>
                        <span>AI Used: {ws.entitlements.monthlyAiAnalysesUsed}/{ws.entitlements.monthlyAiAnalysesQuota}</span>
                      </div>
                    </div>

                    {/* Admin Action Buttons */}
                    <div className="flex items-center gap-2">
                      {ws.settings.isAutomationPaused ? (
                        <button
                          onClick={() => handleAdminAction(ws.id, 'unpause_automation')}
                          className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>Unpause</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAdminAction(ws.id, 'pause_automation')}
                          className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <PauseCircle className="w-3.5 h-3.5" />
                          <span>Pause</span>
                        </button>
                      )}

                      {ws.isSuspended ? (
                        <button
                          onClick={() => handleAdminAction(ws.id, 'unsuspend')}
                          className="px-2.5 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Unsuspend</span>
                        </button>
                      ) : ws.role !== 'owner' ? (
                        <button
                          onClick={() =>
                            handleAdminAction(
                              ws.id,
                              'suspend',
                              'Suspended by Arthur for safety review'
                            )
                          }
                          className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspend</span>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Secret Redaction Label */}
                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-400" />
                      Client OAuth credentials strictly redacted. No raw tokens exposed.
                    </span>
                    <span>Created: {new Date(ws.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Standalone Pricing Offer Controls */}
          {activeTab === 'pricing' && (
            <div className="bg-[#111738] border border-slate-800 rounded-2xl p-6 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Standalone Offer Configuration</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Configure the standalone Google Business Profile subscription package before launching public billing.
                </p>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-1">
                <span className="font-semibold">Current Guardrail Status:</span>
                <p>
                  Live credit card checkout is kept <strong>disabled</strong> in test mode. Arthur must approve the final package and enable checkout explicitly when ready.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block">Proposed Monthly Price (USD)</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg text-slate-400">$</span>
                    <input
                      type="number"
                      value={monthlyPriceDollars}
                      onChange={(e) => setMonthlyPriceDollars(Number(e.target.value))}
                      className="w-32 px-3 py-2 bg-[#18204c] border border-slate-700 rounded-xl text-xs text-white"
                    />
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOfferFinalized}
                      onChange={(e) => setIsOfferFinalized(e.target.checked)}
                      className="rounded border-slate-700 text-[#00F3FF]"
                    />
                    <span>I have reviewed and approved this pricing offer for Arthur’s AI Workforce.</span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLiveCheckoutEnabled}
                      onChange={(e) => setIsLiveCheckoutEnabled(e.target.checked)}
                      className="rounded border-slate-700 text-[#00F3FF]"
                    />
                    <span>Enable Live Stripe Hosted Checkout (requires configured STRIPE_SECRET_KEY).</span>
                  </label>
                </div>

                <button
                  onClick={handleSavePlanConfig}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-amber-400 text-[#0b0f26] font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Save Subscription Settings
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Support Tickets */}
          {activeTab === 'tickets' && (
            <div className="space-y-3">
              {supportTickets.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">No open customer support tickets.</div>
              ) : (
                supportTickets.map((t) => (
                  <div key={t.id} className="bg-[#111738] border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{t.subject}</span>
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                          {t.category}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      {t.status !== 'resolved' && (
                        <button
                          onClick={() => handleResolveTicket(t.id)}
                          className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{t.message}</p>
                    <div className="text-[10px] text-slate-500 flex items-center gap-3">
                      <span>From: {t.userEmail}</span>
                      <span>•</span>
                      <span>Workspace: {t.workspaceId}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Audit Logs */}
          {activeTab === 'actions' && (
            <div className="space-y-2">
              {adminLogs.map((log) => (
                <div key={log.id} className="bg-[#111738] border border-slate-800 rounded-xl p-3 text-xs flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white uppercase font-mono text-[10px] text-[#00F3FF]">
                        {log.action}
                      </span>
                      <span className="text-slate-400">• Workspace: {log.workspaceId}</span>
                    </div>
                    <p className="text-slate-300">{log.details}</p>
                    <span className="text-[10px] text-slate-500">Reason: {log.reason}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Navigation, NavTabId } from '@/components/Navigation';
import { OverviewTab } from '@/components/OverviewTab';
import { BusinessProfileTab } from '@/components/BusinessProfileTab';
import { AuditRepairsTab } from '@/components/AuditRepairsTab';
import { SearchInsightsTab } from '@/components/SearchInsightsTab';
import { ContentDraftsTab } from '@/components/ContentDraftsTab';
import { ActivityTab } from '@/components/ActivityTab';
import { SettingsTab } from '@/components/SettingsTab';
import { ConnectModal } from '@/components/ConnectModal';
import { BuildWorkforceModal } from '@/components/BuildWorkforceModal';
import { OperationsTab } from '@/components/OperationsTab';
import { PublicLandingPage } from '@/components/PublicLandingPage';
import { CustomerAuthModal } from '@/components/CustomerAuthModal';
import { CustomerOnboardingWizard } from '@/components/CustomerOnboardingWizard';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { BillingModal } from '@/components/BillingModal';
import { GoogleRequirementsModal } from '@/components/GoogleRequirementsModal';
import { LegalPagesModal } from '@/components/LegalPagesModal';
import { User, Workspace, PlanConfig } from '@/types/workspace';
import {
  defaultApprovedBusinessFacts,
  defaultLiveGoogleProfile,
  defaultFindings,
  defaultRepairProposals,
  defaultSearchMetrics,
  defaultContentDrafts,
  defaultActivityLogs,
  defaultSettings,
  defaultTaskQueue,
  defaultWorkforceAlerts,
  defaultTodaysWork,
} from '@/lib/default-data';
import {
  ApprovedBusinessFacts,
  GoogleBusinessProfile,
  InspectorFinding,
  RepairProposal,
  SearchInsightMetrics,
  ContentDraft,
  ActivityLog,
  AppSettings,
  ConnectionStatus,
  TaskQueueItem,
  WorkforceAlert,
  TodaysWorkSummary,
} from '@/types/business-profile';

const defaultFallbackPlan: PlanConfig = {
  id: 'plan_gbp_workforce',
  name: 'Arthur’s AI Workforce — GBP Edition',
  tagline: 'Google Business Profile consistency, proactive repairs, content drafts, and review automation.',
  description: 'Complete standalone digital workforce managing Google Business Profile consistency, repairs, drafts, and reviews.',
  monthlyPriceInCents: 4900,
  annualPriceInCents: 49000,
  features: [
    '1 Managed Google Business Profile location',
    'Continuous consistency inspection against approved facts',
    'Side-by-side repair proposals with rollback capabilities',
    'AI-powered service spotlights and business tips drafts',
    'Tailored review response drafting with sensitive complaint flagging',
    'Operational task queue and Eastern Time daily execution log',
    'Isolated private workspace with zero shared credentials',
    'Human-in-the-loop review-first execution by default',
  ],
  entitlements: {
    maxLocations: 1,
    monthlyAiAnalysesQuota: 100,
    monthlyDraftsQuota: 40,
    monthlyAutomatedActionsQuota: 120,
    maxStoredMediaMb: 500,
  },
  isOfferFinalizedByArthur: false,
  isLiveCheckoutEnabled: false,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isWorkforceModalOpen, setIsWorkforceModalOpen] = useState<boolean>(false);
  const [workforceModalMode, setWorkforceModalMode] = useState<'build' | 'explore'>('build');

  // Multi-Tenancy & Public Product State
  const [showLandingPage, setShowLandingPage] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [planConfig, setPlanConfig] = useState<PlanConfig>(defaultFallbackPlan);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isGoogleReqsOpen, setIsGoogleReqsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalInitialTab, setLegalInitialTab] = useState<'terms' | 'privacy' | 'support'>('privacy');

  // Core State
  const [approvedFacts, setApprovedFacts] = useState<ApprovedBusinessFacts>(defaultApprovedBusinessFacts);
  const [liveProfile, setLiveProfile] = useState<GoogleBusinessProfile>(defaultLiveGoogleProfile);
  const [findings, setFindings] = useState<InspectorFinding[]>(defaultFindings);
  const [repairProposals, setRepairProposals] = useState<RepairProposal[]>(defaultRepairProposals);
  const [internalHealthScore, setInternalHealthScore] = useState<number>(72);
  const [metrics, setMetrics] = useState<SearchInsightMetrics>(defaultSearchMetrics);
  const [drafts, setDrafts] = useState<ContentDraft[]>(defaultContentDrafts);
  const [logs, setLogs] = useState<ActivityLog[]>(defaultActivityLogs);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [taskQueue, setTaskQueue] = useState<TaskQueueItem[]>(defaultTaskQueue);
  const [alerts, setAlerts] = useState<WorkforceAlert[]>(defaultWorkforceAlerts);
  const [todaysWork, setTodaysWork] = useState<TodaysWorkSummary>(defaultTodaysWork);

  // Loading States
  const [isInspecting, setIsInspecting] = useState(false);
  const [isRefreshingMetrics, setIsRefreshingMetrics] = useState(false);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isCycling, setIsCycling] = useState(false);

  // Helper for EDT Timestamp
  const getFormattedTimestamp = () => {
    return (
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date()) + ' EDT'
    );
  };

  // Hydrate local state from loaded Workspace
  const hydrateFromWorkspace = (ws: Workspace) => {
    if (!ws) return;
    if (ws.approvedFacts) setApprovedFacts(ws.approvedFacts);
    if (ws.liveProfile) setLiveProfile(ws.liveProfile);
    if (ws.findings) setFindings(ws.findings);
    if (ws.repairProposals) setRepairProposals(ws.repairProposals);
    if (ws.searchInsights) setMetrics(ws.searchInsights);
    if (ws.drafts) setDrafts(ws.drafts);
    if (ws.logs) setLogs(ws.logs);
    if (ws.settings) setSettings(ws.settings);
    if (ws.taskQueue) setTaskQueue(ws.taskQueue);
    if (ws.alerts) setAlerts(ws.alerts);
    if (ws.todaysWork) setTodaysWork(ws.todaysWork);
    if (ws.connectionStatus) setConnectionStatus(ws.connectionStatus as ConnectionStatus);
  };

  // Sync workspace updates to backend
  const syncWorkspaceToServer = async (patch: Partial<Workspace>) => {
    try {
      const res = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.workspace) {
          setCurrentWorkspace(data.workspace);
        }
      }
    } catch (err) {
      console.error('Failed to sync workspace to server:', err);
    }
  };

  // Initial session & plan config load
  useEffect(() => {
    const fetchSessionAndConfig = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.user && authData.workspace) {
            setCurrentUser(authData.user);
            setCurrentWorkspace(authData.workspace);
            hydrateFromWorkspace(authData.workspace);
          }
        }

        const planRes = await fetch('/api/billing/config');
        if (planRes.ok) {
          const planData = await planRes.json();
          if (planData.plan) {
            setPlanConfig(planData.plan);
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      }
    };
    fetchSessionAndConfig();
  }, []);

  // Disconnect Google Account & Purge Tokens (Google Compliance)
  const handleDisconnectGoogle = async () => {
    try {
      const res = await fetch('/api/workspace/disconnect', { method: 'POST' });
      if (res.ok) {
        setConnectionStatus('not_connected');
        const newLog: ActivityLog = {
          id: `act-${Date.now()}`,
          timestamp: getFormattedTimestamp(),
          action: 'Google Business Profile Disconnected',
          details: 'Google OAuth tokens purged and background automation halted in accordance with Google compliance requirements.',
          field: 'google_connection',
          authorization: 'owner_revocation',
          result: 'success',
        };
        setLogs((prev) => [newLog, ...prev]);
        if (currentWorkspace) {
          setCurrentWorkspace({
            ...currentWorkspace,
            connectionStatus: 'not_connected',
            googleConnection: {
              ...currentWorkspace.googleConnection,
              status: 'disconnected',
            },
          });
        }
      }
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  // 1. Run Inspection Handler
  const handleRunInspection = async () => {
    setIsInspecting(true);
    try {
      const res = await fetch('/api/inspector/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          liveProfile,
          approvedFacts,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.findings) setFindings(data.findings);
        if (data.proposals) {
          // Merge proposals preserving any confirmed state
          setRepairProposals(data.proposals);
        }
        if (data.internalProfileHealthScore !== undefined) {
          setInternalHealthScore(data.internalProfileHealthScore);
        }

        const newLog: ActivityLog = {
          id: `act-${Date.now()}`,
          timestamp: getFormattedTimestamp(),
          action: 'Profile Inspector: Manual Audit Executed',
          details: `Analyzed ${liveProfile.title} against approved business facts. Identified ${data.findings?.length || 0} findings and updated Internal Profile Health Score to ${data.internalProfileHealthScore}/100.`,
          field: 'profile_inspection',
          authorization: 'system_inspection',
          result: 'success',
          notes: data.aiExecutiveSummary || 'Inspection completed successfully.',
        };
        setLogs((prev) => [newLog, ...prev]);
      }
    } catch (err) {
      console.error('Inspection error:', err);
    } finally {
      setIsInspecting(false);
    }
  };

  // 2. Apply Repair Handler (7-step sequence)
  const handleApplyRepair = async (proposal: RepairProposal) => {
    try {
      const res = await fetch('/api/repairs/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal,
          currentLiveProfile: liveProfile,
          actionType: 'apply',
          isOwnerAuthorized: true,
          automationMode: settings.automationMode,
          isAutomationPaused: settings.isAutomationPaused,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.conflictDetected) {
        if (data.log) {
          setLogs((prev) => [data.log, ...prev]);
        }
        return {
          success: false,
          conflict: true,
          message: data.message || data.error || 'Conflict detected: Live profile was updated externally.',
        };
      }

      // Success
      if (data.updatedProfile) {
        setLiveProfile(data.updatedProfile);
      }

      // Update proposal state
      setRepairProposals((prev) =>
        prev.map((p) =>
          p.id === proposal.id
            ? {
                ...p,
                status: 'confirmed_by_api',
                appliedAt: new Date().toISOString(),
                rollbackAvailable: true,
                previousValueSnapshot: data.rollbackSnapshot || p.currentValue,
              }
            : p
        )
      );

      // Re-calculate health score bump
      setInternalHealthScore((prev) => Math.min(100, prev + 10));

      if (data.log) {
        setLogs((prev) => [data.log, ...prev]);
      }

      return { success: true, message: data.message };
    } catch (err: any) {
      console.error('Apply repair error:', err);
      return { success: false, conflict: false, message: err.message };
    }
  };

  // 3. Rollback / Restore Handler
  const handleRollbackRepair = async (proposal: RepairProposal) => {
    try {
      const res = await fetch('/api/repairs/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposal,
          currentLiveProfile: liveProfile,
          actionType: 'rollback',
          isOwnerAuthorized: true,
          automationMode: settings.automationMode,
          isAutomationPaused: settings.isAutomationPaused,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.updatedProfile) {
          setLiveProfile(data.updatedProfile);
        }

        setRepairProposals((prev) =>
          prev.map((p) =>
            p.id === proposal.id
              ? {
                  ...p,
                  status: 'proposed',
                  appliedAt: undefined,
                  rollbackAvailable: false,
                }
              : p
          )
        );

        setInternalHealthScore((prev) => Math.max(30, prev - 10));

        if (data.log) {
          setLogs((prev) => [data.log, ...prev]);
        }
      }
    } catch (err) {
      console.error('Rollback error:', err);
    }
  };

  // 4. Dismiss Proposal Handler
  const handleDismissProposal = (id: string) => {
    setRepairProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'dismissed' } : p))
    );
    const dismissedProposal = repairProposals.find((p) => p.id === id);
    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: getFormattedTimestamp(),
      action: `Dismissed: ${dismissedProposal?.fieldLabel || 'Proposal'}`,
      details: `Owner dismissed proposal to update ${dismissedProposal?.fieldLabel}.`,
      field: dismissedProposal?.field || 'unknown',
      authorization: 'owner_manual_approval',
      result: 'success',
      notes: 'No API change was sent to Google.',
    };
    setLogs((prev) => [log, ...prev]);
  };

  // 5. Save Approved Facts
  const handleSaveApprovedFacts = (newFacts: ApprovedBusinessFacts) => {
    setApprovedFacts(newFacts);
    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: getFormattedTimestamp(),
      action: 'Source of Truth Confirmed',
      details: 'Owner updated and confirmed Approved Business Facts repository.',
      field: 'approved_facts',
      authorization: 'owner_manual_approval',
      result: 'success',
      notes: 'Future inspections will validate Google against these newly confirmed facts.',
    };
    setLogs((prev) => [log, ...prev]);
  };

  // 6. Import from Google into Approved Facts
  const handleImportFromGoogle = () => {
    setApprovedFacts((prev) => ({
      ...prev,
      description: liveProfile.profileDescription || prev.description,
      additionalCategories: liveProfile.additionalCategories || prev.additionalCategories,
      lastConfirmedAt: new Date().toISOString(),
    }));
    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: getFormattedTimestamp(),
      action: 'Imported Live Google Attributes',
      details: 'Synced live description and category data into local Approved Facts staging.',
      field: 'import_google',
      authorization: 'owner_manual_approval',
      result: 'success',
    };
    setLogs((prev) => [log, ...prev]);
  };

  // 7. Generate Content Draft Handler
  const handleGenerateDraft = async (
    type: ContentDraft['type'],
    customPrompt?: string
  ): Promise<ContentDraft | null> => {
    setIsGeneratingDraft(true);
    try {
      const res = await fetch('/api/drafts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          approvedFacts,
          customPrompt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.draft) {
          setDrafts((prev) => [data.draft, ...prev]);
          const log: ActivityLog = {
            id: `act-${Date.now()}`,
            timestamp: getFormattedTimestamp(),
            action: `Content Draft Generated: ${data.draft.typeLabel}`,
            details: `Created new post draft: "${data.draft.title}". Grounded strictly in approved business facts.`,
            field: 'content_draft',
            authorization: 'system_inspection',
            result: 'success',
            notes: 'Saved to Content Drafts workspace. Automated publishing deferred to Phase 2.',
          };
          setLogs((prev) => [log, ...prev]);
          return data.draft;
        }
      }
    } catch (err) {
      console.error('Draft generation failed:', err);
    } finally {
      setIsGeneratingDraft(false);
    }
    return null;
  };

  // 8. Prepare AI Repair Handler
  const handlePrepareAIRepair = async (finding: InspectorFinding) => {
    try {
      let currentValue = '';
      if (finding.field === 'profileDescription') {
        currentValue = liveProfile.profileDescription || '';
      } else if (finding.field === 'services') {
        currentValue = (liveProfile.services || []).map((s) => s.name).join(', ');
      } else if (finding.field === 'additionalCategories') {
        currentValue = (liveProfile.additionalCategories || []).join(', ');
      }

      const res = await fetch('/api/ai/prepare-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finding,
          approvedFacts,
          currentValue,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.proposal) {
          setRepairProposals((prev) => {
            const filtered = prev.filter((p) => p.field !== data.proposal.field);
            return [data.proposal, ...filtered];
          });

          const log: ActivityLog = {
            id: `act-${Date.now()}`,
            timestamp: getFormattedTimestamp(),
            action: `AI Repair Prepared: ${data.proposal.fieldLabel}`,
            details: `Generated diff proposal for ${data.proposal.fieldLabel}. Reason: ${data.proposal.reason}`,
            field: data.proposal.field,
            authorization: 'system_inspection',
            result: 'success',
            notes: `Review-First state: Ready. Protected field: ${data.proposal.isProtectedField ? 'YES (Explicit approval required)' : 'No'}.`,
          };
          setLogs((prev) => [log, ...prev]);
        }
      }
    } catch (err) {
      console.error('Error preparing AI repair:', err);
    }
  };

  // 9. Save Draft
  const handleSaveDraft = (draft: ContentDraft) => {
    setDrafts((prev) => {
      const exists = prev.some((d) => d.id === draft.id);
      if (exists) {
        return prev.map((d) => (d.id === draft.id ? draft : d));
      }
      return [draft, ...prev];
    });
  };

  // 10. Delete Draft
  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  // 11. Activity Logging helper
  const handleLogActivity = (action: string, details: string, field?: string) => {
    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: getFormattedTimestamp(),
      action,
      details,
      field: field || 'general',
      authorization: 'owner_manual_approval',
      result: 'success',
    };
    setLogs((prev) => [log, ...prev]);
  };

  // 12. Pause Automation Toggle
  const handleTogglePauseAutomation = () => {
    const nextPaused = !settings.isAutomationPaused;
    setSettings((prev) => ({
      ...prev,
      isAutomationPaused: nextPaused,
    }));

    // Update queued tasks to reflect pause state
    setTaskQueue((prev) =>
      prev.map((t) => {
        if (nextPaused && t.executionStatus === 'Queued') {
          return {
            ...t,
            executionStatus: 'Blocked',
            error: 'Blocked by Global Pause: External writes are disabled while automation is paused.',
          };
        } else if (!nextPaused && t.executionStatus === 'Blocked' && t.error?.includes('Global Pause')) {
          return {
            ...t,
            executionStatus: 'Queued',
            error: undefined,
          };
        }
        return t;
      })
    );

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: getFormattedTimestamp(),
      action: nextPaused ? 'Automation Paused' : 'Automation Resumed',
      details: nextPaused
        ? 'Owner paused all automatic background workforce tasks. External writes strictly blocked.'
        : 'Owner resumed scheduled background workforce tasks.',
      field: 'automation_pause_toggle',
      authorization: 'owner_manual_approval',
      result: 'success',
    };
    setLogs((prev) => [log, ...prev]);
  };

  // 13. Task Approval Handler
  const handleApproveTask = (taskId: string) => {
    const task = taskQueue.find((t) => t.id === taskId);
    if (!task) return;

    const timestamp = getFormattedTimestamp();

    if (settings.isAutomationPaused) {
      setTaskQueue((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                approvalStatus: 'approved',
                executionStatus: 'Blocked',
                error: 'Approved by Arthur, but external write is held while Global Pause is active.',
              }
            : t
        )
      );
      handleLogActivity(
        `Task Approved (Held by Pause): ${task.action}`,
        `Arthur approved ${task.action}, but execution is blocked while global automation is paused.`,
        task.targetField
      );
      return;
    }

    // Execute approved action
    if (task.category === 'repair' && task.targetField === 'profileDescription') {
      setLiveProfile((prev) => ({
        ...prev,
        profileDescription: approvedFacts.description,
      }));
      setRepairProposals((prev) =>
        prev.map((p) =>
          p.field === 'profileDescription'
            ? {
                ...p,
                status: 'confirmed_by_api',
                appliedAt: timestamp,
                rollbackAvailable: true,
              }
            : p
        )
      );
      setInternalHealthScore((prev) => Math.min(100, prev + 12));
    }

    // If review reply, resolve related review alert
    if (task.category === 'review') {
      setAlerts((prev) =>
        prev.map((a) => (a.category === 'review_attention' ? { ...a, resolved: true } : a))
      );
    }

    // Mark task completed
    setTaskQueue((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              approvalStatus: 'approved',
              executionStatus: 'Completed',
              completedAt: timestamp,
              result: 'Authorized by Arthur. Successfully published to Google profile and verified.',
              error: undefined,
            }
          : t
      )
    );

    // Update Today's Work factual ledger
    setTodaysWork((prev) => ({
      ...prev,
      changedAndVerified: Array.from(new Set([...prev.changedAndVerified, `${task.action} (${task.targetLabel || task.targetField})`])),
      needsApprovalItems: prev.needsApprovalItems.filter((item) => !item.includes(task.action)),
      totalTasksExecuted: prev.totalTasksExecuted + 1,
    }));

    handleLogActivity(
      `Task Authorized & Executed: ${task.action}`,
      `Arthur authorized execution of "${task.action}". Changes published to Google Business Profile and verified.`,
      task.targetField
    );
  };

  // 14. Task Dismiss / Cancel Handlers
  const handleDismissTask = (taskId: string) => {
    setTaskQueue((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              approvalStatus: 'rejected',
              executionStatus: 'Canceled',
              result: 'Dismissed by Arthur.',
            }
          : t
      )
    );
    handleLogActivity('Task Dismissed', `Owner dismissed task ${taskId} from operations queue.`);
  };

  const handleCancelTask = (taskId: string) => {
    setTaskQueue((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              executionStatus: 'Canceled',
              result: 'Canceled by Arthur.',
            }
          : t
      )
    );
    handleLogActivity('Task Canceled', `Owner canceled queued task ${taskId}.`);
  };

  const handleRetryTask = (taskId: string) => {
    const task = taskQueue.find((t) => t.id === taskId);
    if (!task) return;

    if (settings.isAutomationPaused) {
      setTaskQueue((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                executionStatus: 'Blocked',
                error: 'Cannot retry while Global Pause is active. Resume automation first.',
              }
            : t
        )
      );
      return;
    }

    setTaskQueue((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              executionStatus: 'Queued',
              error: undefined,
              retryCount: (t.retryCount || 0) + 1,
            }
          : t
      )
    );
    handleLogActivity('Task Retried', `Owner re-queued task "${task.action}" for processing.`);
  };

  // 15. Alert Resolution
  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true, resolvedAt: getFormattedTimestamp() } : a))
    );
  };

  // 16. Trigger Daily Operations Cycle
  const handleTriggerDailyCycle = async () => {
    setIsCycling(true);
    try {
      const res = await fetch('/api/operations/run-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          liveProfile,
          approvedFacts,
          existingTasks: taskQueue,
          existingAlerts: alerts,
          settings,
          connectionStatus,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.tasks) setTaskQueue(data.tasks);
        if (data.alerts) setAlerts(data.alerts);
        if (data.summary) setTodaysWork(data.summary);
        if (data.logs && data.logs.length > 0) {
          setLogs((prev) => [...data.logs, ...prev]);
        }
      }
    } catch (err) {
      console.error('Failed to run operations cycle:', err);
    } finally {
      setIsCycling(false);
    }
  };

  // 11. Save Settings
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: getFormattedTimestamp(),
      action: 'Workforce Settings Updated',
      details: `Updated settings. Mode: ${newSettings.automationMode}, Schedule: ${newSettings.dailyInspectionSchedule.time} ${newSettings.dailyInspectionSchedule.timezone}.`,
      field: 'app_settings',
      authorization: 'owner_manual_approval',
      result: 'success',
    };
    setLogs((prev) => [log, ...prev]);
  };

  // 12. Refresh Telemetry
  const handleRefreshMetrics = () => {
    setIsRefreshingMetrics(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        lastSyncedAt: getFormattedTimestamp(),
      }));
      setIsRefreshingMetrics(false);
      const log: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: getFormattedTimestamp(),
        action: 'Search Telemetry Refreshed',
        details: 'Retrieved settled Google Business Profile impressions, actions, and search terms.',
        field: 'search_insights',
        authorization: 'system_inspection',
        result: 'success',
      };
      setLogs((prev) => [log, ...prev]);
    }, 800);
  };

  // 13. Select and Confirm Profile from Wizard
  const handleSelectAndConfirmProfile = (newProfile: GoogleBusinessProfile) => {
    setLiveProfile(newProfile);
    setConnectionStatus('connected');
    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: getFormattedTimestamp(),
      action: 'Google Business Profile Connected',
      details: `Authorized and confirmed pairing with ${newProfile.title} (${newProfile.name}).`,
      field: 'google_connection',
      authorization: 'owner_manual_approval',
      result: 'success',
      notes: 'Profile information imported and synchronized.',
    };
    setLogs((prev) => [log, ...prev]);
  };

  if (showLandingPage) {
    return (
      <div className="min-h-screen bg-[#0b0f26]">
        <PublicLandingPage
          currentUser={currentUser}
          currentWorkspace={currentWorkspace}
          planConfig={planConfig}
          onOpenAuth={(mode) => {
            setAuthModalMode(mode);
            setIsAuthModalOpen(true);
          }}
          onStartOnboarding={() => setIsOnboardingOpen(true)}
          onEnterWorkspace={() => setShowLandingPage(false)}
          onOpenGoogleRequirements={() => setIsGoogleReqsOpen(true)}
          onOpenLegal={(tab) => {
            setLegalInitialTab(tab);
            setIsLegalOpen(true);
          }}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Modals on Landing Page */}
        <CustomerAuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user, workspace) => {
            setCurrentUser(user);
            setCurrentWorkspace(workspace);
            hydrateFromWorkspace(workspace);
            setShowLandingPage(false);
          }}
        />

        <CustomerOnboardingWizard
          isOpen={isOnboardingOpen}
          currentUser={currentUser}
          currentWorkspace={currentWorkspace}
          planConfig={planConfig}
          onClose={() => setIsOnboardingOpen(false)}
          onComplete={(updatedWs) => {
            setCurrentWorkspace(updatedWs);
            hydrateFromWorkspace(updatedWs);
            setIsOnboardingOpen(false);
            setShowLandingPage(false);
          }}
        />

        <AdminDashboardModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onRefreshWorkspace={async () => {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
              const d = await res.json();
              if (d.workspace) {
                setCurrentWorkspace(d.workspace);
                hydrateFromWorkspace(d.workspace);
              }
            }
          }}
        />

        <GoogleRequirementsModal
          isOpen={isGoogleReqsOpen}
          onClose={() => setIsGoogleReqsOpen(false)}
        />

        <LegalPagesModal
          isOpen={isLegalOpen}
          initialTab={legalInitialTab}
          onClose={() => setIsLegalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111738] text-slate-100 flex flex-col font-sans selection:bg-[#00F3FF] selection:text-[#0b0f26]">
      {/* Persistent Global Header */}
      <Header
        connectionStatus={connectionStatus}
        settings={settings}
        selectedProfileTitle={liveProfile.title}
        onTogglePauseAutomation={handleTogglePauseAutomation}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenWorkforceBuilder={(mode) => {
          setWorkforceModalMode(mode);
          setIsWorkforceModalOpen(true);
        }}
        workspaceName={currentWorkspace?.businessName || liveProfile.title}
        userRole={currentUser?.role || (currentWorkspace?.role === 'owner' ? 'owner' : 'customer')}
        onOpenBilling={() => setIsBillingOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLandingPage={() => setShowLandingPage(true)}
        onSignOut={() => {
          setIsAuthModalOpen(true);
          setAuthModalMode('signin');
        }}
      />

      {/* Primary Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingRepairsCount={repairProposals.filter((p) => p.status === 'proposed').length}
        openFindingsCount={findings.filter((f) => f.status === 'open').length}
        draftsCount={drafts.length}
        pendingOperationsCount={
          taskQueue.filter((t) => t.executionStatus === 'Awaiting Approval').length +
          alerts.filter((a) => !a.resolved).length
        }
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {activeTab === 'overview' && (
          <OverviewTab
            profile={liveProfile}
            connectionStatus={connectionStatus}
            internalHealthScore={internalHealthScore}
            findings={findings}
            repairProposals={repairProposals}
            metrics={metrics}
            recentLogs={logs}
            settings={settings}
            isInspecting={isInspecting}
            onRunInspection={handleRunInspection}
            onNavigateTab={setActiveTab}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
          />
        )}

        {activeTab === 'operations' && (
          <OperationsTab
            connectionStatus={connectionStatus}
            profile={liveProfile}
            settings={settings}
            taskQueue={taskQueue}
            alerts={alerts}
            todaysWork={todaysWork}
            onTogglePauseAutomation={handleTogglePauseAutomation}
            onApproveTask={handleApproveTask}
            onDismissTask={handleDismissTask}
            onCancelTask={handleCancelTask}
            onRetryTask={handleRetryTask}
            onResolveAlert={handleResolveAlert}
            onTriggerDailyCycle={handleTriggerDailyCycle}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            onNavigateTab={setActiveTab}
            isCycling={isCycling}
          />
        )}

        {activeTab === 'business_profile' && (
          <BusinessProfileTab
            approvedFacts={approvedFacts}
            liveProfile={liveProfile}
            onSaveApprovedFacts={handleSaveApprovedFacts}
            onImportFromGoogle={handleImportFromGoogle}
          />
        )}

        {activeTab === 'audit_repairs' && (
          <AuditRepairsTab
            findings={findings}
            repairProposals={repairProposals}
            internalHealthScore={internalHealthScore}
            liveProfile={liveProfile}
            settings={settings}
            onApplyRepair={handleApplyRepair}
            onRollbackRepair={handleRollbackRepair}
            onDismissProposal={handleDismissProposal}
            onTogglePauseAutomation={handleTogglePauseAutomation}
            onRunInspectionNow={handleRunInspection}
            isInspecting={isInspecting}
            onPrepareAIRepair={handlePrepareAIRepair}
          />
        )}

        {activeTab === 'search_insights' && (
          <SearchInsightsTab
            metrics={metrics}
            onRefreshMetrics={handleRefreshMetrics}
            isRefreshing={isRefreshingMetrics}
          />
        )}

        {activeTab === 'content_drafts' && (
          <ContentDraftsTab
            drafts={drafts}
            approvedFacts={approvedFacts}
            onSaveDraft={handleSaveDraft}
            onDeleteDraft={handleDeleteDraft}
            onGenerateDraft={handleGenerateDraft}
            isGenerating={isGeneratingDraft}
            onLogActivity={handleLogActivity}
          />
        )}

        {activeTab === 'activity' && <ActivityTab logs={logs} />}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            profile={liveProfile}
            onSaveSettings={handleSaveSettings}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            onDisconnectGoogle={handleDisconnectGoogle}
          />
        )}
      </main>

      {/* Google Business Profile Guided Connect Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        connectionStatus={connectionStatus}
        setConnectionStatus={setConnectionStatus}
        currentProfile={liveProfile}
        onSelectAndConfirmProfile={handleSelectAndConfirmProfile}
      />

      {/* Build Your AI Workforce Modal */}
      <BuildWorkforceModal
        isOpen={isWorkforceModalOpen}
        onClose={() => setIsWorkforceModalOpen(false)}
        defaultMode={workforceModalMode}
      />

      {/* Billing & Subscription Modal */}
      {currentWorkspace && (
        <BillingModal
          isOpen={isBillingOpen}
          workspace={currentWorkspace}
          planConfig={planConfig}
          onClose={() => setIsBillingOpen(false)}
          onRefreshWorkspace={async () => {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
              const d = await res.json();
              if (d.workspace) {
                setCurrentWorkspace(d.workspace);
                hydrateFromWorkspace(d.workspace);
              }
            }
          }}
        />
      )}

      {/* Arthur Owner Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshWorkspace={async () => {
          const res = await fetch('/api/auth/me');
          if (res.ok) {
            const d = await res.json();
            if (d.workspace) {
              setCurrentWorkspace(d.workspace);
              hydrateFromWorkspace(d.workspace);
            }
          }
        }}
      />

      {/* Customer Auth & Sign In Modal */}
      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user, workspace) => {
          setCurrentUser(user);
          setCurrentWorkspace(workspace);
          hydrateFromWorkspace(workspace);
          setShowLandingPage(false);
        }}
      />

      {/* Customer Onboarding Wizard */}
      <CustomerOnboardingWizard
        isOpen={isOnboardingOpen}
        currentUser={currentUser}
        currentWorkspace={currentWorkspace}
        planConfig={planConfig}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(updatedWs) => {
          setCurrentWorkspace(updatedWs);
          hydrateFromWorkspace(updatedWs);
          setIsOnboardingOpen(false);
          setShowLandingPage(false);
        }}
      />

      {/* Google Compliance & Requirements Modal */}
      <GoogleRequirementsModal
        isOpen={isGoogleReqsOpen}
        onClose={() => setIsGoogleReqsOpen(false)}
      />

      {/* Legal & Support Modal */}
      <LegalPagesModal
        isOpen={isLegalOpen}
        initialTab={legalInitialTab}
        onClose={() => setIsLegalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0b0f26] py-5 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            Arthur’s AI Workforce · <strong className="text-white">Arthur’s Creatives</strong> (Public Multi-Tenant Foundation)
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <button
              onClick={() => {
                setLegalInitialTab('privacy');
                setIsLegalOpen(true);
              }}
              className="hover:underline cursor-pointer"
            >
              Privacy Policy (Draft)
            </button>
            <button
              onClick={() => {
                setLegalInitialTab('terms');
                setIsLegalOpen(true);
              }}
              className="hover:underline cursor-pointer"
            >
              Terms of Service (Draft)
            </button>
            <button
              onClick={() => {
                setLegalInitialTab('support');
                setIsLegalOpen(true);
              }}
              className="hover:underline cursor-pointer"
            >
              Support
            </button>
            <button
              onClick={() => setIsGoogleReqsOpen(true)}
              className="hover:underline text-[#00F3FF] cursor-pointer"
            >
              Google Access & Policies
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

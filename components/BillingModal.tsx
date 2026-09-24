'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Workspace, PlanConfig } from '@/types/workspace';

interface BillingModalProps {
  isOpen: boolean;
  workspace: Workspace;
  planConfig: PlanConfig;
  onClose: () => void;
  onRefreshWorkspace: () => void;
  onOpenPolicy?: (tab: 'billing') => void;
}

export function BillingModal({
  isOpen,
  workspace,
  planConfig,
  onClose,
  onRefreshWorkspace,
  onOpenPolicy,
}: BillingModalProps) {
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const { subscription, entitlements } = workspace;
  const isOwnerInternal = subscription.status === 'owner_internal';

  const handleStartCheckout = async () => {
    setIsLoadingCheckout(true);
    setNotice(null);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
      });
      const data = await res.json();

      if (data.isCheckoutDisabled) {
        setNotice(
          data.disabledReason ||
            'Paid checkout is currently disabled in test mode until Arthur approves the offer.'
        );
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        setNotice(data.error || 'Checkout session could not be created.');
      }
    } catch (err: any) {
      setNotice(err.message || 'Failed to initiate checkout.');
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  const handleOpenCustomerPortal = async () => {
    setIsLoadingPortal(true);
    setNotice(null);
    try {
      const res = await fetch('/api/billing/portal', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setNotice(data.error || 'Customer portal unavailable in test preview.');
      }
    } catch (err: any) {
      setNotice(err.message || 'Customer portal session failed.');
    } finally {
      setIsLoadingPortal(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="billing-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f26]/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-[#18204c] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close billing management dialog"
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#111738] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111738] border border-[#00F3FF]/30 text-[11px] font-mono text-[#00F3FF]">
            <CreditCard className="w-3 h-3" aria-hidden="true" />
            <span>Billing & Subscription Management</span>
          </div>
          <h2 id="billing-modal-title" className="text-xl font-bold text-white">
            Subscription & Usage Allowances
          </h2>
          <p className="text-xs text-slate-400">
            Workspace: <span className="text-white font-medium">{workspace.name}</span>
          </p>
        </div>

        {/* Feedback notice */}
        {notice && (
          <div
            role="alert"
            className="p-3.5 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300 flex items-start gap-2"
          >
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <span>{notice}</span>
          </div>
        )}

        {/* Approved Plan Notice */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-200 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Approved Subscription Offer:</strong> Standalone package finalized at $49.00 USD/month. Includes 1 managed Google Business location with full inconsistency auditing, automated diffs, content drafting, and review responses.
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-[#111738] border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-mono">Current Plan</span>
              <h3 className="text-sm font-bold text-white mt-0.5">{subscription.planName}</h3>
            </div>
            <div className="text-right">
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono ${
                  isOwnerInternal
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                    : subscription.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : subscription.status === 'trialing'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {subscription.status}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>
                {isOwnerInternal
                  ? 'Access: Perpetual Owner Access'
                  : `Access End Date: ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}`}
              </span>
            </div>
            <span className="text-slate-300 font-semibold">
              ${Math.round(subscription.priceInCents / 100)} / {subscription.billingInterval} (Recurring)
            </span>
          </div>
        </div>

        {/* Usage Allowances */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Workspace Usage & Quota Allowances
          </h4>

          <div className="space-y-2.5 text-xs">
            {/* AI Analyses */}
            <div className="bg-[#111738] p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Monthly AI Profile Inspections</span>
                <span className="font-mono text-white">
                  {entitlements.monthlyAiAnalysesUsed} / {isOwnerInternal ? '∞' : entitlements.monthlyAiAnalysesQuota}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#18204c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00F3FF] rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (entitlements.monthlyAiAnalysesUsed /
                        (isOwnerInternal ? 100 : entitlements.monthlyAiAnalysesQuota)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Generated Drafts */}
            <div className="bg-[#111738] p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Monthly Content & Review Drafts</span>
                <span className="font-mono text-white">
                  {entitlements.monthlyDraftsUsed} / {isOwnerInternal ? '∞' : entitlements.monthlyDraftsQuota}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#18204c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-400 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (entitlements.monthlyDraftsUsed /
                        (isOwnerInternal ? 100 : entitlements.monthlyDraftsQuota)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Automated Actions */}
            <div className="bg-[#111738] p-3 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Daily/Monthly Automated Workforce Actions</span>
                <span className="font-mono text-white">
                  {entitlements.monthlyAutomatedActionsUsed} / {isOwnerInternal ? '∞' : entitlements.monthlyAutomatedActionsQuota}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#18204c] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      (entitlements.monthlyAutomatedActionsUsed /
                        (isOwnerInternal ? 100 : entitlements.monthlyAutomatedActionsQuota)) *
                        100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Billing Disclosures & Separate Actions Callout */}
        <div className="p-3.5 bg-[#111738] border border-slate-800 rounded-2xl text-[11px] text-slate-300 space-y-2">
          <div className="flex items-center gap-1.5 text-white font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Recurring Billing & Cancellation Terms</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Subscriptions automatically renew at $49.00 USD/month until cancelled. You may cancel at any time via the Stripe Customer Portal or by emailing <code className="text-slate-200">arthurscreatives@gmail.com</code>. Cancellation takes effect at the end of your prepaid billing period.
          </p>
          <div className="p-2.5 bg-[#18204c] rounded-xl border border-slate-700/80 text-[11px] text-amber-300/90 leading-relaxed">
            <strong>Important Distinction:</strong> Disconnecting your Google Business Profile halts background automation and purges tokens, but does <em>not</em> cancel an active Stripe subscription. Cancelling a subscription stops charges, but does <em>not</em> automatically revoke Google OAuth authorization.
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <a
              href="/billing-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00F3FF] hover:underline flex items-center gap-1 focus-visible:ring-1 focus-visible:ring-[#00F3FF] rounded"
            >
              <span>View Full Billing, Cancellation & Refund Policy</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          {subscription.stripeCustomerId ? (
            <button
              type="button"
              onClick={handleOpenCustomerPortal}
              disabled={isLoadingPortal}
              className="w-full py-3 bg-[#111738] hover:bg-[#202b66] text-white border border-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
            >
              <span>{isLoadingPortal ? 'Opening Portal...' : 'Manage Payment Method & Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          ) : !isOwnerInternal ? (
            <button
              type="button"
              onClick={handleStartCheckout}
              disabled={isLoadingCheckout}
              className="w-full py-3 bg-gradient-to-r from-[#00F3FF] to-blue-500 hover:from-[#00F3FF]/90 text-[#0b0f26] font-bold text-xs rounded-xl shadow-lg shadow-[#00F3FF]/20 flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
            >
              <span>{isLoadingCheckout ? 'Preparing Checkout...' : 'Activate Subscription ($49/month)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-full text-center text-xs text-[#D4AF37] font-semibold py-2">
              Internal Owner Access Active • Billing Exemption Granted
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

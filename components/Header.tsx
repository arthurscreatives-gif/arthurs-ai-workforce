'use client';

import React from 'react';
import { ShieldCheck, PauseCircle, PlayCircle, KeyRound, Sparkles } from 'lucide-react';
import { ConnectionStatus, AppSettings } from '@/types/business-profile';

interface HeaderProps {
  connectionStatus: ConnectionStatus;
  settings: AppSettings;
  selectedProfileTitle: string;
  onTogglePauseAutomation: () => void;
  onOpenConnectModal: () => void;
  onOpenWorkforceBuilder?: (mode: 'build' | 'explore') => void;
  workspaceName?: string;
  userRole?: 'owner' | 'customer';
  onOpenBilling?: () => void;
  onOpenAdmin?: () => void;
  onOpenLandingPage?: () => void;
  onSignOut?: () => void;
}

export function Header({
  connectionStatus,
  settings,
  selectedProfileTitle,
  onTogglePauseAutomation,
  onOpenConnectModal,
  onOpenWorkforceBuilder,
  workspaceName,
  userRole,
  onOpenBilling,
  onOpenAdmin,
  onOpenLandingPage,
  onSignOut,
}: HeaderProps) {
  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Google Profile Connected
          </span>
        );
      case 'awaiting_google_access':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Awaiting Google Access
          </span>
        );
      case 'reconnection_required':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/15 text-orange-300 border border-orange-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            Reconnection Required
          </span>
        );
      case 'permission_denied':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Permission Denied
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/20 text-slate-300 border border-slate-600/40">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Not Connected
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#111738]/95 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 lg:px-8 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#18204c] to-[#0b0f26] border border-[#D4AF37] flex items-center justify-center shadow-md shadow-[#D4AF37]/10 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#00F3FF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Arthur’s AI Workforce
              </h1>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                Phase 1 Private
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Google Business Profile Manager · <span className="text-[#00F3FF] font-semibold">{selectedProfileTitle}</span>
            </p>
          </div>
        </div>

        {/* Controls & Badges */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Connection status badge */}
          <button
            onClick={onOpenConnectModal}
            className="cursor-pointer hover:opacity-90 transition-opacity"
            title="Click to view Google Business Profile connection diagnostics"
          >
            {getStatusBadge()}
          </button>

          {/* Autopilot status & Pause button */}
          <div className="flex items-center bg-[#18204c] border border-slate-700/80 rounded-lg p-1">
            <span className="px-2 py-0.5 text-slate-300 font-medium">
              Mode: <span className="text-white font-semibold">{settings.automationMode === 'review_first' ? 'Review First' : 'Routine Autopilot'}</span>
            </span>
            <button
              onClick={onTogglePauseAutomation}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-all ${
                settings.isAutomationPaused
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                  : 'bg-[#25336e] text-slate-200 hover:bg-[#2e3e85]'
              }`}
            >
              {settings.isAutomationPaused ? (
                <>
                  <PlayCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <PauseCircle className="w-3.5 h-3.5 text-[#00F3FF]" />
                  <span>Pause Automation</span>
                </>
              )}
            </button>
          </div>

          {/* Owner badge & Multi-tenant workspace badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#18204c]/80 border border-[#D4AF37]/30 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-medium truncate max-w-[170px]" title={workspaceName || settings.ownerEmail}>
              {workspaceName || settings.ownerEmail}
            </span>
          </div>

          {/* Billing & Entitlements button */}
          {onOpenBilling && (
            <button
              onClick={onOpenBilling}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#18204c] hover:bg-[#222d64] text-slate-200 border border-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
              title="View Subscription & Usage Allowances"
            >
              <span>Billing</span>
            </button>
          )}

          {/* Owner Admin button */}
          {userRole === 'owner' && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] border border-[#D4AF37]/40 font-bold rounded-lg transition-colors cursor-pointer"
              title="Arthur Owner Platform Administration"
            >
              <span>Admin</span>
            </button>
          )}

          {/* Public Landing Page link */}
          {onOpenLandingPage && (
            <button
              onClick={onOpenLandingPage}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-white hover:bg-[#18204c] rounded-lg text-xs transition-colors cursor-pointer"
              title="View Public Product Landing Page"
            >
              <span>Public Landing</span>
            </button>
          )}

          {/* Sign Out / Switch account */}
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="flex items-center gap-1 px-2 py-1.5 text-slate-400 hover:text-rose-300 rounded-lg text-xs transition-colors cursor-pointer"
              title="Switch Workspace or Sign Out"
            >
              <span>Switch</span>
            </button>
          )}

          {/* Secondary CTA: Explore AI Agents */}
          {onOpenWorkforceBuilder && (
            <button
              onClick={() => onOpenWorkforceBuilder('explore')}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 text-[#00F3FF] hover:text-white hover:bg-[#18204c] border border-[#00F3FF]/40 font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00F3FF]" />
              <span>Explore AI Agents</span>
            </button>
          )}

          {/* Primary CTA: Build Your AI Workforce */}
          {onOpenWorkforceBuilder && (
            <button
              onClick={() => onOpenWorkforceBuilder('build')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-extrabold rounded-lg transition-all shadow-sm shadow-[#D4AF37]/25 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0b0f26]" />
              <span>Build Your AI Workforce</span>
            </button>
          )}

          {/* Google Connection Form button */}
          <button
            onClick={onOpenConnectModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00F3FF] hover:bg-[#00d8e4] text-[#0b0f26] font-bold rounded-lg transition-all shadow-sm shadow-[#00F3FF]/25 cursor-pointer"
            title="Open Google Business Profile Connection & Credentials Form"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#0b0f26]" />
            <span>Google Connection Form</span>
          </button>
        </div>
      </div>
    </header>
  );
}

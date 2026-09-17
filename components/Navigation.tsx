'use client';

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Wrench,
  TrendingUp,
  FileEdit,
  History,
  Settings,
  Sliders,
} from 'lucide-react';

export type NavTabId =
  | 'overview'
  | 'operations'
  | 'business_profile'
  | 'audit_repairs'
  | 'search_insights'
  | 'content_drafts'
  | 'activity'
  | 'settings';

interface NavigationProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  pendingRepairsCount: number;
  openFindingsCount: number;
  draftsCount: number;
  pendingOperationsCount?: number;
}

export function Navigation({
  activeTab,
  onSelectTab,
  pendingRepairsCount,
  openFindingsCount,
  draftsCount,
  pendingOperationsCount = 0,
}: NavigationProps) {
  const tabs: Array<{
    id: NavTabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    {
      id: 'operations',
      label: 'Operations & Alerts',
      icon: Sliders,
      badge: pendingOperationsCount > 0 ? pendingOperationsCount : undefined,
      badgeColor: 'bg-amber-400 text-[#0b0f26] font-bold',
    },
    { id: 'business_profile', label: 'Business Profile', icon: Building2 },
    {
      id: 'audit_repairs',
      label: 'Audit & Repairs',
      icon: Wrench,
      badge: pendingRepairsCount + openFindingsCount > 0 ? pendingRepairsCount + openFindingsCount : undefined,
      badgeColor: 'bg-[#D4AF37] text-[#0b0f26]',
    },
    { id: 'search_insights', label: 'Search Insights', icon: TrendingUp },
    {
      id: 'content_drafts',
      label: 'Content Drafts',
      icon: FileEdit,
      badge: draftsCount > 0 ? draftsCount : undefined,
      badgeColor: 'bg-[#00F3FF]/20 text-[#00F3FF] border border-[#00F3FF]/40',
    },
    { id: 'activity', label: 'Activity', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-[#0b0f26]/80 border-b border-slate-800 px-4 lg:px-8 py-2 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer select-none whitespace-nowrap ${
                isActive
                  ? 'bg-[#18204c] text-white border border-[#D4AF37] shadow-sm shadow-[#D4AF37]/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#18204c]/50'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-[#00F3FF]' : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                    tab.badgeColor || 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

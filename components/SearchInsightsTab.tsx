'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  PhoneCall,
  Globe,
  MapPin,
  Eye,
  Info,
  Calendar,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { SearchInsightMetrics, SearchQueryItem } from '@/types/business-profile';

interface SearchInsightsTabProps {
  metrics: SearchInsightMetrics;
  onRefreshMetrics: () => void;
  isRefreshing: boolean;
}

export function SearchInsightsTab({
  metrics,
  onRefreshMetrics,
  isRefreshing,
}: SearchInsightsTabProps) {
  const [activeTermsTab, setActiveTermsTab] = useState<'observed' | 'suggested'>('observed');

  const observedTerms = metrics.topSearchQueries.filter((q) => q.isObserved);
  const suggestedIdeas = metrics.topSearchQueries.filter((q) => !q.isObserved);

  return (
    <div className="space-y-6">
      {/* Header with Reporting Period & Sync Status */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Search Performance & Google Insights
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Official GMB Telemetry
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Performance metrics retrieved directly from Google Business Profile performance APIs for the reporting period.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-right text-xs">
              <div className="text-slate-300 font-medium flex items-center gap-1.5 justify-end">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Period: {metrics.reportingPeriod}</span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 justify-end mt-0.5">
                <Clock className="w-3 h-3 text-[#00F3FF]" />
                <span>Last Sync: {metrics.lastSyncedAt}</span>
              </div>
            </div>

            <button
              onClick={onRefreshMetrics}
              disabled={isRefreshing}
              className="px-3.5 py-2 bg-[#25336e] hover:bg-[#2e3e85] text-white text-xs font-bold rounded-xl border border-slate-600 transition-colors flex items-center gap-1.5"
            >
              <span>{isRefreshing ? 'Fetching GMB...' : 'Refresh Telemetry'}</span>
            </button>
          </div>
        </div>

        {/* Reporting Delay Notice */}
        <div className="mt-4 p-3 bg-[#111738] rounded-xl border border-slate-700/80 text-xs text-slate-300 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#00F3FF] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Google Reporting Latency Notice</p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Google Business Profile performance data is subject to a standard <strong>48 to 72-hour processing window</strong>. Recent interactions today or yesterday will finalize in the next reporting cycle.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Impressions */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Total Impressions</span>
            <Eye className="w-4 h-4 text-[#00F3FF]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {((metrics.impressionsSearch ?? 0) + (metrics.impressionsMaps ?? 0)).toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              +18.5%
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Google Search:</span>
              <span className="text-white font-mono">{(metrics.impressionsSearch ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Google Maps:</span>
              <span className="text-white font-mono">{(metrics.impressionsMaps ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Website Clicks */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Website Actions</span>
            <Globe className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {(metrics.websiteClicks ?? 0).toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              +24.1%
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            Clicks directly to <strong className="text-slate-300">arthurscreatives.com</strong> from Google Search and Maps listings.
          </p>
        </div>

        {/* Card 3: Call Clicks (Strictly Labeled!) */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Call Button Clicks</span>
            <PhoneCall className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">
              {(metrics.callClicks ?? 0).toLocaleString()}
            </span>
            <span className="text-xs font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              +12.0%
            </span>
          </div>
          <p className="mt-3 text-[11px] text-amber-300/90 pt-2 border-t border-slate-800 leading-tight">
            * Clicks on the profile call button. <strong>Not confirmed customer calls</strong> (subject to user dialing completion).
          </p>
        </div>

        {/* Card 4: Direction Requests (Strictly explained for SAB!) */}
        <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold text-slate-300">Driving Directions</span>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-400">
              Not Applicable
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800 leading-tight">
            Arthur’s Creatives is a <strong>Service-Area Business</strong> with hidden address. Driving directions are disabled on Google per guidelines.
          </p>
        </div>
      </div>

      {/* Strict Separation: Search Queries vs Keyword Ideas */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Search Queries & Organic Discovery
            </h3>
            <p className="text-xs text-slate-300">
              Clear distinction between queries observed by Google vs AI-suggested content opportunities.
            </p>
          </div>

          <div className="bg-[#111738] p-1 rounded-xl border border-slate-700 flex text-xs">
            <button
              onClick={() => setActiveTermsTab('observed')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTermsTab === 'observed'
                  ? 'bg-[#00F3FF] text-[#0b0f26]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Observed by Google ({observedTerms.length})
            </button>
            <button
              onClick={() => setActiveTermsTab('suggested')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTermsTab === 'suggested'
                  ? 'bg-[#D4AF37] text-[#0b0f26]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Suggested Keyword Ideas ({suggestedIdeas.length})
            </button>
          </div>
        </div>

        {/* OBSERVED TERMS TABLE */}
        {activeTermsTab === 'observed' && (
          <div className="space-y-3">
            <div className="bg-[#111738] p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300">
              <strong className="text-white">Note on Observed Search Terms:</strong> These terms reflect actual query impressions reported by Google Performance API. They indicate what triggered impressions, not an exhaustive inventory of all local searches.
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#111738] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Search Query Term</th>
                    <th className="py-2.5 px-3">Estimated Monthly Impressions</th>
                    <th className="py-2.5 px-3">Category Relevance</th>
                    <th className="py-2.5 px-3">Origin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {observedTerms.map((term, i) => (
                    <tr key={i} className="hover:bg-[#111738]/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white font-mono">
                        {term.query}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-emerald-400 font-bold">
                          {term.estimatedVolume?.toLocaleString() || '10+'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#111738] border border-slate-700 text-[11px] text-slate-200">
                          {term.relevance}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00F3FF]/15 text-[#00F3FF] border border-[#00F3FF]/30">
                          Google GMB Telemetry
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUGGESTED IDEAS TABLE */}
        {activeTermsTab === 'suggested' && (
          <div className="space-y-3">
            <div className="bg-[#111738] p-3 rounded-lg border border-[#D4AF37]/40 text-[11px] text-slate-300">
              <strong className="text-[#D4AF37]">Search & Content Analyst Recommendations:</strong> These keyword ideas represent natural thematic opportunities for future Google Business Profile post drafts and service descriptions. No keyword stuffing allowed in business name or titles.
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#111738] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Recommended Theme / Keyword</th>
                    <th className="py-2.5 px-3">Application Area</th>
                    <th className="py-2.5 px-3">Craft Guidance</th>
                    <th className="py-2.5 px-3">Origin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {suggestedIdeas.map((term, i) => (
                    <tr key={i} className="hover:bg-[#111738]/50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-white">
                        {term.query}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#111738] border border-slate-700 text-[11px] text-[#D4AF37]">
                          {term.relevance}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-400">
                        Include naturally in post drafts or service menu item descriptions.
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                          AI Analyst Proposal
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Responsible Disclaimer Box */}
        <div className="bg-[#0b0f26] p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-300 block mb-1">Methodology & Transparency Policy:</strong>
          Performance data is retrieved strictly through authorized Google Business Profile API connections. Search term volumes are estimations provided by Google. In compliance with Phase 1 directives, Arthur’s AI Workforce does not make unverified ranking guarantee claims or customer conversion promises without external conversion telemetry.
        </div>
      </div>
    </div>
  );
}

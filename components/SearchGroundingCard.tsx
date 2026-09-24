'use client';

import React, { useState } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { GroundingSource } from '@/app/api/ai/search-grounding/route';

interface SearchGroundingCardProps {
  businessName?: string;
  onApplyInsightToProfile?: (insightText: string) => void;
}

export function SearchGroundingCard({
  businessName = "Arthur's Creatives",
  onApplyInsightToProfile,
}: SearchGroundingCardProps) {
  const [query, setQuery] = useState(
    'current Google Business Profile ranking signals and local search optimization strategies'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastExecutedAt, setLastExecutedAt] = useState<string | null>(null);

  const sampleQueries = [
    'local SEO ranking factors for business automation agencies',
    'Google Business Profile rules for Service-Area Businesses with hidden address',
    'AI receptionist and phone automation consumer search intent trends',
    'how to increase Google Maps impressions without physical storefront',
  ];

  const handleExecuteSearch = async (customQuery?: string) => {
    const q = (customQuery || query).trim();
    if (!q) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/ai/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          businessName,
          context:
            'Arthur’s AI Workforce: Digital workforce automation platform, AI phone receptionists, Google Business Profile consistency, and local service lead generation.',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to execute search grounding');
      }

      setResultText(data.text);
      setSources(data.sources || []);
      setSearchQueries(data.searchQueries || []);
      setLastExecutedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Search grounding request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00F3FF]" />
              Live Google Search Grounding & Web Telemetry
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#00F3FF]/15 text-[#00F3FF] border border-[#00F3FF]/30">
              gemini-3.5-flash + googleSearch
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Ground your strategy with real-time web facts, local search intelligence, and Google ranking signals.
          </p>
        </div>

        {lastExecutedAt && (
          <span className="text-xs text-slate-400 font-mono">
            Synced: {lastExecutedAt}
          </span>
        )}
      </div>

      {/* Query Search Bar */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleExecuteSearch();
              }}
              placeholder="Search Google web data for local ranking trends, competitor terms, or guidelines..."
              disabled={isLoading}
              className="w-full bg-[#111738] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F3FF] transition-all"
            />
          </div>
          <button
            onClick={() => handleExecuteSearch()}
            disabled={isLoading || !query.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F3FF] to-[#00c8d4] text-[#0b0f26] font-bold text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-md flex-shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Grounding...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Search Grounding</span>
              </>
            )}
          </button>
        </div>

        {/* Quick query tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3 text-[#D4AF37]" />
            Suggested Grounding Queries:
          </span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(sq);
                handleExecuteSearch(sq);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#111738] text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-all text-left"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grounding Results Display */}
      {resultText && (
        <div className="space-y-4 pt-2">
          {/* Web Search Queries Executed */}
          {searchQueries.length > 0 && (
            <div className="p-3 bg-[#111738] rounded-xl border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Google Search Queries Executed:</span>
              {searchQueries.map((sq, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-[#00F3FF]/10 text-[#00F3FF] border border-[#00F3FF]/20 text-[11px] font-mono"
                >
                  &ldquo;{sq}&rdquo;
                </span>
              ))}
            </div>
          )}

          {/* Synthesized Grounded Analysis */}
          <div className="p-4 bg-[#111738] rounded-xl border border-slate-700/80 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Grounded Knowledge Synthesis (gemini-3.5-flash)
              </span>
              <span>Real-Time Google Search Tool</span>
            </div>
            <div className="pt-1">{resultText}</div>
          </div>

          {/* Verified Web Sources Citations */}
          {sources.length > 0 && (
            <div className="p-3.5 bg-[#111738] rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Verified Web Citations & Sources ({sources.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.uri}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-[#18204c] hover:bg-[#1f2a63] border border-slate-700 text-xs text-slate-200 flex items-center justify-between gap-2 group transition-all"
                  >
                    <div className="truncate">
                      <span className="font-semibold text-white group-hover:text-[#00F3FF] transition-colors truncate block">
                        {src.title || src.uri}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {src.uri}
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00F3FF] flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

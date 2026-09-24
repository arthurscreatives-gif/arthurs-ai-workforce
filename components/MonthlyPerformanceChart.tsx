'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  Activity,
  Layers,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { MonthlyPerformanceMetric } from '@/types/business-profile';

interface MonthlyPerformanceChartProps {
  data: MonthlyPerformanceMetric[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  // Retrieve raw record from payload
  const currentItem = payload[0]?.payload as MonthlyPerformanceMetric | undefined;

  const views = currentItem?.views ?? 0;
  const clicks = currentItem?.clicks ?? 0;
  const actions = currentItem?.actions ?? 0;
  const searchViews = currentItem?.searchViews ?? 0;
  const mapsViews = currentItem?.mapsViews ?? 0;
  const websiteClicks = currentItem?.websiteClicks ?? 0;
  const callClicks = currentItem?.callClicks ?? 0;

  const actionRate = views > 0 ? ((actions / views) * 100).toFixed(1) : '0.0';
  const clickRate = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-[#0b0f26]/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md min-w-[240px] text-xs space-y-3 pointer-events-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-bold text-white text-sm flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
          {currentItem?.month || label}
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Verified Telemetry
        </span>
      </div>

      <div className="space-y-2">
        {/* Views Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F3FF] shadow-[0_0_8px_#00F3FF]" />
            <span className="text-slate-300 font-medium">Views (Impressions):</span>
          </div>
          <span className="font-mono font-bold text-white text-xs">
            {views.toLocaleString()}
          </span>
        </div>
        <div className="pl-4 text-[10px] text-slate-400 flex justify-between">
          <span>Search: {searchViews.toLocaleString()}</span>
          <span>Maps: {mapsViews.toLocaleString()}</span>
        </div>

        {/* Clicks Row */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
            <span className="text-slate-300 font-medium">Clicks:</span>
          </div>
          <span className="font-mono font-bold text-[#D4AF37] text-xs">
            {clicks.toLocaleString()}
          </span>
        </div>
        <div className="pl-4 text-[10px] text-slate-400 flex justify-between">
          <span>Website: {websiteClicks.toLocaleString()}</span>
          <span>Call Button: {callClicks.toLocaleString()}</span>
        </div>

        {/* Actions Row */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
            <span className="text-slate-300 font-medium">Customer Actions:</span>
          </div>
          <span className="font-mono font-bold text-emerald-400 text-xs">
            {actions.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Ratios Footnote */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Action Conversion:</span>
        <span className="font-bold text-emerald-300 font-mono">{actionRate}%</span>
      </div>
    </div>
  );
}

export function MonthlyPerformanceChart({ data }: MonthlyPerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<'6m' | '12m'>('12m');
  const [showViews, setShowViews] = useState(true);
  const [showClicks, setShowClicks] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [axisMode, setAxisMode] = useState<'dual' | 'single'>('dual');

  // Filter dataset according to selected timeframe
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (timeframe === '6m') {
      return data.slice(-6);
    }
    return data.slice(-12);
  }, [data, timeframe]);

  // Calculate summary metrics for the active timeframe
  const summary = useMemo(() => {
    if (!filteredData.length) {
      return {
        totalViews: 0,
        totalClicks: 0,
        totalActions: 0,
        viewsGrowth: 0,
        clicksGrowth: 0,
        actionsGrowth: 0,
        avgActionRate: 0,
      };
    }

    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];

    const totalViews = filteredData.reduce((acc, curr) => acc + curr.views, 0);
    const totalClicks = filteredData.reduce((acc, curr) => acc + curr.clicks, 0);
    const totalActions = filteredData.reduce((acc, curr) => acc + curr.actions, 0);

    const viewsGrowth =
      first.views > 0
        ? Math.round(((last.views - first.views) / first.views) * 100)
        : 0;

    const clicksGrowth =
      first.clicks > 0
        ? Math.round(((last.clicks - first.clicks) / first.clicks) * 100)
        : 0;

    const actionsGrowth =
      first.actions > 0
        ? Math.round(((last.actions - first.actions) / first.actions) * 100)
        : 0;

    const avgActionRate =
      totalViews > 0 ? Number(((totalActions / totalViews) * 100).toFixed(1)) : 0;

    return {
      totalViews,
      totalClicks,
      totalActions,
      viewsGrowth,
      clicksGrowth,
      actionsGrowth,
      avgActionRate,
    };
  }, [filteredData]);

  return (
    <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Chart Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00F3FF]" />
              Monthly Search Performance Trends
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#00F3FF]/15 text-[#00F3FF] border border-[#00F3FF]/30">
              Clicks, Views & Actions
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Interactive visualization of Google Search & Maps views, user clicks, and verified customer actions over time.
          </p>
        </div>

        {/* Timeframe & Mode Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Switcher */}
          <div className="bg-[#111738] p-1 rounded-xl border border-slate-700 flex text-xs">
            <button
              onClick={() => setTimeframe('6m')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                timeframe === '6m'
                  ? 'bg-[#00F3FF] text-[#0b0f26] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setTimeframe('12m')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                timeframe === '12m'
                  ? 'bg-[#00F3FF] text-[#0b0f26] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Last 12 Months
            </button>
          </div>

          {/* Dual vs Single Axis Switcher */}
          <div className="bg-[#111738] p-1 rounded-xl border border-slate-700 flex text-xs">
            <button
              onClick={() => setAxisMode('dual')}
              title="Dual Y-Axis (Scales Views on Left and Clicks/Actions on Right for clarity)"
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                axisMode === 'dual'
                  ? 'bg-[#D4AF37] text-[#0b0f26] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dual Scale
            </button>
            <button
              onClick={() => setAxisMode('single')}
              title="Single Y-Axis (Same absolute scale for all metrics)"
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                axisMode === 'single'
                  ? 'bg-[#D4AF37] text-[#0b0f26] font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Single Scale
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Badges for Selected Timeframe */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Stat 1: Total Views */}
        <button
          type="button"
          onClick={() => setShowViews((prev) => !prev)}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            showViews
              ? 'bg-[#111738] border-[#00F3FF]/40 shadow-[0_0_15px_rgba(0,243,255,0.08)]'
              : 'bg-[#111738]/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F3FF]" />
              Total Views
            </span>
            <Eye className="w-3.5 h-3.5 text-[#00F3FF]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-white">
              {summary.totalViews.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              +{summary.viewsGrowth}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            {showViews ? 'Visible in chart' : 'Hidden in chart'}
          </span>
        </button>

        {/* Stat 2: Total Clicks */}
        <button
          type="button"
          onClick={() => setShowClicks((prev) => !prev)}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            showClicks
              ? 'bg-[#111738] border-[#D4AF37]/40 shadow-[0_0_15px_rgba(212,175,55,0.08)]'
              : 'bg-[#111738]/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
              Total Clicks
            </span>
            <MousePointerClick className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-white">
              {summary.totalClicks.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              +{summary.clicksGrowth}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Website & call clicks
          </span>
        </button>

        {/* Stat 3: Total Actions */}
        <button
          type="button"
          onClick={() => setShowActions((prev) => !prev)}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            showActions
              ? 'bg-[#111738] border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.08)]'
              : 'bg-[#111738]/40 border-slate-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              Customer Actions
            </span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-white">
              {summary.totalActions.toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              +{summary.actionsGrowth}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Direct profile interactions
          </span>
        </button>

        {/* Stat 4: Action Conversion Rate */}
        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#111738]">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-300">Action Rate</span>
            <Sparkles className="w-3.5 h-3.5 text-[#00F3FF]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-[#00F3FF]">
              {summary.avgActionRate}%
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              High Intent
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">
            Actions per 100 views
          </span>
        </div>
      </div>

      {/* Recharts Interactive Line Chart Container */}
      <div className="w-full h-[360px] bg-[#111738]/70 rounded-xl p-3 border border-slate-800">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 18, right: 24, left: 10, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#212a55"
              vertical={false}
            />

            {/* X Axis: Months */}
            <XAxis
              dataKey="shortMonth"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />

            {/* Left Y Axis for Views */}
            <YAxis
              yAxisId="views"
              orientation="left"
              stroke="#00F3FF"
              tick={{ fill: '#00F3FF', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
              domain={['auto', 'auto']}
              label={{
                value: 'Views (Search & Maps)',
                angle: -90,
                position: 'insideLeft',
                fill: '#00F3FF',
                fontSize: 10,
                dx: -2,
                dy: 60,
              }}
            />

            {/* Right Y Axis for Engagement (Clicks & Actions) in Dual Mode */}
            {axisMode === 'dual' && (
              <YAxis
                yAxisId="engagement"
                orientation="right"
                stroke="#D4AF37"
                tick={{ fill: '#D4AF37', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
                domain={['auto', 'auto']}
                label={{
                  value: 'Clicks & Actions',
                  angle: 90,
                  position: 'insideRight',
                  fill: '#D4AF37',
                  fontSize: 10,
                  dx: 4,
                  dy: 45,
                }}
              />
            )}

            {/* Rich Custom Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Standard Legend */}
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
              iconType="circle"
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontWeight: 600, marginRight: 12 }}>
                  {value}
                </span>
              )}
            />

            {/* Line 1: Views (Electric Cyan) */}
            {showViews && (
              <Line
                yAxisId="views"
                type="monotone"
                dataKey="views"
                name="Views"
                stroke="#00F3FF"
                strokeWidth={2.75}
                dot={{ r: 4, fill: '#00F3FF', strokeWidth: 1, stroke: '#0b0f26' }}
                activeDot={{
                  r: 7,
                  fill: '#00F3FF',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
                animationDuration={900}
              />
            )}

            {/* Line 2: Clicks (Brand Gold) */}
            {showClicks && (
              <Line
                yAxisId={axisMode === 'dual' ? 'engagement' : 'views'}
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="#D4AF37"
                strokeWidth={2.75}
                dot={{ r: 4, fill: '#D4AF37', strokeWidth: 1, stroke: '#0b0f26' }}
                activeDot={{
                  r: 7,
                  fill: '#D4AF37',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
                animationDuration={900}
              />
            )}

            {/* Line 3: Actions (Google Verified Emerald) */}
            {showActions && (
              <Line
                yAxisId={axisMode === 'dual' ? 'engagement' : 'views'}
                type="monotone"
                dataKey="actions"
                name="Actions"
                stroke="#10B981"
                strokeWidth={2.75}
                dot={{ r: 4, fill: '#10B981', strokeWidth: 1, stroke: '#0b0f26' }}
                activeDot={{
                  r: 7,
                  fill: '#10B981',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
                animationDuration={900}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Educational Footer Legend & Telemetry Guide */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F3FF]" />
            <strong>Views:</strong> Search + Maps query impressions
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
            <strong>Clicks:</strong> Website visits + call button clicks
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <strong>Actions:</strong> Completed customer touchpoints
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-[#00F3FF]" />
          <span>Click on any stat card above to toggle metrics on/off</span>
        </div>
      </div>
    </div>
  );
}

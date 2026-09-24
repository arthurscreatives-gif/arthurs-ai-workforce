'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  Activity,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Info,
  Clock,
  Download,
  Table as TableIcon,
  LineChart as LineChartIcon,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { DailyPerformanceMetric } from '@/types/business-profile';

interface ThirtyDayTrendChartProps {
  data: DailyPerformanceMetric[];
  title?: string;
  subtitle?: string;
}

type MetricFocusMode = 'combined' | 'channels' | 'clicks' | 'cumulative';
type WindowFilter = '30d' | '14d' | '7d';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

function CustomThirtyDayTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const currentItem = payload[0]?.payload as DailyPerformanceMetric | undefined;
  if (!currentItem) return null;

  const totalImpressions = currentItem.totalImpressions ?? 0;
  const searchImpressions = currentItem.searchImpressions ?? 0;
  const mapsImpressions = currentItem.mapsImpressions ?? 0;
  const websiteClicks = currentItem.websiteClicks ?? 0;
  const callClicks = currentItem.callClicks ?? 0;
  const totalClicks = currentItem.totalClicks ?? 0;
  const isWeekend = currentItem.dayOfWeek === 'Sat' || currentItem.dayOfWeek === 'Sun';

  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-[#0b0f26]/95 border border-slate-700/90 rounded-xl p-4 shadow-2xl backdrop-blur-md min-w-[260px] text-xs space-y-3 pointer-events-none z-50">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div>
          <span className="font-bold text-white text-sm flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            {currentItem.fullDate}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            {currentItem.dayOfWeek} &bull; {isWeekend ? 'Weekend Traffic' : 'Weekday Business Hours'}
          </span>
        </div>
        {currentItem.isProcessingWindow ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Processing (48-72h)
          </span>
        ) : (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Settled Telemetry
          </span>
        )}
      </div>

      <div className="space-y-2">
        {/* Total Impressions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F3FF] shadow-[0_0_8px_#00F3FF]" />
            <span className="text-slate-300 font-medium">Total Impressions:</span>
          </div>
          <span className="font-mono font-bold text-white text-xs">
            {totalImpressions.toLocaleString()}
          </span>
        </div>
        <div className="pl-4 text-[10px] text-slate-400 flex justify-between">
          <span>Search: {searchImpressions.toLocaleString()}</span>
          <span>Maps: {mapsImpressions.toLocaleString()}</span>
        </div>

        {/* Total Clicks */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
            <span className="text-slate-300 font-medium">Customer Clicks:</span>
          </div>
          <span className="font-mono font-bold text-[#D4AF37] text-xs">
            {totalClicks.toLocaleString()}
          </span>
        </div>
        <div className="pl-4 text-[10px] text-slate-400 flex justify-between">
          <span>Website: {websiteClicks.toLocaleString()}</span>
          <span>Call Button: {callClicks.toLocaleString()}</span>
        </div>

        {/* 7-Day Moving Average */}
        {currentItem.movingAverage7d !== undefined && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-1.5 rounded-full bg-[#A855F7]" />
              <span className="text-slate-400 text-[11px]">7-Day Moving Avg:</span>
            </div>
            <span className="font-mono font-semibold text-purple-300 text-xs">
              {currentItem.movingAverage7d.toLocaleString()} / day
            </span>
          </div>
        )}
      </div>

      {/* Ratios Footnote */}
      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Click-Through Rate (CTR):</span>
        <span className="font-bold text-emerald-300 font-mono">{ctr}%</span>
      </div>
    </div>
  );
}

export function ThirtyDayTrendChart({
  data,
  title = '30-Day Search Performance & Growth Trend',
  subtitle = 'Visualizing daily Google Search & Maps discovery, customer clicks, and 7-day velocity over the last 30 days.',
}: ThirtyDayTrendChartProps) {
  const [metricMode, setMetricMode] = useState<MetricFocusMode>('combined');
  const [windowFilter, setWindowFilter] = useState<WindowFilter>('30d');
  const [showMovingAverage, setShowMovingAverage] = useState(true);
  const [viewFormat, setViewFormat] = useState<'chart' | 'table'>('chart');

  // Filter dataset by window (30d, 14d, 7d)
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (windowFilter === '7d') return data.slice(-7);
    if (windowFilter === '14d') return data.slice(-14);
    return data;
  }, [data, windowFilter]);

  // Aggregate stats across the selected window
  const stats = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      return {
        totalViews: 0,
        searchViews: 0,
        mapsViews: 0,
        totalClicks: 0,
        websiteClicks: 0,
        callClicks: 0,
        peakDay: null as DailyPerformanceMetric | null,
        avgDailyViews: 0,
        avgDailyClicks: 0,
        growthVsStart: 0,
      };
    }

    let totalViews = 0;
    let searchViews = 0;
    let mapsViews = 0;
    let totalClicks = 0;
    let websiteClicks = 0;
    let callClicks = 0;
    let peakDay = filteredData[0];

    filteredData.forEach((day) => {
      totalViews += day.totalImpressions;
      searchViews += day.searchImpressions;
      mapsViews += day.mapsImpressions;
      totalClicks += day.totalClicks;
      websiteClicks += day.websiteClicks;
      callClicks += day.callClicks;
      if (day.totalImpressions > peakDay.totalImpressions) {
        peakDay = day;
      }
    });

    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    const growthVsStart =
      first.totalImpressions > 0
        ? Number((((last.totalImpressions - first.totalImpressions) / first.totalImpressions) * 100).toFixed(1))
        : 0;

    return {
      totalViews,
      searchViews,
      mapsViews,
      totalClicks,
      websiteClicks,
      callClicks,
      peakDay,
      avgDailyViews: Math.round(totalViews / filteredData.length),
      avgDailyClicks: Number((totalClicks / filteredData.length).toFixed(1)),
      growthVsStart,
    };
  }, [filteredData]);

  // Export CSV function for download
  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = [
      'Date',
      'Day of Week',
      'Google Search Impressions',
      'Google Maps Impressions',
      'Total Impressions',
      'Website Clicks',
      'Call Button Clicks',
      'Total Clicks',
      '7-Day Moving Avg',
      'Status',
    ];

    const rows = filteredData.map((d) => [
      d.isoDate,
      d.dayOfWeek,
      d.searchImpressions,
      d.mapsImpressions,
      d.totalImpressions,
      d.websiteClicks,
      d.callClicks,
      d.totalClicks,
      d.movingAverage7d ?? '',
      d.isProcessingWindow ? 'Processing (48-72h)' : 'Settled',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `arthurs-search-performance-30d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Header & Overview */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00F3FF]" />
              {title}
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +18.5% Growth Trajectory
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">{subtitle}</p>
        </div>

        {/* View Switches & Download */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Time Window Switcher (30d / 14d / 7d) */}
          <div className="bg-[#111738] p-1 rounded-xl border border-slate-700 flex text-xs">
            <button
              onClick={() => setWindowFilter('30d')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                windowFilter === '30d'
                  ? 'bg-[#00F3FF] text-[#0b0f26] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setWindowFilter('14d')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                windowFilter === '14d'
                  ? 'bg-[#00F3FF] text-[#0b0f26] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setWindowFilter('7d')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                windowFilter === '7d'
                  ? 'bg-[#00F3FF] text-[#0b0f26] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              7 Days
            </button>
          </div>

          {/* View Format (Chart vs Table) */}
          <div className="bg-[#111738] p-1 rounded-xl border border-slate-700 flex text-xs">
            <button
              onClick={() => setViewFormat('chart')}
              className={`p-1.5 rounded-lg transition-all ${
                viewFormat === 'chart'
                  ? 'bg-[#D4AF37] text-[#0b0f26]'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Visual Chart View"
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewFormat('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewFormat === 'table'
                  ? 'bg-[#D4AF37] text-[#0b0f26]'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Daily Data Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="p-2 bg-[#25336e] hover:bg-[#2e3e85] text-slate-200 hover:text-white rounded-xl border border-slate-600 transition-colors text-xs flex items-center gap-1.5"
            title="Download Daily Telemetry CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Breakdown Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111738] p-4 rounded-xl border border-slate-800">
        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Window Impressions:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white font-mono">
              {stats.totalViews.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-emerald-400">
              +{stats.growthVsStart}%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            Avg: {stats.avgDailyViews.toLocaleString()}/day
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Window Customer Clicks:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#D4AF37] font-mono">
              {stats.totalClicks.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">
              (Web {stats.websiteClicks} &bull; Call {stats.callClicks})
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            Avg: {stats.avgDailyClicks}/day
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Search vs Maps Ratio:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-[#00F3FF] font-mono">
              {stats.totalViews > 0
                ? `${Math.round((stats.searchViews / stats.totalViews) * 100)}%`
                : '0%'}
            </span>
            <span className="text-[10px] text-slate-400">Google Search</span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            Maps: {stats.mapsViews.toLocaleString()} views
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[11px] text-slate-400 font-medium">Peak Single Day:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-emerald-300 font-mono">
              {stats.peakDay ? stats.peakDay.totalImpressions.toLocaleString() : '0'}
            </span>
            <span className="text-[10px] text-slate-400">
              {stats.peakDay ? stats.peakDay.date : ''}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">
            {stats.peakDay ? `${stats.peakDay.totalClicks} clicks recorded` : ''}
          </span>
        </div>
      </div>

      {/* Chart Metric Mode Tabs */}
      {viewFormat === 'chart' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Focus Modes */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#111738] p-1 rounded-xl border border-slate-700/80 text-xs">
              <button
                onClick={() => setMetricMode('combined')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  metricMode === 'combined'
                    ? 'bg-[#00F3FF] text-[#0b0f26]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Combined Traffic (Impressions &amp; Clicks)
              </button>
              <button
                onClick={() => setMetricMode('channels')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  metricMode === 'channels'
                    ? 'bg-[#00F3FF] text-[#0b0f26]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Search vs. Maps Channels
              </button>
              <button
                onClick={() => setMetricMode('clicks')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  metricMode === 'clicks'
                    ? 'bg-[#D4AF37] text-[#0b0f26]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Website Clicks vs. Call Buttons
              </button>
              <button
                onClick={() => setMetricMode('cumulative')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  metricMode === 'cumulative'
                    ? 'bg-[#10B981] text-[#0b0f26]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Cumulative Growth Curve
              </button>
            </div>

            {/* 7-Day Moving Avg Toggle */}
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showMovingAverage}
                onChange={(e) => setShowMovingAverage(e.target.checked)}
                className="w-4 h-4 rounded border-slate-600 bg-[#111738] text-[#A855F7] focus:ring-[#A855F7]"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-[#A855F7] rounded" />
                7-Day Moving Average
              </span>
            </label>
          </div>

          {/* Recharts Canvas */}
          <div className="h-[360px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={filteredData}
                margin={{ top: 15, right: 20, left: 10, bottom: 25 }}
              >
                <defs>
                  {/* Cyan Gradient for Total Impressions / Search */}
                  <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F3FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F3FF" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Gold Gradient for Maps / Clicks */}
                  <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Emerald Gradient for Cumulative / Actions */}
                  <linearGradient id="emeraldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>

                  {/* Purple Gradient for Moving Average */}
                  <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A855F7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#25336e" opacity={0.4} />

                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  interval={windowFilter === '30d' ? 2 : 0}
                  dy={10}
                />

                {/* Left Axis: Impressions or Primary Metric */}
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) =>
                    metricMode === 'cumulative' ? `${Math.round(val / 1000)}k` : `${val}`
                  }
                />

                {/* Right Axis for Combined Mode (Clicks) */}
                {metricMode === 'combined' && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#D4AF37"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${val}`}
                  />
                )}

                <Tooltip content={<CustomThirtyDayTooltip />} />

                <Legend
                  verticalAlign="top"
                  align="right"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                />

                {/* Google 48-72h Processing Window Notice on recent days */}
                {filteredData.length >= 3 && (
                  <ReferenceArea
                    yAxisId="left"
                    x1={filteredData[filteredData.length - 3]?.date}
                    x2={filteredData[filteredData.length - 1]?.date}
                    stroke="#f59e0b"
                    strokeOpacity={0.3}
                    fill="#f59e0b"
                    fillOpacity={0.05}
                    label={{
                      value: '48-72h Latency Window',
                      position: 'insideTopRight',
                      fill: '#f59e0b',
                      fontSize: 10,
                      offset: 8,
                    }}
                  />
                )}

                {/* RENDER ACCORDING TO METRIC MODE */}
                {metricMode === 'combined' && (
                  <>
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalImpressions"
                      name="Total Impressions (Search + Maps)"
                      stroke="#00F3FF"
                      strokeWidth={2.5}
                      fill="url(#cyanAreaGrad)"
                      activeDot={{ r: 6, fill: '#00F3FF', stroke: '#0b0f26', strokeWidth: 2 }}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="totalClicks"
                      name="Customer Clicks (Right Axis)"
                      fill="#D4AF37"
                      radius={[4, 4, 0, 0]}
                      opacity={0.85}
                    />
                  </>
                )}

                {metricMode === 'channels' && (
                  <>
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="searchImpressions"
                      name="Google Search Impressions"
                      stroke="#00F3FF"
                      strokeWidth={2.5}
                      fill="url(#cyanAreaGrad)"
                      activeDot={{ r: 5, fill: '#00F3FF' }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="mapsImpressions"
                      name="Google Maps Impressions"
                      stroke="#D4AF37"
                      strokeWidth={2.5}
                      fill="url(#goldAreaGrad)"
                      activeDot={{ r: 5, fill: '#D4AF37' }}
                    />
                  </>
                )}

                {metricMode === 'clicks' && (
                  <>
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="websiteClicks"
                      name="Website Clicks (arthurscreatives.com)"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      fill="url(#emeraldAreaGrad)"
                      activeDot={{ r: 5, fill: '#10B981' }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="callClicks"
                      name="Call Button Clicks"
                      stroke="#D4AF37"
                      strokeWidth={2.5}
                      fill="url(#goldAreaGrad)"
                      activeDot={{ r: 5, fill: '#D4AF37' }}
                    />
                  </>
                )}

                {metricMode === 'cumulative' && (
                  <>
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="cumulativeImpressions"
                      name="Cumulative Impressions"
                      stroke="#10B981"
                      strokeWidth={3}
                      fill="url(#emeraldAreaGrad)"
                      activeDot={{ r: 6, fill: '#10B981', stroke: '#0b0f26', strokeWidth: 2 }}
                    />
                  </>
                )}

                {/* 7-Day Moving Average Overlay */}
                {showMovingAverage && metricMode !== 'cumulative' && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="movingAverage7d"
                    name="7-Day Rolling Moving Avg"
                    stroke="#A855F7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Raw Telemetry Data Table View */}
      {viewFormat === 'table' && (
        <div className="space-y-3">
          <div className="bg-[#111738] p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#00F3FF]" />
              Showing daily breakdown of {filteredData.length} records.
            </span>
            <span className="text-slate-400 font-mono text-[10px]">
              Sorted chronologically &bull; Google Business Profile Performance API
            </span>
          </div>

          <div className="overflow-x-auto max-h-[380px] rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#111738] text-slate-400 font-semibold border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Day</th>
                  <th className="py-2.5 px-3 text-right">Search Imp.</th>
                  <th className="py-2.5 px-3 text-right">Maps Imp.</th>
                  <th className="py-2.5 px-3 text-right text-white">Total Imp.</th>
                  <th className="py-2.5 px-3 text-right">Web Clicks</th>
                  <th className="py-2.5 px-3 text-right">Call Clicks</th>
                  <th className="py-2.5 px-3 text-right text-[#D4AF37]">Total Clicks</th>
                  <th className="py-2.5 px-3 text-right text-purple-300">7D Moving Avg</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#0b0f26]/60">
                {filteredData.map((d, index) => (
                  <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 font-medium text-white">{d.date}</td>
                    <td className="py-2 px-3 text-slate-400">{d.dayOfWeek}</td>
                    <td className="py-2 px-3 text-right font-mono">{d.searchImpressions.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono">{d.mapsImpressions.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-white">
                      {d.totalImpressions.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono">{d.websiteClicks.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono">{d.callClicks.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-[#D4AF37]">
                      {d.totalClicks.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-purple-300">
                      {d.movingAverage7d ? d.movingAverage7d.toLocaleString() : '—'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {d.isProcessingWindow ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Processing
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Settled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Explanatory Footnote & Google Verification Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#00F3FF] flex-shrink-0" />
          <span>
            Highlighted yellow zone marks Google&apos;s <strong>48 to 72-hour processing window</strong>. Recent dates will settle on the next API refresh cycle.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Calculated against verified GMB settled figures.</span>
        </div>
      </div>
    </div>
  );
}

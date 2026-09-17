'use client';

import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Undo2,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { ActivityLog } from '@/types/business-profile';

interface ActivityTabProps {
  logs: ActivityLog[];
  onClearLogs?: () => void;
}

export function ActivityTab({ logs }: ActivityTabProps) {
  const [filterResult, setFilterResult] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    if (filterResult !== 'all' && log.result !== filterResult) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        (log.notes && log.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Activity Audit Trail
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#00F3FF]/15 text-[#00F3FF] border border-[#00F3FF]/40">
                America/New_York (EDT)
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Immutable chronological record of inspections, proposal generations, authorized repairs, conflict checks, and restoration events.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Total Events:</span>
            <span className="font-bold text-white font-mono bg-[#111738] px-2.5 py-1 rounded-lg border border-slate-700">
              {logs.length}
            </span>
          </div>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search actions, fields, or notes..."
              className="w-full bg-[#111738] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="bg-[#111738] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
            >
              <option value="all">All Results</option>
              <option value="success">Success</option>
              <option value="conflict_detected">Conflict Detected</option>
              <option value="restored">Restored</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Log list */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-[#18204c] border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            No activity records match your search query or filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isConflict = log.result === 'conflict_detected';
            const isRestored = log.result === 'restored';
            const isSuccess = log.result === 'success';

            return (
              <div
                key={log.id}
                className={`bg-[#18204c] border rounded-xl p-4 transition-all ${
                  isConflict
                    ? 'border-rose-500/50 bg-[#221626]'
                    : isRestored
                    ? 'border-blue-500/40'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm tracking-tight">
                      {log.action}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isSuccess
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isConflict
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isRestored
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {log.result.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#00F3FF]" />
                    <span>{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed mb-2">
                  {log.details}
                </p>

                {/* Diff snapshots if available */}
                {(log.beforeValue || log.afterValue) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#111738] p-2.5 rounded-lg border border-slate-700/60 text-xs font-mono mb-2">
                    {log.beforeValue && (
                      <div>
                        <span className="text-rose-400 font-sans font-bold text-[10px] block">
                          Value Prior:
                        </span>
                        <p className="text-slate-300 truncate">{log.beforeValue}</p>
                      </div>
                    )}
                    {log.afterValue && (
                      <div>
                        <span className="text-emerald-400 font-sans font-bold text-[10px] block">
                          Value Written:
                        </span>
                        <p className="text-emerald-300 truncate">{log.afterValue}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>
                      Authorization: <strong className="text-slate-200">{log.authorization.replace(/_/g, ' ')}</strong>
                    </span>
                  </div>
                  {log.notes && (
                    <span className="italic text-slate-300">
                      {log.notes}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

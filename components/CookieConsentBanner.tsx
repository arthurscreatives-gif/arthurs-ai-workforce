'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Cookie, Check, X, Sliders, ExternalLink, Info } from 'lucide-react';

export interface CookiePreferences {
  essential: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  timestamp: string;
}

interface CookieConsentBannerProps {
  onOpenPolicy?: (tab: 'cookies') => void;
}

export function CookieConsentBanner({ onOpenPolicy }: CookieConsentBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('arthur_cookie_consent');
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Fallback to defaults
      }
    }
    return {
      essential: true,
      functional: true,
      analytics: false,
      timestamp: new Date().toISOString(),
    };
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('arthur_cookie_consent');
      if (!stored) {
        // Show banner after brief delay
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
    }

    // Listen for custom event to open cookie settings from footer
    const handleOpenSettings = () => {
      setIsModalOpen(true);
    };

    window.addEventListener('open_arthur_cookie_settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open_arthur_cookie_settings', handleOpenSettings);
    };
  }, []);

  const handleAcceptAll = () => {
    const nextPrefs: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem('arthur_cookie_consent', JSON.stringify(nextPrefs));
    } catch {}
    setPreferences(nextPrefs);
    setIsVisible(false);
    setIsModalOpen(false);
  };

  const handleAcceptEssential = () => {
    const nextPrefs: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem('arthur_cookie_consent', JSON.stringify(nextPrefs));
    } catch {}
    setPreferences(nextPrefs);
    setIsVisible(false);
    setIsModalOpen(false);
  };

  const handleSaveCustom = () => {
    const nextPrefs: CookiePreferences = {
      ...preferences,
      essential: true,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem('arthur_cookie_consent', JSON.stringify(nextPrefs));
    } catch {}
    setPreferences(nextPrefs);
    setIsVisible(false);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Banner */}
      {isVisible && !isModalOpen && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-[#0b0f26]/95 backdrop-blur-lg border-t border-slate-700/80 shadow-2xl animate-in slide-in-from-bottom duration-300"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="p-2.5 rounded-xl bg-[#00F3FF]/10 text-[#00F3FF] border border-[#00F3FF]/30 flex-shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Privacy & Cookie Preferences</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    No Ad Tracking
                  </span>
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Arthur’s AI Workforce uses essential session tokens to securely authenticate your workspace. We do not use advertising pixels, cross-site trackers, or sell customer listing data.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#111738] hover:bg-[#18204c] border border-slate-700 rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
              >
                Cookie Settings
              </button>
              <button
                type="button"
                onClick={handleAcceptEssential}
                className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-[#18204c] hover:bg-[#202b66] border border-slate-600 rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-5 py-2 text-xs font-bold text-[#0b0f26] bg-gradient-to-r from-[#00F3FF] to-cyan-400 hover:opacity-90 rounded-xl shadow-lg shadow-[#00F3FF]/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
              >
                Accept All
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Settings Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f26]/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-xl bg-[#18204c] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#00F3FF]/10 text-[#00F3FF] border border-[#00F3FF]/30">
                  <Sliders className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 id="cookie-modal-title" className="text-base font-bold text-white">
                    Cookie & Storage Settings
                  </h3>
                  <p className="text-xs text-slate-400">
                    Arthur’s AI Workforce • Transparent Storage Inventory
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close cookie settings dialog"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#111738] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Category 1: Strictly Necessary */}
              <div className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">Strictly Necessary Storage</span>
                    <span className="text-[10px] ml-2 text-[#00F3FF] font-mono bg-[#00F3FF]/10 px-2 py-0.5 rounded">
                      Always Required
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    aria-label="Strictly necessary cookies cannot be disabled"
                    className="cursor-not-allowed opacity-75 accent-[#00F3FF]"
                  />
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Required for user authentication, security verification, and workspace isolation. Without these, the application cannot operate.
                </p>
                <div className="pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1">
                  <div>• <code className="text-slate-200">arthur_auth_session</code>: Encrypted session token for API verification</div>
                  <div>• <code className="text-slate-200">arthur_cookie_consent</code>: Stores your cookie preferences</div>
                </div>
              </div>

              {/* Category 2: Functional */}
              <div className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">Functional Preferences</span>
                    <span className="text-[10px] ml-2 text-slate-400 font-mono">Recommended</span>
                  </div>
                  <input
                    type="checkbox"
                    id="pref-functional"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="w-4 h-4 accent-[#00F3FF] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
                  />
                </div>
                <label htmlFor="pref-functional" className="text-slate-300 leading-relaxed block cursor-pointer">
                  Remembers your active workspace selection, last viewed inspection tabs, and UI display settings across page reloads.
                </label>
                <div className="pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                  • <code className="text-slate-200">arthur_active_workspace</code>: Current workspace identifier
                </div>
              </div>

              {/* Category 3: Analytics */}
              <div className="p-4 bg-[#111738] rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm">Product Performance Diagnostics</span>
                    <span className="text-[10px] ml-2 text-slate-400 font-mono">Optional</span>
                  </div>
                  <input
                    type="checkbox"
                    id="pref-analytics"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-4 h-4 accent-[#00F3FF] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF]"
                  />
                </div>
                <label htmlFor="pref-analytics" className="text-slate-300 leading-relaxed block cursor-pointer">
                  Helps us detect API latency and errors to improve profile sync stability. No personal data is shared with third parties.
                </label>
              </div>

              {/* Category 4: Third-Party Marketing (Banned) */}
              <div className="p-4 bg-[#0b0f26] rounded-2xl border border-slate-800/80 space-y-1.5 opacity-80">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">Third-Party Advertising & Pixels</span>
                  <span className="text-[10px] text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded">
                    Disabled / Not Used
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Arthur’s AI Workforce does not deploy advertising trackers, retargeting pixels, or data brokers.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleAcceptEssential}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#111738] border border-slate-700 rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
              >
                Reject Non-Essential
              </button>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#18204c] border border-slate-600 rounded-xl transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
                >
                  Accept All
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold text-[#0b0f26] bg-gradient-to-r from-[#00F3FF] to-cyan-400 rounded-xl shadow-lg shadow-[#00F3FF]/20 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus:outline-none"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

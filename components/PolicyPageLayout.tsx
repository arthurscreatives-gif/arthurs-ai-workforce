import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  CreditCard,
  Eye,
  Cookie,
  LifeBuoy,
  ArrowLeft,
  ExternalLink,
  Building2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { POLICY_METADATA } from '@/lib/legal-policies';

interface PolicyPageLayoutProps {
  title: string;
  activeSlug: 'terms' | 'privacy' | 'billing' | 'accessibility' | 'cookies' | 'support';
  flagForArthur?: string;
  children: React.ReactNode;
}

export function PolicyPageLayout({
  title,
  activeSlug,
  flagForArthur,
  children,
}: PolicyPageLayoutProps) {
  const navItems = [
    { slug: 'terms', label: 'Terms of Service', href: '/terms', icon: FileText },
    { slug: 'privacy', label: 'Privacy Policy', href: '/privacy', icon: ShieldCheck },
    { slug: 'billing', label: 'Billing & Refunds', href: '/billing-policy', icon: CreditCard },
    { slug: 'accessibility', label: 'Accessibility', href: '/accessibility', icon: Eye },
    { slug: 'cookies', label: 'Cookie Policy', href: '/cookies', icon: Cookie },
    { slug: 'support', label: 'Support & Identity', href: '/support', icon: LifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f26] text-slate-100 flex flex-col selection:bg-[#00F3FF] selection:text-[#0b0f26]">
      {/* Skip to Main Content Accessible Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#00F3FF] focus:text-[#0b0f26] focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#111738]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none rounded-xl p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-[#00F3FF]/10 border border-[#00F3FF]/30 flex items-center justify-center text-[#00F3FF] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-wide block">
                Arthur’s AI Workforce
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                Google Business Profile Manager
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#18204c] hover:bg-[#202b66] border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to App</span>
            </Link>
          </div>
        </div>

        {/* Subnav for policies */}
        <div className="border-t border-slate-800/60 bg-[#0e1430]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.slug === activeSlug;
              return (
                <Link
                  key={item.slug}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#00F3FF] focus:outline-none ${
                    isActive
                      ? 'bg-[#18204c] text-white border border-slate-700 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00F3FF]' : ''}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Title Header */}
        <div className="space-y-2 pb-6 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
            <span>Official Policy Document • Version {POLICY_METADATA.version} (Active & Approved)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{title}</h1>
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Operated by: <strong className="text-white">{POLICY_METADATA.legalEntity}</strong> (Arthur’s Creatives)</span>
            <span>Effective: <strong className="text-slate-300">{POLICY_METADATA.effectiveDate}</strong></span>
            <span>Contact: <a href={`mailto:${POLICY_METADATA.supportEmail}`} className="text-[#00F3FF] hover:underline focus-visible:ring-1 focus-visible:ring-[#00F3FF]">{POLICY_METADATA.supportEmail}</a></span>
          </div>
        </div>

        {/* Flag for Arthur notice if present */}
        {flagForArthur && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <strong className="block text-amber-300 font-bold mb-0.5">Review Flag for Business Owner:</strong>
              <p className="leading-relaxed">{flagForArthur}</p>
            </div>
          </div>
        )}

        {/* Policy Body */}
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">{children}</div>
      </main>

      {/* Global Policy Footer */}
      <footer className="border-t border-slate-800/80 bg-[#111738] mt-16 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-bold text-white block">Arthur’s AI Workforce</span>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Build, Train, and Deploy Your Digital Workforce. An all-in-one business automation platform by Velo Website Development LLC, operating as Arthur’s Creatives.
              </p>
            </div>
            <div className="text-xs text-slate-400">
              Support: <a href="mailto:arthurscreatives@gmail.com" className="text-[#00F3FF] font-mono hover:underline focus-visible:ring-1 focus-visible:ring-[#00F3FF]">arthurscreatives@gmail.com</a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/terms" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#00F3FF]">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#00F3FF]">Privacy Policy</Link>
              <Link href="/billing-policy" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#00F3FF]">Billing & Refunds</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#00F3FF]">Accessibility Statement</Link>
              <Link href="/cookies" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#00F3FF]">Cookie Policy</Link>
              <Link href="/support" className="hover:text-white transition-colors focus-visible:ring-1 focus-visible:ring-[#00F3FF]">Support & Identity</Link>
            </div>
            <span>© 2026 {POLICY_METADATA.legalEntity}. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

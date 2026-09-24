import React from 'react';
import { PolicyPageLayout } from '@/components/PolicyPageLayout';
import { BUSINESS_SUPPORT_INFO } from '@/lib/legal-policies';
import { Building2, Mail, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Customer Support & Business Identity — Arthur’s AI Workforce',
  description: 'Verified company operator details, customer support hours, and contact channels for Arthur’s AI Workforce.',
};

export default function SupportPage() {
  return (
    <PolicyPageLayout
      title="Business Identity & Customer Support"
      activeSlug="support"
    >
      <div className="space-y-6">
        {/* Identity Overview */}
        <section className="bg-[#111738] p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-base">
            <Building2 className="w-5 h-5" aria-hidden="true" />
            <h2>Confirmed Business Entity Information</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Arthur’s AI Workforce is owned and operated by Velo Website Development LLC, operating under the trade name Arthur’s Creatives.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 bg-[#18204c] rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-slate-400 block text-[11px]">Legal Entity Name</span>
              <strong className="text-white text-sm block">{BUSINESS_SUPPORT_INFO.legalEntity}</strong>
              <span className="text-slate-400 text-[10px]">Registered Limited Liability Company</span>
            </div>

            <div className="p-4 bg-[#18204c] rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-slate-400 block text-[11px]">Trade Brand / Operating Name</span>
              <strong className="text-[#00F3FF] text-sm block">{BUSINESS_SUPPORT_INFO.tradeName}</strong>
              <span className="text-slate-400 text-[10px]">Commercial software publishing brand</span>
            </div>

            <div className="p-4 bg-[#18204c] rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-slate-400 block text-[11px]">Product Title</span>
              <strong className="text-white text-sm block">{BUSINESS_SUPPORT_INFO.productName}</strong>
              <span className="text-slate-400 text-[10px]">Google Business Profile Manager edition</span>
            </div>

            <div className="p-4 bg-[#18204c] rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-slate-400 block text-[11px]">Customer Support Email</span>
              <a
                href={`mailto:${BUSINESS_SUPPORT_INFO.primaryEmail}`}
                className="text-[#00F3FF] font-mono text-sm block hover:underline"
              >
                {BUSINESS_SUPPORT_INFO.primaryEmail}
              </a>
              <span className="text-slate-400 text-[10px]">Monitored daily for listing sync requests</span>
            </div>
          </div>
        </section>

        {/* Operating Hours and Inquiries */}
        <section className="bg-[#111738] p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Clock className="w-5 h-5 text-[#00F3FF]" aria-hidden="true" />
            <h2>Operating Hours & Response Standards</h2>
          </div>
          <div className="space-y-2 text-sm text-slate-300 leading-relaxed">
            <p>
              <strong>Hours of Operation:</strong> {BUSINESS_SUPPORT_INFO.hoursOfOperation}
            </p>
            <p>
              <strong>Response Time:</strong> {BUSINESS_SUPPORT_INFO.responseTime}
            </p>
            <p>
              <strong>Critical Listing Emergencies:</strong> If your Google listing experiences an unexpected suspension, contact us immediately with the subject line <em>&ldquo;CRITICAL LISTING ISSUE&rdquo;</em> for expedited triage.
            </p>
          </div>
        </section>

        {/* Physical Address Notice */}
        <section className="bg-[#111738] p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
            <MapPin className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <h3>Business Address Disclosures</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {BUSINESS_SUPPORT_INFO.mailingAddressNotice}
          </p>
        </section>
      </div>
    </PolicyPageLayout>
  );
}

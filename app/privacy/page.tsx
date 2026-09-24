import React from 'react';
import { PolicyPageLayout } from '@/components/PolicyPageLayout';
import { PRIVACY_POLICY } from '@/lib/legal-policies';

export const metadata = {
  title: 'Privacy Policy & Google Limited Use — Arthur’s AI Workforce',
  description: 'Privacy Policy, Google API Services User Data Policy adherence, and data handling practices for Arthur’s AI Workforce.',
};

export default function PrivacyPage() {
  return (
    <PolicyPageLayout
      title={PRIVACY_POLICY.title}
      activeSlug="privacy"
      flagForArthur={PRIVACY_POLICY.flagForArthur}
    >
      <div className="space-y-6">
        {PRIVACY_POLICY.sections.map((sec, idx) => (
          <section key={idx} className="bg-[#111738] p-6 rounded-2xl border border-slate-800 space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{sec.heading}</h2>
            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-slate-300 text-sm leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </PolicyPageLayout>
  );
}

import React from 'react';
import { PolicyPageLayout } from '@/components/PolicyPageLayout';
import { TERMS_OF_SERVICE } from '@/lib/legal-policies';

export const metadata = {
  title: 'Terms of Service — Arthur’s AI Workforce',
  description: 'Terms of Service, acceptable use policies, and customer responsibilities for Arthur’s AI Workforce.',
};

export default function TermsPage() {
  return (
    <PolicyPageLayout
      title={TERMS_OF_SERVICE.title}
      activeSlug="terms"
      flagForArthur={TERMS_OF_SERVICE.flagForArthur}
    >
      <div className="space-y-6">
        {TERMS_OF_SERVICE.sections.map((sec, idx) => (
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

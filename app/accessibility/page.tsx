import React from 'react';
import { PolicyPageLayout } from '@/components/PolicyPageLayout';
import { ACCESSIBILITY_STATEMENT } from '@/lib/legal-policies';

export const metadata = {
  title: 'Accessibility Statement — Arthur’s AI Workforce',
  description: 'Our commitment to digital accessibility, implemented WCAG 2.1 AA measures, known limitations, and contact information.',
};

export default function AccessibilityPage() {
  return (
    <PolicyPageLayout
      title={ACCESSIBILITY_STATEMENT.title}
      activeSlug="accessibility"
      flagForArthur={ACCESSIBILITY_STATEMENT.flagForArthur}
    >
      <div className="space-y-6">
        {ACCESSIBILITY_STATEMENT.sections.map((sec, idx) => (
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

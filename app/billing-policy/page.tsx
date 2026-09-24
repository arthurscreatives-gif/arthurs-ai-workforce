import React from 'react';
import { PolicyPageLayout } from '@/components/PolicyPageLayout';
import { BILLING_POLICY } from '@/lib/legal-policies';

export const metadata = {
  title: 'Billing, Cancellation & Refund Policy — Arthur’s AI Workforce',
  description: 'Subscription terms, recurring charges, cancellation procedures, and refund guidelines for Arthur’s AI Workforce.',
};

export default function BillingPolicyPage() {
  return (
    <PolicyPageLayout
      title={BILLING_POLICY.title}
      activeSlug="billing"
      flagForArthur={BILLING_POLICY.flagForArthur}
    >
      <div className="space-y-6">
        {BILLING_POLICY.sections.map((sec, idx) => (
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

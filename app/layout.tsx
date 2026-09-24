import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { CookieConsentBanner } from '@/components/CookieConsentBanner';

export const metadata: Metadata = {
  title: 'Arthur’s AI Workforce - Google Business Profile Manager',
  description: 'Multi-tenant Google Business Profile management platform for businesses to inspect profiles, analyze search performance, propose improvements, automate daily operations, and manage subscriptions with isolated customer workspaces.',
  openGraph: {
    title: 'Arthur’s AI Workforce - Google Business Profile Manager',
    description: 'Multi-tenant Google Business Profile management platform for businesses to inspect profiles, analyze search performance, propose improvements, automate daily operations, and manage subscriptions with isolated customer workspaces.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arthur’s AI Workforce - Google Business Profile Manager',
    description: 'Multi-tenant Google Business Profile management platform for businesses to inspect profiles, analyze search performance, propose improvements, automate daily operations, and manage subscriptions with isolated customer workspaces.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-[#111738] text-slate-100 min-h-screen antialiased selection:bg-[#D4AF37]/30 selection:text-white">
        {children}
        <CookieConsentBanner />
      </body>
    </html>
  );
}

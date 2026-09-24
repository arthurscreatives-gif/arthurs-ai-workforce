'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';

function CallbackContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const hasParams = searchParams.toString().length > 0;

  const status: 'processing' | 'success' | 'error' = !hasParams
    ? 'processing'
    : error
    ? 'error'
    : code
    ? 'success'
    : 'error';

  const message = !hasParams
    ? 'Connecting Google Business Profile...'
    : error
    ? `Authorization was denied or encountered an error: ${error}`
    : code
    ? 'Google account authorized successfully. Returning to dashboard...'
    : 'No authorization code was found in the callback request.';

  useEffect(() => {
    if (error) {
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error }, '*');
      }
    } else if (code) {
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', code }, '*');
        const timer = setTimeout(() => {
          window.close();
        }, 1200);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          window.location.href = '/';
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [code, error]);

  return (
    <div className="max-w-md w-full bg-[#18204c] border border-[#D4AF37]/40 rounded-xl p-6 text-center shadow-2xl">
      {status === 'processing' && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#00F3FF] border-t-transparent rounded-full animate-spin" />
          <h2 className="text-lg font-semibold text-white">Connecting Google Business Profile</h2>
          <p className="text-sm text-slate-300">{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle2 className="w-12 h-12 text-[#00F3FF]" />
          <h2 className="text-lg font-semibold text-white">Authorization Successful</h2>
          <p className="text-sm text-slate-300">{message}</p>
          <p className="text-xs text-slate-400">This window will close automatically.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="w-12 h-12 text-rose-400" />
          <h2 className="text-lg font-semibold text-rose-300">Connection Failed</h2>
          <p className="text-sm text-slate-300">{message}</p>

          {error === 'access_denied' && (
            <div className="mt-2 text-left bg-[#0b0f26] p-3 rounded-lg border border-amber-500/40 text-xs text-slate-300 space-y-2">
              <strong className="text-amber-300 block">Why did this happen? (Error 403: access_denied)</strong>
              <p className="text-[11px] text-slate-400">
                Google Cloud OAuth Consent Screen is in <strong>Testing</strong> status. Google strictly blocks any account not added to the <strong>Test users</strong> list.
              </p>
              <div className="text-[11px] space-y-1">
                <p className="font-semibold text-[#00F3FF]">Immediate Fix:</p>
                <ol className="list-decimal pl-4 space-y-0.5 text-slate-300">
                  <li>Open <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noopener noreferrer" className="text-[#00F3FF] underline">Google Cloud Console → OAuth consent screen</a>.</li>
                  <li>Scroll to <strong>Test users</strong>, click <strong>+ ADD USERS</strong>.</li>
                  <li>Add <code className="text-amber-300">arthurscreatives@gmail.com</code> and save.</li>
                  <li>Try signing in again.</li>
                </ol>
              </div>
            </div>
          )}

          <button
            onClick={() => window.close()}
            className="mt-4 px-4 py-2 bg-[#25336e] hover:bg-[#2e3e85] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close Window
          </button>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-[#111738] text-white flex items-center justify-center p-6">
      <Suspense
        fallback={
          <div className="max-w-md w-full bg-[#18204c] border border-slate-700 rounded-xl p-6 text-center shadow-2xl">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[#00F3FF] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-300">Loading authentication state...</p>
            </div>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}


'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Lock,
  Building,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  KeyRound,
  Save,
} from 'lucide-react';
import { ConnectionStatus, GoogleBusinessProfile } from '@/types/business-profile';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionStatus: ConnectionStatus;
  setConnectionStatus: (status: ConnectionStatus) => void;
  currentProfile: GoogleBusinessProfile;
  onSelectAndConfirmProfile: (profile: GoogleBusinessProfile) => void;
}

export function ConnectModal({
  isOpen,
  onClose,
  connectionStatus,
  setConnectionStatus,
  currentProfile,
  onSelectAndConfirmProfile,
}: ConnectModalProps) {
  const [step, setStep] = useState<number>(1);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [copiedUri, setCopiedUri] = useState(false);
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [saveCredsSuccess, setSaveCredsSuccess] = useState(false);

  const clientOrigin = useSyncExternalStore(
    () => () => {},
    () => (typeof window !== 'undefined' ? window.location.origin : ''),
    () => ''
  );

  const savedClientId = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return typeof window !== 'undefined' ? localStorage.getItem('arthurs_gbp_client_id') || '' : '';
      } catch {
        return '';
      }
    },
    () => ''
  );

  const [customClientId, setCustomClientId] = useState<string | null>(null);
  const clientIdInput = customClientId !== null ? customClientId : savedClientId;
  const setClientIdInput = (val: string) => setCustomClientId(val);

  const [clientSecretInput, setClientSecretInput] = useState('');
  const [customProjectId, setCustomProjectId] = useState<string>('');

  const [apiConfig, setApiConfig] = useState<{
    configured: boolean;
    clientId?: string;
    url: string;
    redirectUri: string;
    scopes: string[];
    requiredApis: string[];
    note: string;
  } | null>(null);

  // Dynamic business name from profile or fallback
  const businessDisplayName = currentProfile?.title || 'Your Business Location';
  const initialAddressStr = currentProfile?.address?.addressLines?.join(', ') || '';

  const [sandboxLocationTitle, setSandboxLocationTitle] = useState(businessDisplayName);
  const [sandboxAddress, setSandboxAddress] = useState(initialAddressStr);
  const [isConfirmedByOwner, setIsConfirmedByOwner] = useState<boolean>(true);

  // Fetch OAuth URL and configuration from backend
  useEffect(() => {
    if (isOpen) {
      const urlToFetch = clientIdInput
        ? `/api/auth/google/url?client_id=${encodeURIComponent(clientIdInput)}`
        : '/api/auth/google/url';

      fetch(urlToFetch)
        .then((res) => res.json())
        .then((data) => {
          setApiConfig(data);
          if (data.clientId && !clientIdInput) {
            setClientIdInput(data.clientId);
          }
        })
        .catch((err) => console.error('Error fetching OAuth config:', err));
    }
  }, [isOpen, clientIdInput]);

  if (!isOpen) return null;

  const redirectUriToDisplay =
    apiConfig?.redirectUri ||
    (clientOrigin ? `${clientOrigin}/auth/callback` : 'https://your-domain.run.app/auth/callback');

  const handleCopyUri = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(redirectUriToDisplay);
      setCopiedUri(true);
      setTimeout(() => setCopiedUri(false), 2500);
    }
  };

  const handleSaveCredentials = async () => {
    setIsSavingCreds(true);
    setAuthError(null);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('arthurs_gbp_client_id', clientIdInput.trim());
      }

      await fetch('/api/auth/google/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: clientIdInput.trim() }),
      });

      setSaveCredsSuccess(true);
      setTimeout(() => setSaveCredsSuccess(false), 3000);
    } catch {
      setAuthError('Could not persist credentials to server.');
    } finally {
      setIsSavingCreds(false);
    }
  };

  const handleStartOAuthPopup = () => {
    if (!apiConfig) return;
    setIsLoadingAuth(true);
    setAuthError(null);

    const effectiveClientId = clientIdInput.trim() || apiConfig.clientId;
    if (!effectiveClientId) {
      setIsLoadingAuth(false);
      setAuthError(
        'Please enter your Google OAuth Client ID into the form above, or click "Connect Sandbox Mode" to test all workforce tools immediately.'
      );
      return;
    }

    const effectiveRedirectUri =
      apiConfig?.redirectUri ||
      (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : redirectUriToDisplay);

    const currentUrl = apiConfig.configured
      ? apiConfig.url
      : `${apiConfig.url.split('?')[0]}?${new URLSearchParams({
          client_id: effectiveClientId,
          redirect_uri: effectiveRedirectUri,
          response_type: 'code',
          scope: apiConfig.scopes.join(' '),
          access_type: 'offline',
          prompt: 'consent',
          include_granted_scopes: 'true',
          state: 'gbp_auth_' + Date.now(),
        }).toString()}`;

    const authWindow = window.open(
      currentUrl,
      'google_gbp_oauth',
      'width=600,height=750,top=100,left=100'
    );

    if (!authWindow) {
      setIsLoadingAuth(false);
      setAuthError('Popup was blocked by your browser. Please allow popups for this site.');
    }
  };

  const handleConnectSandboxDirect = () => {
    setConnectionStatus('connected');
    const updated: GoogleBusinessProfile = {
      ...currentProfile,
      name: `locations/${Date.now()}`,
      title: sandboxLocationTitle || 'Primary Business Location',
      address: {
        ...(currentProfile?.address || {
          locality: '',
          administrativeArea: '',
          postalCode: '',
          regionCode: 'US',
        }),
        addressLines: sandboxAddress ? [sandboxAddress] : [],
      },
      verificationStatus: 'VERIFIED',
      lastGoogleSyncAt: new Date().toISOString(),
    };
    onSelectAndConfirmProfile(updated);
    setStep(5);
    setAuthError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#18204c] border border-[#00F3FF]/40 rounded-2xl shadow-2xl p-6 md:p-8 text-white max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#25336e] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#00F3FF]/20 border border-[#00F3FF] flex items-center justify-center text-[#00F3FF]">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Google Business Profile Connection
            </h2>
            <p className="text-xs text-slate-300">
              Connect your live Google account or launch safe Sandbox mode with zero friction.
            </p>
          </div>
        </div>

        {/* Connection Mode Fast Switch Banner */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#00F3FF]/15 to-[#D4AF37]/15 border border-[#00F3FF]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00F3FF]" />
              Need Instant Testing Without Google Cloud OAuth?
            </span>
            <p className="text-[11px] text-slate-300">
              Sandbox mode gives you full access to audits, repairs, drafts, and queue with zero wait.
            </p>
          </div>
          <button
            type="button"
            onClick={handleConnectSandboxDirect}
            className="px-4 py-2 bg-[#00F3FF] hover:bg-[#00d8e4] text-[#0b0f26] font-bold text-xs rounded-xl shadow-lg shadow-[#00F3FF]/20 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap flex-shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Connect Sandbox Now</span>
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[
            { num: 1, label: 'Credentials & URI' },
            { num: 2, label: 'Authorize' },
            { num: 3, label: 'Select Profile' },
            { num: 4, label: 'Confirm & Lock' },
            { num: 5, label: 'Ready' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#00F3FF] text-[#0b0f26] ring-4 ring-[#00F3FF]/20 shadow-md shadow-[#00F3FF]/30'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#0b0f26] text-slate-400 border border-slate-700 group-hover:border-slate-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="text-[10px] text-slate-300 font-medium mt-1 group-hover:text-white">
                {s.label}
              </span>
            </button>
          ))}
        </div>

        {/* Step 1: OAuth Setup, Credentials Form, and Redirect URI */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Redirect URI Box with 1-Click Copy */}
            <div className="bg-[#111738] p-4 rounded-xl border border-[#00F3FF]/40 shadow-inner space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#00F3FF] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#00F3FF]" />
                  Authorized Redirect URI for Google Cloud
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Web Application OAuth 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Paste this exact URI into Google Cloud Console under <strong>OAuth 2.0 Client ID &gt; Authorized redirect URIs</strong>:
              </p>

              <div className="flex items-center gap-2 bg-[#0b0f26] p-2.5 rounded-lg border border-slate-700">
                <code className="text-xs font-mono text-emerald-400 select-all break-all flex-1">
                  {redirectUriToDisplay}
                </code>
                <button
                  onClick={handleCopyUri}
                  className="px-3 py-1.5 bg-[#25336e] hover:bg-[#324594] text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  {copiedUri ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Custom Credentials Form */}
            <div className="bg-[#111738] p-4 rounded-xl border border-slate-700 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <span>Google Cloud Credentials</span>
              </h3>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  OAuth Client ID:
                </label>
                <input
                  type="text"
                  value={clientIdInput}
                  onChange={(e) => setClientIdInput(e.target.value)}
                  placeholder="e.g. 123456789-abcdef.apps.googleusercontent.com"
                  className="w-full bg-[#0b0f26] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-[#00F3FF]"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveCredentials}
                  disabled={isSavingCreds}
                  className="px-3.5 py-1.5 bg-[#25336e] hover:bg-[#324594] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveCredsSuccess ? 'Saved!' : 'Save Credentials'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={handleConnectSandboxDirect}
                className="text-xs text-[#00F3FF] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Skip directly with Sandbox Mode
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-[#00F3FF] text-[#0b0f26] font-bold text-xs rounded-xl shadow-lg shadow-[#00F3FF]/20 cursor-pointer"
              >
                Proceed to Authorization →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Authorize Google Account */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-[#111738] p-5 rounded-xl border border-slate-700/70 text-center">
              <Lock className="w-10 h-10 text-[#00F3FF] mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                Authorize Google Business Profile Access
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
                Connect using your Google account to grant read/write access for your business listing.
              </p>

              {authError && (
                <div className="bg-rose-500/10 border border-rose-500/40 p-3 rounded-lg text-xs text-rose-300 mb-4 text-left">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold">Setup Notice</p>
                      <p>{authError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleStartOAuthPopup}
                  disabled={isLoadingAuth}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#00F3FF] hover:bg-[#00d8e4] text-[#0b0f26] font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-[#00F3FF]/20 cursor-pointer"
                >
                  {isLoadingAuth ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Opening Google Sign-in...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      Connect Live Google Account
                    </>
                  )}
                </button>

                <button
                  onClick={handleConnectSandboxDirect}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#25336e] hover:bg-[#2e3e85] text-white font-medium text-xs rounded-lg transition-all border border-slate-600 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  Use Sandbox / Verification Mode
                </button>
              </div>
            </div>

            {/* Google Verification / Testing Guidance */}
            <div className="p-3.5 bg-[#111738] rounded-xl border border-amber-500/30 text-xs space-y-2 text-slate-300">
              <span className="font-semibold text-amber-300 flex items-center gap-1.5 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Google Verification Notice:
              </span>
              <p className="text-[11px] leading-relaxed text-slate-400">
                If your Google Cloud project is in <strong>Testing</strong> mode, Google only permits logins from emails listed in <strong>Test Users</strong> in Google Cloud Console. To test without restrictions, click <strong>Use Sandbox / Verification Mode</strong> above!
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ← Back to Credentials Form
              </button>
              <button
                onClick={() => setStep(3)}
                className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
              >
                Proceed to Location Selection →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Location Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-1">
              Confirm Your Business Profile Details
            </h3>
            <p className="text-xs text-slate-300 mb-3">
              Enter or confirm the business name and address you want to inspect and manage:
            </p>

            <div className="space-y-3 bg-[#111738] p-4 rounded-xl border border-slate-700">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Business Location Name</label>
                <input
                  type="text"
                  value={sandboxLocationTitle}
                  onChange={(e) => setSandboxLocationTitle(e.target.value)}
                  placeholder="e.g. Metro Dental Care"
                  className="w-full bg-[#0b0f26] border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#00F3FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Physical Address or Service Area</label>
                <input
                  type="text"
                  value={sandboxAddress}
                  onChange={(e) => setSandboxAddress(e.target.value)}
                  placeholder="e.g. 100 Main St, Suite 200, City, State ZIP"
                  className="w-full bg-[#0b0f26] border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#00F3FF]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-5 py-2.5 bg-[#00F3FF] text-[#0b0f26] font-bold text-xs rounded-xl cursor-pointer"
              >
                Confirm Profile Selection →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm & Lock */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-[#111738] p-5 rounded-xl border border-[#00F3FF]/40">
              <h3 className="text-sm font-bold text-[#00F3FF] mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#00F3FF]" />
                Confirm Profile Pairing Before Permitting Changes
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Confirm that this application is authorized to inspect and prepare updates for your business location:
              </p>

              <div className="bg-[#0b0f26] p-3 rounded-lg border border-slate-800 text-xs mb-4 space-y-1">
                <p className="text-white font-bold text-sm">{sandboxLocationTitle || 'Primary Location'}</p>
                <p className="text-slate-300 text-xs">{sandboxAddress || 'Address on file'}</p>
                <p className="text-emerald-400 text-xs font-semibold pt-1">Status: Ready for Inspection</p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isConfirmedByOwner}
                  onChange={(e) => setIsConfirmedByOwner(e.target.checked)}
                  className="mt-0.5 accent-[#00F3FF]"
                />
                <span className="text-xs text-slate-200">
                  I confirm that I am authorized to manage this profile and authorize Arthur’s AI Workforce to run inspections and prepare drafts in Review First mode.
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={handleConnectSandboxDirect}
                disabled={!isConfirmedByOwner}
                className="px-5 py-2.5 bg-[#00F3FF] hover:bg-[#00d8e4] disabled:opacity-50 text-[#0b0f26] font-bold text-xs rounded-xl transition-all shadow-md shadow-[#00F3FF]/20 cursor-pointer"
              >
                Lock Selection & Activate Connection
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Ready & Connected */}
        {step === 5 && (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="w-14 h-14 text-[#00F3FF] mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">
              Google Business Profile Connected Successfully
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Profile information for <strong>{sandboxLocationTitle || 'Your Business Location'}</strong> has been imported and linked to your approved business facts. You can now run the Profile Inspector, review proposed changes, and explore search insights.
            </p>

            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#00F3FF] hover:bg-[#00d8e4] text-[#0b0f26] font-bold text-xs rounded-xl transition-all shadow-md shadow-[#00F3FF]/30 cursor-pointer"
              >
                Enter Control Center
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

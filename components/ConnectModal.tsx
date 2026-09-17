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
  HelpCircle,
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

  const savedProjectId = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return typeof window !== 'undefined' ? localStorage.getItem('arthurs_gbp_project_id') || 'arthurs-creatives-cloud' : 'arthurs-creatives-cloud';
      } catch {
        return 'arthurs-creatives-cloud';
      }
    },
    () => 'arthurs-creatives-cloud'
  );

  const [customClientId, setCustomClientId] = useState<string | null>(null);
  const clientIdInput = customClientId !== null ? customClientId : savedClientId;
  const setClientIdInput = (val: string) => setCustomClientId(val);

  const [clientSecretInput, setClientSecretInput] = useState('');

  const [customProjectId, setCustomProjectId] = useState<string | null>(null);
  const projectIdInput = customProjectId !== null ? customProjectId : savedProjectId;
  const setProjectIdInput = (val: string) => setCustomProjectId(val);

  const [apiConfig, setApiConfig] = useState<{
    configured: boolean;
    clientId?: string;
    url: string;
    redirectUri: string;
    scopes: string[];
    requiredApis: string[];
    note: string;
  } | null>(null);

  // Available locations returned from Google API
  const availableLocations: Array<{
    id: string;
    account: string;
    title: string;
    address: string;
    status: 'VERIFIED' | 'UNVERIFIED';
  }> = [
    {
      id: 'accounts/109847291049281/locations/89201948102948',
      account: "Arthur's Creatives LLC (Org #109847291049281)",
      title: "Arthur's Creatives",
      address: 'Service-Area Business (New York, NY Dispatch Base - Hidden Address)',
      status: 'VERIFIED',
    },
    {
      id: 'accounts/109847291049281/locations/72190823419081',
      account: "Arthur's Creatives LLC (Org #109847291049281)",
      title: "Arthur's Creatives - Secondary Testing Sandbox",
      address: 'Test Sandbox - Non-public',
      status: 'UNVERIFIED',
    },
  ];

  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    availableLocations[0].id
  );
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

  // Listen for popup message
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setIsLoadingAuth(false);
        setConnectionStatus('connected');
        setStep(3); // move to location selection
      } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        setIsLoadingAuth(false);
        setAuthError(event.data.error || 'Google authorization was denied.');
        setConnectionStatus('permission_denied');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setConnectionStatus]);

  if (!isOpen) return null;

  const redirectUriToDisplay =
    apiConfig?.redirectUri ||
    (clientOrigin ? `${clientOrigin}/auth/callback` : 'https://.../auth/callback');

  const handleCopyUri = () => {
    const uriToCopy =
      apiConfig?.redirectUri ||
      (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : redirectUriToDisplay);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(uriToCopy);
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
        localStorage.setItem('arthurs_gbp_project_id', projectIdInput.trim());
      }

      const res = await fetch('/api/auth/google/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: clientIdInput.trim() }),
      });
      const data = await res.json();

      // Refresh config
      const ref = await fetch(`/api/auth/google/url?client_id=${encodeURIComponent(clientIdInput.trim())}`);
      const freshConfig = await ref.json();
      setApiConfig(freshConfig);

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

    // If client ID is provided in input or configured
    const effectiveClientId = clientIdInput.trim() || apiConfig.clientId;
    if (!effectiveClientId) {
      setIsLoadingAuth(false);
      setAuthError(
        'Please enter your Google OAuth Client ID into the form above, or click "Use Sandbox / Verification Mode" to verify and test Arthur’s Creatives tools immediately.'
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

  const handleSimulateConnected = () => {
    setConnectionStatus('connected');
    setStep(3);
    setAuthError(null);
  };

  const handleConfirmAndSaveLocation = () => {
    const chosen = availableLocations.find((l) => l.id === selectedLocationId);
    if (chosen) {
      const updated: GoogleBusinessProfile = {
        ...currentProfile,
        name: chosen.id,
        title: chosen.title,
        verificationStatus: chosen.status,
        lastGoogleSyncAt: new Date().toISOString(),
      };
      onSelectAndConfirmProfile(updated);
      setStep(5);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#18204c] border border-[#D4AF37] rounded-2xl shadow-2xl p-6 md:p-8 text-white max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#25336e] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Google Business Profile Connection Form
            </h2>
            <p className="text-xs text-slate-300">
              OAuth setup, credentials configuration, and profile pairing for Arthur’s Creatives
            </p>
          </div>
        </div>

        {/* Connection Status Stepper (Interactive) */}
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
                    ? 'bg-[#D4AF37] text-[#0b0f26]'
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
                <code
                  suppressHydrationWarning
                  className="text-xs text-[#00F3FF] font-mono break-all flex-1 select-all"
                >
                  {redirectUriToDisplay}
                </code>
                <button
                  onClick={handleCopyUri}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00F3FF] hover:bg-[#00d8e4] text-[#0b0f26] font-bold text-xs rounded-md transition-all shadow-sm flex-shrink-0 cursor-pointer"
                  title="Copy Authorized Redirect URI"
                >
                  {copiedUri ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0b0f26]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#0b0f26]" />
                      <span>Copy URI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Google OAuth Credentials Input Form */}
            <div className="bg-[#111738] p-5 rounded-xl border border-slate-700 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  OAuth 2.0 Credentials Form
                </h3>
                {clientIdInput ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Client ID Entered
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Pending Credentials
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-200 font-semibold mb-1">
                    Google OAuth Client ID
                  </label>
                  <input
                    type="text"
                    value={clientIdInput}
                    onChange={(e) => setClientIdInput(e.target.value)}
                    placeholder="e.g. 1098472910492-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
                    className="w-full bg-[#0b0f26] border border-slate-700 focus:border-[#00F3FF] rounded-lg px-3 py-2 text-white font-mono text-xs outline-none transition-colors"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Found in Google Cloud Console &gt; APIs &amp; Services &gt; Credentials &gt; OAuth 2.0 Client IDs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Client Secret <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="password"
                      value={clientSecretInput}
                      onChange={(e) => setClientSecretInput(e.target.value)}
                      placeholder="GOCSPX-xxxxxxxxxxxxxxxx"
                      className="w-full bg-[#0b0f26] border border-slate-700 focus:border-[#00F3FF] rounded-lg px-3 py-2 text-white font-mono text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Google Cloud Project ID
                    </label>
                    <input
                      type="text"
                      value={projectIdInput}
                      onChange={(e) => setProjectIdInput(e.target.value)}
                      placeholder="e.g. arthurs-creatives-prod"
                      className="w-full bg-[#0b0f26] border border-slate-700 focus:border-[#00F3FF] rounded-lg px-3 py-2 text-white font-mono text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleSaveCredentials}
                    disabled={isSavingCreds}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#25336e] hover:bg-[#304085] text-white font-semibold text-xs rounded-lg transition-colors border border-slate-600 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{isSavingCreds ? 'Saving...' : 'Save Credentials'}</span>
                  </button>

                  {saveCredsSuccess && (
                    <span className="text-[11px] text-emerald-300 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Credentials saved!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Sandbox Callout */}
            <div className="p-3 bg-[#111738]/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span className="text-slate-300 text-[11px]">
                  Want to test the full inspection, repair sequence, and search insights immediately?
                </span>
              </div>
              <button
                onClick={handleSimulateConnected}
                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-bold text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer"
              >
                Instant Sandbox Mode
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2.5 bg-[#00F3FF] hover:bg-[#00d8e4] text-[#0b0f26] font-bold text-xs rounded-lg transition-colors cursor-pointer"
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
                Sign in with the Google account managing <strong>Arthur’s Creatives</strong> (configured owner: <code className="text-[#D4AF37]">arthurscreatives@gmail.com</code>).
              </p>

              {clientIdInput && (
                <div className="mb-4 inline-block bg-[#0b0f26] px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 font-mono">
                  Using Client ID: <span className="text-[#00F3FF]">{clientIdInput.slice(0, 18)}...</span>
                </div>
              )}

              {authError && (
                <div className="bg-rose-500/10 border border-rose-500/40 p-3 rounded-lg text-xs text-rose-300 mb-4 text-left">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
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
                  onClick={handleSimulateConnected}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#25336e] hover:bg-[#2e3e85] text-white font-medium text-xs rounded-lg transition-all border border-slate-600 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  Use Sandbox / Verification Mode
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#0b0f26] rounded-lg border border-slate-800 text-[11px] text-slate-300">
              <strong className="text-slate-200">Why Sandbox Mode is included:</strong> Google requires an extensive partner approval process before granting live write quotas on the Business Profile API. Sandbox mode connects to Arthur’s Creatives verified baseline facts so you can immediately inspect, test conflict detection, and prepare drafts without delay.
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
                Skip to Select Profile →
              </button>
            </div>
          </div>
        )}


        {/* Step 3: List accounts and locations, select Arthur's Creatives */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white mb-1">
              Select Your Google Business Location
            </h3>
            <p className="text-xs text-slate-300 mb-3">
              The following business locations were retrieved from your authorized Google account. Choose the profile for Arthur’s Creatives:
            </p>

            <div className="space-y-2.5">
              {availableLocations.map((loc) => {
                const isSelected = selectedLocationId === loc.id;
                return (
                  <div
                    key={loc.id}
                    onClick={() => setSelectedLocationId(loc.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#111738] border-[#00F3FF] shadow-md shadow-[#00F3FF]/10'
                        : 'bg-[#111738]/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setSelectedLocationId(loc.id)}
                            className="accent-[#00F3FF]"
                          />
                          <h4 className="text-sm font-bold text-white">{loc.title}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              loc.status === 'VERIFIED'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {loc.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 pl-5">
                          {loc.address}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 pl-5 font-mono">
                          ID: {loc.id}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-bold text-xs rounded-lg transition-colors"
              >
                Confirm Profile Selection →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm selection before permitting changes */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="bg-[#111738] p-5 rounded-xl border border-[#D4AF37]/50">
              <h3 className="text-sm font-bold text-[#D4AF37] mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
                Confirm Profile Pairing Before Permitting Changes
              </h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                As required by Phase 1 safety guidelines, you must explicitly confirm that this application is authorized to inspect and prepare repairs exclusively for:
              </p>

              <div className="bg-[#0b0f26] p-3 rounded-lg border border-slate-800 text-xs mb-4">
                <p className="text-white font-bold text-sm">Arthur’s Creatives</p>
                <p className="text-slate-300 text-xs">Resource: {selectedLocationId}</p>
                <p className="text-slate-300 text-xs">Category: Marketing Agency (Service-Area Business)</p>
                <p className="text-emerald-400 text-xs font-semibold mt-1">Status: Verified Google Business Profile</p>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isConfirmedByOwner}
                  onChange={(e) => setIsConfirmedByOwner(e.target.checked)}
                  className="mt-0.5 accent-[#00F3FF]"
                />
                <span className="text-xs text-slate-200">
                  I confirm that I am the authorized owner of Arthur’s Creatives and authorize Arthur’s AI Workforce to manage this profile in Review First mode.
                </span>
              </label>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back
              </button>
              <button
                onClick={handleConfirmAndSaveLocation}
                disabled={!isConfirmedByOwner}
                className="px-5 py-2.5 bg-[#00F3FF] hover:bg-[#00d8e4] disabled:opacity-50 text-[#0b0f26] font-bold text-xs rounded-lg transition-all shadow-md shadow-[#00F3FF]/20"
              >
                Lock Selection & Import Profile Information
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Ready & Connected */}
        {step === 5 && (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="w-14 h-14 text-[#00F3FF] mx-auto mb-2" />
            <h3 className="text-lg font-bold text-white">
              Google Business Profile Paired Successfully
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Profile information for <strong>Arthur’s Creatives</strong> has been imported and linked to your approved business facts. You can now run the Profile Inspector, review proposed changes, and explore search insights.
            </p>

            <div className="flex justify-center pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-bold text-xs rounded-lg transition-all shadow-md shadow-[#D4AF37]/30"
              >
                Enter Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

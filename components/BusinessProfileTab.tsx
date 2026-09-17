'use client';

import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  AlertCircle,
  EyeOff,
  Eye,
  Save,
  Clock,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';
import {
  ApprovedBusinessFacts,
  GoogleBusinessProfile,
  BusinessServiceItem,
} from '@/types/business-profile';

interface BusinessProfileTabProps {
  approvedFacts: ApprovedBusinessFacts;
  liveProfile: GoogleBusinessProfile;
  onSaveApprovedFacts: (facts: ApprovedBusinessFacts) => void;
  onImportFromGoogle: () => void;
}

export function BusinessProfileTab({
  approvedFacts,
  liveProfile,
  onSaveApprovedFacts,
  onImportFromGoogle,
}: BusinessProfileTabProps) {
  const [facts, setFacts] = useState<ApprovedBusinessFacts>(approvedFacts);
  const [activeSubTab, setActiveSubTab] = useState<'facts' | 'compare'>('facts');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Category input helper
  const [newCatInput, setNewCatInput] = useState('');
  const [newAreaInput, setNewAreaInput] = useState('');

  const handleSave = () => {
    const updated = {
      ...facts,
      lastConfirmedAt: new Date().toISOString(),
    };
    onSaveApprovedFacts(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleAddCategory = () => {
    if (!newCatInput.trim()) return;
    if (!facts.additionalCategories.includes(newCatInput.trim())) {
      setFacts({
        ...facts,
        additionalCategories: [...facts.additionalCategories, newCatInput.trim()],
      });
    }
    setNewCatInput('');
  };

  const handleRemoveCategory = (cat: string) => {
    setFacts({
      ...facts,
      additionalCategories: facts.additionalCategories.filter((c) => c !== cat),
    });
  };

  const handleAddArea = () => {
    if (!newAreaInput.trim()) return;
    if (!facts.serviceAreas.includes(newAreaInput.trim())) {
      setFacts({
        ...facts,
        serviceAreas: [...facts.serviceAreas, newAreaInput.trim()],
      });
    }
    setNewAreaInput('');
  };

  const handleRemoveArea = (area: string) => {
    setFacts({
      ...facts,
      serviceAreas: facts.serviceAreas.filter((a) => a !== area),
    });
  };

  const handleServiceChange = (id: string, field: keyof BusinessServiceItem, val: string) => {
    setFacts({
      ...facts,
      services: facts.services.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    });
  };

  const handleAddService = () => {
    const newService: BusinessServiceItem = {
      id: `srv-${Date.now()}`,
      name: 'New Custom Service',
      description: 'Describe this verified service clearly without marketing hype.',
      price: 'Starting at $',
    };
    setFacts({
      ...facts,
      services: [...facts.services, newService],
    });
  };

  const handleRemoveService = (id: string) => {
    setFacts({
      ...facts,
      services: facts.services.filter((s) => s.id !== id),
    });
  };

  const handleHoursChange = (
    day: string,
    field: 'open' | 'close' | 'isClosed',
    val: any
  ) => {
    setFacts({
      ...facts,
      regularHours: {
        ...facts.regularHours,
        [day]: {
          ...facts.regularHours[day],
          [field]: val,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#18204c] p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Approved Business Information
            </h2>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Source of Truth
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Confirm and maintain the verified business facts Arthur’s AI Workforce uses as the sole reference for inspections, repairs, and content drafts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#111738] p-1 rounded-xl border border-slate-700 flex text-xs">
            <button
              onClick={() => setActiveSubTab('facts')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === 'facts'
                  ? 'bg-[#D4AF37] text-[#0b0f26]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Business Facts Editor
            </button>
            <button
              onClick={() => setActiveSubTab('compare')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === 'compare'
                  ? 'bg-[#00F3FF] text-[#0b0f26]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Compare Live Profile
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-bold text-xs rounded-xl transition-all shadow-md shadow-[#D4AF37]/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Confirm & Lock Facts</span>
          </button>
        </div>
      </div>

      {saveSuccessNotice && (
        <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Approved Business Facts confirmed and locked as source of truth.</span>
        </div>
      )}

      {/* VIEW 1: Business Facts Editor */}
      {activeSubTab === 'facts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Core Business Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity & Basic Info */}
            <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
                <Building className="w-4 h-4 text-[#D4AF37]" />
                Identity & Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Business Name (Protected)
                  </label>
                  <input
                    type="text"
                    value={facts.businessName}
                    onChange={(e) => setFacts({ ...facts, businessName: e.target.value })}
                    className="w-full bg-[#111738] border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-[#D4AF37] outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    No keyword stuffing allowed in title per Google guidelines.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Primary Category (Protected)
                  </label>
                  <input
                    type="text"
                    value={facts.primaryCategory}
                    onChange={(e) => setFacts({ ...facts, primaryCategory: e.target.value })}
                    className="w-full bg-[#111738] border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-[#D4AF37] outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Standard Google GMB Category list.
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Phone Number (Protected)
                  </label>
                  <input
                    type="text"
                    value={facts.phoneNumber}
                    onChange={(e) => setFacts({ ...facts, phoneNumber: e.target.value })}
                    className="w-full bg-[#111738] border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-[#D4AF37] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Website Address (Protected)
                  </label>
                  <input
                    type="text"
                    value={facts.websiteUri}
                    onChange={(e) => setFacts({ ...facts, websiteUri: e.target.value })}
                    className="w-full bg-[#111738] border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <label className="text-slate-300 font-semibold">
                    Approved Business Description
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {facts.description.length} / 750 characters
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={facts.description}
                  onChange={(e) => setFacts({ ...facts, description: e.target.value })}
                  maxLength={750}
                  className="w-full bg-[#111738] border border-slate-700 rounded-lg p-3 text-white text-xs leading-relaxed focus:border-[#D4AF37] outline-none"
                  placeholder="Grounded description of Arthur's Creatives services..."
                />
              </div>

              {/* Secondary Categories */}
              <div>
                <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                  Secondary Categories (Protected)
                </label>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {facts.additionalCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[#111738] text-slate-200 border border-slate-700"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat)}
                        className="hover:text-rose-400 ml-1 text-slate-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                    placeholder="Add category (e.g. Internet Marketing Service)"
                    className="bg-[#111738] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-1.5 bg-[#25336e] hover:bg-[#2e3e85] text-white text-xs font-semibold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Verified Services Menu */}
            <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#D4AF37]" />
                    Verified Services Catalog
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Only services defined here will be recommended or updated on Google Business Profile.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#00F3FF]/15 hover:bg-[#00F3FF]/25 text-[#00F3FF] border border-[#00F3FF]/40 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="space-y-3">
                {facts.services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-[#111738] p-3.5 rounded-xl border border-slate-700/70 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => handleServiceChange(service.id, 'name', e.target.value)}
                        className="bg-[#0b0f26] border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white flex-1 outline-none focus:border-[#D4AF37]"
                        placeholder="Service Name"
                      />
                      <input
                        type="text"
                        value={service.price || ''}
                        onChange={(e) => handleServiceChange(service.id, 'price', e.target.value)}
                        className="bg-[#0b0f26] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-[#00F3FF] font-mono w-36 outline-none focus:border-[#00F3FF]"
                        placeholder="Price / Quote"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveService(service.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#0b0f26] rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={service.description}
                      onChange={(e) => handleServiceChange(service.id, 'description', e.target.value)}
                      className="w-full bg-[#0b0f26] border border-slate-800 rounded-lg p-2 text-xs text-slate-300 leading-relaxed outline-none focus:border-slate-700"
                      placeholder="Service description for Google Business Profile menu item..."
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                Operating Hours (Protected Field)
              </h3>
              <p className="text-[11px] text-slate-400">
                Verified weekly business hours. Any changes will require individual owner confirmation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(facts.regularHours).map(([day, schedule]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between bg-[#111738] p-2.5 rounded-lg border border-slate-800"
                  >
                    <span className="font-semibold text-slate-200 w-24">{day}</span>
                    <div className="flex items-center gap-2">
                      {schedule.isClosed ? (
                        <span className="text-rose-400 text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10">
                          Closed
                        </span>
                      ) : (
                        <span className="font-mono text-xs text-slate-300">
                          {schedule.open} – {schedule.close}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleHoursChange(day, 'isClosed', !schedule.isClosed)}
                        className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        {schedule.isClosed ? 'Set Open' : 'Set Closed'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Service Area & Brand Voice */}
          <div className="space-y-6">
            {/* Address Visibility & Service Areas */}
            <div className="bg-[#18204c] border border-[#D4AF37]/40 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-[#00F3FF]" />
                <h3 className="text-sm font-bold text-white">
                  Address & Service Areas
                </h3>
              </div>

              {/* Service-area toggle */}
              <div className="bg-[#111738] p-3.5 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {facts.isAddressVisible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        Address Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-[#00F3FF]" />
                        Address Hidden (Recommended)
                      </>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFacts({ ...facts, isAddressVisible: !facts.isAddressVisible })}
                    className="text-[11px] font-semibold text-[#00F3FF] hover:underline"
                  >
                    Toggle
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {facts.isAddressVisible
                    ? 'Caution: Public address is shown on Google Maps. If customers do not visit your physical studio, Google policies require hiding it.'
                    : 'Arthur’s Creatives is registered as a Service-Area Business. Physical dispatch address is hidden on Google Search and Maps to preserve privacy while serving clients at their location.'}
                </p>
              </div>

              {/* Service Areas Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Designated Service Areas (Protected)
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {facts.serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#111738] text-slate-200 border border-slate-700 rounded-lg text-xs"
                    >
                      <span>{area}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(area)}
                        className="hover:text-rose-400 text-slate-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAreaInput}
                    onChange={(e) => setNewAreaInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArea())}
                    placeholder="Add area (e.g. Staten Island, NY)"
                    className="bg-[#111738] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white outline-none flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddArea}
                    className="px-3 py-1 bg-[#25336e] hover:bg-[#2e3e85] text-white text-xs font-semibold rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Brand Voice & Owner Instructions */}
            <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00F3FF]" />
                Brand Voice & Owner Instructions
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brand Voice Tone
                </label>
                <textarea
                  rows={3}
                  value={facts.brandVoice}
                  onChange={(e) => setFacts({ ...facts, brandVoice: e.target.value })}
                  className="w-full bg-[#111738] border border-slate-700 rounded-lg p-2.5 text-white text-xs leading-relaxed outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Owner Constraints & Safety Rules
                </label>
                <textarea
                  rows={3}
                  value={facts.ownerInstructions}
                  onChange={(e) => setFacts({ ...facts, ownerInstructions: e.target.value })}
                  className="w-full bg-[#111738] border border-slate-700 rounded-lg p-2.5 text-white text-xs leading-relaxed outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Compare Live Profile */}
      {activeSubTab === 'compare' && (
        <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Live Google Profile vs. Approved Business Facts
              </h3>
              <p className="text-xs text-slate-300">
                Direct side-by-side comparison of what is publicly shown on Google vs what is confirmed in your source of truth.
              </p>
            </div>
            <button
              onClick={onImportFromGoogle}
              className="px-3 py-1.5 bg-[#25336e] hover:bg-[#2e3e85] text-slate-200 text-xs font-semibold rounded-lg border border-slate-600 transition-colors"
            >
              Re-import from Google
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Approved Facts Column */}
            <div className="bg-[#111738] p-4 rounded-xl border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                <span className="text-xs font-bold text-emerald-400">
                  Approved Facts (Source of Truth)
                </span>
                <span className="text-[10px] text-slate-400">Confirmed by Owner</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Business Name:</span>
                <p className="text-xs font-bold text-white">{facts.businessName}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Description:</span>
                <p className="text-xs text-slate-200 leading-relaxed">{facts.description}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Primary & Secondary Categories:</span>
                <p className="text-xs text-slate-200">
                  {facts.primaryCategory} · {facts.additionalCategories.join(', ')}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Cataloged Services ({facts.services.length}):</span>
                <ul className="text-xs text-slate-300 list-disc list-inside space-y-1 mt-1">
                  {facts.services.map((s) => (
                    <li key={s.id}>
                      <strong className="text-white">{s.name}</strong> ({s.price})
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Saturday Hours:</span>
                <p className="text-xs text-emerald-400 font-mono">
                  {facts.regularHours.Saturday.isClosed
                    ? 'Closed'
                    : `${facts.regularHours.Saturday.open} – ${facts.regularHours.Saturday.close}`}
                </p>
              </div>
            </div>

            {/* Live Profile Column */}
            <div className="bg-[#111738] p-4 rounded-xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                <span className="text-xs font-bold text-[#00F3FF]">
                  Live Google Profile (GMB API)
                </span>
                <span className="text-[10px] text-slate-400">Last Synced Today</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Business Name:</span>
                <p className="text-xs font-bold text-white">{liveProfile.title}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Description:</span>
                <p className="text-xs text-slate-200 leading-relaxed bg-[#0b0f26] p-2 rounded border border-slate-800">
                  {liveProfile.profileDescription || '(Empty or missing)'}
                </p>
                {liveProfile.profileDescription !== facts.description && (
                  <span className="text-[10px] text-amber-300 font-semibold mt-1 block">
                    ⚠ Mismatch: Live description is truncated compared to approved facts.
                  </span>
                )}
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Primary & Secondary Categories:</span>
                <p className="text-xs text-slate-200">
                  {liveProfile.primaryCategory} · {liveProfile.additionalCategories?.join(', ') || 'None'}
                </p>
                {liveProfile.additionalCategories?.length !== facts.additionalCategories.length && (
                  <span className="text-[10px] text-amber-300 font-semibold mt-1 block">
                    ⚠ Mismatch: Live listing is missing secondary categories.
                  </span>
                )}
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Cataloged Services ({liveProfile.services?.length || 0}):</span>
                <ul className="text-xs text-slate-300 list-disc list-inside space-y-1 mt-1">
                  {(liveProfile.services || []).map((s) => (
                    <li key={s.id}>
                      <strong className="text-white">{s.name}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Saturday Hours:</span>
                <p className="text-xs text-rose-400 font-mono">
                  {liveProfile.regularHours?.Saturday?.isClosed ? 'Closed' : 'Open'}
                </p>
                {liveProfile.regularHours?.Saturday?.isClosed !== facts.regularHours.Saturday.isClosed && (
                  <span className="text-[10px] text-amber-300 font-semibold mt-1 block">
                    ⚠ Mismatch: Live profile indicates Saturday is Closed.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

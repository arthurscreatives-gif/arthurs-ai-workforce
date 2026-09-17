'use client';

import React, { useState } from 'react';
import {
  FileEdit,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Bookmark,
  ExternalLink,
  Plus,
  RefreshCw,
  Send,
  HelpCircle,
  MessageSquare,
  Star,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  ContentDraft,
  ApprovedBusinessFacts,
  CustomerReview,
  ReviewReplyDraft,
} from '@/types/business-profile';

interface ContentDraftsTabProps {
  drafts: ContentDraft[];
  approvedFacts: ApprovedBusinessFacts;
  onSaveDraft: (draft: ContentDraft) => void;
  onDeleteDraft: (id: string) => void;
  onGenerateDraft: (type: ContentDraft['type'], customPrompt?: string) => Promise<ContentDraft | null>;
  isGenerating: boolean;
  onLogActivity?: (action: string, details: string, field?: string) => void;
}

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    reviewerName: 'Marcus Vance',
    starRating: 5,
    comment:
      'Arthur’s Creatives streamlined our entire local search setup. Our phone calls from Google Maps increased within two weeks, and they kept our private home office address completely hidden as promised. Incredible craftsmanship!',
    createTime: '2 days ago',
    serviceMentioned: 'Digital Workforce & Local SEO',
  },
  {
    id: 'rev-2',
    reviewerName: 'Elena Rostova',
    starRating: 4,
    comment:
      'Great service optimizing our business profile categories. Very thorough walkthrough of our approved business facts. Would appreciate quicker weekend turnarounds on custom requests, but overall high quality.',
    createTime: '1 week ago',
    serviceMentioned: 'Profile Health Audit',
  },
  {
    id: 'rev-3',
    reviewerName: 'David K.',
    starRating: 2,
    comment:
      'Had a billing confusion regarding the monthly maintenance charge and need a refund for the extra charge on my card. Please have someone contact me immediately or I will dispute with my bank.',
    createTime: '3 days ago',
    serviceMentioned: 'Account Billing',
  },
];

export function ContentDraftsTab({
  drafts,
  approvedFacts,
  onSaveDraft,
  onDeleteDraft,
  onGenerateDraft,
  isGenerating,
  onLogActivity,
}: ContentDraftsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'reviews'>('posts');
  const [selectedType, setSelectedType] = useState<ContentDraft['type']>('service_spotlight');
  const [customNote, setCustomNote] = useState('');
  const [activeDraft, setActiveDraft] = useState<ContentDraft | null>(drafts[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Review Replies State
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [selectedReviewId, setSelectedReviewId] = useState<string>(INITIAL_REVIEWS[0].id);
  const [isDraftingReply, setIsDraftingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const selectedReview = reviews.find((r) => r.id === selectedReviewId) || reviews[0];

  const handleDraftReviewReply = async (review: CustomerReview) => {
    setIsDraftingReply(true);
    setReplyError(null);
    try {
      const res = await fetch('/api/ai/draft-review-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          review,
          approvedFacts,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setReplyError(data.error || 'Failed to draft review reply.');
        return;
      }

      const replyDraft: ReviewReplyDraft = {
        id: `rep-${Date.now()}`,
        reviewId: review.id,
        replyText: data.replyText,
        isSensitiveComplaint: data.isSensitiveComplaint,
        sensitivityReason: data.sensitivityReason,
        sentiment: data.sentiment,
        status: 'draft',
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, reply: replyDraft } : r))
      );

      if (onLogActivity) {
        onLogActivity(
          'AI Review Reply Drafted',
          `Generated personalized reply draft for ${review.reviewerName} (${review.starRating} stars). Sensitive Complaint: ${data.isSensitiveComplaint ? 'YES (Flagged)' : 'No'}.`,
          'customer_reviews'
        );
      }
    } catch (err: unknown) {
      setReplyError(err instanceof Error ? err.message : 'Network error drafting reply');
    } finally {
      setIsDraftingReply(false);
    }
  };

  const handleApproveReply = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId && r.reply) {
          return {
            ...r,
            reply: {
              ...r.reply,
              status: 'approved',
              approvedAt: new Date().toISOString(),
            },
          };
        }
        return r;
      })
    );

    const targetReview = reviews.find((r) => r.id === reviewId);
    if (onLogActivity && targetReview) {
      onLogActivity(
        'Review Reply Approved by Arthur',
        `Arthur reviewed and approved official public reply to ${targetReview.reviewerName}. Ready for manual posting on Google Maps.`,
        'customer_reviews'
      );
    }
  };

  const handleUpdateReplyText = (reviewId: string, newText: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId && r.reply) {
          return {
            ...r,
            reply: {
              ...r.reply,
              replyText: newText,
            },
          };
        }
        return r;
      })
    );
  };


  const handleGenerate = async () => {
    const generated = await onGenerateDraft(selectedType, customNote);
    if (generated) {
      setActiveDraft(generated);
      setCustomNote('');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUpdateActiveDraft = (field: keyof ContentDraft, value: any) => {
    if (!activeDraft) return;
    const updated = { ...activeDraft, [field]: value };
    setActiveDraft(updated);
    onSaveDraft(updated);
  };

  const filteredDrafts = drafts.filter((d) => {
    if (filterType === 'all') return true;
    return d.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Overview */}
      <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Content & Customer Communications
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                Phase 1 Review-First
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Generate grounded Google Business Profile post updates and draft personalized customer review replies strictly using confirmed Approved Business Facts.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-2 bg-[#111738] p-1.5 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setActiveSubTab('posts')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'posts'
                  ? 'bg-[#00F3FF] text-[#0b0f26]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              <span>Google Posts ({drafts.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('reviews')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'reviews'
                  ? 'bg-[#D4AF37] text-[#0b0f26]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Reviews & Replies ({reviews.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: GOOGLE BUSINESS POST DRAFTS */}
      {activeSubTab === 'posts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 col): Draft Generation Controls & Saved Drafts List */}
        <div className="space-y-6">
          {/* Generator Form */}
          <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00F3FF]" />
              <h3 className="text-sm font-bold text-white">
                Generate New Post Draft
              </h3>
            </div>

            {/* Type selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Draft Category
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as ContentDraft['type'])}
                className="w-full bg-[#111738] border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#D4AF37]"
              >
                <option value="service_spotlight">Service Spotlight</option>
                <option value="small_business_tip">Helpful Small-Business Tip</option>
                <option value="project_highlight">Owner Project Highlight</option>
                <option value="approved_offer">Approved Offer or Announcement</option>
              </select>
            </div>

            {/* Optional note */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Owner Note or Focus Area (Optional)
              </label>
              <textarea
                rows={2}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g., Focus on our Google Business Profile repair workflow for local creatives..."
                className="w-full bg-[#111738] border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 bg-[#00F3FF] hover:bg-[#00d8e4] disabled:opacity-60 text-[#0b0f26] font-bold text-xs rounded-lg transition-all shadow-md shadow-[#00F3FF]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Grounded Draft</span>
                </>
              )}
            </button>
          </div>

          {/* Drafts List Archive */}
          <div className="bg-[#18204c] border border-slate-800 rounded-xl p-5 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#D4AF37]" />
                Saved Drafts ({drafts.length})
              </h3>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#111738] border border-slate-700 text-slate-300 text-[11px] rounded px-2 py-1 outline-none"
              >
                <option value="all">All Types</option>
                <option value="service_spotlight">Spotlight</option>
                <option value="small_business_tip">Tips</option>
                <option value="project_highlight">Projects</option>
                <option value="approved_offer">Offers</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {filteredDrafts.map((d) => {
                const isSelected = activeDraft?.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setActiveDraft(d)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#111738] border-[#00F3FF] shadow-sm'
                        : 'bg-[#111738]/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-[#D4AF37]">
                        {d.typeLabel}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(d.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-white truncate">
                      {d.title}
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {d.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (2 cols): Interactive Draft Editor & Formatter */}
        <div className="lg:col-span-2 space-y-4">
          {activeDraft ? (
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-lg">
              {/* Draft Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                    {activeDraft.typeLabel}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Created: {new Date(activeDraft.createdAt).toLocaleDateString('en-US', {
                      dateStyle: 'medium',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleCopy(
                        `${activeDraft.title}\n\n${activeDraft.body}\n\nLearn more: ${activeDraft.ctaUrl}`,
                        activeDraft.id
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-bold text-xs rounded-lg transition-all shadow-sm"
                  >
                    {copiedId === activeDraft.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Formatted Post</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onDeleteDraft(activeDraft.id);
                      setActiveDraft(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#111738] rounded-lg transition-colors"
                    title="Dismiss / Delete Draft"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Post Headline / Title
                </label>
                <input
                  type="text"
                  value={activeDraft.title}
                  onChange={(e) => handleUpdateActiveDraft('title', e.target.value)}
                  className="w-full bg-[#111738] border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-white focus:border-[#00F3FF] outline-none"
                />
              </div>

              {/* Body editor */}
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <label className="text-slate-300 font-semibold">
                    Post Body Content
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activeDraft.body.length} / 1500 chars (Google Posts Limit)
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={activeDraft.body}
                  onChange={(e) => handleUpdateActiveDraft('body', e.target.value)}
                  maxLength={1500}
                  className="w-full bg-[#111738] border border-slate-700 rounded-lg p-3 text-xs text-white leading-relaxed focus:border-[#00F3FF] outline-none font-sans"
                />
              </div>

              {/* Call to Action Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#111738] p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Google Post Button (CTA)
                  </label>
                  <select
                    value={activeDraft.callToAction || 'LEARN_MORE'}
                    onChange={(e) =>
                      handleUpdateActiveDraft('callToAction', e.target.value as ContentDraft['callToAction'])
                    }
                    className="w-full bg-[#0b0f26] border border-slate-700 rounded-lg p-2 text-xs text-white outline-none"
                  >
                    <option value="LEARN_MORE">Learn more</option>
                    <option value="GET_OFFER">Get offer</option>
                    <option value="CALL_NOW">Call now</option>
                    <option value="BOOK">Book an appointment</option>
                    <option value="NONE">No button</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Destination URL
                  </label>
                  <input
                    type="text"
                    value={activeDraft.ctaUrl || approvedFacts.websiteUri}
                    onChange={(e) => handleUpdateActiveDraft('ctaUrl', e.target.value)}
                    className="w-full bg-[#0b0f26] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                  />
                </div>
              </div>

              {/* Google Business Profile Post Preview Frame */}
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-2">
                  Preview in Google Maps / Search format:
                </span>
                <div className="bg-[#0b0f26] border border-[#D4AF37]/30 rounded-xl p-4 max-w-lg mx-auto shadow-inner text-xs">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-[10px] font-bold text-[#0b0f26]">
                      AC
                    </div>
                    <div>
                      <span className="font-bold text-white block">Arthur’s Creatives</span>
                      <span className="text-[10px] text-slate-400">Google Business Post</span>
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{activeDraft.title}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed mb-3 whitespace-pre-wrap">
                    {activeDraft.body}
                  </p>
                  {activeDraft.callToAction !== 'NONE' && (
                    <div className="inline-block px-3 py-1.5 rounded-full bg-[#00F3FF] text-[#0b0f26] font-bold text-[11px]">
                      {activeDraft.callToAction === 'GET_OFFER'
                        ? 'Get offer'
                        : activeDraft.callToAction === 'CALL_NOW'
                        ? 'Call now'
                        : 'Learn more'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              <FileEdit className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white mb-1">No Draft Selected</h4>
              <p className="max-w-sm mx-auto mb-4">
                Choose a saved draft from the list on the left or generate a fresh post using your approved business facts.
              </p>
              <button
                onClick={handleGenerate}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-bold text-xs rounded-lg transition-colors"
              >
                Generate First Draft
              </button>
            </div>
          )}
        </div>
      </div>
      )}

      {/* SUB-VIEW 2: CUSTOMER REVIEWS & AI REPLY STUDIO */}
      {activeSubTab === 'reviews' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Customer Reviews List */}
          <div className="space-y-4">
            <div className="bg-[#18204c] border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#D4AF37]" />
                  Google Reviews Inbox
                </h3>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  3.7 Avg Rating
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Select a review to draft a personalized AI response grounded in approved business facts.
              </p>
            </div>

            <div className="space-y-3">
              {reviews.map((rev) => {
                const isSelected = selectedReview.id === rev.id;
                return (
                  <div
                    key={rev.id}
                    onClick={() => setSelectedReviewId(rev.id)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#18204c] border-[#D4AF37] shadow-lg'
                        : 'bg-[#111738]/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-white text-xs">{rev.reviewerName}</span>
                      <span className="text-[10px] text-slate-400">{rev.createTime}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= rev.starRating
                              ? 'text-[#D4AF37] fill-[#D4AF37]'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-300 text-[11px] line-clamp-3 leading-relaxed mb-2">
                      &quot;{rev.comment}&quot;
                    </p>

                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{rev.serviceMentioned}</span>
                      {rev.reply?.status === 'approved' ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      ) : rev.reply ? (
                        <span className="text-[#D4AF37] font-semibold">
                          Draft Ready
                        </span>
                      ) : (
                        <span className="text-slate-500">Unreplied</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (2 cols): AI Review Reply Studio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              {/* Selected Review Summary */}
              <div className="bg-[#111738] p-4 rounded-xl border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{selectedReview.reviewerName}</h4>
                    <span className="text-[11px] text-slate-400">{selectedReview.createTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= selectedReview.starRating
                            ? 'text-[#D4AF37] fill-[#D4AF37]'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans bg-[#0b0f26] p-3 rounded-lg border border-slate-800">
                  &quot;{selectedReview.comment}&quot;
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-slate-400">
                    Topic: <strong>{selectedReview.serviceMentioned || 'General Experience'}</strong>
                  </span>

                  <button
                    onClick={() => handleDraftReviewReply(selectedReview)}
                    disabled={isDraftingReply}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f2e] disabled:opacity-60 text-[#0b0f26] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {isDraftingReply ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Drafting AI Reply...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Draft AI Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Notice */}
              {replyError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/40 rounded-xl text-xs text-rose-300">
                  {replyError}
                </div>
              )}

              {/* Generated Reply Draft Area */}
              {selectedReview.reply ? (
                <div className="space-y-4">
                  {/* Sensitive Complaint Banner if flagged */}
                  {selectedReview.reply.isSensitiveComplaint && (
                    <div className="bg-amber-500/15 border border-amber-500/50 p-4 rounded-xl text-xs text-amber-200 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-bold text-amber-300">
                          Sensitive Complaint Flagged: Requires Arthur’s Direct Review
                        </p>
                        <p className="text-[11px] leading-relaxed">
                          {selectedReview.reply.sensitivityReason ||
                            'This review mentions billing, refund disputes, or a negative rating. Arthur must manually approve before posting.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reply Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white flex items-center gap-2">
                        <span>Personalized Reply Draft</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            selectedReview.reply.sentiment === 'positive'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : selectedReview.reply.sentiment === 'negative'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {selectedReview.reply.sentiment} sentiment
                        </span>
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {selectedReview.reply.replyText.length} chars
                      </span>
                    </div>

                    <textarea
                      rows={5}
                      value={selectedReview.reply.replyText}
                      onChange={(e) =>
                        handleUpdateReplyText(selectedReview.id, e.target.value)
                      }
                      className="w-full bg-[#111738] border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed focus:border-[#D4AF37] outline-none"
                    />
                  </div>

                  {/* Actions & Approvals */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                    <div className="text-[11px] text-slate-400">
                      {selectedReview.reply.status === 'approved' ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved by Arthur on{' '}
                          {new Date(selectedReview.reply.approvedAt || '').toLocaleDateString('en-US')}
                        </span>
                      ) : (
                        <span>Status: <strong>Pending Arthur’s Approval</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopy(selectedReview.reply!.replyText, selectedReview.id)
                        }
                        className="px-3 py-1.5 bg-[#111738] hover:bg-[#1f295c] border border-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        {copiedId === selectedReview.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Reply</span>
                          </>
                        )}
                      </button>

                      {selectedReview.reply.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveReply(selectedReview.id)}
                          className="px-4 py-1.5 bg-[#00F3FF] hover:bg-[#00d8e4] text-[#0b0f26] font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0b0f26]" />
                          <span>Approve & Record Reply</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-[#111738]/50 border border-slate-800 rounded-xl text-center text-slate-400 text-xs space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="font-semibold text-slate-300">No Reply Drafted Yet</p>
                  <p className="text-[11px] max-w-sm mx-auto">
                    Click &quot;Draft AI Reply&quot; above to generate a warm, grounded response adhering to your confirmed business facts.
                  </p>
                </div>
              )}

              {/* Security Boundary Notice */}
              <div className="p-3 bg-[#0b0f26] rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F3FF]" />
                  <span>External Content Safety Boundary</span>
                </div>
                <p>
                  Reviews and external public text are treated strictly as read-only data—never as prompt instructions that can alter workforce settings, modify business facts, or trigger unapproved profile updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

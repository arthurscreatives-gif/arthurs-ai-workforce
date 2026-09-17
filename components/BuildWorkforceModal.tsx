'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Bot,
  PhoneCall,
  MessageSquare,
  TrendingUp,
  Calendar,
  UserCheck,
  Megaphone,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Globe,
  Mail,
  CreditCard,
  Building,
} from 'lucide-react';

interface BuildWorkforceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'build' | 'explore';
}

interface AgentTemplate {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultIntegrations: string[];
  recommendedRole: string;
  selected: boolean;
}

const INITIAL_TEMPLATES: AgentTemplate[] = [
  {
    id: 'phone_receptionist',
    name: 'AI Phone Receptionist',
    category: 'Inbound Voice & Triage',
    icon: PhoneCall,
    description: 'Answers customer calls 24/7, answers common business questions, takes messages, and transfers urgent issues to staff.',
    defaultIntegrations: ['Phone / VoIP', 'Google Business Profile', 'Email'],
    recommendedRole: 'First line of contact for local callers and inquiries.',
    selected: true,
  },
  {
    id: 'customer_service',
    name: 'Customer-Service Chatbot',
    category: 'Website & Messaging Support',
    icon: MessageSquare,
    description: 'Instant answers on website chat and social messages using your verified business knowledge base with human handoff.',
    defaultIntegrations: ['Website Chat', 'CRM', 'Knowledge Base'],
    recommendedRole: 'Resolves FAQs, provides service details, and logs tickets.',
    selected: true,
  },
  {
    id: 'sales_assistant',
    name: 'Sales Assistant',
    category: 'Inquiry Qualification',
    icon: TrendingUp,
    description: 'Qualifies incoming buyer interest, presents customized packages, estimates quotes, and gathers customer requirements.',
    defaultIntegrations: ['CRM', 'Payment Systems', 'Email'],
    recommendedRole: 'Accelerates response times to inbound project inquiries.',
    selected: true,
  },
  {
    id: 'appointment_scheduler',
    name: 'Appointment Scheduler',
    category: 'Booking & Dispatch',
    icon: Calendar,
    description: 'Coordinates consults, meetings, and on-site visits directly into Google Calendar with automated reminders and rescheduling.',
    defaultIntegrations: ['Calendar', 'SMS / Phone', 'CRM'],
    recommendedRole: 'Eliminates back-and-forth email tagging for bookings.',
    selected: true,
  },
  {
    id: 'lead_followup',
    name: 'Lead Follow-Up Agent',
    category: 'Nurture & Pipeline',
    icon: UserCheck,
    description: 'Follows up with recent quotes, abandoned inquiries, and past clients within 5 minutes of contact.',
    defaultIntegrations: ['CRM', 'Email', 'SMS'],
    recommendedRole: 'Maintains consistent pipeline follow-ups without manual lag.',
    selected: false,
  },
  {
    id: 'marketing_assistant',
    name: 'Marketing Assistant',
    category: 'Local SEO & Content',
    icon: Megaphone,
    description: 'Drafts localized Google Business posts, service spotlights, case studies, and email updates aligned with verified facts.',
    defaultIntegrations: ['Google Business Profile', 'Email', 'Website'],
    recommendedRole: 'Keeps brand presence and search ranking signals fresh.',
    selected: true,
  },
  {
    id: 'internal_ops',
    name: 'Internal Operations Agent',
    category: 'Workflow & Auditing',
    icon: Cpu,
    description: 'Monitors profile accuracy, alerts owners to discrepancies, enforces human approvals, and summarizes weekly metrics.',
    defaultIntegrations: ['Audit Trail', 'Email', 'Internal Dashboard'],
    recommendedRole: 'Ensures compliance and single-pane-of-glass oversight.',
    selected: true,
  },
];

export function BuildWorkforceModal({
  isOpen,
  onClose,
  defaultMode = 'build',
}: BuildWorkforceModalProps) {
  const [activeView, setActiveView] = useState<'build' | 'explore'>(defaultMode);

  // Form states
  const [businessName, setBusinessName] = useState("Arthur's Creatives");
  const [businessType, setBusinessType] = useState('Marketing Agency & Creative Studio');
  const [businessDescription, setBusinessDescription] = useState(
    "Arthur's Creatives provides branding, creative design, web development, and digital marketing services to growing businesses. We operate as a high-touch service business and need automation for customer inquiries, booking consultations, and Google Business Profile management."
  );
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'Google Business Profile',
    'Website',
    'Email',
    'Calendar',
  ]);
  const [templates, setTemplates] = useState<AgentTemplate[]>(INITIAL_TEMPLATES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deployedSuccess, setDeployedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const toggleTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleBuildWorkforce = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setDeployedSuccess(true);
      setTimeout(() => {
        setDeployedSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  const availableIntegrations = [
    { name: 'Google Business Profile', icon: Building },
    { name: 'Website', icon: Globe },
    { name: 'Email', icon: Mail },
    { name: 'Calendar', icon: Calendar },
    { name: 'CRM', icon: UserCheck },
    { name: 'Payment Systems', icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#18204c] border border-[#D4AF37] rounded-2xl shadow-2xl p-6 md:p-8 text-white max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#25336e] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#00F3FF] font-semibold">
                Digital Workforce Builder
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold">
                No-Code Deployment
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1">
              Build, Train, and Deploy Your Digital Workforce
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Create intelligent AI agents trained with your verified business facts. Connect them directly to your website, phone, email, and Google Business Profile.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#111738] p-1 rounded-xl border border-slate-700 flex-shrink-0">
            <button
              onClick={() => setActiveView('build')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'build'
                  ? 'bg-[#D4AF37] text-[#0b0f26] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Build Your AI Workforce
            </button>
            <button
              onClick={() => setActiveView('explore')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeView === 'explore'
                  ? 'bg-[#00F3FF] text-[#0b0f26] shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Explore AI Agents
            </button>
          </div>
        </div>

        {deployedSuccess && (
          <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-xs flex items-center gap-3 mb-6 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Workforce Configured Successfully!</p>
              <p className="text-xs text-emerald-200/90">
                Your selected AI agents are linked to Arthur’s Creatives command center with human approval safeguards.
              </p>
            </div>
          </div>
        )}

        {/* VIEW 1: BUILD YOUR AI WORKFORCE FORM */}
        {activeView === 'build' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Column 1: Business Description */}
              <div className="bg-[#111738] p-5 rounded-xl border border-slate-700 space-y-4">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                  1. Business Profile &amp; Knowledge Training
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-[#0b0f26] border border-slate-700 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-white font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Industry / Service Type
                    </label>
                    <input
                      type="text"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-[#0b0f26] border border-slate-700 focus:border-[#D4AF37] rounded-lg px-3 py-2 text-white font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Describe Your Business &amp; Operations
                    </label>
                    <textarea
                      rows={4}
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                      placeholder="Describe what your business does, your services, hours, common client questions, and what you want automated..."
                      className="w-full bg-[#0b0f26] border border-slate-700 focus:border-[#D4AF37] rounded-lg p-3 text-white font-medium text-xs outline-none leading-relaxed"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      The platform uses this description along with your Approved Business Facts to train your agents.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Column 2: Tools & Integrations */}
              <div className="bg-[#111738] p-5 rounded-xl border border-slate-700 space-y-4">
                <h3 className="text-xs font-bold text-[#00F3FF] uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-[#00F3FF]" />
                  2. Connect Essential Business Tools
                </h3>
                <p className="text-xs text-slate-300">
                  Select which channels your digital workforce will operate on:
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  {availableIntegrations.map((tool) => {
                    const Icon = tool.icon;
                    const isSelected = selectedTools.includes(tool.name);
                    return (
                      <button
                        key={tool.name}
                        onClick={() => toggleTool(tool.name)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#18204c] border-[#00F3FF] shadow-sm shadow-[#00F3FF]/10 text-white'
                            : 'bg-[#0b0f26]/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#00F3FF]/20 text-[#00F3FF]' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold">{tool.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-[#0b0f26] rounded-lg border border-slate-800 text-[11px] text-slate-300">
                  <strong className="text-white">Active Connection:</strong> Google Business Profile Manager is configured for <strong>Arthur’s Creatives</strong> with Review First safety.
                </div>
              </div>
            </div>

            {/* Section 3: Select Agents for Your Workforce */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                  3. Select Agents to Deploy in Your Digital Workforce
                </h3>
                <span className="text-xs text-slate-400">
                  {templates.filter((t) => t.selected).length} of {templates.length} agents selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {templates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <div
                      key={template.id}
                      onClick={() => toggleTemplate(template.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                        template.selected
                          ? 'bg-[#111738] border-[#D4AF37] shadow-md shadow-[#D4AF37]/10'
                          : 'bg-[#111738]/40 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              template.selected
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <input
                            type="checkbox"
                            checked={template.selected}
                            onChange={() => {}}
                            className="accent-[#D4AF37]"
                          />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-0.5">{template.name}</h4>
                        <span className="text-[10px] text-[#00F3FF] font-medium block mb-2">
                          {template.category}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                          {template.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                        Role: <span className="text-slate-200">{template.recommendedRole}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveView('explore')}
                className="text-xs font-semibold text-[#00F3FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Explore all agent capabilities &amp; sample conversations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-[#111738] hover:bg-[#1a2353] text-slate-300 font-semibold text-xs rounded-xl transition-colors border border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuildWorkforce}
                  disabled={isGenerating}
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-[#D4AF37]/25 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Deploying Workforce...' : 'Build Your AI Workforce'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: EXPLORE AI AGENTS */}
        {activeView === 'explore' && (
          <div className="space-y-6">
            <div className="bg-[#111738] p-4 rounded-xl border border-slate-700 text-xs text-slate-300">
              <strong className="text-white">Pre-Trained Business Agent Roster:</strong> Review the specialized responsibilities and communication styles of each agent in Arthur’s AI Workforce suite.
            </div>

            <div className="space-y-4">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    className="bg-[#111738] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#18204c] border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{template.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00F3FF]/15 text-[#00F3FF] border border-[#00F3FF]/30 font-medium">
                              {template.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-[10px] text-slate-400 font-semibold">Integrates with:</span>
                            {template.defaultIntegrations.map((integ) => (
                              <span
                                key={integ}
                                className="text-[10px] px-2 py-0.5 rounded bg-[#0b0f26] border border-slate-700 text-slate-300"
                              >
                                {integ}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          toggleTemplate(template.id);
                          setActiveView('build');
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                          template.selected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26]'
                        }`}
                      >
                        {template.selected ? '✓ In Active Roster' : '+ Add to Workforce'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <button
                onClick={() => setActiveView('build')}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ← Back to Workforce Builder Form
              </button>
              <button
                onClick={() => setActiveView('build')}
                className="px-5 py-2 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Build Your AI Workforce →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

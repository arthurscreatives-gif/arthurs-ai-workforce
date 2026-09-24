'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Zap,
  ShieldAlert,
  Building2,
  PhoneCall,
  Search,
  Globe,
  Radio,
  Trash2,
  Download,
  ExternalLink,
  ChevronDown,
  Info,
  Clock,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { ChatMessage, ChatRoleKey, CHAT_ROLES } from '@/types/ai-chat';

interface WorkforceChatProps {
  businessName?: string;
  onOpenLiveVoice?: () => void;
}

export function WorkforceChat({
  businessName = "Arthur's Creatives",
  onOpenLiveVoice,
}: WorkforceChatProps) {
  const [selectedRole, setSelectedRole] = useState<ChatRoleKey>('workforce_architect');
  const [selectedModel, setSelectedModel] = useState<
    'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'
  >('gemini-3.5-flash');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);
  const [isCustomInstructionOpen, setIsCustomInstructionOpen] = useState(false);
  const [customInstruction, setCustomInstruction] = useState('');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Welcome to **Arthur’s AI Workforce Command Center**! I am your **${CHAT_ROLES.workforce_architect.title}** powered by Gemini.

I can help you build, train, and orchestrate AI phone receptionists, customer-service chatbots, Google Business Profile inspectors, and operations agents tailored for **${businessName}**.

How can I assist your digital workforce today?`,
      timestamp: 'Just now',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // When role changes, align recommended model
  const handleRoleChange = (roleKey: ChatRoleKey) => {
    setSelectedRole(roleKey);
    const roleConfig = CHAT_ROLES[roleKey];
    setSelectedModel(roleConfig.recommendedModel);

    // Add a role greeting notice if conversation has messages
    setMessages((prev) => [
      ...prev,
      {
        id: 'role-switch-' + Date.now(),
        role: 'assistant',
        content: `*Switched role to **${roleConfig.title}**.* Recommended model: \`${roleConfig.recommendedModel}\` (${roleConfig.modelSpeedLabel}).\n\n${roleConfig.shortDesc}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: roleConfig.recommendedModel,
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setInputText('');

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          role: selectedRole,
          model: selectedModel,
          useSearchGrounding,
          systemInstruction: customInstruction.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate chat response.');
      }

      const assistantMessage: ChatMessage = {
        id: 'asst-' + Date.now(),
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed,
        sources: data.sources || [],
        searchQueries: data.searchQueries || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: `⚠️ **Error generating response:** ${err.message || 'Please check your connection and try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-reset',
        role: 'assistant',
        content: `Conversation cleared. Ready for your next query for **${businessName}**.`,
        timestamp: 'Just now',
        modelUsed: selectedModel,
      },
    ]);
  };

  const handleExportHistory = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()} (${m.modelUsed || ''}):\n${m.content}\n`)
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arthurs-workforce-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentRole = CHAT_ROLES[selectedRole];

  return (
    <div className="bg-[#18204c] border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[750px] overflow-hidden">
      {/* Top Bar: Role & Model Controls */}
      <div className="p-4 bg-[#111738] border-b border-slate-800 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Active Agent Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              {selectedRole === 'workforce_architect' && <Building2 className="w-5 h-5" />}
              {selectedRole === 'seo_specialist' && <Zap className="w-5 h-5" />}
              {selectedRole === 'policy_auditor' && <ShieldAlert className="w-5 h-5" />}
              {selectedRole === 'receptionist_trainer' && <PhoneCall className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">
                  {currentRole.title}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#00F3FF]/15 text-[#00F3FF] border border-[#00F3FF]/30">
                  {selectedModel}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {currentRole.shortDesc}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons: Voice Call, Clear, Export */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenLiveVoice && (
              <button
                onClick={onOpenLiveVoice}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00F3FF] to-[#00c8d4] text-[#0b0f26] font-bold text-xs flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Voice (gemini-3.8-live)</span>
              </button>
            )}

            <button
              onClick={handleClearHistory}
              title="Clear conversation history"
              className="p-2 rounded-xl bg-[#18204c] text-slate-400 hover:text-white border border-slate-700 text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleExportHistory}
              title="Export conversation history"
              className="p-2 rounded-xl bg-[#18204c] text-slate-400 hover:text-white border border-slate-700 text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Role & Model Selector Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          {/* Role selector tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Role:</span>
            {(Object.keys(CHAT_ROLES) as ChatRoleKey[]).map((rk) => {
              const role = CHAT_ROLES[rk];
              const isSelected = selectedRole === rk;
              return (
                <button
                  key={rk}
                  onClick={() => handleRoleChange(rk)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all text-xs flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#D4AF37] text-[#0b0f26] font-bold shadow-sm'
                      : 'bg-[#18204c] text-slate-300 hover:text-white border border-slate-700/80'
                  }`}
                >
                  <span>{role.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Model selector pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Model:</span>
            <button
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              title="Fast Tasks (lowest latency)"
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-amber-400 text-[#0b0f26]'
                  : 'bg-[#18204c] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ⚡ Fast (flash-lite)
            </button>
            <button
              onClick={() => setSelectedModel('gemini-3.5-flash')}
              title="General Tasks (default, balanced)"
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                selectedModel === 'gemini-3.5-flash'
                  ? 'bg-[#00F3FF] text-[#0b0f26]'
                  : 'bg-[#18204c] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🎯 General (3.5-flash)
            </button>
            <button
              onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
              title="Particularly Complex Tasks (deep reasoning)"
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                selectedModel === 'gemini-3.1-pro-preview'
                  ? 'bg-purple-400 text-[#0b0f26]'
                  : 'bg-[#18204c] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              🧠 Complex (3.1-pro)
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4 bg-[#0b0f26]/40">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                  isUser
                    ? 'bg-[#00F3FF]/15 border border-[#00F3FF]/30 text-white rounded-tr-none'
                    : 'bg-[#18204c] border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 pb-1 border-b border-slate-800/60">
                  <span className="font-semibold text-slate-300">
                    {isUser ? 'You' : `${currentRole.title}`}
                  </span>
                  <div className="flex items-center gap-2">
                    {m.modelUsed && (
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-700">
                        {m.modelUsed}
                      </span>
                    )}
                    <span>{m.timestamp}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="whitespace-pre-wrap font-sans">{m.content}</div>

                {/* Grounding Source Citations (if Google Search grounding was used) */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-[#00F3FF] flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Google Search Grounding Citations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#111738] hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 hover:text-white transition-colors"
                        >
                          <span className="truncate max-w-[140px]">{s.title || s.uri}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-[#00F3FF]" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-[#00F3FF]/20 border border-[#00F3FF]/40 flex items-center justify-center text-[#00F3FF] flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-[#18204c] border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 rounded-tl-none flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00F3FF] animate-pulse" />
              <span>Generating response with <strong>{selectedModel}</strong>...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Starter Prompts for Active Role */}
      {messages.length <= 4 && (
        <div className="px-4 py-2 bg-[#111738]/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Suggestions:
          </span>
          {currentRole.quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#18204c] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar & Controls */}
      <div className="p-3.5 bg-[#111738] border-t border-slate-800 space-y-2">
        {/* Toggle options: Search Grounding & Custom System Prompt */}
        <div className="flex items-center justify-between text-xs px-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useSearchGrounding}
              onChange={(e) => setUseSearchGrounding(e.target.checked)}
              className="rounded bg-[#18204c] border-slate-700 text-[#00F3FF] focus:ring-0"
            />
            <span
              className={`text-[11px] font-medium flex items-center gap-1 ${
                useSearchGrounding ? 'text-[#00F3FF] font-bold' : 'text-slate-400'
              }`}
            >
              <Globe className="w-3 h-3" />
              Use Google Search Data (Grounding via gemini-3.5-flash)
            </span>
          </label>

          <button
            onClick={() => setIsCustomInstructionOpen((prev) => !prev)}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Custom System Instruction</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                isCustomInstructionOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Collapsible custom instruction input */}
        {isCustomInstructionOpen && (
          <div className="p-2.5 bg-[#18204c] rounded-xl border border-slate-700 space-y-1">
            <span className="text-[10px] text-slate-400 block font-semibold">
              Override System Instruction for this Chatbot:
            </span>
            <textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder={currentRole.systemInstruction}
              rows={2}
              className="w-full bg-[#111738] border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F3FF]"
            />
          </div>
        )}

        {/* Main message input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${currentRole.title} (${selectedModel})...`}
            disabled={isLoading}
            className="flex-1 bg-[#18204c] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F3FF] transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#e4bf47] text-[#0b0f26] font-bold text-xs flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

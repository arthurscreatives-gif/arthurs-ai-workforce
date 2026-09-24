'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  PhoneCall,
  Sparkles,
  Radio,
  Send,
  X,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
  defaultRole?: string;
}

interface TranscriptItem {
  id: string;
  speaker: 'user' | 'model';
  text: string;
  timestamp: string;
}

export function LiveVoiceModal({
  isOpen,
  onClose,
  businessName = "Arthur's Creatives",
  defaultRole = 'AI Phone Receptionist',
}: LiveVoiceModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceName, setVoiceName] = useState<'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir'>('Zephyr');
  const [statusMessage, setStatusMessage] = useState('Ready to connect to gemini-3.8-live');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      id: 'welcome',
      speaker: 'model',
      text: `Hello! I am your AI Phone Receptionist powered by gemini-3.8-live. Speak to me or type a prompt to test live phone handling for ${businessName}.`,
      timestamp: 'Just now',
    },
  ]);
  const [textFallbackInput, setTextFallbackInput] = useState('');
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);

  // Audio nodes and contexts
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const recordedPCMChunksRef = useRef<Int16Array[]>([]);

  // Teardown audio nodes without calling React state setters
  const teardownAudioNodes = useCallback(() => {
    // Stop all playing sources
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // ignore
      }
    });
    activeSourcesRef.current = [];

    // Disconnect processor
    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch {
        // ignore
      }
      scriptProcessorRef.current = null;
    }

    // Stop mic stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close AudioContexts
    if (inputAudioCtxRef.current) {
      try {
        inputAudioCtxRef.current.close();
      } catch {
        // ignore
      }
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      try {
        outputAudioCtxRef.current.close();
      } catch {
        // ignore
      }
      outputAudioCtxRef.current = null;
    }
  }, []);

  // Stop and cleanup all audio contexts and reset state
  const cleanupAudio = useCallback(() => {
    teardownAudioNodes();
    setIsRecording(false);
    setIsConnected(false);
    setVolumeLevel(0);
  }, [teardownAudioNodes]);

  useEffect(() => {
    return () => {
      teardownAudioNodes();
    };
  }, [teardownAudioNodes]);

  // Convert Float32Array to 16-bit PCM little-endian
  const floatTo16BitPCM = (float32Array: Float32Array): Int16Array => {
    const int16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16;
  };

  // Convert Int16Array chunks to base64
  const pcmChunksToBase64 = (chunks: Int16Array[]): string => {
    let totalLength = 0;
    chunks.forEach((c) => (totalLength += c.length));
    const merged = new Int16Array(totalLength);
    let offset = 0;
    chunks.forEach((c) => {
      merged.set(c, offset);
      offset += c.length;
    });

    const uint8 = new Uint8Array(merged.buffer);
    let binary = '';
    const len = uint8.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8[i]);
    }
    return btoa(binary);
  };

  // Play back 24kHz PCM from model turn
  const playModelAudio = (base64Audio: string) => {
    try {
      if (!outputAudioCtxRef.current || outputAudioCtxRef.current.state === 'closed') {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        outputAudioCtxRef.current = new AudioCtx({ sampleRate: 24000 });
      }

      const audioCtx = outputAudioCtxRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const binaryStr = atob(base64Audio);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // Convert 16-bit PCM bytes to Float32 samples
      const int16View = new Int16Array(bytes.buffer);
      const float32Data = new Float32Array(int16View.length);
      for (let i = 0; i < int16View.length; i++) {
        float32Data[i] = int16View[i] / 32768.0;
      }

      const audioBuffer = audioCtx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const sourceNode = audioCtx.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioCtx.destination);

      // Schedule gaplessly
      const currentTime = audioCtx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      sourceNode.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;

      activeSourcesRef.current.push(sourceNode);
      sourceNode.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== sourceNode);
        if (activeSourcesRef.current.length === 0) {
          setStatusMessage('Listening to you...');
        }
      };

      setStatusMessage('Gemini 3.8 Live is speaking...');
    } catch (err) {
      console.error('Audio playback error:', err);
    }
  };

  // Send turn to backend Live API route
  const sendVoiceTurn = async (payload: { audioBase64?: string; text?: string }) => {
    setIsProcessingTurn(true);
    setErrorMessage(null);
    setStatusMessage('Streaming to gemini-3.8-live...');

    try {
      const res = await fetch('/api/ai/live-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          voiceName,
          systemInstruction: `You are the intelligent AI Phone Receptionist for "${businessName}". You speak warmly, concisely, and professionally over the telephone. Assist callers with service questions, booking inquiries, hours, and business directions. Always remain natural and conversational.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Live voice request failed');
      }

      if (data.transcript) {
        setTranscripts((prev) => [
          ...prev,
          {
            id: 'resp-' + Date.now(),
            speaker: 'model',
            text: data.transcript,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }

      if (data.audio) {
        playModelAudio(data.audio);
      } else {
        setStatusMessage('Turn completed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not connect to Live API.');
      setStatusMessage('Error connecting to gemini-3.8-live');
    } finally {
      setIsProcessingTurn(false);
    }
  };

  // Start continuous mic capture
  const handleStartVoiceSession = async () => {
    setErrorMessage(null);
    setStatusMessage('Requesting microphone access...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const source = inputCtx.createMediaStreamSource(stream);
      // Buffer size 4096 = ~256ms of audio at 16kHz
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      scriptProcessorRef.current = processor;

      recordedPCMChunksRef.current = [];

      processor.onaudioprocess = (e) => {
        if (isMuted) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate simple volume meter
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setVolumeLevel(Math.min(100, Math.round(rms * 400)));

        const pcm16 = floatTo16BitPCM(inputData);
        recordedPCMChunksRef.current.push(pcm16);

        // When ~2.5 seconds of audio buffer accumulated, transmit turn to Live API
        if (recordedPCMChunksRef.current.length >= 10) {
          const base64Audio = pcmChunksToBase64(recordedPCMChunksRef.current);
          recordedPCMChunksRef.current = [];
          sendVoiceTurn({ audioBase64: base64Audio });
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

      setIsConnected(true);
      setIsRecording(true);
      setStatusMessage('Connected to gemini-3.8-live. Speak anytime!');
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Microphone permission was denied. You can still test the Live API using the text transmitter below.'
          : 'Could not initialize microphone. Please check your browser audio settings.'
      );
      setIsConnected(false);
    }
  };

  // Stop voice session
  const handleStopVoiceSession = () => {
    cleanupAudio();
    setStatusMessage('Voice session ended.');
  };

  const handleClose = () => {
    cleanupAudio();
    onClose();
  };

  // Interrupt currently playing speech
  const handleInterruptSpeech = () => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // ignore
      }
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setStatusMessage('Interrupted model speech.');
  };

  // Submit text turn through Live API
  const handleSendTextTurn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!textFallbackInput.trim()) return;

    const userText = textFallbackInput.trim();
    setTextFallbackInput('');

    setTranscripts((prev) => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        speaker: 'user',
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    sendVoiceTurn({ text: userText });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#111738] border border-[#00F3FF]/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#18204c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00F3FF]/15 border border-[#00F3FF]/30 flex items-center justify-center text-[#00F3FF]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  Live Voice Conversation
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Bidirectional real-time voice conversation with low-latency Live API audio
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Live Visualizer & Waveform Display */}
        <div className="p-6 bg-[#0b0f26] border-b border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div
            className={`absolute w-72 h-72 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
              isConnected
                ? 'bg-[#00F3FF]/15 opacity-100'
                : 'bg-slate-800/20 opacity-30'
            }`}
          />

          {/* Animated Avatar / Ring */}
          <div className="relative mb-4 z-10">
            <div
              className={`w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                isConnected
                  ? 'border-[#00F3FF] shadow-[0_0_35px_rgba(0,243,255,0.35)] bg-[#18204c]'
                  : 'border-slate-700 bg-slate-900/80'
              }`}
            >
              {isConnected ? (
                <div className="relative flex items-center justify-center">
                  <Mic className="w-10 h-10 text-[#00F3FF]" />
                  {/* Pulsing ring matching volume */}
                  <div
                    className="absolute inset-0 rounded-full border border-[#00F3FF] animate-ping opacity-30"
                    style={{ animationDuration: '2s' }}
                  />
                </div>
              ) : (
                <MicOff className="w-10 h-10 text-slate-500" />
              )}
            </div>

            {/* Voice status pill */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span
                className={`text-[11px] font-bold px-3 py-0.5 rounded-full border shadow-sm ${
                  isConnected
                    ? 'bg-emerald-500 text-[#0b0f26] border-emerald-400'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isConnected ? 'LIVE CALL ACTIVE' : 'CALL STANDBY'}
              </span>
            </div>
          </div>

          {/* Real-time Status Caption */}
          <div className="space-y-1 z-10 mt-2">
            <p className="text-sm font-semibold text-white tracking-wide">
              {statusMessage}
            </p>
            <p className="text-xs text-slate-400">
              Role: <strong>{defaultRole}</strong> &bull; Location:{' '}
              <strong className="text-slate-300">{businessName}</strong>
            </p>
          </div>

          {/* Volume Meter Bar */}
          {isConnected && (
            <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-[#00F3FF] transition-all duration-75"
                style={{ width: `${Math.max(5, volumeLevel)}%` }}
              />
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-3 p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2 max-w-md text-left z-10">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Live Call Control Bar */}
        <div className="p-4 bg-[#18204c] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isConnected ? (
              <button
                onClick={handleStartVoiceSession}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F3FF] to-[#00c8d4] text-[#0b0f26] font-bold text-xs flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                Start Voice Call
              </button>
            ) : (
              <button
                onClick={handleStopVoiceSession}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                End Call
              </button>
            )}

            {isConnected && (
              <>
                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
                    isMuted
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-[#111738] text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? 'Muted' : 'Mute'}</span>
                </button>

                <button
                  onClick={handleInterruptSpeech}
                  className="px-2.5 py-2 rounded-xl bg-[#111738] text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5"
                  title="Interrupt model response"
                >
                  <VolumeX className="w-4 h-4 text-amber-400" />
                  <span>Interrupt</span>
                </button>
              </>
            )}
          </div>

          {/* Voice Persona Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              Voice:
            </span>
            <select
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value as any)}
              disabled={isConnected}
              className="bg-[#111738] text-white border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#00F3FF]"
            >
              <option value="Zephyr">Zephyr (Balanced / Professional)</option>
              <option value="Puck">Puck (Energetic / Crisp)</option>
              <option value="Charon">Charon (Authoritative / Warm)</option>
              <option value="Kore">Kore (Clear / Calm)</option>
              <option value="Fenrir">Fenrir (Deep / Resonant)</option>
            </select>
          </div>
        </div>

        {/* Live Conversation Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#111738]/50 min-h-[160px] max-h-[220px]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
            <span>Live Audio Transcript</span>
            <span>Real-time PCM 24kHz stream</span>
          </div>

          {transcripts.map((t) => (
            <div
              key={t.id}
              className={`flex flex-col ${
                t.speaker === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  t.speaker === 'user'
                    ? 'bg-[#00F3FF]/20 border border-[#00F3FF]/30 text-white rounded-br-none'
                    : 'bg-[#18204c] border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-slate-300">
                    {t.speaker === 'user' ? 'Caller (You)' : 'AI Receptionist (gemini-3.8-live)'}
                  </span>
                  <span>{t.timestamp}</span>
                </div>
                <p>{t.text}</p>
              </div>
            </div>
          ))}

          {isProcessingTurn && (
            <div className="flex items-center gap-2 text-xs text-[#00F3FF] p-2 bg-[#18204c]/60 rounded-lg border border-slate-800">
              <Radio className="w-3.5 h-3.5 animate-spin" />
              <span>Receiving audio chunk from gemini-3.8-live...</span>
            </div>
          )}
        </div>

        {/* Live Text-to-Speech Transmitter (Ensures works even if browser blocks mic permissions) */}
        <div className="p-3 bg-[#18204c] border-t border-slate-800">
          <form onSubmit={handleSendTextTurn} className="flex items-center gap-2">
            <input
              type="text"
              value={textFallbackInput}
              onChange={(e) => setTextFallbackInput(e.target.value)}
              placeholder="Or type a spoken prompt for gemini-3.8-live to answer back..."
              disabled={isProcessingTurn}
              className="flex-1 bg-[#111738] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00F3FF]"
            />
            <button
              type="submit"
              disabled={!textFallbackInput.trim() || isProcessingTurn}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c49f2e] text-[#0b0f26] font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit</span>
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-[#00F3FF]" />
              Model: gemini-3.8-live (Live API) &bull; Output: 24kHz PCM
            </span>
            <span>Microphone Input: 16kHz PCM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

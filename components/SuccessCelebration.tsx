'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export interface CelebrationData {
  id: string;
  title: string;
  subtitle?: string;
  type: 'repair' | 'task';
  timestamp: number;
}

interface SuccessCelebrationProps {
  celebration: CelebrationData | null;
  onDismiss: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'circle' | 'rect' | 'star';
}

const CELEBRATION_COLORS = [
  '#D4AF37', // Brand Gold
  '#10B981', // Google Verified Emerald
  '#00F3FF', // Electric Cyan
  '#34D399', // Mint Green
  '#F59E0B', // Amber
  '#FFFFFF', // Starlight White
];

export function SuccessCelebration({ celebration, onDismiss }: SuccessCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const celebrationTimestamp = celebration?.timestamp;

  useEffect(() => {
    if (!celebrationTimestamp) return;

    // Auto-dismiss after 4.5 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);

    // Check for user's motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return () => clearTimeout(timer);
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return () => clearTimeout(timer);
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return () => clearTimeout(timer);
    }

    // Set canvas dimensions
    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Spawn 55 subtle confetti / sparkle particles centered from top banner
    const particleCount = 55;
    const particles: Particle[] = [];

    const originX = width / 2;
    const originY = 80;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI / 6) + Math.random() * ((Math.PI * 2) / 3); // Spray gently downwards
      const speed = 2 + Math.random() * 5.5;
      const spreadX = (Math.random() - 0.5) * 220;

      particles.push({
        x: originX + spreadX,
        y: originY + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1) * 0.7,
        vy: Math.sin(angle) * speed * 0.8 + 1.2,
        size: 3.5 + Math.random() * 4.5,
        color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        opacity: 1,
        shape: Math.random() > 0.6 ? 'circle' : Math.random() > 0.3 ? 'rect' : 'star',
      });
    }

    let startTime = performance.now();
    const duration = 2800; // 2.8 seconds

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      const progress = elapsed / duration;
      const globalFade = Math.max(0, 1 - progress);

      let activeParticles = 0;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.045; // Gentle gravity
        p.vx *= 0.99; // Air resistance
        p.rotation += p.rotationSpeed;
        p.opacity = globalFade;

        if (p.opacity > 0.01 && p.y < height) {
          activeParticles++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.7);
          } else {
            // Star/Diamond
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size * 0.4, -p.size * 0.3);
            ctx.lineTo(p.size, 0);
            ctx.lineTo(p.size * 0.4, p.size * 0.3);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size * 0.4, p.size * 0.3);
            ctx.lineTo(-p.size, 0);
            ctx.lineTo(-p.size * 0.4, -p.size * 0.3);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        }
      }

      if (elapsed < duration && activeParticles > 0) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      clearTimeout(timer);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [celebrationTimestamp, onDismiss]);

  if (!celebration) return null;

  return (
    <>
      {/* Subtle Micro-Confetti & Sparkle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Floating Glowing Pulse Toast */}
      <div
        role="status"
        aria-live="polite"
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform opacity-100 translate-y-0 scale-100"
      >
        <div className="relative group">
          {/* Animated Glowing Pulse Aura */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-[#00F3FF] to-[#D4AF37] opacity-60 blur-md animate-pulse" />

          {/* Toast Container */}
          <div className="relative flex items-center gap-3.5 bg-[#0b0f26]/95 border border-emerald-400/60 text-white px-5 py-3.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-md max-w-md md:max-w-lg min-w-[320px]">
            {/* Pulsing Icon */}
            <div className="relative flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/60 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>

            {/* Message Body */}
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wide text-white uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00F3FF]" />
                  {celebration?.title || 'Verified with Google'}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug line-clamp-2">
                {celebration?.subtitle ||
                  'The update has been safely executed and confirmed live on your Google Business Profile.'}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={onDismiss}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>

            {/* 4.5-Second Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-slate-800 rounded-b-2xl overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 via-[#00F3FF] to-[#D4AF37] animate-[pulse_2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

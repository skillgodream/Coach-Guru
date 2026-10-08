import React, { useState } from 'react';
import { ChevronLeft, ArrowRight, BookOpen, Play, Bookmark, FileText } from 'lucide-react';
import { Lesson } from '../types';
import { sounds } from '../utils/audio';

interface LessonOverviewProps {
  lesson: Lesson;
  onBack: () => void;
  onOpenIntroDeck: () => void;
  onStartSimulation: (phase: number) => void;
  onAskTrainer?: () => void;
}

export default function LessonOverview({
  lesson,
  onBack,
  onOpenIntroDeck,
  onStartSimulation,
  onAskTrainer,
}: LessonOverviewProps) {
  const [bookmarked, setBookmarked] = useState(false);

  const learningPath = [
    {
      id: 'know-it',
      title: 'Know It',
      modeTag: 'TEACHING FORMAT',
      desc: 'Explain the SOP & process in simple presentation format',
      duration: '2 min',
      // High-end Apple light-glass translucent card with blue highlight border
      bgColor: 'bg-white/35 border-white/50 hover:border-blue-400/40 shadow-[0_12px_32px_0_rgba(31,38,135,0.05)]',
      iconBg: 'bg-[#2563EB]',
      pillTextColor: 'text-[#2563EB]',
      arrowColor: 'text-indigo-600',
      icon: BookOpen,
      action: () => onOpenIntroDeck(),
      illustration: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <path d="M15 25 Q35 15 50 25 Q65 15 85 25 L85 75 Q65 65 50 75 Q35 65 15 75 Z" fill="#2563EB" fillOpacity="0.8" />
          <path d="M18 27 Q35 18 50 27 Q65 18 82 27 L82 72 Q65 63 50 72 Q35 63 18 72 Z" fill="#FFFFFF" />
          <path d="M50 27 L50 72" stroke="#2563EB" strokeWidth="2.0" />
          <path d="M24 38 H44" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 48 H44" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 58 H40" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 38 H76" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 48 H76" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M56 58 H72" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'show-me',
      title: 'Show Me',
      modeTag: 'DEMONSTRATION',
      desc: 'Watch Coach demonstrate the actual SOP steps',
      duration: '3 min',
      // Translucent purple highlight card
      bgColor: 'bg-white/35 border-white/50 hover:border-purple-400/40 shadow-[0_12px_32px_0_rgba(31,38,135,0.05)]',
      iconBg: 'bg-[#7C3AED]',
      pillTextColor: 'text-[#7C3AED]',
      arrowColor: 'text-purple-600',
      icon: Play,
      action: () => onStartSimulation(0),
      illustration: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <rect x="25" y="35" width="40" height="30" rx="8" fill="#7C3AED" fillOpacity="0.8" />
          <circle cx="35" cy="25" r="12" fill="#7C3AED" fillOpacity="0.8" />
          <circle cx="55" cy="25" r="12" fill="#7C3AED" fillOpacity="0.8" />
          <path d="M65 42 L82 32 L82 68 L65 58 Z" fill="#6D28D9" />
          <circle cx="45" cy="50" r="4" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 'guide-me',
      title: 'Guide Me',
      modeTag: 'GUIDED PRACTICE',
      desc: 'Perform the SOP with step-by-step coach hints',
      duration: '5 min',
      // Translucent emerald highlight card
      bgColor: 'bg-white/35 border-white/50 hover:border-emerald-400/40 shadow-[0_12px_32px_0_rgba(31,38,135,0.05)]',
      iconBg: 'bg-[#10B981]',
      pillTextColor: 'text-[#10B981]',
      arrowColor: 'text-emerald-600',
      icon: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
          <path d="M12 2a1 1 0 0 0-1 1v12.5a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1zM7 7a1 1 0 0 0-1 1v6.5a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zM17 9a1 1 0 0 0-1 1v4.5a1 1 0 0 0 2 0V10a1 1 0 0 0-1-1zM12 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
        </svg>
      ),
      action: () => onStartSimulation(1),
      illustration: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <rect x="25" y="45" width="50" height="38" rx="6" fill="#10B981" fillOpacity="0.8" />
          <rect x="20" y="40" width="60" height="5" rx="2.5" fill="#059669" />
          <rect x="35" y="25" width="10" height="15" fill="#FFFFFF" />
          <rect x="55" y="25" width="10" height="15" fill="#FFFFFF" />
          <circle cx="35" cy="86" r="8" fill="#374151" />
          <circle cx="65" cy="86" r="8" fill="#374151" />
        </svg>
      )
    },
    {
      id: 'test-me',
      title: 'Test Me',
      modeTag: 'ASSESSMENT',
      desc: 'Assess whether you can perform the SOP without hints',
      duration: '3 min',
      // Translucent orange highlight card
      bgColor: 'bg-white/35 border-white/50 hover:border-orange-400/40 shadow-[0_12px_32px_0_rgba(31,38,135,0.05)]',
      iconBg: 'bg-[#F97316]',
      pillTextColor: 'text-[#F97316]',
      arrowColor: 'text-orange-600',
      icon: FileText,
      action: () => onStartSimulation(2),
      illustration: (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <rect x="28" y="20" width="44" height="64" rx="6" fill="#F97316" fillOpacity="0.8" />
          <rect x="34" y="28" width="32" height="48" rx="3" fill="#FFFFFF" />
          <rect x="42" y="14" width="16" height="8" rx="2" fill="#D97706" />
          <path d="M38 40 L43 45 L54 35" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M38 54 L43 59 L54 49" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="74" y="32" width="6" height="40" rx="3" fill="#3B82F6" transform="rotate(15 74 32)" />
        </svg>
      )
    },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-[#E0F2FE] flex flex-col overflow-y-auto animate-in fade-in duration-200 p-6 sm:p-8 font-sans">
      
      {/* 1. Fluid Pastel Holographic Backdrop Zones (No Apple logo, pure premium gradient mesh matching screenshot) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#E0F2FE]">
        {/* Soft Lavender top-left */}
        <div className="absolute top-[-10%] left-[-10%] w-[85%] h-[60%] rounded-full bg-[#C7D2FE] filter blur-[70px] opacity-90" />
        
        {/* Pastel Purple top-right */}
        <div className="absolute top-[-5%] right-[-10%] w-[80%] h-[55%] rounded-full bg-[#D8B4FE] filter blur-[80px] opacity-85" />
        
        {/* Soft Mint/Cyan middle-left */}
        <div className="absolute top-[40%] left-[-20%] w-[65%] h-[50%] rounded-full bg-[#A5F3FC] filter blur-[70px] opacity-90" />
        
        {/* Light Pink/Peach bottom */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[55%] rounded-full bg-[#FFD3C4] filter blur-[85px] opacity-95" />
        
        {/* Ultra-soft white overlay for fluid translucent look */}
        <div className="absolute inset-0 bg-white/25 backdrop-blur-[3px]" />
      </div>

      <div className="relative w-full flex flex-col z-10 max-w-md mx-auto">
        
        {/* 2. Header Navigation Bar */}
        <div className="flex justify-between items-center w-full relative z-10">
          <button
            onClick={() => {
              sounds.playTap();
              onBack();
            }}
            className="w-10 h-10 rounded-full border border-white/50 bg-white/40 flex items-center justify-center text-slate-800 shadow-xs hover:bg-white/60 active:scale-95 transition-all cursor-pointer"
            aria-label="Back"
          >
            <ChevronLeft size={20} className="stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2">
            {onAskTrainer && (
              <button
                onClick={() => {
                  sounds.playTap();
                  onAskTrainer();
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/40 border border-white/50 text-xs font-bold text-slate-800 hover:bg-white/60 transition-all shadow-2xs cursor-pointer"
              >
                Ask Trainer
              </button>
            )}
            <button
              onClick={() => {
                sounds.playTap();
                setBookmarked(!bookmarked);
              }}
              className={`w-10 h-10 rounded-full border flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer ${
                bookmarked ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white/40 border-white/50 text-slate-800 hover:bg-white/60'
              }`}
              aria-label="Bookmark"
            >
              <Bookmark size={18} className={bookmarked ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {/* 3. Hero Header Section: Perfectly aligned grid layout with no overlaps */}
        <div className="flex items-center justify-between gap-4 pt-8 pb-6 border-b border-black/5 relative z-10">
          <div className="flex-1 space-y-2">
            {/* Steps Count Badge - Sleek blue text with book open icon */}
            <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold text-xs uppercase tracking-wider">
              <BookOpen size={14} className="stroke-[2.5]" />
              <span>{lesson.stepsCount} verified steps</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0C111E] tracking-tight leading-tight">
              {lesson.title}
            </h1>

            <p className="text-slate-600 font-semibold text-xs sm:text-sm leading-relaxed max-w-xs">
              {lesson.description || 'Ensure a safe, welcoming environment for every guest.'}
            </p>
          </div>

          {/* Right-side Koala Coach circular profile - contained, properly scaled */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/40 border border-white/60 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
            <img
              src="/Coachguru.png"
              alt="Guruji Koala Coach"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transform translate-y-2.5 scale-110 drop-shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/guruji 1.png";
              }}
            />
          </div>
        </div>

        {/* 4. Interactive 2x2 Format Options Grid (Apple light glass translucent cards) */}
        <div className="grid grid-cols-2 gap-4 pt-6 mt-2 relative z-10">
          {learningPath.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playTap();
                  item.action();
                }}
                className={`relative overflow-hidden h-[180px] rounded-3xl backdrop-blur-xl border ${item.bgColor} p-5 flex flex-col justify-between items-start text-left active:scale-[0.98] transition-all duration-300 cursor-pointer group`}
              >
                {/* Top Row: Mini Icon + White/Glass Circle Chevron Arrow */}
                <div className="flex justify-between items-center w-full">
                  <div className={`w-9 h-9 rounded-xl ${item.iconBg} text-white flex items-center justify-center shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/80 border border-white/60 flex items-center justify-center shadow-2xs group-hover:bg-white text-slate-800 transition-all duration-200">
                    <ArrowRight size={12} className="stroke-[2.5]" />
                  </div>
                </div>

                {/* Bottom Row: Text & Pill Badge */}
                <div className="mt-auto relative z-10">
                  <span className="text-base font-extrabold text-[#0C111E] block leading-tight">
                    {item.title}
                  </span>
                  <span className={`inline-block px-2.5 py-0.5 bg-white/80 border border-white/50 rounded-full text-[10px] font-bold tracking-wide mt-2 shadow-2xs ${item.pillTextColor}`}>
                    {item.duration}
                  </span>
                </div>

                {/* Custom Gorgeous 3D-Style Vector Illustration at the bottom-right corner */}
                <div className="absolute bottom-1.5 right-1.5 w-18 h-18 pointer-events-none opacity-80 group-hover:scale-110 group-hover:rotate-2 transition-all duration-300">
                  {item.illustration}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

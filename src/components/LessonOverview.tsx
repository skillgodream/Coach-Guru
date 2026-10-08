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

  // Dynamic color configuration based on lesson color scheme
  const getThemeColors = () => {
    switch (lesson.color) {
      case 'mint':
        return {
          bgClass: 'bg-[#ECFDF5]',
          blob1: 'bg-[#A7F3D0]',
          blob2: 'bg-[#6EE7B7]',
          blob3: 'bg-[#C6F6D5]',
          blob4: 'bg-[#A5F3FC]',
          textAccent: 'text-emerald-600',
          borderAccent: 'border-emerald-500/20',
          accentGradient: 'from-emerald-500/10 to-teal-500/10',
          primaryAccent: '#10B981',
        };
      case 'peach':
        return {
          bgClass: 'bg-[#FFF7ED]',
          blob1: 'bg-[#FFEDD5]',
          blob2: 'bg-[#FDBA74]',
          blob3: 'bg-[#FECACA]',
          blob4: 'bg-[#FED7AA]',
          textAccent: 'text-orange-600',
          borderAccent: 'border-orange-500/20',
          accentGradient: 'from-orange-500/10 to-amber-500/10',
          primaryAccent: '#F97316',
        };
      case 'lilac':
        return {
          bgClass: 'bg-[#F5F3FF]',
          blob1: 'bg-[#DDD6FE]',
          blob2: 'bg-[#C4B5FD]',
          blob3: 'bg-[#F5D0FE]',
          blob4: 'bg-[#E9D5FF]',
          textAccent: 'text-purple-600',
          borderAccent: 'border-purple-500/20',
          accentGradient: 'from-purple-500/10 to-indigo-500/10',
          primaryAccent: '#7C3AED',
        };
      case 'sky':
      default:
        return {
          bgClass: 'bg-[#E0F2FE]',
          blob1: 'bg-[#C7D2FE]',
          blob2: 'bg-[#D8B4FE]',
          blob3: 'bg-[#A5F3FC]',
          blob4: 'bg-[#FFD3C4]',
          textAccent: 'text-indigo-600',
          borderAccent: 'border-indigo-500/20',
          accentGradient: 'from-indigo-500/10 to-blue-500/10',
          primaryAccent: '#2563EB',
        };
    }
  };

  const themeColors = getThemeColors();

  const getGuideMeIllustration = (artType: string) => {
    switch (artType) {
      case 'tote':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="88" rx="32" ry="7" fill="#1E293B" fillOpacity="0.15" />
            <path d="M22 35 L28 80 C29 83 32 85 36 85 L64 85 C68 85 71 83 72 80 L78 35 Z" fill="#3B82F6" fillOpacity="0.8" />
            <rect x="16" y="26" width="68" height="10" rx="5" fill="#2563EB" />
            <rect x="38" y="55" width="24" height="15" rx="3" fill="#FFFFFF" />
            <rect x="42" y="58" width="2" height="9" fill="#0F172A" />
            <rect x="46" y="58" width="2" height="9" fill="#0F172A" />
            <rect x="50" y="58" width="3" height="9" fill="#0F172A" />
            <rect x="55" y="58" width="1" height="9" fill="#0F172A" />
            <rect x="58" y="58" width="2" height="9" fill="#0F172A" />
          </svg>
        );
      case 'safety':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="90" rx="32" ry="7" fill="#1E293B" fillOpacity="0.15" />
            <rect x="22" y="78" width="56" height="10" rx="4" fill="#1E293B" />
            <path d="M45 15 L26 78 L74 78 L55 15 Z" fill="#FB923C" fillOpacity="0.8" />
            <path d="M40 34 L34 52 L66 52 L60 34 Z" fill="#F8FAFC" />
            <path d="M31 60 L28 72 L72 72 L69 60 Z" fill="#F8FAFC" />
          </svg>
        );
      case 'box':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="88" rx="30" ry="7" fill="#1E293B" fillOpacity="0.15" />
            <rect x="22" y="38" width="56" height="44" rx="8" fill="#D97706" fillOpacity="0.8" />
            <path d="M22 43 L50 22 L78 43 L50 52 Z" fill="#F59E0B" />
            <rect x="46" y="24" width="8" height="60" rx="2" fill="#78350F" fillOpacity="0.25" />
          </svg>
        );
      case 'clipboard':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
            <ellipse cx="50" cy="88" rx="28" ry="6" fill="#1E293B" fillOpacity="0.12" />
            <rect x="24" y="20" width="52" height="64" rx="10" fill="#7C3AED" fillOpacity="0.8" />
            <rect x="29" y="27" width="42" height="51" rx="6" fill="#FFFFFF" />
            <rect x="34" y="36" width="6" height="6" rx="2" fill="#10B981" />
            <path d="M35 39 L37 41 L41 37" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="44" y="38" width="22" height="3" rx="1" fill="#E2E8F0" />
            <rect x="34" y="47" width="6" height="6" rx="2" fill="#10B981" />
            <path d="M35 50 L37 52 L41 48" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="44" y="49" width="20" height="3" rx="1" fill="#E2E8F0" />
            <rect x="40" y="14" width="20" height="10" rx="4" fill="#E2E8F0" />
          </svg>
        );
      case 'trolley':
      default:
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
            <rect x="25" y="45" width="50" height="38" rx="6" fill="#10B981" fillOpacity="0.8" />
            <rect x="20" y="40" width="60" height="5" rx="2.5" fill="#059669" />
            <rect x="35" y="25" width="10" height="15" fill="#FFFFFF" />
            <rect x="55" y="25" width="10" height="15" fill="#FFFFFF" />
            <circle cx="35" cy="86" r="8" fill="#374151" />
            <circle cx="65" cy="86" r="8" fill="#374151" />
          </svg>
        );
    }
  };

  const learningPath = [
    {
      id: 'know-it',
      title: 'Know It',
      modeTag: 'TEACHING FORMAT',
      desc: 'Explain the SOP & process in simple presentation format',
      duration: '2 min',
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
      illustration: getGuideMeIllustration(lesson.artType || 'clipboard')
    },
    {
      id: 'test-me',
      title: 'Test Me',
      modeTag: 'ASSESSMENT',
      desc: 'Assess whether you can perform the SOP without hints',
      duration: '3 min',
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
    <div className={`fixed inset-0 z-40 ${themeColors.bgClass} flex flex-col overflow-y-auto animate-in fade-in duration-200 p-6 sm:p-8 font-sans`}>
      
      {/* 1. Fluid Pastel Holographic Backdrop Zones (No Apple logo, pure premium gradient mesh matching screenshot) */}
      <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${themeColors.bgClass}`}>
        {/* Soft Left-Top blob */}
        <div className={`absolute top-[-10%] left-[-10%] w-[85%] h-[60%] rounded-full ${themeColors.blob1} filter blur-[70px] opacity-90`} />
        
        {/* Pastel Right-Top blob */}
        <div className={`absolute top-[-5%] right-[-10%] w-[80%] h-[55%] rounded-full ${themeColors.blob2} filter blur-[80px] opacity-85`} />
        
        {/* Soft Mid-Left blob */}
        <div className={`absolute top-[40%] left-[-20%] w-[65%] h-[50%] rounded-full ${themeColors.blob3} filter blur-[70px] opacity-90`} />
        
        {/* Light Bottom blob */}
        <div className={`absolute bottom-[-10%] right-[-10%] w-[80%] h-[55%] rounded-full ${themeColors.blob4} filter blur-[85px] opacity-95`} />
        
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
              className="w-10 h-10 rounded-full border flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer hover:bg-white/60"
              style={{
                backgroundColor: bookmarked ? themeColors.primaryAccent : 'rgba(255, 255, 255, 0.4)',
                borderColor: bookmarked ? themeColors.primaryAccent : 'rgba(255, 255, 255, 0.5)',
                color: bookmarked ? '#FFFFFF' : '#1E293B',
              }}
              aria-label="Bookmark"
            >
              <Bookmark size={18} className={bookmarked ? 'fill-current' : ''} />
            </button>
          </div>
        </div>

        {/* 3. Hero Header Section: Perfectly aligned grid layout with no overlaps */}
        <div className="flex items-center justify-between gap-4 pt-8 pb-6 border-b border-black/5 relative z-10">
          <div className="flex-1 space-y-2">
            {/* Steps Count Badge - Dynamic theme text color with book open icon */}
            <div className={`flex items-center gap-1.5 ${themeColors.textAccent} font-extrabold text-xs uppercase tracking-wider`}>
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

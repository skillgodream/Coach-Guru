import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { AppleVisionBackground } from '../components/AppleVisionBackground';
import gurujiImg from '../Artist/Cheerful SNAP IT Warehouse Koala.png';

interface MeetGurujiScreenProps {
  onContinue: () => void;
}

export const MeetGurujiScreen: React.FC<MeetGurujiScreenProps> = ({ onContinue }) => {
  return (
    <AppleVisionBackground showHaloRing={true} className="min-h-[820px]">
      {/* Top Dynamic Island Pill: Workplace Intelligence */}
      <div className="flex justify-center pt-5 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981] shadow-[0_0_8px_#10b981]" />
          </span>
          <span className="text-[12px] font-medium tracking-tight text-slate-700">
            Workplace Intelligence
          </span>
        </div>
      </div>

      {/* 3. Center Hero Character with Golden Halo */}
      <div className="relative my-auto flex flex-col items-center justify-center pt-2 pb-0">
        {/* Luminous Specular Ring surrounding character */}
        <div className="absolute w-72 h-72 rounded-full border-2 border-white/80 shadow-[0_0_50px_rgba(251,191,36,0.3),0_0_90px_rgba(168,85,247,0.2)] pointer-events-none" />

        {/* 3D Fluffy Koala Avatar with Glasses & Lab Coat */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
          className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center -mb-8 overflow-visible"
        >
          <img
            src={gurujiImg || "/guruji 1.png"}
            alt="Guruji Coach"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.18)]"
          />
        </motion.div>
      </div>

      {/* 4. Frosted Glass Pedestal Mound & Information Card */}
      <div className="relative z-20 w-full rounded-t-[46px] bg-white/75 backdrop-blur-2xl border-t border-x border-white/90 shadow-[0_-20px_50px_rgba(99,102,241,0.08),0_10px_30px_rgba(0,0,0,0.03)] px-6 pt-7 pb-4 flex flex-col items-center text-center">
        {/* MEET Kicker */}
        <span className="text-[11px] font-bold text-slate-400 tracking-[0.25em] uppercase mb-1">
          MEET
        </span>

        {/* Guruji Title with Deep Navy to Violet Apple Gradient */}
        <h1 className="text-[44px] font-black tracking-tight leading-none mb-3 bg-gradient-to-r from-[#0f172a] via-[#3730a3] to-[#7c3aed] bg-clip-text text-transparent">
          Guruji
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] text-slate-500 font-normal leading-relaxed max-w-[270px] mb-5">
          Your autonomous frontline coach for high-stakes operational decisions.
        </p>

        {/* Pagination Dots (Active purple pill + 2 inactive dots) */}
        <div className="flex items-center gap-1.5 mb-6">
          <div className="w-5 h-1.5 rounded-full bg-[#6366f1]" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* 5. Bottom Dark Glass Pill Button: Tap to explore -> */}
        <motion.div
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={onContinue}
          className="w-full max-w-[340px] h-[58px] p-1.5 pl-6 rounded-full bg-gradient-to-r from-[#101226] via-[#1a1b38] to-[#251f47] border border-indigo-400/30 shadow-[0_14px_30px_rgba(20,18,48,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-between cursor-pointer group transition-all duration-300"
        >
          <span className="text-white font-medium text-[15px] tracking-tight flex items-center gap-1.5">
            Tap to explore →
          </span>
          <div className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#4f46e5] shadow-md group-hover:bg-white group-hover:scale-105 transition-all">
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </motion.div>

        {/* iOS Home Indicator */}
        <div className="w-32 h-1 bg-slate-900/20 rounded-full mx-auto mt-4 mb-1" />
      </div>
    </AppleVisionBackground>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, TrendingUp, Star } from 'lucide-react';
import gurujiImg from '../Artist/guruji 1.png';

interface MeetGurujiScreenProps {
  onContinue: () => void;
}

export const MeetGurujiScreen: React.FC<MeetGurujiScreenProps> = ({ onContinue }) => {
  return (
    <div 
      className="relative w-full min-h-[100dvh] sm:min-h-[780px] bg-[#070A14] text-white overflow-hidden flex flex-col justify-between p-4 sm:p-6 selection:bg-indigo-500 selection:text-white"
      onClick={onContinue}
    >
      {/* 1. Premium Blurred Background Image with Vignette & Glowing Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* High-res harbor / city dusk background heavily blurred */}
        <img
          src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80"
          alt="Premium Background"
          className="w-full h-full object-cover filter blur-3xl scale-125 opacity-30 brightness-75"
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1E]/95 via-[#080B17]/85 to-[#04060E]/98" />
        
        {/* Luminous Ambient Light Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/20 blur-[110px]" />
        <div className="absolute top-1/3 right-4 w-72 h-72 rounded-full bg-amber-500/15 blur-[95px]" />
        <div className="absolute bottom-1/4 left-4 w-80 h-80 rounded-full bg-purple-600/15 blur-[100px]" />
      </div>



      {/* 3. Center Hero Koala Coach Visual (30% Bigger, Clean without Script Text) */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-2 shrink-0">
        <div className="relative w-76 h-76 sm:w-92 sm:h-92 flex items-center justify-center">
          {/* Glowing Shield / Teardrop Organic Contour Badge */}
          <div className="absolute inset-0 rounded-[56px] bg-gradient-to-br from-indigo-500/20 via-blue-600/10 to-purple-600/20 border border-indigo-400/30 shadow-[0_0_70px_rgba(79,70,229,0.35)] backdrop-blur-sm transform rotate-[-2deg]" />
          
          {/* 3D Koala Coach Avatar (30% Bigger) */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
            className="relative z-10 w-full h-full flex items-center justify-center p-1 scale-110"
          >
            <img
              src="/Coachguru.png"
              alt="Guruji Koala Coach"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = gurujiImg || "/guruji 1.png";
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* 4. Bottom Content Block: Welcome Text, Value Grid & CTA */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center space-y-3 sm:space-y-4 pb-2 shrink-0">
        {/* Headline & Subtitle */}
        <div className="space-y-0.5">
          <span className="text-lg sm:text-xl font-light text-slate-200 tracking-tight block">
            Welcome to
          </span>
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent tracking-tight leading-none drop-shadow-sm">
            Guruji
          </h1>
          <p className="text-xs text-slate-300/80 font-normal leading-relaxed max-w-[280px] sm:max-w-[310px] mx-auto pt-0.5">
            Your autonomous frontline coach for high-stakes operational decisions.
          </p>
        </div>

        {/* 5. 4 Value Proposition Feature Columns Grid (Smaller Icons & Short Concise Text) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 w-full pt-1">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/8 border border-white/12 backdrop-blur-md flex items-center justify-center text-sky-400 shadow-inner">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              Learn
            </span>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/8 border border-white/12 backdrop-blur-md flex items-center justify-center text-indigo-400 shadow-inner">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              Guidance
            </span>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/8 border border-white/12 backdrop-blur-md flex items-center justify-center text-violet-400 shadow-inner">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              Confidence
            </span>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/8 border border-white/12 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-inner">
              <Star className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 leading-tight">
              Growth
            </span>
          </div>
        </div>

        {/* 6. Primary CTA Button: Tap to explore -> */}
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={(e) => {
            e.stopPropagation();
            onContinue();
          }}
          className="w-full h-13 sm:h-14 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white font-semibold text-base sm:text-lg shadow-[0_12px_35px_rgba(79,70,229,0.45)] border border-white/20 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <span>Tap to explore</span>
          <span className="text-xl">→</span>
        </motion.button>

        {/* 7. Carousel Indicator Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <div className="w-6 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
        </div>
      </div>
    </div>
  );
};


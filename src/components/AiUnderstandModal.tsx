import React, { useEffect, useState } from 'react';
import { Eye, Brain, Sparkles, Check, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface AiUnderstandModalProps {
  sopTitle: string;
  isOpen: boolean;
  onComplete: () => void;
}

export default function AiUnderstandModal({ sopTitle, isOpen, onComplete }: AiUnderstandModalProps) {
  const [phase, setPhase] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setPhase(0);
      return;
    }

    // Step 1: Observe (0 to 600ms)
    const t1 = setTimeout(() => {
      setPhase(1);
    }, 600);

    // Step 2: Understand (600 to 1200ms)
    const t2 = setTimeout(() => {
      setPhase(2);
      sounds.playCorrect();
    }, 1200);

    // Auto complete after 1800ms
    const t3 = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0E1116]/75 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-2xl flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Animated AI Core Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1773E2] to-[#7A5AF8] text-white flex items-center justify-center shadow-lg shadow-blue-500/25 relative">
          {phase === 0 && <Eye size={36} className="animate-pulse" />}
          {phase === 1 && <Brain size={36} className="animate-bounce" />}
          {phase === 2 && <Sparkles size={36} />}
        </div>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#2F6FED] bg-[#DCEBFF] px-3 py-1 rounded-full">
            AI Engine · Processing
          </span>
          <h2 className="text-xl font-bold text-[#0E1116] mt-2 leading-snug">
            {sopTitle}
          </h2>
        </div>

        {/* 3 Step Sequence: Observe -> Understand -> Created 4 Modes */}
        <div className="w-full space-y-2.5 text-left">
          {/* Step 1: Observe */}
          <div
            className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
              phase >= 0
                ? 'bg-[#DDF3E6] border-[#1FA55E]/40 text-[#14532D]'
                : 'bg-[#F7F7F5] border-[#E6E8EC] text-[#66726B]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                phase >= 1 ? 'bg-[#1FA55E] text-white' : 'bg-emerald-200 text-emerald-800'
              }`}
            >
              {phase >= 1 ? <Check size={14} /> : '1'}
            </div>
            <div>
              <span className="text-xs font-bold block">1. Observe SOP</span>
              <span className="text-[10px] font-semibold opacity-85 block">Extracting process checkpoints</span>
            </div>
          </div>

          {/* Step 2: Understand */}
          <div
            className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
              phase >= 1
                ? 'bg-[#DCEBFF] border-[#2F6FED]/40 text-[#1E3A8A]'
                : 'bg-[#F7F7F5] border-[#E6E8EC] text-[#66726B]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                phase >= 2 ? 'bg-[#2F6FED] text-white' : 'bg-blue-200 text-blue-800'
              }`}
            >
              {phase >= 2 ? <Check size={14} /> : '2'}
            </div>
            <div>
              <span className="text-xs font-bold block">2. Understand Workflow</span>
              <span className="text-[10px] font-semibold opacity-85 block">Mapping decisions & exception handling</span>
            </div>
          </div>

          {/* Step 3: 4 Learning Modes */}
          <div
            className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
              phase >= 2
                ? 'bg-[#FFF2C9] border-[#F27A1A]/40 text-[#854D0E]'
                : 'bg-[#F7F7F5] border-[#E6E8EC] text-[#66726B]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                phase >= 2 ? 'bg-[#F27A1A] text-white' : 'bg-amber-200 text-amber-800'
              }`}
            >
              3
            </div>
            <div>
              <span className="text-xs font-bold block">3. Ready: 4 Learning Modes</span>
              <span className="text-[10px] font-semibold opacity-85 block">Know It · Show Me · Guide Me · Test Me</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playTap();
            onComplete();
          }}
          className="w-full h-12 rounded-full bg-[#0E1116] hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          View Learning Modes <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

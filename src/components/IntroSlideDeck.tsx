import React, { useState } from 'react';
import { X, Volume2, ArrowRight, ArrowLeft, Check, AlertCircle, HelpCircle, UserCheck } from 'lucide-react';
import ClayArt from './ClayArt';
import ToolDetailModal from './ToolDetailModal';
import { WAREHOUSE_TOOLS, STEP_JOURNEY } from '../data/lessonsData';
import { ToolItem } from '../types';
import { sounds } from '../utils/audio';

interface IntroSlideDeckProps {
  onClose: () => void;
  onStartSimulation: () => void;
  onAskTrainer?: () => void;
}

export default function IntroSlideDeck({ onClose, onStartSimulation, onAskTrainer }: IntroSlideDeckProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  const totalSlides = 8;

  const handleNext = () => {
    sounds.playTap();
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onStartSimulation();
    }
  };

  const handlePrev = () => {
    sounds.playTap();
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleAudioSpeak = (text: string) => {
    sounds.playTap();
    sounds.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F7F5] flex flex-col overflow-hidden">
      {/* Top App Header with Slide Progress and Ask Trainer */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between border-b border-[#E6E8EC] bg-white/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-[#F7F7F5] border border-[#E6E8EC] flex items-center justify-center text-[#0E1116] hover:bg-[#E6E8EC] active:scale-95 transition-all"
            aria-label="Exit Intro"
          >
            <X size={20} />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D4652]">KNOW IT</span>
            <div className="text-xs font-bold text-[#0E1116]">
              Slide {currentSlide + 1} of {totalSlides}
            </div>
          </div>
        </div>

        {/* Slide Dots & Ask Trainer */}
        <div className="flex items-center gap-3">
          {onAskTrainer && (
            <button
              onClick={() => {
                sounds.playTap();
                onAskTrainer();
              }}
              className="text-[10px] font-bold text-[#14532D] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1"
            >
              <UserCheck size={12} className="text-emerald-600" />
              <span>Trainer</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-5 bg-[#0E1116]' : 'w-2 bg-[#E6E8EC]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Slide Content: Split Screen (Art top 45-50%, White Sheet below) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* SLIDE 1: What is Picking? */}
        {currentSlide === 0 && (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            {/* Top 45% Sky Field with Clay Art */}
            <div className="h-[44%] bg-[#DCEBFF] relative flex items-center justify-center p-6">
              <button
                onClick={() =>
                  handleAudioSpeak(
                    'What is Picking? Picking is collecting items for customer orders. Order received goes to picking, then packing, then dispatch.'
                  )
                }
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#0E1116] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                aria-label="Listen"
              >
                <Volume2 size={22} />
              </button>
              <div className="w-36 h-36 rounded-full bg-white/40 absolute" />
              <ClayArt type="tote" size={135} />
            </div>

            {/* White Sheet Below */}
            <div className="flex-1 bg-white rounded-t-[32px] -mt-6 p-6 shadow-[0_8px_24px_rgba(16,24,40,.08)] flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#2F6FED] bg-[#DCEBFF] px-3 py-1 rounded-full mb-2">
                  Module 1 · Foundation
                </span>
                <h1 className="text-3xl font-bold text-[#0E1116] leading-tight mb-2">
                  What is Picking?
                </h1>
                <p className="text-lg font-semibold text-[#3D4652] leading-relaxed mb-4">
                  Picking means collecting exact customer order items from warehouse storage locations.
                </p>

                {/* Workflow Chip */}
                <div className="p-3.5 bg-[#F7F7F5] rounded-2xl border border-[#E6E8EC] flex items-center justify-between text-xs font-bold text-[#0E1116]">
                  <span className="flex items-center gap-1.5 text-[#2F6FED]">
                    📦 Order Received
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1.5 text-[#F27A1A]">
                    🔍 Picking
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1.5 text-[#1FA55E]">
                    🚚 Packing
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNext}
                  className="w-full h-14 rounded-full bg-[#0E1116] text-white text-lg font-bold flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-lg"
                >
                  Next: The Job <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: The Job (Checklist) */}
        {currentSlide === 1 && (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            <div className="h-[42%] bg-[#DDF3E6] relative flex items-center justify-center p-6">
              <button
                onClick={() =>
                  handleAudioSpeak(
                    'The Job consists of five clear checkpoints: receive task, walk route, scan bin, verify SKU, and confirm quantity.'
                  )
                }
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#0E1116] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <Volume2 size={22} />
              </button>
              <ClayArt type="clipboard" size={130} />
            </div>

            <div className="flex-1 bg-white rounded-t-[32px] -mt-6 p-6 shadow-[0_8px_24px_rgba(16,24,40,.08)] flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <h1 className="text-2xl font-bold text-[#0E1116] mb-3">The Job in 5 Steps</h1>
                <div className="space-y-2">
                  {[
                    '1. Accept task on handheld scanner',
                    '2. Walk optimized aisle route',
                    '3. Scan bin barcode at location',
                    '4. Match item SKU and barcode',
                    '5. Confirm exact physical quantity',
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#F7F7F5] border border-[#E6E8EC] text-sm font-semibold text-[#0E1116]"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#1FA55E] text-white flex items-center justify-center text-xs font-black">
                        ✓
                      </div>
                      <span>{row}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-14 h-14 rounded-full border border-[#E6E8EC] bg-white flex items-center justify-center text-[#0E1116]"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 h-14 rounded-full bg-[#0E1116] text-white text-lg font-bold flex items-center justify-center gap-2"
                >
                  Step Journey <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: Step Journey (Vertical Stepper) */}
        {currentSlide === 2 && (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            <div className="h-[28%] bg-[#FFE6D2] relative flex items-center justify-center p-4">
              <button
                onClick={() =>
                  handleAudioSpeak(
                    'Step Journey. Nine steps from task receipt to pack station handover. Notice step 6: if shelf is short, pick what is there and report the shortage.'
                  )
                }
                className="absolute top-3 right-4 w-10 h-10 rounded-full bg-[#0E1116] text-white flex items-center justify-center"
              >
                <Volume2 size={18} />
              </button>
              <ClayArt type="scanner" size={90} />
            </div>

            <div className="flex-1 bg-white rounded-t-[32px] -mt-5 p-6 shadow-sm flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <h1 className="text-xl font-bold text-[#0E1116] mb-1">Interactive Step Journey</h1>
                <p className="text-xs text-[#66726B] font-semibold mb-3">Tap any step to see details</p>
                <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
                  {STEP_JOURNEY.map((s) => (
                    <div
                      key={s.step}
                      className={`p-3 rounded-2xl border transition-all ${
                        s.isException
                          ? 'bg-[#FFE6D2]/60 border-[#F27A1A]/40 text-[#9A3412]'
                          : 'bg-[#F7F7F5] border-[#E6E8EC] text-[#0E1116]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-sm">
                          <span className="text-base">{s.icon}</span>
                          <span>
                            {s.step}. {s.name}
                          </span>
                        </div>
                        {s.isException && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#F27A1A] text-white">
                            Exception
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold mt-1 opacity-85">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-14 h-14 rounded-full border border-[#E6E8EC] bg-white flex items-center justify-center text-[#0E1116]"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 h-14 rounded-full bg-[#0E1116] text-white text-lg font-bold flex items-center justify-center gap-2"
                >
                  Next: Your Tools <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 4: Your Tools (2x3 Grid) */}
        {currentSlide === 3 && (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            <div className="h-[28%] bg-[#FFE6D2] relative flex items-center justify-center p-4">
              <button
                onClick={() =>
                  handleAudioSpeak(
                    'Your Tools. Tap any tool card to open its detail sheet and learn what it is for, and what never to do.'
                  )
                }
                className="absolute top-3 right-4 w-10 h-10 rounded-full bg-[#0E1116] text-white flex items-center justify-center"
              >
                <Volume2 size={18} />
              </button>
              <ClayArt type="box" size={90} />
            </div>

            <div className="flex-1 bg-white rounded-t-[32px] -mt-5 p-6 shadow-sm flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-xl font-bold text-[#0E1116]">Your 6 Tools</h1>
                  <span className="text-xs font-bold text-[#F27A1A] bg-[#FFE6D2] px-3 py-1 rounded-full">
                    Tap for details
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 max-h-[46vh] overflow-y-auto">
                  {WAREHOUSE_TOOLS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        sounds.playTap();
                        setSelectedTool(t);
                      }}
                      className="p-3 bg-[#F7F7F5] border border-[#E6E8EC] rounded-2xl text-left hover:border-[#0E1116] active:scale-98 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                        <ClayArt type={t.iconName as 'scanner' | 'tote' | 'box'} size={24} />
                      </div>
                      <span className="text-xs font-bold text-[#0E1116] block">{t.name}</span>
                      <span className="text-[10px] text-[#66726B] font-semibold block truncate">
                        {t.shortDesc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-14 h-14 rounded-full border border-[#E6E8EC] bg-white flex items-center justify-center text-[#0E1116]"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 h-14 rounded-full bg-[#0E1116] text-white text-lg font-bold flex items-center justify-center gap-2"
                >
                  Golden Rules <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 5: Golden Rules */}
        {currentSlide === 4 && (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            <div className="h-[40%] bg-[#E8E1FF] relative flex items-center justify-center p-6">
              <button
                onClick={() =>
                  handleAudioSpeak(
                    'Golden Rules: 1. Always scan the bin label first. 2. Match the exact SKU. 3. Confirm exact physical quantity. 4. One tote per order.'
                  )
                }
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#0E1116] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <Volume2 size={22} />
              </button>
              <ClayArt type="medal" size={130} />
            </div>

            <div className="flex-1 bg-white rounded-t-[32px] -mt-6 p-6 shadow-sm flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <h1 className="text-2xl font-bold text-[#0E1116] mb-3">Golden Rules</h1>
                <div className="space-y-2.5">
                  {[
                    { rule: 'Scan bin label before touching items', color: '#1FA55E' },
                    { rule: 'Match exact SKU letters & numbers', color: '#2F6FED' },
                    { rule: 'Count physical units into the tote', color: '#7A5AF8' },
                    { rule: 'One tote per order — never mix', color: '#F27A1A' },
                  ].map((r, i) => (
                    <div
                      key={i}
                      onClick={() => handleAudioSpeak(r.rule)}
                      className="p-3.5 rounded-2xl bg-[#F7F7F5] border border-[#E6E8EC] flex items-center justify-between cursor-pointer active:scale-98 transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-black"
                          style={{ backgroundColor: r.color }}
                        >
                          ✓
                        </div>
                        <span className="text-sm font-bold text-[#0E1116]">{r.rule}</span>
                      </div>
                      <Volume2 size={16} className="text-[#66726B]" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-14 h-14 rounded-full border border-[#E6E8EC] bg-white flex items-center justify-center text-[#0E1116]"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 h-14 rounded-full bg-[#0E1116] text-white text-lg font-bold flex items-center justify-center gap-2"
                >
                  What Can Go Wrong <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 6: What Can Go Wrong */}
        {currentSlide === 5 && (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            <div className="h-[40%] bg-[#FBE0EA] relative flex items-center justify-center p-6">
              <button
                onClick={() =>
                  handleAudioSpeak(
                    'What can go wrong? If the bin is short, never guess and never take stock from another bin without a task. Stop. Check. Act correctly.'
                  )
                }
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#0E1116] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <Volume2 size={22} />
              </button>
              <ClayArt type="safety" size={130} />
            </div>

            <div className="flex-1 bg-white rounded-t-[32px] -mt-6 p-6 shadow-sm flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <h1 className="text-2xl font-bold text-[#0E1116] mb-3">What Can Go Wrong?</h1>
                <div className="space-y-2 mb-4">
                  {[
                    'Grabbing by color without scanning SKU',
                    'Keying quantity without counting items',
                    'Mixing two customer orders in one tote',
                  ].map((mistake, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#FBE0EA]/60 border border-[#FBE0EA] flex items-center gap-2.5 text-xs font-bold text-[#991B1B]"
                    >
                      <AlertCircle size={18} className="text-[#E5484D] shrink-0" />
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>

                {/* Solid Red Warning Banner */}
                <div className="p-3.5 bg-[#E5484D] text-white rounded-2xl text-center font-bold text-sm shadow-md">
                  Don't guess. Stop. Check. Act correctly.
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-14 h-14 rounded-full border border-[#E6E8EC] bg-white flex items-center justify-center text-[#0E1116]"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 h-14 rounded-full bg-[#0E1116] text-white text-lg font-bold flex items-center justify-center gap-2"
                >
                  Meet Guruji <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 7: Meet Guruji */}
        {currentSlide === 6 && (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            <div className="h-[40%] bg-[#FFF2C9] relative flex items-center justify-center p-6">
              <button
                onClick={() =>
                  handleAudioSpeak(
                    'Meet Guruji, your warehouse work coach. Whenever you are unsure at a bin or dealing with a shortage, I am here to guide your pick.'
                  )
                }
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#0E1116] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <Volume2 size={22} />
              </button>
              <ClayArt type="guru" size={135} />
            </div>

            <div className="flex-1 bg-white rounded-t-[32px] -mt-6 p-6 shadow-sm flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <h1 className="text-2xl font-bold text-[#0E1116] mb-2">Meet Guruji Coach</h1>
                {/* Speech Bubble Card */}
                <div className="p-4 rounded-2xl bg-[#FFF2C9]/60 border border-[#FFF2C9] text-sm font-semibold text-[#854D0E] mb-4">
                  "I'm with you on the warehouse floor. If you ever hesitate, tap 'Show me' or ask for a hint. We pick safely together!"
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      sounds.speak('Hint: Always look at the earliest carrier cut-off time.');
                    }}
                    className="p-3 rounded-2xl border border-[#E6E8EC] bg-[#F7F7F5] font-bold text-xs text-[#0E1116] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <HelpCircle size={16} className="text-[#2F6FED]" />
                    See a hint
                  </button>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      sounds.speak('Calling trainer supervisor to station.');
                    }}
                    className="p-3 rounded-2xl border border-[#E6E8EC] bg-[#F7F7F5] font-bold text-xs text-[#0E1116] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                  >
                    <UserCheck size={16} className="text-[#1FA55E]" />
                    Ask trainer
                  </button>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-14 h-14 rounded-full border border-[#E6E8EC] bg-white flex items-center justify-center text-[#0E1116]"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 h-14 rounded-full bg-[#0E1116] text-white text-lg font-bold flex items-center justify-center gap-2"
                >
                  Ready to Pick <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 8: Now You Do It */}
        {currentSlide === 7 && (
          <div className="flex-1 flex flex-col h-full animate-in fade-in duration-300">
            <div className="h-[44%] bg-[#DCEBFF] relative flex items-center justify-center p-6">
              <button
                onClick={() =>
                  handleAudioSpeak(
                    'Now you do it! Start the interactive 9-step picking simulation. Tap Start to test your skills.'
                  )
                }
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#0E1116] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <Volume2 size={22} />
              </button>
              <ClayArt type="scanner" size={135} />
            </div>

            <div className="flex-1 bg-white rounded-t-[32px] -mt-6 p-6 shadow-sm flex flex-col justify-between overflow-y-auto z-10">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#F27A1A] bg-[#FFE6D2] px-3 py-1 rounded-full mb-2">
                  Interactive Practice
                </span>
                <h1 className="text-3xl font-bold text-[#0E1116] leading-tight mb-2">
                  Now You Do It.
                </h1>
                <p className="text-base font-semibold text-[#3D4652] leading-relaxed mb-4">
                  Step onto the digital warehouse floor. Practice the 9 critical picking steps with live feedback from Guruji.
                </p>

                <div className="p-3 bg-[#F7F7F5] rounded-2xl border border-[#E6E8EC] flex justify-around text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#66726B] block">Steps</span>
                    <span className="text-lg font-bold text-[#0E1116]">9</span>
                  </div>
                  <div className="w-px bg-[#E6E8EC]" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#66726B] block">Target</span>
                    <span className="text-lg font-bold text-[#1FA55E]">100%</span>
                  </div>
                  <div className="w-px bg-[#E6E8EC]" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#66726B] block">Mode</span>
                    <span className="text-lg font-bold text-[#2F6FED]">Coach</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={handlePrev}
                  className="w-14 h-14 rounded-full border border-[#E6E8EC] bg-white flex items-center justify-center text-[#0E1116]"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={() => {
                    sounds.playTap();
                    onStartSimulation();
                  }}
                  className="flex-1 h-14 rounded-full bg-[#0E1116] hover:bg-black text-white text-base font-bold flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-lg"
                >
                  I'm Ready → Show Me <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tool Detail Modal (if a tool was clicked in Slide 4) */}
      <ToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} />
    </div>
  );
}

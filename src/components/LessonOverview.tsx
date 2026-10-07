import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Clock, BookOpen, BarChart, CheckCircle2 } from 'lucide-react';
import { Lesson } from '../types';
import ClayArt from './ClayArt';
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
      modeTag: 'Teaching Format',
      desc: 'Explain the SOP & process in simple presentation format',
      icon: BookOpen,
      iconColor: '#2F6FED',
      bgColor: '#DCEBFF',
      action: () => onOpenIntroDeck(),
    },
    {
      id: 'show-me',
      title: 'Show Me',
      modeTag: 'Demonstration',
      desc: 'Watch Coach demonstrate the actual SOP steps',
      icon: BookOpen,
      iconColor: '#7A5AF8',
      bgColor: '#E8E1FF',
      action: () => onStartSimulation(0),
    },
    {
      id: 'guide-me',
      title: 'Guide Me',
      modeTag: 'Guided Practice',
      desc: 'Perform the SOP with step-by-step coach hints',
      icon: BookOpen,
      iconColor: '#1FA55E',
      bgColor: '#DDF3E6',
      action: () => onStartSimulation(1),
    },
    {
      id: 'test-me',
      title: 'Test Me',
      modeTag: 'Assessment',
      desc: 'Assess whether you can perform the SOP without hints',
      icon: BookOpen,
      iconColor: '#F27A1A',
      bgColor: '#FFE6D2',
      action: () => onStartSimulation(2),
    },
  ];

  return (
    <div className="fixed inset-0 z-40 bg-[#F7F7F5] flex flex-col overflow-hidden animate-in fade-in duration-200">
      <div
        className="h-[40%] relative flex flex-col items-center justify-center p-6 transition-colors"
        style={{
          backgroundColor:
            lesson.color === 'sky'
              ? '#DCEBFF'
              : lesson.color === 'mint'
              ? '#DDF3E6'
              : lesson.color === 'peach'
              ? '#FFE6D2'
              : '#E8E1FF',
        }}
      >
        <div className="absolute top-4 inset-x-6 flex justify-between items-center z-10">
          <button
            onClick={() => {
              sounds.playTap();
              onBack();
            }}
            className="w-11 h-11 rounded-full bg-white/70 hover:bg-white text-[#0E1116] flex items-center justify-center shadow-sm active:scale-95 transition-all"
            aria-label="Back to Home"
          >
            <ArrowLeft size={22} />
          </button>
          <div />
          <div className="flex items-center gap-2">
            {onAskTrainer && (
              <button
                onClick={() => {
                  sounds.playTap();
                  onAskTrainer();
                }}
                className="px-2.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#14532D] flex items-center gap-1 shadow-2xs"
              >
                <span>Trainer</span>
              </button>
            )}
            <button
              onClick={() => {
                sounds.playTap();
                setBookmarked(!bookmarked);
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-all ${
                bookmarked ? 'bg-[#0E1116] text-white' : 'bg-white/70 hover:bg-white text-[#0E1116]'
              }`}
              aria-label="Bookmark"
            >
              <Bookmark size={20} className={bookmarked ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
        <div className="w-44 h-44 rounded-full bg-white/40 absolute -bottom-4" />
        <ClayArt type={lesson.artType} size={135} className="relative z-10" />
      </div>

      <div className="flex-1 bg-white rounded-t-[32px] -mt-8 p-6 shadow-[0_8px_24px_rgba(16,24,40,.08)] flex flex-col overflow-y-auto z-20">
        <div className="flex justify-between items-start mt-0.5">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0E1116] leading-tight">
            {lesson.title}
          </h1>
          <div className="bg-[#DDF3E6] text-[#1FA55E] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 shadow-2xs">
            <CheckCircle2 size={13} />
            <span>{lesson.masteryPercentage}% Mastery</span>
          </div>
        </div>
        <p className="text-xs font-semibold text-[#66726B] mt-1 mb-4">
          {lesson.description}
        </p>

        <div className="divide-y divide-[#E6E8EC] border-y border-[#E6E8EC] py-0.5 mb-6">
          <div className="py-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#66726B]">
              <BookOpen size={16} className="text-[#2F6FED]" /> Steps
            </span>
            <span className="font-bold text-[#0E1116]">{lesson.stepsCount} verified steps</span>
          </div>
          <div className="py-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#66726B]">
              <Clock size={16} className="text-[#F27A1A]" /> Time
            </span>
            <span className="font-bold text-[#0E1116]">~{lesson.durationMinutes} min</span>
          </div>
          <div className="py-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-[#66726B]">
              <BarChart size={16} className="text-[#1FA55E]" /> Level
            </span>
            <span className="font-bold text-[#0E1116]">{lesson.level}</span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {learningPath.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sounds.playTap();
                item.action();
              }}
              className="w-full p-5 rounded-3xl bg-white border border-[#E6E8EC] hover:border-indigo-500 shadow-sm flex items-center gap-4 text-left active:scale-[0.99] transition-all cursor-pointer group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"
                style={{ backgroundColor: item.bgColor, color: item.iconColor }}
              >
                <item.icon size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-bold text-[#0E1116]">{item.title}</span>
                  <span className="text-[10px] uppercase font-bold text-[#66726B] bg-slate-100 px-2 py-0.5 rounded-full">
                    {item.modeTag}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-600">
                  {item.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

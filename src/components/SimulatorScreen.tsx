import React, { useState, useEffect } from 'react';
import { Volume2, ArrowLeft, RotateCcw, Home, Sparkles, Check, X, ShieldCheck, UserCheck, BookOpen, AlertTriangle, FileText } from 'lucide-react';
import { SIMULATION_STEPS, SIMULATION_STEPS_B, FLOOR_CHECKLIST } from '../data/lessonsData';
import { SimulatorStep, Lesson, SourceMeta } from '../types';
import ClayArt from './ClayArt';
import AskTrainerModal from './AskTrainerModal';
import MicroLessonSheet from './MicroLessonSheet';
import { sounds } from '../utils/audio';
import { ORG_CONFIG } from '../config/orgConfig';

interface SimulatorScreenProps {
  initialPhase?: number; // 0: Show me, 1: Guide me, 2: Test me
  lesson?: Lesson;
  customSteps?: SimulatorStep[];
  sourceMeta?: SourceMeta;
  onClose: () => void;
  onFinish: (score: number) => void;
  onOpenBasics?: () => void;
  onAskTrainer?: () => void;
}

export default function SimulatorScreen({
  initialPhase = 1,
  lesson,
  customSteps,
  sourceMeta,
  onClose,
  onFinish,
  onOpenBasics,
  onAskTrainer,
}: SimulatorScreenProps) {
  const effectiveMeta = sourceMeta || lesson?.sourceMeta;

  // Determine steps pool strictly from lesson / customSteps or fallback
  const derivedSteps: SimulatorStep[] =
    customSteps ||
    (lesson?.blueprint?.scenarios
      ? initialPhase === 0
        ? lesson.blueprint.scenarios.watch
        : lesson.blueprint.scenarios.practice
      : initialPhase === 0
      ? SIMULATION_STEPS
      : SIMULATION_STEPS_B);

  const [phase, setPhase] = useState<number>(initialPhase);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [consecutiveWrongTaps, setConsecutiveWrongTaps] = useState<number>(0);
  const [hasWrongTapCurrentStep, setHasWrongTapCurrentStep] = useState<boolean>(false);
  const [hintUsedCurrentStep, setHintUsedCurrentStep] = useState<boolean>(false);
  const [safetyMissesMap, setSafetyMissesMap] = useState<Record<number, number>>({});
  const [testAttemptsCount, setTestAttemptsCount] = useState<number>(1);
  const [autoHandoffReason, setAutoHandoffReason] = useState<string | null>(null);
  const [missedSteps, setMissedSteps] = useState<number[]>([]);
  const [safetyMissedInTest, setSafetyMissedInTest] = useState<boolean>(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [coachStatus, setCoachStatus] = useState<'idle' | 'correct' | 'wrong' | 'coach'>('idle');
  const [coachSpeech, setCoachSpeech] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showHintGlow, setShowHintGlow] = useState<boolean>(false);

  // Modals inside simulator
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isMicroLessonOpen, setIsMicroLessonOpen] = useState(false);
  const [trainerSigned, setTrainerSigned] = useState(false);
  const [trainerName, setTrainerName] = useState('Marcus Vance (Lead Trainer)');

  const [activeStepPool, setActiveStepPool] = useState<SimulatorStep[]>(derivedSteps);

  useEffect(() => {
    setActiveStepPool(derivedSteps);
  }, [lesson, customSteps, initialPhase]);

  const step: SimulatorStep = activeStepPool[stepIndex] || activeStepPool[0];

  // Initialize step & phase behavior
  useEffect(() => {
    setSelectedChoiceId(null);
    setCoachStatus('idle');
    setShowHintGlow(false);
    setHasWrongTapCurrentStep(false);
    setHintUsedCurrentStep(false);

    if (phase === 0) {
      // SHOW ME (Know It / Demo): Coach demonstrates, learner watches. 0 points.
      setCoachSpeech(`Coach demo: ${step.why}`);
      const timer = setTimeout(() => {
        const correctChoice = step.choices.find((c) => c.isCorrect);
        if (correctChoice) {
          setSelectedChoiceId(correctChoice.id);
          setCoachStatus('correct');
          sounds.playCorrect();
        }
      }, 1400);
      return () => clearTimeout(timer);
    } else if (phase === 1) {
      // GUIDE ME: Practice with points (10 on 1st try, 5 with mistake/hint)
      setCoachSpeech(step.coachTip || 'Look at the task details above and select your action.');
    } else {
      // TEST ME: Solo Assessment
      setCoachSpeech('Solo Assessment: Confirm each step without hints. One attempt per line.');
    }
  }, [stepIndex, phase, activeStepPool, step]);

  const triggerAutoHandoff = (reason: string) => {
    setAutoHandoffReason(reason);
    setIsTrainerModalOpen(true);
    sounds.playWrong();
  };

  const handleChoiceClick = (choiceId: string, isCorrect: boolean) => {
    if (selectedChoiceId && phase === 2) return; // In Test Me, strict one attempt!

    setSelectedChoiceId(choiceId);

    if (isCorrect) {
      sounds.playCorrect();
      setCoachStatus('correct');
      setConsecutiveWrongTaps(0);

      if (phase === 0) {
        setScore((prev) => prev + ORG_CONFIG.points.knowIt);
      } else if (phase === 1) {
        const pointsEarned =
          hasWrongTapCurrentStep || hintUsedCurrentStep
            ? ORG_CONFIG.points.guideMeWithMistakeOrHint
            : ORG_CONFIG.points.guideMeFirstTry;
        setScore((prev) => prev + pointsEarned);
      } else if (phase === 2) {
        setScore((prev) => prev + 15);
      }

      setCoachSpeech(`Correct! ${step.why}`);
    } else {
      sounds.playWrong();
      setCoachStatus('wrong');
      setWrongCount((prev) => prev + 1);
      setHasWrongTapCurrentStep(true);

      const nextConsecutiveWrong = consecutiveWrongTaps + 1;
      setConsecutiveWrongTaps(nextConsecutiveWrong);

      const isSafetyOrComplianceStep =
        step.type === 'scan' ||
        step.type === 'shortage' ||
        step.title.toLowerCase().includes('safety') ||
        step.title.toLowerCase().includes('short');

      if (isSafetyOrComplianceStep) {
        setSafetyMissedInTest(true);
        const currentMisses = (safetyMissesMap[stepIndex] || 0) + 1;
        setSafetyMissesMap((prev) => ({ ...prev, [stepIndex]: currentMisses }));

        if (currentMisses >= ORG_CONFIG.handoffTriggers.safetyStepMissedLimit) {
          triggerAutoHandoff(
            `Safety/Compliance step "${step.title}" missed twice. Trainer intervention requested.`
          );
        }
      }

      if (nextConsecutiveWrong >= ORG_CONFIG.handoffTriggers.consecutiveWrongTapsLimit) {
        triggerAutoHandoff('3 consecutive incorrect selections. Trainer assistance triggered.');
      }

      if (!missedSteps.includes(stepIndex)) {
        setMissedSteps((prev) => [...prev, stepIndex]);
      }

      if (phase === 1) {
        setCoachSpeech(`Not quite. ${step.hint} Try again.`);
        setTimeout(() => {
          setSelectedChoiceId(null);
        }, 1400);
      } else {
        setCoachSpeech(`Recorded. The correct action was: ${step.why}`);
      }
    }
  };

  const handleShowMe = () => {
    sounds.playTap();
    setHintUsedCurrentStep(true);
    setShowHintGlow(true);
    setCoachStatus('coach');
    setCoachSpeech(`Coach Hint: ${step.why}`);
    sounds.speak(step.why);
    setTimeout(() => setShowHintGlow(false), 2000);
  };

  const handleNextStep = () => {
    sounds.playTap();
    if (stepIndex < activeStepPool.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      if (phase === 0) {
        sounds.playCorrect();
        setPhase(1);
        setStepIndex(0);
        setScore(0);
        setWrongCount(0);
        setMissedSteps([]);
      } else if (phase === 1 && missedSteps.length === 0 && !isCompleted) {
        sounds.playCorrect();
        setPhase(2);
        setStepIndex(0);
        setScore(0);
        setWrongCount(0);
        setMissedSteps([]);
      } else {
        setIsCompleted(true);
        onFinish(score);
        sounds.playFanfare();
      }
    }
  };

  const handleGuideMissedSteps = () => {
    sounds.playTap();
    const missedPool = activeStepPool.filter((_, idx) => missedSteps.includes(idx));
    if (missedPool.length > 0) {
      setActiveStepPool(missedPool);
    }
    setPhase(1);
    setStepIndex(0);
    setIsCompleted(false);
  };

  const handleRestartFull = (targetPhase: number = 1) => {
    sounds.playTap();
    setPhase(targetPhase);
    setActiveStepPool(derivedSteps);
    setStepIndex(0);
    setScore(0);
    setWrongCount(0);
    setMissedSteps([]);
    setIsCompleted(false);
  };

  // Completion Assessment Screen
  if (isCompleted) {
    const accuracy = Math.round(
      ((activeStepPool.length - missedSteps.length) / activeStepPool.length) * 100
    );
    const isMastered =
      accuracy >= ORG_CONFIG.mastery.testMeScoreThreshold && !safetyMissedInTest;

    return (
      <div className="fixed inset-0 z-50 bg-[#0E1116] text-white flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in duration-300">
        <div className="flex flex-col items-center text-center my-auto pt-6">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-xl ${
              isMastered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {isMastered ? <ShieldCheck size={52} /> : <AlertTriangle size={52} />}
          </div>

          <div className="text-xs font-black uppercase tracking-widest text-slate-400">
            {isMastered ? 'MASTERED · READY FOR FLOOR' : 'NOT YET · PRACTICE MISSED STEPS'}
          </div>

          <h1 className="text-4xl font-black mt-2.5">{accuracy}% Score</h1>
          <p className="text-xs text-slate-300 max-w-xs mt-1 leading-relaxed">
            {isMastered
              ? 'You successfully passed all required operational steps.'
              : `${missedSteps.length} step(s) need a quick tune-up before supervisor sign-off.`}
          </p>

          {/* Mastered Sign-off Branch */}
          {isMastered ? (
            <div className="w-full max-w-sm mt-6 space-y-4">
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    Trainer Sign-Off Stamp
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    STAMP #8821
                  </span>
                </div>

                {trainerSigned ? (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 font-bold">
                    <Check size={18} className="text-emerald-400 shrink-0" />
                    <span>Signed off by {trainerName} · Approved</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playTap();
                      sounds.playCorrect();
                      setTrainerSigned(true);
                      sounds.speak(`Trainer sign-off approved by ${trainerName}.`);
                    }}
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md cursor-pointer"
                  >
                    <UserCheck size={16} /> Tap for Trainer Sign-Off Stamp
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm mt-6 space-y-3">
              <button
                onClick={handleGuideMissedSteps}
                className="w-full h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg cursor-pointer"
              >
                <RotateCcw size={18} /> Guide Me on Missed Steps → Retest
              </button>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2.5 pt-3">
          <button
            onClick={() => handleRestartFull(1)}
            className="w-full h-12 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <RotateCcw size={16} /> Run Full Simulation Again
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-full h-12 rounded-full border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
          >
            <Home size={16} /> Back to Learning Hub
          </button>
        </div>

        <AskTrainerModal
          isOpen={isTrainerModalOpen}
          onClose={() => setIsTrainerModalOpen(false)}
          currentStepTitle="Floor Sign-Off & Verification"
        />
      </div>
    );
  }

  // Active Simulation Step Screen
  return (
    <div className="fixed inset-0 z-50 bg-[#F5F8FC] flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="bg-white/95 backdrop-blur-md px-4 sm:px-5 py-3 border-b border-[#DCE6EF] flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#F5F8FC] border border-[#DCE6EF] flex items-center justify-center text-[#10243A] cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="text-[10px] font-black tracking-widest uppercase text-[#1769D5]">
              GURUJI WORK COACH
            </div>
            <div className="text-xs font-bold text-[#10243A]">
              {phase === 0 ? 'SHOW ME' : phase === 1 ? 'GUIDE ME' : 'TEST ME'}
            </div>
          </div>
        </div>

        {/* Source Meta Display */}
        {effectiveMeta && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
            <FileText size={12} className="text-indigo-600" />
            <span className="truncate max-w-[150px]">Source: {effectiveMeta.filename}</span>
          </div>
        )}

        {/* Header Controls */}
        <div className="flex items-center gap-1.5">
          {onOpenBasics && (
            <button
              onClick={() => {
                sounds.playTap();
                onOpenBasics();
              }}
              className="px-2.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E6E8EC] text-[10px] font-bold text-[#0E1116] flex items-center gap-1 cursor-pointer"
            >
              <BookOpen size={12} className="text-[#2F6FED]" />
              <span>Basics</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playTap();
              setIsMicroLessonOpen(true);
            }}
            className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles size={12} className="text-amber-600" />
            <span>Ask Guruji</span>
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setIsTrainerModalOpen(true);
            }}
            className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-[#14532D] flex items-center gap-1 cursor-pointer"
          >
            <UserCheck size={12} className="text-emerald-600" />
            <span>Trainer</span>
          </button>
        </div>
      </div>

      {/* Main Step Card */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between max-w-lg mx-auto w-full">
        <div className="space-y-4">
          {/* Progress Dots */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              Step {stepIndex + 1} of {activeStepPool.length}
            </span>
            <div className="flex gap-1">
              {activeStepPool.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === stepIndex ? 'w-5 bg-indigo-600' : 'w-1.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question & Target Header */}
          <div className="p-4 rounded-2xl bg-white border border-[#DCE6EF] shadow-2xs space-y-2">
            <h2 className="text-lg font-bold text-[#10243A] leading-tight">
              {step.question || step.title}
            </h2>

            {/* Source Provenance Badge */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-700 leading-relaxed space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                <span>Source Ref: {(step as any).source_ref || 'S1'}</span>
                <span>{(step as any).page_or_section || 'Page 1'}</span>
              </div>
              <p className="text-slate-600 italic">
                "{(step as any).evidence || step.why}"
              </p>
            </div>
          </div>

          {/* Coach Speech Banner */}
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
              coachStatus === 'correct'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : coachStatus === 'wrong'
                ? 'bg-red-50 border-red-300 text-red-900'
                : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-2xs flex items-center justify-center shrink-0">
              <ClayArt type="guru" size={24} />
            </div>
            <p className="leading-snug">{coachSpeech}</p>
          </div>

          {/* Choice Buttons */}
          <div className="space-y-2.5 pt-1">
            {step.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;
              let btnClass = 'bg-white border-[#DCE6EF] text-[#10243A] hover:border-indigo-600';

              if (isSelected) {
                btnClass = choice.isCorrect
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                  : 'bg-red-50 border-red-500 text-red-950 font-bold';
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceClick(choice.id, choice.isCorrect)}
                  disabled={selectedChoiceId !== null && phase === 2}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-bold shadow-2xs transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                >
                  <div>
                    <span className="block">{choice.title}</span>
                    {choice.subtitle && (
                      <span className="text-[11px] font-normal opacity-75 block mt-0.5">
                        {choice.subtitle}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                        choice.isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    >
                      {choice.isCorrect ? <Check size={14} /> : <X size={14} />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex gap-3">
          {phase === 1 && (
            <button
              onClick={handleShowMe}
              className={`px-4 h-13 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer ${
                showHintGlow ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <Sparkles size={16} /> Show Me Hint
            </button>
          )}

          {selectedChoiceId !== null && (
            <button
              onClick={handleNextStep}
              className="flex-1 h-13 rounded-full bg-slate-900 hover:bg-black text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              Next Step →
            </button>
          )}
        </div>
      </div>

      <AskTrainerModal
        isOpen={isTrainerModalOpen}
        onClose={() => setIsTrainerModalOpen(false)}
        currentStepTitle={step.title}
        triggerReason={autoHandoffReason || undefined}
      />

      <MicroLessonSheet
        isOpen={isMicroLessonOpen}
        onClose={() => setIsMicroLessonOpen(false)}
        onOpenBasics={() => {
          setIsMicroLessonOpen(false);
          if (onOpenBasics) onOpenBasics();
        }}
        onAskTrainer={() => {
          setIsMicroLessonOpen(false);
          setIsTrainerModalOpen(true);
        }}
      />
    </div>
  );
}

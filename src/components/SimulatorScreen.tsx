import React, { useState, useEffect } from 'react';
import { Volume2, ArrowLeft, RotateCcw, Home, Sparkles, Check, X, ShieldCheck, UserCheck, BookOpen, AlertTriangle } from 'lucide-react';
import { SIMULATION_STEPS, SIMULATION_STEPS_B, FLOOR_CHECKLIST } from '../data/lessonsData';
import { SimulatorStep } from '../types';
import ClayArt from './ClayArt';
import AskTrainerModal from './AskTrainerModal';
import MicroLessonSheet from './MicroLessonSheet';
import { sounds } from '../utils/audio';
import { ORG_CONFIG } from '../config/orgConfig';

interface SimulatorScreenProps {
  initialPhase?: number; // 0: Show me, 1: Guide me, 2: Test me
  onClose: () => void;
  onFinish: (score: number) => void;
  onOpenBasics?: () => void;
  onAskTrainer?: () => void;
}

export default function SimulatorScreen({
  initialPhase = 1,
  onClose,
  onFinish,
  onOpenBasics,
  onAskTrainer,
}: SimulatorScreenProps) {
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

  // Filtered steps for targeted retry of missed steps
  const [activeStepPool, setActiveStepPool] = useState<SimulatorStep[]>(() => {
    return initialPhase === 0 ? SIMULATION_STEPS : SIMULATION_STEPS_B;
  });

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

      // Points calculation based on ORG_CONFIG
      if (phase === 0) {
        // Know it / Show me has 0 points
        setScore((prev) => prev + ORG_CONFIG.points.knowIt);
      } else if (phase === 1) {
        // Guide me: 10 on first try without hint/mistake, 5 if hint used or wrong tap occurred
        const pointsEarned =
          hasWrongTapCurrentStep || hintUsedCurrentStep
            ? ORG_CONFIG.points.guideMeWithMistakeOrHint
            : ORG_CONFIG.points.guideMeFirstTry;
        setScore((prev) => prev + pointsEarned);
      } else if (phase === 2) {
        // Test me: 15 points per correct step
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

      // Check Risk level (Safety or Compliance)
      const isSafetyOrComplianceStep =
        step.type === 'scan' ||
        step.type === 'shortage' ||
        step.title.toLowerCase().includes('safety') ||
        step.title.toLowerCase().includes('short');

      if (isSafetyOrComplianceStep) {
        setSafetyMissedInTest(true);
        const currentMisses = (safetyMissesMap[stepIndex] || 0) + 1;
        setSafetyMissesMap((prev) => ({ ...prev, [stepIndex]: currentMisses }));

        // Handoff Trigger 3: Safety/compliance step missed twice
        if (currentMisses >= ORG_CONFIG.handoffTriggers.safetyStepMissedLimit) {
          triggerAutoHandoff(
            `Safety/Compliance step "${step.title}" missed twice. Trainer intervention requested.`
          );
        }
      }

      // Handoff Trigger 4: 3 wrong taps in a row
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
      // Completed current pool
      if (phase === 0) {
        sounds.playCorrect();
        setPhase(1);
        setActiveStepPool(SIMULATION_STEPS_B);
        setStepIndex(0);
        setScore(0);
        setWrongCount(0);
        setMissedSteps([]);
      } else if (phase === 1 && missedSteps.length === 0 && !isCompleted) {
        sounds.playCorrect();
        setPhase(2);
        setActiveStepPool(SIMULATION_STEPS_B);
        setStepIndex(0);
        setScore(0);
        setWrongCount(0);
        setMissedSteps([]);
      } else {
        // Finished evaluation / Test Me
        sounds.playCorrect();
        setIsCompleted(true);
        const accuracy = Math.round(
          ((activeStepPool.length - missedSteps.length) / activeStepPool.length) * 100
        );

        // Handoff Trigger 5: Not mastered after 2 test attempts
        const isMastered = accuracy >= 80 && !safetyMissedInTest;
        if (!isMastered && testAttemptsCount >= ORG_CONFIG.handoffTriggers.maxUnmasteredTestAttempts) {
          triggerAutoHandoff('Not mastered after 2 test attempts. Scheduled hands-on review with trainer.');
        }

        onFinish(accuracy);
      }
    }
  };

  // Targeted Retry on Missed Steps
  const handleGuideMissedSteps = () => {
    sounds.playTap();
    const missedStepObjects = SIMULATION_STEPS_B.filter((_, idx) => missedSteps.includes(idx));
    setActiveStepPool(missedStepObjects.length > 0 ? missedStepObjects : SIMULATION_STEPS_B);
    setStepIndex(0);
    setScore(0);
    setWrongCount(0);
    setMissedSteps([]);
    setSelectedChoiceId(null);
    setCoachStatus('idle');
    setIsCompleted(false);
    setPhase(1); // switch back to Guide Me with hints!
  };

  const handleRestartFull = (newPhase: number = 1) => {
    sounds.playTap();
    setActiveStepPool(newPhase === 0 ? SIMULATION_STEPS : SIMULATION_STEPS_B);
    setStepIndex(0);
    setScore(0);
    setWrongCount(0);
    setMissedSteps([]);
    setSelectedChoiceId(null);
    setCoachStatus('idle');
    setIsCompleted(false);
    setPhase(newPhase);
    setTrainerSigned(false);
  };

  const handleSpeakQuestion = () => {
    sounds.playTap();
    sounds.speak(`${step.question}. Task order: ${step.taskOrder}. Target: ${step.targetCode}`);
  };

  // Completion Assessment Screen
  if (isCompleted) {
    const accuracy = Math.round(
      ((activeStepPool.length - missedSteps.length) / activeStepPool.length) * 100
    );
    const isMastered =
      accuracy >= ORG_CONFIG.mastery.testMeScoreThreshold * 100 && !safetyMissedInTest;

    return (
      <div className="fixed inset-0 z-50 bg-[#0E1116] text-white flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in duration-300">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isMastered ? 'Floor Mastery Sign-Off' : 'Targeted Review Needed'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTrainerModalOpen(true)}
              className="text-xs font-bold text-emerald-400 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5"
            >
              <UserCheck size={14} /> Ask Trainer
            </button>
            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="py-6 flex flex-col items-center text-center">
          <ClayArt type="medal" size={120} />

          <div
            className={`mt-4 px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase ${
              isMastered
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isMastered ? 'MASTERED · READY FOR FLOOR' : 'NOT YET · PRACTICE MISSED STEPS'}
          </div>

          <h1 className="text-4xl font-black mt-2.5">{accuracy}% Score</h1>
          <p className="text-xs text-slate-300 max-w-xs mt-1 leading-relaxed">
            {isMastered
              ? 'You successfully navigated cut-offs, bin barcode scanning, SKU verification, and shortage reporting.'
              : `${missedSteps.length} step(s) need a quick tune-up before supervisor sign-off.`}
          </p>

          {/* MASTERED BRANCH: Floor Checklist → Trainer Signs Off */}
          {isMastered ? (
            <div className="w-full max-w-sm mt-6 space-y-4">
              {/* Floor Checklist */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-400 tracking-wider mb-2.5">
                  <ShieldCheck size={16} />
                  <span>Floor Sign-Off Checklist</span>
                </div>
                <div className="space-y-1.5">
                  {FLOOR_CHECKLIST.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trainer Sign-off Box */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    Trainer Sign-Off Stamp
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    CODE: TR-SIGN-OFF #8821
                  </span>
                </div>

                {trainerSigned ? (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 font-bold">
                    <Check size={18} className="text-emerald-400 shrink-0" />
                    <span>Signed off by {trainerName} · Shift Approved</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playTap();
                      sounds.playCorrect();
                      setTrainerSigned(true);
                      sounds.speak(`Trainer sign-off approved by ${trainerName}.`);
                    }}
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all shadow-md"
                  >
                    <UserCheck size={16} /> Tap for Trainer Sign-Off Stamp
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* NOT YET BRANCH: Guide me on missed steps → retest */
            <div className="w-full max-w-sm mt-6 space-y-3">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-left">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider block mb-1">
                  Targeted Guidance
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You missed {missedSteps.length} step(s). Practice just those specific steps with Coach hints, then retake the check.
                </p>
              </div>

              <button
                onClick={handleGuideMissedSteps}
                className="w-full h-14 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg"
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
            className="w-full h-12 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <RotateCcw size={16} /> Run Full Simulation Again
          </button>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-full h-12 rounded-full border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
          >
            <Home size={16} /> Back to Learning Hub
          </button>
        </div>

        {/* Global Modals */}
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
      {/* Top Frontline Chrome with Omnipresent "Ask my trainer" & "Basics" */}
      <div className="bg-white/95 backdrop-blur-md px-4 sm:px-5 py-3 border-b border-[#DCE6EF] flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#F5F8FC] border border-[#DCE6EF] flex items-center justify-center text-[#10243A]"
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

        {/* Omnipresent Controls in Header */}
        <div className="flex items-center gap-1.5">
          {/* Basics Button */}
          {onOpenBasics && (
            <button
              onClick={() => {
                sounds.playTap();
                onOpenBasics();
              }}
              className="px-2.5 py-1 rounded-full bg-[#F7F7F5] border border-[#E6E8EC] text-[10px] font-bold text-[#0E1116] flex items-center gap-1 hover:border-[#0E1116]"
            >
              <BookOpen size={12} className="text-[#2F6FED]" />
              <span>Basics</span>
            </button>
          )}

          {/* Ask My Trainer Button */}
          <button
            onClick={() => {
              sounds.playTap();
              if (onAskTrainer) {
                onAskTrainer();
              } else {
                setIsTrainerModalOpen(true);
              }
            }}
            className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-[#14532D] flex items-center gap-1"
          >
            <UserCheck size={12} className="text-emerald-600" />
            <span>Trainer</span>
          </button>

          {/* Stuck? Ask Guruji Quick Button */}
          <button
            onClick={() => {
              sounds.playTap();
              setIsMicroLessonOpen(true);
            }}
            className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black"
            title="Stuck? Ask Guruji"
          >
            ?
          </button>
        </div>
      </div>

      {/* Progress Bar with Steps */}
      <div className="bg-white px-5 py-2 border-b border-[#DCE6EF]">
        <div className="flex justify-between items-center text-[10px] font-bold text-[#66726B] mb-1.5">
          <span>
            STEP {stepIndex + 1} OF {activeStepPool.length}: {step.title}
          </span>
          <span className="font-mono">{score} pts</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${((stepIndex + 1) / activeStepPool.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Scrollable Center Area: WMS Handheld Terminal Inside Clean Depth Layer */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
        {/* Realistic WMS Device Header Card */}
        <div
          className={`rounded-3xl p-5 text-white shadow-xl transition-all duration-300 relative overflow-hidden ${
            coachStatus === 'correct'
              ? 'bg-gradient-to-br from-emerald-800 via-emerald-600 to-emerald-500 shadow-emerald-900/30 border border-emerald-400/40'
              : coachStatus === 'wrong'
              ? 'bg-gradient-to-br from-rose-900 via-rose-700 to-rose-600 shadow-rose-900/30 border border-rose-400/40'
              : coachStatus === 'coach'
              ? 'bg-gradient-to-br from-indigo-950 via-indigo-700 to-indigo-600 shadow-indigo-950/40 border border-indigo-400/40'
              : 'bg-gradient-to-br from-[#061725] via-[#0B263B] to-[#123753] shadow-slate-900/40 border border-blue-400/30'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-200 block">
                {step.taskTitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                {step.taskOrder}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">{step.taskItem}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wide shadow-md">
              {step.priority}
            </span>
          </div>

          {/* WMS Data Displays */}
          <div className={`grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15 ${showHintGlow ? 'animate-pulse' : ''}`}>
            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[9px] uppercase font-black text-slate-300 block">Target Code</span>
              <span className="text-base font-black text-white font-mono block truncate">
                {step.targetCode}
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-[9px] uppercase font-black text-slate-300 block">Required Qty</span>
              <span className="text-base font-black text-emerald-300 font-mono block">
                {step.targetQty} UNITS
              </span>
            </div>
          </div>
        </div>

        {/* Question Prompt with Speaker Audio Button */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#DCE6EF] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
              Required Action
            </span>
            <h3 className="text-base font-black text-[#10243A] leading-snug mt-0.5">
              {step.question}
            </h3>
          </div>
          <button
            onClick={handleSpeakQuestion}
            className="w-10 h-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 active:scale-95 transition-all ml-2"
            aria-label="Listen"
          >
            <Volume2 size={20} />
          </button>
        </div>

        {/* Choices Options Grid */}
        <div className="space-y-2.5">
          {step.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            const isAnswerRevealed = selectedChoiceId !== null;

            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice.id, choice.isCorrect)}
                disabled={isAnswerRevealed && phase === 2}
                className={`w-full p-4 rounded-2xl border text-left transition-all active:scale-[0.985] flex items-center justify-between ${
                  isSelected && choice.isCorrect
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : isSelected && !choice.isCorrect
                    ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white border-rose-500 shadow-md shadow-rose-600/30'
                    : isAnswerRevealed && choice.isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-white hover:bg-slate-50 border-[#DCE6EF] text-[#10243A] shadow-sm'
                }`}
              >
                <div>
                  <div className="font-bold text-sm leading-tight">{choice.title}</div>
                  {choice.subtitle && (
                    <div
                      className={`text-xs mt-1 font-medium ${
                        isSelected ? 'text-white/90' : 'text-[#66726B]'
                      }`}
                    >
                      {choice.subtitle}
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm shrink-0 ml-3">
                    {choice.isCorrect ? <Check size={18} /> : <X size={18} />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Guruji Coach Feedback Bar */}
        <div
          className={`rounded-2xl p-3.5 flex items-start gap-3 border transition-all ${
            coachStatus === 'correct'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : coachStatus === 'wrong'
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-white border-[#DCE6EF] text-[#10243A]'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md">
            G
          </div>
          <div className="text-xs leading-relaxed font-semibold">
            <span className="font-bold text-indigo-600 block uppercase tracking-wider text-[10px] mb-0.5">
              Guruji Work Coach
            </span>
            {coachSpeech}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Area */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-t border-[#DCE6EF] space-y-2 z-20">
        {phase === 1 && !selectedChoiceId && (
          <button
            onClick={handleShowMe}
            className="w-full h-11 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-md shadow-indigo-500/20"
          >
            <Sparkles size={16} /> Show Me (Coach Hint)
          </button>
        )}

        <button
          onClick={handleNextStep}
          disabled={!selectedChoiceId && phase !== 0}
          className={`w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-98 transition-all ${
            selectedChoiceId || phase === 0
              ? 'bg-gradient-to-r from-[#1773E2] to-[#1059B9] text-white shadow-lg shadow-blue-500/30 cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {phase === 0 && stepIndex === activeStepPool.length - 1
            ? 'Watch Complete → Start Guided Practice'
            : phase === 1 && stepIndex === activeStepPool.length - 1
            ? 'Practice Complete → Take Solo Test'
            : stepIndex === activeStepPool.length - 1
            ? 'Complete Assessment'
            : 'Confirm & Continue'}
        </button>
      </div>

      {/* Omnipresent Modals */}
      <AskTrainerModal
        isOpen={isTrainerModalOpen}
        onClose={() => {
          setIsTrainerModalOpen(false);
          setAutoHandoffReason(null);
        }}
        currentStepTitle={`Step ${stepIndex + 1}: ${step.title} (${step.targetCode})`}
        triggerReason={autoHandoffReason}
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

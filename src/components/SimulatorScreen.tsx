import React, { useState, useEffect } from 'react';
import { Check, X, Sparkles, BookOpen } from 'lucide-react';
import { SIMULATION_STEPS, SIMULATION_STEPS_B } from '../data/lessonsData';
import { SimulatorStep, Lesson, SourceMeta } from '../types';
import AskTrainerModal from './AskTrainerModal';
import MicroLessonSheet from './MicroLessonSheet';
import { sounds } from '../utils/audio';
import { ORG_CONFIG } from '../config/orgConfig';
import './guruji-work-coach.css';

interface SimulatorScreenProps {
  initialPhase?: number; // 0: Show me (WATCH), 1: Guide me (YOUR TURN), 2: Test me (SOLO CHECK)
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
  const [consecutiveWrongTaps, setConsecutiveWrongTaps] = useState<number>(0);
  const [hasWrongTapCurrentStep, setHasWrongTapCurrentStep] = useState<boolean>(false);
  const [hintUsedCurrentStep, setHintUsedCurrentStep] = useState<boolean>(false);
  const [safetyMissesMap, setSafetyMissesMap] = useState<Record<number, number>>({});
  const [autoHandoffReason, setAutoHandoffReason] = useState<string | null>(null);
  const [missedSteps, setMissedSteps] = useState<number[]>([]);
  const [safetyMissedInTest, setSafetyMissedInTest] = useState<boolean>(false);
  
  // Selected choice and choice interaction states
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [disabledChoiceIds, setDisabledChoiceIds] = useState<string[]>([]);
  const [coachStatus, setCoachStatus] = useState<'idle' | 'correct' | 'wrong' | 'coach'>('idle');
  const [coachSpeech, setCoachSpeech] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isBubbleBad, setIsBubbleBad] = useState<boolean>(false);

  // Modals inside simulator
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [isMicroLessonOpen, setIsMicroLessonOpen] = useState(false);

  const [activeStepPool, setActiveStepPool] = useState<SimulatorStep[]>(derivedSteps);

  useEffect(() => {
    setActiveStepPool(derivedSteps);
  }, [lesson, customSteps, initialPhase]);

  const step: SimulatorStep = activeStepPool[stepIndex] || activeStepPool[0];

  // Initialize step & phase behavior
  useEffect(() => {
    setSelectedChoiceId(null);
    setDisabledChoiceIds([]);
    setCoachStatus('idle');
    setHasWrongTapCurrentStep(false);
    setHintUsedCurrentStep(false);
    setIsBubbleBad(false);

    if (phase === 0) {
      // SHOW ME (WATCH / Demo): Coach demonstrates, learner watches.
      setCoachSpeech(step.why || 'Watch the demonstrated action.');
      const timer = setTimeout(() => {
        const correctChoice = step.choices.find((c) => c.isCorrect);
        if (correctChoice) {
          setSelectedChoiceId(correctChoice.id);
          setCoachStatus('correct');
          sounds.playCorrect();
        }
      }, 850);
      return () => clearTimeout(timer);
    } else if (phase === 1) {
      // GUIDE ME (YOUR TURN): Practice with hints
      setCoachSpeech(step.coachTip || 'I’m watching.');
    } else {
      // TEST ME (SOLO CHECK): Solo Assessment
      setCoachSpeech('Solo Assessment: Confirm each step without hints. One attempt per line.');
    }
  }, [stepIndex, phase, activeStepPool, step]);

  const triggerAutoHandoff = (reason: string) => {
    setAutoHandoffReason(reason);
    setIsTrainerModalOpen(true);
    sounds.playWrong();
  };

  const handleChoiceClick = (choiceId: string, isCorrect: boolean) => {
    if (disabledChoiceIds.includes(choiceId)) return;
    if (selectedChoiceId && phase === 2) return; // In Test Me, strict one attempt

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

      setCoachSpeech(phase === 2 ? 'Done.' : step.why || 'Correct! Proceed to next step.');
    } else {
      sounds.playWrong();
      setCoachStatus('wrong');
      setIsBubbleBad(true);
      setTimeout(() => setIsBubbleBad(false), 600);

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
        // Build specific hint from step data or distractor context
        let msg = 'Stop. Check the task details.';
        if (step.type === 'location') msg = 'Look at the location code one part at a time: aisle → bay → bin.';
        else if (step.type === 'sku') msg = 'Do not choose by appearance. Match the SKU.';
        else if (step.type === 'qty') msg = 'The task quantity is shown above. Confirm the exact number.';
        else if (step.type === 'shortage') msg = 'Pick what is physically there, then report the shortage.';
        else if (step.type === 'tote') msg = 'Match the tote to the order number. Do not mix orders.';
        else if (step.hint) msg = `Not quite. ${step.hint}`;

        setCoachSpeech(msg);
        setDisabledChoiceIds((prev) => [...prev, choiceId]);
        setTimeout(() => {
          setSelectedChoiceId(null);
        }, 1200);
      } else {
        setCoachSpeech(`No hint in solo check. The correct action was: ${step.why}`);
      }
    }
  };

  const handleShowMe = () => {
    sounds.playTap();
    setHintUsedCurrentStep(true);
    setCoachStatus('coach');
    setCoachSpeech(step.why || 'Check the task requirements above.');
    sounds.speak(step.why || 'Check task requirements');
  };

  const handleNextStep = () => {
    sounds.playTap();
    if (stepIndex < activeStepPool.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      sounds.playCorrect();
      setIsCompleted(true);
      if (phase === 2) {
        onFinish(score);
        sounds.playFanfare();
      }
    }
  };

  const handleRestartFull = (targetPhase: number = 1) => {
    sounds.playTap();
    setPhase(targetPhase);
    setActiveStepPool(derivedSteps);
    setStepIndex(0);
    setScore(0);
    setMissedSteps([]);
    setIsCompleted(false);
  };

  // Helper icon map
  const getStepIcon = (type: string, priority?: string) => {
    const map: Record<string, string> = {
      menu: '▣',
      orders: '≡',
      location: '⌖',
      scan: '⌕',
      sku: '◇',
      qty: '#',
      shortage: '!',
      tote: '▤',
      handover: '→',
      bottle: '🧴',
      spray: '🚿',
      wipe: '🧹',
      safety: '🛡️',
      check: '✓',
    };
    return map[type?.toLowerCase()] || (priority?.toLowerCase().includes('crit') ? '!' : '▣');
  };

  // Visual slot renderer (Screenshot 3 & HUD)
  const renderVisualSlot = (currentStep: SimulatorStep) => {
    const type = currentStep.type?.toLowerCase();

    if (type === 'location' || currentStep.location) {
      const loc = currentStep.targetCode || currentStep.location || 'A-03-14';
      return (
        <div className="visual">
          <img
            src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='120' viewBox='0 0 400 120'><rect width='400' height='120' fill='%23102334'/><rect x='20' y='20' width='360' height='80' rx='8' fill='%2319354d'/><rect x='180' y='35' width='160' height='50' rx='4' fill='%23d9b036'/><rect x='190' y='45' width='6' height='30' fill='%23111'/><rect x='202' y='45' width='4' height='30' fill='%23111'/><rect x='210' y='45' width='10' height='30' fill='%23111'/><rect x='225' y='45' width='4' height='30' fill='%23111'/><rect x='233' y='45' width='8' height='30' fill='%23111'/><text x='250' y='68' font-family='monospace' font-weight='900' font-size='18' fill='%23111'>A-03-14</text></svg>"
            alt="Location Target"
          />
          <div className="visualOverlay">
            <div className="visualLabel">
              <small>Find the location</small>
              <strong>{loc}</strong>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'scan' || type === 'sku') {
      const code = currentStep.sku || currentStep.targetCode || 'SKU NB-A5-BL';
      return (
        <div className="scanner">
          <div className="scannerTop">
            <span>WMS · ITEM VERIFY</span>
            <span>READY</span>
          </div>
          <div className="scannerBar"></div>
          <div className="scannerValue">
            Task SKU <b>{code}</b>
          </div>
        </div>
      );
    }

    if (type === 'tote') {
      const toteCode = currentStep.targetCode || 'T-221';
      return (
        <div className="scanner">
          <div className="scannerTop">
            <span>ORDER INTEGRITY</span>
            <span>WMS BUFFER</span>
          </div>
          <div className="scannerBar"></div>
          <div className="scannerValue">
            Order <b>{(currentStep as any).taskOrder || 'SO-4471'}</b> · Tote <b>{toteCode}</b>
          </div>
        </div>
      );
    }

    return null;
  };

  // Phase Title Helper
  const getPhaseTitle = (p: number) => {
    if (p === 0) return 'WATCH';
    if (p === 1) return 'YOUR TURN';
    return 'SOLO CHECK';
  };

  const categoryName = lesson?.category || 'SOP';

  // Completion Assessment Screen (Screenshot 4)
  if (isCompleted) {
    const totalStepsCount = activeStepPool.length;
    const firstTimeCorrectCount = Math.max(0, totalStepsCount - missedSteps.length);
    const accuracyPct = Math.round((firstTimeCorrectCount / totalStepsCount) * 100);
    const isReady = firstTimeCorrectCount >= Math.ceil(totalStepsCount * 0.8) && !safetyMissedInTest;

    const missedStepItems = activeStepPool.filter((_, idx) => missedSteps.includes(idx));

    return (
      <div className="fixed inset-0 z-50 bg-[#1b1b1c] overflow-y-auto guruji-coach-wrapper">
        <div className="guruji-coach-app">
          {/* Header */}
          <header className="header">
            <div className="brand">GURUJI · WORK COACH</div>
            <div className="live">
              <i></i>RESULT
            </div>
          </header>

          <main className="report">
            {/* Readiness Card */}
            <div className="readiness">
              <span className={`readyPill ${isReady ? '' : 'coaching'}`}>
                {isReady ? 'READY FOR THE FLOOR' : 'COACHING NEEDED'}
              </span>
              <div className="score">
                {firstTimeCorrectCount}
                <span> / {totalStepsCount} first-time correct</span>
              </div>
              <div className="metrics">
                <div className="metric">
                  <small>Accuracy</small>
                  <b>{accuracyPct}%</b>
                </div>
                <div className="metric">
                  <small>Support</small>
                  <b>{missedSteps.length ? `${missedSteps.length} steps` : 'None'}</b>
                </div>
              </div>
            </div>

            {/* Focus List */}
            <div className="fix">
              <h3>{missedSteps.length ? 'Focus before the next shift' : 'Strong work'}</h3>
              {missedSteps.length > 0 ? (
                missedStepItems.map((ms, idx) => (
                  <div className="fixRow" key={idx}>
                    <b>{ms.title}</b>
                    <span>{ms.why}</span>
                  </div>
                ))
              ) : (
                <div className="fixRow">
                  <b>Independent Execution</b>
                  <span>You completed all critical operational decisions without intervention.</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="introActions">
              {phase === 0 ? (
                <button className="primary" onClick={() => handleRestartFull(1)}>
                  Continue to Guide Me →
                </button>
              ) : phase === 1 ? (
                <button className="primary" onClick={() => handleRestartFull(2)}>
                  Continue to Test Me →
                </button>
              ) : (
                <button className="secondary" onClick={() => handleRestartFull(1)}>
                  Run again
                </button>
              )}
              <button
                className={phase === 0 ? 'secondary' : 'primary'}
                onClick={() => {
                  sounds.playTap();
                  onClose();
                }}
              >
                Back to overview
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Task Card Values
  const currentItemLabel = (step as any).taskTitle || step.item || step.title;
  const currentItemSub = (step as any).taskItem || (step.sku ? `SKU ${step.sku}` : step.coachTip || 'Standard Operating Action');
  const targetLabel = step.type === 'location' ? 'TARGET' : step.type === 'shortage' ? 'NEEDED' : step.type === 'tote' ? 'TOTE' : 'TARGET';
  const targetVal = step.targetCode || step.location || (step.targetQty ? `${step.targetQty} Units` : 'Standard Spec');
  const qtyVal = step.targetQty !== undefined ? String(step.targetQty) : (step.type === 'shortage' ? '2' : '✓');
  const currentPriority = step.priority || 'EXPRESS';
  const progressPct = ((stepIndex + 1) / activeStepPool.length) * 100;

  const isNextDisabled =
    (phase === 0 && selectedChoiceId === null) ||
    (phase === 1 && coachStatus !== 'correct') ||
    (phase === 2 && selectedChoiceId === null);

  return (
    <div className="fixed inset-0 z-50 bg-[#1b1b1c] overflow-y-auto guruji-coach-wrapper">
      <div className="guruji-coach-app">
        <div className="screen work">
          {/* Header */}
          <header className="header">
            <div className="brand">
              <button onClick={onClose} className="exit-btn" aria-label="Exit simulator">
                Exit
              </button>
              <span>GURUJI · WORK COACH</span>
            </div>
            <div className="live">
              <i></i>
              {categoryName.toUpperCase()} · LIVE
            </div>
          </header>

          {/* Progress Bar with Nodes */}
          <div className="progress">
            <div className="progressLine">
              <div className="progressFill" style={{ width: `${progressPct}%` }}></div>
            </div>
            <div className="nodes">
              {activeStepPool.map((_, i) => (
                <span
                  key={i}
                  className={`node ${i < stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}
                ></span>
              ))}
            </div>
          </div>

          {/* Task Header & Radiant Hero Task Card */}
          <section className="task">
            <div className="taskMeta">
              <span className="phase">
                <i className="dot"></i>
                {getPhaseTitle(phase)}
              </span>
              <span className="counter">
                {String(stepIndex + 1).padStart(2, '0')} / {String(activeStepPool.length).padStart(2, '0')}
              </span>
            </div>

            <div
              className={`taskCard heroTask ${
                coachStatus === 'correct'
                  ? 'state-correct'
                  : coachStatus === 'wrong'
                  ? 'state-wrong'
                  : coachStatus === 'coach'
                  ? 'state-coach'
                  : ''
              }`}
            >
              <div className="heroInner">
                <div className="taskHead">
                  <div>
                    <h2 className="taskTitle">{step.title}</h2>
                    <div className="taskSub">
                      {(step as any).taskOrder || lesson?.title || 'SOP'} · {step.item || step.sku || 'Standard Task'}
                    </div>
                  </div>
                  <span className="priority">{currentPriority}</span>
                </div>

                <div className="item">
                  <div className="itemIcon">{getStepIcon(step.type, step.priority)}</div>
                  <div>
                    <b>{currentItemLabel}</b>
                    <span>{currentItemSub}</span>
                  </div>
                </div>

                {step.type !== 'menu' && (
                  <div className="target">
                    <div className="targetBox">
                      <label>{targetLabel}</label>
                      <strong>{targetVal}</strong>
                    </div>
                    <div className="targetBox qty">
                      <label>Qty</label>
                      <strong>{qtyVal}</strong>
                    </div>
                  </div>
                )}

                <div className="heroAccent">
                  <i></i>
                  {step.type === 'menu'
                    ? 'CHOOSE THE WORK QUEUE'
                    : step.type === 'location'
                    ? 'VERIFY THE PHYSICAL LOCATION'
                    : 'EXECUTE OPERATIONAL MOVE'}
                </div>
              </div>
            </div>
          </section>

          {/* Action Section */}
          <section className="action">
            {renderVisualSlot(step)}

            <h3 className="question">{step.question || step.title}</h3>

            {/* Choices Grid */}
            <div className="choices">
              {step.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                const isDisabled = disabledChoiceIds.includes(choice.id);

                let choiceStateClass = '';
                if (isSelected) {
                  choiceStateClass = choice.isCorrect ? 'correct' : 'wrong';
                } else if (isDisabled) {
                  choiceStateClass = 'disabled';
                }

                return (
                  <button
                    key={choice.id}
                    className={`choice ${choiceStateClass}`.trim()}
                    onClick={() => handleChoiceClick(choice.id, choice.isCorrect)}
                    disabled={
                      phase === 0 ||
                      isDisabled ||
                      (selectedChoiceId !== null && phase === 2)
                    }
                  >
                    <div>
                      <strong>{choice.title}</strong>
                      {choice.subtitle && <small>{choice.subtitle}</small>}
                    </div>

                    {isSelected && (
                      <span className="mark">
                        {choice.isCorrect ? '✓' : '×'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Guruji Coaching Bubble */}
            <div className="guru" id="guru">
              <div className="gMark">G</div>
              <div className={`gBubble ${isBubbleBad ? 'bad' : ''}`}>
                <b>GURUJI</b>
                <span>{coachSpeech}</span>
              </div>
            </div>
          </section>

          {/* Bottom Action Footer */}
          <div className="bottom">
            {phase === 1 && (
              <button className="showMe" onClick={handleShowMe}>
                Show me
              </button>
            )}

            <button
              className="next"
              onClick={handleNextStep}
              disabled={isNextDisabled}
            >
              {stepIndex === activeStepPool.length - 1 ? 'Finish' : 'Continue'}
            </button>
          </div>
        </div>

        {/* Integrated Trainer & Micro-lesson Modals */}
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
    </div>
  );
}

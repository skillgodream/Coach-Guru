/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import ScanModal from './components/ScanModal';
import UploadModal from './components/UploadModal';
import AiUnderstandModal from './components/AiUnderstandModal';
import WelcomeJourneyModal from './components/WelcomeJourneyModal';
import ExperiencedCheckModal from './components/ExperiencedCheckModal';
import AskTrainerModal from './components/AskTrainerModal';
import MicroLessonSheet from './components/MicroLessonSheet';
import LessonOverview from './components/LessonOverview';
import IntroSlideDeck from './components/IntroSlideDeck';
import SimulatorScreen from './components/SimulatorScreen';
import LibraryView from './components/LibraryView';
import ProgressView from './components/ProgressView';
import ProfileView from './components/ProfileView';
import BentoArchitectureShowcase from './components/BentoArchitectureShowcase';
import ValidationErrorModal from './components/ValidationErrorModal';
import { MeetGurujiScreen } from './screens/MeetGurujiScreen';
import { HomeScreen } from './screens/HomeScreen';

import { INITIAL_LESSONS } from './data/lessonsData';
import ProcessPassportModal from './components/ProcessPassportModal';
import { buildProcessPassport, perceiveImage } from './utils/blueprintEngine';
import { ProcessPassport, PerceiveObservation, TabType, Lesson, ExperienceLevel } from './types';
import { sounds } from './utils/audio';
import { ExtractedDocument } from './utils/documentExtractor';
import { validateSourceFidelity } from './utils/sourceValidator';
import { generateDomainNeutralLesson } from './utils/domainNeutralGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [showBentoShowcase, setShowBentoShowcase] = useState<boolean>(false);
  const [isSopOptionsOpen, setIsSopOptionsOpen] = useState<boolean>(false);

  // Navigation & Flow State:
  const [isScanOpen, setIsScanOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // Validation Error State:
  const [validationError, setValidationError] = useState<{ filename: string; reason: string } | null>(null);

  // AI Pipeline State:
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [analyzingSop, setAnalyzingSop] = useState<{
    title: string;
    lesson: Lesson;
    confirmationText?: string;
    filename?: string;
  } | null>(null);

  const [activePassport, setActivePassport] = useState<ProcessPassport>(() =>
    buildProcessPassport('Warehouse Order Picking', 'Picker')
  );
  const [perceiveObservation, setPerceiveObservation] = useState<PerceiveObservation>(() =>
    perceiveImage('SOP_Page.png')
  );
  const [isPassportModalOpen, setIsPassportModalOpen] = useState<boolean>(false);

  // Onboarding Journey States:
  const [welcomeLesson, setWelcomeLesson] = useState<Lesson | null>(null);
  const [isExperiencedCheckOpen, setIsExperiencedCheckOpen] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Active Learning Mode States:
  const [isIntroDeckOpen, setIsIntroDeckOpen] = useState<boolean>(false);
  const [activeSimulator, setActiveSimulator] = useState<Lesson | null>(null);
  const [simulatorPhase, setSimulatorPhase] = useState<number>(1);

  // Omnipresent Stage Controls:
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState<boolean>(false);
  const [isMicroLessonOpen, setIsMicroLessonOpen] = useState<boolean>(false);
  const [currentContextTitle, setCurrentContextTitle] = useState<string>('Standard Operating Procedure');

  const isPipelineProcessingRef = useRef<boolean>(false);

  /**
   * AUTHORITATIVE SOP PIPELINE HANDLER
   * Extracted Document -> Validation -> Domain Neutral Generator -> Lesson Generation -> Play Lesson
   */
  const handleProcessExtractedDocument = useCallback(async (extractedDoc: ExtractedDocument) => {
    if (isPipelineProcessingRef.current) {
      console.warn('[SOP Pipeline] Transition already in progress, ignoring duplicate trigger.');
      return;
    }
    isPipelineProcessingRef.current = true;
    setIsProcessing(true);
    console.log('[SOP Pipeline START] Processing extracted document:', extractedDoc.filename);

    try {
      // 1. CLEAR PREVIOUS SESSION STATE (Cross-session contamination protection)
      setSelectedLesson(null);
      setActiveSimulator(null);
      setWelcomeLesson(null);
      setIsIntroDeckOpen(false);
      setIsExperiencedCheckOpen(false);
      setValidationError(null);

      // 2. SOURCE FIDELITY VALIDATION
      const validation = validateSourceFidelity(extractedDoc);

      if (!validation.isValid) {
        console.error('[SOP Pipeline REJECTED]:', validation.errorReason);
        setValidationError({
          filename: extractedDoc.filename,
          reason: validation.errorReason || 'Unusable or corrupt document.',
        });
        return; // STOP IMMEDIATELY! NEVER FALLBACK TO PICKER OR DEFAULT LESSON!
      }

      // 3. GENERATE OPERATIONAL BLUEPRINT VIA SERVER LLM OR LOCAL BRAIN
      let opBlueprint;
      try {
        const res = await fetch('/api/gemini/generate-blueprint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawText: extractedDoc.rawText,
            fileBase64: extractedDoc.fileBase64,
            mimeType: extractedDoc.mimeType,
            filename: extractedDoc.filename,
            fileHash: extractedDoc.fileHash,
            pageCount: extractedDoc.pageCount,
            wordCount: extractedDoc.wordCount,
          }),
        });
        const data = await res.json();
        if (data.success && data.blueprint && data.blueprint.operational_steps) {
          console.log('[SOP Pipeline SUCCESS] Generated Operational Blueprint via Gemini Server LLM');
          opBlueprint = data.blueprint;
        }
      } catch (err) {
        console.warn('[SOP Pipeline] Server LLM unavailable, using local operational brain');
      }

      // 4. DOMAIN-NEUTRAL BLUEPRINT & LESSON GENERATION
      const { lesson, passport, blueprint } = generateDomainNeutralLesson(extractedDoc, opBlueprint);

      // 5. SECONDARY FIDELITY CHECK ON GENERATED LESSON
      const lessonValidation = validateSourceFidelity(extractedDoc, lesson, blueprint, passport);
      if (!lessonValidation.isValid) {
        console.error('[SOP Pipeline REJECTED Lesson]:', lessonValidation.errorReason);
        setValidationError({
          filename: extractedDoc.filename,
          reason: lessonValidation.errorReason || 'Generated lesson failed source fidelity validation.',
        });
        return; // STOP IMMEDIATELY! NEVER FALLBACK TO PICKER OR DEFAULT LESSON!
      }

      // Update state with newly generated document-driven lesson
      setCurrentContextTitle(lesson.title);
      setActivePassport(passport);
      setPerceiveObservation(perceiveImage(`${extractedDoc.filename}`));

      setLessons((prev) => {
        const exists = prev.some((l) => l.id === lesson.id);
        if (exists) {
          return prev.map((l) => (l.id === lesson.id ? lesson : l));
        }
        return [lesson, ...prev];
      });

      setSelectedLesson(lesson);

      setAnalyzingSop({
        title: lesson.title,
        lesson,
        confirmationText: extractedDoc.confirmationText,
        filename: extractedDoc.filename,
      });
      setIsProcessing(false);
      isPipelineProcessingRef.current = false;
    } catch (err) {
      console.error('[SOP Pipeline ERROR]:', err);
      setIsProcessing(false);
      isPipelineProcessingRef.current = false;
    }
  }, []);

  // Preset SOP selection from Library / Demo
  const handleSelectSop = (lessonId: string, customTitle?: string) => {
    const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];
    const title = customTitle || lesson.title;
    setCurrentContextTitle(title);

    // Clear previous simulation state
    setSelectedLesson(null);
    setActiveSimulator(null);
    setIsIntroDeckOpen(false);

    if (lesson.sourceMeta?.rawText) {
      handleProcessExtractedDocument({
        filename: lesson.sourceMeta.filename,
        rawText: lesson.sourceMeta.rawText,
        wordCount: lesson.sourceMeta.wordCount,
        pageCount: lesson.sourceMeta.pageCount,
        fileHash: lesson.sourceMeta.fileHash,
        confirmationText: lesson.sourceMeta.confirmationText,
        diagnostics: {
          totalChars: lesson.sourceMeta.rawText.length,
          readableChars: lesson.sourceMeta.rawText.length,
          controlChars: 0,
          replacementChars: 0,
          wordCount: lesson.sourceMeta.wordCount,
          pageCount: lesson.sourceMeta.pageCount,
        },
        mimeType: 'text/plain',
        extractedAt: new Date().toISOString(),
      });
    } else {
      setSelectedLesson(lesson);
      setAnalyzingSop({
        title,
        lesson,
        confirmationText: 'Loaded verified SOP checklist',
        filename: lesson.title,
      });
    }
  };

  const handleAiUnderstandComplete = () => {
    if (analyzingSop) {
      setSelectedLesson(analyzingSop.lesson);
      setAnalyzingSop(null);
    }
  };

  // ... inside App return block ...

  {/* Ensure LessonOverview and following stages are visible regardless of activeTab */}
  {selectedLesson && !activeSimulator && !isIntroDeckOpen && !isExperiencedCheckOpen && (
    <LessonOverview
      lesson={selectedLesson}
      onBack={() => {
        setSelectedLesson(null);
        setWelcomeLesson(null);
      }}
      onOpenIntroDeck={() => setIsIntroDeckOpen(true)}
      onStartSimulation={(phase) => handleStartSimulation(phase)}
      onAskTrainer={() => setIsTrainerModalOpen(true)}
    />
  )}

  // Learner Journey Start-point Branching:
  const handleSelectExperienceLevel = (level: ExperienceLevel) => {
    const target = welcomeLesson || lessons[0];
    setWelcomeLesson(null);

    if (level === 'experienced') {
      setIsExperiencedCheckOpen(true);
    } else {
      setSelectedLesson(target);
      setIsIntroDeckOpen(true);
    }
  };

  const handleExperiencedCheckPass = () => {
    const target = welcomeLesson || selectedLesson || lessons[0];
    setIsExperiencedCheckOpen(false);
    setSelectedLesson(target);
    handleStartSimulation(0, target);
  };

  const handleExperiencedCheckFail = () => {
    const target = welcomeLesson || selectedLesson || lessons[0];
    setIsExperiencedCheckOpen(false);
    setSelectedLesson(target);
    setIsIntroDeckOpen(true);
  };

  const handleStartSimulation = (phase: number = 1, targetLesson?: Lesson) => {
    const lesson = targetLesson || selectedLesson || lessons[0];
    setSimulatorPhase(phase);
    setActiveSimulator(lesson);
    setSelectedLesson(lesson);
    setIsIntroDeckOpen(false);
  };

  const handleSimulationFinish = (score: number) => {
    if (!activeSimulator) return;
    setLessons((prev) =>
      prev.map((l) =>
        l.id === activeSimulator.id
          ? {
              ...l,
              progress: Math.min(100, Math.max(l.progress, score)),
              masteryPercentage: Math.min(100, Math.max(l.masteryPercentage, score)),
            }
          : l
      )
    );
  };

  const handleResetData = () => {
    setLessons(INITIAL_LESSONS);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F5] text-[#0E1116] font-sans relative selection:bg-purple-100 selection:text-purple-900">
      {/* Active Tab Screen Render */}
      {activeTab === 'home' && (
        <main className="flex-1 flex flex-col pb-24 max-w-lg mx-auto w-full animate-in fade-in duration-200">
          <MeetGurujiScreen
            onContinue={() => {
              sounds.playTap();
              setIsSopOptionsOpen(true);
            }}
          />

          {/* Frosted Glass SOP Selection Drawer */}
          {isSopOptionsOpen && (
            <div className="fixed inset-0 z-50 bg-[#0E1116]/60 backdrop-blur-md flex items-end justify-center p-0 sm:p-4 animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-8 duration-200">
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                      Step 1 of 4
                    </span>
                    <h3 className="text-xl font-black text-[#0E1116] mt-2">Choose an SOP to Begin</h3>
                  </div>
                  <button
                    onClick={() => setIsSopOptionsOpen(false)}
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 cursor-pointer"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setIsSopOptionsOpen(false);
                      setIsScanOpen(true);
                    }}
                    className="w-full h-16 rounded-full bg-[#0E1116] hover:bg-black text-white flex items-center justify-center gap-3 text-base font-bold shadow-lg active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="text-xl">📷</span>
                    <span>1. Scan the SOP</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playTap();
                      setIsSopOptionsOpen(false);
                      setIsUploadOpen(true);
                    }}
                    className="w-full h-15 rounded-full bg-white border-2 border-slate-200 hover:border-slate-900 text-slate-900 flex items-center justify-center gap-3 text-base font-bold shadow-2xs active:scale-98 transition-all cursor-pointer"
                  >
                    <span className="text-xl">📄</span>
                    <span>2. Upload the SOP</span>
                  </button>

                  <button
                    onClick={() => {
                      sounds.playTap();
                      setIsSopOptionsOpen(false);
                      setActiveTab('library');
                    }}
                    className="w-full py-3 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Browse existing domain SOPs in Library →</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {activeTab === 'library' && (
        <main className="flex-1 flex flex-col max-w-lg mx-auto w-full animate-in fade-in duration-200">
          <LibraryView
            lessons={lessons}
            onSelectLesson={(lesson) => {
              handleSelectSop(lesson.id, lesson.title);
            }}
          />
        </main>
      )}

      {activeTab === 'progress' && (
        <main className="flex-1 flex flex-col max-w-lg mx-auto w-full animate-in fade-in duration-200">
          <ProgressView
            lessons={lessons}
            onStartSimulation={(lessonId) => {
              const found = lessons.find((l) => l.id === lessonId) || lessons[0];
              handleSelectSop(found.id, found.title);
            }}
          />
        </main>
      )}

      {activeTab === 'profile' && (
        <main className="flex-1 flex flex-col max-w-lg mx-auto w-full animate-in fade-in duration-200">
          <ProfileView
            onResetData={handleResetData}
            onOpenBentoShowcase={() => setShowBentoShowcase(true)}
            onOpenPassport={() => setIsPassportModalOpen(true)}
          />
        </main>
      )}

      {/* Ensure LessonOverview and following stages are visible regardless of activeTab */}
      {selectedLesson && !activeSimulator && !isIntroDeckOpen && !isExperiencedCheckOpen && (
        <LessonOverview
          lesson={selectedLesson}
          onBack={() => {
            setSelectedLesson(null);
            setWelcomeLesson(null);
          }}
          onOpenIntroDeck={() => setIsIntroDeckOpen(true)}
          onStartSimulation={(phase) => handleStartSimulation(phase)}
          onAskTrainer={() => setIsTrainerModalOpen(true)}
        />
      )}

      {/* Floating Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* 1. STARTING OPTION: Scan the SOP Modal */}
      <ScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onScanSuccess={(extractedDoc) => {
          setIsScanOpen(false);
          handleProcessExtractedDocument(extractedDoc);
        }}
      />

      {/* 2. STARTING OPTION: Upload the SOP Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(extractedDoc) => {
          setIsUploadOpen(false);
          handleProcessExtractedDocument(extractedDoc);
        }}
      />

      {/* SOURCE FIDELITY VALIDATION ERROR MODAL */}
      <ValidationErrorModal
        isOpen={validationError !== null}
        filename={validationError?.filename || 'Document'}
        errorReason={validationError?.reason || 'Content cannot be used.'}
        onClose={() => setValidationError(null)}
        onTryAnother={() => {
          setValidationError(null);
          setIsUploadOpen(true);
        }}
      />

      {/* TRANSITION: AI Observes -> Understands SOP -> Ready */}
      <AiUnderstandModal
        isOpen={analyzingSop !== null}
        sopTitle={analyzingSop?.title || ''}
        confirmationText={analyzingSop?.confirmationText}
        filename={analyzingSop?.filename}
        onComplete={handleAiUnderstandComplete}
      />

      {/* STEP 1: WELCOME ONBOARDING JOURNEY: New / Some / Experienced */}
      {welcomeLesson && (
        <WelcomeJourneyModal
          lesson={welcomeLesson}
          isOpen={welcomeLesson !== null}
          onClose={() => setWelcomeLesson(null)}
          onSelectLevel={handleSelectExperienceLevel}
          onAskTrainer={() => setIsTrainerModalOpen(true)}
        />
      )}

      {/* STEP 2 (Experienced branch): 4-Question Check */}
      <ExperiencedCheckModal
        isOpen={isExperiencedCheckOpen}
        onClose={() => setIsExperiencedCheckOpen(false)}
        onPass={handleExperiencedCheckPass}
        onFail={handleExperiencedCheckFail}
        onAskTrainer={() => setIsTrainerModalOpen(true)}
      />

      {/* STEP 3: 4 LEARNING MODES SCREEN (Know It, Show Me, Guide Me, Test Me) 
          Handled globally via selectedLesson state */}
      
      {/* MODE 1: KNOW IT (cards -> tool explorer -> golden rules -> ready) */}
      {isIntroDeckOpen && (
        <IntroSlideDeck
          lesson={selectedLesson || undefined}
          onClose={() => setIsIntroDeckOpen(false)}
          onStartSimulation={() => handleStartSimulation(0)}
          onAskTrainer={() => setIsTrainerModalOpen(true)}
        />
      )}


      {/* MODES 2, 3, 4: SHOW ME (0), GUIDE ME (1), TEST ME (2) */}
      {activeSimulator && (
        <SimulatorScreen
          initialPhase={simulatorPhase}
          lesson={activeSimulator}
          sourceMeta={activeSimulator.sourceMeta}
          onClose={() => setActiveSimulator(null)}
          onFinish={handleSimulationFinish}
          onOpenBasics={() => {
            setIsIntroDeckOpen(true);
          }}
          onAskTrainer={() => setIsTrainerModalOpen(true)}
        />
      )}

      {/* OMNIPRESENT: Ask My Trainer Modal */}
      <AskTrainerModal
        isOpen={isTrainerModalOpen}
        onClose={() => setIsTrainerModalOpen(false)}
        currentStepTitle={currentContextTitle}
      />

      {/* P0/P1/P2 Process Passport Trainer Review Modal */}
      <ProcessPassportModal
        isOpen={isPassportModalOpen}
        passport={activePassport}
        perceiveResult={perceiveObservation}
        onClose={() => setIsPassportModalOpen(false)}
        onApprovePassport={(approved) => {
          setActivePassport(approved);
        }}
      />

      {/* OMNIPRESENT: On The Floor Quick Micro-Lessons */}
      <MicroLessonSheet
        isOpen={isMicroLessonOpen}
        onClose={() => setIsMicroLessonOpen(false)}
        onOpenBasics={() => {
          setIsIntroDeckOpen(true);
        }}
        onAskTrainer={() => setIsTrainerModalOpen(true)}
      />

      {/* Fullscreen Bento Architecture Showcase */}
      {showBentoShowcase && (
        <div className="fixed inset-0 z-50 bg-[#F7F7F5] dark:bg-[#0A0D12] overflow-y-auto animate-in fade-in duration-200">
          <BentoArchitectureShowcase onClose={() => setShowBentoShowcase(false)} />
        </div>
      )}
      {isProcessing && (
        <div className="fixed inset-0 z-[60] bg-[#0E1116]/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
           <div className="w-16 h-16 border-4 border-white/20 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
           <h2 className="text-xl font-bold text-white mb-2">Analyzing document...</h2>
           <p className="text-sm text-slate-300">Building your operational training experience.</p>
        </div>
      )}
    </div>
  );
}

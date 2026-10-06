/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { MeetGurujiScreen } from './screens/MeetGurujiScreen';

import { INITIAL_LESSONS } from './data/lessonsData';
import ProcessPassportModal from './components/ProcessPassportModal';
import { buildProcessPassport, perceiveImage, buildBlueprintV1 } from './utils/blueprintEngine';
import { ProcessPassport, PerceiveObservation, TabType, Lesson, ExperienceLevel } from './types';
import { sounds } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [showBentoShowcase, setShowBentoShowcase] = useState<boolean>(false);
  const [isSopOptionsOpen, setIsSopOptionsOpen] = useState<boolean>(false);

  // Navigation & Flow State:
  const [isScanOpen, setIsScanOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  // AI Pipeline (P0 Passport, P1 Perceive, P2 Blueprint):
  const [analyzingSop, setAnalyzingSop] = useState<{ title: string; lesson: Lesson } | null>(null);
  const [activePassport, setActivePassport] = useState<ProcessPassport>(() =>
    buildProcessPassport('Warehouse Order Picking', 'Picker')
  );
  const [perceiveObservation, setPerceiveObservation] = useState<PerceiveObservation>(() =>
    perceiveImage('SOP_Page.png')
  );
  const [isPassportModalOpen, setIsPassportModalOpen] = useState<boolean>(false);

  // Step 3: Learner Journey Onboarding:
  const [welcomeLesson, setWelcomeLesson] = useState<Lesson | null>(null);
  const [isExperiencedCheckOpen, setIsExperiencedCheckOpen] = useState<boolean>(false);

  // Step 4: Choose 1 of 4 Learning Modes
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Step 5: Active Learning Modes
  const [isIntroDeckOpen, setIsIntroDeckOpen] = useState<boolean>(false);
  const [activeSimulator, setActiveSimulator] = useState<Lesson | null>(null);
  const [simulatorPhase, setSimulatorPhase] = useState<number>(1);

  // Omnipresent Stage Controls:
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState<boolean>(false);
  const [isMicroLessonOpen, setIsMicroLessonOpen] = useState<boolean>(false);
  const [currentContextTitle, setCurrentContextTitle] = useState<string>('Warehouse Picking Floor');

  // Flow Handler: User picks an SOP -> AI Observes & Understands -> Welcome Onboarding
  const handleSelectSop = (lessonId: string, customTitle?: string) => {
    const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];
    const title = customTitle || lesson.title;
    setCurrentContextTitle(title);

    // Run P0 Passport draft & P1 Perceive observation
    const draftPassport = buildProcessPassport(title, 'Picker');
    const p1Result = perceiveImage(`${title}_SOP.png`);
    setActivePassport(draftPassport);
    setPerceiveObservation(p1Result);

    setAnalyzingSop({ title, lesson });
  };

  const handleAiUnderstandComplete = () => {
    if (analyzingSop) {
      const targetLesson = analyzingSop.lesson;
      setAnalyzingSop(null);
      setWelcomeLesson(targetLesson);
    }
  };

  // Learner Journey Start-point Branching:
  // New / Some -> KNOW IT
  // Experienced -> 4-Question Check
  const handleSelectExperienceLevel = (level: ExperienceLevel) => {
    const target = welcomeLesson || lessons[0];
    setWelcomeLesson(null);

    if (level === 'experienced') {
      setIsExperiencedCheckOpen(true);
    } else {
      // New / Some -> Route to Know It (cards -> tool explorer -> quick check -> ready)
      setSelectedLesson(target);
      setIsIntroDeckOpen(true);
    }
  };

  // 4-Question Check: Pass >= 75% -> Skip cards to Show Me / Guide Me
  const handleExperiencedCheckPass = () => {
    const target = welcomeLesson || selectedLesson || lessons[0];
    setIsExperiencedCheckOpen(false);
    setSelectedLesson(target);
    handleStartSimulation(0, target); // Launch Show Me demo
  };

  // 4-Question Check: Fail < 75% -> Route to Know It
  const handleExperiencedCheckFail = () => {
    const target = welcomeLesson || selectedLesson || lessons[0];
    setIsExperiencedCheckOpen(false);
    setSelectedLesson(target);
    setIsIntroDeckOpen(true); // Route to Know It
  };

  // Launch Simulator with specific phase:
  // 0: Show Me (Demo)
  // 1: Guide Me (Guided Practice)
  // 2: Test Me (Solo Assessment)
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

          {/* Frosted Glass SOP Selection Drawer when 'Tap to explore' is tapped */}
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
                    className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Option 1: Scan the SOP */}
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

                  {/* Option 2: Upload the SOP */}
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

                  {/* Link to existing SOPs in Library */}
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setIsSopOptionsOpen(false);
                      setActiveTab('library');
                    }}
                    className="w-full py-3 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Browse existing warehouse SOPs in Library →</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {activeTab === 'library' && (
        <LibraryView
          lessons={lessons}
          onSelectLesson={(lesson) => {
            handleSelectSop(lesson.id, lesson.title);
          }}
        />
      )}

      {activeTab === 'progress' && (
        <ProgressView
          lessons={lessons}
          onStartSimulation={(lessonId) => {
            const found = lessons.find((l) => l.id === lessonId) || lessons[0];
            handleSelectSop(found.id, found.title);
          }}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileView
          onResetData={handleResetData}
          onOpenBentoShowcase={() => setShowBentoShowcase(true)}
          onOpenPassport={() => setIsPassportModalOpen(true)}
        />
      )}

      {/* Floating Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* 1. STARTING OPTION: Scan the SOP Modal */}
      <ScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onScanSuccess={(lessonId) => {
          setIsScanOpen(false);
          handleSelectSop(lessonId);
        }}
      />

      {/* 2. STARTING OPTION: Upload the SOP Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(title, lessonId) => {
          setIsUploadOpen(false);
          handleSelectSop(lessonId, title);
        }}
      />

      {/* TRANSITION: AI Observes -> Understands SOP -> Ready */}
      <AiUnderstandModal
        isOpen={analyzingSop !== null}
        sopTitle={analyzingSop?.title || ''}
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

      {/* STEP 2 (Experienced branch): 4-Question Check (Pass >= 75% -> Skip to Show Me) */}
      <ExperiencedCheckModal
        isOpen={isExperiencedCheckOpen}
        onClose={() => setIsExperiencedCheckOpen(false)}
        onPass={handleExperiencedCheckPass}
        onFail={handleExperiencedCheckFail}
        onAskTrainer={() => setIsTrainerModalOpen(true)}
      />

      {/* STEP 3: 4 LEARNING MODES SCREEN (Know It, Show Me, Guide Me, Test Me) */}
      {selectedLesson && !activeSimulator && !isIntroDeckOpen && !isExperiencedCheckOpen && (
        <LessonOverview
          lesson={selectedLesson}
          onBack={() => setSelectedLesson(null)}
          onOpenIntroDeck={() => setIsIntroDeckOpen(true)}
          onStartSimulation={(phase) => handleStartSimulation(phase)}
          onAskTrainer={() => setIsTrainerModalOpen(true)}
        />
      )}

      {/* MODE 1: KNOW IT (cards -> tool explorer -> golden rules -> ready) */}
      {isIntroDeckOpen && (
        <IntroSlideDeck
          onClose={() => setIsIntroDeckOpen(false)}
          onStartSimulation={() => handleStartSimulation(0)} // advances to SHOW ME
          onAskTrainer={() => setIsTrainerModalOpen(true)}
        />
      )}

      {/* MODES 2, 3, 4: SHOW ME (0), GUIDE ME (1), TEST ME (2) */}
      {activeSimulator && (
        <SimulatorScreen
          initialPhase={simulatorPhase}
          onClose={() => setActiveSimulator(null)}
          onFinish={handleSimulationFinish}
          onOpenBasics={() => {
            setIsIntroDeckOpen(true);
          }}
          onAskTrainer={() => setIsTrainerModalOpen(true)}
        />
      )}

      {/* OMNIPRESENT: Ask My Trainer Modal (Accessible in EVERY stage) */}
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

      {/* OMNIPRESENT: On The Floor "Stuck? Ask Guruji" Quick Micro-Lessons */}
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
    </div>
  );
}

import React, { useState } from 'react';
import { X, Zap, ZapOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (lessonId: string) => void;
}

export default function ScanModal({ isOpen, onClose, onScanSuccess }: ScanModalProps) {
  const [torch, setTorch] = useState(false);
  const [scannedTag, setScannedTag] = useState<string | null>(null);

  if (!isOpen) return null;

  const simulateScan = (tagLabel: string, lessonId: string) => {
    sounds.playShutter();
    setScannedTag(tagLabel);
    sounds.playCorrect();
    setTimeout(() => {
      onScanSuccess(lessonId);
      onClose();
      setScannedTag(null);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0D14]/90 backdrop-blur-md flex flex-col justify-between p-6 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white pt-2">
        <button
          onClick={() => {
            sounds.playTap();
            setTorch(!torch);
          }}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            torch ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30' : 'bg-white/15 text-white'
          }`}
          aria-label="Toggle Flashlight"
        >
          {torch ? <Zap size={22} className="fill-current" /> : <ZapOff size={22} />}
        </button>

        <span className="text-xs font-bold uppercase tracking-wider text-white/80 bg-white/10 px-4 py-1.5 rounded-full">
          AI Topic Scanner
        </span>

        <button
          onClick={() => {
            sounds.playTap();
            onClose();
          }}
          className="w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all"
          aria-label="Close Scanner"
        >
          <X size={24} />
        </button>
      </div>

      {/* Center Viewfinder */}
      <div className="flex-1 flex flex-col items-center justify-center my-6">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-[32px] border-2 border-white/30 flex items-center justify-center overflow-hidden bg-slate-900/40 shadow-2xl">
          {/* Reticle Corner Brackets */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t-4 border-l-4 border-blue-400 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t-4 border-r-4 border-blue-400 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b-4 border-l-4 border-blue-400 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-4 border-r-4 border-blue-400 rounded-br-xl" />

          {/* Animated Laser Scan Beam */}
          <div className="absolute inset-x-4 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#38bdf8] animate-pulse top-1/2 -translate-y-1/2" />

          {scannedTag ? (
            <div className="z-10 flex flex-col items-center gap-2 bg-emerald-500/90 text-white px-5 py-3 rounded-2xl shadow-xl animate-in zoom-in-95 duration-150">
              <CheckCircle2 size={32} className="text-white" />
              <p className="text-xs font-black uppercase tracking-wider">Identified Topic</p>
              <p className="text-base font-bold text-center">{scannedTag}</p>
            </div>
          ) : (
            <div className="text-center px-4">
              <Sparkles className="mx-auto mb-2 text-blue-300 animate-bounce" size={28} />
              <p className="text-sm font-semibold text-white/90">Point camera at warehouse item</p>
              <p className="text-xs text-white/60 mt-1">Bin barcode, tote tag, or equipment</p>
            </div>
          )}
        </div>
      </div>

      {/* Simulated Warehouse Tags to Tap */}
      <div className="bg-white/10 rounded-[28px] p-4 text-white border border-white/10">
        <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-3 text-center">
          Tap any tag below to test instant scan:
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => simulateScan('Bin Label A-03-B-2 (Picking)', 'picking-101')}
            className="p-3 bg-white/15 hover:bg-white/25 active:scale-98 rounded-2xl text-left transition-all border border-white/10"
          >
            <span className="text-[10px] uppercase font-bold text-sky-300 block">Bin Label</span>
            <span className="text-sm font-bold text-white block truncate">A-03-B-2</span>
          </button>

          <button
            onClick={() => simulateScan('Order Tote T-221', 'picking-101')}
            className="p-3 bg-white/15 hover:bg-white/25 active:scale-98 rounded-2xl text-left transition-all border border-white/10"
          >
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">Tote Code</span>
            <span className="text-sm font-bold text-white block truncate">T-221 (Picking)</span>
          </button>

          <button
            onClick={() => simulateScan('Safety Zone Cone', 'safety-first')}
            className="p-3 bg-white/15 hover:bg-white/25 active:scale-98 rounded-2xl text-left transition-all border border-white/10"
          >
            <span className="text-[10px] uppercase font-bold text-amber-300 block">Safety Marker</span>
            <span className="text-sm font-bold text-white block truncate">Zone PPE</span>
          </button>

          <button
            onClick={() => simulateScan('Pack Station P2', 'packing-basics')}
            className="p-3 bg-white/15 hover:bg-white/25 active:scale-98 rounded-2xl text-left transition-all border border-white/10"
          >
            <span className="text-[10px] uppercase font-bold text-purple-300 block">Pack Station</span>
            <span className="text-sm font-bold text-white block truncate">Station P2</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/audio';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (sopTitle: string, lessonId: string) => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleSops = [
    { id: 'picking-101', title: 'SOP-WH-042: High-Velocity Order Picking.pdf', category: 'Picking' },
    { id: 'safety-first', title: 'SOP-SAF-018: Aisle Safety & PPE Protocol.docx', category: 'Safety' },
    { id: 'packing-basics', title: 'SOP-PCK-007: Pack Station Handover & Sealing.pdf', category: 'Packing' },
  ];

  const handleSelectDoc = (title: string, lessonId: string) => {
    sounds.playTap();
    setSelectedDoc(title);
    sounds.playCorrect();
    setTimeout(() => {
      onUploadSuccess(title, lessonId);
      onClose();
      setSelectedDoc(null);
    }, 500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectDoc(file.name, 'picking-101');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E1116]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#F7F7F5] rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-8 duration-200">
        {/* Top Header */}
        <div className="p-6 bg-white border-b border-[#E6E8EC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFE6D2] text-[#F27A1A] flex items-center justify-center">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0E1116]">Upload SOP</h2>
              <p className="text-xs font-semibold text-[#66726B]">PDF, DOCX, or text procedure</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-[#F7F7F5] border border-[#E6E8EC] flex items-center justify-center text-[#0E1116] hover:bg-[#E6E8EC]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* File Dropzone */}
          <label className="border-2 border-dashed border-[#E6E8EC] hover:border-[#0E1116] bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors active:scale-[0.99] block">
            <input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-12 h-12 rounded-full bg-[#DCEBFF] text-[#2F6FED] flex items-center justify-center mb-3">
              <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-[#0E1116]">Choose or drop your SOP file</p>
            <p className="text-xs text-[#66726B] font-semibold mt-1">Tap to browse warehouse document</p>
          </label>

          {/* Sample SOPs to pick immediately */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#66726B] mb-2.5">
              Or pick an existing warehouse SOP:
            </p>
            <div className="space-y-2">
              {sampleSops.map((sop) => (
                <button
                  key={sop.id}
                  onClick={() => handleSelectDoc(sop.title, sop.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-98 ${
                    selectedDoc === sop.title
                      ? 'bg-[#DDF3E6] border-[#1FA55E] text-[#14532D]'
                      : 'bg-white border-[#E6E8EC] text-[#0E1116] hover:border-[#0E1116]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-[#2F6FED] shrink-0" />
                    <div>
                      <span className="text-xs font-bold block truncate max-w-[240px]">{sop.title}</span>
                      <span className="text-[10px] font-semibold text-[#66726B] block">{sop.category} Standard Procedure</span>
                    </div>
                  </div>
                  {selectedDoc === sop.title ? (
                    <CheckCircle2 size={18} className="text-[#1FA55E]" />
                  ) : (
                    <ArrowRight size={16} className="text-[#66726B]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Home, BookOpen, BarChart2, User } from 'lucide-react';
import { TabType } from '../types';
import { sounds } from '../utils/audio';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const items: { id: TabType; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md h-[68px] bg-white/95 rounded-full shadow-[0_8px_32px_rgba(16,24,40,0.12)] flex items-center justify-around px-3 z-40 border border-[#E6E8EC]/80 backdrop-blur-md">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => {
              sounds.playTap();
              onSelectTab(item.id);
            }}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-full transition-all duration-200 active:scale-90 ${
              isActive
                ? 'text-[#0E1116] font-bold'
                : 'text-[#66726B] hover:text-[#0E1116] font-semibold'
            }`}
          >
            <div
              className={`p-1.5 rounded-full transition-all ${
                isActive ? 'bg-[#F7F7F5] text-[#0E1116]' : 'text-[#66726B]'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
            </div>
            <span className={`text-[10px] tracking-tight ${isActive ? 'text-[#0E1116] font-bold' : 'text-[#66726B]'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

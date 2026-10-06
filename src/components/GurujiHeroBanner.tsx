import React from 'react';

interface GurujiHeroBannerProps {
  className?: string;
}

export default function GurujiHeroBanner({ className = '' }: GurujiHeroBannerProps) {
  return (
    <div className={`relative w-full flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Soft Pastel Gradient & Ambient Halo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F3EEFF] via-[#EAE5FC] to-[#F7F4FD] pointer-events-none" />

      {/* Subtle curved ambient glow rings in background */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-purple-200/50 -top-8 -right-16 pointer-events-none" />
      <div className="absolute w-[420px] h-[420px] rounded-full border border-indigo-200/40 -top-16 -left-20 pointer-events-none" />

      {/* Central Concentric Ring Container */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
        {/* Outer Glowing Ring */}
        <div className="absolute inset-0 rounded-full border-[2.5px] border-purple-300/60 shadow-[0_0_30px_rgba(168,85,247,0.12)]" />
        <div className="absolute inset-1.5 rounded-full border border-purple-200/40" />
        <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-white/80 via-white/40 to-purple-100/30 backdrop-blur-xs" />

        {/* 3D Rendered Koala Mascot (SVG with high-fidelity clay & shading) */}
        <svg
          viewBox="0 0 320 320"
          className="w-full h-full relative z-10 drop-shadow-[0_16px_24px_rgba(30,27,75,0.16)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Fur Gradients */}
            <radialGradient id="furHead" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#E2E8F0" />
              <stop offset="85%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </radialGradient>
            <radialGradient id="earFluff" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#FDA4AF" />
              <stop offset="65%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#E11D48" />
            </radialGradient>
            <linearGradient id="bodyFur" x1="160" y1="180" x2="160" y2="280" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Coat Gradients */}
            <linearGradient id="coatGrad" x1="120" y1="190" x2="200" y2="270" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            {/* Eye Gradient */}
            <radialGradient id="eyeIris" cx="45%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#B45309" />
              <stop offset="90%" stopColor="#451A03" />
              <stop offset="100%" stopColor="#1E0E04" />
            </radialGradient>

            {/* Pink Tablet Gradient */}
            <linearGradient id="tabletPink" x1="85" y1="180" x2="155" y2="245" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>

            {/* Nose Leather Texture Gradient */}
            <radialGradient id="noseLeather" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="40%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Glasses Metal Wire */}
            <linearGradient id="frameBronze" x1="100" y1="90" x2="220" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#9A3412" />
              <stop offset="50%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            <filter id="shadowSoft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* Contact Ground Shadow */}
          <ellipse cx="160" cy="296" rx="65" ry="10" fill="#0F172A" fillOpacity="0.22" />

          {/* ============ EARS (Big, Fluffy, Koala Shape) ============ */}
          {/* Left Ear Outer Fluff */}
          <g filter="url(#shadowSoft)">
            <circle cx="82" cy="115" r="46" fill="url(#furHead)" />
            <path d="M42 110 Q58 80 82 85 Q92 120 70 145 Z" fill="#F1F5F9" opacity="0.6" />
            {/* Left Ear Pink Center */}
            <ellipse cx="84" cy="116" rx="28" ry="32" fill="url(#earFluff)" />
            {/* Ear inner tufts */}
            <path d="M68 118 Q86 100 88 126" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            <path d="M64 128 Q78 116 82 134" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* Right Ear Outer Fluff */}
          <g filter="url(#shadowSoft)">
            <circle cx="238" cy="115" r="46" fill="url(#furHead)" />
            <path d="M278 110 Q262 80 238 85 Q228 120 250 145 Z" fill="#F1F5F9" opacity="0.6" />
            {/* Right Ear Pink Center */}
            <ellipse cx="236" cy="116" rx="28" ry="32" fill="url(#earFluff)" />
            {/* Ear inner tufts */}
            <path d="M252 118 Q234 100 232 126" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
            <path d="M256 128 Q242 116 238 134" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* ============ BODY & LEGS ============ */}
          {/* Legs & Paws at bottom */}
          <ellipse cx="128" cy="286" rx="18" ry="12" fill="#64748B" />
          {/* Paw Claws Left */}
          <ellipse cx="118" cy="290" rx="3.5" ry="5" fill="#334155" />
          <ellipse cx="127" cy="291" rx="3.5" ry="5.5" fill="#334155" />
          <ellipse cx="136" cy="290" rx="3.5" ry="5" fill="#334155" />

          <ellipse cx="192" cy="286" rx="18" ry="12" fill="#64748B" />
          {/* Paw Claws Right */}
          <ellipse cx="184" cy="290" rx="3.5" ry="5" fill="#334155" />
          <ellipse cx="193" cy="291" rx="3.5" ry="5.5" fill="#334155" />
          <ellipse cx="202" cy="290" rx="3.5" ry="5" fill="#334155" />

          {/* Belly Fluff */}
          <ellipse cx="160" cy="242" rx="38" ry="46" fill="url(#bodyFur)" />
          <ellipse cx="160" cy="245" rx="26" ry="32" fill="#FFFFFF" opacity="0.8" />

          {/* ============ DOCTOR / TRAINER WHITE LAB COAT ============ */}
          {/* Orange inner polo / collar */}
          <path d="M142 195 L160 216 L178 195 Z" fill="#F59E0B" />
          <path d="M148 195 L160 210 L172 195 Z" fill="#D97706" />

          {/* White Lab Coat Body */}
          <path
            d="M120 198 Q140 192 160 196 Q180 192 200 198 L214 274 Q160 280 106 274 Z"
            fill="url(#coatGrad)"
            filter="url(#shadowSoft)"
          />

          {/* Coat Lapels & Split Opening */}
          <path d="M136 195 L150 240 L160 278" stroke="#CBD5E1" strokeWidth="2.5" />
          <path d="M184 195 L170 240 L160 278" stroke="#CBD5E1" strokeWidth="2.5" />

          {/* Coat Pocket with Logo on Right Side */}
          <rect x="176" y="235" width="18" height="20" rx="4" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          {/* Mini 3-dot logo badge */}
          <circle cx="180.5" cy="242" r="2" fill="#3B82F6" />
          <circle cx="185" cy="241" r="2.2" fill="#EF4444" />
          <circle cx="189.5" cy="242" r="2" fill="#F59E0B" />

          {/* ============ HEAD & FACE ============ */}
          <g filter="url(#shadowSoft)">
            {/* Head Silhouette with Soft Cheek Curves */}
            <circle cx="160" cy="144" r="62" fill="url(#furHead)" />

            {/* Cheek Highlights / Fluff */}
            <ellipse cx="114" cy="162" rx="14" ry="18" fill="#F8FAFC" />
            <ellipse cx="206" cy="162" rx="14" ry="18" fill="#F8FAFC" />
            {/* Rosy Cheek Blush */}
            <ellipse cx="118" cy="165" rx="10" ry="7" fill="#FB7185" opacity="0.32" />
            <ellipse cx="202" cy="165" rx="10" ry="7" fill="#FB7185" opacity="0.32" />
          </g>

          {/* Big Leather Koala Nose */}
          <ellipse cx="160" cy="154" rx="18" ry="24" fill="url(#noseLeather)" filter="url(#shadowSoft)" />
          {/* Nose Light Highlight */}
          <ellipse cx="155" cy="146" rx="5" ry="8" fill="#94A3B8" opacity="0.5" />

          {/* Friendly Open Mouth Smile */}
          <path d="M148 180 Q160 192 172 180 Z" fill="#991B1B" />
          <path d="M152 184 Q160 190 168 184" fill="#F87171" />

          {/* ============ BIG WARM EXPRESSIVE EYES ============ */}
          {/* Left Eye */}
          <circle cx="128" cy="138" r="15" fill="#0F172A" />
          <circle cx="128" cy="138" r="14" fill="url(#eyeIris)" />
          <circle cx="128" cy="138" r="9" fill="#020617" />
          {/* Left Eye Reflections */}
          <circle cx="124" cy="133" r="4.5" fill="#FFFFFF" />
          <circle cx="132" cy="142" r="2" fill="#FFFFFF" opacity="0.8" />

          {/* Right Eye */}
          <circle cx="192" cy="138" r="15" fill="#0F172A" />
          <circle cx="192" cy="138" r="14" fill="url(#eyeIris)" />
          <circle cx="192" cy="138" r="9" fill="#020617" />
          {/* Right Eye Reflections */}
          <circle cx="188" cy="133" r="4.5" fill="#FFFFFF" />
          <circle cx="196" cy="142" r="2" fill="#FFFFFF" opacity="0.8" />

          {/* ============ ROUND WIRE GLASSES / SPECTACLES ============ */}
          {/* Left Lens Frame */}
          <circle cx="128" cy="138" r="24" stroke="url(#frameBronze)" strokeWidth="4.5" fill="none" />
          <circle cx="128" cy="138" r="23" stroke="#FDE047" strokeWidth="1" fill="none" opacity="0.4" />
          {/* Right Lens Frame */}
          <circle cx="192" cy="138" r="24" stroke="url(#frameBronze)" strokeWidth="4.5" fill="none" />
          <circle cx="192" cy="138" r="23" stroke="#FDE047" strokeWidth="1" fill="none" opacity="0.4" />
          {/* Glasses Bridge Over Nose */}
          <path d="M152 134 Q160 128 168 134" stroke="url(#frameBronze)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {/* Glasses Outer Temples */}
          <path d="M104 136 L86 130" stroke="url(#frameBronze)" strokeWidth="4" strokeLinecap="round" />
          <path d="M216 136 L234 130" stroke="url(#frameBronze)" strokeWidth="4" strokeLinecap="round" />

          {/* ============ LEFT ARM: HOLDING PINK SCANNER TABLET ============ */}
          <g filter="url(#shadowSoft)">
            {/* White Coat Sleeve */}
            <path d="M116 205 L96 230 Q112 245 125 235 Z" fill="#FFFFFF" />
            {/* Grey Koala Paw Fingers holding tablet */}
            <ellipse cx="122" cy="236" rx="8" ry="7" fill="#64748B" />
            {/* Pink Mobile Tablet / Scanner */}
            <rect
              x="92"
              y="196"
              width="50"
              height="44"
              rx="8"
              transform="rotate(-14 92 196)"
              fill="url(#tabletPink)"
              stroke="#FDA4AF"
              strokeWidth="2"
            />
            {/* Camera dot on back of tablet */}
            <circle cx="106" cy="201" r="2.5" fill="#4C0519" />
            <circle cx="114" cy="200" r="1.5" fill="#4C0519" />
          </g>

          {/* ============ RIGHT ARM: WAVING FRIENDLY PAW ============ */}
          <g filter="url(#shadowSoft)">
            {/* White Coat Sleeve */}
            <path d="M202 205 L226 218 Q234 205 218 196 Z" fill="#FFFFFF" />
            {/* Waving Paw Arm */}
            <ellipse cx="234" cy="216" rx="12" ry="15" fill="#64748B" />
            {/* Paws Fingers (Spread in a wave) */}
            <ellipse cx="226" cy="206" rx="4" ry="7" fill="#475569" />
            <ellipse cx="234" cy="202" rx="4" ry="7.5" fill="#475569" />
            <ellipse cx="243" cy="206" rx="4" ry="7" fill="#475569" />
            <ellipse cx="246" cy="216" rx="4" ry="6" fill="#475569" />
            {/* Soft pink palm pad */}
            <ellipse cx="234" cy="218" rx="6" ry="7" fill="#FDA4AF" opacity="0.75" />
          </g>
        </svg>
      </div>
    </div>
  );
}

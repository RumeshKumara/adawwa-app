'use client';

import { useEffect, useState } from 'react';

export default function LoadingOverlay() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Extends the loader slightly to let the realistic effects shine
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div className="svg-loader-overlay" aria-hidden="true">
      {/* Cinematic dark vignette background */}
      <div className="svg-loader-bg" />

      {/* ── Ultra-Realistic SVG Sigil ── */}
      <svg
        className="svg-loader-sigil"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* 1. Realistic Moon Texture using procedural noise */}
          <filter id="realistic-moon">
            <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="6" result="noise" />
            <feColorMatrix type="matrix" values="
              0.8 0 0 0 0.2
              0.4 0 0 0 0.05
              0.1 0 0 0 0.0
              0 0 0 1 0" in="noise" result="coloredNoise" />
            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="texture" />
            <feBlend mode="multiply" in="texture" in2="SourceGraphic" result="blended" />
            {/* Add a subtle inner shadow for 3D sphere effect */}
            <feDropShadow dx="0" dy="0" stdDeviation="15" floodColor="#000" floodOpacity="0.8" in="blended" />
          </filter>

          {/* 2. Realistic Dynamic Fire Filter */}
          <filter id="realistic-fire">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" values="0.02 0.08; 0.02 0.12; 0.02 0.08" dur="1.5s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feGaussianBlur stdDeviation="1" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 3. Intense Magical Glow */}
          <filter id="intense-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="20" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Realistic Gradients */}
          <radialGradient id="moon-base" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffe6a0" />
            <stop offset="30%" stopColor="#ff9a28" />
            <stop offset="70%" stopColor="#b02800" />
            <stop offset="100%" stopColor="#200400" />
          </radialGradient>

          <radialGradient id="corona-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#d42800" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8d675" />
            <stop offset="25%" stopColor="#d4820a" />
            <stop offset="50%" stopColor="#ffeb99" />
            <stop offset="75%" stopColor="#965400" />
            <stop offset="100%" stopColor="#f8d675" />
          </linearGradient>

          <clipPath id="moon-clip">
            <circle cx="200" cy="200" r="90" />
          </clipPath>
        </defs>

        {/* ── Background Corona & Atmospheric Glow ── */}
        <circle cx="200" cy="200" r="180" fill="url(#corona-glow)" className="svg-corona-pulse" />
        <circle cx="200" cy="200" r="140" fill="url(#corona-glow)" className="svg-corona-pulse" style={{ animationDelay: '-1s' }} />

        {/* ── Procedural Blood-Orange Moon (Real SVG Texture) ── */}
        <g className="svg-moon-breathe">
          {/* Base Moon with craters */}
          <circle cx="200" cy="200" r="90" fill="url(#moon-base)" filter="url(#realistic-moon)" />
          {/* Atmospheric limb darkening */}
          <circle cx="200" cy="200" r="90" fill="none" stroke="#ffeb99" strokeWidth="2" strokeOpacity="0.3" filter="url(#intense-glow)" />
        </g>

        {/* ── Intricate Realistic Metal Rings ── */}
        {/* Outer Ring System */}
        <g className="svg-ring-outer">
          <circle cx="200" cy="200" r="160" fill="none" stroke="url(#gold-metal)" strokeWidth="3" strokeOpacity="0.8" filter="drop-shadow(0 0 6px #d44800)" />
          <circle cx="200" cy="200" r="168" fill="none" stroke="#ff9a28" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 8" />
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i / 36) * Math.PI * 2;
            const isMajor = i % 3 === 0;
            return (
              <line
                key={i}
                x1={200 + Math.cos(angle) * (isMajor ? 152 : 156)}
                y1={200 + Math.sin(angle) * (isMajor ? 152 : 156)}
                x2={200 + Math.cos(angle) * 160}
                y2={200 + Math.sin(angle) * 160}
                stroke="url(#gold-metal)"
                strokeWidth={isMajor ? 2.5 : 1}
                strokeOpacity={isMajor ? 1 : 0.6}
              />
            );
          })}
        </g>

        {/* Inner Counter-Rotating Ring */}
        <g className="svg-ring-middle">
          <circle cx="200" cy="200" r="130" fill="none" stroke="url(#gold-metal)" strokeWidth="1.5" strokeOpacity="0.7" />
          <circle cx="200" cy="200" r="122" fill="none" stroke="#d42800" strokeWidth="2" strokeDasharray="30 15" filter="url(#intense-glow)" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = 200 + Math.cos(angle) * 130;
            const y = 200 + Math.sin(angle) * 130;
            return (
              <polygon
                key={i}
                points={`${x},${y-6} ${x+6},${y} ${x},${y+6} ${x-6},${y}`}
                fill="url(#gold-metal)"
                filter="url(#intense-glow)"
                transform={`rotate(${(i / 8) * 360}, ${x}, ${y})`}
              />
            );
          })}
        </g>

        {/* ── Sacred Geometry / Detailed Star ── */}
        <g className="svg-ring-inner" filter="url(#intense-glow)">
          <path
            d="M200,95 L222,165 L295,165 L236,208 L258,280 L200,237 L142,280 L164,208 L105,165 L178,165 Z"
            fill="none"
            stroke="url(#gold-metal)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="200" cy="200" r="105" fill="none" stroke="#ffeb99" strokeWidth="0.8" strokeOpacity="0.6" strokeDasharray="2 6" />
        </g>

        {/* ── Realistic Animated Fire Flames ── */}
        <g className="svg-center-flame" filter="url(#realistic-fire)">
          {/* Outer diffuse flame */}
          <path
            d="M200,140 C185,160 170,180 175,200 C180,220 190,225 200,225 C210,225 220,220 225,200 C230,180 215,160 200,140 Z"
            fill="#d42800"
            opacity="0.8"
            filter="blur(4px)"
          />
          {/* Mid intense flame */}
          <path
            d="M200,155 C190,170 182,185 186,200 C190,215 195,220 200,220 C205,220 210,215 214,200 C218,185 210,170 200,155 Z"
            fill="#ff9a28"
            opacity="0.9"
            filter="blur(2px)"
          />
          {/* Core white-hot flame */}
          <path
            d="M200,175 C195,185 192,195 195,205 C197,212 198,214 200,214 C202,214 203,212 205,205 C208,195 205,185 200,175 Z"
            fill="#ffffff"
          />
        </g>

        {/* ── Real Dynamic Sparks ── */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const delay = i * 0.15;
          return (
            <circle
              key={i}
              cx={200 + Math.cos(angle) * 110}
              cy={200 + Math.sin(angle) * 110}
              r={1.5 + (i % 3)}
              fill={i % 2 === 0 ? "#ffeb99" : "#ff7a00"}
              className="svg-spark"
              style={{ animationDelay: `${delay}s`, transformOrigin: '200px 200px' }}
              filter="url(#intense-glow)"
            />
          );
        })}

        {/* ── Floating Rune Glyphs ── */}
        {[
          { x: 200, y: 30,  char: '❖', delay: '0s' },
          { x: 340, y: 120, char: '✦', delay: '0.4s' },
          { x: 340, y: 280, char: '✧', delay: '0.8s' },
          { x: 200, y: 370, char: '⟡', delay: '1.2s' },
          { x: 60,  y: 280, char: '✦', delay: '1.6s' },
          { x: 60,  y: 120, char: '✧', delay: '2.0s' },
        ].map((g, i) => (
          <text
            key={i}
            x={g.x}
            y={g.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            fill="url(#gold-metal)"
            className="svg-rune-glyph"
            style={{ animationDelay: g.delay }}
            filter="url(#intense-glow)"
          >
            {g.char}
          </text>
        ))}
      </svg>

      {/* ── High-Fidelity Loading Text ── */}
      <div className="svg-loader-text">
        <span className="svg-loader-word" style={{ background: 'linear-gradient(to right, #ffeb99, #d4820a)', WebkitBackgroundClip: 'text', color: 'transparent', textShadow: '0 0 20px rgba(255,150,0,0.5)' }}>ADAWWA</span>
        <span className="svg-loader-dots">
          <span className="svg-dot" style={{ animationDelay: '0s' }}>·</span>
          <span className="svg-dot" style={{ animationDelay: '0.2s' }}>·</span>
          <span className="svg-dot" style={{ animationDelay: '0.4s' }}>·</span>
        </span>
      </div>

      {/* Fade-out overly */}
      <div className="svg-loader-fadeout" />
    </div>
  );
}


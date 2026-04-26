'use client';

import { useEffect, useState } from 'react';

export default function CinematicSVG() {
  const [stars, setStars] = useState<{cx: number, cy: number, r: number, delay: number, dur: number}[]>([]);

  useEffect(() => {
    // Generate stars on client to avoid hydration mismatch
    const genStars = Array.from({ length: 250 }).map(() => ({
      cx: Math.random() * 1920,
      cy: Math.random() * 800,
      r: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 4,
      dur: 2 + Math.random() * 3,
    }));
    setStars(genStars);
  }, []);

  return (
    <svg 
      className="absolute inset-0 w-full h-full object-cover" 
      preserveAspectRatio="xMidYMid slice" 
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sky Gradient */}
        <radialGradient id="sky-grad" cx="50%" cy="80%" r="80%">
          <stop offset="0%" stopColor="#1a0a2a" />
          <stop offset="40%" stopColor="#0d0414" />
          <stop offset="100%" stopColor="#020006" />
        </radialGradient>

        {/* Realistic Moon Gradient */}
        <radialGradient id="moon-grad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff7d6"/>
          <stop offset="20%" stopColor="#ffc05c"/>
          <stop offset="50%" stopColor="#e64a00"/>
          <stop offset="80%" stopColor="#661400"/>
          <stop offset="100%" stopColor="#1a0000"/>
        </radialGradient>

        {/* Moon Filter: Craters and Texture */}
        <filter id="moon-texture" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="5" result="noise" />
          <feColorMatrix type="matrix" values="
            0.8 0 0 0 0.15
            0.4 0 0 0 0.05
            0.1 0 0 0 0
            0   0 0 1 0" in="noise" result="coloredNoise" />
          <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="texture" />
          <feBlend mode="multiply" in="texture" in2="SourceGraphic" result="blended" />
          {/* Inner shadow to make it 3D */}
          <feDropShadow dx="-25" dy="-25" stdDeviation="35" floodColor="#000" floodOpacity="0.85" in="blended" result="shadowed" />
        </filter>

        {/* Mountain Gradients */}
        <linearGradient id="mount-back" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e0c2e" />
          <stop offset="100%" stopColor="#0a0312" />
        </linearGradient>
        <linearGradient id="mount-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#150824" />
          <stop offset="100%" stopColor="#040108" />
        </linearGradient>

        {/* Gnarled Trees Displacement Filter */}
        <filter id="gnarled-trees" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="noise">
             <animate attributeName="baseFrequency" values="0.015;0.012;0.015" dur="10s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="50" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feColorMatrix type="matrix" values="
            0 0 0 0 0.01
            0 0 0 0 0.0
            0 0 0 0 0.03
            0 0 0 1 0" in="displaced" />
        </filter>

        {/* Golden Light Glow */}
        <radialGradient id="ray-grad" cx="50%" cy="100%" r="100%">
          <stop offset="0%" stopColor="#ffe680" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#ff8c00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="20%" stopColor="#ffcc00" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Sky */}
      <rect width="1920" height="1080" fill="url(#sky-grad)" />

      {/* 2. Stars */}
      <g className="svg-stars">
        {stars.map((s, i) => (
          <circle 
            key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#fff2d7" 
            style={{ animation: `svgStarTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite alternate` }} 
            opacity="0.1" 
          />
        ))}
      </g>

      {/* 3. Moon */}
      <g className="svg-moon">
        {/* Moon Corona */}
        <circle cx="960" cy="450" r="400" fill="url(#ray-grad)" opacity="0.3" className="svg-moon-pulse" />
        {/* Moon Body */}
        <circle cx="960" cy="450" r="180" fill="url(#moon-grad)" filter="url(#moon-texture)" />
      </g>

      {/* 4. Mountains */}
      <path className="svg-mount-back" d="M0,1080 L0,650 Q 200,550 400,600 T 900,550 T 1400,650 T 1920,500 L1920,1080 Z" fill="url(#mount-back)" filter="blur(3px)" />
      <path className="svg-mount-front" d="M0,1080 L0,800 Q 300,650 500,750 T 1000,600 T 1500,750 T 1920,600 L1920,1080 Z" fill="url(#mount-front)" />

      {/* 5. Bats */}
      <g className="svg-bats-layer">
        {[...Array(7)].map((_, i) => {
          const delays = [0, 1.2, 0.5, 2.1, 0.8, 2.5, 1.5];
          const scales = [1, 0.8, 1.2, 0.9, 0.7, 1.1, 0.85];
          return (
            <g key={i} className={`svg-bat-fly svg-bat-fly-${i+1}`} style={{ animationDelay: `${delays[i]}s` }}>
              <g className={`svg-bat-wing`} style={{ animationDelay: `${delays[i]*0.5}s` }}>
                <path 
                  transform={`scale(${scales[i]})`}
                  d="M 47,40 Q 50,30 53,40 Q 55,60 50,70 Q 45,60 47,40 M 47,45 Q 30,10 0,35 Q 20,50 30,45 Q 25,65 48,65 M 53,45 Q 70,10 100,35 Q 80,50 70,45 Q 75,65 52,65" 
                  fill="#010004" 
                />
              </g>
            </g>
          );
        })}
      </g>

      {/* 6. Mist HTML Overlay via foreignObject */}
      <foreignObject x="0" y="0" width="1920" height="1080" className="pointer-events-none mix-blend-screen opacity-60">
        <div xmlns="http://www.w3.org/1999/xhtml" className="w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 mist-a" />
          <div className="absolute inset-0 mist-b" />
          <div className="absolute inset-0 mist-c" />
        </div>
      </foreignObject>

      {/* 7. Heart-shaped Gnarled Trees Frame */}
      <path 
        className="svg-gnarled-trees"
        d="M0,0 L1920,0 L1920,1080 L0,1080 Z M960,180 C 1350,-100 1850,200 1750,650 C 1650,1100 1100,1050 960,1080 C 820,1050 270,1100 170,650 C 70,200 570,-100 960,180 Z" 
        fill="#020006" 
        fillRule="evenodd" 
        filter="url(#gnarled-trees)" 
      />

      {/* 8. Treasure Box */}
      <g className="svg-treasure-scene" transform="translate(960, 950)">
        {/* God rays */}
        <g className="svg-box-rays" opacity="0">
          <polygon points="0,0 -800,-1000 -400,-1000" fill="url(#ray-grad)" />
          <polygon points="0,0 -150,-1000 150,-1000" fill="url(#ray-grad)" />
          <polygon points="0,0 400,-1000 800,-1000" fill="url(#ray-grad)" />
          <polygon points="0,0 -1000,-600 -1000,-300" fill="url(#ray-grad)" />
          <polygon points="0,0 1000,-600 1000,-300" fill="url(#ray-grad)" />
          <circle cx="0" cy="-20" r="400" fill="url(#core-glow)" />
        </g>

        {/* Box Base */}
        <g className="svg-box-base">
          <path d="M -100,0 L 100,0 L 110,90 L -110,90 Z" fill="#240c00" stroke="#7a3400" strokeWidth="4" />
          <rect x="-95" y="25" width="190" height="15" fill="#a66a00" />
          <circle cx="0" cy="40" r="14" fill="#ffb700" />
          {/* Shadows */}
          <path d="M -110,90 L 110,90 L 130,120 L -130,120 Z" fill="#000000" opacity="0.6" filter="blur(5px)"/>
        </g>
        
        {/* Box Lid */}
        <g className="svg-box-lid">
          <path d="M -105,0 C -105,-80 105,-80 105,0 Z" fill="#2b0e00" stroke="#7a3400" strokeWidth="4" />
          <path d="M -90,0 C -90,-60 90,-60 90,0 Z" fill="none" stroke="#a66a00" strokeWidth="5" />
          <path d="M -45,0 C -45,-30 45,-30 45,0 Z" fill="none" stroke="#a66a00" strokeWidth="4" />
        </g>
      </g>
    </svg>
  );
}

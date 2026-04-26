'use client';

import { useEffect, useRef, useState } from 'react';
import {
  buildTree, genStars, genBats, spawnParticles, drawFrame,
  type Star, type BatState, type Particle,
} from '@/app/lib/cinema';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars: Star[] = genStars(300);
    const bats: BatState[] = genBats(9);
    const particles: Particle[] = [];
    let treeL: HTMLCanvasElement | null = null;
    let treeR: HTMLCanvasElement | null = null;
    let particlesSpawned = false;
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      treeL = buildTree('left', canvas.width, canvas.height);
      treeR = buildTree('right', canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const start = performance.now();
    let prevNow = start;

    const loop = () => {
      const now = performance.now();
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;

      if (treeL && treeR) {
        /* Spawn golden particles when chest opens */
        if (t > 6.9 && !particlesSpawned) {
          particles.push(...spawnParticles(canvas.width * 0.50, canvas.height * 0.62, 70));
          particlesSpawned = true;
        }
        /* Cull dead particles */
        for (let i = particles.length - 1; i >= 0; i--)
          if (particles[i].life >= particles[i].ml) particles.splice(i, 1);

        drawFrame(ctx, canvas.width, canvas.height, t, treeL, treeR, stars, bats, particles, dt);
      }

      if (t < 11.8) {
        raf = requestAnimationFrame(loop);
      } else {
        setShowIntro(false);
      }
    };

    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  const mainCls = showIntro ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto';
  const loaderCls = showIntro ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none';
  const revealCls = showIntro ? '' : 'invitation-content-enter';
  const torchCls = showIntro ? '' : 'invitation-torch-enter';

  return (
    <>
      {/* ── Cinematic Canvas Loader ── */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-700 ${loaderCls}`}
        aria-hidden={!showIntro}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* ── Main content ── */}
      <main className={`relative isolate min-h-dvh overflow-hidden bg-[#02070d] px-6 py-8 text-center text-[#fdf2d0] transition-all duration-700 sm:px-10 sm:py-10 ${mainCls}`}>
        <div className="pointer-events-none absolute inset-0 bg-[url('/assets/back-stage.jpeg')] bg-cover bg-center" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,22,36,0.14)_0%,rgba(8,18,30,0.38)_32%,rgba(4,11,19,0.76)_67%,rgba(1,5,10,0.98)_100%)]" />

        <div className={`invitation-torch invitation-torch-left pointer-events-none fixed z-20 ${torchCls}`} aria-hidden="true">
          <span className="invitation-torch-flame" /><span className="invitation-torch-stick" />
        </div>
        <div className={`invitation-torch invitation-torch-right pointer-events-none fixed z-20 ${torchCls}`} aria-hidden="true">
          <span className="invitation-torch-flame" /><span className="invitation-torch-stick" />
        </div>

        <section className={`invitation-content relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col items-center justify-center gap-3 pt-14 sm:gap-4 sm:pt-20 ${revealCls}`}>
          <p className='font-["Firlest","Apex",serif] text-base font-semibold tracking-[0.11em] text-white sm:text-2xl'>WE CORDIALLY</p>
          <p className='font-["Firlest","Apex",serif] text-5xl font-semibold tracking-[0.12em] text-white sm:text-7xl'>INVITE YOU TO</p>

          <h1 className="font-firlest px-3 text-[clamp(8rem,16vw,8.7rem)] leading-[0.95] tracking-[0.02em] drop-shadow-[0_8px_20px_rgba(158,108,16,1)] sm:text-[clamp(5rem,12vw,10rem)]" lang="si">
            <span className="fire">w</span><span className="fire">v</span><span className="fire">js</span><span className="fire">j</span>
          </h1>

          <p className='-mt-6 text-sm tracking-[1.3em] text-[#f5e6b4] sm:text-base'>ADAWWA</p>

          <p className='mt-2 max-w-2xl text-xs leading-relaxed tracking-[0.06em] text-white sm:text-[1.6rem]'>
            AN ENCHANTING EVENING CELEBRATING THE RICH HERITAGE OF<br />SRI LANKAN TROPICAL MUSIC
          </p>

          <div className='mt-2 font-["Firlest","Apex",serif] text-[#fff4db]'>
            <p className="text-4xl tracking-[0.04em] sm:text-6xl">ON</p>
            <p className="mt-1 text-6xl font-semibold tracking-[0.06em] sm:text-8xl">3RD OF APRIL</p>
          </div>

          <div className='mt-2 font-["Firlest","Apex",serif] text-[#ffefc8]'>
            <p className="text-4xl tracking-[0.04em] sm:text-6xl">FROM</p>
            <p className="mt-1 text-6xl font-semibold tracking-[0.08em] sm:text-8xl">06.30 P.M.</p>
            <p className="text-lg tracking-[0.18em] text-[#e8b24d] sm:text-3xl">ONWARDS</p>
          </div>

          <div className='mt-2 font-["Firlest","Apex",serif] text-[#fff4db]'>
            <p className="text-4xl tracking-[0.04em] sm:text-6xl">AT</p>
            <p className="mt-1 text-6xl font-semibold tracking-[0.05em] sm:text-8xl">THE MAIN CANTEEN</p>
          </div>

          <p className='mt-3 max-w-3xl font-["Firlest","Apex",serif] text-[0.86rem] font-semibold uppercase leading-tight tracking-[0.04em] text-[#f7e4bf] sm:text-3xl'>
            IT WILL BE A PLEASURE TO HAVE YOU JOIN WITH US FOR THIS MUSICAL EVENT.
          </p>

          <div className="mt-3 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#f0ae2f] to-transparent sm:mt-4 sm:w-44" />

          <div className='mt-4 rounded-full border border-[#f3cb77]/35 bg-[#54000f]/60 px-4 py-3 font-["Cinzel","Times_New_Roman",serif] text-[#fcebc2] shadow-[0_14px_30px_rgba(0,0,0,0.34)] sm:px-8'>
            <p className="text-base font-semibold tracking-[0.07em] sm:text-2xl">STUDENTS&apos; UNION FACULTY OF COMPUTING</p>
            <p className="mt-1 text-sm tracking-[0.09em] sm:text-lg">SABARAGAMUWA UNIVERSITY OF SRI LANKA</p>
          </div>
        </section>
      </main>
    </>
  );
}

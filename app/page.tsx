'use client';

import { useEffect, useState } from 'react';
import LoadingOverlay from '@/app/components/LoadingOverlay';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4000); // Wait for the 4.0s sigil loading to finish
    return () => clearTimeout(timer);
  }, []);

  const mainCls = showIntro ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0 pointer-events-auto';
  const loaderCls = showIntro ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none';
  const revealCls = showIntro ? '' : 'invitation-content-enter';
  const torchCls = showIntro ? '' : 'invitation-torch-enter';

  return (
    <>
      {/* ── SVG Splash / Loading Sigil ── */}
      <LoadingOverlay />

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
          <p className='font-["Firlest","Apex",serif] text-4xl font-semibold tracking-[0.10em] text-white sm:text-7xl'>INVITE YOU TO</p>

          <h1 className='relative isolate font-["Apex"] px-3 text-[clamp(6rem,16vw,8.7rem)] leading-[0.95] tracking-[0.02em] sm:text-[clamp(5rem,12vw,10rem)]' >
            <div className="fade-lines-bg" aria-hidden="true" />
            <span className="fire">w</span><span className="fire">v</span><span className="fire">js</span><span className="fire">j</span>
          </h1>

          <p className='-mt-4 text-sm tracking-[1.3em] text-[#f5e6b4] sm:text-base'>ADAWWA</p>

          <p className='mt-2 max-w-2xl text-xs leading-relaxed tracking-[0.06em] text-white sm:text-[1.6rem]'>
            AN ENCHANTING EVENING CELEBRATING THE RICH HERITAGE OF<br />SRI LANKAN TROPICAL MUSIC
          </p>

          <div className='mt-2 font-["Firlest","Apex",serif] text-white'>
            <p className="text-4xl  tracking-[0.04em] sm:text-6xl">ON</p>
            <p className="mt-4 text-6xl font-semibold tracking-[0.06em] sm:text-8xl">30<span className="font-small text-2xl text-yellow-400 mx-3 tracking-tighter -tracking-wider absolute  top-10 transform -translate-x-1/2 ">th</span> <span className='ml-4'>OF APRIL</span></p>
          </div>

          <div className='mt-2 font-["Firlest","Apex",serif] text-white'>
            <p className="text-4xl tracking-[0.04em] sm:text-6xl">FROM</p>
            <p className="mt-1 text-6xl font-semibold tracking-[0.08em] sm:text-8xl">06.30 P.M.</p>
            <p className="text-lg tracking-[0.18em] text-yellow-400 sm:text-3xl">ONWARDS</p>
          </div>

          <div className='mt-2 font-["Firlest","Apex",serif] text-white'>
            <p className="text-4xl tracking-[0.04em] sm:text-6xl">AT</p>
            <p className="mt-1 text-6xl font-semibold tracking-[0.10em] sm:text-8xl">THE MAIN</p>
            <p className="mt-2 text-6xl font-semibold tracking-[0.10em] sm:text-8xl">CANTEEN</p>
          </div>

          <p className='mt-3 max-w-3xl font-["Firlest","Apex",serif] text-[0.86rem] font-semibold uppercase leading-tight tracking-[0.04em] text-[#f7e4bf] sm:text-3xl'>
            IT WILL BE A PLEASURE TO HAVE YOU JOIN WITH US FOR THIS MUSICAL EVENT.
          </p>

          <div className="mt-3 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#f0ae2f] to-transparent sm:mt-4 sm:w-44" />

          <div className='mt-4 sm:mt-6 w-full px-4'>
            <img src="/assets/foc.jpeg" alt="FOC Logo" className="mx-auto w-auto h-auto max-h-[120px] sm:max-h-[160px] max-w-full rounded-full object-contain shadow-[0_0_20px_rgba(243,203,119,0.4)] border border-[#f3cb77]/60" />
          </div>
        </section>
      </main>
    </>
  );
}

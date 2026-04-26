'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const fallbackTimerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const clearFallbackTimer = useCallback(() => {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  }, []);

  const startFallbackTimer = useCallback((delayMs: number) => {
    clearFallbackTimer();
    fallbackTimerRef.current = window.setTimeout(() => {
      setShowIntro(false);
    }, delayMs);
  }, [clearFallbackTimer]);

  useEffect(() => {
    startFallbackTimer(120000);

    const video = videoRef.current;
    if (video && video.paused) {
      void video.play().catch(() => {
        // Keep fallback active if autoplay is blocked.
      });
    }

    return () => {
      clearFallbackTimer();
    };
  }, [startFallbackTimer, clearFallbackTimer]);

  const handleVideoMetadata = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const durationSeconds = event.currentTarget.duration;

    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      return;
    }

    startFallbackTimer(Math.ceil(durationSeconds * 1000) + 2000);
  };

  const handleVideoEnd = () => {
    clearFallbackTimer();
    setShowIntro(false);
  };

  const handleVideoError = () => {
    clearFallbackTimer();
    setShowIntro(false);
  };

  const mainVisibilityClasses = showIntro
    ? 'opacity-0 translate-y-3 pointer-events-none'
    : 'opacity-100 translate-y-0 pointer-events-auto';

  const invitationRevealClasses = showIntro ? '' : 'invitation-content-enter';

  const torchRevealClasses = showIntro ? '' : 'invitation-torch-enter';

  const loaderVisibilityClasses = showIntro
    ? 'opacity-100 visible'
    : 'opacity-0 invisible pointer-events-none';

  return (
    <>
      <div
        className={`fixed inset-0 z-50 h-dvh w-screen overflow-hidden bg-black transition-all duration-500 ${loaderVisibilityClasses}`}
        aria-hidden={!showIntro}
      >
        <video
          ref={videoRef}
          className="h-dvh w-screen object-cover object-center"
          src="/loading.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleVideoMetadata}
          onEnded={handleVideoEnd}
          onError={handleVideoError}
        />
      </div>

      <main
        className={`relative isolate min-h-dvh overflow-hidden bg-[#02070d] px-6 py-8 text-center text-[#fdf2d0] transition-all duration-700 sm:px-10 sm:py-10 ${mainVisibilityClasses}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[url('/assets/back-stage.jpeg')] bg-cover bg-center" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,22,36,0.14)_0%,rgba(8,18,30,0.38)_32%,rgba(4,11,19,0.76)_67%,rgba(1,5,10,0.98)_100%)]" />

        <div className={`invitation-torch invitation-torch-left pointer-events-none fixed z-20 ${torchRevealClasses}`} aria-hidden="true">
          <span className="invitation-torch-flame" />
          <span className="invitation-torch-stick" />
        </div>
        <div className={`invitation-torch invitation-torch-right pointer-events-none fixed z-20 ${torchRevealClasses}`} aria-hidden="true">
          <span className="invitation-torch-flame" />
          <span className="invitation-torch-stick" />
        </div>

        <section className={`invitation-content relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col items-center justify-center gap-3 pt-14 sm:gap-4 sm:pt-20 ${invitationRevealClasses}`}>
          <p className='font-["Firlest","Apex",serif] text-base font-semibold tracking-[0.11em] text-white sm:text-2xl'>
            WE CORDIALLY
          </p>
          <p className='font-["Firlest","Apex",serif] text-5xl font-semibold tracking-[0.12em] text-white sm:text-7xl'>
            INVITE YOU TO
          </p>

          <h1
            className="font-apex px-3 text-[clamp(4rem,16vw,8.7rem)] leading-[0.95] tracking-[0.02em] drop-shadow-[0_8px_20px_rgba(158, 108, 16, 1)] sm:text-[clamp(5rem,12vw,10rem)]"
            lang="si"
          >
            <span className="fire">අ</span>
            <span className="fire">ඩ</span>
            <span className="fire">ව්</span>
            <span className="fire">ව</span>
          </h1>

          <p className='-mt-2 text-sm tracking-[0.6em] text-[#f5e6b4] sm:text-base'>
            ADAWWA
          </p>

          <p className='mt-2 max-w-2xl  text-xs  leading-relaxed tracking-[0.06em] text-white sm:text-[1.6rem]'>
            AN ENCHANTING EVENING CELEBRATING THE RICH HERITAGE OF
            <br />
            SRI LANKAN TROPICAL MUSIC
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

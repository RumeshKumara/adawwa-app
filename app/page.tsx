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
        className={`relative isolate min-h-dvh overflow-hidden bg-[#7a0014] px-6 py-8 text-center text-[#fdf2d0] transition-all duration-500 sm:px-10 sm:py-10 ${mainVisibilityClasses}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,195,96,0.24),transparent_30%),radial-gradient(circle_at_80%_8%,rgba(255,145,77,0.28),transparent_32%),radial-gradient(circle_at_50%_45%,rgba(95,0,26,0.52),transparent_70%),linear-gradient(180deg,#96001f_0%,#6f0015_56%,#4d000e_100%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="pointer-events-none absolute left-0 top-0 h-36 w-36 -translate-x-6 -translate-y-6 rounded-full border border-[#f5c363]/40 bg-[radial-gradient(circle,#ffd97880_0%,transparent_70%)] blur-[1px] sm:h-44 sm:w-44" />
        <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 translate-x-6 -translate-y-6 rounded-full border border-[#f5c363]/40 bg-[radial-gradient(circle,#ffd97880_0%,transparent_70%)] blur-[1px] sm:h-44 sm:w-44" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-44 w-28 -translate-x-2 translate-y-2 rounded-t-full border border-[#d66a45]/35 bg-[linear-gradient(180deg,rgba(185,29,32,0.4),rgba(88,3,22,0.95))] sm:h-56 sm:w-32" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-44 w-28 translate-x-2 translate-y-2 rounded-t-full border border-[#d66a45]/35 bg-[linear-gradient(180deg,rgba(185,29,32,0.4),rgba(88,3,22,0.95))] sm:h-56 sm:w-32" />

        <section className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-3xl flex-col items-center justify-center gap-5 sm:gap-6">
          <p className='font-["Cinzel","Times_New_Roman",serif] text-xs font-semibold tracking-[0.22em] text-[#f7e4b3] sm:text-sm'>
            WE CORDIALLY
          </p>
          <p className='font-["Cinzel","Times_New_Roman",serif] text-4xl font-semibold tracking-[0.06em] text-[#fff7de] sm:text-5xl'>
            INVITE YOU TO
          </p>

          <h1
            className="bg-gradient-to-b from-[#fff3bd] via-[#f6b450] to-[#8a4e15] bg-clip-text px-3 text-[clamp(4rem,16vw,8.7rem)] leading-[0.95] tracking-[0.02em] text-transparent drop-shadow-[0_8px_20px_rgba(0,0,0,0.65)]"
            lang="si"
            style={{ fontFamily: 'Apex-A.Pura-036, Noto Sans Sinhala, serif' }}
          >
            අඩව්ව
          </h1>

          <p className='max-w-xl font-["Cinzel","Times_New_Roman",serif] text-[0.76rem] font-semibold leading-relaxed tracking-[0.08em] text-[#f7deb0] sm:text-sm'>
            AN ENCHANTING EVENING CELEBRATING THE RICH HERITAGE OF
            <br />
            SRI LANKAN TROPICAL MUSIC
          </p>

          <div className='mt-1 font-["Cinzel","Times_New_Roman",serif] text-[#fff4db]'>
            <p className="text-2xl tracking-[0.1em] sm:text-3xl">ON</p>
            <p className="mt-1 text-5xl font-semibold tracking-[0.06em] sm:text-6xl">3RD OF APRIL</p>
          </div>

          <div className='mt-1 font-["Cinzel","Times_New_Roman",serif] text-[#ffefc8]'>
            <p className="text-2xl tracking-[0.1em] sm:text-3xl">FROM</p>
            <p className="mt-1 text-4xl font-semibold tracking-[0.08em] sm:text-5xl">06.30 P.M.</p>
            <p className="text-sm tracking-[0.26em] sm:text-base">ONWARDS</p>
          </div>

          <div className='mt-1 font-["Cinzel","Times_New_Roman",serif] text-[#fff4db]'>
            <p className="text-2xl tracking-[0.1em] sm:text-3xl">AT</p>
            <p className="mt-1 text-4xl font-semibold tracking-[0.07em] sm:text-5xl">THE MAIN CANTEEN</p>
          </div>

          <p className='mt-2 max-w-lg font-["Cinzel","Times_New_Roman",serif] text-[0.78rem] font-semibold uppercase leading-relaxed tracking-[0.08em] text-[#f7deb0] sm:text-sm'>
            IT WILL BE A PLEASURE TO HAVE YOU JOIN WITH US FOR THIS MUSICAL EVENT.
          </p>

          <div className="mt-2 h-px w-14 bg-gradient-to-r from-transparent via-[#f9d58a] to-transparent" />

          <div className='mt-4 rounded-full border border-[#f3cb77]/35 bg-[#54000f]/60 px-4 py-3 font-["Cinzel","Times_New_Roman",serif] text-[#fcebc2] shadow-[0_14px_30px_rgba(0,0,0,0.34)] sm:px-8'>
            <p className="text-base font-semibold tracking-[0.07em] sm:text-2xl">STUDENTS&apos; UNION FACULTY OF COMPUTING</p>
            <p className="mt-1 text-sm tracking-[0.09em] sm:text-lg">SABARAGAMUWA UNIVERSITY OF SRI LANKA</p>
          </div>
        </section>
      </main>
    </>
  );
}

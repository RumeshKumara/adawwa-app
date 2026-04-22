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

  return (
    <>
      <div className={`video-loader ${showIntro ? 'video-loader--visible' : 'video-loader--hidden'}`} aria-hidden={!showIntro}>
        <video
          ref={videoRef}
          className="video-loader__media"
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

      <main className={`invitation-shell ${showIntro ? 'invitation-shell--hidden' : 'invitation-shell--visible'}`}>
        <h1 className="invitation-title invitation-title--accent" lang="si">
          අඩව්ව
        </h1>
        <div className="invitation-divider" aria-hidden="true" />
        <p className="invitation-datetime">
          START DATE & TIME
          <span>22 APRIL 2026 | 7:00 PM</span>
        </p>
      </main>
    </>
  );
}

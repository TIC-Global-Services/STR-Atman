"use client";

import { useEffect, useRef, useState } from "react";

interface VideoProps {
  videoId?: string; // YouTube ID
  videoSrc?: string; // Desktop MP4
  mobVideoSrc?: string; // Mobile MP4
}

const VideoSection = ({ videoId, videoSrc, mobVideoSrc }: VideoProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const [muted, setMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  /* ==============================
     Detect Mobile
  ============================== */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const activeVideoSrc = isMobile && mobVideoSrc ? mobVideoSrc : videoSrc;

  /* ==============================
     YOUTUBE CONFIG
  ============================== */
  const youtubeSrc = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&disablekb=1&iv_load_policy=3&fs=0&enablejsapi=1`
    : "";

  /* ==============================
     Intersection Observer
  ============================== */
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoId && iframeRef.current) {
          iframeRef.current.contentWindow?.postMessage(
            JSON.stringify({
              event: "command",
              func: entry.isIntersecting ? "playVideo" : "pauseVideo",
              args: [],
            }),
            "*"
          );
        }

        if (!videoId && videoRef.current) {
          entry.isIntersecting
            ? videoRef.current.play().catch(() => {})
            : videoRef.current.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [videoId, activeVideoSrc]);

  /* ==============================
     Mute Toggle
  ============================== */
  const toggleMute = () => {
    if (muted) {
      window.dispatchEvent(
        new CustomEvent("global-audio-play", {
          detail: { source: "video" },
        })
      );
    }

    if (videoId && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: muted ? "unMute" : "mute",
          args: [],
        }),
        "*"
      );
    }

    if (!videoId && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }

    setMuted(!muted);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* 🎬 Background video */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {videoId ? (
          <iframe
            ref={iframeRef}
            src={youtubeSrc}
            title="Background video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            className="
              absolute top-1/2 left-1/2
              w-[177.77vh] h-[56.25vw]
              min-w-full min-h-screen
              -translate-x-1/2 -translate-y-1/2
              scale-125 md:scale-110
            "
          />
        ) : (
          <video
            ref={videoRef}
            key={activeVideoSrc} // 🔑 forces reload on src change
            src={activeVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="
              absolute top-1/2 left-1/2
              min-w-full md:min-h-screen
              -translate-x-1/2 -translate-y-1/2
              object-cover scale-110
            "
          />
        )}
      </div>

      {/* 🖤 Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* 🔊 Mute toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-20
          bg-black/60 text-white px-4 py-2
          rounded-full backdrop-blur-md hover:bg-black transition-all"
      >
        {muted ? "Unmute" : "Mute"}
      </button>
    </section>
  );
};

export default VideoSection;

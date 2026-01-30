"use client";

import { useEffect, useRef, useState } from "react";

interface VideoProps {
  videoId?: string;   // YouTube ID
  videoSrc?: string;  // MP4 source
}

const VideoSection = ({ videoId, videoSrc }: VideoProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [muted, setMuted] = useState(true);

  const youtubeSrc = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1`
    : "";

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

        if (videoSrc && videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [videoId, videoSrc]);

  const toggleMute = () => {
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

    if (videoSrc && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }

    setMuted(!muted);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
    >
      {/* 🎬 Background video wrapper */}
      <div className="absolute inset-0 overflow-hidden">
        {videoId ? (
          <iframe
            ref={iframeRef}
            src={youtubeSrc}
            title="Background video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            className="
              absolute top-1/2 left-1/2
              w-[177.77vh] h-[56.25vw]
              min-w-full min-h-full
              -translate-x-1/2 -translate-y-1/2
              scale-125 md:scale-110
            "
            style={{ pointerEvents: "none" }}
          />
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="
              absolute top-1/2 left-1/2
              min-w-full min-h-full
              -translate-x-1/2 -translate-y-1/2
              object-cover
              scale-110
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
          rounded-full backdrop-blur-md"
      >
        {muted ? "Unmute" : "Mute"}
      </button>
    </section>
  );
};

export default VideoSection;

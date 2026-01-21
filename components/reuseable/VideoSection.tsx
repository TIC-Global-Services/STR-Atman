"use client";

import { useEffect, useRef, useState } from "react";

interface VideoProps {
  videoId: string;
}

const VideoSection = ({ videoId }: VideoProps) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [muted, setMuted] = useState(true);

  const src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${videoId}&enablejsapi=1`;

  useEffect(() => {
    if (!sectionRef.current || !iframeRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            event: "command",
            func: entry.isIntersecting ? "playVideo" : "pauseVideo",
            args: [],
          }),
          "*"
        );
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleMute = () => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: muted ? "unMute" : "mute",
        args: [],
      }),
      "*"
    );
    setMuted(!muted);
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* 🔥 Aspect-ratio cover wrapper */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={src}
          title="Background video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          className="
            absolute
            top-1/2 left-1/2
            w-[177.77vh] h-[56.25vw]
            min-w-full min-h-full
            -translate-x-1/2 -translate-y-1/2
          "
          style={{ pointerEvents: "none" }}
        />
      </div>

      {/* Optional overlay */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* 🔊 Custom mute button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-20 bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-md"
      >
        {muted ? "Unmute" : "Mute"}
      </button>
    </section>
  );
};

export default VideoSection;

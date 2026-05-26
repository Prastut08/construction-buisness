"use client";

import { motion } from "framer-motion";

export default function FloatingCube() {
  return (
    <div className="perspective-1000 relative" aria-hidden="true">
      <motion.div
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="w-32 h-32 md:w-48 md:h-48 relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 border-2 border-saffron backdrop-blur-md shadow-[0_0_40px_rgba(245,158,11,0.6),inset_0_0_30px_rgba(245,158,11,0.35)]"
          style={{ transform: "translateZ(64px)", background: "rgba(12,16,28,0.75)" }}
        />
        {/* Back */}
        <div
          className="absolute inset-0 border-2 border-accent-blue backdrop-blur-md shadow-[0_0_40px_rgba(59,130,246,0.6),inset_0_0_30px_rgba(59,130,246,0.35)]"
          style={{ transform: "rotateY(180deg) translateZ(64px)", background: "rgba(10,14,26,0.75)" }}
        />
        {/* Right */}
        <div
          className="absolute inset-0 border-2 border-saffron/80 backdrop-blur-md shadow-[inset_0_0_30px_rgba(245,158,11,0.3)]"
          style={{ transform: "rotateY(90deg) translateZ(64px)", background: "rgba(14,18,32,0.8)" }}
        />
        {/* Left */}
        <div
          className="absolute inset-0 border-2 border-accent-blue/80 backdrop-blur-md shadow-[inset_0_0_30px_rgba(59,130,246,0.3)]"
          style={{ transform: "rotateY(-90deg) translateZ(64px)", background: "rgba(10,14,26,0.8)" }}
        />
        {/* Top */}
        <div
          className="absolute inset-0 border-2 border-gold backdrop-blur-md shadow-[0_0_30px_rgba(251,191,36,0.5),inset_0_0_40px_rgba(251,191,36,0.4)]"
          style={{ transform: "rotateX(90deg) translateZ(64px)", background: "rgba(16,20,34,0.65)" }}
        />
        {/* Bottom */}
        <div
          className="absolute inset-0 border-2 border-saffron backdrop-blur-md shadow-[0_0_50px_rgba(245,158,11,0.6),inset_0_0_20px_rgba(245,158,11,0.35)]"
          style={{ transform: "rotateX(-90deg) translateZ(64px)", background: "rgba(12,16,28,0.85)" }}
        />
      </motion.div>
      {/* Glow underneath */}
      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-48 h-12 bg-saffron/50 rounded-full blur-2xl" />
    </div>
  );
}

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
          className="absolute inset-0 border border-saffron/20 bg-saffron/5 backdrop-blur-sm"
          style={{ transform: "translateZ(64px)" }}
        />
        {/* Back */}
        <div
          className="absolute inset-0 border border-saffron/10 bg-saffron/3"
          style={{ transform: "rotateY(180deg) translateZ(64px)" }}
        />
        {/* Right */}
        <div
          className="absolute inset-0 border border-gold/15 bg-gold/5"
          style={{ transform: "rotateY(90deg) translateZ(64px)" }}
        />
        {/* Left */}
        <div
          className="absolute inset-0 border border-gold/10 bg-gold/3"
          style={{ transform: "rotateY(-90deg) translateZ(64px)" }}
        />
        {/* Top */}
        <div
          className="absolute inset-0 border border-saffron/20 bg-gradient-to-br from-saffron/10 to-gold/5"
          style={{ transform: "rotateX(90deg) translateZ(64px)" }}
        />
        {/* Bottom */}
        <div
          className="absolute inset-0 border border-saffron/5 bg-saffron/3"
          style={{ transform: "rotateX(-90deg) translateZ(64px)" }}
        />
      </motion.div>
      {/* Glow underneath */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-saffron/10 rounded-full blur-xl" />
    </div>
  );
}

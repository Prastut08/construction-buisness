"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Shield, Truck, Star, ChevronDown, Sparkles } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import FloatingCube from "./FloatingCube";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  const [currentBg, setCurrentBg] = useState(0);
  const backgroundImages = [
    { src: "/hero-construction.png", alt: "Construction site at golden hour" },
    { src: "/luxury-architecture.png", alt: "Ultra-luxury modern architectural skyscraper" },
    { src: "/contractor-site.png", alt: "Contractors collaborating on site" },
    { src: "/industrial-warehouse.png", alt: "Premium TMT steel rebars and industrial warehouse" },
    { src: "/products-showcase.png", alt: "High-end construction materials showcase" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  const stats = [
    { value: "15K+", label: "Products", icon: "📦" },
    { value: "5K+", label: "Contractors", icon: "👷" },
    { value: "99%", label: "On-time Delivery", icon: "⚡" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center overflow-hidden bg-navy"
    >
      {/* Background Image Slideshow with parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={backgroundImages[currentBg].src}
              alt={backgroundImages[currentBg].alt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/92 to-navy/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40 z-10" />
        {/* Cinematic film grain */}
        <div className="absolute inset-0 z-20 noise-overlay pointer-events-none" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Animated ambient orbs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-saffron/5 rounded-full blur-[150px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" 
      />

      {/* Slideshow progress indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:hidden">
        {backgroundImages.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentBg(idx)}
            className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
              idx === currentBg ? 'w-8 bg-saffron' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>

      <motion.div style={{ opacity, scale }} className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8 }}
              className="mb-6 inline-flex items-center gap-2.5 glass-card rounded-full px-5 py-2.5 text-sm font-medium group hover:border-saffron/20 transition-all cursor-default"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-green" />
              </span>
              <span className="text-white/80">#1 Construction Supplier in India</span>
              <Star size={12} className="text-saffron fill-saffron" />
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-rajdhani font-bold text-white mb-6 leading-[1.05] tracking-tight"
            >
              Build{" "}
              <span className="text-shimmer relative inline-block">
                Stronger
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <motion.path 
                    d="M1 5.5C40 2 80 2 100 4C120 6 160 3 199 5.5" 
                    stroke="#F59E0B" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, delay: 1 }}
                  />
                </svg>
              </span>
              <br />
              <span className="text-white/90">Spend Smarter.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, filter: "blur(5px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base md:text-lg text-slate/80 mb-10 max-w-xl leading-relaxed"
            >
              Premium cement, TMT steel bars, and 10,000+ construction materials delivered 
              directly to your site. Wholesale pricing for contractors and builders across India.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <button 
                onClick={() => {
                  const element = document.getElementById("categories");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="bg-gradient-to-r from-saffron to-gold hover:from-saffron-dark hover:to-saffron text-navy px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-saffron/25 hover:shadow-saffron/40 hover:shadow-xl cursor-pointer group press-effect relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  Explore Products
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="glass-card hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center gap-2.5 cursor-pointer group press-effect hover:border-white/15">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-saffron/20 group-hover:scale-110 transition-all">
                  <Play size={14} className="text-saffron ml-0.5" fill="currentColor" />
                </div>
                Watch Demo
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex items-center gap-8 md:gap-12"
            >
              {stats.map((stat, i) => (
                <motion.div 
                  key={stat.label} 
                  className="relative group"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.15 }}
                >
                  <div className="text-2xl md:text-3xl font-rajdhani font-bold text-white group-hover:text-gradient transition-all cursor-default">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate/60 font-medium mt-0.5">{stat.label}</div>
                  {i < stats.length - 1 && (
                    <div className="absolute right-[-16px] md:right-[-24px] top-1/2 -translate-y-1/2 w-px h-8 bg-white/10" />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex items-center gap-6 mt-10 pt-8 border-t border-white/5"
            >
              <div className="flex items-center gap-2 text-xs text-slate/50 group cursor-default hover:text-slate/70 transition-colors">
                <div className="p-1.5 rounded-lg bg-accent-green/10 group-hover:bg-accent-green/20 transition-colors">
                  <Shield size={14} className="text-accent-green" />
                </div>
                <span>100% Genuine</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate/50 group cursor-default hover:text-slate/70 transition-colors">
                <div className="p-1.5 rounded-lg bg-accent-blue/10 group-hover:bg-accent-blue/20 transition-colors">
                  <Truck size={14} className="text-accent-blue" />
                </div>
                <span>Same-Day Dispatch</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate/50 group cursor-default hover:text-slate/70 transition-colors">
                <div className="p-1.5 rounded-lg bg-saffron/10 group-hover:bg-saffron/20 transition-colors">
                  <Sparkles size={14} className="text-saffron" />
                </div>
                <span>GST Invoice</span>
              </div>
            </motion.div>
          </div>

          {/* Right side - 3D element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative">
              {/* Glowing ring behind cube */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 rounded-full border-2 border-saffron/40 shadow-[0_0_40px_rgba(245,158,11,0.2)] animate-[spin_15s_linear_infinite]" />
                <div className="absolute w-56 h-56 rounded-full border border-gold/40 shadow-[0_0_30px_rgba(251,191,36,0.2)] animate-[spin_10s_linear_infinite_reverse]" />
                <div className="absolute w-40 h-40 rounded-full border border-white/20 animate-[spin_12s_linear_infinite]" />
              </div>
              <FloatingCube />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080B14] via-[#080B14]/60 to-transparent" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hidden md:flex flex-col items-center gap-2 cursor-pointer group"
        onClick={() => {
          const next = document.querySelector('section:nth-child(2)');
          if (next) next.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium group-hover:text-saffron/50 transition-colors">Scroll</span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown size={18} className="text-saffron/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

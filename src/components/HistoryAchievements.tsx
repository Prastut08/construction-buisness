"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Calendar, Award, TrendingUp, Users, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const stats = [
  { value: "10+", label: "Years of Excellence", desc: "Serving contractors & retail buyers since 2016", icon: Award, color: "text-saffron" },
  { value: "5,000+", label: "Projects Supplied", desc: "Residential, commercial, and infra builds", icon: Users, color: "text-accent-blue" },
  { value: "250K+", label: "Tons Supplied", desc: "Cement & TMT steel dispatched to yards", icon: TrendingUp, color: "text-accent-green" },
  { value: "100%", label: "Delivery Accuracy", desc: "On-time same-day site dispatches", icon: ShieldCheck, color: "text-purple-400" },
];

const timeline = [
  {
    year: "2016",
    title: "The Foundation",
    description: "Kushal Enterprises was founded as a boutique cement and brick distributor, serving local contractors in Baghmundi, West Bengal.",
  },
  {
    year: "2019",
    title: "TMT Steel & Heavy Infra",
    description: "Expanded our catalog to include premium grade TMT steel bars and heavy-duty structural reinforcement materials.",
  },
  {
    year: "2022",
    title: "Tiles, Finishes & Premium Yards",
    description: "Opened state-of-the-art marble, tiling, and interior finishes yards, supplying luxury architectural projects.",
  },
  {
    year: "2026",
    title: "Digital Integration",
    description: "Launched real-time online cataloging, digital wholesale pricing engines, and coordinated same-day delivery hubs.",
  },
];

const galleryImages = [
  { src: "/achievements/achievement-4.jpeg", title: "Infrastructure Development Supply" },
  { src: "/achievements/achievement-5.jpeg", title: "Premium Yard Construction" },
  { src: "/achievements/achievement-6.jpeg", title: "Concrete Slabs & Masonry Work" },
  { src: "/achievements/achievement-9.jpeg", title: "Pillar Casting & Reinforcement" },
  { src: "/achievements/achievement-10.jpeg", title: "Major Building Frame Dispatch" },
];

export default function HistoryAchievements() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slideshow every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    if (galleryImages.length === 0) return;
    setCurrentSlide((prev) => (prev <= 0 ? galleryImages.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (galleryImages.length === 0) return;
    setCurrentSlide((prev) => (prev >= galleryImages.length - 1 ? 0 : prev + 1));
  };

  const activeSlide = galleryImages[currentSlide] || galleryImages[0] || { src: "", title: "" };

  return (
    <section className="py-24 relative overflow-hidden bg-navy-medium/30">
      {/* Background elements */}
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-blue/3 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-saffron text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Trophy size={12} className="animate-pulse" /> Legacy & Impact
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-rajdhani font-bold text-white mb-4 leading-tight"
          >
            Our History & <span className="text-shimmer">Achievements</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-base"
          >
            Over a decade of supplying high-grade materials to shape skylines, build foundations, and deliver wholesale values to builders.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:border-saffron/20 transition-all duration-300 hover-lift"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-bl-full group-hover:bg-white/[0.02] transition-colors" />
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-white/10 transition-colors">
                  <Icon size={22} className={stat.color} />
                </div>
                <div className="text-4xl font-rajdhani font-bold text-white mb-2 tracking-tight group-hover:text-saffron transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-white/90 mb-1">{stat.label}</div>
                <div className="text-xs text-white/40 leading-relaxed">{stat.desc}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline & Slideshow Container */}
        <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-surface-light/30 backdrop-blur-md p-8 md:p-12">
          {/* Subtle construction photo background */}
          <div className="absolute inset-0 opacity-5">
            <Image 
              src="/achievements/achievement-4.jpeg" 
              alt="Construction background" 
              fill 
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-navy/95" />
          </div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Vertical Timeline (6 cols on desktop) */}
              <div className="lg:col-span-6 relative">
                <h3 className="text-2xl font-rajdhani font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                  <Calendar className="text-saffron" size={20} /> Our Journey Timeline
                </h3>
                
                <div className="relative pl-8 space-y-8">
                  {/* Vertical line connector */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-saffron via-saffron/40 to-saffron/10" />
                  
                  {timeline.map((item, idx) => (
                    <motion.div 
                      key={item.year}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-[32px] top-1 w-5 h-5 rounded-full bg-navy border-2 border-saffron flex items-center justify-center shadow-lg shadow-saffron/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                      </div>
                      
                      <div>
                        <span className="text-[10px] font-bold text-saffron bg-saffron/10 px-2 py-0.5 rounded-md border border-saffron/20">{item.year}</span>
                        <h4 className="text-base font-bold text-white mt-2 mb-1">{item.title}</h4>
                        <p className="text-xs text-white/50 leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column: Slideshow (6 cols on desktop) */}
              <div className="lg:col-span-6 flex flex-col h-full justify-center">
                <h3 className="text-2xl font-rajdhani font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                  <Trophy className="text-saffron" size={20} /> Site Operations Showcase
                </h3>
                
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.03 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeSlide.src}
                        alt={activeSlide.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                      />
                      
                      {/* Caption overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 pt-12">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-saffron">{activeSlide.title}</span>
                        <h5 className="text-white font-rajdhani font-bold text-base mt-0.5">Kushal Enterprises in Action</h5>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {/* Chevron controls */}
                  <button 
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/60 hover:bg-black/80 text-white flex items-center justify-center hover:scale-105 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <button 
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-black/60 hover:bg-black/80 text-white flex items-center justify-center hover:scale-105 transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  {/* Indicator dots */}
                  <div className="absolute bottom-4 right-5 flex gap-1.5 z-10">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentSlide === idx ? 'w-4 bg-saffron' : 'w-1.5 bg-white/40'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

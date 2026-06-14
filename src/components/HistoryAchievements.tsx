"use client";

import { motion } from "framer-motion";
import { Trophy, Calendar, Award, TrendingUp, Users, ShieldCheck, MapPin } from "lucide-react";
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
    description: "Kushal Enterprises was founded as a boutique cement and brick distributor, serving local contractors in Mumbai.",
    icon: Calendar,
  },
  {
    year: "2019",
    title: "TMT Steel & Heavy Infra",
    description: "Expanded our catalog to include premium grade TMT steel bars and heavy-duty structural reinforcement materials.",
    icon: Award,
  },
  {
    year: "2022",
    title: "Tiles, Finishes & Premium Yards",
    description: "Opened state-of-the-art marble, tiling, and interior finishes yards, supplying luxury architectural projects.",
    icon: Trophy,
  },
  {
    year: "2026",
    title: "Digital Integration",
    description: "Launched real-time online cataloging, digital wholesale pricing engines, and coordinated same-day delivery hubs.",
    icon: TrendingUp,
  },
];

export default function HistoryAchievements() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
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

        {/* Timeline Section */}
        <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-surface-light/30 backdrop-blur-md p-8 md:p-12">
          {/* Subtle construction photo background */}
          <div className="absolute inset-0 opacity-10">
            <Image 
              src="https://images.pexels.com/photos/5623179/pexels-photo-5623179.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" 
              alt="Construction background" 
              fill 
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-navy/90" />
          </div>

          <div className="relative z-10">
            <h3 className="text-2xl font-rajdhani font-bold text-white mb-10 border-b border-white/5 pb-4 flex items-center gap-3">
              <Calendar className="text-saffron" size={20} /> The Journey Timeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Timeline Connector Line */}
              <div className="hidden md:block absolute top-[22px] left-[50px] right-[50px] h-0.5 bg-gradient-to-r from-saffron/20 via-saffron/40 to-saffron/20 z-0" />

              {timeline.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: -25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="relative z-10 flex flex-col items-start"
                  >
                    {/* Node Circle */}
                    <div className="w-11 h-11 rounded-full bg-navy border-2 border-saffron flex items-center justify-center mb-4 shadow-lg shadow-saffron/10 group-hover:scale-110 transition-transform">
                      <span className="text-xs font-bold text-saffron">{item.year}</span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2 leading-tight flex items-center gap-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, Package, HeadphonesIcon, Zap, Award } from "lucide-react";

const badges = [
  { icon: Package, value: "15,000+", label: "Products in Catalog", color: "from-saffron/20 to-gold/10", accent: "text-saffron" },
  { icon: Truck, value: "Same Day", label: "Dispatch Available", color: "from-accent-blue/20 to-accent-blue/5", accent: "text-accent-blue" },
  { icon: ShieldCheck, value: "100%", label: "Brand Warranty", color: "from-accent-green/20 to-accent-green/5", accent: "text-accent-green" },
  { icon: HeadphonesIcon, value: "24/7", label: "Expert Support", color: "from-purple-500/20 to-purple-500/5", accent: "text-purple-400" },
  { icon: Zap, value: "500+", label: "Cities Served", color: "from-saffron/20 to-gold/10", accent: "text-saffron" },
  { icon: Award, value: "12 Yrs", label: "Industry Trust", color: "from-accent-blue/20 to-accent-blue/5", accent: "text-accent-blue" },
];

export default function TrustBadges() {
  return (
    <section className="py-20 relative overflow-hidden bg-navy-light">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute bottom-0 left-0 right-0 section-divider" />

      {/* Glow orbs */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-saffron/5 rounded-full blur-[100px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-accent-blue/5 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-saffron text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Award size={12} /> Why Us
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-rajdhani font-bold text-white mb-3">
            Why <span className="text-gradient">Professionals</span> Choose Us
          </h2>
          <p className="text-slate/60 max-w-lg mx-auto text-sm">
            Trusted by thousands of contractors and builders across India for quality and reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col items-center text-center group cursor-pointer hover-lift relative overflow-hidden"
              >
                {/* Subtle top accent line */}
                <div className={`absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r ${badge.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500`}>
                  <Icon size={22} className={`${badge.accent} opacity-90`} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-rajdhani font-bold text-white mb-0.5 group-hover:text-gradient transition-all">
                  {badge.value}
                </h3>
                <p className="text-slate/50 text-xs font-medium">{badge.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

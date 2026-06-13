"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

const testimonials = [
  { name: "Rajesh Patel", role: "Civil Contractor, Ahmedabad", text: "Kushal Enterprises has been our go-to supplier for the last 5 years. Their cement quality is unmatched and delivery is always on time. Our projects never face delays anymore.", rating: 5, initials: "RP", color: "from-saffron to-gold" },
  { name: "Sunita Sharma", role: "Interior Designer, Mumbai", text: "The range of tiles and flooring options is incredible. I always find exactly what my clients need. The premium marble collection is genuinely stunning.", rating: 5, initials: "SS", color: "from-accent-blue to-blue-400" },
  { name: "Vikram Singh", role: "Builder, Delhi NCR", text: "Bulk ordering with Kushal is seamless. The wholesale prices and dedicated account manager saved us lakhs on our latest residential project.", rating: 5, initials: "VS", color: "from-accent-green to-emerald-400" },
  { name: "Priya Deshmukh", role: "Architect, Pune", text: "Their quality consistency across orders is remarkable. Whether it's premium paint or structural steel, the standards never drop. Highly recommended for professionals.", rating: 5, initials: "PD", color: "from-purple-500 to-violet-400" },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextTestimonial = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, [nextTestimonial]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.97,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 60 : -60,
      opacity: 0,
      scale: 0.97,
    }),
  };

  return (
    <section className="py-24 relative overflow-hidden bg-navy-light">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-0 right-0 section-divider" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saffron/3 rounded-full blur-[200px]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image & Stats */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative">
            <div className="relative h-[500px] rounded-3xl overflow-hidden glass-card group">
              <Image src="/contractor-site.png" alt="Professional contractor inspecting construction site" fill className="object-cover group-hover:scale-105 transition-transform duration-[2s]" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
              
              {/* Floating stats overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-4">
                    {[
                      { value: "5K+", label: "Happy Contractors" },
                      { value: "₹50Cr+", label: "Materials Delivered" },
                      { value: "4.9★", label: "Average Rating" },
                    ].map((stat, i) => (
                      <div key={stat.label} className="flex items-center gap-4">
                        <div className="text-center">
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.15 }}
                            className="text-3xl font-rajdhani font-bold text-gradient"
                          >
                            {stat.value}
                          </motion.div>
                          <div className="text-[10px] text-white/40 font-medium">{stat.label}</div>
                        </div>
                        {i < 2 && <div className="w-px h-10 bg-white/10" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top-left decorative badge */}
              <div className="absolute top-6 left-6">
                <div className="glass rounded-full px-4 py-2 flex items-center gap-2 text-xs font-bold text-white/80">
                  <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                  Verified Reviews
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Testimonials Carousel */}
          <div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-10">
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-saffron text-xs font-semibold uppercase tracking-wider mb-4">
                <Quote size={12} /> Testimonials
              </div>
              <h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-white tracking-tight leading-none mb-3">
                Trusted by <span className="text-gradient">Builders</span>
              </h2>
              <p className="text-slate/60 text-base max-w-md">
                Hear from professionals who rely on us for their construction material needs every day.
              </p>
            </motion.div>

            {/* Active testimonial card */}
            <div className="relative min-h-[280px] mb-6">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 }, scale: { duration: 0.3 } }}
                  className="glass-card rounded-2xl p-8 relative overflow-hidden"
                >
                  {/* Decorative quote mark */}
                  <div className="absolute top-4 right-6 text-saffron/8 font-rajdhani text-[120px] leading-none pointer-events-none select-none">&ldquo;</div>

                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonials[activeIndex].rating }).map((_, j) => (
                      <Star key={j} size={14} className="fill-saffron text-saffron" />
                    ))}
                  </div>

                  <p className="text-white/70 text-base leading-relaxed mb-6 relative z-10 max-w-md">
                    &ldquo;{testimonials[activeIndex].text}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    {/* Avatar circle with initials */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonials[activeIndex].color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-sm">{testimonials[activeIndex].initials}</span>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{testimonials[activeIndex].name}</div>
                      <div className="text-xs text-saffron/60">{testimonials[activeIndex].role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation + dots */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
                    className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                      i === activeIndex ? 'w-8 bg-saffron' : 'w-3 bg-white/15 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={prevTestimonial}
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white/50 hover:text-saffron hover:border-saffron/20 transition-all cursor-pointer press-effect"
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-white/50 hover:text-saffron hover:border-saffron/20 transition-all cursor-pointer press-effect"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

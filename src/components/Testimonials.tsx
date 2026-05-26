"use client";

import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  { name: "Rajesh Patel", role: "Civil Contractor, Ahmedabad", text: "Kushal Enterprises has been our go-to supplier for the last 5 years. Their cement quality is unmatched and delivery is always on time. Our projects never face delays anymore.", rating: 5 },
  { name: "Sunita Sharma", role: "Interior Designer, Mumbai", text: "The range of tiles and flooring options is incredible. I always find exactly what my clients need. The premium marble collection is genuinely stunning.", rating: 5 },
  { name: "Vikram Singh", role: "Builder, Delhi NCR", text: "Bulk ordering with Kushal is seamless. The wholesale prices and dedicated account manager saved us lakhs on our latest residential project.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden bg-navy-light">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron/15 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-saffron/3 rounded-full blur-[200px]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image & Stats */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative">
            <div className="relative h-[500px] rounded-3xl overflow-hidden glass-card">
              <Image src="/contractor-site.png" alt="Professional contractor inspecting construction site" fill className="object-cover" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-rajdhani font-bold text-gradient">5K+</div>
                      <div className="text-[10px] text-white/40 font-medium">Happy Contractors</div>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <div className="text-3xl font-rajdhani font-bold text-gradient">₹50Cr+</div>
                      <div className="text-[10px] text-white/40 font-medium">Materials Delivered</div>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                      <div className="text-3xl font-rajdhani font-bold text-gradient">4.9★</div>
                      <div className="text-[10px] text-white/40 font-medium">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Testimonials */}
          <div>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="mb-10">
              <h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-white tracking-tight leading-none mb-3">
                Trusted by <span className="text-gradient">Builders</span>
              </h2>
              <p className="text-slate/60 text-base max-w-md">
                Hear from professionals who rely on us for their construction material needs every day.
              </p>
            </motion.div>

            <div className="space-y-5">
              {testimonials.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="glass-card glass-card-hover rounded-2xl p-6 group cursor-pointer">
                  <Quote size={20} className="text-saffron/30 mb-3" />
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{t.text}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{t.name}</div>
                      <div className="text-[11px] text-saffron/60">{t.role}</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <span key={j} className="text-saffron text-xs">★</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

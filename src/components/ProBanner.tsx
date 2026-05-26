"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ProBanner() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-blue/3 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image src="/products-showcase.png" alt="Construction materials showcase" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/70" />
            <div className="absolute inset-0 bg-grid opacity-10" />
          </div>

          <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-saffron text-xs font-semibold uppercase tracking-wider mb-5">
                <Sparkles size={12} /> Exclusive Program
              </div>
              <h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-white mb-4 leading-tight">
                Contractors get up to{" "}
                <span className="text-gradient">15% Off</span>
                <br />on bulk orders
              </h2>
              <p className="text-white/50 text-base mb-8 leading-relaxed max-w-md">
                Join the Kushal Pro program to unlock wholesale pricing, dedicated account managers, 
                and GST invoices for all your purchases.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-saffron to-gold hover:from-saffron-dark hover:to-saffron text-navy px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-2.5 transition-all duration-300 shadow-lg shadow-saffron/20 cursor-pointer group">
                  Apply for Pro Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="glass-card text-white/70 hover:text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-300 cursor-pointer">
                  Learn More
                </button>
              </div>
            </div>

            {/* Floating benefit cards */}
            <div className="flex flex-col gap-3 w-full md:w-auto">
              {[
                { label: "Wholesale Prices", desc: "Up to 15% below MRP" },
                { label: "Dedicated Manager", desc: "Personal account handler" },
                { label: "GST Invoicing", desc: "Compliant billing" },
                { label: "Priority Delivery", desc: "Same-day dispatch" },
              ].map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl px-5 py-3.5 flex items-center gap-3 min-w-[250px] group hover:border-saffron/20 transition-all cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-saffron flex-shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-white/90">{item.label}</div>
                    <div className="text-[11px] text-white/40">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

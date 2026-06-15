"use client";

import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-navy-light border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron/20 to-transparent" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10 py-5">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron to-gold flex items-center justify-center shadow-lg glow-saffron-sm">
              <span className="text-navy font-rajdhani font-bold text-base">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-rajdhani font-bold text-white leading-none">KUSHAL</span>
              <span className="text-[8px] text-saffron font-bold tracking-[0.2em] uppercase">Enterprises</span>
            </div>
            <span className="hidden sm:inline text-white/20 text-[10px] pl-2 border-l border-white/10">
              Quality Site Materials Since 2014
            </span>
          </div>

          {/* Contact Details (Horizontal Row) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs text-white/40">
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={12} className="text-saffron" />
              <span>+91 90641 13345</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={12} className="text-saffron" />
              <span>info@kushalenterprises.com</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <MapPin size={12} className="text-saffron" />
              <span>Baghmundi, West Bengal, 723152</span>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="text-[10px] text-white/20 text-center lg:text-right">
            &copy; {new Date().getFullYear()} Kushal Enterprises. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-navy-light border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron/20 to-transparent" />

      {/* Main Footer */}
      <div className="container mx-auto px-4 max-w-7xl relative z-10 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center shadow-lg glow-saffron-sm">
                <span className="text-navy font-rajdhani font-bold text-lg">K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-rajdhani font-bold text-white leading-none">KUSHAL</span>
                <span className="text-[9px] text-saffron font-bold tracking-[0.2em] uppercase">Enterprises</span>
              </div>
            </div>
            <p className="text-sm text-white/40 mb-6 leading-relaxed max-w-xs">
              Your trusted partner for all construction materials. Delivering quality right to your site since 2014.
            </p>
            <div className="flex space-x-3">
              {[
                { label: "Facebook", letter: "f" }, { label: "Twitter", letter: "t" },
                { label: "LinkedIn", letter: "in" }, { label: "Instagram", letter: "ig" }
              ].map((s) => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="w-9 h-9 rounded-lg glass-card flex items-center justify-center hover:border-saffron/30 hover:text-saffron text-white/40 text-xs font-bold transition-all cursor-pointer">
                  {s.letter}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-rajdhani font-bold text-lg mb-5">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {["About Us", "Contact Us", "Careers", "Bulk Order Inquiry", "Store Locator"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/40 hover:text-saffron transition-colors duration-200 flex items-center gap-1 group cursor-pointer">
                    {link}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="text-white font-rajdhani font-bold text-lg mb-5">Customer Policy</h4>
            <ul className="space-y-3 text-sm">
              {["Shipping & Delivery", "Returns & Refunds", "Terms of Service", "Privacy Policy", "FAQ"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/40 hover:text-saffron transition-colors duration-200 flex items-center gap-1 group cursor-pointer">
                    {link}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white font-rajdhani font-bold text-lg mb-5">Stay Updated</h4>
            <p className="text-sm text-white/40 mb-4">Subscribe for the latest deals and industry news.</p>
            <form className="flex flex-col gap-3 mb-6">
              <input type="email" placeholder="Enter your email"
                className="bg-surface border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-saffron/30 focus:shadow-[0_0_15px_rgba(245,158,11,0.05)] transition-all" />
              <button type="button"
                className="bg-gradient-to-r from-saffron to-gold text-navy font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-saffron/20 cursor-pointer text-sm">
                Subscribe
              </button>
            </form>
            <div className="space-y-2 text-xs text-white/30">
              <div className="flex items-center gap-2"><Phone size={12} className="text-saffron/50" /> +91 90641 13345</div>
              <div className="flex items-center gap-2"><Mail size={12} className="text-saffron/50" /> info@kushalenterprises.com</div>
              <div className="flex items-center gap-2"><MapPin size={12} className="text-saffron/50" /> Mumbai, Maharashtra</div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 text-xs text-center md:flex md:justify-between md:text-left text-white/25">
          <p>&copy; {new Date().getFullYear()} Kushal Enterprises. All rights reserved.</p>
          <div className="mt-3 md:mt-0 flex justify-center gap-3">
            {["UPI", "VISA", "MC", "RUPAY"].map((p) => (
              <span key={p} className="glass-card rounded px-2.5 py-1 text-[9px] font-bold text-white/30">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

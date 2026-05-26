"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, Heart, Phone, MapPin, ChevronDown, Lock, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInventory } from "@/context/InventoryContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { isOwner, loginOwner, logoutOwner, cart, cartCount, removeFromCart, updateCartQuantity, clearCart } = useInventory();
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-saffron via-saffron-dark to-saffron text-white text-xs py-2 px-4 text-center font-semibold tracking-wide relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center gap-2">
          <span className="hidden md:inline">🏗️</span>
          <span>Grand Opening Sale — <strong>Flat 20% OFF</strong> on all Cement & Steel orders above ₹50,000</span>
          <Link href="#" className="underline underline-offset-2 hover:text-white/80 transition-colors ml-2 font-bold">
            Shop Now →
          </Link>
        </div>
        <div className="absolute inset-0 shimmer" />
      </div>

      {/* Topbar */}
      <div className="bg-navy-medium text-slate text-xs py-2.5 px-4 hidden md:block border-b border-white/5">
        <div className="container mx-auto flex justify-between items-center max-w-7xl">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-2 hover:text-saffron transition-colors cursor-pointer">
              <Phone size={12} className="text-saffron" /> +91 98765 43210
            </span>
            <span className="flex items-center gap-2 hover:text-saffron transition-colors cursor-pointer">
              <MapPin size={12} className="text-saffron" /> Deliver to: 400001 Mumbai
            </span>
          </div>
          <div className="flex space-x-5">
            <Link href="#" className="hover:text-saffron transition-colors duration-200">Bulk Orders</Link>
            <Link href="#" className="hover:text-saffron transition-colors duration-200">Request Quote</Link>
            <Link href="#" className="hover:text-saffron transition-colors duration-200">Track Order</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3"
            : "bg-navy/95 backdrop-blur-sm py-4"
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Image src="/logo.svg" alt="Kushal Enterprises Logo" width={48} height={48} className="w-full h-full drop-shadow-[0_0_12px_rgba(245,158,11,0.35)]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-rajdhani font-bold text-white leading-none tracking-tight">
                  KUSHAL
                </span>
                <span className="text-[9px] md:text-[10px] text-saffron font-bold tracking-[0.2em] uppercase">
                  Enterprises
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl relative">
              <div className={`w-full relative transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                <input
                  type="text"
                  placeholder="Search cement, steel, tiles, tools..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`w-full bg-surface-light/80 border rounded-2xl py-3 px-5 pr-12 text-sm text-white placeholder:text-slate/50 focus:outline-none transition-all duration-300 ${
                    searchFocused
                      ? 'border-saffron/40 shadow-[0_0_20px_rgba(245,158,11,0.1)] bg-surface-light'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-saffron to-gold text-navy p-2 rounded-xl hover:shadow-lg hover:shadow-saffron/20 transition-all duration-300 cursor-pointer">
                  <Search size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => isOwner ? router.push("/owner") : setShowLogin(true)}
                className="hidden md:flex flex-col items-center text-slate/70 hover:text-saffron transition-colors duration-200 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                {isOwner ? <Lock size={20} className="text-saffron" strokeWidth={1.5} /> : <User size={20} strokeWidth={1.5} />}
                <span className="text-[9px] mt-1 font-medium">{isOwner ? "Owner" : "Owner"}</span>
              </button>
              <button className="hidden md:flex flex-col items-center text-slate/70 hover:text-saffron transition-colors duration-200 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                <Heart size={20} strokeWidth={1.5} />
                <span className="text-[9px] mt-1 font-medium">Saved</span>
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowCart(!showCart)}
                  className="flex flex-col items-center text-slate/70 hover:text-saffron transition-colors duration-200 relative p-2 rounded-xl hover:bg-white/5 cursor-pointer"
                >
                  <ShoppingCart size={20} strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 right-0 bg-gradient-to-r from-saffron to-gold text-navy text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                  <span className="text-[9px] mt-1 font-medium hidden md:block">Cart</span>
                </button>

                {/* Cart Dropdown */}
                <AnimatePresence>
                  {showCart && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowCart(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-3 w-[340px] md:w-[380px] glass-card rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                          <h3 className="font-rajdhani font-bold text-white text-lg">Shopping Cart</h3>
                          <span className="text-xs text-white/40 font-medium">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                        </div>

                        <div className="max-h-[320px] overflow-y-auto">
                          {cart.length === 0 ? (
                            <div className="p-8 text-center">
                              <ShoppingCart size={32} className="text-white/10 mx-auto mb-3" />
                              <p className="text-white/40 text-sm">Your cart is empty</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-white/5">
                              {cart.map(item => (
                                <div key={item.goodId} className="p-3 flex gap-3 hover:bg-white/5 transition-colors">
                                  <div className="w-14 h-14 rounded-lg overflow-hidden relative border border-white/10 shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-xs font-bold truncate">{item.name}</h4>
                                    <p className="text-saffron text-[10px] font-bold mt-0.5">{item.price}</p>
                                    <p className="text-white/30 text-[10px]">{item.categoryName}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <button onClick={() => updateCartQuantity(item.goodId, item.quantity - 1)} className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 transition-colors cursor-pointer">
                                        <Minus size={10} />
                                      </button>
                                      <span className="text-white text-xs font-bold min-w-[16px] text-center">{item.quantity}</span>
                                      <button onClick={() => updateCartQuantity(item.goodId, item.quantity + 1)} className="w-5 h-5 rounded bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 transition-colors cursor-pointer">
                                        <Plus size={10} />
                                      </button>
                                      <button onClick={() => removeFromCart(item.goodId)} className="ml-auto w-5 h-5 rounded bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors cursor-pointer">
                                        <Trash2 size={10} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {cart.length > 0 && (
                          <div className="p-4 border-t border-white/10 space-y-3">
                            <button onClick={clearCart} className="w-full text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer text-center py-1">
                              Clear Cart
                            </button>
                            <button className="w-full bg-gradient-to-r from-saffron to-gold text-navy font-bold py-3 rounded-xl text-sm shadow-lg shadow-saffron/20 hover:shadow-saffron/30 transition-all cursor-pointer">
                              Request Quote for {cartCount} item{cartCount !== 1 ? 's' : ''}
                            </button>
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Links Desktop */}
      <nav className={`bg-navy-light/90 backdrop-blur-md text-white hidden md:block border-b border-white/5 sticky top-[68px] z-40 transition-all duration-300 ${isScrolled ? 'shadow-lg shadow-black/20' : ''}`}>
        <div className="container mx-auto px-4 max-w-7xl">
          <ul className="flex items-center space-x-1 py-0 text-sm font-medium">
            <li>
              <Link href="/catalog" className="flex items-center gap-1 px-4 py-3 hover:text-saffron transition-colors duration-200 hover:bg-white/5 rounded-lg cursor-pointer">
                All Categories <ChevronDown size={14} />
              </Link>
            </li>
            {["Cement & Concrete", "TMT Steel Bars", "Tiles & Flooring", "Plumbing", "Electricals", "Paints"].map((item) => (
              <li key={item}>
                <Link href="#" className="px-4 py-3 hover:text-saffron transition-colors duration-200 hover:bg-white/5 rounded-lg block cursor-pointer">
                  {item}
                </Link>
              </li>
            ))}
            <li>
              <Link href="#" className="px-4 py-3 text-saffron font-bold transition-colors duration-200 hover:bg-saffron/10 rounded-lg block cursor-pointer">
                Today&apos;s Deals
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-2xl w-full max-w-sm p-6 relative border border-white/10"
            >
              <button
                onClick={() => { setShowLogin(false); setError(""); setPassword(""); }}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-rajdhani font-bold text-white mb-2">Owner Access</h3>
              <p className="text-white/50 text-sm mb-6">Enter password to manage inventory.</p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (loginOwner(password)) {
                  setShowLogin(false);
                  setPassword("");
                  router.push("/owner");
                } else {
                  setError("Incorrect password");
                }
              }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white mb-2 focus:outline-none focus:border-saffron/50"
                  autoFocus
                />
                {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
                
                <button
                  type="submit"
                  className="w-full bg-saffron hover:bg-saffron-dark text-navy font-bold py-3 rounded-xl transition-colors mt-4"
                >
                  Login
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-white/5 overflow-hidden fixed top-[110px] left-0 right-0 z-50"
          >
            <div className="p-5 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-surface-light border border-white/10 rounded-2xl py-3 px-4 pr-10 text-sm text-white placeholder:text-slate/50 focus:outline-none focus:border-saffron/30"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-saffron" size={16} />
              </div>
              <ul className="space-y-1 font-medium text-white/90 pb-4">
                {["Cement & Concrete", "TMT Steel Bars", "Tiles & Flooring", "Plumbing & Pipes", "Hardware & Tools"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="block px-4 py-3 hover:bg-white/5 rounded-xl transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="#" className="block px-4 py-3 text-saffron font-bold hover:bg-saffron/10 rounded-xl transition-colors">
                    Bulk Orders & Quote
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

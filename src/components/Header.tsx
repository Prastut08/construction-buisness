"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, User, Menu, X, Phone, MapPin, Lock, Minus, Plus, Trash2 } from "lucide-react";
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
  const { isOwner, loginOwner, logoutOwner, cart, cartCount, removeFromCart, updateCartQuantity, clearCart, categories, addToCart } = useInventory();
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const allProducts = categories.flatMap(cat => 
    cat.typesOfGoods.map(good => ({
      ...good,
      categoryId: cat.id,
      categoryName: cat.name
    }))
  );

  const filteredProducts = searchQuery.trim() === ""
    ? []
    : allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
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
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchFocused(true);
                  }}
                  onFocus={() => setSearchFocused(true)}
                  className={`w-full bg-surface-light/80 border rounded-2xl py-3 px-5 pr-12 text-sm text-white placeholder:text-slate/50 focus:outline-none transition-all duration-300 ${
                    searchFocused
                      ? 'border-saffron/40 shadow-[0_0_20px_rgba(245,158,11,0.1)] bg-surface-light'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-saffron to-gold text-navy p-2 rounded-xl hover:shadow-lg hover:shadow-saffron/20 transition-all duration-300 cursor-pointer">
                  <Search size={16} strokeWidth={2.5} />
                </button>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {searchFocused && searchQuery.trim() !== "" && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setSearchFocused(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        className="absolute left-0 right-0 top-full mt-3 glass-card rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden max-h-[350px] overflow-y-auto"
                      >
                        <div className="p-3 border-b border-white/10 text-xs text-white/40 font-semibold tracking-wider uppercase">
                          Search Results
                        </div>
                        {filteredProducts.length === 0 ? (
                          <div className="p-6 text-center text-white/50 text-sm">
                            No commodity found named <span className="text-saffron font-bold">"{searchQuery}"</span>
                          </div>
                        ) : (
                          <div className="divide-y divide-white/5">
                            {filteredProducts.map(product => (
                              <div key={product.id} className="p-3 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden relative border border-white/10 shrink-0">
                                    <Image src={product.image} alt={product.name} fill className="object-cover" sizes="40px" />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-white text-xs font-bold truncate">{product.name}</h4>
                                    <p className="text-saffron text-[10px] font-bold mt-0.5">{product.price}</p>
                                    <p className="text-white/30 text-[10px]">{product.categoryName}</p>
                                  </div>
                                </div>
                                <button
                                  disabled={!product.isAvailable}
                                  onClick={() => {
                                    if (product.isAvailable) {
                                      addToCart(product.categoryId, product.categoryName, product);
                                    }
                                  }}
                                  className={`font-bold py-1.5 px-3 rounded-lg text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                                    product.isAvailable
                                      ? 'bg-saffron text-navy hover:bg-gold cursor-pointer'
                                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                                  }`}
                                >
                                  <ShoppingCart size={12} />
                                  {product.isAvailable ? 'Add' : 'Out'}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => isOwner ? router.push("/owner") : setShowLogin(true)}
                className="flex flex-col items-center text-slate/70 hover:text-saffron transition-colors duration-200 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                {isOwner ? <Lock size={20} className="text-saffron" strokeWidth={1.5} /> : <User size={20} strokeWidth={1.5} />}
                <span className="text-[9px] mt-1 font-medium">Owner</span>
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
                            <a
                              href={`https://wa.me/919064113345?text=${encodeURIComponent(
                                `Hello Kushal Enterprises! 👋\n\nI'd like to place an order for the following items:\n\n` +
                                cart.map((item, i) =>
                                  `${i + 1}. *${item.name}*\n   Qty: ${item.quantity}\n   Price: ${item.price}\n   Category: ${item.categoryName}`
                                ).join('\n\n') +
                                `\n\n📦 Total items: ${cartCount}\n\nKindly confirm availability and share the final quote. Thank you! 🙏`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => setShowCart(false)}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                              </svg>
                              Order via WhatsApp · {cartCount} item{cartCount !== 1 ? 's' : ''}
                            </a>
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-light border border-white/10 rounded-2xl py-3 px-4 pr-10 text-sm text-white placeholder:text-slate/50 focus:outline-none focus:border-saffron/30"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-saffron" size={16} />

                {/* Mobile Search Results */}
                {searchQuery.trim() !== "" && (
                  <div className="mt-3 glass-card rounded-2xl border border-white/10 overflow-hidden max-h-[250px] overflow-y-auto divide-y divide-white/5">
                    <div className="p-3 text-[10px] text-white/40 font-semibold tracking-wider uppercase bg-white/5">
                      Search Results
                    </div>
                    {filteredProducts.length === 0 ? (
                      <div className="p-4 text-center text-white/50 text-xs">
                        No commodity found named <span className="text-saffron font-bold">"{searchQuery}"</span>
                      </div>
                    ) : (
                      filteredProducts.map(product => (
                        <div key={product.id} className="p-3 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg overflow-hidden relative border border-white/10 shrink-0">
                              <Image src={product.image} alt={product.name} fill className="object-cover" sizes="32px" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-white text-xs font-bold truncate">{product.name}</h4>
                              <p className="text-saffron text-[9px] font-bold">{product.price}</p>
                            </div>
                          </div>
                          <button
                            disabled={!product.isAvailable}
                            onClick={() => {
                              if (product.isAvailable) {
                                addToCart(product.categoryId, product.categoryName, product);
                              }
                            }}
                            className={`font-bold py-1 px-2.5 rounded-lg text-[10px] transition-all flex items-center gap-1 shrink-0 ${
                              product.isAvailable
                                ? 'bg-saffron text-navy hover:bg-gold'
                                : 'bg-white/5 text-white/20'
                            }`}
                          >
                            <ShoppingCart size={10} />
                            {product.isAvailable ? 'Add' : 'Out'}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
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
                <li className="pt-2 border-t border-white/5">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      isOwner ? router.push("/owner") : setShowLogin(true);
                    }}
                    className="w-full text-left px-4 py-3 text-white/70 hover:text-saffron hover:bg-white/5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer font-medium"
                  >
                    {isOwner ? <Lock size={15} className="text-saffron" /> : <User size={15} />}
                    <span>{isOwner ? "Owner Dashboard" : "Owner Login"}</span>
                  </button>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

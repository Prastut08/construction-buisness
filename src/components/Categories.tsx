"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Shield, Sparkles, Building, CheckCircle2, ShoppingCart, Tag, Layers, Hammer, Droplets, Zap, Paintbrush, Lock, TreePine, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useInventory, CategoryData, GoodType } from "@/context/InventoryContext";

// Helper to map string icon names back to React components
const IconMap: Record<string, React.ReactNode> = {
  Layers: <Layers size={28} strokeWidth={1.5} />,
  Building: <Building size={28} strokeWidth={1.5} />,
  LayoutGrid: <LayoutGrid size={28} strokeWidth={1.5} />,
  Droplets: <Droplets size={28} strokeWidth={1.5} />,
  Zap: <Zap size={28} strokeWidth={1.5} />,
  Paintbrush: <Paintbrush size={28} strokeWidth={1.5} />,
  Lock: <Lock size={28} strokeWidth={1.5} />,
  TreePine: <TreePine size={28} strokeWidth={1.5} />,
  Hammer: <Hammer size={28} strokeWidth={1.5} />
};

export default function Categories() {
  const { categories, addToCart } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [selectedGood, setSelectedGood] = useState<GoodType | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  // When opening modal, keep the selected category reference fresh from context
  const activeCategory = selectedCategory 
    ? categories.find(c => c.id === selectedCategory.id) || selectedCategory
    : null;

  // Keep selected good fresh
  const activeGood = selectedGood && activeCategory
    ? activeCategory.typesOfGoods.find(g => g.id === selectedGood.id) || null
    : null;

  return (
    <section id="categories" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-saffron/3 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-accent-blue/3 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-saffron text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={12} /> Explore Materials
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-rajdhani font-bold text-white tracking-tight leading-none">
              Shop by <span className="text-gradient">Category</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-slate/60 font-medium text-base mt-3 max-w-lg">
              Select a category to view available types of goods and authorized brand suppliers.
            </motion.p>
          </div>
          <Link href="/catalog" className="text-white font-bold hover:text-saffron transition-all flex items-center gap-2 group text-sm glass-card rounded-xl px-5 py-2.5 hover:border-saffron/20 cursor-pointer">
            Browse Catalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <motion.div key={category.id}
              onClick={() => { setSelectedCategory(category); setSelectedGood(null); }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }} whileHover={{ y: -8, scale: 1.03 }}
              className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer text-center relative group min-h-[140px]">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 text-white/80`}>
                {IconMap[category.iconName] || <Layers size={28} strokeWidth={1.5} />}
              </div>
              <h3 className="font-rajdhani font-bold text-white text-sm leading-tight">{category.name}</h3>
              <div className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-saffron font-bold uppercase tracking-wider">
                Explore &rarr;
              </div>
            </motion.div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-12 glass-card rounded-2xl">
              <p className="text-white/50">No categories available at the moment.</p>
            </div>
          )}
        </div>

        {/* Category Details Modal */}
        <AnimatePresence>
          {activeCategory && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-4"
              onClick={() => { setSelectedCategory(null); setSelectedGood(null); }}>
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="glass-card rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}>
                
                {/* Modal Header */}
                <div className={`p-8 bg-gradient-to-r ${activeCategory.bgGradient} text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid opacity-10" />
                  <button onClick={() => { setSelectedCategory(null); setSelectedGood(null); }}
                    className="absolute top-6 right-6 bg-white/10 hover:bg-white/25 hover:rotate-90 transition-all rounded-full p-2 text-white/95 cursor-pointer z-10">
                    <X size={20} />
                  </button>
                  <div className="flex items-center gap-4 mb-2 relative z-10">
                    <span className="text-white/90 bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
                      {IconMap[activeCategory.iconName] || <Layers size={28} />}
                    </span>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-rajdhani font-bold">{activeCategory.name}</h3>
                      <p className="text-white/70 font-medium text-sm max-w-2xl mt-1">{activeCategory.tagline}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/5 overflow-y-auto flex-1 p-6 md:p-8">
                  <div className="pb-6 md:pb-0 md:pr-8 flex flex-col">
                    <h4 className="text-lg font-rajdhani font-bold text-white flex items-center gap-2 mb-5">
                      <CheckCircle2 className="text-saffron" size={20} /> Types of Goods Available
                    </h4>
                    {activeCategory.typesOfGoods.length === 0 ? (
                      <p className="text-white/30 text-sm mb-6">No items listed in this category yet.</p>
                    ) : (
                      <div className="space-y-2.5 mb-6">
                        {activeCategory.typesOfGoods.map((good, idx) => (
                          <motion.div key={good.id} onClick={() => setSelectedGood(good)}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all group ${
                              activeGood?.id === good.id
                                ? "glass-card border-saffron/30 shadow-lg shadow-saffron/5"
                                : "border-white/5 hover:border-saffron/10 hover:bg-white/3"
                            }`}>
                            <div>
                              <span className="font-bold text-white/90 text-sm flex items-center gap-2">
                                {good.name}
                                {!good.isAvailable && (
                                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase">Out of Stock</span>
                                )}
                              </span>
                              <span className="text-xs text-saffron font-bold flex items-center gap-1 mt-1">
                                <Tag size={10} /> {good.price}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-white/30 group-hover:text-saffron group-hover:translate-x-1 transition-all">
                              View &rarr;
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-auto pt-5 border-t border-white/5">
                      <h4 className="text-base font-rajdhani font-bold text-white flex items-center gap-2 mb-3">
                        <Building className="text-saffron" size={16} /> Brand Partners
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activeCategory.brands.map((brand) => (
                          <div key={brand.name}
                            className="text-xs font-bold text-white/70 glass-card rounded-lg px-3 py-1.5 hover:border-saffron/20 cursor-help transition-all"
                            title={brand.description}>
                            {brand.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 md:pt-0 md:pl-8 flex flex-col justify-between min-h-[300px]">
                    <AnimatePresence mode="wait">
                      {activeGood ? (
                        <motion.div key={activeGood.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="flex flex-col h-full justify-between">
                          <div>
                            <div className="h-56 relative rounded-2xl overflow-hidden shadow-xl border border-white/5 mb-5 bg-surface relative group">
                              <Image src={activeGood.image} alt={activeGood.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                              <div className="absolute top-3 left-3 glass rounded-full text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1.5">
                                <Sparkles size={10} className="text-saffron" /> Premium
                              </div>
                              {!activeGood.isAvailable && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                                  <div className="border-2 border-red-500 text-red-500 font-bold uppercase tracking-widest px-6 py-2 rotate-[-15deg] text-xl rounded">Out of Stock</div>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-between items-start mb-3 gap-2">
                              <h5 className="font-rajdhani font-bold text-white text-2xl leading-tight">{activeGood.name}</h5>
                              <div className="text-right flex-shrink-0">
                                <span className="text-[10px] text-white/30 font-bold uppercase block">Wholesale</span>
                                <span className="text-xl font-bold text-saffron">{activeGood.price}</span>
                              </div>
                            </div>
                            <p className="text-white/50 text-sm leading-relaxed mb-5">{activeGood.description}</p>
                          </div>
                          <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 mt-3">
                            <div>
                              <span className="text-[10px] text-white/30 font-semibold block">Same-Day Site Delivery</span>
                              <span className="text-xs font-bold text-white/70">Brand Yard Sourced</span>
                            </div>
                            <button 
                              disabled={!activeGood.isAvailable}
                              onClick={() => {
                                if (activeGood.isAvailable && activeCategory) {
                                  addToCart(activeCategory.id, activeCategory.name, activeGood);
                                  setAddedToCart(activeGood.id);
                                  setTimeout(() => setAddedToCart(null), 1500);
                                }
                              }}
                              className={`w-full sm:w-auto font-bold p-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg ${
                                addedToCart === activeGood.id
                                  ? 'bg-green-500 text-white shadow-green-500/20 cursor-default'
                                  : activeGood.isAvailable 
                                    ? 'bg-gradient-to-r from-saffron to-gold text-navy shadow-saffron/20 hover:shadow-saffron/30 cursor-pointer' 
                                    : 'bg-white/10 text-white/30 cursor-not-allowed shadow-none'
                              }`}>
                              <ShoppingCart size={14} /> {addedToCart === activeGood.id ? 'Added!' : activeGood.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center h-full py-12 text-white/20">
                          <Layers size={48} className="mb-4 text-white/10" />
                          <h5 className="font-rajdhani font-bold text-white/40 text-xl mb-2">Select a product type</h5>
                          <p className="text-sm max-w-xs text-white/20">Click on any goods on the left to view details, pricing, and product images.</p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2 text-xs text-white/30 font-medium">
                    <Shield size={14} className="text-accent-green" />
                    All products sourced from verified authorized brand yards.
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button onClick={() => { setSelectedCategory(null); setSelectedGood(null); }}
                      className="flex-1 sm:flex-none border border-white/10 hover:bg-white/5 text-white/60 font-bold px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer">
                      Close
                    </button>
                    <button className="flex-1 sm:flex-none bg-gradient-to-r from-saffron to-gold text-navy font-bold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-saffron/20 cursor-pointer">
                      Request Quote <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

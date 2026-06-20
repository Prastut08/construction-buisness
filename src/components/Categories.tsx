"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Sparkles, Building, CheckCircle2, ShoppingCart, Tag, Layers, Hammer, Droplets, Zap, Paintbrush, Lock, TreePine, LayoutGrid, Minus, Plus, ArrowRight } from "lucide-react";
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
  const { categories, addToCart, updateGood, updateCategory, isOwner } = useInventory();
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [selectedGood, setSelectedGood] = useState<GoodType | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCategoryGenerating, setIsCategoryGenerating] = useState<string | null>(null);
  
  const attemptedCategoryIdsRef = useRef<Set<string>>(new Set());

  // Auto-generate missing category images in the background on mount/load
  useEffect(() => {
    const generateAllMissing = async () => {
      for (const cat of categories) {
        if (!cat.image && !attemptedCategoryIdsRef.current.has(cat.id)) {
          attemptedCategoryIdsRef.current.add(cat.id);
          try {
            const res = await fetch("/api/generate-image", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                name: cat.name,
                description: cat.tagline || ""
              })
            });
            if (res.ok) {
              const data = await res.json();
              if (data.imageUrl) {
                await updateCategory(cat.id, { image: data.imageUrl });
              }
            }
          } catch (e) {
            console.error("Failed to background-generate category image for", cat.name, e);
          }
        }
      }
    };
    if (categories && categories.length > 0) {
      generateAllMissing();
    }
  }, [categories, updateCategory]);

  const handleAutoGenerateCategoryImage = async (category: CategoryData) => {
    if (isCategoryGenerating) return;
    console.log("AI Generation: Starting for category", category.name);
    setIsCategoryGenerating(category.id);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: category.name,
          description: category.tagline || ""
        })
      });
      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data = await res.json();
      if (data.imageUrl) {
        await updateCategory(category.id, { image: data.imageUrl });
        console.log("AI Category Generation Success!");
      }
    } catch (error: any) {
      console.error("AI Category Generation Failed:", error);
      alert("AI Generation Error: " + (error?.message || error));
    } finally {
      setIsCategoryGenerating(null);
    }
  };

  const handleAutoGenerateImage = async (catId: string, good: GoodType) => {
    if (isGenerating) return;
    console.log("AI Generation: Starting for", good.name, "(ID:", good.id, ")");
    setIsGenerating(true);
    try {
      console.log("AI Generation: Sending POST request to /api/generate-image...");
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: good.name,
          description: good.description
        })
      });
      console.log("AI Generation: Received response status:", res.status);
      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data = await res.json();
      console.log("AI Generation: Response JSON:", data);
      if (data.imageUrl) {
        console.log("AI Generation: Updating database with image URL:", data.imageUrl);
        await updateGood(catId, good.id, { image: data.imageUrl });
        console.log("AI Generation: Success!");
      }
    } catch (error: any) {
      console.error("AI Generation: Failed with error:", error);
      alert("AI Generation Error: " + (error?.message || error));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectGood = (good: GoodType | null, catId?: string) => {
    setSelectedGood(good);
    setProductQuantity(1);

    if (good && catId) {
      const imgUrl = good.image || "";
      if (imgUrl.includes("unsplash.com") || !imgUrl) {
        handleAutoGenerateImage(catId, good);
      }
    }
  };

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
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-saffron/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-accent-blue/3 rounded-full blur-[120px] pointer-events-none" />

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
              onClick={() => { setSelectedCategory(category); handleSelectGood(null); }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }} whileHover={{ y: -8, scale: 1.03 }}
              className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer text-center relative group min-h-[150px]">
              <div className="w-20 h-20 rounded-xl overflow-hidden relative mb-3 group-hover:scale-110 transition-transform duration-300 border border-white/10 flex items-center justify-center bg-white/5">
                {category.image ? (
                  <Image src={category.image} alt={category.name} fill sizes="80px" className="object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${category.color} flex items-center justify-center text-white/80`}>
                    {IconMap[category.iconName] || <Layers size={36} strokeWidth={1.5} />}
                  </div>
                )}
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
              onClick={() => { setSelectedCategory(null); handleSelectGood(null); }}>
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="glass-card rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}>
                
                {/* Modal Header */}
                <div className={`p-8 bg-gradient-to-r ${activeCategory.bgGradient} text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
                  <button onClick={() => { setSelectedCategory(null); handleSelectGood(null); }}
                    className="absolute top-6 right-6 bg-white/10 hover:bg-white/25 hover:rotate-90 transition-all rounded-full p-2 text-white/95 cursor-pointer z-50">
                    <X size={20} />
                  </button>
                  <div className="flex items-center gap-5 mb-2 relative z-10">
                    {activeCategory.image ? (
                      <div 
                        onClick={() => isOwner && handleAutoGenerateCategoryImage(activeCategory)}
                        className={`w-28 h-28 rounded-2xl overflow-hidden relative border border-white/20 shadow-md bg-white/10 shrink-0 ${isOwner ? 'cursor-pointer hover:border-saffron/50 group/catimg' : ''}`}
                        title={isOwner ? "Owner: Click to regenerate category image" : undefined}
                      >
                        <Image src={activeCategory.image} alt={activeCategory.name} fill sizes="112px" className="object-cover" />
                        {isOwner && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/catimg:opacity-100 transition-opacity flex items-center justify-center">
                            <Sparkles size={16} className="text-saffron animate-pulse" />
                          </div>
                        )}
                        {isCategoryGenerating === activeCategory.id && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                            <div className="w-5 h-5 rounded-full border-2 border-saffron/20 border-t-saffron animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-white/90 bg-white/15 p-5 rounded-2xl backdrop-blur-sm shrink-0">
                        {IconMap[activeCategory.iconName] || <Layers size={36} />}
                      </span>
                    )}
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
                          <motion.div key={good.id} onClick={() => handleSelectGood(good, activeCategory?.id)}
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
                            <div 
                              onClick={() => activeCategory && handleAutoGenerateImage(activeCategory.id, activeGood)}
                              className="h-56 relative rounded-2xl overflow-hidden shadow-xl border border-white/5 mb-5 bg-surface group cursor-pointer hover:border-saffron/30 transition-all"
                              title="Click to generate/regenerate AI image"
                            >
                              {activeGood.image && (
                                <Image src={activeGood.image} alt={activeGood.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                              )}
                              
                              {/* Click to Regenerate Overlay on Hover */}
                              {!isGenerating && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white font-bold text-xs pointer-events-none z-20 backdrop-blur-[1px]">
                                  <Sparkles size={16} className="text-saffron animate-pulse" />
                                  <span>Click to Regenerate AI Image</span>
                                </div>
                              )}
                              
                              {/* Generating Overlay */}
                              {isGenerating && (
                                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                                  <div className="relative w-10 h-10 mb-3">
                                    <div className="absolute inset-0 rounded-full border-4 border-saffron/20 animate-ping" />
                                    <div className="absolute inset-0 rounded-full border-4 border-t-saffron animate-spin" />
                                  </div>
                                  <span className="text-saffron text-xs font-bold uppercase tracking-wider animate-pulse">Generating AI Image...</span>
                                </div>
                              )}

                              <div className="absolute top-3 left-3 glass rounded-full text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1.5 z-10">
                                <Sparkles size={10} className="text-saffron animate-pulse" /> {activeGood.image && (activeGood.image.includes("pollinations.ai") || activeGood.image.includes("pexels.com")) ? "Premium Photo" : "Premium"}
                              </div>


                              <button 
                                onClick={() => handleSelectGood(null)}
                                className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white/90 hover:text-white hover:scale-105 p-2 rounded-xl backdrop-blur-md transition-all z-25 cursor-pointer"
                                title="Close product details"
                              >
                                <X size={14} />
                              </button>
                              {!activeGood.isAvailable && (
                                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10">
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
                            <div className="flex flex-col gap-0.5 shrink-0">
                              <span className="text-[10px] text-white/30 font-semibold block">Same-Day Site Delivery</span>
                              <span className="text-xs font-bold text-white/70">Brand Yard Sourced</span>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                              {/* Quantity Selector */}
                              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                                <button 
                                  onClick={() => setProductQuantity(prev => Math.max(1, prev - 1))}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 hover:text-white text-white/60 flex items-center justify-center transition-colors cursor-pointer"
                                  title="Decrease quantity"
                                >
                                  <Minus size={12} />
                                </button>
                                <input
                                  type="number"
                                  min={1}
                                  value={productQuantity}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val) && val >= 1) setProductQuantity(val);
                                    else if (e.target.value === "") setProductQuantity(1);
                                  }}
                                  className="text-white text-sm font-bold w-12 text-center bg-transparent outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  title="Enter quantity"
                                />
                                <button 
                                  onClick={() => setProductQuantity(prev => prev + 1)}
                                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 hover:text-white text-white/60 flex items-center justify-center transition-colors cursor-pointer"
                                  title="Increase quantity"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <button 
                                disabled={!activeGood.isAvailable}
                                onClick={() => {
                                  if (activeGood.isAvailable && activeCategory) {
                                    addToCart(activeCategory.id, activeCategory.name, activeGood, productQuantity);
                                    setAddedToCart(activeGood.id);
                                    setTimeout(() => setAddedToCart(null), 1500);
                                  }
                                }}
                                className={`flex-1 sm:flex-none font-bold py-3 px-5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shrink-0 ${
                                  addedToCart === activeGood.id
                                    ? 'bg-green-500 text-white shadow-green-500/20 cursor-default'
                                    : activeGood.isAvailable 
                                      ? 'bg-gradient-to-r from-saffron to-gold text-navy shadow-saffron/20 hover:shadow-saffron/30 cursor-pointer' 
                                      : 'bg-white/10 text-white/30 cursor-not-allowed shadow-none'
                                }`}>
                                <ShoppingCart size={14} />
                                {addedToCart === activeGood.id 
                                  ? 'Added!' 
                                  : activeGood.isAvailable 
                                    ? `Add ${productQuantity > 1 ? `(${productQuantity})` : ''} to Cart` 
                                    : 'Out of Stock'
                                }
                              </button>
                            </div>
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
                <div className="p-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-white/30 font-medium">
                    <Shield size={14} className="text-accent-green" />
                    All products sourced from verified authorized brand yards.
                  </div>
                  <button
                    onClick={() => { setSelectedCategory(null); handleSelectGood(null); }}
                    className="bg-white/10 hover:bg-white/25 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 border border-white/10 hover:border-white/20 shrink-0"
                  >
                    <X size={12} /> Close Category
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

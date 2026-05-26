"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useInventory, CategoryData } from "@/context/InventoryContext";
import { ChevronDown, ChevronUp, Layers, Building, LayoutGrid, Droplets, Zap, Paintbrush, Lock, TreePine, Hammer, Tag, Sparkles } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const IconMap: Record<string, React.ReactNode> = {
  Layers: <Layers size={20} />,
  Building: <Building size={20} />,
  LayoutGrid: <LayoutGrid size={20} />,
  Droplets: <Droplets size={20} />,
  Zap: <Zap size={20} />,
  Paintbrush: <Paintbrush size={20} />,
  Lock: <Lock size={20} />,
  TreePine: <TreePine size={20} />,
  Hammer: <Hammer size={20} />
};

export default function CatalogPage() {
  const { categories } = useInventory();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron/5 rounded-full blur-[150px] pointer-events-none" />
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-saffron text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={12} /> Full Inventory
          </div>
          <h1 className="text-4xl md:text-5xl font-rajdhani font-bold text-white tracking-tight mb-3">
            Browse by <span className="text-gradient">Categories</span>
          </h1>
          <p className="text-white/50 text-base max-w-2xl">
            Explore our complete catalog in a detailed tabular view. Click on any category to view all available materials, pricing, and specifications.
          </p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-5 bg-white/5 border-b border-white/10 text-xs font-bold text-white/50 uppercase tracking-wider hidden md:grid">
            <div className="col-span-4">Category Name</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-2 text-center">Items Count</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/5">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col">
                {/* Category Row */}
                <div 
                  onClick={() => toggleCategory(category.id)}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-5 items-center cursor-pointer transition-colors ${
                    expandedCategory === category.id ? 'bg-white/5' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white/80 shrink-0`}>
                      {IconMap[category.iconName] || <Layers size={20} />}
                    </div>
                    <div>
                      <h3 className="font-rajdhani font-bold text-lg text-white">{category.name}</h3>
                      <span className="md:hidden text-xs text-saffron">{category.typesOfGoods.length} items</span>
                    </div>
                  </div>
                  
                  <div className="hidden md:block col-span-5 text-sm text-white/50">
                    {category.tagline}
                  </div>
                  
                  <div className="hidden md:block col-span-2 text-center">
                    <span className="bg-white/10 text-white/80 text-xs font-bold px-3 py-1 rounded-full">
                      {category.typesOfGoods.length} items
                    </span>
                  </div>
                  
                  <div className="hidden md:flex col-span-1 justify-end text-white/40">
                    {expandedCategory === category.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Expanded Objects Table */}
                <AnimatePresence>
                  {expandedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-black/20"
                    >
                      <div className="p-4 md:p-6 border-t border-white/5">
                        {category.typesOfGoods.length === 0 ? (
                          <div className="text-center py-8 text-white/30 text-sm italic">
                            No items currently listed in this category.
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                              <thead>
                                <tr className="border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-wider">
                                  <th className="pb-3 pl-4">Product Image</th>
                                  <th className="pb-3">Product Name & Details</th>
                                  <th className="pb-3 text-right">Price</th>
                                  <th className="pb-3 text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {category.typesOfGoods.map((good) => (
                                  <tr key={good.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-4 pl-4 w-24">
                                      <div className="w-16 h-16 rounded-lg overflow-hidden relative border border-white/10">
                                        <Image src={good.image} alt={good.name} fill className="object-cover" sizes="64px" />
                                      </div>
                                    </td>
                                    <td className="py-4 pr-4">
                                      <h4 className="font-bold text-white text-sm mb-1">{good.name}</h4>
                                      <p className="text-white/40 text-xs line-clamp-1 max-w-md">{good.description}</p>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                      <div className="inline-flex items-center gap-1.5 text-saffron font-bold text-sm bg-saffron/10 px-3 py-1.5 rounded-lg">
                                        <Tag size={12} /> {good.price}
                                      </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm ${
                                        good.isAvailable 
                                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                      }`}>
                                        {good.isAvailable ? 'In Stock' : 'Out of Stock'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="p-10 text-center text-white/40">
                No categories available to display.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

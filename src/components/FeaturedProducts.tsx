"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart, ArrowRight, Sparkles, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const products = [
  { id: 1, name: "UltraTech Super Cement - 50kg", category: "Cement", price: 395, mrp: 450, rating: 4.8, reviews: 124, image: "https://images.unsplash.com/photo-1621905252472-7484d0d04da8?q=80&w=800&auto=format&fit=crop", tag: "Bestseller", tagColor: "from-saffron to-gold" },
  { id: 2, name: "Tata Tiscon 550SD TMT Rebar - 12mm", category: "Steel", price: 82, unit: "per kg", mrp: 90, rating: 4.9, reviews: 89, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop", tag: "High Quality", tagColor: "from-accent-blue to-blue-400" },
  { id: 3, name: "Kajaria Vitrified Floor Tiles (2x2 ft)", category: "Tiles", price: 850, unit: "per box", mrp: 1200, rating: 4.6, reviews: 56, image: "https://images.unsplash.com/photo-1523413651479-59cb1f1f6f9e?q=80&w=800&auto=format&fit=crop", tag: "29% Off", tagColor: "from-accent-green to-emerald-400" },
  { id: 4, name: "Asian Paints Royale Luxury Emulsion - 20L", category: "Paints", price: 6450, mrp: 7200, rating: 4.7, reviews: 210, image: "https://images.unsplash.com/photo-1562184552-094191060934?q=80&w=800&auto=format&fit=crop", tag: "Premium", tagColor: "from-purple-500 to-violet-400" }
];

export default function FeaturedProducts() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-saffron/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-accent-blue/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-1.5 text-saffron text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={12} /> Top Picks
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-rajdhani font-bold text-white tracking-tight leading-none">
              Featured <span className="text-gradient">Products</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-slate/60 font-medium text-base mt-3">
              Top picks for your construction needs at wholesale prices
            </motion.p>
          </div>
          <motion.button 
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white font-bold hover:text-saffron transition-all flex items-center gap-2 group text-sm glass-card rounded-xl px-5 py-2.5 hover:border-saffron/20 cursor-pointer press-effect"
          >
            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product, index) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="glass-card rounded-2xl overflow-hidden group relative cursor-pointer hover-lift"
            >
              {/* Tag badge */}
              {product.tag && (
                <div className={`absolute top-4 left-4 z-10 bg-gradient-to-r ${product.tagColor} text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg`}>
                  {product.tag}
                </div>
              )}
              
              {/* Action buttons */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: hoveredId === product.id ? 1 : 0, scale: hoveredId === product.id ? 1 : 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => { e.stopPropagation(); toggleLike(product.id); }}
                  className={`p-2 glass rounded-full transition-all cursor-pointer ${liked.has(product.id) ? 'text-red-400 bg-red-500/20' : 'text-white/50 hover:text-red-400'}`}
                >
                  <Heart size={14} className={liked.has(product.id) ? 'fill-current' : ''} />
                </motion.button>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: hoveredId === product.id ? 1 : 0, scale: hoveredId === product.id ? 1 : 0.8 }}
                  transition={{ duration: 0.2, delay: 0.05 }}
                  className="p-2 glass rounded-full text-white/50 hover:text-accent-blue transition-colors cursor-pointer"
                >
                  <Eye size={14} />
                </motion.button>
              </div>

              {/* Image with zoom effect */}
              <div className="h-52 relative overflow-hidden bg-surface">
                <Image src={product.image} alt={product.name} fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" sizes="(max-width: 768px) 100vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                
                {/* Discount percentage pill */}
                {product.mrp > product.price && (
                  <div className="absolute bottom-3 left-3 bg-accent-green/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="text-[10px] text-saffron/80 font-bold mb-1.5 uppercase tracking-widest">{product.category}</div>
                <h3 className="font-bold text-white/90 text-sm leading-tight mb-2.5 h-9 overflow-hidden line-clamp-2 group-hover:text-white transition-colors">
                  {product.name}
                </h3>
                
                {/* Rating with stars */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={10} className={i < Math.floor(product.rating) ? 'fill-saffron text-saffron' : 'text-white/15'} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white/70">{product.rating}</span>
                  <span className="text-[10px] text-white/30">({product.reviews})</span>
                </div>
                
                {/* Price section */}
                <div className="flex items-end justify-between mt-auto pt-3 border-t border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-white">₹{product.price}</span>
                      <span className="text-xs text-white/30 line-through">₹{product.mrp}</span>
                    </div>
                    {product.unit && <div className="text-[10px] text-white/30 mt-0.5">{product.unit}</div>}
                  </div>
                  <button className="bg-gradient-to-r from-saffron to-gold text-navy p-2.5 rounded-xl transition-all shadow-lg shadow-saffron/10 hover:shadow-saffron/25 cursor-pointer hover:scale-110 press-effect group/btn">
                    <ShoppingCart size={16} className="group-hover/btn:rotate-[-8deg] transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

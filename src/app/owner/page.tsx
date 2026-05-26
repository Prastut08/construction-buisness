"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInventory } from "@/context/InventoryContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit2, Check, X, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function OwnerDashboard() {
  const { categories, isOwner, addCategory, removeCategory, addGood, updateGood, removeGood, toggleAvailability } = useInventory();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Editing state
  const [editingGoodId, setEditingGoodId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", description: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isOwner) {
      router.push("/");
    }
  }, [mounted, isOwner, router]);

  if (!mounted || !isOwner) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center">
          <ShieldAlert size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/50 mb-6">You must be logged in as an owner to view this page.</p>
          <Link href="/" className="bg-saffron text-navy font-bold px-6 py-2 rounded-xl">Return Home</Link>
        </div>
      </div>
    );
  }

  const handleAddNewCategory = () => {
    const name = prompt("Enter new category name:");
    if (!name) return;
    addCategory({
      name,
      iconName: "Layers",
      color: "from-slate-500/20 to-slate-700/10",
      bgGradient: "from-slate-600 to-slate-800",
      tagline: "New Category",
      typesOfGoods: [],
      brands: []
    });
  };

  const handleAddNewGood = (categoryId: string) => {
    const name = prompt("Enter item name:");
    if (!name) return;
    const price = prompt("Enter price:") || "₹0";
    addGood(categoryId, {
      name,
      price,
      description: "New item description",
      image: "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
      isAvailable: true
    });
  };

  const startEditing = (good: any) => {
    setEditingGoodId(good.id);
    setEditForm({ name: good.name, price: good.price, description: good.description });
  };

  const saveEditing = (categoryId: string) => {
    if (editingGoodId) {
      updateGood(categoryId, editingGoodId, editForm);
      setEditingGoodId(null);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-rajdhani font-bold text-white">Owner Dashboard</h1>
            <p className="text-white/50 text-sm">Manage categories and inventory</p>
          </div>
          <button onClick={handleAddNewCategory} className="bg-saffron hover:bg-saffron-dark text-navy font-bold px-4 py-2 rounded-xl flex items-center gap-2">
            <Plus size={18} /> Add Category
          </button>
        </div>

        <div className="space-y-8">
          {categories.map(category => (
            <div key={category.id} className="glass-card rounded-2xl p-6 border border-white/5">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                <h2 className="text-2xl font-rajdhani font-bold text-white">{category.name}</h2>
                <div className="flex gap-2">
                  <button onClick={() => handleAddNewGood(category.id)} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors">
                    <Plus size={14} /> Add Item
                  </button>
                  <button onClick={() => { if(confirm(`Delete category ${category.name}?`)) removeCategory(category.id) }} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors">
                    <Trash2 size={14} /> Delete Category
                  </button>
                </div>
              </div>

              {category.typesOfGoods.length === 0 ? (
                <p className="text-white/30 text-sm italic">No items in this category yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.typesOfGoods.map(good => (
                    <div key={good.id} className="bg-surface border border-white/5 rounded-xl p-4 flex flex-col">
                      {editingGoodId === good.id ? (
                        <div className="flex flex-col gap-3">
                          <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="bg-navy border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Name" />
                          <input type="text" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="bg-navy border border-white/10 rounded-lg px-3 py-2 text-white text-sm" placeholder="Price" />
                          <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="bg-navy border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" placeholder="Description" rows={2} />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => saveEditing(category.id)} className="bg-green-500/20 hover:bg-green-500/40 text-green-400 px-3 py-1.5 rounded-lg text-sm flex-1 flex items-center justify-center gap-1">
                              <Check size={14} /> Save
                            </button>
                            <button onClick={() => setEditingGoodId(null)} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm flex-1 flex items-center justify-center gap-1">
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white text-sm">{good.name}</h3>
                            <button onClick={() => toggleAvailability(category.id, good.id)} className={`px-2 py-1 rounded text-[10px] font-bold ${good.isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {good.isAvailable ? 'Available' : 'Out of Stock'}
                            </button>
                          </div>
                          <p className="text-saffron font-bold text-sm mb-2">{good.price}</p>
                          <p className="text-white/40 text-xs mb-4 flex-1 line-clamp-2">{good.description}</p>
                          
                          <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                            <button onClick={() => startEditing(good)} className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs flex-1 flex items-center justify-center gap-1 transition-colors">
                              <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={() => { if(confirm(`Delete ${good.name}?`)) removeGood(category.id, good.id) }} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs flex-1 flex items-center justify-center gap-1 transition-colors">
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <div className="text-center py-12 glass-card rounded-2xl">
              <p className="text-white/50">No categories found. Click "Add Category" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

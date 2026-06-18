"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInventory } from "@/context/InventoryContext";
import { Plus, Trash2, Edit2, Check, X, ShieldAlert, Pencil, Building2, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

const ColorThemes = [
  { name: "Slate", value: "slate", color: "from-slate-500/20 to-slate-700/10", bgGradient: "from-slate-600 to-slate-800" },
  { name: "Stone", value: "stone", color: "from-stone-500/20 to-stone-700/10", bgGradient: "from-stone-600 to-stone-800" },
  { name: "Orange/Red", value: "orange", color: "from-orange-500/20 to-red-600/10", bgGradient: "from-orange-500 to-red-600" },
  { name: "Blue", value: "blue", color: "from-blue-500/20 to-sky-600/10", bgGradient: "from-blue-500 to-sky-600" },
  { name: "Yellow/Amber", value: "yellow", color: "from-yellow-500/20 to-amber-600/10", bgGradient: "from-yellow-500 to-amber-600" },
  { name: "Rose/Pink", value: "rose", color: "from-rose-500/20 to-pink-600/10", bgGradient: "from-rose-500 to-pink-600" },
  { name: "Zinc", value: "zinc", color: "from-zinc-500/20 to-zinc-700/10", bgGradient: "from-zinc-600 to-zinc-800" },
  { name: "Amber/Brown", value: "amber", color: "from-amber-600/20 to-amber-800/10", bgGradient: "from-amber-600 to-amber-800" },
];

export default function OwnerDashboard() {
  const {
    categories,
    isOwner,
    addCategory,
    removeCategory,
    updateCategoryName,
    updateCategory,
    addGood,
    updateGood,
    removeGood,
    toggleAvailability,
    addBrand,
    updateBrand,
    removeBrand,
  } = useInventory();

  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Inline editing state for products
  const [editingGoodId, setEditingGoodId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", description: "" });

  // Inline editing state for category name
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // Brand Partners state
  const [addingBrandCatId, setAddingBrandCatId] = useState<string | null>(null);
  const [newBrand, setNewBrand] = useState({ name: "", description: "", popularity: "" });
  const [editingBrand, setEditingBrand] = useState<{ catId: string; originalName: string } | null>(null);
  const [editBrandForm, setEditBrandForm] = useState({ name: "", description: "", popularity: "" });
  
  const [isCategoryGenerating, setIsCategoryGenerating] = useState<string | null>(null);

  const handleRegenerateCategoryImage = async (catId: string, name: string, tagline: string) => {
    if (isCategoryGenerating) return;
    setIsCategoryGenerating(catId);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          description: tagline || ""
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.imageUrl) {
          await updateCategory(catId, { image: data.imageUrl });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCategoryGenerating(null);
    }
  };

  // Add category modal states
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [isCategorySaving, setIsCategorySaving] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    tagline: "",
    colorTheme: "slate",
  });

  // Add good modal states
  const [showAddGoodModal, setShowAddGoodModal] = useState(false);
  const [targetCatIdForGood, setTargetCatIdForGood] = useState<string | null>(null);
  const [isProductSaving, setIsProductSaving] = useState(false);
  const [goodForm, setGoodForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    autoGenerateImage: true,
  });

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
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center">
          <ShieldAlert size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-white/50 mb-6">You must be logged in as an owner to view this page.</p>
          <Link href="/" className="bg-saffron text-navy font-bold px-6 py-2 rounded-xl">Return Home</Link>
        </div>
      </div>
    );
  }

  // ─── Category Handlers ───────────────────────────────────────────────────

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    setIsCategorySaving(true);
    const theme = ColorThemes.find(t => t.value === categoryForm.colorTheme) || ColorThemes[0];
    let imageUrl = "";

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: categoryForm.name,
          description: categoryForm.tagline
        })
      });
      if (res.ok) {
        const data = await res.json();
        imageUrl = data.imageUrl || "";
      }
    } catch (err) {
      console.error("Failed to generate category image on save:", err);
    }

    addCategory({
      name: categoryForm.name.trim(),
      iconName: "Layers",
      color: theme.color,
      bgGradient: theme.bgGradient,
      tagline: categoryForm.tagline.trim() || "Quality structural materials.",
      image: imageUrl,
      typesOfGoods: [],
      brands: [],
    });

    setIsCategorySaving(false);
    setShowAddCategoryModal(false);
    setCategoryForm({
      name: "",
      tagline: "",
      colorTheme: "slate",
    });
  };

  const handleSaveGood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCatIdForGood || !goodForm.name.trim()) return;

    setIsProductSaving(true);
    let imageUrl = goodForm.image.trim() || "";

    if (goodForm.autoGenerateImage && !imageUrl) {
      try {
        const res = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: goodForm.name,
            description: goodForm.description
          })
        });
        if (res.ok) {
          const data = await res.json();
          imageUrl = data.imageUrl || "";
        }
      } catch (err) {
        console.error("Failed to auto-generate image on save:", err);
      }
    }

    if (!imageUrl) {
      imageUrl = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop";
    }

    addGood(targetCatIdForGood, {
      name: goodForm.name.trim(),
      price: goodForm.price.trim() || "₹0",
      description: goodForm.description.trim() || "No description provided.",
      image: imageUrl,
      isAvailable: true,
    });

    setIsProductSaving(false);
    setShowAddGoodModal(false);
    setGoodForm({
      name: "",
      price: "",
      description: "",
      image: "",
      autoGenerateImage: true,
    });
  };

  // ─── Category Inline-Edit Handlers ─────────────────────────────────────────

  const startEditingCategory = (categoryId: string, currentName: string) => {
    setEditingCategoryId(categoryId);
    setEditCategoryName(currentName);
  };

  const saveEditingCategory = () => {
    if (!editingCategoryId || editCategoryName.trim() === "") return;
    updateCategoryName(editingCategoryId, editCategoryName.trim());
    setEditingCategoryId(null);
    setEditCategoryName("");
  };

  const cancelEditingCategory = () => {
    setEditingCategoryId(null);
    setEditCategoryName("");
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    if (confirm(`Are you sure you want to delete "${categoryName}" and all its products?`)) {
      removeCategory(categoryId);
    }
  };

  // ─── Product Inline-Edit Handlers ───────────────────────────────────────────

  const startEditingGood = (good: { id: string; name: string; price: string; description: string }) => {
    setEditingGoodId(good.id);
    setEditForm({ name: good.name, price: good.price, description: good.description });
  };

  const saveEditingGood = (categoryId: string) => {
    if (!editingGoodId) return;
    updateGood(categoryId, editingGoodId, {
      name: editForm.name.trim(),
      price: editForm.price.trim(),
      description: editForm.description.trim(),
    });
    setEditingGoodId(null);
  };

  const handleDeleteGood = (categoryId: string, goodId: string, goodName: string) => {
    if (confirm(`Delete product "${goodName}"?`)) {
      removeGood(categoryId, goodId);
    }
  };

  // ─── Brand Handlers ──────────────────────────────────────────

  const handleAddBrand = (categoryId: string) => {
    if (!newBrand.name.trim()) return;
    addBrand(categoryId, {
      name: newBrand.name.trim(),
      description: newBrand.description.trim(),
      popularity: newBrand.popularity.trim(),
    });
    setNewBrand({ name: "", description: "", popularity: "" });
    setAddingBrandCatId(null);
  };

  const startEditingBrand = (catId: string, brand: { name: string; description: string; popularity: string }) => {
    setEditingBrand({ catId, originalName: brand.name });
    setEditBrandForm({ name: brand.name, description: brand.description, popularity: brand.popularity });
  };

  const saveEditingBrand = () => {
    if (!editingBrand || !editBrandForm.name.trim()) return;
    updateBrand(editingBrand.catId, editingBrand.originalName, {
      name: editBrandForm.name.trim(),
      description: editBrandForm.description.trim(),
      popularity: editBrandForm.popularity.trim(),
    });
    setEditingBrand(null);
  };

  const handleDeleteBrand = (categoryId: string, brandName: string) => {
    if (confirm(`Remove brand "${brandName}"?`)) {
      removeBrand(categoryId, brandName);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-rajdhani font-bold text-white">Owner Dashboard</h1>
            <p className="text-white/50 text-sm">Manage categories and inventory</p>
          </div>
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="bg-saffron hover:bg-amber-400 text-navy font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {categories.length === 0 && (
            <div className="text-center py-16 glass-card rounded-2xl">
              <p className="text-white/50 text-lg">No categories yet.</p>
              <p className="text-white/30 text-sm mt-1">Click "Add Category" above to get started.</p>
            </div>
          )}

          {categories.map((category) => (
            <div key={category.id} className="glass-card rounded-2xl p-6 border border-white/5">
              {/* Category Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                {/* Category Name - inline edit */}
                {editingCategoryId === category.id ? (
                  <div className="flex items-center gap-2 flex-1 mr-4">
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEditingCategory();
                        if (e.key === "Escape") cancelEditingCategory();
                      }}
                      autoFocus
                      className="bg-navy border border-saffron/50 focus:border-saffron rounded-lg px-3 py-1.5 text-white text-xl font-bold font-rajdhani outline-none flex-1"
                    />
                    <button
                      onClick={saveEditingCategory}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 p-2 rounded-lg transition-colors"
                      title="Save"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={cancelEditingCategory}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                      title="Cancel"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden relative border border-white/10 flex items-center justify-center bg-white/5 shrink-0">
                      {category.image ? (
                        <Image src={category.image} alt={category.name} fill sizes="40px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/50">
                          <Plus size={16} />
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl font-rajdhani font-bold text-white">{category.name}</h2>
                    <button
                      onClick={() => startEditingCategory(category.id, category.name)}
                      className="text-white/40 hover:text-saffron bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                      title="Rename Category"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleRegenerateCategoryImage(category.id, category.name, category.tagline)}
                      disabled={isCategoryGenerating === category.id}
                      className="text-white/40 hover:text-saffron bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors disabled:opacity-50"
                      title="Regenerate Category Photo"
                    >
                      <Sparkles size={15} className={isCategoryGenerating === category.id ? "animate-spin text-saffron" : ""} />
                    </button>
                  </div>
                )}

                {/* Category Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setTargetCatIdForGood(category.id);
                      setShowAddGoodModal(true);
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <Trash2 size={14} /> Delete Category
                  </button>
                </div>
              </div>

              {/* Products Grid */}
              {category.typesOfGoods.length === 0 ? (
                <p className="text-white/30 text-sm italic">No items in this category yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.typesOfGoods.map((good) => (
                    <div key={good.id} className="bg-surface border border-white/5 rounded-xl p-4 flex flex-col">
                      {editingGoodId === good.id ? (
                        /* Product Edit Form */
                        <div className="flex flex-col gap-3">
                          <label className="text-white/50 text-xs">Product Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="bg-navy border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                            placeholder="Name"
                          />
                          <label className="text-white/50 text-xs">Price</label>
                          <input
                            type="text"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                            className="bg-navy border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                            placeholder="Price"
                          />
                          <label className="text-white/50 text-xs">Description</label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="bg-navy border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none"
                            placeholder="Description"
                            rows={3}
                          />
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => saveEditingGood(category.id)}
                              className="bg-green-500/20 hover:bg-green-500/40 text-green-400 px-3 py-1.5 rounded-lg text-sm flex-1 flex items-center justify-center gap-1"
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              onClick={() => setEditingGoodId(null)}
                              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm flex-1 flex items-center justify-center gap-1"
                            >
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Product View */
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-white text-sm flex-1 pr-2">{good.name}</h3>
                            <button
                              onClick={() => toggleAvailability(category.id, good.id)}
                              className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 ${
                                good.isAvailable
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {good.isAvailable ? "Available" : "Out of Stock"}
                            </button>
                          </div>
                          <p className="text-saffron font-bold text-sm mb-2">{good.price}</p>
                          <p className="text-white/40 text-xs mb-4 flex-1 line-clamp-3">{good.description}</p>

                          <div className="flex gap-2 mt-auto pt-3 border-t border-white/5">
                            <button
                              onClick={() => startEditingGood(good)}
                              className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs flex-1 flex items-center justify-center gap-1 transition-colors"
                            >
                              <Edit2 size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteGood(category.id, good.id, good.name)}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs flex-1 flex items-center justify-center gap-1 transition-colors"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ── Brand Partners Section ─────────────────────────────── */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-rajdhani font-bold text-white flex items-center gap-2">
                    <Building2 size={16} className="text-saffron" /> Brand Partners
                    <span className="text-xs text-white/30 font-normal ml-1">({category.brands.length})</span>
                  </h3>
                  {addingBrandCatId !== category.id && (
                    <button
                      onClick={() => { setAddingBrandCatId(category.id); setNewBrand({ name: "", description: "", popularity: "" }); }}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs transition-colors"
                    >
                      <Plus size={13} /> Add Brand
                    </button>
                  )}
                </div>

                {/* Add Brand Form */}
                {addingBrandCatId === category.id && (
                  <div className="bg-surface border border-saffron/20 rounded-xl p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Brand Name *</label>
                      <input
                        type="text"
                        value={newBrand.name}
                        onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                        placeholder="e.g. UltraTech"
                        className="bg-navy border border-white/10 focus:border-saffron/50 rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors"
                        autoFocus
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Tagline / Description</label>
                      <input
                        type="text"
                        value={newBrand.description}
                        onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                        placeholder="e.g. The Engineer's Choice"
                        className="bg-navy border border-white/10 focus:border-saffron/50 rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Popularity Label</label>
                      <input
                        type="text"
                        value={newBrand.popularity}
                        onChange={(e) => setNewBrand({ ...newBrand, popularity: e.target.value })}
                        placeholder="e.g. Market Leader"
                        className="bg-navy border border-white/10 focus:border-saffron/50 rounded-lg px-3 py-2 text-white text-sm outline-none transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-3 flex gap-2 pt-1">
                      <button
                        onClick={() => handleAddBrand(category.id)}
                        disabled={!newBrand.name.trim()}
                        className="bg-saffron hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-navy font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors"
                      >
                        <Check size={14} /> Save Brand
                      </button>
                      <button
                        onClick={() => setAddingBrandCatId(null)}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 transition-colors"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Brand List */}
                {category.brands.length === 0 && addingBrandCatId !== category.id ? (
                  <p className="text-white/25 text-xs italic">No brand partners yet. Click "Add Brand" to add one.</p>
                ) : (
                  <div className="space-y-2">
                    {category.brands.map((brand) => (
                      <div key={brand.name} className="bg-surface border border-white/5 rounded-xl p-3">
                        {editingBrand?.catId === category.id && editingBrand.originalName === brand.name ? (
                          /* Brand Edit Form */
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Brand Name *</label>
                              <input
                                type="text"
                                value={editBrandForm.name}
                                onChange={(e) => setEditBrandForm({ ...editBrandForm, name: e.target.value })}
                                className="bg-navy border border-white/10 focus:border-saffron/50 rounded-lg px-3 py-2 text-white text-sm outline-none"
                                autoFocus
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Tagline</label>
                              <input
                                type="text"
                                value={editBrandForm.description}
                                onChange={(e) => setEditBrandForm({ ...editBrandForm, description: e.target.value })}
                                className="bg-navy border border-white/10 focus:border-saffron/50 rounded-lg px-3 py-2 text-white text-sm outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider">Popularity</label>
                              <input
                                type="text"
                                value={editBrandForm.popularity}
                                onChange={(e) => setEditBrandForm({ ...editBrandForm, popularity: e.target.value })}
                                className="bg-navy border border-white/10 focus:border-saffron/50 rounded-lg px-3 py-2 text-white text-sm outline-none"
                              />
                            </div>
                            <div className="sm:col-span-3 flex gap-2">
                              <button onClick={saveEditingBrand} className="bg-green-500/20 hover:bg-green-500/40 text-green-400 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors">
                                <Check size={12} /> Save
                              </button>
                              <button onClick={() => setEditingBrand(null)} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors">
                                <X size={12} /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Brand View */
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">{brand.name}</p>
                              <p className="text-white/40 text-xs truncate">{brand.description}</p>
                              {brand.popularity && (
                                <span className="inline-block mt-1 text-[10px] bg-saffron/15 text-saffron font-bold px-2 py-0.5 rounded-full">
                                  {brand.popularity}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => startEditingBrand(category.id, brand)}
                                className="bg-white/5 hover:bg-white/15 text-white/70 p-1.5 rounded-lg transition-colors"
                                title="Edit brand"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteBrand(category.id, brand.name)}
                                className="bg-red-500/10 hover:bg-red-500/25 text-red-400 p-1.5 rounded-lg transition-colors"
                                title="Remove brand"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showAddCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-2xl w-full max-w-md p-6 relative border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-rajdhani font-bold text-white mb-2">Create Category</h3>
              <p className="text-white/50 text-xs mb-6">Add a new commodity category to the inventory catalog.</p>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider block mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Pipes & Fitting"
                    className="w-full bg-navy border border-white/10 focus:border-saffron/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider block mb-1">Tagline / Description</label>
                  <input
                    type="text"
                    value={categoryForm.tagline}
                    onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })}
                    placeholder="e.g. High pressure plumbing solutions."
                    className="w-full bg-navy border border-white/10 focus:border-saffron/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider block mb-2">Color Palette</label>
                  <div className="flex flex-wrap gap-2">
                    {ColorThemes.map((theme) => (
                      <button
                        key={theme.value}
                        type="button"
                        onClick={() => setCategoryForm({ ...categoryForm, colorTheme: theme.value })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          categoryForm.colorTheme === theme.value
                            ? 'bg-saffron/20 border-saffron text-saffron'
                            : 'bg-white/5 border-white/5 text-white/60 hover:border-white/10 hover:text-white'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={isCategorySaving}
                    className="flex-1 bg-saffron hover:bg-gold disabled:opacity-50 text-navy font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isCategorySaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-navy/20 border-t-navy rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Save Category'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCategoryModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddGoodModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-card rounded-2xl w-full max-w-md p-6 relative border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAddGoodModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-rajdhani font-bold text-white mb-2">Add Product Item</h3>
              <p className="text-white/50 text-xs mb-6">List a new material type under the selected category.</p>

              <form onSubmit={handleSaveGood} className="space-y-4">
                <div>
                  <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider block mb-1">Target Category</label>
                  <select
                    value={targetCatIdForGood || ""}
                    onChange={(e) => setTargetCatIdForGood(e.target.value)}
                    className="w-full bg-navy border border-white/10 focus:border-saffron/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={goodForm.name}
                    onChange={(e) => setGoodForm({ ...goodForm, name: e.target.value })}
                    placeholder="e.g. Astral CPVC Pipe 1 inch"
                    className="w-full bg-navy border border-white/10 focus:border-saffron/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider block mb-1">Wholesale Price *</label>
                  <input
                    type="text"
                    required
                    value={goodForm.price}
                    onChange={(e) => setGoodForm({ ...goodForm, price: e.target.value })}
                    placeholder="e.g. ₹180 / 10ft"
                    className="w-full bg-navy border border-white/10 focus:border-saffron/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                  />
                </div>

                <div>
                  <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider block mb-1">Product Description</label>
                  <textarea
                    value={goodForm.description}
                    onChange={(e) => setGoodForm({ ...goodForm, description: e.target.value })}
                    placeholder="Describe material dimensions, quality grade, usage details..."
                    rows={3}
                    className="w-full bg-navy border border-white/10 focus:border-saffron/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider block mb-1">Custom Image URL (Optional)</label>
                  <input
                    type="url"
                    value={goodForm.image}
                    onChange={(e) => setGoodForm({ ...goodForm, image: e.target.value })}
                    placeholder="Leave empty to auto-generate via Pexels"
                    className="w-full bg-navy border border-white/10 focus:border-saffron/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none mb-2"
                  />
                  
                  {!goodForm.image && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="checkbox"
                        id="autoGenerateCheckbox"
                        checked={goodForm.autoGenerateImage}
                        onChange={(e) => setGoodForm({ ...goodForm, autoGenerateImage: e.target.checked })}
                        className="rounded accent-saffron bg-surface border-white/10 cursor-pointer"
                      />
                      <label htmlFor="autoGenerateCheckbox" className="text-white/60 text-xs select-none cursor-pointer flex items-center gap-1">
                        <Sparkles size={12} className="text-saffron animate-pulse" /> Auto-generate photo using Pexels AI
                      </label>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    type="submit"
                    disabled={isProductSaving}
                    className="flex-1 bg-saffron hover:bg-gold disabled:opacity-50 text-navy font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isProductSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-navy/20 border-t-navy rounded-full animate-spin" />
                        Saving & Generating...
                      </>
                    ) : (
                      'Save Product'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddGoodModal(false)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

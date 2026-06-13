"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInventory } from "@/context/InventoryContext";
import { Plus, Trash2, Edit2, Check, X, ShieldAlert, Pencil, Building2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";

export default function OwnerDashboard() {
  const {
    categories,
    isOwner,
    addCategory,
    removeCategory,
    updateCategoryName,
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

  const handleAddNewCategory = () => {
    const name = prompt("Enter new category name:");
    if (!name || name.trim() === "") return;
    addCategory({
      name: name.trim(),
      iconName: "Layers",
      color: "from-slate-500/20 to-slate-700/10",
      bgGradient: "from-slate-600 to-slate-800",
      tagline: "New Category",
      typesOfGoods: [],
      brands: [],
    });
  };

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
    if (confirm(`Are you sure you want to delete the category "${categoryName}" and all its products?`)) {
      removeCategory(categoryId);
    }
  };

  // ─── Product Handlers ────────────────────────────────────────────────────

  const handleAddNewGood = (categoryId: string) => {
    const name = prompt("Enter product name:");
    if (!name || name.trim() === "") return;
    const price = prompt("Enter price (e.g. ₹500 / bag):") || "₹0";
    const description = prompt("Enter product description:") || "No description provided.";
    addGood(categoryId, {
      name: name.trim(),
      price: price.trim(),
      description: description.trim(),
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop",
      isAvailable: true,
    });
  };

  const startEditingGood = (good: any) => {
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
            onClick={handleAddNewCategory}
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
                    <h2 className="text-2xl font-rajdhani font-bold text-white">{category.name}</h2>
                    <button
                      onClick={() => startEditingCategory(category.id, category.name)}
                      className="text-white/40 hover:text-saffron bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors"
                      title="Rename Category"
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                )}

                {/* Category Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAddNewGood(category.id)}
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
    </div>
  );
}

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Layers, Building, LayoutGrid, Droplets, Zap, Paintbrush, Lock, TreePine } from "lucide-react";
import {
  subscribeToCategoriesRealtime,
  saveCategory,
  deleteCategory as firestoreDeleteCategory,
  addGoodToCategory,
  updateGoodInCategory,
  removeGoodFromCategory,
  addBrandToCategory,
  updateBrandInCategory,
  removeBrandFromCategory,
  seedInitialDataIfEmpty,
  updateCategoryNameInFirestore,
  updateCategoryInFirestore,
  type FirestoreCategory,
  type FirestoreGood,
  type FirestoreBrand,
} from "@/lib/firestore";

export interface Brand {
  name: string;
  description: string;
  popularity: string;
}

export interface GoodType {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  isAvailable: boolean;
  quantity?: number;
}

export interface CartItem {
  goodId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export interface CategoryData {
  id: string;
  name: string;
  iconName: string; // Storing string name to reconstruct icon
  color: string;
  bgGradient: string;
  tagline: string;
  image?: string;
  typesOfGoods: GoodType[];
  brands: Brand[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialCategories: CategoryData[] = [
  {
    id: "cat-1",
    name: "Cement",
    iconName: "Layers",
    color: "from-stone-500/20 to-stone-700/10",
    bgGradient: "from-stone-600 to-stone-800",
    tagline: "High-grade structural concrete & cement for rock-solid foundations.",
    typesOfGoods: [
      { id: "good-1", name: "OPC 53 Grade Cement", price: "₹390 / 50kg bag", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop", description: "Ordinary Portland Cement ideal for high-strength load-bearing RCC structures, columns, and slabs.", isAvailable: true },
      { id: "good-2", name: "PPC Cement", price: "₹370 / 50kg bag", image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?q=80&w=800&auto=format&fit=crop", description: "Portland Pozzolana Cement offering superior resistance to chemical attacks, perfect for plastering and masonry.", isAvailable: true },
      { id: "good-3", name: "White Portland Cement", price: "₹850 / 50kg bag", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop", description: "Premium white cement used for decorative plastering, tile grouting, and architectural designs.", isAvailable: true },
    ],
    brands: [
      { name: "UltraTech", description: "The Engineer's Choice", popularity: "Highly Popular" },
      { name: "ACC Gold", description: "Water repellent premium durability", popularity: "Premium" },
    ]
  },
  {
    id: "cat-2",
    name: "TMT Steel",
    iconName: "Building",
    color: "from-slate-500/20 to-slate-700/10",
    bgGradient: "from-slate-600 to-slate-800",
    tagline: "Corrosion-resistant thermo-mechanically treated steel bars.",
    typesOfGoods: [
      { id: "good-4", name: "Fe 550D TMT Bars", price: "₹68 / kg", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop", description: "Super ductile rebars with high tensile strength for multi-story buildings and seismic zones.", isAvailable: true },
      { id: "good-5", name: "Galvanized Binding Wire", price: "₹95 / kg", image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?q=80&w=800&auto=format&fit=crop", description: "Highly flexible annealed wires designed to firmly secure reinforcement bar networks.", isAvailable: true },
    ],
    brands: [
      { name: "Tata Tiscon 550SD", description: "Super ductile, earthquake-resistant", popularity: "Market Leader" },
      { name: "JSW Neosteel", description: "Pure steel quality with clean ribbed bonding", popularity: "Top Quality" }
    ]
  },
  {
    id: "cat-3",
    name: "Tiles & Flooring",
    iconName: "LayoutGrid",
    color: "from-orange-500/20 to-red-600/10",
    bgGradient: "from-orange-500 to-red-600",
    tagline: "Elegant floor tiles, vitrified slabs, and marble layouts.",
    typesOfGoods: [
      { id: "good-6", name: "Double Charge Vitrified Tiles", price: "₹45 / sq.ft", image: "https://images.unsplash.com/photo-1523413651479-59cb1f1f6f9e?q=80&w=800&auto=format&fit=crop", description: "Extremely durable tiles with a double layer of pigment for heavy foot traffic areas.", isAvailable: true },
      { id: "good-7", name: "Ceramic Wall Tiles", price: "₹35 / sq.ft", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop", description: "Stylish, moisture-proof glazed ceramic tiles for kitchen and bathroom walls.", isAvailable: true },
      { id: "good-8", name: "Natural Italian Marble", price: "₹280 / sq.ft", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop", description: "Ultra-luxury natural polished marble slabs with beautiful unique veins.", isAvailable: false }
    ],
    brands: [
      { name: "Kajaria Tiles", description: "India's No. 1 tile manufacturer", popularity: "Best Seller" },
      { name: "Somany Ceramics", description: "Slip shield & high abrasion resistance", popularity: "Highly Durable" }
    ]
  },
  {
    id: "cat-4",
    name: "Plumbing & Pipes",
    iconName: "Droplets",
    color: "from-blue-500/20 to-sky-600/10",
    bgGradient: "from-blue-500 to-sky-600",
    tagline: "Heavy-duty piping systems, leak-proof joints, and fixtures.",
    typesOfGoods: [
      { id: "good-9", name: "CPVC Hot & Cold Water Pipes", price: "₹180 / 10ft", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop", description: "CPVC pipes that safely sustain high temperature drinking water supply.", isAvailable: true },
      { id: "good-10", name: "UPVC Plumbing Pipes", price: "₹120 / 10ft", image: "https://images.unsplash.com/photo-1621905252472-7484d0d04da8?q=80&w=800&auto=format&fit=crop", description: "Lead-free, non-toxic plumbing pipes for cold water distribution.", isAvailable: true }
    ],
    brands: [
      { name: "Astral Pipes", description: "Lead-free heavy pressure piping", popularity: "Market Leader" },
      { name: "Ashirvad Pipes", description: "FlowGuard technology", popularity: "Most Trusted" }
    ]
  },
  {
    id: "cat-5",
    name: "Electricals",
    iconName: "Zap",
    color: "from-yellow-500/20 to-amber-600/10",
    bgGradient: "from-yellow-500 to-amber-600",
    tagline: "Safe shock-proof wiring, switches, and lighting solutions.",
    typesOfGoods: [
      { id: "good-11", name: "Flame Retardant Copper Wires", price: "₹1,450 / 90m", image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=800&auto=format&fit=crop", description: "100% electrolytic copper conductor wire with flame retardant PVC casing.", isAvailable: true },
      { id: "good-12", name: "Modular Switches", price: "₹45 / unit", image: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=800&auto=format&fit=crop", description: "Elegant click-tested modular switches combining fire safety with luxury.", isAvailable: true }
    ],
    brands: [
      { name: "Polycab Wires", description: "Safe & energy-efficient copper", popularity: "Top Selling" },
      { name: "Havells India", description: "Elegant modular switchboards", popularity: "Premium Quality" }
    ]
  },
  {
    id: "cat-6",
    name: "Paints & Finishes",
    iconName: "Paintbrush",
    color: "from-rose-500/20 to-pink-600/10",
    bgGradient: "from-rose-500 to-pink-600",
    tagline: "Weatherproof exterior coats and luxury emulsions.",
    typesOfGoods: [
      { id: "good-13", name: "Luxury Acrylic Emulsion", price: "₹380 / L", image: "https://images.unsplash.com/photo-1562184552-094191060934?q=80&w=800&auto=format&fit=crop", description: "Washable high-sheen luxury interior wall paint that resists stains.", isAvailable: true },
      { id: "good-14", name: "Weatherproof Exterior Paint", price: "₹320 / L", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop", description: "Anti-algal, crack-resistant exterior coating for heavy monsoon protection.", isAvailable: true },
      { id: "good-15", name: "Wood Primer", price: "₹150 / L", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop", description: "High quality wood primer for pre-painting applications on wooden surfaces.", isAvailable: true }
    ],
    brands: [
      { name: "Asian Paints", description: "Royale luxury finish", popularity: "Market Leader" },
      { name: "Berger Paints", description: "Easy Clean luxury formula", popularity: "Popular Choice" }
    ]
  },
  {
    id: "cat-7",
    name: "Hardware",
    iconName: "Lock",
    color: "from-zinc-500/20 to-zinc-700/10",
    bgGradient: "from-zinc-600 to-zinc-800",
    tagline: "Premium locks, hinges, channels, and fasteners.",
    typesOfGoods: [
      { id: "good-16", name: "Mortise Door Lock", price: "₹1,850 / set", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop", description: "Ultra-secure solid brass door handle with high-grade lock body.", isAvailable: true },
      { id: "good-17", name: "SS Hinges (4 inch)", price: "₹140 / pair", image: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=800&auto=format&fit=crop", description: "Heavy duty SS 304 grade corrosion-resistant hinges for main doors.", isAvailable: true }
    ],
    brands: [
      { name: "Godrej Locks", description: "Unpickable key technology", popularity: "Most Secure" },
      { name: "Ebco Hardware", description: "Ergonomic cabinet fittings", popularity: "Industry Standard" }
    ]
  },
  {
    id: "cat-8",
    name: "Wood & Plywood",
    iconName: "TreePine",
    color: "from-amber-600/20 to-amber-800/10",
    bgGradient: "from-amber-600 to-amber-800",
    tagline: "Marine plywood, decorative veneers, and blockboards.",
    typesOfGoods: [
      { id: "good-18", name: "BWP Marine Plywood (19mm)", price: "₹95 / sq.ft", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop", description: "Boiling Water Proof marine plywood for kitchen cabinets and bathrooms.", isAvailable: true },
      { id: "good-19", name: "Decorative Teak Veneer", price: "₹180 / sq.ft", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop", description: "Premium natural teak wood decorative overlay for elegant doors.", isAvailable: true }
    ],
    brands: [
      { name: "CenturyPly", description: "ViroKill technology", popularity: "Market Leader" },
      { name: "Greenply", description: "Zero emission plywood", popularity: "Top Quality" }
    ]
  }
];

interface InventoryContextType {
  categories: CategoryData[];
  isOwner: boolean;
  cart: CartItem[];
  cartCount: number;
  isLoading: boolean;
  isSyncing: boolean;
  loginOwner: (password: string) => boolean;
  logoutOwner: () => void;
  addCategory: (category: Omit<CategoryData, "id">) => void;
  removeCategory: (id: string) => void;
  updateCategoryName: (id: string, newName: string) => void;
  updateCategory: (id: string, updates: Partial<CategoryData>) => void;
  addGood: (categoryId: string, good: Omit<GoodType, "id">) => void;
  updateGood: (categoryId: string, goodId: string, updates: Partial<GoodType>) => void;
  removeGood: (categoryId: string, goodId: string) => void;
  toggleAvailability: (categoryId: string, goodId: string) => void;
  addBrand: (categoryId: string, brand: Brand) => void;
  updateBrand: (categoryId: string, originalName: string, updated: Brand) => void;
  removeBrand: (categoryId: string, brandName: string) => void;
  addToCart: (categoryId: string, categoryName: string, good: GoodType, quantity?: number) => void;
  removeFromCart: (goodId: string) => void;
  updateCartQuantity: (goodId: string, quantity: number) => void;
  clearCart: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // ─── Firestore Real-Time Sync ─────────────────────────────────────────────
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initFirestore = async () => {
      try {
        // Seed Firestore with initial data if it's empty
        await seedInitialDataIfEmpty(initialCategories as FirestoreCategory[]);

        // Subscribe to real-time updates from Firestore
        unsubscribe = subscribeToCategoriesRealtime(
          (firestoreCategories) => {
            setCategories(firestoreCategories as CategoryData[]);
            setIsLoading(false);
          },
          (error) => {
            console.error("Firestore sync error, falling back to local data:", error);
            // Fallback: load from localStorage if Firestore fails
            const savedCategories = localStorage.getItem("kushal-categories-v2");
            if (savedCategories) {
              setCategories(JSON.parse(savedCategories));
            } else {
              setCategories(initialCategories);
            }
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error("Failed to initialize Firestore:", error);
        // Fallback to localStorage
        const savedCategories = localStorage.getItem("kushal-categories-v2");
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        } else {
          setCategories(initialCategories);
        }
        setIsLoading(false);
      }
    };

    initFirestore();

    // Load owner state and cart from localStorage (these stay local)
    const savedOwnerState = localStorage.getItem("kushal-is-owner-v2");
    if (savedOwnerState === "true") {
      setIsOwner(true);
    }

    const savedCart = localStorage.getItem("kushal-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Keep localStorage in sync as a backup cache
  useEffect(() => {
    if (!isLoading && categories.length > 0) {
      localStorage.setItem("kushal-categories-v2", JSON.stringify(categories));
    }
  }, [categories, isLoading]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kushal-cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // ─── Auth ─────────────────────────────────────────────────────────────────

  const loginOwner = (password: string) => {
    if (password === "Prastut@08") {
      setIsOwner(true);
      localStorage.setItem("kushal-is-owner-v2", "true");
      return true;
    }
    return false;
  };

  const logoutOwner = () => {
    setIsOwner(false);
    localStorage.removeItem("kushal-is-owner-v2");
  };

  // ─── Category CRUD (writes to Firestore) ──────────────────────────────────

  const addCategory = useCallback(async (category: Omit<CategoryData, "id">) => {
    const newId = generateId();
    const newCategory: CategoryData = { ...category, id: newId };
    
    // Optimistic update
    setCategories(prev => [...prev, newCategory]);
    
    try {
      setIsSyncing(true);
      await saveCategory({
        ...newCategory,
        typesOfGoods: newCategory.typesOfGoods as FirestoreGood[],
        createdAt: Date.now(),
      });
    } catch (error: any) {
      console.error("Failed to save category to Firestore:", error);
      alert("Failed to save category: " + (error?.message || error));
      // The real-time listener will correct state if needed
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    // Optimistic update
    setCategories(prev => prev.filter(c => c.id !== id));
    
    try {
      setIsSyncing(true);
      await firestoreDeleteCategory(id);
    } catch (error: any) {
      console.error("Failed to delete category from Firestore:", error);
      alert("Failed to delete category: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const updateCategoryName = useCallback(async (id: string, newName: string) => {
    // Optimistic update
    setCategories(prev => prev.map(c =>
      c.id === id ? { ...c, name: newName } : c
    ));
    try {
      setIsSyncing(true);
      await updateCategoryNameInFirestore(id, newName);
    } catch (error: any) {
      console.error("Failed to update category name in Firestore:", error);
      alert("Failed to rename category: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<CategoryData>) => {
    // Optimistic update
    setCategories(prev => prev.map(c =>
      c.id === id ? { ...c, ...updates } : c
    ));
    try {
      setIsSyncing(true);
      await updateCategoryInFirestore(id, updates as Partial<FirestoreCategory>);
    } catch (error: any) {
      console.error("Failed to update category in Firestore:", error);
      alert("Failed to update category: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // ─── Goods/Products CRUD (writes to Firestore) ───────────────────────────

  const addGood = useCallback(async (categoryId: string, good: Omit<GoodType, "id">) => {
    const newGood: GoodType = { ...good, id: generateId() };
    
    // Optimistic update
    setCategories(prev => prev.map(c =>
      c.id === categoryId
        ? { ...c, typesOfGoods: [...c.typesOfGoods, newGood] }
        : c
    ));

    try {
      setIsSyncing(true);
      await addGoodToCategory(categoryId, newGood as FirestoreGood);
    } catch (error: any) {
      console.error("Failed to add good to Firestore:", error);
      alert("Failed to add product: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const updateGood = useCallback(async (categoryId: string, goodId: string, updates: Partial<GoodType>) => {
    // Optimistic update
    setCategories(prev => prev.map(c =>
      c.id === categoryId
        ? { ...c, typesOfGoods: c.typesOfGoods.map(g => g.id === goodId ? { ...g, ...updates } : g) }
        : c
    ));

    try {
      setIsSyncing(true);
      await updateGoodInCategory(categoryId, goodId, updates as Partial<FirestoreGood>);
    } catch (error: any) {
      console.error("Failed to update good in Firestore:", error);
      alert("Failed to update product: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const removeGood = useCallback(async (categoryId: string, goodId: string) => {
    // Optimistic update
    setCategories(prev => prev.map(c =>
      c.id === categoryId
        ? { ...c, typesOfGoods: c.typesOfGoods.filter(g => g.id !== goodId) }
        : c
    ));

    try {
      setIsSyncing(true);
      await removeGoodFromCategory(categoryId, goodId);
    } catch (error: any) {
      console.error("Failed to remove good from Firestore:", error);
      alert("Failed to remove product: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const toggleAvailability = useCallback(async (categoryId: string, goodId: string) => {
    // Find current state
    const category = categories.find(c => c.id === categoryId);
    const good = category?.typesOfGoods.find(g => g.id === goodId);
    if (!good) return;

    const newAvailability = !good.isAvailable;

    // Optimistic update
    setCategories(prev => prev.map(c =>
      c.id === categoryId
        ? { ...c, typesOfGoods: c.typesOfGoods.map(g => g.id === goodId ? { ...g, isAvailable: newAvailability } : g) }
        : c
    ));

    try {
      setIsSyncing(true);
      await updateGoodInCategory(categoryId, goodId, { isAvailable: newAvailability });
    } catch (error: any) {
      console.error("Failed to toggle availability in Firestore:", error);
      alert("Failed to toggle availability: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, [categories]);

  // ─── Brand CRUD (writes to Firestore) ────────────────────────────────────

  const addBrand = useCallback(async (categoryId: string, brand: Brand) => {
    setCategories(prev => prev.map(c =>
      c.id === categoryId ? { ...c, brands: [...c.brands, brand] } : c
    ));
    try {
      setIsSyncing(true);
      await addBrandToCategory(categoryId, brand as FirestoreBrand);
    } catch (error: any) {
      console.error("Failed to add brand:", error);
      alert("Failed to add brand: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const updateBrand = useCallback(async (categoryId: string, originalName: string, updated: Brand) => {
    setCategories(prev => prev.map(c =>
      c.id === categoryId
        ? { ...c, brands: c.brands.map(b => b.name === originalName ? updated : b) }
        : c
    ));
    try {
      setIsSyncing(true);
      await updateBrandInCategory(categoryId, originalName, updated as FirestoreBrand);
    } catch (error: any) {
      console.error("Failed to update brand:", error);
      alert("Failed to update brand: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const removeBrand = useCallback(async (categoryId: string, brandName: string) => {
    setCategories(prev => prev.map(c =>
      c.id === categoryId ? { ...c, brands: c.brands.filter(b => b.name !== brandName) } : c
    ));
    try {
      setIsSyncing(true);
      await removeBrandFromCategory(categoryId, brandName);
    } catch (error: any) {
      console.error("Failed to remove brand:", error);
      alert("Failed to remove brand: " + (error?.message || error));
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // ─── Cart (stays in localStorage, per-user/session) ──────────────────────

  const addToCart = (categoryId: string, categoryName: string, good: GoodType, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.goodId === good.id);
      if (existing) {
        return prev.map(item =>
          item.goodId === good.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        goodId: good.id,
        categoryId,
        categoryName,
        name: good.name,
        price: good.price,
        image: good.image,
        quantity
      }];
    });
  };

  const removeFromCart = (goodId: string) => {
    setCart(prev => prev.filter(item => item.goodId !== goodId));
  };

  const updateCartQuantity = (goodId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(goodId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.goodId === goodId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <InventoryContext.Provider value={{
      categories, isOwner, cart, cartCount, isLoading, isSyncing, loginOwner, logoutOwner,
      addCategory, removeCategory, updateCategoryName, updateCategory, addGood, updateGood, removeGood, toggleAvailability,
      addBrand, updateBrand, removeBrand,
      addToCart, removeFromCart, updateCartQuantity, clearCart
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

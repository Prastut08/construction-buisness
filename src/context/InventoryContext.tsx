"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Layers, Building, LayoutGrid, Droplets, Zap, Paintbrush, Lock, TreePine } from "lucide-react";

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
}

export interface CategoryData {
  id: string;
  name: string;
  iconName: string; // Storing string name to reconstruct icon
  color: string;
  bgGradient: string;
  tagline: string;
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
    ],
    brands: [
      { name: "UltraTech Cement", description: "The Engineer's Choice", popularity: "Highly Popular" },
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
      { id: "good-3", name: "Fe 550D TMT Bars", price: "₹68 / kg", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=800&auto=format&fit=crop", description: "Super ductile rebars with high tensile strength for multi-story buildings and seismic zones.", isAvailable: true },
    ],
    brands: [
      { name: "Tata Tiscon 550SD", description: "Super ductile, earthquake-resistant", popularity: "Market Leader" },
    ]
  }
];

interface InventoryContextType {
  categories: CategoryData[];
  isOwner: boolean;
  loginOwner: (password: string) => boolean;
  logoutOwner: () => void;
  addCategory: (category: Omit<CategoryData, "id">) => void;
  removeCategory: (id: string) => void;
  addGood: (categoryId: string, good: Omit<GoodType, "id">) => void;
  updateGood: (categoryId: string, goodId: string, updates: Partial<GoodType>) => void;
  removeGood: (categoryId: string, goodId: string) => void;
  toggleAvailability: (categoryId: string, goodId: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCategories = localStorage.getItem("kushal-categories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(initialCategories);
      localStorage.setItem("kushal-categories", JSON.stringify(initialCategories));
    }
    
    const savedOwnerState = localStorage.getItem("kushal-is-owner");
    if (savedOwnerState === "true") {
      setIsOwner(true);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("kushal-categories", JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const loginOwner = (password: string) => {
    if (password === "Prastut@08") {
      setIsOwner(true);
      localStorage.setItem("kushal-is-owner", "true");
      return true;
    }
    return false;
  };

  const logoutOwner = () => {
    setIsOwner(false);
    localStorage.removeItem("kushal-is-owner");
  };

  const addCategory = (category: Omit<CategoryData, "id">) => {
    setCategories([...categories, { ...category, id: generateId() }]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addGood = (categoryId: string, good: Omit<GoodType, "id">) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, typesOfGoods: [...c.typesOfGoods, { ...good, id: generateId() }] }
        : c
    ));
  };

  const updateGood = (categoryId: string, goodId: string, updates: Partial<GoodType>) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, typesOfGoods: c.typesOfGoods.map(g => g.id === goodId ? { ...g, ...updates } : g) }
        : c
    ));
  };

  const removeGood = (categoryId: string, goodId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, typesOfGoods: c.typesOfGoods.filter(g => g.id !== goodId) }
        : c
    ));
  };

  const toggleAvailability = (categoryId: string, goodId: string) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, typesOfGoods: c.typesOfGoods.map(g => g.id === goodId ? { ...g, isAvailable: !g.isAvailable } : g) }
        : c
    ));
  };

  return (
    <InventoryContext.Provider value={{
      categories, isOwner, loginOwner, logoutOwner,
      addCategory, removeCategory, addGood, updateGood, removeGood, toggleAvailability
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

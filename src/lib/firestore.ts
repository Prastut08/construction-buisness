import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FirestoreBrand {
  name: string;
  description: string;
  popularity: string;
}

export interface FirestoreGood {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  isAvailable: boolean;
  quantity?: number;
  createdAt?: number;
}

export interface FirestoreCategory {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgGradient: string;
  tagline: string;
  typesOfGoods: FirestoreGood[];
  brands: FirestoreBrand[];
  createdAt?: number;
}

// ─── Collection References ──────────────────────────────────────────────────

const CATEGORIES_COLLECTION = "categories";

// ─── Real-time Listener ─────────────────────────────────────────────────────

/**
 * Subscribe to real-time updates on the categories collection.
 * Returns an unsubscribe function.
 */
export function subscribeToCategoriesRealtime(
  callback: (categories: FirestoreCategory[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);

  return onSnapshot(
    categoriesRef,
    (snapshot) => {
      const categories: FirestoreCategory[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || "",
          iconName: data.iconName || "Layers",
          color: data.color || "",
          bgGradient: data.bgGradient || "",
          tagline: data.tagline || "",
          typesOfGoods: (data.typesOfGoods || []).map((g: Record<string, unknown>) => ({
            id: g.id as string || "",
            name: g.name as string || "",
            price: g.price as string || "",
            image: g.image as string || "",
            description: g.description as string || "",
            isAvailable: g.isAvailable !== undefined ? g.isAvailable as boolean : true,
            quantity: g.quantity as number || 0,
          })),
          brands: (data.brands || []).map((b: Record<string, unknown>) => ({
            name: b.name as string || "",
            description: b.description as string || "",
            popularity: b.popularity as string || "",
          })),
          createdAt: data.createdAt || 0,
        };
      });

      // Sort by createdAt, oldest first
      categories.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      callback(categories);
    },
    (error) => {
      console.error("Firestore real-time listener error:", error);
      onError?.(error);
    }
  );
}

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Fetch all categories from Firestore (one-time read).
 */
export async function fetchAllCategories(): Promise<FirestoreCategory[]> {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const snapshot = await getDocs(categoriesRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      iconName: data.iconName,
      color: data.color,
      bgGradient: data.bgGradient,
      tagline: data.tagline,
      typesOfGoods: data.typesOfGoods || [],
      brands: data.brands || [],
      createdAt: data.createdAt || 0,
    };
  });
}

// ─── Write: Categories ──────────────────────────────────────────────────────

/**
 * Add or update a full category document in Firestore.
 */
export async function saveCategory(category: FirestoreCategory): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
  await setDoc(docRef, {
    name: category.name,
    iconName: category.iconName,
    color: category.color,
    bgGradient: category.bgGradient,
    tagline: category.tagline,
    typesOfGoods: category.typesOfGoods.map((g) => ({
      id: g.id,
      name: g.name,
      price: g.price,
      image: g.image,
      description: g.description,
      isAvailable: g.isAvailable,
      quantity: g.quantity || 0,
    })),
    brands: category.brands.map((b) => ({
      name: b.name,
      description: b.description,
      popularity: b.popularity,
    })),
    createdAt: category.createdAt || Date.now(),
  });
}

/**
 * Delete a category from Firestore.
 */
export async function deleteCategory(categoryId: string): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await deleteDoc(docRef);
}

// ─── Write: Products (Goods) inside Categories ─────────────────────────────

/**
 * Add a new product/good to a category's typesOfGoods array.
 */
export async function addGoodToCategory(
  categoryId: string,
  good: FirestoreGood
): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error(`Category ${categoryId} not found`);

  const existing: FirestoreGood[] = docSnap.data().typesOfGoods || [];
  await updateDoc(docRef, {
    typesOfGoods: [
      ...existing,
      {
        id: good.id,
        name: good.name,
        price: good.price,
        image: good.image,
        description: good.description,
        isAvailable: good.isAvailable,
        quantity: good.quantity || 0,
      },
    ],
  });
}

/**
 * Update a specific product/good within a category.
 */
export async function updateGoodInCategory(
  categoryId: string,
  goodId: string,
  updates: Partial<FirestoreGood>
): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error(`Category ${categoryId} not found`);

  const existing: FirestoreGood[] = docSnap.data().typesOfGoods || [];
  const updatedGoods = existing.map((g) =>
    g.id === goodId ? { ...g, ...updates } : g
  );

  await updateDoc(docRef, { typesOfGoods: updatedGoods });
}

/**
 * Remove a product/good from a category.
 */
export async function removeGoodFromCategory(
  categoryId: string,
  goodId: string
): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error(`Category ${categoryId} not found`);

  const existing: FirestoreGood[] = docSnap.data().typesOfGoods || [];
  const filtered = existing.filter((g) => g.id !== goodId);

  await updateDoc(docRef, { typesOfGoods: filtered });
}

// ─── Write: Brands inside Categories ────────────────────────────────────────

/**
 * Add a brand to a category.
 */
export async function addBrandToCategory(
  categoryId: string,
  brand: FirestoreBrand
): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error(`Category ${categoryId} not found`);

  const existing: FirestoreBrand[] = docSnap.data().brands || [];
  await updateDoc(docRef, {
    brands: [...existing, brand],
  });
}

/**
 * Remove a brand from a category by name.
 */
export async function removeBrandFromCategory(
  categoryId: string,
  brandName: string
): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error(`Category ${categoryId} not found`);

  const existing: FirestoreBrand[] = docSnap.data().brands || [];
  const filtered = existing.filter((b) => b.name !== brandName);

  await updateDoc(docRef, { brands: filtered });
}

// ─── Seed: Initial Data ─────────────────────────────────────────────────────

/**
 * Seed Firestore with initial category data if the collection is empty.
 * Returns true if seeding was performed.
 */
export async function seedInitialDataIfEmpty(
  initialCategories: FirestoreCategory[]
): Promise<boolean> {
  const categoriesRef = collection(db, CATEGORIES_COLLECTION);
  const snapshot = await getDocs(categoriesRef);

  if (snapshot.empty) {
    const batch = writeBatch(db);
    initialCategories.forEach((category, index) => {
      const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
      batch.set(docRef, {
        name: category.name,
        iconName: category.iconName,
        color: category.color,
        bgGradient: category.bgGradient,
        tagline: category.tagline,
        typesOfGoods: category.typesOfGoods.map((g) => ({
          id: g.id,
          name: g.name,
          price: g.price,
          image: g.image,
          description: g.description,
          isAvailable: g.isAvailable,
          quantity: g.quantity || 0,
        })),
        brands: category.brands.map((b) => ({
          name: b.name,
          description: b.description,
          popularity: b.popularity,
        })),
        createdAt: Date.now() + index, // Preserve ordering
      });
    });
    await batch.commit();
    return true;
  }

  return false;
}

// ─── Update a category's name ─────────────────────────────────────────────

export async function updateCategoryNameInFirestore(
  categoryId: string,
  newName: string
): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, categoryId);
  await updateDoc(docRef, { name: newName });
}

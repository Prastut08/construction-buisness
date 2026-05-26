"use client";

import { InventoryProvider } from "@/context/InventoryContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider>
      {children}
    </InventoryProvider>
  );
}

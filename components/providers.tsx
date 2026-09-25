"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AppStoreProvider } from "@/lib/store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppStoreProvider>{children}</AppStoreProvider>
    </ThemeProvider>
  );
}
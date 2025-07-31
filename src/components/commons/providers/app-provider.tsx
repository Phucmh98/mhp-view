"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster />
      </NextThemesProvider>
    </ConvexProvider>
  );
}

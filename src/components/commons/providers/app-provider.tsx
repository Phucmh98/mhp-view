"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  QueryClient,
  QueryClientProvider,
  
} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const queryClient = new QueryClient();

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />

        </QueryClientProvider>
      </NextThemesProvider>
    </ConvexProvider>
  );
}

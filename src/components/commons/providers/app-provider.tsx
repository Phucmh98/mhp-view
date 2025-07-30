import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </NextThemesProvider>
  );
}

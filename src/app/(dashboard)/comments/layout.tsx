import { ResizeSidebar } from "./components/resize-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <ResizeSidebar>{children}</ResizeSidebar>
  );
}

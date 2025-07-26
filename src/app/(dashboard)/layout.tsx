import NavBar from "./components/nav-bar";
import SideBar from "./components/side-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-full">
      <NavBar />
    <div className="flex h-[calc(100vh-40px)]">
      <SideBar />
      {children}
    </div>
    </section>
  );
}

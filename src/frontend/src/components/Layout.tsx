import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SideMenu from "@/components/SideMenu";
import { Outlet } from "@tanstack/react-router";
import { useState } from "react";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onOpenChange={setMenuOpen} />
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}

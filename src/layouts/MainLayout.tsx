import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/CursorGlow";
import { GridBackground } from "@/components/GridBackground";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <CursorGlow />
      <GridBackground />
      <Header />
      <main className="relative z-10 flex-1 min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}


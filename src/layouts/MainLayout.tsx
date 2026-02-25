import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/CursorGlow";
import { GridBackground } from "@/components/GridBackground";
import { BackgroundParticles } from "@/components/BackgroundParticles";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <CursorGlow />
      <GridBackground />
      <BackgroundParticles color="#09332C" speed={0.8} />
      <Header />
      <main className="relative z-10 flex-1 min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}

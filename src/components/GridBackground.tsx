import { motion } from "framer-motion";

export function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* VMDevs-inspired dramatic glow — large blue/purple radial from top */}
      <motion.div
        className="absolute -top-[30%] left-[10%] h-[120vh] w-[80vw] rounded-full blur-[160px]"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--glow-accent) / 0.35) 0%, hsl(var(--glow-primary) / 0.15) 40%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary glow — bottom right, warm accent */}
      <motion.div
        className="absolute -bottom-[20%] -right-[10%] h-[80vh] w-[60vw] rounded-full blur-[200px]"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--glow-secondary) / 0.2) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_80%)]" />
    </div>
  );
}

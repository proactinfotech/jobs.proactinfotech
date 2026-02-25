import { motion } from "framer-motion";

export function SectionDivider() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="mx-auto h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-border to-transparent"
    />
  );
}

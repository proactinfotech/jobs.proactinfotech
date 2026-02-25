import { motion } from "framer-motion";
import { Briefcase, FileText, User } from "lucide-react";

const ICONS = [
  { Icon: Briefcase, delay: 0 },
  { Icon: FileText, delay: 0.15 },
  { Icon: User, delay: 0.3 },
];

export function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <div className="flex items-center gap-4">
        {ICONS.map(({ Icon, delay }) => (
          <motion.div
            key={delay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 0.3], y: [20, 0, -8, 0] }}
            transition={{
              duration: 1.4,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card"
          >
            <Icon className="h-5 w-5 text-primary" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "120px" }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent"
      />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
      >
        Loading opportunities
      </motion.p>
    </div>
  );
}

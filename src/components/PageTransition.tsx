import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { COMPANY_NAME } from "@/constants/navigation";

const COLUMNS = 10;
const ROWS = 10;
const INITIAL_HOLD_MS = 500;

interface TransitionContextValue {
  navigateTo: (path: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateTo: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

const centerX = COLUMNS / 2 - 0.5;
const centerY = ROWS / 2 - 0.5;
const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

const CELLS = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: COLUMNS }, (_, c) => ({
    id: `${r}-${c}`,
    delay: (Math.sqrt((c - centerX) ** 2 + (r - centerY) ** 2) / maxDist) * 0.5,
  }))
).flat();

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [phase, setPhase] = useState<"idle" | "in" | "hold" | "out">("hold");
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const isInitialReveal = useRef(true);

  const navigateTo = useCallback(
    (path: string) => {
      if (path === pathname || phase !== "idle") return;
      setPendingPath(path);
      setPhase("in");
    },
    [pathname, phase]
  );

  useEffect(() => {
    const handlePopState = () => {
      window.scrollTo(0, 0);
      setPhase("hold");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (phase === "in") {
      const t = setTimeout(() => {
        if (pendingPath) {
          navigate(pendingPath);
          window.scrollTo(0, 0);
          setPendingPath(null);
        }
        setPhase("hold");
      }, 1000);
      return () => clearTimeout(t);
    }

    if (phase === "hold") {
      const holdMs = isInitialReveal.current ? INITIAL_HOLD_MS : 100;
      const t = setTimeout(() => {
        isInitialReveal.current = false;
        setPhase("out");
      }, holdMs);
      return () => clearTimeout(t);
    }

    if (phase === "out") {
      const t = setTimeout(() => setPhase("idle"), 1000);
      return () => clearTimeout(t);
    }
  }, [phase, navigate, pendingPath]);

  const covered = phase === "in" || phase === "hold";

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}

      {phase !== "idle" && (
        <div className="fixed inset-0 z-[200] pointer-events-auto">
          <div
            className="absolute inset-0"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
          >
            {CELLS.map((cell) => (
              <motion.div
                key={cell.id}
                className="h-full w-full origin-center"
                style={{ backgroundColor: "#2E4B3C" }}
                initial={
                  isInitialReveal.current
                    ? { scale: 1.05, borderRadius: "0%" }
                    : { scale: 0, borderRadius: "50%" }
                }
                animate={{
                  scale: covered ? 1.05 : 0,
                  borderRadius: covered ? "0%" : "50%",
                }}
                transition={{
                  duration: 0.55,
                  ease: [0.76, 0, 0.24, 1],
                  delay: cell.delay,
                }}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={isInitialReveal.current ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              animate={{
                opacity: covered ? 1 : 0,
                scale: covered ? 1 : 0.85,
              }}
              transition={{ duration: 0.4, delay: covered ? 0.4 : 0 }}
              className="relative z-10 text-center"
            >
              {COMPANY_NAME.split(" ").map((word) => (
                <span key={word} className="block font-display text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.95] tracking-tight text-background">
                  {word}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </TransitionContext.Provider>
  );
}


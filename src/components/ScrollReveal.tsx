import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

type Direction = "up" | "down" | "left" | "right";
type AnimationVariant = "fade" | "slide" | "scale" | "blur" | "rotate" | "flip";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: Direction;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  stagger?: number;
}

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 40 },
  down: { x: 0, y: -40 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

function getInitialStyles(variant: AnimationVariant, direction: Direction) {
  const offset = OFFSET[direction];

  switch (variant) {
    case "scale":
      return { opacity: 0, scale: 0.85, x: offset.x / 2, y: offset.y / 2 };
    case "blur":
      return { opacity: 0, filter: "blur(10px)", x: offset.x, y: offset.y };
    case "rotate":
      return { opacity: 0, rotate: direction === "left" ? -8 : 8, x: offset.x, y: offset.y };
    case "flip":
      return { opacity: 0, rotateX: 15, y: offset.y, perspective: 800 };
    case "slide":
      return { opacity: 0, x: offset.x * 1.5, y: offset.y * 1.5 };
    case "fade":
    default:
      return { opacity: 0, x: offset.x, y: offset.y };
  }
}

function getAnimateStyles(variant: AnimationVariant) {
  switch (variant) {
    case "scale":
      return { opacity: 1, scale: 1, x: 0, y: 0 };
    case "blur":
      return { opacity: 1, filter: "blur(0px)", x: 0, y: 0 };
    case "rotate":
      return { opacity: 1, rotate: 0, x: 0, y: 0 };
    case "flip":
      return { opacity: 1, rotateX: 0, y: 0 };
    case "slide":
    case "fade":
    default:
      return { opacity: 1, x: 0, y: 0 };
  }
}

export function ScrollReveal({
  children,
  direction = "up",
  variant = "fade",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px" });

  const initial = getInitialStyles(variant, direction);
  const animate = getAnimateStyles(variant);

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

import { useEffect } from "react";

// Scroll-driven color palette shift affecting primary, accent, and ring
// This shifts the actual UI element colors as the user scrolls
const COLOR_STOPS = [
  { at: 0,   primary: "162 72% 45%", accent: "195 80% 55%", ring: "162 72% 45%" },
  { at: 0.25, primary: "200 75% 50%", accent: "220 80% 58%", ring: "200 75% 50%" },
  { at: 0.5, primary: "245 70% 58%", accent: "270 70% 55%", ring: "245 70% 58%" },
  { at: 0.75, primary: "280 65% 55%", accent: "310 70% 55%", ring: "280 65% 55%" },
  { at: 1,   primary: "340 72% 52%", accent: "20 80% 55%",  ring: "340 72% 52%" },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function parseHSL(hsl: string) {
  const [h, s, l] = hsl.split(" ").map(parseFloat);
  return { h, s, l };
}

function lerpHSL(a: string, b: string, t: number) {
  const pa = parseHSL(a);
  const pb = parseHSL(b);
  const h = lerp(pa.h, pb.h, t);
  const s = lerp(pa.s, pb.s, t);
  const l = lerp(pa.l, pb.l, t);
  return `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
}

export function useScrollColor() {
  useEffect(() => {
    const root = document.documentElement;

    const handleScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0;

      let lower = COLOR_STOPS[0];
      let upper = COLOR_STOPS[COLOR_STOPS.length - 1];
      for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
        if (progress >= COLOR_STOPS[i].at && progress <= COLOR_STOPS[i + 1].at) {
          lower = COLOR_STOPS[i];
          upper = COLOR_STOPS[i + 1];
          break;
        }
      }

      const range = upper.at - lower.at;
      const t = range > 0 ? (progress - lower.at) / range : 0;

      root.style.setProperty("--primary", lerpHSL(lower.primary, upper.primary, t));
      root.style.setProperty("--accent", lerpHSL(lower.accent, upper.accent, t));
      root.style.setProperty("--ring", lerpHSL(lower.ring, upper.ring, t));
      // Glow follows primary
      root.style.setProperty("--glow-primary", lerpHSL(lower.primary, upper.primary, t));
      root.style.setProperty("--glow-accent", lerpHSL(lower.accent, upper.accent, t));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      root.style.removeProperty("--primary");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--glow-primary");
      root.style.removeProperty("--glow-accent");
    };
  }, []);
}

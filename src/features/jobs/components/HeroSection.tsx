import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  return (
    <section ref={ref} className="relative flex min-h-screen flex-col overflow-hidden pb-24 pt-20 md:pt-24">

      {/* Spacer pushes content to the bottom; collapses to 0 when content is large so it never overflows past the header */}
      <div className="flex-1" />

      <motion.div style={{ y: textY, opacity }} className="relative z-10 container mx-auto px-6">
        {/* Massive left-aligned editorial typography */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-5xl font-display text-6xl font-light leading-[0.95] tracking-tight text-foreground drop-shadow-sm sm:text-8xl md:text-9xl lg:text-[10rem]"
        >
          Build the future
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-2 max-w-5xl font-display text-5xl font-light italic leading-[0.95] tracking-tight text-primary drop-shadow-sm sm:text-7xl md:text-8xl lg:text-[8rem]"
        >
          with us
        </motion.h2>

        {/* Search bar — left aligned */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-12 flex max-w-xl items-center gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-lg backdrop-blur-sm"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roles, teams, or keywords..."
              className="w-full bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20"
          >
            Search
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6"
        >
          <Link
            to="/jobs"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-6 py-3 text-sm font-medium text-primary backdrop-blur-sm transition-all hover:border-primary/60 hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/10"
          >
            Explore Opportunities
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

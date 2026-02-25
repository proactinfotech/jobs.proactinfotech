import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  tenure: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Sharma",
    role: "Senior Software Engineer",
    quote:
      "The engineering culture here is incredible. I've grown more in two years than I did in five elsewhere. The autonomy and trust the leadership provides is unmatched.",
    tenure: "2 years",
  },
  {
    name: "Rahul Menon",
    role: "Product Designer",
    quote:
      "I love that design has a real seat at the table. My work directly shapes the product, and the cross-functional collaboration makes every project meaningful.",
    tenure: "1.5 years",
  },
  {
    name: "Ananya Reddy",
    role: "Data Analyst",
    quote:
      "From day one, I was working on impactful projects. The mentorship program is fantastic, and there's always room to explore new technologies and approaches.",
    tenure: "3 years",
  },
  {
    name: "Vikram Patel",
    role: "Former Intern → Full-time Engineer",
    quote:
      "I started as an intern and was offered a full-time role within months. The intern experience here is nothing like other companies — you work on real production code.",
    tenure: "1 year",
  },
  {
    name: "Deepa Nair",
    role: "Engineering Manager",
    quote:
      "The leadership invests heavily in your growth. I went from individual contributor to managing a team of 12 in under three years.",
    tenure: "4 years",
  },
  {
    name: "Arjun Kapoor",
    role: "DevOps Engineer",
    quote:
      "Our infrastructure challenges are genuinely exciting. We ship to production daily, and the tooling and processes are world-class.",
    tenure: "2.5 years",
  },
];

const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative w-[320px] flex-shrink-0 rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm transition-colors hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
    >
      <Quote className="mb-4 h-5 w-5 text-primary/40 transition-colors group-hover:text-primary/70" />
      <p className="text-sm leading-relaxed text-muted-foreground italic">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="mt-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">
            {testimonial.role} · {testimonial.tenure}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="overflow-hidden py-24">
      <div className="container mx-auto px-6">
        <ScrollReveal variant="blur">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Our People
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
              What Our Team Says
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Hear from the people who make it all happen.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Marquee track */}
      <div className="group relative mt-12">
        {/* Left/right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div
          className="flex gap-6 py-2 animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]"
          style={{ width: "max-content" }}
        >
          {DOUBLED.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

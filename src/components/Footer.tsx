import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { COMPANY_NAME, COMPANY_WEBSITE_URL, NAV_ITEMS } from "@/constants/navigation";
import { ScrollReveal } from "./ScrollReveal";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border">
      <div className="container mx-auto px-6 py-20 lg:py-28">
        <div className="grid gap-16 md:grid-cols-3 lg:grid-cols-5">
          {/* Left: tagline */}
          <div className="lg:col-span-2">
            <ScrollReveal variant="scale">
              <h3 className="max-w-sm font-heading text-2xl font-semibold leading-snug text-foreground md:text-3xl">
                We are building the future of technology.
              </h3>
              <Link
                to="/jobs"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90"
              >
                Work with us
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </Link>
            </ScrollReveal>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Navigate
            </p>
            <ul className="mt-4 space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Connect
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="mailto:careers@company.com" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Email
                </a>
              </li>
              <li>
                <a
                  href={COMPANY_WEBSITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Website
                </a>
              </li>
            </ul>
          </div>

          {/* Back to top */}
          <div className="flex items-start justify-end">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              aria-label="Back to top"
            >
              <ArrowUpRight className="h-4 w-4 -rotate-45" />
            </button>
          </div>
        </div>
      </div>

      {/* Massive company name */}
      <div className="overflow-hidden border-t border-border">
        <div className="container mx-auto px-6 py-8">
          <ScrollReveal variant="slide" direction="left">
            <h2 className="font-display text-6xl font-light tracking-tight text-foreground sm:text-8xl md:text-9xl lg:text-[11rem] leading-none">
              {COMPANY_NAME}
            </h2>
          </ScrollReveal>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
            © {currentYear} {COMPANY_NAME}. All rights reserved.
          </p>
          <a
            href={COMPANY_WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Main Website
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}

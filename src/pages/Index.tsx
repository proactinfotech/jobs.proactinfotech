import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Loader2 } from "lucide-react";

import { MainLayout } from "@/layouts/MainLayout";
import { HeroSection, useJobs } from "@/features/jobs";
import { HeroSphere } from "@/components/three/HeroSphere";
import { FAQSection } from "@/features/faq";
import { TestimonialsSection } from "@/features/testimonials";
import { ContactSection } from "@/features/contact";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionDivider } from "@/components/SectionDivider";
import { JobRowList } from "@/features/jobs/components/JobRowList";

export default function Index() {
  const { data: jobs = [], isLoading } = useJobs();
  const featuredJobs = jobs.slice(0, 4);

  return (
    <MainLayout>
      <HeroSphere />
      <HeroSection />

      {/* Editorial intro */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <ScrollReveal variant="slide" direction="left">
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                  Careers
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="blur" delay={0.1}>
              <h2 className="font-heading text-3xl font-semibold leading-snug text-foreground md:text-4xl lg:text-5xl">
                We're redefining what's possible in technology.{" "}
                <span className="text-muted-foreground">Join us.</span>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                We're always looking for extraordinary minds to join our team. If you're
                working at the cutting edge of engineering, design, product, or data,
                we'd love to hear from you.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Minimal row-based job listings */}
      <section className="pb-24 lg:pb-32">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="scale">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <JobRowList jobs={featuredJobs} />
            )}
          </ScrollReveal>
          <ScrollReveal variant="slide" direction="right" delay={0.15}>
            <div className="mt-10">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                View all open positions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider />
      <TestimonialsSection />

      <SectionDivider />
      <ScrollReveal variant="rotate">
        <FAQSection />
      </ScrollReveal>

      <SectionDivider />
      <ScrollReveal variant="flip">
        <ContactSection />
      </ScrollReveal>
    </MainLayout>
  );
}

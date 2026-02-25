import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowRight, Loader2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "Required").max(100),
  lastName: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Required").max(2000),
});

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Failed to send message. Please try again.");
      return;
    }
    setSubmitted(true);
  };

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const INPUT_CLASS =
    "h-12 w-full rounded-none border-0 border-b border-secondary-foreground/30 bg-transparent px-0 text-sm text-secondary-foreground placeholder:text-secondary-foreground/60 focus:border-primary focus:outline-none transition-colors";

  if (submitted) {
    return (
      <section id="contact" className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-lg text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Send className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-4 font-heading text-2xl font-bold text-foreground">
              Message Sent!
            </h3>
            <p className="mt-2 text-muted-foreground">
              We&apos;ll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative overflow-hidden rounded-3xl mx-4 my-8 bg-secondary text-secondary-foreground lg:mx-8">
      <div className="container mx-auto px-8 py-20 lg:px-16 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-5">
          {/* Left column — info */}
          <div className="lg:col-span-2">
            <ScrollReveal variant="slide" direction="left">
              <h2 className="font-display text-4xl font-light leading-tight md:text-5xl">
                Message us
              </h2>
              <p className="mt-4 text-sm leading-relaxed opacity-70">
                We'd love to hear from you — send us a message and we'll be in touch soon.
              </p>

              <div className="mt-12 space-y-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-50">
                    General Contact
                  </p>
                  <p className="mt-1 text-sm">careers@company.com</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-50">
                    Location
                  </p>
                  <p className="mt-1 text-sm">Hyderabad, India</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right column — form */}
          <div className="lg:col-span-3">
            <ScrollReveal variant="blur" delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-50">
                      First Name *
                    </label>
                    <input type="text" required value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-50">
                      Last Name *
                    </label>
                    <input type="text" required value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={INPUT_CLASS} />
                  </div>
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-50">
                      Email *
                    </label>
                    <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-50">
                      Phone
                    </label>
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={INPUT_CLASS} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-50">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="mt-2 w-full resize-y rounded-none border-0 border-b border-muted-foreground/30 bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <span className="text-xs font-medium uppercase tracking-[0.15em] opacity-70">
                    Submit Message
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

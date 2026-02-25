import { useState } from "react";
import { Upload, Send, Linkedin, Github, Link2, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth";
import { toast } from "sonner";
import { z } from "zod";
import {
  type ApplicationFormData,
  INITIAL_FORM_DATA,
  HEARD_FROM_OPTIONS,
} from "../types";

const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  experience: z.string().trim().min(1, "Experience is required").max(500),
  earliestJoiningDate: z.string().min(1, "Joining date is required"),
  whyInterested: z.string().trim().min(1, "Required").max(2000),
  whyRoleFits: z.string().trim().min(1, "Required").max(2000),
  whyUs: z.string().trim().min(1, "Required").max(2000),
  linkedinUrl: z.string().url().max(500).optional().or(z.literal("")),
  githubUrl: z.string().url().max(500).optional().or(z.literal("")),
  otherSocialLinks: z.string().max(500).optional().or(z.literal("")),
  heardFrom: z.string().min(1, "Please select an option"),
  openToPaid: z.string().optional().or(z.literal("")),
});

interface ApplicationFormProps {
  jobId: string;
  jobTitle: string;
  isInternship?: boolean;
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLASS =
  "h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-y";

export function ApplicationForm({ jobId, jobTitle, isInternship }: ApplicationFormProps) {
  const { user } = useAuth();
  const [form, setForm] = useState<ApplicationFormData>(INITIAL_FORM_DATA);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof ApplicationFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Max 5MB.");
        return;
      }
      setForm((prev) => ({ ...prev, resume: file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be signed in to apply.");
      return;
    }

    const parsed = applicationSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Please fix form errors.");
      return;
    }

    setSubmitting(true);

    // Upload resume if provided
    let resumeUrl: string | null = null;
    if (form.resume) {
      const file = form.resume;
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload PDF or DOC.");
        setSubmitting(false);
        return;
      }
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        toast.error("Failed to upload resume. Please try again.");
        setSubmitting(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);
      resumeUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase.from("applications").insert({
      user_id: user.id,
      job_id: jobId,
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      experience: parsed.data.experience,
      earliest_joining_date: parsed.data.earliestJoiningDate,
      why_interested: parsed.data.whyInterested,
      why_role_fits: parsed.data.whyRoleFits,
      why_us: parsed.data.whyUs,
      linkedin_url: parsed.data.linkedinUrl || null,
      github_url: parsed.data.githubUrl || null,
      other_social_links: parsed.data.otherSocialLinks || null,
      heard_from: parsed.data.heardFrom,
      open_to_paid: parsed.data.openToPaid || null,
      resume_url: resumeUrl,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit application. Please try again.");
      return;
    }

    toast.success("Application submitted successfully!");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Send className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mt-4 font-heading text-xl font-bold text-foreground">Application Submitted!</h3>
        <p className="mt-2 text-sm text-muted-foreground">We'll review your application and get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="First Name" required>
          <input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="John" required className={INPUT_CLASS} />
        </FormField>
        <FormField label="Last Name" required>
          <input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Doe" required className={INPUT_CLASS} />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Email" required>
          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" required className={INPUT_CLASS} />
        </FormField>
        <FormField label="Phone Number" required>
          <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 9876543210" required className={INPUT_CLASS} />
        </FormField>
      </div>

      <FormField label="Resume" required>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border bg-background px-4 py-4 transition-colors hover:border-primary/50">
          <Upload className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{fileName || "Upload your resume (PDF, DOC — max 5MB)"}</span>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
        </label>
      </FormField>

      <FormField label="Experience" required>
        <input type="text" value={form.experience} onChange={(e) => update("experience", e.target.value)} placeholder="e.g. 3 years in full-stack development" required className={INPUT_CLASS} />
      </FormField>

      <FormField label="Earliest Joining Date" required>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="date" value={form.earliestJoiningDate} onChange={(e) => update("earliestJoiningDate", e.target.value)} required className={`${INPUT_CLASS} pl-10`} />
        </div>
      </FormField>

      <FormField label="Why are you interested in this role?" required>
        <textarea value={form.whyInterested} onChange={(e) => update("whyInterested", e.target.value)} placeholder="Tell us what excites you about this opportunity..." required className={TEXTAREA_CLASS} />
      </FormField>

      <FormField label="Why does this role fit you?" required>
        <textarea value={form.whyRoleFits} onChange={(e) => update("whyRoleFits", e.target.value)} placeholder="Describe how your skills and experience align with this position..." required className={TEXTAREA_CLASS} />
      </FormField>

      <FormField label="Why us?" required>
        <textarea value={form.whyUs} onChange={(e) => update("whyUs", e.target.value)} placeholder="What makes you want to join our company..." required className={TEXTAREA_CLASS} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="LinkedIn Profile">
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="url" value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/..." className={`${INPUT_CLASS} pl-10`} />
          </div>
        </FormField>
        <FormField label="GitHub Profile">
          <div className="relative">
            <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="url" value={form.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} placeholder="https://github.com/..." className={`${INPUT_CLASS} pl-10`} />
          </div>
        </FormField>
      </div>

      <FormField label="Other Social Links">
        <div className="relative">
          <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input type="text" value={form.otherSocialLinks} onChange={(e) => update("otherSocialLinks", e.target.value)} placeholder="Portfolio, Twitter, etc." className={`${INPUT_CLASS} pl-10`} />
        </div>
      </FormField>

      <FormField label="Where did you hear about us?" required>
        <select value={form.heardFrom} onChange={(e) => update("heardFrom", e.target.value)} required className={INPUT_CLASS}>
          <option value="">Select an option</option>
          {HEARD_FROM_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </FormField>

      {isInternship && (
        <FormField label="Are you open to paid roles?" required>
          <div className="flex gap-4">
            {["Yes", "No"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-foreground">
                <input type="radio" name="openToPaid" value={opt} checked={form.openToPaid === opt} onChange={(e) => update("openToPaid", e.target.value)} className="accent-primary" />
                {opt}
              </label>
            ))}
          </div>
        </FormField>
      )}

      <Button type="submit" size="lg" className="w-full rounded-xl" variant="glow" disabled={submitting}>
        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        {submitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}

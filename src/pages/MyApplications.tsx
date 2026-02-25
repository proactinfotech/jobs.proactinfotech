import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Clock, MapPin, Briefcase, X, ExternalLink, ChevronRight } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useUserApplications } from "@/features/jobs/hooks/useJobs";
import type { ApplicationRecord } from "@/features/jobs/services/applications-service";

const STATUS_LABELS: Record<ApplicationRecord["status"], string> = {
  submitted: "Submitted",
  "under-review": "Under Review",
  interview: "Interview Scheduled",
  rejected: "Not Selected",
  accepted: "Offer Extended",
};

const STATUS_COLORS: Record<ApplicationRecord["status"], string> = {
  submitted: "bg-secondary text-secondary-foreground",
  "under-review": "bg-accent/20 text-accent",
  interview: "bg-primary/20 text-primary",
  rejected: "bg-destructive/20 text-destructive",
  accepted: "bg-primary text-primary-foreground",
};

function ApplicationDetail({ app, onClose }: { app: ApplicationRecord; onClose: () => void }) {
  const formFields = [
    { label: "Experience", value: app.experience },
    { label: "Why interested?", value: app.whyInterested },
    { label: "Why this role fits you", value: app.whyRoleFits },
    { label: "Why Proact Infotech?", value: app.whyUs },
    app.earliestJoiningDate && { label: "Earliest joining date", value: app.earliestJoiningDate },
    app.openToPaid && { label: "Open to paid internship?", value: app.openToPaid },
    app.heardFrom && { label: "How did you hear about us?", value: app.heardFrom },
  ].filter(Boolean) as { label: string; value: string }[];

  const links = [
    app.linkedinUrl && { label: "LinkedIn", url: app.linkedinUrl },
    app.githubUrl && { label: "GitHub", url: app.githubUrl },
    app.otherSocialLinks && { label: "Other links", url: app.otherSocialLinks },
    app.resumeUrl && { label: "Resume", url: app.resumeUrl },
  ].filter(Boolean) as { label: string; url: string }[];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative flex w-full max-w-4xl h-[82vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Left panel: job details ── */}
          <div className="flex w-72 shrink-0 flex-col justify-between border-r border-border bg-card/60 p-6">
            <div>
              <div className="mb-6 flex items-start justify-between gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                  {STATUS_LABELS[app.status]}
                </span>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h2 className="font-heading text-2xl font-semibold leading-snug text-foreground">{app.jobTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{app.department}</p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {app.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  {app.department}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  Applied {app.appliedDate}
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-6 space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Applicant</p>
                <p className="text-sm font-medium text-foreground">{app.firstName} {app.lastName}</p>
                <p className="text-xs text-muted-foreground">{app.email}</p>
                <p className="text-xs text-muted-foreground">{app.phone}</p>
              </div>
            </div>

            {links.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Links</p>
                <div className="flex flex-wrap gap-2">
                  {links.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      {l.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right panel: form answers (hidden scrollbar) ── */}
          <div className="scrollbar-hide flex-1 overflow-y-scroll">
            <div className="px-8 py-6">
              <h3 className="font-heading text-lg font-semibold text-foreground">Application Answers</h3>
              <p className="mt-1 text-xs text-muted-foreground">Responses submitted with the application</p>
            </div>
            <div className="divide-y divide-border px-8 pb-8">
              {formFields.map((f) => (
                <div key={f.label} className="py-4">
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">{f.label}</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{f.value || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileText className="h-12 w-12 text-muted-foreground/40" />
      <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
        No Applications Yet
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        You haven&apos;t applied to any positions yet. Browse our open roles and
        submit your first application!
      </p>
    </div>
  );
}

function ApplicationCard({ app, onClick }: { app: ApplicationRecord; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-border bg-card/80 p-6 text-left backdrop-blur-sm transition-colors hover:border-foreground/20 hover:bg-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground">
            {app.jobTitle}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{app.department}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[app.status]}`}
          >
            {STATUS_LABELS[app.status]}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {app.location}
        </span>
        <span className="flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5" />
          {app.department}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          Applied {app.appliedDate}
        </span>
      </div>
    </button>
  );
}

export default function MyApplications() {
  const { user } = useAuth();
  const { data: applications = [], isLoading, isError } = useUserApplications(user?.id);
  const [selected, setSelected] = useState<ApplicationRecord | null>(null);

  return (
    <MainLayout>
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <ScrollReveal variant="blur">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
                My Applications
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Track the status of your job applications.
              </p>
            </motion.div>
          </ScrollReveal>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : isError ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
              Failed to load applications. Please try again.
            </div>
          ) : applications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4">
              {applications.map((app) => (
                <ApplicationCard key={app.id} app={app} onClick={() => setSelected(app)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && <ApplicationDetail app={selected} onClose={() => setSelected(null)} />}
    </MainLayout>
  );
}


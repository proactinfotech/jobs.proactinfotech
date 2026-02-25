import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Briefcase, Clock, IndianRupee, Loader2 } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import { ApplyDialog } from "@/features/apply";
import { useJob } from "@/features/jobs";
import { Button } from "@/components/ui/button";

export default function Apply() {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: job, isLoading } = useJob(jobId);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center pt-28">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center pt-28">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">Job Not Found</h1>
            <Link to="/jobs" className="mt-4 inline-block text-sm text-primary hover:text-primary/80">
              ← Back to Jobs
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isInternship = job.type === "internship";

  return (
    <MainLayout>
      <div className="pt-28 pb-24">
        <div className="container mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/jobs"
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>

            <div className="mb-8">
              <h1 className="font-display text-3xl font-light text-foreground md:text-4xl">
                {job.title}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {job.department} · {job.location}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" /> {job.type}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {job.experience}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" /> {job.salary}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8 space-y-6 rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm md:p-8">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">About the Role</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{job.description}</p>
              </div>
              {job.requirements && (
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">Requirements</h2>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {job.requirements.map((req) => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
              {job.responsibilities && (
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">Responsibilities</h2>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {job.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Apply CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-between rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm"
          >
            <div>
              <p className="font-heading text-base font-semibold text-foreground">
                Interested in this role?
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Takes about 5 minutes to apply.
              </p>
            </div>
            <Button
              size="lg"
              className="rounded-xl"
              variant="glow"
              onClick={() => setDialogOpen(true)}
            >
              Apply Now
            </Button>
          </motion.div>
        </div>
      </div>

      <ApplyDialog
        jobId={job.id}
        jobTitle={job.title}
        isInternship={isInternship}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </MainLayout>
  );
}

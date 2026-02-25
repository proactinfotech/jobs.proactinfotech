import { JobCard } from "./JobCard";
import type { Job } from "../types";

interface JobListSectionProps {
  jobs: Job[];
  title?: string;
}

export function JobListSection({ jobs, title }: JobListSectionProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="font-heading text-xl font-semibold text-foreground">
          No positions found
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <section>
      {title && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {title}
          </h2>
          <span className="text-sm text-muted-foreground">
            {jobs.length} {jobs.length === 1 ? "position" : "positions"}
          </span>
        </div>
      )}
      <div className="grid gap-4">
        {jobs.map((job, i) => (
          <JobCard key={job.id} job={job} index={i} />
        ))}
      </div>
    </section>
  );
}

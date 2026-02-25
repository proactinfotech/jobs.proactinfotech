import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Job } from "../types";
import { formatJobType } from "../utils/format";

interface JobRowListProps {
  jobs: Job[];
}

export function JobRowList({ jobs }: JobRowListProps) {
  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-xl font-semibold text-foreground">No positions found</p>
        <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border border-y border-border">
      {jobs.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Link
            to={`/apply/${job.id}`}
            className="group flex items-center justify-between gap-4 py-6 transition-colors hover:bg-muted/30 px-2 -mx-2 rounded-lg"
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-lg font-medium text-foreground transition-colors group-hover:text-primary md:text-xl">
                {job.title}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground md:hidden">
                {formatJobType(job.type)}
              </p>
            </div>
            <span className="hidden text-sm text-muted-foreground md:block">
              {formatJobType(job.type)}
            </span>
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
              <Plus className="h-4 w-4" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

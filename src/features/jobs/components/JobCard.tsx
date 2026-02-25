import { Link } from "react-router-dom";
import { MapPin, Clock, Briefcase, ArrowRight, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import type { Job } from "../types";
import { formatJobType } from "../utils/format";

interface JobCardProps {
  job: Job;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -3 }}
    >
      <Link
        to={`/apply/${job.id}`}
        className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
      >
        {/* Hover gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              {job.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{job.department}</p>
          </div>
          <motion.div
            initial={{ x: -4, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            className="flex-shrink-0"
          >
            <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
          </motion.div>
        </div>

        <p className="relative text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {job.description}
        </p>

        {job.requirements && (
          <div className="relative space-y-1">
            <p className="text-xs font-medium text-foreground/70">Key Requirements:</p>
            <ul className="list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
              {job.requirements.slice(0, 2).map((req) => (
                <li key={req} className="line-clamp-1">{req}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="relative flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {formatJobType(job.type)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {job.experience}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5" />
              {job.salary}
            </span>
          )}
        </div>

        <div className="relative flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}

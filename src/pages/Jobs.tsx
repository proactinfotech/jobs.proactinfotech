import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { MainLayout } from "@/layouts/MainLayout";
import {
  JobFilters,
  JobListSection,
  useJobs,
  filterJobs,
  INITIAL_FILTERS,
} from "@/features/jobs";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { FilterState } from "@/features/jobs";

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const { data: jobs = [], isLoading } = useJobs();

  const [filters, setFilters] = useState<FilterState>({
    ...INITIAL_FILTERS,
    search: initialSearch,
  });

  const filteredJobs = useMemo(
    () => filterJobs(jobs, filters),
    [jobs, filters]
  );

  return (
    <MainLayout>
      <div className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h1 className="font-heading text-4xl font-bold text-foreground md:text-5xl">
              All Positions
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Find the role that&apos;s right for you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <JobFilters filters={filters} onChange={setFilters} />
          </motion.div>

          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <JobListSection
                jobs={filteredJobs}
                title={`${filteredJobs.length} Open ${filteredJobs.length === 1 ? "Position" : "Positions"}`}
              />
            )}
          </div>
        </div>
      </div>

    </MainLayout>
  );
}

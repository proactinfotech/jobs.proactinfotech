import type { Job, FilterState } from "../types";

export function filterJobs(jobs: Job[], filters: FilterState): Job[] {
  return jobs.filter((job) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q) ||
        job.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    if (filters.department && job.department !== filters.department) return false;
    if (filters.location && job.location !== filters.location) return false;
    if (filters.type && job.type !== filters.type) return false;
    if (filters.experience && job.experience !== filters.experience) return false;

    return true;
  });
}

export const INITIAL_FILTERS: FilterState = {
  search: "",
  department: "",
  location: "",
  type: "",
  experience: "",
};

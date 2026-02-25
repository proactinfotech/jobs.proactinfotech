import { useQuery } from "@tanstack/react-query";
import { fetchActiveJobs, fetchJobById } from "../services/jobs-service";
import { fetchUserApplications } from "../services/applications-service";

const JOBS_KEY = ["jobs"] as const;

export function useJobs() {
  return useQuery({
    queryKey: JOBS_KEY,
    queryFn: fetchActiveJobs,
    staleTime: 5 * 60 * 1000,
  });
}

export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: [...JOBS_KEY, id],
    queryFn: () => fetchJobById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserApplications(userId: string | undefined) {
  return useQuery({
    queryKey: ["applications", userId],
    queryFn: () => fetchUserApplications(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

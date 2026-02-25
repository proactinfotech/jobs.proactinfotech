import { supabase } from "@/integrations/supabase/client";
import type { Job } from "../types";

interface JobRow {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  posted_date: string;
  description: string;
  tags: string[];
  requirements: string[] | null;
  responsibilities: string[] | null;
  salary: string | null;
}

function mapRowToJob(row: JobRow): Job {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type as Job["type"],
    experience: row.experience,
    postedDate: row.posted_date,
    description: row.description,
    tags: row.tags,
    requirements: row.requirements ?? undefined,
    responsibilities: row.responsibilities ?? undefined,
    salary: row.salary ?? undefined,
  };
}

export async function fetchActiveJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_active", true)
    .order("posted_date", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRowToJob);
}

export async function fetchJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToJob(data) : null;
}

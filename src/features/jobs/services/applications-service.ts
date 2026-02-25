import { supabase } from "@/integrations/supabase/client";

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  status: "submitted" | "under-review" | "interview" | "rejected" | "accepted";
  appliedDate: string;
  // Applicant-filled fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  whyInterested: string;
  whyRoleFits: string;
  whyUs: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  otherSocialLinks: string | null;
  heardFrom: string | null;
  openToPaid: string | null;
  earliestJoiningDate: string | null;
  resumeUrl: string | null;
}

export async function fetchUserApplications(userId: string): Promise<ApplicationRecord[]> {
  const { data, error } = await supabase
    .from("applications")
    .select(`
      id,
      job_id,
      status,
      created_at,
      first_name,
      last_name,
      email,
      phone,
      experience,
      why_interested,
      why_role_fits,
      why_us,
      linkedin_url,
      github_url,
      other_social_links,
      heard_from,
      open_to_paid,
      earliest_joining_date,
      resume_url,
      jobs (
        title,
        department,
        location
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => ({
    id: row.id,
    jobId: row.job_id,
    jobTitle: row.jobs?.title ?? "Unknown Position",
    department: row.jobs?.department ?? "",
    location: row.jobs?.location ?? "",
    status: row.status as ApplicationRecord["status"],
    appliedDate: new Date(row.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    experience: row.experience ?? "",
    whyInterested: row.why_interested ?? "",
    whyRoleFits: row.why_role_fits ?? "",
    whyUs: row.why_us ?? "",
    linkedinUrl: row.linkedin_url ?? null,
    githubUrl: row.github_url ?? null,
    otherSocialLinks: row.other_social_links ?? null,
    heardFrom: row.heard_from ?? null,
    openToPaid: row.open_to_paid ?? null,
    earliestJoiningDate: row.earliest_joining_date ?? null,
    resumeUrl: row.resume_url ?? null,
  }));
}

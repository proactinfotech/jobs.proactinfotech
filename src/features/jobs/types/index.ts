export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  experience: string;
  postedDate: string;
  description: string;
  tags: string[];
  requirements?: string[];
  responsibilities?: string[];
  salary?: string;
}

export type JobType = "full-time" | "part-time" | "internship" | "contract";

export interface FilterState {
  search: string;
  department: string;
  location: string;
  type: string;
  experience: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

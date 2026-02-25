import type { FilterOption } from "../types";

export const DEPARTMENT_OPTIONS: FilterOption[] = [
  { label: "All Departments", value: "" },
  { label: "Product & Engineering", value: "Product & Engineering" },
  { label: "Core Systems", value: "Core Systems" },
  { label: "ClusterAI", value: "ClusterAI" },
  { label: "Data & Infrastructure", value: "Data & Infrastructure" },
  { label: "Growth & Community", value: "Growth & Community" },
  { label: "Business & Revenue", value: "Business & Revenue" },
  { label: "Core Infrastructure", value: "Core Infrastructure" },
  { label: "Node Runtime Engineering", value: "Node Runtime Engineering" },
  { label: "Platform Engineering", value: "Platform Engineering" },
  { label: "Security & Trust", value: "Security & Trust" },
  { label: "Broker & Marketplace", value: "Broker & Marketplace" },
  { label: "Optimization & Modeling", value: "Optimization & Modeling" },
];

export const LOCATION_OPTIONS: FilterOption[] = [
  { label: "All Locations", value: "" },
  { label: "Remote / Hybrid", value: "Remote / Hybrid" },
];

export const TYPE_OPTIONS: FilterOption[] = [
  { label: "All Types", value: "" },
  { label: "Internship", value: "internship" },
];

export const EXPERIENCE_OPTIONS: FilterOption[] = [
  { label: "All Experience", value: "" },
  { label: "0-1 years", value: "0-1 years" },
];

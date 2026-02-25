import { Search, X } from "lucide-react";
import type { FilterState, FilterOption } from "../types";
import {
  DEPARTMENT_OPTIONS,
  LOCATION_OPTIONS,
  TYPE_OPTIONS,
  EXPERIENCE_OPTIONS,
} from "../constants/filter-options";
import { INITIAL_FILTERS } from "../utils/filter";

interface JobFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function JobFilters({ filters, onChange }: JobFiltersProps) {
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const updateFilter = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4">
        <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          placeholder="Search positions..."
          className="h-10 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          value={filters.department}
          options={DEPARTMENT_OPTIONS}
          onChange={(v) => updateFilter("department", v)}
        />
        <FilterSelect
          value={filters.location}
          options={LOCATION_OPTIONS}
          onChange={(v) => updateFilter("location", v)}
        />
        <FilterSelect
          value={filters.type}
          options={TYPE_OPTIONS}
          onChange={(v) => updateFilter("type", v)}
        />
        <FilterSelect
          value={filters.experience}
          options={EXPERIENCE_OPTIONS}
          onChange={(v) => updateFilter("experience", v)}
        />

        {hasActiveFilters && (
          <button
            onClick={() => onChange(INITIAL_FILTERS)}
            className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

import { COMPANY_NAME } from "@/constants/navigation";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <span className="font-heading text-sm font-bold text-primary-foreground">
          P
        </span>
      </div>
      <span className="font-heading text-lg font-semibold text-foreground">
        {COMPANY_NAME}
      </span>
    </div>
  );
}

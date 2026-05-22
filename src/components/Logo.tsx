import { COMPANY_NAME } from "@/constants/navigation";

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/images/logo.png"
        alt={COMPANY_NAME}
        className="h-8 w-auto object-contain"
      />
      <span className="font-display text-sm font-medium text-foreground">
        {COMPANY_NAME}
      </span>
    </div>
  );
}


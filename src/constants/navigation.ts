export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "FAQ", href: "/#faq" },
];

export const COMPANY_WEBSITE_URL = "https://example.com";
export const COMPANY_NAME = "Proact Infotech";

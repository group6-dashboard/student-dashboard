export type NavItem = {
  label: string;
  href: string;
  title?: string;
};

export const navItems: NavItem[] = [
  { label: "Overview", title: "Overview", href: "/" },
  { label: "Schedule", title: "Schedule", href: "/schedule" },
  { label: "Plan", title: "Plan", href: "/plan" },
  { label: "Budget", title: "Budget", href: "/budget" },
  { label: "Analytics", title: "Analytics", href: "/analytics" },
];

import AppShell from "@/components/layout/AppShell";
import { navItems } from "@/config/nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell navItems={navItems}>{children}</AppShell>;
}

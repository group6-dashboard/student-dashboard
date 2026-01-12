"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/nav";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  navItems: NavItem[];
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function AppShell({ children, navItems }: AppShellProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const activeItem = navItems.find((item) => isActive(item.href)) ?? navItems[0];
  const pageTitle = activeItem?.title ?? activeItem?.label ?? "Dashboard";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex min-h-dvh">
        {/* Sidebar */}
        <aside className="hidden w-[260px] shrink-0 md:flex md:flex-col border-r border-border/50 bg-card">
          {/* Logo */}
          <div className="flex h-16 items-center gap-3 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-semibold">
              SD
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-primary">
                Student Dashboard
              </div>
              <div className="text-xs text-muted-foreground">
                Personal workspace
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      active ? "bg-primary" : "bg-border"
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-20 bg-card">
            <div className="border-b border-border/60">
              <div className="mx-auto flex h-14 max-w-6xl items-center px-4 md:px-6">
                <h1 className="text-base font-semibold text-primary/90">
                  {pageTitle}
                </h1>

                <div className="ml-auto">
                  {/* User avatar */}
                  <button
                    type="button"
                    aria-label="User menu"
                    className="h-9 w-9 rounded-full bg-muted hover:bg-accent transition-colors"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 bg-background">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

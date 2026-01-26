"use client";

import { Button } from "@/components/ui/primitives";

export type TabKey = "Weekly" | "Summary";

export default function Tabs({
  value,
  onChange,
}: {
  value: TabKey;
  onChange: (v: TabKey) => void;
}) {
  const tabs: TabKey[] = ["Weekly", "Summary"];

  return (
    <div className="flex items-center gap-2 border-b border-border/50 px-2">
      {tabs.map((t) => {
        const active = t === value;
        return (
          <Button
            key={t}
            variant={active ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onChange(t)}
            className={
              active ? "border-b-2 border-primary rounded-none" : "rounded-none"
            }
          >
            {t}
          </Button>
        );
      })}
    </div>
  );
}

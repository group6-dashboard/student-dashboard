"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Badge, Text } from "@/components/ui/primitives";
import type { PlanResult } from "@/lib/study-plan/types";
import { formatRange } from "@/lib/study-plan/date";

export default function WeeklyView({ result }: { result: PlanResult }) {
  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="pt-5">
          <div className="overflow-x-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="text-left font-medium py-2 pr-3 w-[160px]">
                    Week
                  </th>
                  <th className="text-left font-medium py-2 pr-3">Tasks</th>
                  <th className="text-right font-medium py-2 w-[180px]">
                    Weekly Summary
                  </th>
                </tr>
              </thead>

              <tbody>
                {result.weeks.map((w) => {
                  const range = formatRange(w.week.start, w.week.end);
                  return (
                    <tr
                      key={w.week.index}
                      className="border-t border-border/50 align-top"
                    >
                      <td className="py-3 pr-3">
                        <Text className="font-medium">Week {w.week.index}</Text>
                        <Text variant="caption">{range}</Text>
                      </td>

                      <td className="py-3 pr-3">
                        <div className="space-y-2">
                          {w.rows.length === 0 ? (
                            <Text variant="muted">—</Text>
                          ) : (
                            w.rows.map((r, idx) => (
                              <div key={idx} className="min-w-0">
                                {/* small screen */}
                                <div className="flex items-center justify-between gap-2 md:hidden">
                                  <span className="truncate">{r.title}</span>
                                  <span className="text-muted-foreground whitespace-nowrap">
                                    {r.hours}h
                                  </span>
                                </div>

                                {/* large screen */}
                                <div className="hidden md:flex items-center gap-2 min-w-0">
                                  <Badge>{r.type}</Badge>
                                  <span className="truncate">{r.title}</span>
                                  <span className="ml-auto text-muted-foreground whitespace-nowrap">
                                    {r.hours}h
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </td>

                      <td className="py-3 text-right">
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Used:{" "}
                            </span>
                            <span className="font-medium">
                              {w.usedHours.toFixed(1)}h
                            </span>
                          </div>

                          <div>
                            <span className="text-muted-foreground">
                              Remaining:{" "}
                            </span>
                            <span
                              className={
                                w.remainingHours < 0
                                  ? "font-medium text-destructive"
                                  : "font-medium"
                              }
                            >
                              {w.remainingHours.toFixed(1)}h
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { ActivityRow } from "@/components/activity/activity-row";

function groupKey(iso: string): "today" | "yesterday" | "week" | "earlier" {
  const date = new Date(iso);
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const diff = Math.floor((startToday - date.getTime()) / 86400000);
  if (diff <= 0) return "today";
  if (diff === 1) return "yesterday";
  if (diff < 7) return "week";
  return "earlier";
}

const GROUPS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "Earlier this week" },
  { key: "earlier", label: "Previous" },
] as const;

export default function ActivityPage() {
  const { activities } = useApp();

  const grouped = useMemo(() => {
    const map: Record<string, typeof activities> = {
      today: [],
      yesterday: [],
      week: [],
      earlier: [],
    };
    activities.forEach((a) => {
      map[groupKey(a.at)].push(a);
    });
    return map;
  }, [activities]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative space-y-8">
        {GROUPS.map((group) => {
          const items = grouped[group.key];
          if (items.length === 0) return null;
          return (
            <section key={group.key} className="animate-rise">
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-[12px] font-semibold uppercase tracking-wider text-ink-3">
                  {group.label}
                </h3>
                <div className="h-px flex-1 bg-edge" />
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-2">
                  {items.length}
                </span>
              </div>
              <div className="relative ml-4 space-y-5 border-l border-edge pl-4">
                {items.map((a) => (
                  <div key={a.id} className="relative">
                    <span className="absolute -left-[21px] top-2.5 h-2 w-2 rounded-full border-2 border-[var(--bg)] bg-accent" />
                    <ActivityRow id={a.id} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="card py-16 text-center text-[13px] text-ink-3">
          No activity yet.
        </div>
      )}
    </div>
  );
}
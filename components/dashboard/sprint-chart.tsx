"use client";

import { getProject } from "@/lib/data";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function SprintChart({ projectId }: { projectId: string }) {
  const values = getProject(projectId).sprint;
  const max = Math.max(...values);
  const total = values.reduce((acc, v) => acc + v, 0);

  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-ink">Points completed this week</h3>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-2">
          {total} total
        </span>
      </div>

      <div className="mt-5 flex flex-1 items-end justify-between gap-2 sm:gap-3">
        {values.map((done, i) => (
          <div key={DAYS[i]} className="group flex flex-1 flex-col items-center gap-2">
            <span className="text-[11px] tabular-nums text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">
              {done}
            </span>
            <div className="flex h-[88px] w-full items-end justify-center">
              <div
                className={cn(
                  "w-full max-w-[28px] rounded-lg transition-all duration-500",
                  i === 6
                    ? "bg-gradient-to-t from-[var(--accent)] to-[var(--cyan)] shadow-[0_4px_16px_-4px_color-mix(in_srgb,var(--accent)_50%,transparent)]"
                    : "bg-surface-3 group-hover:bg-accent/30"
                )}
                style={{ height: `${(done / max) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-ink-3">{DAYS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
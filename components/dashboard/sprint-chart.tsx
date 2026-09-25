"use client";

import { cn } from "@/lib/utils";

const WEEKS = [
  { day: "Mon", done: 3 },
  { day: "Tue", done: 5 },
  { day: "Wed", done: 4 },
  { day: "Thu", done: 7 },
  { day: "Fri", done: 2 },
  { day: "Sat", done: 6 },
  { day: "Sun", done: 8 },
];

export { WEEKS };

export function SprintChart() {
  const max = Math.max(...WEEKS.map((w) => w.done));
  const total = WEEKS.reduce((acc, w) => acc + w.done, 0);

  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-ink">Tasks completed this week</h3>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-2">
          {total} total
        </span>
      </div>

      <div className="mt-5 flex flex-1 items-end justify-between gap-2 sm:gap-3">
        {WEEKS.map((w, i) => (
          <div key={w.day} className="group flex flex-1 flex-col items-center gap-2">
            <span className="text-[11px] tabular-nums text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">
              {w.done}
            </span>
            <div className="flex h-[88px] w-full items-end justify-center">
              <div
                className={cn(
                  "w-full max-w-[28px] rounded-lg transition-all duration-500",
                  i === 6
                    ? "bg-gradient-to-t from-[var(--accent)] to-[var(--cyan)] shadow-[0_4px_16px_-4px_color-mix(in_srgb,var(--accent)_50%,transparent)]"
                    : "bg-surface-3 group-hover:bg-accent/30"
                )}
                style={{ height: `${(w.done / max) * 100}%` }}
              />
            </div>
            <span className="text-[11px] text-ink-3">{w.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
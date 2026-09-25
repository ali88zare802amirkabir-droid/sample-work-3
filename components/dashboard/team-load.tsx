"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";

export function TeamLoad() {
  const { members, tasks } = useApp();

  const rows = members
    .map((member) => {
      const open = tasks.filter(
        (t) => t.assigneeId === member.id && t.status !== "done"
      ).length;
      return { member, open };
    })
    .sort((a, b) => b.open - a.open);

  const max = Math.max(...rows.map((r) => r.open), 1);

  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-ink">Team workload</h3>
        <Link
          href="/team"
          className="flex items-center gap-0.5 text-[12px] font-medium text-accent transition-colors hover:text-ink"
        >
          Team <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {rows.map(({ member, open }) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar
              name={member.name}
              gradient={member.gradient}
              size="sm"
              online={member.status === "online"}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-[12.5px] font-medium text-ink">
                  {member.name}
                </span>
                <span className="text-[11px] tabular-nums text-ink-3">
                  {open} open
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-500",
                    open >= 5
                      ? "bg-gradient-to-r from-[var(--danger)] to-[var(--warn)]"
                      : "bg-gradient-to-r from-[var(--accent)] to-[var(--cyan)]"
                  )}
                  style={{ width: `${(open / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
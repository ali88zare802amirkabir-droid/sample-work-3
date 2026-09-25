"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useApp } from "@/lib/store";
import { ActivityRow } from "@/components/activity/activity-row";

export function RecentActivity() {
  const { activities } = useApp();
  const recent = activities.slice(0, 6);

  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse-soft" />
          Recent activity
        </h3>
        <Link
          href="/activity"
          className="flex items-center gap-0.5 text-[12px] font-medium text-accent transition-colors hover:text-ink"
        >
          View all <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {recent.map((a) => (
          <ActivityRow key={a.id} id={a.id} />
        ))}
      </div>
    </div>
  );
}
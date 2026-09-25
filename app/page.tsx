"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { greeting } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCards } from "@/components/dashboard/stats";
import { CurrentProject } from "@/components/dashboard/current-project";
import { UpcomingDeadlines } from "@/components/dashboard/upcoming-deadlines";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TeamLoad } from "@/components/dashboard/team-load";

function todayString() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function StatSkeleton() {
  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-9 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { tasks, members, openTask } = useApp();
  const [loading, setLoading] = useState(true);
  const open = tasks.filter((t) => t.status !== "done").length;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[12px] text-ink-3">{todayString()}</p>
          <h2 className="font-display mt-0.5 text-xl font-semibold text-ink sm:text-2xl">
            {greeting()}, Ali
          </h2>
          <p className="mt-1 text-[13px] text-ink-2">
            You have <span className="font-semibold text-accent">{open} open tasks</span> and{" "}
            {members.length} teammates ready to ship.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => openTask("t-111")}>
            Continue working
          </Button>
          <Link href="/board">
            <Button variant="primary">
              Open board <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <StatCards />

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CurrentProject />
            </div>
            <UpcomingDeadlines />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
            <TeamLoad />
          </div>
        </>
      )}
    </div>
  );
}
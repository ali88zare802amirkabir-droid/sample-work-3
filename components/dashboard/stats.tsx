"use client";

import { CheckCircle2, Circle, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${36 - ((v - min) / range) * 32}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={cn("h-9 w-full", className)}>
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <polygon points={`0,40 ${points} 100,40`} fill="url(#sparkFill)" opacity="0.4" />
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function StatCards() {
  const { tasks, members } = useApp();
  const open = tasks.filter((t) => t.status !== "done").length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inReview = tasks.filter((t) => t.status === "review").length;

  const cards = [
    {
      label: "Open tasks",
      value: open,
      sub: "Across all projects",
      delta: "+2 since yesterday",
      icon: Circle,
      spark: [3, 5, 4, 7, 6, 8, 7],
    },
    {
      label: "Completed",
      value: completed,
      sub: "Shipped in 3 sprints",
      delta: "+5 this week",
      ok: true,
      icon: CheckCircle2,
      spark: [2, 4, 6, 5, 8, 10, 12],
    },
    {
      label: "Team members",
      value: members.length,
      sub: "3 currently online",
      delta: "1 new member",
      icon: Users,
      spark: [4, 4, 5, 5, 6, 6, 7],
    },
    {
      label: "In review",
      value: inReview,
      sub: "Awaiting feedback",
      delta: "Nexa Mobile App",
      icon: TrendingUp,
      spark: [1, 2, 1, 3, 2, 4, 3],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn("card group p-4 transition-all duration-200", "animate-rise")}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-medium text-ink-3">{card.label}</p>
                <p className="font-display mt-1 text-2xl font-bold tabular-nums text-ink">
                  {card.value}
                </p>
              </div>
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl border border-edge bg-surface-2 transition-transform duration-200 group-hover:scale-105",
                  card.ok ? "text-ok" : "text-accent"
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="mt-2">
              <Sparkline data={card.spark} />
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-ink-3">{card.sub}</span>
              <span className={cn("font-medium", card.ok ? "text-ok" : "text-accent")}>
                {card.delta}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
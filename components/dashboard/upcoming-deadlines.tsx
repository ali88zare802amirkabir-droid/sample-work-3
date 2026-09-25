"use client";

import { CalendarClock, CheckCircle2, Flame } from "lucide-react";
import { cn, dueLabel, isOverdue } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { getMember, getProject } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";

export function UpcomingDeadlines() {
  const { tasks } = useApp();
  const due = [...tasks]
    .filter((t) => t.status !== "done")
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 5);

  return (
    <div className="card flex h-full flex-col p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          <CalendarClock className="h-4 w-4 text-accent" />
          Upcoming deadlines
        </h3>
        <span className="text-[11px] text-ink-3">{due.length} due</span>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5">
        {due.map((task) => {
          const member = getMember(task.assigneeId);
          const project = getProject(task.projectId);
          const due = dueLabel(task.due);
          const overdue = isOverdue(task.due);
          return (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-colors hover:border-edge hover:bg-surface-2"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-ink">{task.title}</p>
                <p className="truncate text-[11px] text-ink-3">{project.name}</p>
              </div>
              <Avatar name={member.name} gradient={member.gradient} size="xs" />
              <div
                className={cn(
                  "flex w-[52px] items-center gap-1 text-[11px] font-medium tabular-nums",
                  overdue ? "text-danger" : due.tone === "warn" ? "text-warn" : "text-ink-2"
                )}
              >
                {overdue ? (
                  <Flame className="h-3 w-3" />
                ) : (
                  <CheckCircle2 className="h-3 w-3 opacity-60" />
                )}
                {due.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
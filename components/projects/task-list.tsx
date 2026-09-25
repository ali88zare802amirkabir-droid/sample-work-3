"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { cn, dueLabel, timeAgo } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { getMember, priorityMeta, taskStatusMeta } from "@/lib/data";
import type { TaskStatus } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const FILTERS: Array<{ key: TaskStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "review", label: "In Review" },
  { key: "done", label: "Done" },
];

export function TaskList({ projectId }: { projectId?: string }) {
  const { tasks, openTask } = useApp();
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  const list = tasks
    .filter((t) => (projectId ? t.projectId === projectId : true))
    .filter((t) => filter === "all" || t.status === filter)
    .sort((a, b) => a.due.localeCompare(b.due));

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1 rounded-xl border border-edge bg-surface-2/60 p-1 w-fit">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              filter === f.key
                ? "bg-surface text-ink shadow-sm"
                : "text-ink-3 hover:text-ink-2"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-edge">
        <div className="hidden grid-cols-[1fr_120px_140px_120px_64px] items-center gap-3 border-b border-edge bg-surface-2/50 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-3 md:grid">
          <span>Task</span>
          <span>Status</span>
          <span>Assignee</span>
          <span>Due</span>
          <span className="text-right">Prio</span>
        </div>
        <div>
          {list.map((task) => {
            const member = getMember(task.assigneeId);
            const statusMeta = taskStatusMeta[task.status];
            const priority = priorityMeta[task.priority];
            const due = dueLabel(task.due);
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => openTask(task.id)}
                className="grid w-full grid-cols-1 items-center gap-2 border-b border-edge px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-surface-2 md:grid-cols-[1fr_120px_140px_120px_64px]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium text-ink">{task.title}</p>
                  <p className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-3">
                    <span>Updated {timeAgo(task.updatedAt)}</span>
                    {task.points && <span>{task.points} pts</span>}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-ink-2 md:justify-start">
                  <span className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dot)} />
                  {statusMeta.label}
                </span>
                <span className="flex items-center gap-2 text-[12.5px] font-medium text-ink-2">
                  <Avatar name={member.name} gradient={member.gradient} size="xs" />
                  {member.name}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-ink-3">
                  <Clock className="h-3.5 w-3.5" />
                  {due.text}
                </span>
                <Badge dot={priority.dot} className="justify-self-start md:justify-self-end">
                  {priority.label}
                </Badge>
              </button>
            );
          })}
          {list.length === 0 && (
            <p className="py-10 text-center text-[13px] text-ink-3">
              No tasks in this view.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
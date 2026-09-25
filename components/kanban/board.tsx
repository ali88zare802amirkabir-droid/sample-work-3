"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { COLUMN_ORDER, taskStatusMeta } from "@/lib/data";
import type { TaskStatus } from "@/lib/types";
import { TaskCard } from "@/components/kanban/task-card";

export function Board({
  projectId,
  className,
}: {
  projectId?: string;
  className?: string;
}) {
  const { tasks, moveTask, pushToast, openNewTask } = useApp();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<TaskStatus | null>(null);

  const byColumn = (status: TaskStatus) => {
    const scoped = projectId
      ? tasks.filter((t) => t.projectId === projectId)
      : tasks;
    return scoped.filter((t) => t.status === status);
  };

  return (
    <div
      className={cn(
        "no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-3 pt-1",
        className
      )}
    >
      {COLUMN_ORDER.map((status) => {
        const meta = taskStatusMeta[status];
        const list = byColumn(status);
        const active = overCol === status && dragId !== null;

        return (
          <section
            key={status}
            className={cn(
              "flex w-[280px] shrink-0 flex-col rounded-2xl border bg-surface/50 transition-colors duration-150",
              active
                ? "border-accent/50 bg-accent-soft/40"
                : "border-edge"
            )}
            onDragOver={(e) => {
              e.preventDefault();
              if (overCol !== status) setOverCol(status);
            }}
            onDragLeave={() => {
              if (overCol === status) setOverCol(null);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const id = dragId ?? e.dataTransfer.getData("text/plain");
              const task = tasks.find((t) => t.id === id);
              setDragId(null);
              setOverCol(null);
              if (!task || task.status === status) return;
              moveTask(task.id, status);
              pushToast(
                status === "done"
                  ? "Task completed"
                  : `Moved to ${meta.label}`,
                {
                  desc: task.title,
                  variant: status === "done" ? "success" : "info",
                }
              );
            }}
          >
            <header className="flex items-center justify-between px-3.5 pb-2 pt-3">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", meta.dot)} />
                <h3 className="text-[13px] font-semibold text-ink">{meta.label}</h3>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-ink-3">
                  {list.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  openNewTask({
                    projectId: projectId ?? "p-nexa",
                    status,
                  })
                }
                className="rounded-lg p-1 text-ink-3 transition-colors hover:bg-surface-2 hover:text-accent"
                aria-label={`Add task to ${meta.label}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </header>

            <div
              className={cn(
                "flex-1 space-y-2.5 overflow-y-auto px-3 pb-3 pt-0.5",
                active && "min-h-[80px]"
              )}
            >
              {list.map((task) => (
                <div
                  key={task.id}
                  onDragStart={() => setDragId(task.id)}
                  className={cn(
                    dragId === task.id && "opacity-40"
                  )}
                >
                  <TaskCard taskId={task.id} />
                </div>
              ))}
              {list.length === 0 && (
                <div
                  className={cn(
                    "flex h-24 items-center justify-center rounded-xl border border-dashed text-[12px] text-ink-3",
                    active ? "border-accent/40 bg-accent-soft/30" : "border-edge"
                  )}
                >
                  {active
                    ? "Drop here"
                    : "Drag a task here"}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
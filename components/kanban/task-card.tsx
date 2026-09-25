"use client";

import { useRef } from "react";
import { CheckSquare, Clock, MoreHorizontal } from "lucide-react";
import { cn, dueLabel, isOverdue } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { COLUMN_ORDER, getMember, getProject, priorityMeta, taskStatusMeta } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";

export function TaskCard({ taskId }: { taskId: string }) {
  const { tasks, openTask, moveTask, pushToast } = useApp();
  const draggedRef = useRef(false);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return null;

  const member = getMember(task.assigneeId);
  const project = getProject(task.projectId);
  const priority = priorityMeta[task.priority];
  const due = dueLabel(task.due);
  const overdue = isOverdue(task.due);
  const checked = task.checklist.filter((c) => c.done).length;

  return (
    <div
      draggable
      onDragStart={(e) => {
        draggedRef.current = true;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task.id);
      }}
      onDragEnd={() => {
        window.setTimeout(() => {
          draggedRef.current = false;
        }, 140);
      }}
      onClick={() => {
        if (draggedRef.current) return;
        openTask(task.id);
      }}
      className="card group cursor-pointer p-3.5 transition-all duration-150 hover:-translate-y-px hover:border-edge-strong hover:shadow-[var(--shadow-pop)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <span className={cn("h-1.5 w-1.5 rounded-full", priority.dot)} />
          <span className="text-[11px] font-medium text-ink-2">{priority.label}</span>
        </span>
        {task.label && (
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10.5px] font-medium text-accent">
            {task.label}
          </span>
        )}
      </div>

      <p className="mt-2 text-[13.5px] font-medium leading-snug text-ink transition-colors group-hover:text-accent">
        {task.title}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-ink-3">
          <span className="flex items-center gap-1 tabular-nums">
            <Clock className="h-3 w-3" />
            <span className={cn(overdue && "font-medium text-danger")}>{due.text}</span>
          </span>
          {task.checklist.length > 0 && (
            <span className="flex items-center gap-1 tabular-nums">
              <CheckSquare className="h-3 w-3" />
              {checked}/{task.checklist.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-ink-3">{project.name.split(" ")[0]}</span>
          <Avatar name={member.name} gradient={member.gradient} size="xs" />
          <Dropdown
            width="w-44"
            trigger={({ open: o, toggle }) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle();
                }}
                className={cn(
                  "rounded-md p-1 text-ink-3 transition-opacity hover:bg-surface-2 hover:text-ink lg:opacity-0 lg:group-hover:opacity-100",
                  o && "opacity-100"
                )}
                aria-label="Move task"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            )}
          >
            {({ close }) => (
              <>
                {COLUMN_ORDER.map((status) => {
                  const meta = taskStatusMeta[status];
                  const isCurrent = status === task.status;
                  return (
                    <DropdownItem
                      key={status}
                      active={isCurrent}
                      onClick={() => {
                        if (isCurrent) return;
                        moveTask(task.id, status);
                        pushToast(
                          status === "done"
                            ? "Task completed"
                            : `Moved to ${meta.label}`,
                          { desc: task.title, variant: status === "done" ? "success" : "info" }
                        );
                        close();
                      }}
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                      {meta.label}
                    </DropdownItem>
                  );
                })}
              </>
            )}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
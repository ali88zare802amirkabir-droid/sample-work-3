"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarClock } from "lucide-react";
import { useApp } from "@/lib/store";
import { getMember } from "@/lib/data";
import { cn, dueLabel } from "@/lib/utils";
import { AvatarStack } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressRing } from "@/components/ui/progress";

export function CurrentProject() {
  const { projects, tasks } = useApp();
  const project = projects[0];
  const members = project.memberIds.map((id) => getMember(id));
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const openTasks = projectTasks.filter((t) => t.status !== "done").length;
  const doneTasks = projectTasks.filter((t) => t.status === "done").length;
  const due = dueLabel(project.due);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="card group block overflow-hidden transition-all duration-200 hover:border-edge-strong hover:shadow-[var(--shadow-pop)]"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-lg",
                project.gradient
              )}
            >
              {project.name[0]}
            </div>
            <div>
              <h3 className="font-display text-[15px] font-semibold text-ink">
                {project.name}
              </h3>
              <p className="text-[12px] text-ink-3">{project.tag}</p>
            </div>
          </div>
          <span className="rounded-full bg-accent-soft p-1.5 text-accent transition-transform duration-200 group-hover:translate-x-0.5">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
          {project.description}
        </p>

        <div className="mt-4 flex items-center gap-4">
          <ProgressRing value={project.progress} size={52} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium text-ink-2">Sprint progress</span>
              <span className="font-display font-bold text-ink">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="mt-1.5" />
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-ink-3">
              <span>
                {doneTasks} done · {openTasks} left
              </span>
              <span className="tabular-nums">26 / 32 points</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-edge pt-4">
          <div>
            <p className="mb-1.5 text-[11px] text-ink-3">Team</p>
            <AvatarStack members={members} max={5} />
          </div>
          <Badge
            tone={due.tone === "danger" ? "danger" : due.tone === "warn" ? "warn" : "neutral"}
          >
            <CalendarClock className="h-3 w-3" />
            Due {due.text}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
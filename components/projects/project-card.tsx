"use client";

import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { getMember, projectStatusMeta } from "@/lib/data";
import type { Project } from "@/lib/types";
import { AvatarStack } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressRing } from "@/components/ui/progress";

export function ProjectCard({ project }: { project: Project }) {
  const { tasks } = useApp();
  const team = project.memberIds.map((id) => getMember(id));
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const open = projectTasks.filter((t) => t.status !== "done").length;
  const done = projectTasks.filter((t) => t.status === "done").length;
  const status = projectStatusMeta[project.status];

  return (
    <Link
      href={`/projects/${project.id}`}
      className="card group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-edge-strong hover:shadow-[var(--shadow-pop)]"
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-lg",
            project.gradient
          )}
        >
          {project.name[0]}
        </div>
        <Badge
          tone={status.tone === "ok" ? "ok" : status.tone === "danger" ? "danger" : "info"}
        >
          {status.label}
        </Badge>
      </div>

      <h3 className="font-display mt-3 text-[15px] font-semibold text-ink transition-colors group-hover:text-accent">
        {project.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
        {project.description}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <ProgressRing value={project.progress} size={40} stroke={3.5} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-ink-2">Progress</span>
            <span className="font-display font-bold tabular-nums text-ink">
              {project.progress}%
            </span>
          </div>
          <Progress value={project.progress} className="mt-1.5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-edge pt-3.5">
        <div className="flex items-center gap-3 text-[12px] text-ink-3">
          <span className="tabular-nums">
            {open + done} tasks · {done} done
          </span>
        </div>
        <AvatarStack members={team} max={4} />
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-3">
        <span className="flex items-center gap-1">
          <CalendarClock className="h-3 w-3" />
          Updated {timeAgo(project.lastUpdated)}
        </span>
        <span className="font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
          Open project →
        </span>
      </div>
    </Link>
  );
}
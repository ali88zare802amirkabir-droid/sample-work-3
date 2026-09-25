"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  FileText,
  KanbanSquare,
  ListTodo,
  Activity as ActivityIcon,
} from "lucide-react";
import { cn, dueLabel, fmtDate, timeAgo } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { getMember, projectStatusMeta } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { Board } from "@/components/kanban/board";
import { TaskList } from "@/components/projects/task-list";
import { SprintChart } from "@/components/dashboard/sprint-chart";
import { ActivityRow } from "@/components/activity/activity-row";

type Tab = "overview" | "board" | "tasks" | "activity";

const TABS: Array<{ key: Tab; label: string; icon: typeof FileText }> = [
  { key: "overview", label: "Overview", icon: FileText },
  { key: "board", label: "Board", icon: KanbanSquare },
  { key: "tasks", label: "Tasks", icon: ListTodo },
  { key: "activity", label: "Activity", icon: ActivityIcon },
];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  return <ProjectDetail key={params.id} projectId={params.id} />;
}

function ProjectDetail({ projectId }: { projectId: string }) {
  const { projects, tasks, activities } = useApp();
  const [tab, setTab] = useState<Tab>("overview");
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="card flex flex-col items-center gap-2 py-20 text-center">
        <p className="text-sm font-medium text-ink">Project not found</p>
        <Link href="/projects" className="text-[13px] text-accent hover:underline">
          ← Back to projects
        </Link>
      </div>
    );
  }

  const team = project.memberIds.map((id) => getMember(id));
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const open = projectTasks.filter((t) => t.status !== "done").length;
  const done = projectTasks.filter((t) => t.status === "done").length;
  const status = projectStatusMeta[project.status];
  const projectActivity = activities
    .filter((a) => a.projectId === project.id)
    .sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="space-y-5">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-3 transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to projects
      </Link>

      {/* Header */}
      <div className="card overflow-hidden">
        <div
          className={cn(
            "h-20 w-full bg-gradient-to-r opacity-90",
            project.gradient
          )}
        />
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "-mt-14 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-4 border-[var(--surface)] bg-gradient-to-br text-2xl font-bold text-white shadow-lg",
                project.gradient
              )}
            >
              {project.name[0]}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-lg font-semibold text-ink">
                  {project.name}
                </h2>
                <Badge
                  tone={
                    status.tone === "ok"
                      ? "ok"
                      : status.tone === "danger"
                        ? "danger"
                        : "info"
                  }
                >
                  {status.label}
                </Badge>
              </div>
              <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-ink-2">
                {project.description}
              </p>
              <p className="mt-2 text-[11.5px] text-ink-3">
                Started {fmtDate(project.start)} · Updated {timeAgo(project.lastUpdated)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-display text-lg font-bold tabular-nums text-ink">
                {project.progress}%
              </p>
              <p className="text-[11px] text-ink-3">Complete</p>
            </div>
            <ProgressRing value={project.progress} size={56} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 flex gap-1 rounded-xl border border-edge bg-surface/80 p-1 backdrop-blur-xl">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-[12.5px] font-medium transition-all duration-150",
                active
                  ? "bg-surface-3 text-ink shadow-sm"
                  : "text-ink-3 hover:text-ink-2"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
              {t.key === "tasks" && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums",
                    active ? "bg-accent-soft text-accent" : "bg-surface-2 text-ink-3"
                  )}
                >
                  {projectTasks.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      {tab === "overview" && (
        <div className="grid gap-4 lg:grid-cols-3 animate-fade-in">
          <div className="flex h-fit flex-col gap-4 lg:col-span-2">
            <div className="card p-5">
              <h3 className="text-[13px] font-semibold text-ink">Sprint progress</h3>
              <div className="mt-3 flex items-center gap-4">
                <ProgressRing value={project.progress} size={72} stroke={5} />
                <div className="flex-1 space-y-2.5">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-ink-2">Overall completion</span>
                    <span className="font-display font-bold text-ink">
                      {project.progress}%
                    </span>
                  </div>
                  <Progress value={project.progress} />
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="rounded-xl bg-surface-2 p-3">
                      <p className="font-display text-base font-bold tabular-nums text-ink">
                        {open}
                      </p>
                      <p className="text-[11px] text-ink-3">Open tasks</p>
                    </div>
                    <div className="rounded-xl bg-surface-2 p-3">
                      <p className="font-display text-base font-bold tabular-nums text-ok">
                        {done}
                      </p>
                      <p className="text-[11px] text-ink-3">Completed</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                <CalendarClock className="h-4 w-4 text-accent" />
                Key dates
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-edge bg-surface-2/50 p-3">
                  <p className="text-[11px] text-ink-3">Project start</p>
                  <p className="mt-0.5 text-[13px] font-medium text-ink">
                    {fmtDate(project.start)}
                  </p>
                </div>
                <div className="rounded-xl border border-edge bg-surface-2/50 p-3">
                  <p className="text-[11px] text-ink-3">Project end</p>
                  <p
                    className={cn(
                      "mt-0.5 text-[13px] font-medium",
                      dueLabel(project.due).tone === "danger"
                        ? "text-danger"
                        : "text-ink"
                    )}
                  >
                    {fmtDate(project.due)}
                  </p>
                </div>
                <div className="rounded-xl border border-edge bg-surface-2/50 p-3">
                  <p className="text-[11px] text-ink-3">Next milestone</p>
                  <p className="mt-0.5 text-[13px] font-medium text-accent">
                    {dueLabel(project.due).text}
                  </p>
                </div>
              </div>
            </div>

            <SprintChart projectId={project.id} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <h3 className="text-[13px] font-semibold text-ink">Team</h3>
              <div className="mt-4 space-y-3">
                {team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <Avatar
                      name={member.name}
                      gradient={member.gradient}
                      size="sm"
                      online={member.status === "online"}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-ink">
                        {member.name}
                      </p>
                      <p className="truncate text-[11px] text-ink-3">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "board" && (
        <div className="animate-fade-in">
          <Board projectId={project.id} />
        </div>
      )}

      {tab === "tasks" && (
        <div className="animate-fade-in">
          <TaskList projectId={project.id} />
        </div>
      )}

      {tab === "activity" && (
        <div className="card animate-fade-in p-5">
          <div className="flex flex-col gap-4">
            {projectActivity.length > 0 ? (
              projectActivity.slice(0, 12).map((a) => <ActivityRow key={a.id} id={a.id} />)
            ) : (
              <p className="py-8 text-center text-[13px] text-ink-3">
                No activity for this project yet.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Layers,
  MessageSquare,
  TrendingUp,
  UserPlus,
  ArrowRightCircle,
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { getMember, getProject } from "@/lib/data";
import type { ActivityKind } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";

const meta: Record<
  ActivityKind,
  { icon: typeof Layers; tone: string; ring: string }
> = {
  "task-moved": {
    icon: ArrowRightCircle,
    tone: "text-accent",
    ring: "bg-accent-soft",
  },
  "task-completed": { icon: CheckCircle2, tone: "text-ok", ring: "bg-ok/10" },
  "task-created": { icon: Layers, tone: "text-info", ring: "bg-info/10" },
  comment: { icon: MessageSquare, tone: "text-warn", ring: "bg-warn/10" },
  progress: { icon: TrendingUp, tone: "text-cyan", ring: "bg-cyan/10" },
  member: { icon: UserPlus, tone: "text-violet-400", ring: "bg-violet-400/10" },
};

export function ActivityRow({ id }: { id: string }) {
  const { activities } = useApp();
  const item = activities.find((a) => a.id === id);
  if (!item) return null;
  const actor = getMember(item.actorId);
  const project = getProject(item.projectId);
  const m = meta[item.kind];
  const Icon = m.icon;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex gap-3 rounded-lg transition-colors hover:bg-surface-2/60"
    >
      <div className="relative flex flex-col items-center">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-edge",
            m.ring
          )}
        >
          <Icon className={cn("h-4 w-4", m.tone)} />
        </span>
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <p className="text-[13px] leading-snug text-ink">
          <span className="font-semibold">{actor.name}</span>{" "}
          <span className="text-ink-2">{item.text}</span>
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-3">
          <Avatar name={actor.name} gradient={actor.gradient} size="xs" />
          {timeAgo(item.at)} · <span className="text-accent group-hover:underline">{project.name}</span>
        </p>
      </div>
    </Link>
  );
}
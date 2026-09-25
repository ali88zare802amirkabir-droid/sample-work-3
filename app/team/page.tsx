"use client";

import { useState } from "react";
import { Mail, MessageSquare, UserPlus, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const statusMeta = {
  online: { label: "Online", dot: "bg-ok", tone: "ok" as const },
  away: { label: "Away", dot: "bg-warn", tone: "warn" as const },
  offline: { label: "Offline", dot: "bg-ink-3", tone: "neutral" as const },
};

export default function TeamPage() {
  const { members, tasks, projects, pushToast } = useApp();
  const [filter, setFilter] = useState<"all" | "online" | "away" | "offline">("all");

  const filtered = members.filter((m) => filter === "all" || m.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-xl border border-edge bg-surface-2/60 p-1 w-fit">
          {(["all", "online", "away", "offline"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[12.5px] font-medium capitalize transition-colors",
                filter === f
                  ? "bg-surface text-ink shadow-sm"
                  : "text-ink-3 hover:text-ink-2"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <Button
          variant="primary"
          onClick={() =>
            pushToast("Invite sent", {
              desc: "A demo invite link was generated.",
            })
          }
        >
          <UserPlus className="h-4 w-4" /> Invite member
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member, i) => {
          const sm = statusMeta[member.status];
          const openTasks = tasks.filter(
            (t) => t.assigneeId === member.id && t.status !== "done"
          );
          const doneTasks = tasks.filter(
            (t) => t.assigneeId === member.id && t.status === "done"
          );
          const memberProjects = projects.filter((p) =>
            p.memberIds.includes(member.id)
          );

          return (
            <div
              key={member.id}
              className={cn("card group flex flex-col p-5 transition-all duration-200 hover:shadow-[var(--shadow-pop)]", "animate-rise")}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-start justify-between">
                <Avatar
                  name={member.name}
                  gradient={member.gradient}
                  size="xl"
                  online={member.status === "online"}
                />
                <Badge tone={sm.tone} dot={sm.dot}>
                  <Wifi className="h-3 w-3" />
                  {sm.label}
                </Badge>
              </div>

              <h3 className="font-display mt-3 text-[15px] font-semibold text-ink">
                {member.name}
              </h3>
              <p className="text-[12px] font-medium text-accent">{member.role}</p>
              <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-2">
                {member.bio}
              </p>

              <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-3">
                <Mail className="h-3 w-3" />
                <span className="truncate">{member.email}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface-2 p-3">
                  <p className="font-display text-base font-bold tabular-nums text-ink">
                    {openTasks.length}
                  </p>
                  <p className="text-[11px] text-ink-3">Assigned</p>
                </div>
                <div className="rounded-xl bg-surface-2 p-3">
                  <p className="font-display text-base font-bold tabular-nums text-ok">
                    {doneTasks.length}
                  </p>
                  <p className="text-[11px] text-ink-3">Completed</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {memberProjects.map((p) => (
                  <span
                    key={p.id}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border border-edge bg-bg-soft px-2 py-0.5 text-[11px] font-medium text-ink-2"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full bg-gradient-to-br", p.gradient)} />
                    {p.name}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-2 border-t border-edge pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    pushToast(`Message sent to ${member.name}`, {
                      desc: "Demo message — nothing really sent.",
                      variant: "info",
                    })
                  }
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Message
                </Button>
                {member.id !== "m-ali" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => pushToast(`Reminder sent to ${member.name}`, {
                      variant: "info",
                    })}
                  >
                    Remind
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
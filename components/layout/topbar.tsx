"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Menu, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn, timeAgo } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { getProject } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { GlobalSearch } from "@/components/layout/global-search";
import type { LucideIcon } from "lucide-react";

function usePageTitle() {
  const pathname = usePathname();
  if (pathname === "/") return { title: "Dashboard", subtitle: "Your workspace at a glance" };
  if (pathname === "/projects")
    return { title: "Projects", subtitle: "Everything the team is building" };
  if (pathname === "/board")
    return { title: "Tasks", subtitle: "Drag work across the board" };
  const match = pathname.match(/^\/projects\/(.+)$/);
  if (match) {
    const project = getProject(match[1]);
    return { title: project.name, subtitle: project.description };
  }
  if (pathname === "/team") return { title: "Team", subtitle: "The people shipping NexaBoard" };
  if (pathname === "/activity")
    return { title: "Activity", subtitle: "What happened across the workspace" };
  if (pathname === "/settings")
    return { title: "Settings", subtitle: "Manage your workspace preferences" };
  return { title: "NexaBoard", subtitle: "" };
}

interface NotificationGroup {
  id: string;
  icon: LucideIcon;
  tone: string;
  title: string;
  desc: string;
  time: string;
}

const seedNotifications: NotificationGroup[] = [
  {
    id: "n1",
    icon: Plus,
    tone: "text-info",
    title: "New task assigned to you",
    desc: "Design the onboarding flow · Nexa Mobile App",
    time: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: "n2",
    icon: Bell,
    tone: "text-warn",
    title: "Deadline approaching",
    desc: "Stripe payment integration is due tomorrow",
    time: new Date(Date.now() - 5 * 3600_000).toISOString(),
  },
  {
    id: "n3",
    icon: Bell,
    tone: "text-ok",
    title: "Sara mentioned you",
    desc: "“pm check on the onboarding spec when you can”",
    time: new Date(Date.now() - 26 * 3600_000).toISOString(),
  },
];

export function Topbar() {
  const { title, subtitle } = usePageTitle();
  const { setMobileNavOpen, openNewTask } = useApp();
  const [read, setRead] = useState<Record<string, boolean>>({});
  const unread = seedNotifications.filter((n) => !read[n.id]).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-edge bg-[color-mix(in_srgb,var(--bg)_72%,transparent)] px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={() => setMobileNavOpen(true)}
        className="rounded-xl border border-edge bg-surface-2 p-2 text-ink-2 transition-colors hover:text-ink lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>

      <div className="hidden min-w-0 md:block">
        <h1 className="font-display truncate text-[15px] font-semibold text-ink">
          {title}
        </h1>
        <p className="hidden truncate text-[12px] text-ink-3 sm:block">{subtitle}</p>
      </div>

      <div className="flex-1" />

      <GlobalSearch />

      <Dropdown
        align="right"
        width="w-80"
        trigger={({ open, toggle }) => (
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "relative rounded-xl border p-2 text-ink-2 transition-colors",
              open
                ? "border-accent/40 bg-accent-soft text-accent"
                : "border-edge bg-surface-2 hover:text-ink"
            )}
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
        )}
      >
        {({ close }) => (
          <div>
            <div className="flex items-center justify-between px-2.5 py-1.5">
              <p className="text-[13px] font-semibold text-ink">Notifications</p>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const all: Record<string, boolean> = {};
                    seedNotifications.forEach((n) => (all[n.id] = true));
                    setRead(all);
                  }}
                  className="flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
                >
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="mt-1 space-y-0.5">
              {seedNotifications.map((n) => {
                const Icon = n.icon;
                const isRead = read[n.id];
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => setRead((prev) => ({ ...prev, [n.id]: true }))}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-surface-2",
                      !isRead && "bg-surface-2/60"
                    )}
                  >
                    <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", n.tone)} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[13px] font-medium text-ink">
                          {n.title}
                        </span>
                        {!isRead && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        )}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-ink-2">
                        {n.desc}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-3">
                        {timeAgo(n.time)}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-1 border-t border-edge px-1 pt-1">
              <Link
                href="/activity"
                onClick={close}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
              >
                View all activity
              </Link>
            </div>
          </div>
        )}
      </Dropdown>

      <Button
        variant="primary"
        size="sm"
        onClick={() => openNewTask({ projectId: "p-nexa", status: "todo" })}
        className="hidden sm:inline-flex"
      >
        <Plus className="h-4 w-4" /> New Task
      </Button>
      <Button
        variant="primary"
        size="icon-sm"
        onClick={() => openNewTask({ projectId: "p-nexa", status: "todo" })}
        className="sm:hidden"
        aria-label="New task"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </header>
  );
}
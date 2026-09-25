"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity as ActivityIcon,
  ChevronsLeft,
  ChevronsRight,
  FolderKanban,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { projects } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/board", label: "Tasks", icon: KanbanSquare },
  { href: "/team", label: "Team", icon: Users },
  { href: "/activity", label: "Activity", icon: ActivityIcon },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  collapsed,
  onToggle,
  mobile,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const { tasks, members } = useApp();
  const openCount = tasks.filter((t) => t.status !== "done").length;
  const user = members[0];

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "flex h-full flex-col transition-[width] duration-200 ease-out",
        mobile ? "w-[264px]" : collapsed ? "w-[68px]" : "w-[236px]"
      )}
    >
      <div className="flex h-full flex-col rounded-r-2xl border-r border-edge bg-surface/70 backdrop-blur-xl">
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_4px_16px_-4px_rgba(56,189,248,0.6)]">
              <span className="font-display text-sm font-bold text-white">N</span>
              <span className="absolute -right-1 -bottom-1 h-3 w-3 rounded-md border-2 border-[var(--surface)] bg-gradient-to-br from-violet-500 to-fuchsia-400" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-display truncate text-[15px] font-semibold text-ink">
                  NexaBoard
                </p>
                <p className="truncate text-[11px] text-ink-3">Workspace</p>
              </div>
            )}
          </div>
          {mobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="ml-auto rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Close navigation"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={onCloseMobile}
                title={collapsed && !mobile ? label : undefined}
                className={cn(
                  "group relative flex h-9.5 items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-150",
                  collapsed && !mobile && "justify-center px-0",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-r-full bg-accent transition-all duration-150",
                    active ? "opacity-100" : "opacity-0"
                  )}
                />
                <span
                  className={cn(
                    "flex items-center gap-3 px-3",
                    collapsed && !mobile ? "px-0" : "px-1"
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {(!collapsed || mobile) && <span className="flex-1 truncate">{label}</span>}
                  {(!collapsed || mobile) && href === "/board" && openCount > 0 && (
                    <span className="rounded-full bg-surface-3 px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-ink-2">
                      {openCount}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Projects quick links */}
        {(!collapsed || mobile) && (
          <div className="px-3 pb-1">
            <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wider text-ink-3">
              Projects
            </p>
            <div className="space-y-0.5">
              {projects.map((project) => {
                const active = pathname === `/projects/${project.id}`;
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    onClick={onCloseMobile}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12.5px] font-medium transition-colors",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full bg-gradient-to-br",
                        project.gradient
                      )}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* User */}
        <div className="shrink-0 border-t border-edge p-3">
          {collapsed && !mobile ? (
            <button
              type="button"
              onClick={onToggle}
              className="flex w-full justify-center rounded-xl py-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              <ChevronsRight className="h-4.5 w-4.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5 rounded-xl p-1">
              <Avatar
                name={user.name}
                gradient={user.gradient}
                size="md"
                online={user.status === "online"}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">
                  {user.name}
                </p>
                <p className="flex items-center gap-1 truncate text-[11px] text-ok">
                  <span className="h-1.5 w-1.5 rounded-full bg-ok" />
                  Online
                </p>
              </div>
              <button
                type="button"
                onClick={onToggle}
                className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
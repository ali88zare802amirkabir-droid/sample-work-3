"use client";

import { useEffect, useRef, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { getProject, getMember, taskStatusMeta } from "@/lib/data";
import { Avatar } from "@/components/ui/avatar";

export function GlobalSearch() {
  const { tasks, openTask } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed
    ? tasks
        .filter((t) =>
          `${t.title} ${t.description} ${t.label ?? ""} ${getMember(t.assigneeId).name}`
            .toLowerCase()
            .includes(trimmed)
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (id: string) => {
    openTask(id);
    setQuery("");
    setOpen(false);
    setMobileOpen(false);
  };

  const input = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search tasks, labels, people…"
        className="h-9 w-full rounded-xl border border-edge bg-bg-soft pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-3 transition-colors focus:border-accent/50 focus:bg-surface focus:outline-none"
        aria-label="Search"
      />
    </div>
  );

  const panel = open && (
    <div className="glass absolute left-0 right-0 top-11 z-40 overflow-hidden rounded-xl p-1.5 shadow-[var(--shadow-pop)] animate-scale-in">
      {results.length > 0 ? (
        <>
          {results.map((task) => {
            const project = getProject(task.projectId);
            const member = getMember(task.assigneeId);
            const meta = taskStatusMeta[task.status];
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => pick(task.id)}
                className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-surface-2"
              >
                <span
                  className={cn("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-ink">
                    {task.title}
                  </span>
                  <span className="block truncate text-[11px] text-ink-3">
                    {project.name} · {meta.label}
                  </span>
                </span>
                <Avatar
                  name={member.name}
                  gradient={member.gradient}
                  size="xs"
                />
              </button>
            );
          })}
        </>
      ) : (
        <div className="flex items-center gap-2.5 px-3 py-3 text-[13px] text-ink-2">
          <SearchX className="h-4 w-4 text-ink-3" />
          No tasks match &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );

  return (
    <div ref={ref} className="relative">
      <div className="hidden md:block">
        <div className="w-64 lg:w-72">{input}</div>
        {panel}
      </div>

      {/* Mobile */}
      <button
        type="button"
        onClick={() => setMobileOpen((v) => !v)}
        className="rounded-xl border border-edge bg-surface-2 p-2 text-ink-2 transition-colors hover:text-ink md:hidden"
        aria-label="Open search"
      >
        <Search className="h-4.5 w-4.5" />
      </button>
      {mobileOpen && (
        <div className="fixed inset-x-3 top-16 z-50 md:hidden">
          <div className="glass rounded-2xl p-3 shadow-[var(--shadow-pop)] animate-rise">
            {input}
            <div className="mt-2">{panel}</div>
          </div>
        </div>
      )}
    </div>
  );
}
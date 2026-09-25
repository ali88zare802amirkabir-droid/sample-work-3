"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { ProjectCard } from "@/components/projects/project-card";
import { Input } from "@/components/ui/input";
import type { ProjectStatus } from "@/lib/types";

const FILTERS: Array<{ key: ProjectStatus | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "active", label: "On track" },
  { key: "at-risk", label: "At risk" },
  { key: "completed", label: "Completed" },
];

export default function ProjectsPage() {
  const { projects } = useApp();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");

  const filtered = projects.filter((p) => {
    const matchStatus = filter === "all" || p.status === filter;
    const matchQuery = p.name.toLowerCase().includes(query.trim().toLowerCase());
    return matchStatus && matchQuery;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-ink-3" />
          <div className="flex flex-wrap gap-1 rounded-xl border border-edge bg-surface-2/60 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                  filter === f.key
                    ? "bg-surface text-ink shadow-sm"
                    : "text-ink-3 hover:text-ink-2"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="animate-rise"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Search className="h-6 w-6 text-ink-3" />
          <p className="text-sm font-medium text-ink">No projects match your filters</p>
          <p className="text-[13px] text-ink-3">Try a different search term or status.</p>
        </div>
      )}
    </div>
  );
}
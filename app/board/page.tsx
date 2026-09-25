"use client";

import { Info } from "lucide-react";
import { useApp } from "@/lib/store";
import { Board } from "@/components/kanban/board";

export default function BoardPage() {
  const { tasks } = useApp();
  const count = tasks.filter((t) => t.status !== "done").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl border border-info/15 bg-info/10 px-3.5 py-2.5 text-[12.5px] text-info">
        <Info className="h-4 w-4 shrink-0" />
        <span>
          <strong>{count} open tasks</strong> across {new Set(tasks.map((t) => t.projectId)).size}{" "}
          projects. Drag cards between columns — or use the ··· menu on touch screens.
        </span>
      </div>
      <Board />
    </div>
  );
}
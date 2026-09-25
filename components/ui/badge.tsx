import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-surface-2 text-ink-2 border-edge",
  accent: "bg-accent-soft text-accent border-accent/15",
  ok: "bg-ok/10 text-ok border-ok/15",
  warn: "bg-warn/10 text-warn border-warn/15",
  danger: "bg-danger/10 text-danger border-danger/15",
  info: "bg-info/10 text-info border-info/15",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({
  children,
  tone = "neutral",
  dot,
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />}
      {children}
    </span>
  );
}
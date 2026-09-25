export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(" ");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function timeAgo(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}m ago`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  const days = hours / 24;
  if (days < 7) return `${Math.floor(days)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export type DueTone = "danger" | "warn" | "muted" | "ok";

export function dueLabel(dateStr: string): { text: string; tone: DueTone } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(`${dateStr}T00:00:00`);
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { text: "Overdue", tone: "danger" };
  if (diff === 0) return { text: "Today", tone: "warn" };
  if (diff === 1) return { text: "Tomorrow", tone: "warn" };
  if (diff <= 7) return { text: `In ${diff} days`, tone: "muted" };
  return {
    text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    tone: "muted",
  };
}

export function isOverdue(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${dateStr}T00:00:00`).getTime() < today.getTime();
}

export function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
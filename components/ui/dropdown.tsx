"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children:
    | ReactNode
    | ((props: { close: () => void }) => ReactNode);
  align?: "left" | "right";
  width?: string;
  className?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  width = "w-56",
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {trigger({ open, toggle })}
      {open && (
        <div
          className={cn(
            "glass absolute z-50 mt-1.5 overflow-hidden rounded-xl p-1.5 shadow-[var(--shadow-pop)] animate-scale-in origin-top",
            align === "right" ? "right-0" : "left-0",
            width
          )}
        >
          {typeof children === "function" ? children({ close }) : children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onClick,
  icon,
  active,
  danger,
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors",
        danger
          ? "text-danger hover:bg-danger/10"
          : active
            ? "bg-accent-soft text-accent"
            : "text-ink-2 hover:bg-surface-2 hover:text-ink"
      )}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {active && (
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      )}
    </button>
  );
}
"use client";

import { useCallback, useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  title?: ReactNode;
  className?: string;
}

const sizeClass = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

export function Modal({ open, onClose, children, size = "md", title, className }: ModalProps) {
  if (!open) return null;
  return <OpenModal onClose={onClose} size={size} title={title} className={className}>{children}</OpenModal>;
}

function OpenModal({
  onClose,
  children,
  size = "md",
  title,
  className,
}: {
  onClose: () => void;
  children: ReactNode;
  size: Exclude<ModalProps["size"], undefined>;
  title?: ReactNode;
  className?: string;
}) {
  const [closing, setClosing] = useState(false);

  const requestClose = useCallback(() => {
    setClosing((c) => {
      if (c) return c;
      window.setTimeout(onClose, 130);
      return true;
    });
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [requestClose]);

  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div
        className={cn(
          "absolute inset-0 bg-black/55 backdrop-blur-[3px]",
          closing ? "animate-fade-out" : "animate-fade-in"
        )}
        onClick={requestClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 max-h-[92vh] w-full overflow-hidden rounded-t-2xl border border-edge bg-surface shadow-[var(--shadow-pop)] sm:rounded-2xl",
          sizeClass[size],
          closing ? "animate-fade-out" : "animate-rise",
          className
        )}
        onClick={stop}
      >
        {title && (
          <div className="flex items-center justify-between gap-4 border-b border-edge px-5 py-3.5">
            <div className="text-sm font-semibold text-ink">{title}</div>
            <button
              type="button"
              onClick={requestClose}
              className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
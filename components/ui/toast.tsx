"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

const icons = {
  success: CheckCircle2,
  info: Info,
  danger: XCircle,
};

export function ToastHost() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[min(90vw,360px)] flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.variant];
        return (
          <div
            key={toast.id}
            className={cn(
              "glass pointer-events-auto flex items-start gap-3 rounded-xl p-3.5 shadow-[var(--shadow-pop)] animate-toast-in",
              toast.variant === "success" && "border-ok/20",
              toast.variant === "danger" && "border-danger/20",
              toast.variant === "info" && "border-info/20"
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 h-4.5 w-4.5 shrink-0",
                toast.variant === "success" && "text-ok",
                toast.variant === "danger" && "text-danger",
                toast.variant === "info" && "text-info"
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{toast.title}</p>
              {toast.desc && (
                <p className="mt-0.5 text-[13px] leading-snug text-ink-2">
                  {toast.desc}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="rounded-md p-0.5 text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Dismiss notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
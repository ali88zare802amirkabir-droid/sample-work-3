"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "soft";
export type ButtonSize = "sm" | "md" | "icon" | "icon-sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium whitespace-nowrap transition-all duration-150 select-none active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-b from-[var(--accent)] to-[color-mix(in_srgb,var(--accent)_80%,var(--cyan))] text-white shadow-[0_4px_16px_-4px_color-mix(in_srgb,var(--accent)_55%,transparent)] hover:brightness-110 hover:shadow-[0_6px_20px_-4px_color-mix(in_srgb,var(--accent)_65%,transparent)]",
  secondary:
    "bg-surface-2 text-ink border border-edge hover:bg-surface-3 hover:border-edge-strong",
  ghost: "text-ink-2 hover:bg-surface-2 hover:text-ink",
  danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
  soft: "text-accent bg-accent-soft hover:brightness-110",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-[13px] rounded-lg",
  md: "h-9.5 px-4 text-sm rounded-xl",
  icon: "h-10 w-10 rounded-xl",
  "icon-sm": "h-8 w-8 rounded-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "secondary", size = "md", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
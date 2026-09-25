import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  gradient: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  online?: boolean;
  ring?: boolean;
  className?: string;
}

const sizeMap = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
  xl: "h-14 w-14 text-base",
};

export function Avatar({
  name,
  gradient,
  size = "md",
  online,
  ring,
  className,
}: AvatarProps) {
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white shadow-sm",
          gradient,
          sizeMap[size],
          ring && "ring-2 ring-bg"
        )}
      >
        {initials(name)}
      </span>
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-bg",
            online ? "bg-ok" : "bg-ink-3"
          )}
        />
      )}
    </span>
  );
}

export function AvatarStack({
  members,
  max = 4,
  size = "sm",
}: {
  members: { name: string; gradient: string }[];
  max?: number;
  size?: AvatarProps["size"];
}) {
  const visible = members.slice(0, max);
  const rest = members.length - visible.length;
  return (
    <span className="flex -space-x-2">
      {visible.map((m, i) => (
        <Avatar key={i} name={m.name} gradient={m.gradient} size={size} ring />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-surface-3 text-[11px] font-semibold text-ink-2 ring-2 ring-bg",
            size === "sm" ? "h-7 w-7" : "h-8 w-8"
          )}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}
import { avatarTint, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-14 w-14 text-[18px]",
  xl: "h-20 w-20 text-[26px]",
} as const;

export interface AvatarProps {
  id: string;
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Deterministic initials avatar — no image upload, no remote assets. */
export function Avatar({ id, name, size = "md", className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[4px] font-semibold tracking-[0.04em] tabular",
        avatarTint(id),
        SIZES[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-card font-semibold uppercase tracking-[0.14em] transition-[background-color,color,border-color,opacity] duration-150 disabled:pointer-events-none disabled:opacity-50 aria-busy:opacity-70 select-none",
  {
    variants: {
      variant: {
        primary: "bg-press text-paper hover:bg-press-2 active:bg-press-2",
        outline: "border border-rule-2 bg-card text-ink hover:border-ink hover:bg-paper",
        ghost: "text-muted hover:bg-paper-2 hover:text-ink",
        danger: "bg-oxide text-white hover:brightness-90",
        quiet: "border border-transparent text-muted hover:text-ink hover:bg-paper-2",
      },
      size: {
        sm: "h-8 px-3 text-[10px]",
        md: "h-10 px-4 text-[11px]",
        lg: "h-12 px-6 text-[12px]",
        icon: "h-9 w-9 p-0 tracking-normal",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { buttonVariants };

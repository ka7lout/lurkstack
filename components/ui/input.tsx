import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-card border bg-card text-[15px] text-ink placeholder:text-faint transition-colors duration-150 outline-none disabled:opacity-60 disabled:cursor-not-allowed";

const fieldState =
  "border-rule-2 focus:border-press aria-[invalid=true]:border-oxide aria-[invalid=true]:focus:border-oxide";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, fieldState, "h-11 px-3.5", className)}
      {...props}
    />
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(fieldBase, fieldState, "min-h-24 resize-y px-3.5 py-3 leading-[1.55]", className)}
      {...props}
    />
  );
});

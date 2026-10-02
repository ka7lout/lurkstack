"use client";

import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AuthFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete: string;
  placeholder?: string;
}

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}: AuthFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {error ? <span className="label-xs text-oxide">Check this field</span> : null}
      </div>
      <div className="mt-1.5">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          invalid={Boolean(error)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-describedby={error ? errorId : undefined}
          className="h-12"
        />
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[13px] leading-snug text-oxide">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

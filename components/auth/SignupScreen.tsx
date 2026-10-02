"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, UserPlus } from "lucide-react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell, SignedInNotice } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { signUp } from "@/lib/auth-client";
import { useSession } from "@/lib/client-auth";
import { errorCopy, type ApiErrorCode } from "@/lib/errors";

type Phase = "idle" | "submitting" | "redirecting";

interface Fields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FieldErrors = Partial<Record<keyof Fields, string>>;

export function SignupScreen({ next = "/" }: { next?: string }) {
  const session = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [values, setValues] = useState<Fields>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<ApiErrorCode | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  const busy = phase === "submitting";

  function update(key: keyof Fields, value: string): void {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    setFormError(null);
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (values.name.trim().length < 2) errors.name = "Enter your name.";
    if (!values.email.trim()) errors.email = "Enter an email address.";
    else if (!values.email.includes("@")) errors.email = "That doesn't look like an email address.";
    if (values.password.length < 8) errors.password = "Use at least 8 characters.";
    if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords don't match.";
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (busy || phase === "redirecting") return;

    const errors = validate();
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setPhase("submitting");
    const { error } = await signUp.email({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password,
    });
    if (error) {
      setPhase("idle");
      if (error.status === 429) setFormError("rate_limited");
      else if (error.status === 422 || error.status === 409) setFormError("conflict");
      else setFormError("server");
      return;
    }
    setPhase("redirecting");
    toast({ title: "Account created", variant: "success" });
    router.push(next);
    router.refresh();
  }

  if (phase === "redirecting") {
    return (
      <AuthShell eyebrow="Account created" title="Welcome aboard." lede="Opening the feed…">
        <div className="rounded-card border border-press/30 bg-press-soft px-5 py-6">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-press">
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Your account is ready — redirecting…
          </p>
          <div className="mt-4 h-px w-full bg-press/20" aria-hidden="true">
            <div className="h-px w-1/2 animate-skeleton bg-press" />
          </div>
        </div>
      </AuthShell>
    );
  }

  if (session) {
    return (
      <AuthShell
        eyebrow="Already signed in"
        title="You have an open session."
        lede="Sign out from the account menu before creating a different account."
      >
        <SignedInNotice />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Create account"
      title="Open a line."
      lede="Register in seconds with a name, email and password."
    >
      <form onSubmit={(event) => void handleSubmit(event)} noValidate aria-busy={busy}>
        <div className="space-y-4">
          <AuthField
            id="signup-name"
            label="Name"
            value={values.name}
            onChange={(value) => update("name", value)}
            error={fieldErrors.name}
            autoComplete="name"
            placeholder="Jordan Reyes"
          />
          <AuthField
            id="signup-email"
            label="Email"
            type="email"
            value={values.email}
            onChange={(value) => update("email", value)}
            error={fieldErrors.email}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthField
            id="signup-password"
            label="Password"
            type="password"
            value={values.password}
            onChange={(value) => update("password", value)}
            error={fieldErrors.password}
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          <AuthField
            id="signup-confirm"
            label="Confirm password"
            type="password"
            value={values.confirmPassword}
            onChange={(value) => update("confirmPassword", value)}
            error={fieldErrors.confirmPassword}
            autoComplete="new-password"
            placeholder="Repeat it"
          />
        </div>

        {formError ? (
          <p
            role="alert"
            className="mt-4 rounded-card border border-oxide/30 bg-oxide-soft px-3.5 py-3 text-[13.5px] leading-snug text-oxide"
          >
            <span className="font-semibold">{errorCopy(formError).title}. </span>
            {errorCopy(formError).body}
          </p>
        ) : null}

        <Button type="submit" size="lg" className="mt-5 w-full" disabled={busy} aria-busy={busy || undefined}>
          {busy ? (
            <>
              <UserPlus className="h-4 w-4 animate-spin" strokeWidth={2.5} />
              Creating your account…
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" strokeWidth={2.5} />
              Create account
            </>
          )}
        </Button>

        <p className="mt-4 text-center text-[14px] text-muted">
          Already registered?{" "}
          <Link
            href="/login"
            className="font-semibold text-press underline underline-offset-4 hover:text-press-2"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

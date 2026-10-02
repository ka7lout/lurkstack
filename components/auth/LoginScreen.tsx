"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, LogIn } from "lucide-react";
import { AuthField } from "@/components/auth/AuthField";
import { AuthShell, SignedInNotice } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { signIn } from "@/lib/auth-client";
import { useSession } from "@/lib/client-auth";
import { errorCopy, type ApiErrorCode } from "@/lib/errors";

type Phase = "idle" | "submitting" | "redirecting";

export function LoginScreen({ next = "/" }: { next?: string }) {
  const session = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<ApiErrorCode | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  const busy = phase === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (busy || phase === "redirecting") return;

    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = "Enter the email address for your account.";
    else if (!email.includes("@")) errors.email = "That doesn't look like an email address.";
    if (!password) errors.password = "Enter your password.";
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setPhase("submitting");
    const { error } = await signIn.email({ email: email.trim(), password });
    if (error) {
      setPhase("idle");
      if (error.status === 429) setFormError("rate_limited");
      else if (error.status === 401 || error.status === 400) setFormError("invalid_credentials");
      else setFormError("server");
      return;
    }
    setPhase("redirecting");
    toast({ title: "Signed in", variant: "success" });
    router.push(next);
    router.refresh();
  }

  if (phase === "redirecting") {
    return (
      <AuthShell eyebrow="Signed in" title="You're in." lede="Opening the feed…">
        <div className="rounded-card border border-press/30 bg-press-soft px-5 py-6">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-press">
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Redirecting to the feed…
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
        lede="Sign out from the account menu if you want to switch accounts."
      >
        <SignedInNotice />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Sign in"
      title="Pick up the thread."
      lede="Sign in with your email and password to post, comment and react."
    >
      <form onSubmit={(event) => void handleSubmit(event)} noValidate aria-busy={busy}>
        <div className="space-y-4">
          <AuthField
            id="login-email"
            label="Email"
            type="email"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
              setFormError(null);
            }}
            error={fieldErrors.email}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthField
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setFieldErrors((prev) => ({ ...prev, password: undefined }));
              setFormError(null);
            }}
            error={fieldErrors.password}
            autoComplete="current-password"
            placeholder="••••••••"
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
              <LogIn className="h-4 w-4 animate-spin" strokeWidth={2.5} />
              Signing in…
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" strokeWidth={2.5} />
              Sign in
            </>
          )}
        </Button>

        <p className="mt-4 text-center text-[14px] text-muted">
          No account yet?{" "}
          <Link
            href="/signup"
            className="font-semibold text-press underline underline-offset-4 hover:text-press-2"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

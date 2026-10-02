import type { Metadata } from "next";
import { SignupScreen } from "@/components/auth/SignupScreen";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a LurkStack account to join the feed.",
};

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <SignupScreen next={next ?? "/"} />;
}

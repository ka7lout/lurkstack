import { notFound } from "next/navigation";
import { ProfileScreen } from "@/components/profile/ProfileScreen";
import { getCurrentUser } from "@/lib/session";
import { getProfile } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const viewer = await getCurrentUser();
  const profile = await getProfile(id, viewer?.id);
  if (!profile) notFound();

  return <ProfileScreen user={profile.user} initialPosts={profile.posts} />;
}

import { FeedScreen } from "@/components/feed/FeedScreen";
import { getCurrentUser } from "@/lib/session";
import { getFeed } from "@/lib/data/queries";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const user = await getCurrentUser();
  const posts = await getFeed(user?.id);

  return <FeedScreen initialPosts={posts} />;
}

import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import CreatePostForm from "@/components/features/community/CreatePostForm";
import DeletePostButton from "@/components/features/community/DeletePostButton";
import PostLikeButton from "@/components/features/community/PostLikeButton";
import PostComments from "@/components/features/community/PostComments";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community | BidJobs",
};

const gradients = [
  "bg-gradient-to-br from-primary to-secondary",
  "bg-gradient-to-br from-secondary to-tertiary",
  "bg-gradient-to-br from-tertiary to-primary",
  "bg-gradient-to-br from-primary to-tertiary",
  "bg-gradient-to-br from-secondary to-primary",
];

function Avatar({ name, gradient }: { name: string; gradient: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <div
      className={`rounded-full flex items-center justify-center text-on-primary font-bold text-sm shrink-0 ${gradient}`}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

function SmallAvatar({ name, gradient }: { name: string; gradient: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-on-primary font-bold text-xs shrink-0 ${gradient}`}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

export default async function CommunityPage() {
  const supabase = await createClient();

  let topContributors: any[] = [];
  let trendingTopics: [string, number][] = [];
  let currentProfile: any = null;
  let postsWithEngagement: any[] = [];

  try {
    // Fetch top contributors — users with the most completed contracts or reviews
    const { data: topUsers } = await supabase
      .from("users")
      .select("id, full_name, username, bio, user_type")
      .order("created_at", { ascending: true })
      .limit(5);

    // Get review counts for top users
    topContributors = await Promise.all(
      (topUsers || []).map(async (u, i) => {
        const { count } = await supabase
          .from("reviews")
          .select("*", { count: "exact", head: true })
          .eq("reviewee_id", u.id);
        return {
          ...u,
          reviewCount: count || 0,
          gradient: gradients[i % gradients.length],
        };
      })
    );
    topContributors.sort((a, b) => b.reviewCount - a.reviewCount);

    // Get distinct job categories for trending topics
    const { data: jobCategories } = await supabase
      .from("jobs")
      .select("category")
      .not("category", "is", null);

    const categoryCounts: Record<string, number> = {};
    jobCategories?.forEach((j) => {
      if (j.category) {
        categoryCounts[j.category] = (categoryCounts[j.category] || 0) + 1;
      }
    });
    trendingTopics = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Get current user for post form
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("auth_id", authUser.id)
        .single();
      currentProfile = data;
    }

    // Fetch community posts
    const { data: posts, error: postsError } = await supabase
      .from("community_posts")
      .select("id, content, created_at, user_id")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!postsError && posts) {
      // Fetch author info for posts
      const postUserIds = [...new Set((posts || []).map((p) => p.user_id))];
      const { data: authorsData } = await supabase
        .from("users")
        .select("id, full_name, username, avatar_url, user_type")
        .in("id", postUserIds);

      const authorsById: Record<number, any> = {};
      authorsData?.forEach((author) => {
        authorsById[author.id] = author;
      });

      // Fetch engagement for each post
      postsWithEngagement = await Promise.all(
        (posts || []).map(async (post) => {
          // Get like count
          const { count: likeCount } = await supabase
            .from("community_post_likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);

          // Check if current user liked this post
          let isLiked = false;
          if (currentProfile) {
            const { data: liked } = await supabase
              .from("community_post_likes")
              .select("id")
              .eq("post_id", post.id)
              .eq("user_id", currentProfile.id)
              .single();
            isLiked = !!liked;
          }

          // Get comments
          const { data: comments } = await supabase
            .from("community_post_comments")
            .select("id, content, created_at, user_id")
            .eq("post_id", post.id)
            .order("created_at", { ascending: true });

          // Fetch comment authors
          const commentUserIds = [...new Set((comments || []).map((c) => c.user_id))];
          const { data: commentAuthors } = await supabase
            .from("users")
            .select("id, full_name, avatar_url")
            .in("id", commentUserIds.length > 0 ? commentUserIds : [-1]);

          const commentAuthorsMap: Record<number, any> = {};
          commentAuthors?.forEach((author) => {
            commentAuthorsMap[author.id] = author;
          });

          return {
            ...post,
            author: authorsById[post.user_id],
            likeCount: likeCount || 0,
            isLiked,
            comments: (comments || []).map((c: any) => ({
              id: c.id,
              content: c.content,
              created_at: c.created_at,
              user_id: c.user_id,
              user: commentAuthorsMap[c.user_id],
            })),
          };
        })
      );
    }
  } catch (err) {
    console.error("Community page error:", err);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
      {/* Feed Header */}
      <header className="mb-12">
        <h1 className="font-headline text-5xl mb-4 text-on-surface">
          The Intelligence
        </h1>
        <p className="font-body text-on-surface-variant max-w-lg leading-relaxed">
          Exclusive insights and high-stakes conversations from the world&apos;s
          most elite digital architects and strategy leads.
        </p>
      </header>

      <div className="flex gap-10">
        {/* Main Feed */}
        <div className="flex-1 min-w-0">
          {/* Create Post Module */}
          {currentProfile ? (
            <CreatePostForm userName={currentProfile.full_name} />
          ) : (
            <div className="mb-12 bg-surface-container/60 backdrop-blur-xl rounded-xl p-6 border border-white/5 text-center">
              <p className="text-on-surface-variant font-body mb-3">Join the conversation</p>
              <Link
                href="/sign-in"
                className="inline-block px-6 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary transition-all rounded-full font-bold text-sm"
              >
                Sign in to post
              </Link>
            </div>
          )}

          {/* Feed Posts */}
          <div className="space-y-8">
            {postsWithEngagement && postsWithEngagement.length > 0 ? (
              postsWithEngagement.map((post, i) => {
                const author = post.author as any;
                const authorName = author?.full_name || author?.username || "Anonymous";
                const timeAgo = getTimeAgo(post.created_at);
                const isOwn = currentProfile?.id === post.user_id;

                return (
                  <article
                    key={post.id}
                    className="bg-surface-container/60 backdrop-blur-xl rounded-xl overflow-hidden border border-white/5"
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                          {author?.avatar_url ? (
                            <img
                              src={author.avatar_url}
                              alt={authorName}
                              className="w-14 h-14 rounded-full object-cover border-2 border-primary/30"
                            />
                          ) : (
                            <Avatar
                              name={authorName}
                              gradient={`w-14 h-14 ${gradients[i % gradients.length]} border-2 border-primary/30`}
                            />
                          )}
                          <div>
                            <h3 className="font-headline text-xl text-primary">
                              {authorName}
                            </h3>
                            <span className="text-xs text-neutral-500 font-body">
                              {author?.user_type === "employer" ? "Employer" : "Professional"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-neutral-600 font-body text-sm">{timeAgo}</span>
                          {isOwn && <DeletePostButton postId={post.id} />}
                        </div>
                      </div>
                      <p className="font-body text-lg text-on-surface/90 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>

                      {/* Engagement Section */}
                      <div className="flex items-center gap-8 mt-8 pt-6 border-t border-white/5">
                        {currentProfile && (
                          <PostLikeButton
                            postId={post.id}
                            initialLikeCount={post.likeCount}
                            isLiked={post.isLiked}
                          />
                        )}
                        <div className="text-xs text-neutral-500 font-body">
                          {post.comments.length} Comment
                          {post.comments.length !== 1 ? "s" : ""}
                        </div>
                      </div>

                      {/* Comments Section */}
                      {currentProfile && (
                        <PostComments
                          postId={post.id}
                          initialComments={post.comments}
                          currentUserId={currentProfile.id}
                        />
                      )}
                    </div>
                  </article>
                );
              })
            ) : (
              <article className="bg-surface-container/60 backdrop-blur-xl rounded-xl overflow-hidden border border-white/5">
                <div className="p-8 text-center py-16">
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-primary text-4xl">
                      forum
                    </span>
                  </div>
                  <h3 className="font-headline text-3xl font-bold text-on-surface mb-4">
                    No posts yet
                  </h3>
                  <p className="font-body text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Be the first to share an insight with the community.
                  </p>
                </div>
              </article>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28">
            <div className="mb-10">
              <h4 className="font-headline text-primary text-sm uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">
                Trending Categories
              </h4>
              <div className="space-y-6">
                {trendingTopics.length > 0 ? (
                  trendingTopics.map(([category, count], i) => (
                    <div key={category}>
                      <span className="text-xs text-neutral-500 font-body">
                        {String(i + 1).padStart(2, "0")} / {category.toUpperCase()}
                      </span>
                      <h5 className="font-body font-bold text-on-surface hover:text-primary cursor-pointer transition-colors">
                        {category}
                      </h5>
                      <p className="text-xs text-neutral-600 mt-1">
                        {count} active listing{count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">No categories yet</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-headline text-primary text-sm uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">
                Platform Members
              </h4>
              <div className="space-y-4">
                {topContributors.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <SmallAvatar
                        name={user.full_name || user.username || "User"}
                        gradient={user.gradient}
                      />
                      <span className="text-sm font-body font-semibold">
                        {user.full_name || user.username || "User"}
                      </span>
                    </div>
                    <span className="text-xs font-headline italic text-primary">
                      {user.reviewCount} review{user.reviewCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
                {topContributors.length === 0 && (
                  <p className="text-sm text-neutral-500">No members yet</p>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

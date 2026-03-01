import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostComposer } from '@/components/features/post-composer'
import { PostCard } from '@/components/features/post-card'
import { PostWithProfile } from '@/types/database.types'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not logged in, redirect to signup
  if (!user) {
    redirect('/signup')
  }

  // Fetch all posts with user profiles
  const { data: posts, error } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles (
        id,
        username,
        full_name,
        avatar_url
      )
    `
    )
    .order('created_at', { ascending: false })

  // Check which posts the current user has liked
  const { data: userLikes } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', user.id)

  const likedPostIds = new Set(userLikes?.map((like) => like.post_id) || [])

  if (error) {
    console.error('Error fetching posts:', error)
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Post Composer */}
        <div className="mb-6">
          <PostComposer />
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post as PostWithProfile}
                currentUserId={user.id}
                isLikedByUser={likedPostIds.has(post.id)}
              />
            ))
          ) : (
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-8 text-center">
              <p className="text-neutral-500 dark:text-neutral-400">
                No posts yet. Be the first to share your thoughts! ✨
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/features/post-card'
import { ProfileHeader } from '@/components/features/profile-header'
import { PostWithProfile } from '@/types/database.types'

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the profile by username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Fetch posts by this user
  const { data: posts, error: postsError } = await supabase
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
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  if (postsError) {
    console.error('Error fetching posts:', postsError)
  }

  // Check which posts the current user has liked
  const { data: userLikes } = await supabase
    .from('likes')
    .select('post_id')
    .eq('user_id', user.id)

  const likedPostIds = new Set(userLikes?.map((like) => like.post_id) || [])

  const isOwnProfile = user.id === profile.id

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />

        {/* Posts */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Posts</h2>
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
                  {isOwnProfile ? "You haven't posted anything yet." : 'No posts yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

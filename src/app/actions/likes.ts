'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleLike(postId: string) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'You must be logged in to like posts' }
    }

    // Check if the user has already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found", which is ok - just means no like exists
      console.error('Error checking like:', checkError)
      return { error: 'Failed to check like status' }
    }

    if (existingLike) {
      // Unlike: Delete the like
      const { error: deleteError } = await supabase.from('likes').delete().eq('id', existingLike.id)

      if (deleteError) {
        console.error('Error unliking post:', deleteError)
        return { error: 'Failed to unlike post' }
      }

      // Revalidate to update the UI
      revalidatePath('/')

      return { success: true, liked: false }
    } else {
      // Like: Create a new like
      const { error: insertError } = await supabase.from('likes').insert({
        user_id: user.id,
        post_id: postId,
      })

      if (insertError) {
        console.error('Error liking post:', insertError)
        return { error: 'Failed to like post' }
      }

      // Revalidate to update the UI
      revalidatePath('/')

      return { success: true, liked: true }
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

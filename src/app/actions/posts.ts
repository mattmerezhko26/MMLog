'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { PostInsert } from '@/types/database.types'

export async function createPost(content: string) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'You must be logged in to create a post' }
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return { error: 'Post content cannot be empty' }
    }

    if (content.length > 500) {
      return { error: 'Post content must be 500 characters or less' }
    }

    // Create the post
    const newPost: PostInsert = {
      user_id: user.id,
      content: content.trim(),
    }

    const { data, error } = await supabase
      .from('posts')
      .insert(newPost)
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      return { error: 'Failed to create post. Please try again.' }
    }

    // Revalidate the home page to show the new post
    revalidatePath('/')

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function deletePost(postId: string) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'You must be logged in to delete a post' }
    }

    // Delete the post (RLS will ensure user owns it)
    const { error } = await supabase.from('posts').delete().eq('id', postId).eq('user_id', user.id)

    if (error) {
      console.error('Error deleting post:', error)
      return { error: 'Failed to delete post' }
    }

    // Revalidate the home page
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

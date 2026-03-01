'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(data: { fullName?: string; bio?: string }) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'You must be logged in to update your profile' }
    }

    // Update the profile
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.fullName,
        bio: data.bio,
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error updating profile:', error)
      return { error: 'Failed to update profile' }
    }

    // Revalidate profile page
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    if (profile) {
      revalidatePath(`/profile/${profile.username}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'You must be logged in to upload an avatar' }
    }

    const file = formData.get('avatar') as File

    if (!file) {
      return { error: 'No file provided' }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { error: 'File must be an image' }
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { error: 'File size must be less than 2MB' }
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        upsert: true,
      })

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      return { error: 'Failed to upload avatar' }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(fileName)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating profile:', updateError)
      return { error: 'Failed to update profile with avatar' }
    }

    // Revalidate profile page
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    if (profile) {
      revalidatePath(`/profile/${profile.username}`)
    }

    return { success: true, avatarUrl: publicUrl }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

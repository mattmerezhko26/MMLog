'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Profile } from '@/types/database.types'
import { formatDistanceToNow } from 'date-fns'
import { Calendar } from 'lucide-react'
import { EditProfileModal } from './edit-profile-modal'

interface ProfileHeaderProps {
  profile: Profile
  isOwnProfile: boolean
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const initials = profile.username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const joinedDate = formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Avatar */}
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                  {profile.full_name && (
                    <p className="text-neutral-600 dark:text-neutral-400">{profile.full_name}</p>
                  )}
                </div>

                {isOwnProfile && (
                  <Button onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
                )}
              </div>

              {profile.bio && (
                <p className="mt-3 text-neutral-700 dark:text-neutral-300">{profile.bio}</p>
              )}

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-4 text-sm text-neutral-500">
                <Calendar className="h-4 w-4" />
                <span>Joined {joinedDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isOwnProfile && (
        <EditProfileModal
          profile={profile}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  )
}

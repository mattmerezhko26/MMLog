'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PostWithProfile } from '@/types/database.types'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MoreVertical, Trash2 } from 'lucide-react'
import { deletePost } from '@/app/actions/posts'
import { toggleLike } from '@/app/actions/likes'
import { toast } from 'sonner'

interface PostCardProps {
  post: PostWithProfile
  currentUserId?: string
  isLikedByUser?: boolean
}

export function PostCard({ post, currentUserId, isLikedByUser = false }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  // Optimistic state for likes
  const [optimisticLiked, setOptimisticLiked] = useState(isLikedByUser)
  const [optimisticLikeCount, setOptimisticLikeCount] = useState(post.likes_count)

  const isOwnPost = currentUserId === post.user_id

  const username = post.profiles.username || 'Unknown User'
  const avatarUrl = post.profiles.avatar_url
  const initials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deletePost(post.id)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Post deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete post')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLike = async () => {
    if (!currentUserId || isLiking) return

    // Optimistic update - update UI immediately
    const previousLiked = optimisticLiked
    const previousCount = optimisticLikeCount

    setOptimisticLiked(!optimisticLiked)
    setOptimisticLikeCount(optimisticLiked ? optimisticLikeCount - 1 : optimisticLikeCount + 1)
    setIsLiking(true)

    try {
      const result = await toggleLike(post.id)

      if (result.error) {
        // Revert optimistic update on error
        setOptimisticLiked(previousLiked)
        setOptimisticLikeCount(previousCount)
        toast.error(result.error)
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticLiked(previousLiked)
      setOptimisticLikeCount(previousCount)
      toast.error('Failed to like post')
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <Link href={`/profile/${username}`} className="flex items-center gap-3 group">
            <Avatar>
              <AvatarImage src={avatarUrl || undefined} alt={username} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm group-hover:underline">{username}</p>
              <p className="text-xs text-neutral-500">{timeAgo}</p>
            </div>
          </Link>

          {isOwnPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleLike}
            disabled={!currentUserId || isLiking}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                optimisticLiked ? 'fill-red-500 text-red-500' : ''
              }`}
            />
            <span className="text-xs">{optimisticLikeCount}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

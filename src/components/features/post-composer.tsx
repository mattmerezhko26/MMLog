'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { createPost } from '@/app/actions/posts'
import { toast } from 'sonner'

export function PostComposer() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const maxChars = 500
  const charsRemaining = maxChars - content.length
  const isOverLimit = charsRemaining < 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim() || isOverLimit) {
      return
    }

    setLoading(true)

    try {
      const result = await createPost(content)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Post created successfully!')
        setContent('') // Clear the textarea
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none text-base"
            disabled={loading}
          />

          <div className="flex items-center justify-between">
            <span
              className={`text-sm ${
                isOverLimit
                  ? 'text-red-500 font-semibold'
                  : charsRemaining < 50
                  ? 'text-orange-500'
                  : 'text-neutral-500'
              }`}
            >
              {charsRemaining} characters remaining
            </span>

            <Button type="submit" disabled={loading || !content.trim() || isOverLimit}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

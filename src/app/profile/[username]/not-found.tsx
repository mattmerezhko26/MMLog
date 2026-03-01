import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          User Not Found
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">
          The user you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  )
}

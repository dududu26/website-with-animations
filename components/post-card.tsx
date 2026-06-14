'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

interface Post {
  id: number
  userId: string
  title: string
  content: string
  createdAt: Date | string
  updatedAt: Date | string
}

interface PostCardProps {
  post: Post
  author?: {
    name?: string | null
    email: string
  }
  onDelete?: (id: number) => void
}

export function PostCard({ post, author, onDelete }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const createdDate = new Date(post.createdAt)

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus postingan ini?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
      if (response.ok) {
        onDelete?.(post.id)
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Gagal menghapus postingan')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.article
      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 mb-4"
    >
      {/* Post Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-balance mb-1 hover:text-primary transition-colors">
            <Link href={`/forum/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h2>
          <p className="text-sm text-muted-foreground">
            oleh {author?.name || author?.email} · {formatDistanceToNow(createdDate, { locale: idLocale, addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-foreground mb-4 line-clamp-3">
        {post.content}
      </p>

      {/* Post Footer */}
      <div className="flex justify-between items-center gap-2">
        <Link href={`/forum/${post.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Baca Selengkapnya
          </Button>
        </Link>
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </button>
        )}
      </div>
    </motion.article>
  )
}

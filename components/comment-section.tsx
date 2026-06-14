'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { useSession } from '@/hooks/use-session'
import { ReactionButton } from './reaction-button'
import { Button } from '@/components/ui/button'

interface Comment {
  id: number
  postId: number
  userId: string
  content: string
  parentCommentId: number | null
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt: Date | string | null
}

interface CommentAuthor {
  id: string
  name?: string | null
  email: string
}

interface CommentSectionProps {
  postId: number
  authors: Record<string, CommentAuthor>
}

export function CommentSection({ postId, authors }: CommentSectionProps) {
  const { session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !session?.user) return

    setIsPosting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: newComment,
          parentCommentId: replyingTo,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setComments([...comments, data])
        setNewComment('')
        setReplyingTo(null)
      } else {
        alert('Gagal membuat komentar')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Gagal membuat komentar')
    } finally {
      setIsPosting(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('Hapus komentar ini?')) return

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setComments(comments.filter(c => c.id !== commentId))
      } else {
        alert('Gagal menghapus komentar')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Gagal menghapus komentar')
    }
  }

  const getReplies = (commentId: number) => {
    return comments.filter(c => c.parentCommentId === commentId && !c.deletedAt)
  }

  const renderComment = (comment: Comment, isReply = false) => {
    const author = authors[comment.userId]
    const replies = getReplies(comment.id)

    if (comment.deletedAt) return null

    return (
      <div key={comment.id} className={`${isReply ? 'ml-4 sm:ml-8' : ''} mb-4`}>
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold text-sm">
                {author?.name || author?.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  locale: idLocale,
                  addSuffix: true,
                })}
              </p>
            </div>
            {session?.user?.id === comment.userId && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-destructive hover:underline"
              >
                Hapus
              </button>
            )}
          </div>

          <p className="text-foreground text-sm mb-3">
            {comment.content}
          </p>

          <div className="flex items-center gap-2 text-xs">
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-primary hover:underline"
              >
                Balas
              </button>
            )}
          </div>

          <ReactionButton
            targetId={comment.id}
            targetType="comment"
            currentUserId={session?.user?.id}
          />
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="mt-3 space-y-3">
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <form onSubmit={handlePostComment} className="mt-3 ml-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Tulis balasan..."
                className="flex-1 px-3 py-2 bg-input border border-input rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={isPosting || !newComment.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 text-sm font-medium"
              >
                {isPosting ? 'Mengirim...' : 'Kirim'}
              </button>
            </div>
          </form>
        )}
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-8">Memuat komentar...</div>
  }

  return (
    <section className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
      <h3 className="text-xl font-bold mb-6">Komentar ({comments.filter(c => !c.deletedAt && !c.parentCommentId).length})</h3>

      {/* New Comment Form */}
      {session?.user ? (
        <form onSubmit={handlePostComment} className="mb-6 pb-6 border-b border-border">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Tulis komentar Anda..."
            className="w-full px-4 py-3 bg-input border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={isPosting || !newComment.trim()}
            className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 font-medium"
          >
            {isPosting ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </form>
      ) : (
        <p className="mb-6 pb-6 border-b border-border text-muted-foreground">
          <a href="/auth/login" className="text-primary hover:underline">
            Login
          </a>
          {' '}untuk menambahkan komentar
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.filter(c => !c.deletedAt && !c.parentCommentId).length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Belum ada komentar. Jadilah yang pertama!
          </p>
        ) : (
          comments.filter(c => !c.deletedAt && !c.parentCommentId).map(comment => renderComment(comment))
        )}
      </div>
    </section>
  )
}

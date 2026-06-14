'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Navbar } from '@/components/navbar'
import { CommentSection } from '@/components/comment-section'
import { ReactionButton } from '@/components/reaction-button'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'

interface Post {
  id: number
  userId: string
  title: string
  content: string
  createdAt: Date | string
  updatedAt: Date | string
}

interface Attachment {
  id: number
  postId: number
  fileUrl: string
  fileName: string
  fileSize: number
  fileType: string
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const { session } = useSession()
  const [post, setPost] = useState<Post | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [author, setAuthor] = useState<any>(null)
  const [postId, setPostId] = useState<string>('')

  useEffect(() => {
    params.then(p => {
      setPostId(p.id)
      fetchPost(p.id)
    })
  }, [params])

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`)
      if (response.ok) {
        const postData = await response.json()
        setPost(postData)
        setEditTitle(postData.title)
        setEditContent(postData.content)

        // Fetch attachments
        const attachmentResponse = await fetch(`/api/files/${id}`)
        if (attachmentResponse.ok) {
          const attachmentData = await attachmentResponse.json()
          setAttachments(attachmentData.attachments || [])
        }
      } else {
        alert('Postingan tidak ditemukan')
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('Gagal memuat postingan')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Judul dan konten harus diisi')
      return
    }

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      })

      if (response.ok) {
        const updatedPost = await response.json()
        setPost(updatedPost)
        setIsEditing(false)
        alert('Postingan berhasil diperbarui')
      } else {
        alert('Gagal memperbarui postingan')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Gagal memperbarui postingan')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus postingan ini?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Postingan berhasil dihapus')
        router.push('/')
      } else {
        alert('Gagal menghapus postingan')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Gagal menghapus postingan')
    }
  }

  const handleDeleteAttachment = async (attachmentId: number, fileUrl: string) => {
    if (!window.confirm('Hapus file ini?')) return

    try {
      const response = await fetch(`/api/files/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attachmentId, fileUrl }),
      })

      if (response.ok) {
        setAttachments(attachments.filter(a => a.id !== attachmentId))
      } else {
        alert('Gagal menghapus file')
      }
    } catch (error) {
      console.error('Error deleting attachment:', error)
      alert('Gagal menghapus file')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Memuat postingan...</p>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Postingan tidak ditemukan</p>
        </div>
      </main>
    )
  }

  const isOwner = session?.user?.id === post.userId
  const createdDate = new Date(post.createdAt)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline mb-6 flex items-center gap-2"
        >
          ← Kembali
        </button>

        {/* Post Card */}
        <article className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-8 mb-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full text-3xl font-bold mb-2 px-2 py-1 bg-input border border-input rounded"
                />
              ) : (
                <h1 className="text-3xl font-bold mb-2 text-balance">{post.title}</h1>
              )}
              <p className="text-sm text-muted-foreground">
                oleh {author?.name || author?.email} · {formatDistanceToNow(createdDate, { locale: idLocale, addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Content */}
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full px-4 py-3 bg-input border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
              rows={10}
            />
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
              <p className="whitespace-pre-wrap text-foreground">{post.content}</p>
            </div>
          )}

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mb-8 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-4">File Lampiran ({attachments.length})</h3>
              <div className="space-y-2">
                {attachments.map(attachment => (
                  <div
                    key={attachment.id}
                    className="flex justify-between items-center p-3 bg-card rounded border border-border"
                  >
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-primary hover:underline text-sm"
                    >
                      {attachment.fileName} ({(attachment.fileSize / 1024).toFixed(2)} KB)
                    </a>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteAttachment(attachment.id, attachment.fileUrl)}
                        className="text-destructive hover:underline text-sm ml-4"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reactions */}
          <ReactionButton
            targetId={post.id}
            targetType="post"
            currentUserId={session?.user?.id}
          />

          {/* Edit/Delete Buttons */}
          {isOwner && (
            <div className="mt-6 border-t border-border pt-6 flex gap-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
                  >
                    {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80"
                  >
                    Batal
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:opacity-90"
                  >
                    Hapus
                  </button>
                </>
              )}
            </div>
          )}
        </article>

        {/* Comments Section */}
        <CommentSection postId={post.id} authors={{}} />
      </div>
    </main>
  )
}

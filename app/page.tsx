'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { PostCard } from '@/components/post-card'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from '@/components/animated-elements'

interface Post {
  id: number
  userId: string
  title: string
  content: string
  createdAt: Date | string
  updatedAt: Date | string
}

interface Author {
  id: string
  name?: string | null
  email: string
}

export default function HomePage() {
  const { session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchPosts()
  }, [page])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId))
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-12">
          <FadeIn>
            <div className="bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-lg shadow-lg p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Forum Anti Penyimpangan</h1>
            <p className="text-lg opacity-90 mb-8">
              Platform komunitas untuk berbagi, melaporkan, dan mendiskusikan isu-isu anti penyimpangan dan korupsi
            </p>

            {session?.user ? (
              <Link href="/forum/new">
                <Button className="bg-accent text-accent-foreground hover:opacity-90">
                  Buat Postingan Baru
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button className="bg-accent text-accent-foreground hover:opacity-90">
                  Daftar Sekarang
                </Button>
              </Link>
            )}
            </div>
          </FadeIn>
        </section>

        {/* Posts Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Postingan Terbaru</h2>
            {session?.user && (
              <Link href="/forum/new">
                <Button className="bg-primary text-primary-foreground hover:opacity-90">
                  Postingan Baru
                </Button>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat postingan...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Belum ada postingan</p>
              {session?.user && (
                <Link href="/forum/new">
                  <Button className="bg-primary text-primary-foreground hover:opacity-90">
                    Jadilah yang Pertama Posting!
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <StaggerContainer>
              <div className="space-y-4">
                {posts.map(post => (
                  <StaggerItem key={post.id}>
                    <PostCard
                      post={post}
                      onDelete={session?.user?.id === post.userId ? handleDeletePost : undefined}
                    />
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          )}

          {/* Pagination */}
          {!loading && posts.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <span className="px-4 py-2 text-muted-foreground">
                Halaman {page}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

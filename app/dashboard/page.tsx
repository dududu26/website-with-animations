'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { PostCard } from '@/components/post-card'
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

export default function DashboardPage() {
  const { session, loading } = useSession()
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [postsLoading, setPostsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchUserPosts()
    }
  }, [session?.user])

  const fetchUserPosts = async () => {
    try {
      const response = await fetch('/api/posts?limit=100')
      if (response.ok) {
        const data = await response.json()
        // Filter posts by current user
        const myPosts = data.posts.filter((p: Post) => p.userId === session?.user?.id)
        setUserPosts(myPosts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setPostsLoading(false)
    }
  }

  const handleDeletePost = (postId: number) => {
    setUserPosts(userPosts.filter(p => p.id !== postId))
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </main>
    )
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12">
          <p className="text-center text-muted-foreground mb-4">
            Silakan login untuk mengakses dashboard
          </p>
          <div className="text-center">
            <a href="/auth/login" className="text-primary hover:underline">
              Login di sini
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* User Info */}
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Selamat datang, {session.user.name || session.user.email}!
          </h1>
          <p className="text-muted-foreground">
            Kelola postingan dan aktivitas forum Anda di sini
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-primary text-primary-foreground rounded-lg p-6 shadow-sm">
            <p className="text-sm opacity-90 mb-1">Postingan</p>
            <p className="text-3xl font-bold">{userPosts.length}</p>
          </div>
          <div className="bg-secondary text-secondary-foreground rounded-lg p-6 shadow-sm">
            <p className="text-sm opacity-90 mb-1">Email</p>
            <p className="text-lg font-semibold truncate">{session.user.email}</p>
          </div>
          <div className="bg-accent text-accent-foreground rounded-lg p-6 shadow-sm">
            <p className="text-sm opacity-90 mb-1">Status</p>
            <p className="text-lg font-semibold">Aktif</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link href="/forum/new">
            <Button className="bg-primary text-primary-foreground hover:opacity-90">
              Buat Postingan Baru
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Kembali ke Forum
            </Button>
          </Link>
        </div>

        {/* Posts Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Postingan Saya</h2>

          {postsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat postingan...</p>
            </div>
          ) : userPosts.length === 0 ? (
            <div className="text-center py-12 bg-muted rounded-lg">
              <p className="text-muted-foreground mb-4">Anda belum membuat postingan</p>
              <Link href="/forum/new">
                <Button className="bg-primary text-primary-foreground hover:opacity-90">
                  Buat Postingan Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

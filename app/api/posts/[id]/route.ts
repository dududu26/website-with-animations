import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/schema'
import { eq, isNull } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = parseInt(id)

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId) && isNull(posts.deletedAt))

    if (!post) {
      return NextResponse.json(
        { error: 'Postingan tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil postingan' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const postId = parseInt(id)
    const body = await request.json()
    const { title, content } = body

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))

    if (!post) {
      return NextResponse.json(
        { error: 'Postingan tidak ditemukan' },
        { status: 404 }
      )
    }

    if (post.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Anda hanya bisa mengedit postingan milik Anda sendiri' },
        { status: 403 }
      )
    }

    const [updatedPost] = await db
      .update(posts)
      .set({
        title,
        content,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId))
      .returning()

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate postingan' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const postId = parseInt(id)

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))

    if (!post) {
      return NextResponse.json(
        { error: 'Postingan tidak ditemukan' },
        { status: 404 }
      )
    }

    if (post.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Anda hanya bisa menghapus postingan milik Anda sendiri' },
        { status: 403 }
      )
    }

    // Soft delete
    await db
      .update(posts)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(posts.id, postId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus postingan' },
      { status: 500 }
    )
  }
}

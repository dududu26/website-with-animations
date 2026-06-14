import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comments } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'

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
    const commentId = parseInt(id)
    const body = await request.json()
    const { content } = body

    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))

    if (!comment) {
      return NextResponse.json(
        { error: 'Komentar tidak ditemukan' },
        { status: 404 }
      )
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Anda hanya bisa mengedit komentar milik Anda sendiri' },
        { status: 403 }
      )
    }

    const [updatedComment] = await db
      .update(comments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(comments.id, commentId))
      .returning()

    return NextResponse.json(updatedComment)
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json(
      { error: 'Gagal mengupdate komentar' },
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
    const commentId = parseInt(id)

    const [comment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))

    if (!comment) {
      return NextResponse.json(
        { error: 'Komentar tidak ditemukan' },
        { status: 404 }
      )
    }

    if (comment.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Anda hanya bisa menghapus komentar milik Anda sendiri' },
        { status: 403 }
      )
    }

    // Soft delete
    await db
      .update(comments)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(comments.id, commentId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus komentar' },
      { status: 500 }
    )
  }
}

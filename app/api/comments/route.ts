import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comments } from '@/lib/schema'
import { eq, isNull } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get('postId')
    
    if (!postId) {
      return NextResponse.json(
        { error: 'postId parameter diperlukan' },
        { status: 400 }
      )
    }

    const allComments = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, parseInt(postId)) && isNull(comments.deletedAt))

    return NextResponse.json({ comments: allComments })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil komentar' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { postId, content, parentCommentId } = body

    if (!postId || !content) {
      return NextResponse.json(
        { error: 'postId dan content harus diisi' },
        { status: 400 }
      )
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        postId: parseInt(postId),
        userId: session.user.id,
        content,
        parentCommentId: parentCommentId ? parseInt(parentCommentId) : null,
      })
      .returning()

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Gagal membuat komentar' },
      { status: 500 }
    )
  }
}

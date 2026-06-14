import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { postReactions, commentReactions } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'

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
    const { type, targetId, reactionType } = body // type: 'post' or 'comment'

    if (!type || !targetId || !reactionType) {
      return NextResponse.json(
        { error: 'type, targetId, dan reactionType harus diisi' },
        { status: 400 }
      )
    }

    if (type === 'post') {
      // Check if reaction already exists
      const existing = await db
        .select()
        .from(postReactions)
        .where(
          and(
            eq(postReactions.postId, parseInt(targetId)),
            eq(postReactions.userId, session.user.id),
            eq(postReactions.reactionType, reactionType)
          )
        )

      if (existing.length > 0) {
        // Delete reaction
        await db
          .delete(postReactions)
          .where(
            and(
              eq(postReactions.postId, parseInt(targetId)),
              eq(postReactions.userId, session.user.id),
              eq(postReactions.reactionType, reactionType)
            )
          )
        return NextResponse.json({ action: 'removed' })
      } else {
        // Add reaction
        const [newReaction] = await db
          .insert(postReactions)
          .values({
            postId: parseInt(targetId),
            userId: session.user.id,
            reactionType,
          })
          .returning()
        return NextResponse.json(newReaction, { status: 201 })
      }
    } else if (type === 'comment') {
      // Check if reaction already exists
      const existing = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, parseInt(targetId)),
            eq(commentReactions.userId, session.user.id),
            eq(commentReactions.reactionType, reactionType)
          )
        )

      if (existing.length > 0) {
        // Delete reaction
        await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, parseInt(targetId)),
              eq(commentReactions.userId, session.user.id),
              eq(commentReactions.reactionType, reactionType)
            )
          )
        return NextResponse.json({ action: 'removed' })
      } else {
        // Add reaction
        const [newReaction] = await db
          .insert(commentReactions)
          .values({
            commentId: parseInt(targetId),
            userId: session.user.id,
            reactionType,
          })
          .returning()
        return NextResponse.json(newReaction, { status: 201 })
      }
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error managing reaction:', error)
    return NextResponse.json(
      { error: 'Gagal mengelola reaksi' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type')
    const targetId = request.nextUrl.searchParams.get('targetId')

    if (!type || !targetId) {
      return NextResponse.json(
        { error: 'type dan targetId parameter diperlukan' },
        { status: 400 }
      )
    }

    if (type === 'post') {
      const reactions = await db
        .select()
        .from(postReactions)
        .where(eq(postReactions.postId, parseInt(targetId)))

      return NextResponse.json({ reactions })
    } else if (type === 'comment') {
      const reactions = await db
        .select()
        .from(commentReactions)
        .where(eq(commentReactions.commentId, parseInt(targetId)))

      return NextResponse.json({ reactions })
    }

    return NextResponse.json(
      { error: 'Invalid type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil reaksi' },
      { status: 500 }
    )
  }
}

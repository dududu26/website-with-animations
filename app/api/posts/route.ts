import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts } from '@/lib/schema'
import { eq, isNull, desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Get all non-deleted posts
    const allPosts = await db
      .select()
      .from(posts)
      .where(isNull(posts.deletedAt))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const countResult = await db
      .select()
      .from(posts)
      .where(isNull(posts.deletedAt))

    return NextResponse.json({
      posts: allPosts,
      total: countResult.length,
      page,
      totalPages: Math.ceil(countResult.length / limit),
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil postingan' },
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
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title dan content harus diisi' },
        { status: 400 }
      )
    }

    const [newPost] = await db
      .insert(posts)
      .values({
        userId: session.user.id,
        title,
        content,
      })
      .returning()

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Gagal membuat postingan' },
      { status: 500 }
    )
  }
}

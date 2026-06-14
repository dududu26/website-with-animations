import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { postAttachments, posts } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { deleteFile } from '@/lib/blob'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params

    const attachments = await db
      .select()
      .from(postAttachments)
      .where(eq(postAttachments.postId, parseInt(postId)))

    return NextResponse.json({ attachments })
  } catch (error) {
    console.error('Error fetching attachments:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil file attachment' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { postId } = await params
    const postIdInt = parseInt(postId)
    const body = await request.json()
    const { fileUrl, fileName, fileSize, fileType } = body

    // Verify user owns the post
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postIdInt))

    if (!post) {
      return NextResponse.json(
        { error: 'Postingan tidak ditemukan' },
        { status: 404 }
      )
    }

    if (post.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Anda hanya bisa menambah file ke postingan milik Anda sendiri' },
        { status: 403 }
      )
    }

    const [attachment] = await db
      .insert(postAttachments)
      .values({
        postId: postIdInt,
        fileUrl,
        fileName,
        fileSize,
        fileType,
      })
      .returning()

    return NextResponse.json(attachment, { status: 201 })
  } catch (error) {
    console.error('Error adding attachment:', error)
    return NextResponse.json(
      { error: 'Gagal menambah attachment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { postId } = await params
    const body = await request.json()
    const { attachmentId, fileUrl } = body

    const [attachment] = await db
      .select()
      .from(postAttachments)
      .where(eq(postAttachments.id, parseInt(attachmentId)))

    if (!attachment) {
      return NextResponse.json(
        { error: 'File tidak ditemukan' },
        { status: 404 }
      )
    }

    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, attachment.postId))

    if (post?.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Anda hanya bisa menghapus file dari postingan milik Anda sendiri' },
        { status: 403 }
      )
    }

    // Delete from blob storage
    await deleteFile(fileUrl)

    // Delete from database
    await db
      .delete(postAttachments)
      .where(eq(postAttachments.id, parseInt(attachmentId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting attachment:', error)
    return NextResponse.json(
      { error: 'Gagal menghapus file' },
      { status: 500 }
    )
  }
}

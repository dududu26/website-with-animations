import { NextRequest, NextResponse } from 'next/server'
import { uploadFile } from '@/lib/blob'
import { auth } from '@/lib/auth'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'File diperlukan' },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Ukuran file tidak boleh lebih dari ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    const { url, size } = await uploadFile(file, session.user.id)

    return NextResponse.json(
      {
        url,
        fileName: file.name,
        fileSize: size,
        fileType: file.type,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading file:', error)
    const errorMessage = error instanceof Error ? error.message : 'Gagal mengupload file'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

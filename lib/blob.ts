import { put, del, head } from '@vercel/blob'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_POST_SIZE = 50 * 1024 * 1024 // 50MB per post
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
]

export async function uploadFile(file: File, userId: string): Promise<{ url: string; size: number }> {
  // Validate file
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`)
  }

  try {
    const timestamp = Date.now()
    const filename = `${userId}/${timestamp}-${file.name}`

    const blob = await put(filename, file, {
      access: 'private',
      addRandomSuffix: true,
    })

    return {
      url: blob.url,
      size: file.size,
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('Failed to upload file')
  }
}

export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw new Error('Failed to delete file')
  }
}

export async function getFileInfo(url: string) {
  try {
    const info = await head(url)
    return info
  } catch (error) {
    console.error('Error getting file info:', error)
    return null
  }
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { FileUpload } from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/use-session'

interface UploadedFile {
  url: string
  fileName: string
  fileSize: number
  fileType: string
}

export default function NewPostPage() {
  const router = useRouter()
  const { session, loading } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isPosting, setIsPosting] = useState(false)

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
            Silakan login terlebih dahulu untuk membuat postingan
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      alert('Judul dan konten harus diisi')
      return
    }

    setIsPosting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (response.ok) {
        const post = await response.json()

        // Upload files if any
        for (const file of uploadedFiles) {
          await fetch(`/api/files/${post.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(file),
          })
        }

        router.push(`/forum/${post.id}`)
      } else {
        alert('Gagal membuat postingan')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Gagal membuat postingan')
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-8">
          <h1 className="text-3xl font-bold mb-8">Buat Postingan Baru</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Judul Postingan
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Tuliskan judul postingan Anda..."
                className="w-full px-4 py-3 bg-input border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={255}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {title.length}/255
              </p>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Isi Postingan
              </label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Tuliskan isi postingan Anda di sini..."
                className="w-full px-4 py-3 bg-input border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={8}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold mb-4">
                Tambahkan File (Opsional)
              </label>
              <FileUpload
                onFileUpload={file => {
                  setUploadedFiles([...uploadedFiles, file])
                }}
                disabled={isPosting}
              />

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold">File yang diunggah:</p>
                  {uploadedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.fileSize / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFiles(
                            uploadedFiles.filter((_, i) => i !== idx)
                          )
                        }}
                        className="text-destructive hover:underline text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isPosting || !title.trim() || !content.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 font-semibold transition-opacity"
              >
                {isPosting ? 'Membuat...' : 'Buat Postingan'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 font-semibold transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

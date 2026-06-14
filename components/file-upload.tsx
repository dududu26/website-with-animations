'use client'

import { useState, useRef } from 'react'

interface FileUploadProps {
  onFileUpload: (fileData: {
    url: string
    fileName: string
    fileSize: number
    fileType: string
  }) => void
  disabled?: boolean
}

export function FileUpload({ onFileUpload, disabled }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file tidak boleh lebih dari 10MB')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onFileUpload(data)
      } else {
        const error = await response.json()
        alert(error.error || 'Gagal mengupload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Gagal mengupload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div
      onDragOver={e => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragOver ? 'border-primary bg-primary/5' : 'border-border'
      } ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={e => e.target.files && handleFileSelect(e.target.files[0])}
        disabled={disabled || isUploading}
      />

      <div className="text-muted-foreground">
        {isUploading ? (
          <p>Mengupload...</p>
        ) : (
          <>
            <p className="font-semibold mb-2">Drag & drop file di sini</p>
            <p className="text-sm">atau klik untuk memilih file (Max 10MB)</p>
          </>
        )}
      </div>
    </div>
  )
}

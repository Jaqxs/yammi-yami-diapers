"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"
import { OptimizedImage } from "@/components/optimized-image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
}

export default function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  if (value) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <OptimizedImage
              src={value}
              alt="Product image"
              width={200}
              height={200}
              className="rounded-lg object-cover w-full h-48"
            />
            <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={onRemove}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-4">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              Change Image
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload Product Image</h3>
            <p className="text-sm text-gray-500">Drag and drop an image here, or click to select</p>
            <p className="text-xs text-gray-400">Supports: JPEG, PNG, WebP (max 5MB)</p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Select Image"}
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </CardContent>
    </Card>
  )
}

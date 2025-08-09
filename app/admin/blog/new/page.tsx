"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Check, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import { useStoreSync } from "@/lib/store-sync"
import { RichTextEditor } from "@/components/admin/rich-text-editor"

export default function NewBlogPostPage() {
  const router = useRouter()
  const { addBlogPost } = useStore()
  const { notifyChange } = useStoreSync()
  const { toast } = useToast()

  // Form state
  const [title, setTitle] = useState({ en: "", sw: "" })
  const [excerpt, setExcerpt] = useState({ en: "", sw: "" })
  const [content, setContent] = useState({ en: "", sw: "" })
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [readTime, setReadTime] = useState("5")
  const [status, setStatus] = useState<"published" | "draft">("draft")
  const [featured, setFeatured] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Image handling
  const [image, setImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Tag handling
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.en) newErrors.titleEn = "English title is required"
    if (!title.sw) newErrors.titleSw = "Swahili title is required"
    if (!excerpt.en) newErrors.excerptEn = "English excerpt is required"
    if (!excerpt.sw) newErrors.excerptSw = "Swahili excerpt is required"
    if (!content.en) newErrors.contentEn = "English content is required"
    if (!content.sw) newErrors.contentSw = "Swahili content is required"
    if (!category) newErrors.category = "Category is required"
    if (!date) newErrors.date = "Date is required"
    if (!readTime) newErrors.readTime = "Read time is required"
    else if (isNaN(Number(readTime))) newErrors.readTime = "Read time must be a number"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const newBlogPost = await addBlogPost({
        title,
        excerpt,
        content,
        category,
        tags,
        date,
        readTime: Number(readTime),
        status,
        featured,
        image: image || "/writing-desk-inspiration.png",
        author: {
          name: "Admin",
          avatar: "/mystical-forest-spirit.png",
        },
      })

      // Notify about the new blog post
      notifyChange({
        type: "blogPost",
        action: "add",
        id: newBlogPost.id,
      })

      toast({
        title: "Blog Post Added",
        description: "The article has been added successfully",
      })

      router.push("/admin/blog")
    } catch (error) {
      console.error("Error adding blog post:", error)
      toast({
        title: "Error",
        description: "Failed to add article. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">Create New Article</h1>
        <Button variant="outline" onClick={() => router.push("/admin/blog")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Article Information</CardTitle>
            <CardDescription>Enter the basic information about the article</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title-en">Title (English)</Label>
                <Input
                  id="title-en"
                  value={title.en}
                  onChange={(e) => setTitle({ ...title, en: e.target.value })}
                  placeholder="Article title in English"
                  className={errors.titleEn ? "border-red-500" : ""}
                />
                {errors.titleEn && <p className="text-sm text-red-500">{errors.titleEn}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="title-sw">Title (Swahili)</Label>
                <Input
                  id="title-sw"
                  value={title.sw}
                  onChange={(e) => setTitle({ ...title, sw: e.target.value })}
                  placeholder="Article title in Swahili"
                  className={errors.titleSw ? "border-red-500" : ""}
                />
                {errors.titleSw && <p className="text-sm text-red-500">{errors.titleSw}</p>}
              </div>
            </div>

            {/* Excerpt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="excerpt-en">Excerpt (English)</Label>
                <Textarea
                  id="excerpt-en"
                  value={excerpt.en}
                  onChange={(e) => setExcerpt({ ...excerpt, en: e.target.value })}
                  placeholder="Short description in English"
                  rows={3}
                  className={errors.excerptEn ? "border-red-500" : ""}
                />
                {errors.excerptEn && <p className="text-sm text-red-500">{errors.excerptEn}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt-sw">Excerpt (Swahili)</Label>
                <Textarea
                  id="excerpt-sw"
                  value={excerpt.sw}
                  onChange={(e) => setExcerpt({ ...excerpt, sw: e.target.value })}
                  placeholder="Short description in Swahili"
                  rows={3}
                  className={errors.excerptSw ? "border-red-500" : ""}
                />
                {errors.excerptSw && <p className="text-sm text-red-500">{errors.excerptSw}</p>}
              </div>
            </div>

            {/* Category and Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="babyHealth">Baby Health</SelectItem>
                    <SelectItem value="parentingTips">Parenting Tips</SelectItem>
                    <SelectItem value="productInfo">Product Info</SelectItem>
                    <SelectItem value="latestNews">Latest News</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="read-time">Read Time (minutes)</Label>
                <Input
                  id="read-time"
                  type="number"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  min="1"
                  className={errors.readTime ? "border-red-500" : ""}
                />
                {errors.readTime && <p className="text-sm text-red-500">{errors.readTime}</p>}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-gray-700">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Featured */}
            <div className="flex items-center space-x-2">
              <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
              <Label htmlFor="featured">Feature this article on the homepage</Label>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as "published" | "draft")}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Article Content (English)</CardTitle>
            <CardDescription>Write the main content of your article in English</CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={content.en}
              onChange={(value) => setContent({ ...content, en: value })}
              className={errors.contentEn ? "border-red-500" : ""}
            />
            {errors.contentEn && <p className="text-sm text-red-500 mt-2">{errors.contentEn}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Article Content (Swahili)</CardTitle>
            <CardDescription>Write the main content of your article in Swahili</CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={content.sw}
              onChange={(value) => setContent({ ...content, sw: value })}
              className={errors.contentSw ? "border-red-500" : ""}
            />
            {errors.contentSw && <p className="text-sm text-red-500 mt-2">{errors.contentSw}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
            <CardDescription>Upload a featured image for your article</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input type="file" id="image-upload" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">Click to upload an image</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
                </Label>
              </div>

              {image && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Preview</p>
                  <div className="aspect-video w-full max-w-2xl mx-auto rounded-md overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image || "/placeholder.svg"}
                      alt="Article preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/blog")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-yammy-blue hover:bg-yammy-dark-blue" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Publish Article
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

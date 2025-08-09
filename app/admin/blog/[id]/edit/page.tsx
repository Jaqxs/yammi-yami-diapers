"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useStoreSync } from "@/lib/store-sync"
import { RichTextEditor } from "@/components/admin/rich-text-editor"

export default function EditBlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { state, loadBlogPosts, updateBlogPost } = useStore()
  const { notifyChange } = useStoreSync()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: 0,
    title: {
      en: "",
      sw: "",
    },
    excerpt: {
      en: "",
      sw: "",
    },
    content: {
      en: "",
      sw: "",
    },
    image: "",
    category: "",
    tags: [] as string[],
    date: "",
    readTime: 0,
    author: {
      name: "",
      avatar: "",
    },
    status: "draft" as "published" | "draft",
    featured: false,
  })

  const [tagInput, setTagInput] = useState("")

  // Load blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      setIsLoading(true)
      try {
        const postId = Number(params.id)

        // Check if blog posts are already loaded
        if (state.blogPosts.length === 0) {
          await loadBlogPosts()
        }

        const foundPost = state.blogPosts.find((p) => p.id === postId)

        if (foundPost) {
          setFormData(foundPost)
        } else {
          toast({
            title: "Blog post not found",
            description: "The requested blog post could not be found",
            variant: "destructive",
          })
          router.push("/admin/blog")
        }
      } catch (error) {
        console.error("Failed to load blog post:", error)
        toast({
          title: "Error",
          description: "Failed to load blog post details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.id, loadBlogPosts, router, toast, state.blogPosts])

  // Handle form input changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".")
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value,
          },
        }
      }
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  // Handle number input changes
  const handleNumberChange = (field: string, value: string) => {
    const numValue = value === "" ? 0 : Number(value)
    handleChange(field, numValue)
  }

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateBlogPost(formData)

      // Notify about the change
      notifyChange({
        type: "blogPost",
        action: "update",
        id: formData.id,
      })

      toast({
        title: "Blog post updated",
        description: "The article has been updated successfully",
      })

      // Refresh blog posts data before navigating
      await loadBlogPosts()
      router.push("/admin/blog")
    } catch (error) {
      console.error("Failed to update blog post:", error)
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData({
            ...formData,
            image: event.target.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">Edit Article</h1>
          <p className="text-gray-500">Update article information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/blog")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button className="bg-yammy-blue hover:bg-yammy-dark-blue" onClick={handleSubmit} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Article Information</CardTitle>
            <CardDescription>Basic information about the article</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title-en">Title (English)</Label>
                <Input
                  id="title-en"
                  value={formData.title.en}
                  onChange={(e) => handleChange("title.en", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title-sw">Title (Swahili)</Label>
                <Input
                  id="title-sw"
                  value={formData.title.sw}
                  onChange={(e) => handleChange("title.sw", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="excerpt-en">Excerpt (English)</Label>
                <Textarea
                  id="excerpt-en"
                  value={formData.excerpt.en}
                  onChange={(e) => handleChange("excerpt.en", e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt-sw">Excerpt (Swahili)</Label>
                <Textarea
                  id="excerpt-sw"
                  value={formData.excerpt.sw}
                  onChange={(e) => handleChange("excerpt.sw", e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Category, Date, Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="babyHealth">Baby Health</SelectItem>
                    <SelectItem value="parentingTips">Parenting Tips</SelectItem>
                    <SelectItem value="productInfo">Product Info</SelectItem>
                    <SelectItem value="latestNews">Latest News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Publication Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date.split("T")[0]}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="read-time">Read Time (minutes)</Label>
                <Input
                  id="read-time"
                  type="number"
                  value={formData.readTime || ""}
                  onChange={(e) => handleNumberChange("readTime", e.target.value)}
                  min="1"
                  required
                />
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
                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        &times;
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Status & Featured */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "published" | "draft") => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Article</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Content (English)</CardTitle>
            <CardDescription>The main article content in English</CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor content={formData.content.en} onChange={(value) => handleChange("content.en", value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content (Swahili)</CardTitle>
            <CardDescription>The main article content in Swahili</CardDescription>
          </CardHeader>
          <CardContent>
            <RichTextEditor content={formData.content.sw} onChange={(value) => handleChange("content.sw", value)} />
          </CardContent>
        </Card>

        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
            <CardDescription>Upload an image for your article</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm font-medium">Click to upload or drag and drop</span>
                <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
              </Label>
            </div>

            {formData.image && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Current Image</p>
                <div className="aspect-video w-full max-w-2xl mx-auto rounded-md overflow-hidden border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Article preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Upload, Plus, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { RichTextEditor } from "@/components/admin/rich-text-editor"

export default function NewArticlePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [articleData, setArticleData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    readTime: "",
    date: new Date().toISOString().split("T")[0],
    status: "draft",
    featured: false,
    tags: [] as string[],
    image: "",
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setArticleData({ ...articleData, [name]: value })
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setArticleData({ ...articleData, [name]: value })
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setArticleData({ ...articleData, [name]: checked })
  }

  // Handle content change
  const handleContentChange = (content: string) => {
    setArticleData({ ...articleData, content })
  }

  // Handle tag changes
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !articleData.tags.includes(newTag.trim())) {
      setArticleData({
        ...articleData,
        tags: [...articleData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setArticleData({
      ...articleData,
      tags: articleData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this to a storage service
    // Here we're just creating an object URL for preview
    const imageUrl = URL.createObjectURL(file)
    setArticleData({ ...articleData, image: imageUrl })
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Article created",
        description: "The article has been created successfully",
      })
      setIsSubmitting(false)
      router.push("/admin/blog")
    }, 1500)
  }

  // Handle cancel
  const handleCancel = () => {
    router.push("/admin/blog")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">Create New Article</h1>
          <p className="text-gray-500">Write and publish a new blog article</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button className="bg-yammy-blue hover:bg-yammy-dark-blue" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {articleData.status === "published" ? "Publish" : "Save Draft"}
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="content" className="space-y-4">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article Content</CardTitle>
                    <CardDescription>Write your article content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={articleData.title}
                        onChange={handleChange}
                        placeholder="Enter article title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={articleData.excerpt}
                        onChange={handleChange}
                        placeholder="Enter a short excerpt"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <RichTextEditor value={articleData.content} onChange={handleContentChange} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                    <CardDescription>Upload a featured image for your article</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {articleData.image ? (
                        <div className="relative">
                          <div className="aspect-video rounded-md overflow-hidden border">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={articleData.image || "/placeholder.svg"}
                              alt="Featured image"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setArticleData({ ...articleData, image: "" })}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <Label htmlFor="image" className="cursor-pointer flex flex-col items-center">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <span className="text-sm font-medium">Click to upload</span>
                            <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
                          </Label>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Categories & Tags</CardTitle>
                    <CardDescription>Organize your article</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={articleData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="category">
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
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {articleData.tags.map((tag, index) => (
                          <div
                            key={index}
                            className="bg-yammy-light-blue text-yammy-blue px-3 py-1 rounded-full text-sm flex items-center"
                          >
                            {tag}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 ml-1 hover:bg-transparent"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addTag()
                            }
                          }}
                        />
                        <Button type="button" onClick={addTag} className="bg-yammy-blue hover:bg-yammy-dark-blue">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* SEO Tab */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Meta Information</CardTitle>
                <CardDescription>Optimize your article for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input id="metaTitle" placeholder="Enter meta title" />
                  <p className="text-xs text-gray-500">Recommended length: 50-60 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea id="metaDescription" placeholder="Enter meta description" rows={3} />
                  <p className="text-xs text-gray-500">Recommended length: 150-160 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focusKeyword">Focus Keyword</Label>
                  <Input id="focusKeyword" placeholder="Enter focus keyword" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Article Settings</CardTitle>
                <CardDescription>Configure article settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={articleData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Publish Date</Label>
                  <div className="relative">
                    <Input id="date" name="date" type="date" value={articleData.date} onChange={handleChange} />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time (minutes)</Label>
                  <Input
                    id="readTime"
                    name="readTime"
                    type="number"
                    value={articleData.readTime}
                    onChange={handleChange}
                    placeholder="Estimated read time in minutes"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={articleData.featured}
                    onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                  />
                  <Label htmlFor="featured">Feature this article</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

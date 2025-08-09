"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import type { Category, Product } from "@/lib/supabase"

export default function EditSupabaseProductPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name_en: "",
    name_sw: "",
    description_en: "",
    description_sw: "",
    category_id: "",
    price: "",
    wholesale_price: "",
    size: "",
    bundle_size: "",
    carton_size: "",
    weight_range: "",
    hip_size: "",
    stock: "",
    status: "active" as const,
    featured: false,
    image_url: "",
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState("")

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/supabase/products/${params.id}`)
      const data = await response.json()

      if (data.success) {
        const product = data.product
        setProduct(product)
        setFormData({
          name_en: product.name_en || "",
          name_sw: product.name_sw || "",
          description_en: product.description_en || "",
          description_sw: product.description_sw || "",
          category_id: product.category_id || "",
          price: product.price?.toString() || "",
          wholesale_price: product.wholesale_price?.toString() || "",
          size: product.size || "",
          bundle_size: product.bundle_size?.toString() || "",
          carton_size: product.carton_size || "",
          weight_range: product.weight_range || "",
          hip_size: product.hip_size || "",
          stock: product.stock?.toString() || "",
          status: product.status || "active",
          featured: product.featured || false,
          image_url: product.image_url || "",
          tags: product.tags || [],
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product",
        variant: "destructive",
      })
      router.push("/admin-supabase/products")
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/supabase/categories")
      const data = await response.json()

      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchProduct(), fetchCategories()])
      setIsLoading(false)
    }
    loadData()
  }, [params.id])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validate required fields
      if (!formData.name_en || !formData.name_sw || !formData.price || !formData.stock) {
        throw new Error("Please fill in all required fields")
      }

      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price),
        wholesale_price: formData.wholesale_price ? Number.parseFloat(formData.wholesale_price) : null,
        bundle_size: formData.bundle_size ? Number.parseInt(formData.bundle_size) : null,
        stock: Number.parseInt(formData.stock),
        category_id: formData.category_id || null,
      }

      const response = await fetch(`/api/admin/supabase/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
        router.push("/admin-supabase/products")
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yammy-blue"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link href="/admin-supabase/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-yammy-dark-blue">Edit Product</h1>
          <p className="text-gray-600">Update product information in your Supabase database</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name_en">Product Name (English) *</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) => handleInputChange("name_en", e.target.value)}
                      placeholder="Enter product name in English"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_sw">Product Name (Swahili) *</Label>
                    <Input
                      id="name_sw"
                      value={formData.name_sw}
                      onChange={(e) => handleInputChange("name_sw", e.target.value)}
                      placeholder="Ingiza jina la bidhaa kwa Kiswahili"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => handleInputChange("category_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_en">Description (English)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => handleInputChange("description_en", e.target.value)}
                    placeholder="Detailed product description in English"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_sw">Description (Swahili)</Label>
                  <Textarea
                    id="description_sw"
                    value={formData.description_sw}
                    onChange={(e) => handleInputChange("description_sw", e.target.value)}
                    placeholder="Maelezo ya kina ya bidhaa kwa Kiswahili"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange("image_url", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image_url && (
                    <div className="mt-2">
                      <img
                        src={formData.image_url || "/placeholder.svg"}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Specifications and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => handleInputChange("size", e.target.value)}
                      placeholder="e.g., Small, Medium, Large"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bundle_size">Bundle Size (pieces)</Label>
                    <Input
                      id="bundle_size"
                      type="number"
                      value={formData.bundle_size}
                      onChange={(e) => handleInputChange("bundle_size", e.target.value)}
                      placeholder="e.g., 30"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="carton_size">Carton Size</Label>
                    <Input
                      id="carton_size"
                      value={formData.carton_size}
                      onChange={(e) => handleInputChange("carton_size", e.target.value)}
                      placeholder="e.g., 12 packs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight_range">Weight Range</Label>
                    <Input
                      id="weight_range"
                      value={formData.weight_range}
                      onChange={(e) => handleInputChange("weight_range", e.target.value)}
                      placeholder="e.g., 3-6 kg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hip_size">Hip Size Range</Label>
                  <Input
                    id="hip_size"
                    value={formData.hip_size}
                    onChange={(e) => handleInputChange("hip_size", e.target.value)}
                    placeholder="e.g., 60-90 cm"
                  />
                </div>

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
                        <div
                          key={index}
                          className="bg-yammy-light-blue text-yammy-blue px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-yammy-blue hover:text-yammy-dark-blue"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
                <CardDescription>Set prices and manage stock</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">Retail Price (TZS) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wholesale_price">Wholesale Price (TZS)</Label>
                    <Input
                      id="wholesale_price"
                      type="number"
                      step="0.01"
                      value={formData.wholesale_price}
                      onChange={(e) => handleInputChange("wholesale_price", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange("featured", checked)}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin-supabase/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSaving} className="bg-yammy-blue hover:bg-yammy-dark-blue">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

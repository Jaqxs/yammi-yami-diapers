"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import ImageUpload from "@/components/admin/image-upload"

interface Category {
  id: number
  name_en: string
  name_sw: string
}

interface Product {
  id: number
  name_en: string
  name_sw: string
  description_en: string
  description_sw: string
  price: number
  wholesale_price: number
  category: string
  size: string
  bundle_size: number
  carton_size: string
  weight_range: string
  hip_size: string
  stock: number
  featured: boolean
  status: string
  image_url: string
  tags: string[]
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name_en: "",
    name_sw: "",
    description_en: "",
    description_sw: "",
    price: "",
    wholesale_price: "",
    category: "",
    size: "",
    bundle_size: "",
    carton_size: "",
    weight_range: "",
    hip_size: "",
    stock: "",
    featured: false,
    status: "active",
    image_url: "",
    tags: "",
  })

  useEffect(() => {
    fetchCategories()
    fetchProduct()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
        setFormData({
          name_en: data.name_en || "",
          name_sw: data.name_sw || "",
          description_en: data.description_en || "",
          description_sw: data.description_sw || "",
          price: data.price?.toString() || "",
          wholesale_price: data.wholesale_price?.toString() || "",
          category: data.category || "",
          size: data.size || "",
          bundle_size: data.bundle_size?.toString() || "",
          carton_size: data.carton_size || "",
          weight_range: data.weight_range || "",
          hip_size: data.hip_size || "",
          stock: data.stock?.toString() || "",
          featured: data.featured || false,
          status: data.status || "active",
          image_url: data.image_url || "",
          tags: data.tags ? data.tags.join(", ") : "",
        })
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        price: Number.parseFloat(formData.price),
        wholesale_price: formData.wholesale_price ? Number.parseFloat(formData.wholesale_price) : null,
        bundle_size: formData.bundle_size ? Number.parseInt(formData.bundle_size) : null,
        stock: Number.parseInt(formData.stock),
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
      }

      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push("/admin")
      } else {
        console.error("Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Basic product details in both languages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name_en">Product Name (English)</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) => handleInputChange("name_en", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name_sw">Product Name (Swahili)</Label>
                    <Input
                      id="name_sw"
                      value={formData.name_sw}
                      onChange={(e) => handleInputChange("name_sw", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description_en">Description (English)</Label>
                  <Textarea
                    id="description_en"
                    value={formData.description_en}
                    onChange={(e) => handleInputChange("description_en", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="description_sw">Description (Swahili)</Label>
                  <Textarea
                    id="description_sw"
                    value={formData.description_sw}
                    onChange={(e) => handleInputChange("description_sw", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Specifications</CardTitle>
                <CardDescription>Detailed product specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => handleInputChange("size", e.target.value)}
                      placeholder="e.g., Small, Medium, Large"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bundle_size">Bundle Size</Label>
                    <Input
                      id="bundle_size"
                      type="number"
                      value={formData.bundle_size}
                      onChange={(e) => handleInputChange("bundle_size", e.target.value)}
                      placeholder="Number of pieces"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="carton_size">Carton Size</Label>
                    <Input
                      id="carton_size"
                      value={formData.carton_size}
                      onChange={(e) => handleInputChange("carton_size", e.target.value)}
                      placeholder="e.g., 12 packs"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight_range">Weight Range</Label>
                    <Input
                      id="weight_range"
                      value={formData.weight_range}
                      onChange={(e) => handleInputChange("weight_range", e.target.value)}
                      placeholder="e.g., 3-6 kg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hip_size">Hip Size</Label>
                  <Input
                    id="hip_size"
                    value={formData.hip_size}
                    onChange={(e) => handleInputChange("hip_size", e.target.value)}
                    placeholder="e.g., 60-90 cm"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="e.g., premium, soft, absorbent"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="price">Retail Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="wholesale_price">Wholesale Price ($)</Label>
                  <Input
                    id="wholesale_price"
                    type="number"
                    step="0.01"
                    value={formData.wholesale_price}
                    onChange={(e) => handleInputChange("wholesale_price", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name_en}>
                          {category.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
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

            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
                <CardDescription>Upload a high-quality product image</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => handleInputChange("image_url", url)}
                  onRemove={() => handleInputChange("image_url", "")}
                />
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

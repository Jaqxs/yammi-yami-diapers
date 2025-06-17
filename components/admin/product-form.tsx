"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Product {
  id?: number
  name_en: string
  name_sw: string
  description_en: string
  description_sw: string
  price: number
  wholesale_price: number
  category: string
  size: string
  bundle_size: number
  carton_size: number
  weight_range: string
  hip_size: string
  stock: number
  featured: boolean
  status: string
  image_url: string
  tags: string[]
}

interface ProductFormProps {
  product?: Product
  onSubmit: (product: Product) => Promise<void>
  isLoading?: boolean
}

export default function ProductForm({ product, onSubmit, isLoading }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Product>({
    name_en: product?.name_en || "",
    name_sw: product?.name_sw || "",
    description_en: product?.description_en || "",
    description_sw: product?.description_sw || "",
    price: product?.price || 0,
    wholesale_price: product?.wholesale_price || 0,
    category: product?.category || "",
    size: product?.size || "",
    bundle_size: product?.bundle_size || 0,
    carton_size: product?.carton_size || 0,
    weight_range: product?.weight_range || "",
    hip_size: product?.hip_size || "",
    stock: product?.stock || 0,
    featured: product?.featured || false,
    status: product?.status || "draft",
    image_url: product?.image_url || "",
    tags: product?.tags || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Product name and description</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

        {/* Pricing and Category */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Category</CardTitle>
            <CardDescription>Set prices and categorization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="price">Retail Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
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
                onChange={(e) => handleInputChange("wholesale_price", Number.parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baby Diapers">Baby Diapers</SelectItem>
                  <SelectItem value="Adult Diapers">Adult Diapers</SelectItem>
                  <SelectItem value="Lady Pads">Lady Pads</SelectItem>
                  <SelectItem value="Pull-up Pants">Pull-up Pants</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value))}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Size and specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="weight_range">Weight Range</Label>
              <Input
                id="weight_range"
                value={formData.weight_range}
                onChange={(e) => handleInputChange("weight_range", e.target.value)}
                placeholder="e.g., 3-6 kg"
              />
            </div>
            <div>
              <Label htmlFor="hip_size">Hip Size</Label>
              <Input
                id="hip_size"
                value={formData.hip_size}
                onChange={(e) => handleInputChange("hip_size", e.target.value)}
                placeholder="e.g., 40-60 cm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bundle_size">Bundle Size</Label>
                <Input
                  id="bundle_size"
                  type="number"
                  value={formData.bundle_size}
                  onChange={(e) => handleInputChange("bundle_size", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="carton_size">Carton Size</Label>
                <Input
                  id="carton_size"
                  type="number"
                  value={formData.carton_size}
                  onChange={(e) => handleInputChange("carton_size", Number.parseInt(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Product status and visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
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
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

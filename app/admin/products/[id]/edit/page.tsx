"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import { useStoreSync } from "@/lib/store-sync"

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { state, loadProducts, updateProduct } = useStore()
  const { notifyChange } = useStoreSync()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    id: 0,
    name: {
      en: "",
      sw: "",
    },
    category: "",
    price: 0,
    wholesalePrice: 0,
    size: "",
    bundleSize: "",
    cartonSize: "",
    image: "",
    tags: [] as string[],
    weightRange: "",
    hipSize: "",
    description: {
      en: "",
      sw: "",
    },
    stock: 0,
    status: "active" as "active" | "low_stock" | "out_of_stock" | "draft",
    isCarton: false,
    featured: false,
  })

  const [tagInput, setTagInput] = useState("")

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const productId = Number(params.id)

        // Check if products are already loaded
        if (state.products.length === 0) {
          await loadProducts()
        }

        const foundProduct = state.products.find((p) => p.id === productId)

        if (foundProduct) {
          setFormData(foundProduct)
        } else {
          toast({
            title: "Product not found",
            description: "The requested product could not be found",
            variant: "destructive",
          })
          router.push("/admin/products")
        }
      } catch (error) {
        console.error("Failed to load product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, loadProducts, router, toast, state.products])

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
      await updateProduct(formData)

      // Notify about the change
      notifyChange({
        type: "product",
        action: "update",
        id: formData.id,
      })

      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
      })

      // Refresh products data before navigating
      await loadProducts()
      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to update product:", error)
      toast({
        title: "Error",
        description: "Failed to update product",
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
          <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">Edit Product</h1>
          <p className="text-gray-500">Update product information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/admin/products/${params.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button className="bg-yammy-blue hover:bg-yammy-dark-blue" onClick={handleSubmit} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>Basic information about the product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name-en">Product Name (English)</Label>
                    <Input
                      id="name-en"
                      value={formData.name.en}
                      onChange={(e) => handleChange("name.en", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name-sw">Product Name (Swahili)</Label>
                    <Input
                      id="name-sw"
                      value={formData.name.sw}
                      onChange={(e) => handleChange("name.sw", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="babyDiapers">Baby Diapers</SelectItem>
                        <SelectItem value="babyPants">Baby Pants</SelectItem>
                        <SelectItem value="adultDiapers">Adult Diapers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "low_stock" | "out_of_stock" | "draft") =>
                        handleChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="low_stock">Low Stock</SelectItem>
                        <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description-en">Description (English)</Label>
                  <Textarea
                    id="description-en"
                    value={formData.description.en}
                    onChange={(e) => handleChange("description.en", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description-sw">Description (Swahili)</Label>
                  <Textarea
                    id="description-sw"
                    value={formData.description.sw}
                    onChange={(e) => handleChange("description.sw", e.target.value)}
                    rows={4}
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
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
                <CardDescription>Price and stock information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Retail Price (TZS)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price || ""}
                      onChange={(e) => handleNumberChange("price", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wholesalePrice">Wholesale Price (TZS)</Label>
                    <Input
                      id="wholesalePrice"
                      type="number"
                      value={formData.wholesalePrice || ""}
                      onChange={(e) => handleNumberChange("wholesalePrice", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock || ""}
                      onChange={(e) => handleNumberChange("stock", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size || ""}
                      onChange={(e) => handleChange("size", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bundleSize">Bundle Size</Label>
                    <Input
                      id="bundleSize"
                      value={formData.bundleSize || ""}
                      onChange={(e) => handleChange("bundleSize", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cartonSize">Carton Size</Label>
                    <Input
                      id="cartonSize"
                      value={formData.cartonSize || ""}
                      onChange={(e) => handleChange("cartonSize", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightRange">Weight Range</Label>
                    <Input
                      id="weightRange"
                      value={formData.weightRange || ""}
                      onChange={(e) => handleChange("weightRange", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hipSize">Hip Size</Label>
                    <Input
                      id="hipSize"
                      value={formData.hipSize || ""}
                      onChange={(e) => handleChange("hipSize", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isCarton"
                    checked={formData.isCarton}
                    onCheckedChange={(checked) => handleChange("isCarton", checked)}
                  />
                  <Label htmlFor="isCarton">Sell as Carton</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleChange("featured", checked)}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload images of your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-sm font-medium">Click to upload or drag and drop</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
                  </Label>
                </div>

                {formData.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Current Image</p>
                    <div className="aspect-square w-full max-w-md mx-auto rounded-md overflow-hidden border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

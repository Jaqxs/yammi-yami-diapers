"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, X, Upload, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { useStoreSync } from "@/lib/store-sync"

export default function NewProductPage() {
  const router = useRouter()
  const { addProduct } = useStore()
  const { notifyChange } = useStoreSync()
  const { toast } = useToast()

  // Form state
  const [name, setName] = useState({ en: "", sw: "" })
  const [description, setDescription] = useState({ en: "", sw: "" })
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [wholesalePrice, setWholesalePrice] = useState("")
  const [size, setSize] = useState("")
  const [bundleSize, setBundleSize] = useState("")
  const [cartonSize, setCartonSize] = useState("")
  const [weightRange, setWeightRange] = useState("")
  const [hipSize, setHipSize] = useState("")
  const [stock, setStock] = useState("")
  const [status, setStatus] = useState<"active" | "low_stock" | "out_of_stock" | "draft">("active")
  const [isCarton, setIsCarton] = useState(false)
  const [featured, setFeatured] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("details")

  // Image handling
  const [images, setImages] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...newFiles])

      // Create base64 data URLs for preview
      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
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

    if (!name.en) newErrors.nameEn = "English name is required"
    if (!name.sw) newErrors.nameSw = "Swahili name is required"
    if (!category) newErrors.category = "Category is required"
    if (!price) newErrors.price = "Price is required"
    else if (isNaN(Number(price))) newErrors.price = "Price must be a number"
    if (wholesalePrice && isNaN(Number(wholesalePrice))) newErrors.wholesalePrice = "Wholesale price must be a number"
    if (!bundleSize) newErrors.bundleSize = "Bundle size is required"
    if (!stock) newErrors.stock = "Stock is required"
    else if (isNaN(Number(stock))) newErrors.stock = "Stock must be a number"
    if (!description.en) newErrors.descriptionEn = "English description is required"
    if (!description.sw) newErrors.descriptionSw = "Swahili description is required"

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
      const newProduct = {
        name,
        description,
        category,
        price: Number(price),
        wholesalePrice: wholesalePrice ? Number(wholesalePrice) : undefined,
        size: size || undefined,
        bundleSize,
        cartonSize: cartonSize || undefined,
        image: images.length > 0 ? images[0] : "/assorted-products-display.png",
        tags,
        weightRange: weightRange || undefined,
        hipSize: hipSize || undefined,
        stock: Number(stock),
        status,
        isCarton,
        featured,
      }

      const addedProduct = await addProduct(newProduct)

      // Notify about the new product with the actual product ID
      notifyChange({
        type: "product",
        action: "add",
        id: addedProduct.id, // Now we have the real ID
      })

      toast({
        title: "Product Added",
        description: "The product has been added successfully",
      })

      router.push("/admin/products")
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Enter the basic information about the product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-en">Name (English)</Label>
                    <Input
                      id="name-en"
                      value={name.en}
                      onChange={(e) => setName({ ...name, en: e.target.value })}
                      placeholder="Product name in English"
                      className={errors.nameEn ? "border-red-500" : ""}
                    />
                    {errors.nameEn && <p className="text-sm text-red-500">{errors.nameEn}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name-sw">Name (Swahili)</Label>
                    <Input
                      id="name-sw"
                      value={name.sw}
                      onChange={(e) => setName({ ...name, sw: e.target.value })}
                      placeholder="Product name in Swahili"
                      className={errors.nameSw ? "border-red-500" : ""}
                    />
                    {errors.nameSw && <p className="text-sm text-red-500">{errors.nameSw}</p>}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="babyDiapers">Baby Diapers</SelectItem>
                      <SelectItem value="babyPants">Baby Pants</SelectItem>
                      <SelectItem value="adultDiapers">Adult Diapers</SelectItem>
                      <SelectItem value="ladyPads">Lady Pads</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>

                {/* Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (TZS)</Label>
                    <Input
                      id="price"
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Retail price"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wholesale-price">Wholesale Price (TZS)</Label>
                    <Input
                      id="wholesale-price"
                      type="text"
                      value={wholesalePrice}
                      onChange={(e) => setWholesalePrice(e.target.value)}
                      placeholder="Wholesale price (optional)"
                      className={errors.wholesalePrice ? "border-red-500" : ""}
                    />
                    {errors.wholesalePrice && <p className="text-sm text-red-500">{errors.wholesalePrice}</p>}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select size (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="extraLarge">Extra Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bundle Size */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bundle-size">Bundle Size</Label>
                    <Input
                      id="bundle-size"
                      value={bundleSize}
                      onChange={(e) => setBundleSize(e.target.value)}
                      placeholder="e.g., 10 pieces"
                      className={errors.bundleSize ? "border-red-500" : ""}
                    />
                    {errors.bundleSize && <p className="text-sm text-red-500">{errors.bundleSize}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carton-size">Carton Size</Label>
                    <Input
                      id="carton-size"
                      value={cartonSize}
                      onChange={(e) => setCartonSize(e.target.value)}
                      placeholder="e.g., 100 pieces (optional)"
                    />
                  </div>
                </div>

                {/* Weight Range / Hip Size */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight-range">Weight Range</Label>
                    <Input
                      id="weight-range"
                      value={weightRange}
                      onChange={(e) => setWeightRange(e.target.value)}
                      placeholder="e.g., 3-6 kg (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hip-size">Hip Size</Label>
                    <Input
                      id="hip-size"
                      value={hipSize}
                      onChange={(e) => setHipSize(e.target.value)}
                      placeholder="e.g., 60-90 cm (optional)"
                    />
                  </div>
                </div>

                {/* Stock & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="text"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="Available quantity"
                      className={errors.stock ? "border-red-500" : ""}
                    />
                    {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={(value) => setStatus(value as any)}>
                      <SelectTrigger id="status">
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
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Switches */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="is-carton" checked={isCarton} onCheckedChange={setIsCarton} />
                    <Label htmlFor="is-carton">Sold as Carton</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
                    <Label htmlFor="featured">Featured Product</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
                <CardDescription>Provide detailed information about the product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description-en">Description (English)</Label>
                  <Textarea
                    id="description-en"
                    value={description.en}
                    onChange={(e) => setDescription({ ...description, en: e.target.value })}
                    placeholder="Detailed description in English"
                    rows={6}
                    className={errors.descriptionEn ? "border-red-500" : ""}
                  />
                  {errors.descriptionEn && <p className="text-sm text-red-500">{errors.descriptionEn}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description-sw">Description (Swahili)</Label>
                  <Textarea
                    id="description-sw"
                    value={description.sw}
                    onChange={(e) => setDescription({ ...description, sw: e.target.value })}
                    placeholder="Detailed description in Swahili"
                    rows={6}
                    className={errors.descriptionSw ? "border-red-500" : ""}
                  />
                  {errors.descriptionSw && <p className="text-sm text-red-500">{errors.descriptionSw}</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload images of the product.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-600">Click to upload images</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
                    </Label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                          {index === 0 && <Badge className="absolute top-1 left-1 bg-blue-500">Primary</Badge>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

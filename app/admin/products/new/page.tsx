"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Upload, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addProduct, loadProducts } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [productData, setProductData] = useState({
    name: {
      en: "",
      sw: "",
    },
    category: "",
    description: {
      en: "",
      sw: "",
    },
    price: "",
    wholesalePrice: "",
    size: "",
    bundleSize: "",
    stock: "",
    status: "active",
    isWholesale: false,
    tags: [] as string[],
    images: [] as string[],
  })

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle nested properties
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setProductData({
        ...productData,
        [parent]: {
          ...productData[parent as keyof typeof productData],
          [child]: value,
        },
      })
    } else {
      setProductData({ ...productData, [name]: value })
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setProductData({ ...productData, [name]: value })
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setProductData({ ...productData, [name]: checked })
  }

  // Handle tag changes
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData({
        ...productData,
        tags: [...productData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setProductData({
      ...productData,
      tags: productData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProductData({
            ...productData,
            images: [...productData.images, event.target.result as string],
          })
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (imageToRemove: string) => {
    setProductData({
      ...productData,
      images: productData.images.filter((image) => image !== imageToRemove),
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!productData.name.en || !productData.category || !productData.price || !productData.stock) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Prepare product data
      const newProduct = {
        name: productData.name,
        category: productData.category,
        description: productData.description,
        price: Number(productData.price),
        wholesalePrice: productData.wholesalePrice ? Number(productData.wholesalePrice) : undefined,
        size: productData.size || undefined,
        bundleSize: productData.bundleSize ? Number(productData.bundleSize) : undefined,
        stock: Number(productData.stock),
        status: productData.status as "active" | "low_stock" | "out_of_stock" | "draft",
        tags: productData.tags,
        image: productData.images.length > 0 ? productData.images[0] : "/assorted-products-display.png",
      }

      // Add product to store
      await addProduct(newProduct)

      toast({
        title: "Product created",
        description: "The product has been created successfully",
      })

      // Force a refresh of products by calling loadProducts before navigating
      await loadProducts()

      // Navigate back to products page
      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to add product:", error)
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    router.push("/admin/products")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">Add New Product</h1>
          <p className="text-gray-500">Create a new product in your inventory</p>
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
                Save Product
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="attributes">Attributes</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic information about the product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name.en">Product Name (English)</Label>
                  <Input
                    id="name.en"
                    name="name.en"
                    value={productData.name.en}
                    onChange={handleChange}
                    placeholder="Enter product name in English"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name.sw">Product Name (Swahili)</Label>
                  <Input
                    id="name.sw"
                    name="name.sw"
                    value={productData.name.sw}
                    onChange={handleChange}
                    placeholder="Enter product name in Swahili"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={productData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                    <SelectTrigger id="category">
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
                  <Label htmlFor="description.en">Description (English)</Label>
                  <Textarea
                    id="description.en"
                    name="description.en"
                    value={productData.description.en}
                    onChange={handleChange}
                    placeholder="Enter product description in English"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description.sw">Description (Swahili)</Label>
                  <Textarea
                    id="description.sw"
                    name="description.sw"
                    value={productData.description.sw}
                    onChange={handleChange}
                    placeholder="Enter product description in Swahili"
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={productData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
                <CardDescription>Set prices and manage inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Retail Price (TZS)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={productData.price}
                    onChange={handleChange}
                    placeholder="Enter retail price"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="isWholesale"
                    checked={productData.isWholesale}
                    onCheckedChange={(checked) => handleSwitchChange("isWholesale", checked)}
                  />
                  <Label htmlFor="isWholesale">This product is available for wholesale</Label>
                </div>

                {productData.isWholesale && (
                  <div className="space-y-2">
                    <Label htmlFor="wholesalePrice">Wholesale Price (TZS)</Label>
                    <Input
                      id="wholesalePrice"
                      name="wholesalePrice"
                      type="number"
                      value={productData.wholesalePrice}
                      onChange={handleChange}
                      placeholder="Enter wholesale price"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bundleSize">Bundle Size (pieces)</Label>
                    <Input
                      id="bundleSize"
                      name="bundleSize"
                      type="number"
                      value={productData.bundleSize}
                      onChange={handleChange}
                      placeholder="Number of pieces per bundle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select value={productData.size} onValueChange={(value) => handleSelectChange("size", value)}>
                      <SelectTrigger id="size">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="extraLarge">Extra Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={productData.stock}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    required
                  />
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
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Label htmlFor="images" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <span className="text-sm font-medium">Click to upload or drag and drop</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</span>
                  </Label>
                </div>

                {productData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {productData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(image)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attributes Tab */}
          <TabsContent value="attributes">
            <Card>
              <CardHeader>
                <CardTitle>Product Attributes</CardTitle>
                <CardDescription>Add additional information about the product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {productData.tags.map((tag, index) => (
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
                  <p className="text-xs text-gray-500 mt-1">
                    Examples: bestSeller, newArrival, highAbsorption, japanStandard
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}

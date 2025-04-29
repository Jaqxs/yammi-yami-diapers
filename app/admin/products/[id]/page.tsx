"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"

export default function ViewProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { state, loadProducts, deleteProduct } = useStore()
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        await loadProducts()
        const productId = Number(params.id)
        const foundProduct = state.products.find((p) => p.id === productId)

        if (foundProduct) {
          setProduct(foundProduct)
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
  }, [params.id, loadProducts, state.products, router, toast])

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteProduct(product.id)
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      })
      router.push("/admin/products")
    } catch (error) {
      console.error("Failed to delete product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString()}`
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

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">{product.name.en}</h1>
          <p className="text-gray-500">View product details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/products")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            className="bg-yammy-blue hover:bg-yammy-dark-blue"
            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

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
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Product Name (English)</h3>
                  <p className="text-lg font-medium">{product.name.en}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Product Name (Swahili)</h3>
                  <p className="text-lg font-medium">{product.name.sw || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                  <p className="text-lg font-medium">
                    {product.category === "babyDiapers" && "Baby Diapers"}
                    {product.category === "babyPants" && "Baby Pants"}
                    {product.category === "adultDiapers" && "Adult Diapers"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <Badge
                    variant={
                      product.status === "active"
                        ? "default"
                        : product.status === "low_stock"
                          ? "warning"
                          : "destructive"
                    }
                    className={
                      product.status === "active"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : product.status === "low_stock"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                    }
                  >
                    {product.status === "active" && "Active"}
                    {product.status === "low_stock" && "Low Stock"}
                    {product.status === "out_of_stock" && "Out of Stock"}
                    {product.status === "draft" && "Draft"}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description (English)</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.description.en || "No description available"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Description (Swahili)</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {product.description.sw || "No description available"}
                </p>
              </div>

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string, index: number) => (
                      <Badge key={index} className="bg-yammy-light-blue text-yammy-blue hover:bg-yammy-light-blue">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Retail Price</h3>
                  <p className="text-lg font-medium">{formatCurrency(product.price)}</p>
                </div>
                {product.wholesalePrice && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Wholesale Price</h3>
                    <p className="text-lg font-medium">{formatCurrency(product.wholesalePrice)}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Stock Quantity</h3>
                  <p className="text-lg font-medium">{product.stock} units</p>
                </div>
                {product.size && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Size</h3>
                    <p className="text-lg font-medium">{product.size}</p>
                  </div>
                )}
                {product.bundleSize && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bundle Size</h3>
                    <p className="text-lg font-medium">{product.bundleSize} pieces</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Featured Product</h3>
                  <p className="text-lg font-medium">{product.featured ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Images of the product</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full max-w-md mx-auto rounded-md overflow-hidden border mb-6">
                <div className="relative h-full w-full">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name.en}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.name.en}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

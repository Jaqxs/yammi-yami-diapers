"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/admin/pagination"

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Premium Baby Diapers",
    category: "babyDiapers",
    price: 18000,
    wholesalePrice: 16000,
    size: "small",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/baby%20diaper.jpg-8TUQ8NXCalui3IondSW0pGQKZezKI1.jpeg",
    stock: 120,
    status: "active",
  },
  {
    id: 2,
    name: "Baby Pull-up Pants",
    category: "babyPants",
    price: 20000,
    wholesalePrice: 17000,
    size: "medium",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.41_542754ce.jpg-SYaYX5HxpNniNUoMc0trj7485kedRl.jpeg",
    stock: 85,
    status: "active",
  },
  {
    id: 3,
    name: "Baby Pull-up Pants",
    category: "babyPants",
    price: 20000,
    wholesalePrice: 17000,
    size: "large",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.43_dd271f0f.jpg-EYQ4FIQyCghuaa0E0kwbpKWsBDNaPZ.jpeg",
    stock: 65,
    status: "active",
  },
  {
    id: 4,
    name: "Baby Pull-up Pants",
    category: "babyPants",
    price: 20000,
    wholesalePrice: 17000,
    size: "extraLarge",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.43_3881eb83.jpg-ZdF7ILkVtnX1FsSUkScmxFA9hZhGVe.jpeg",
    stock: 42,
    status: "active",
  },
  {
    id: 5,
    name: "Adult Pants",
    category: "adultDiapers",
    price: 25000,
    wholesalePrice: 22000,
    size: "large",
    bundleSize: 20,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adult%20pants.jpg-eYvgmKtmGCITzb488aMf7pcNvB16Y2.jpeg",
    stock: 30,
    status: "active",
  },
  {
    id: 6,
    name: "Baby Wipes",
    category: "babyDiapers",
    price: 4000,
    wholesalePrice: 3500,
    bundleSize: 120,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.35_9bc82b01.jpg-UGTLfNsjPhFwjcUEg1g1UZu7SxWXrS.jpeg",
    stock: 200,
    status: "active",
  },
  {
    id: 7,
    name: "Premium Royal Baby Pants",
    category: "babyPants",
    price: 22000,
    wholesalePrice: 19000,
    size: "large",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.41_542754ce.jpg-SYaYX5HxpNniNUoMc0trj7485kedRl.jpeg",
    stock: 15,
    status: "low_stock",
  },
  {
    id: 8,
    name: "Wholesale Carton - Baby Pants",
    category: "babyPants",
    price: 103000,
    isCarton: true,
    size: "medium",
    cartonSize: "50pcs x 6 packs",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.33_052ce928.jpg-JNRalaEhieJuq7sRcGf2ZHIm0Erups.jpeg",
    stock: 8,
    status: "active",
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id))
    }
  }

  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== id))
    } else {
      setSelectedProducts([...selectedProducts, id])
    }
  }

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setProductToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      setProducts(products.filter((p) => p.id !== productToDelete))
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully",
      })
    } else if (selectedProducts.length > 0) {
      setProducts(products.filter((p) => !selectedProducts.includes(p.id)))
      setSelectedProducts([])
      toast({
        title: "Products deleted",
        description: `${selectedProducts.length} products have been deleted successfully`,
      })
    }
    setIsDeleteDialogOpen(false)
    setProductToDelete(null)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `TZS ${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-yammy-blue hover:bg-yammy-dark-blue">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
          {selectedProducts.length > 0 && (
            <Button
              variant="outline"
              className="border-red-300 text-red-500 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="babyDiapers">Baby Diapers</SelectItem>
            <SelectItem value="babyPants">Baby Pants</SelectItem>
            <SelectItem value="adultDiapers">Adult Diapers</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="md:w-[100px]">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Products Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={8} className="h-16">
                    <div className="w-full h-8 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleSelectProduct(product.id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-gray-500">
                        {product.size && `Size: ${product.size}`}
                        {product.bundleSize && `, ${product.bundleSize} pcs`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.category === "babyDiapers" && "Baby Diapers"}
                    {product.category === "babyPants" && "Baby Pants"}
                    {product.category === "adultDiapers" && "Adult Diapers"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatCurrency(product.price)}</span>
                      {product.wholesalePrice && (
                        <span className="text-xs text-gray-500">
                          Wholesale: {formatCurrency(product.wholesalePrice)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
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
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination totalItems={filteredProducts.length} itemsPerPage={10} currentPage={1} onPageChange={() => {}} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {productToDelete
                ? "Are you sure you want to delete this product? This action cannot be undone."
                : `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

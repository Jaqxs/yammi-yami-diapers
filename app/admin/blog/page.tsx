"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Filter, Edit, Trash2, MoreHorizontal, Eye, Calendar, Clock, Star } from "lucide-react"

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

// Mock blog post data
const mockBlogPosts = [
  {
    id: 1,
    title: "How to Choose the Right Diaper Size for Your Baby",
    excerpt: "Learn how to measure your baby and choose the perfect diaper size to ensure comfort and prevent leaks.",
    date: "2023-06-15",
    readTime: 5,
    category: "babyHealth",
    image: "/images/baby-diapers.png",
    tags: ["newborn", "tips"],
    featured: true,
    status: "published",
    author: "Admin",
  },
  {
    id: 2,
    title: "Understanding Diaper Rash: Causes and Prevention",
    excerpt:
      "Discover the common causes of diaper rash and effective strategies to prevent it and keep your baby comfortable.",
    date: "2023-07-20",
    readTime: 8,
    category: "babyHealth",
    image: "/images/baby-with-products.png",
    tags: ["skinCare", "tips"],
    featured: false,
    status: "published",
    author: "Admin",
  },
  {
    id: 3,
    title: "The Benefits of High-Absorption Diapers for Overnight Use",
    excerpt:
      "Learn why high-absorption diapers are essential for peaceful nights and how they help improve your baby's sleep quality.",
    date: "2023-08-05",
    readTime: 6,
    category: "productInfo",
    image: "/images/diaper-features.png",
    tags: ["sleep", "tips"],
    featured: true,
    status: "published",
    author: "Admin",
  },
  {
    id: 4,
    title: "Potty Training: Signs Your Child is Ready",
    excerpt:
      "Recognize the signs that indicate your child is ready to start potty training and learn tips for a smooth transition.",
    date: "2023-09-10",
    readTime: 10,
    category: "parentingTips",
    image: "/images/baby-with-products.png",
    tags: ["pottyTraining", "tips"],
    featured: false,
    status: "published",
    author: "Admin",
  },
  {
    id: 5,
    title: "Nutrition for Healthy Skin: Foods That Help Prevent Diaper Rash",
    excerpt:
      "Discover how your baby's diet can impact skin health and which foods can help reduce the risk of diaper rash.",
    date: "2023-10-15",
    readTime: 7,
    category: "babyHealth",
    image: "/images/model-with-diapers.png",
    tags: ["nutrition", "skinCare"],
    featured: false,
    status: "draft",
    author: "Admin",
  },
  {
    id: 6,
    title: "New Product Launch: Introducing Our Eco-Friendly Diaper Line",
    excerpt:
      "Learn about our new eco-friendly diaper line that offers the same quality and comfort while being better for the environment.",
    date: "2023-11-20",
    readTime: 5,
    category: "latestNews",
    image: "/images/diaper-sizes.png",
    tags: ["productInfo"],
    featured: true,
    status: "published",
    author: "Admin",
  },
]

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState(mockBlogPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter blog posts based on search and filters
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter
    const matchesStatus = statusFilter === "all" || post.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  // Handle bulk selection
  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map((p) => p.id))
    }
  }

  const handleSelectPost = (id: number) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter((p) => p !== id))
    } else {
      setSelectedPosts([...selectedPosts, id])
    }
  }

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setPostToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (postToDelete) {
      setBlogPosts(blogPosts.filter((p) => p.id !== postToDelete))
      toast({
        title: "Article deleted",
        description: "The article has been deleted successfully",
      })
    } else if (selectedPosts.length > 0) {
      setBlogPosts(blogPosts.filter((p) => !selectedPosts.includes(p.id)))
      setSelectedPosts([])
      toast({
        title: "Articles deleted",
        description: `${selectedPosts.length} articles have been deleted successfully`,
      })
    }
    setIsDeleteDialogOpen(false)
    setPostToDelete(null)
  }

  // Handle toggle featured
  const handleToggleFeatured = (id: number) => {
    setBlogPosts(blogPosts.map((post) => (post.id === id ? { ...post, featured: !post.featured } : post)))

    const post = blogPosts.find((p) => p.id === id)
    if (post) {
      toast({
        title: post.featured ? "Removed from featured" : "Added to featured",
        description: `"${post.title}" has been ${post.featured ? "removed from" : "added to"} featured articles`,
      })
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bubblegum text-yammy-dark-blue">Blog Articles</h1>
          <p className="text-gray-500">Manage your blog content</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-yammy-blue hover:bg-yammy-dark-blue">
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Article
            </Link>
          </Button>
          {selectedPosts.length > 0 && (
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
            placeholder="Search articles..."
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
            <SelectItem value="babyHealth">Baby Health</SelectItem>
            <SelectItem value="parentingTips">Parenting Tips</SelectItem>
            <SelectItem value="productInfo">Product Info</SelectItem>
            <SelectItem value="latestNews">Latest News</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="md:w-[100px]">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Blog Posts Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={7} className="h-16">
                    <div className="w-full h-8 bg-gray-200 animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No articles found
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={() => handleSelectPost(post.id)}
                      aria-label={`Select ${post.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{post.title}</span>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.readTime} min read
                        </span>
                        {post.featured && (
                          <Badge className="bg-yammy-orange text-white hover:bg-yammy-orange">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {post.category === "babyHealth" && "Baby Health"}
                      {post.category === "parentingTips" && "Parenting Tips"}
                      {post.category === "productInfo" && "Product Info"}
                      {post.category === "latestNews" && "Latest News"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                      {formatDate(post.date)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.status === "published" ? "default" : "outline"}
                      className={
                        post.status === "published"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                      }
                    >
                      {post.status === "published" ? "Published" : "Draft"}
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
                          <Link href={`/blog/${post.id}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blog/${post.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(post.id)}>
                          <Star className="mr-2 h-4 w-4" />
                          {post.featured ? "Remove from Featured" : "Add to Featured"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-500"
                          onClick={() => handleDeleteClick(post.id)}
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
      <Pagination totalItems={filteredPosts.length} itemsPerPage={10} currentPage={1} onPageChange={() => {}} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {postToDelete
                ? "Are you sure you want to delete this article? This action cannot be undone."
                : `Are you sure you want to delete ${selectedPosts.length} selected articles? This action cannot be undone.`}
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

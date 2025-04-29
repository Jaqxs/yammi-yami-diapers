"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { mockProducts } from "@/data/mock-products"
import { mockOrders } from "@/data/mock-orders"
import { mockBlogPosts } from "@/data/mock-blog-posts"

// Define types for our state
export type Product = {
  id: number
  name: {
    en: string
    sw: string
  }
  category: string
  price: number
  wholesalePrice?: number
  size?: string
  bundleSize?: string
  cartonSize?: string
  image: string
  tags?: string[]
  weightRange?: string
  hipSize?: string
  description: {
    en: string
    sw: string
  }
  stock: number
  status: "active" | "low_stock" | "out_of_stock" | "draft"
  isCarton?: boolean
  featured?: boolean
}

export type Order = {
  id: string
  customer: string
  email: string
  phone: string
  date: string
  total: number
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled"
  items: {
    id: number
    name: string
    quantity: number
    price: number
  }[]
  paymentMethod: string
  shippingAddress: string
}

export type BlogPost = {
  id: number
  title: {
    en: string
    sw: string
  }
  excerpt: {
    en: string
    sw: string
  }
  content?: {
    en: string
    sw: string
  }
  date: string
  readTime: number
  category: string
  image: string
  tags: string[]
  featured: boolean
  status: "published" | "draft"
  author:
    | string
    | {
        name: string
        avatar: string
      }
}

interface AppState {
  products: Product[]
  orders: Order[]
  blogPosts: BlogPost[]
  lastUpdated: {
    products: number
    orders: number
    blogPosts: number
  }
}

// Store context
const StoreContext = createContext<{
  state: AppState
  loadProducts: () => Promise<void>
  loadOrders: () => Promise<void>
  loadBlogPosts: () => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<Product>
  updateProduct: (product: Product) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  addBlogPost: (blogPost: Omit<BlogPost, "id">) => Promise<BlogPost>
  updateBlogPost: (blogPost: BlogPost) => Promise<void>
  deleteBlogPost: (id: number) => Promise<void>
  refreshData: () => Promise<void>
}>({
  state: {
    products: [],
    orders: [],
    blogPosts: [],
    lastUpdated: {
      products: 0,
      orders: 0,
      blogPosts: 0,
    },
  },
  loadProducts: async () => {},
  loadOrders: async () => {},
  loadBlogPosts: async () => {},
  addProduct: async () => ({ id: 0 }) as Product,
  updateProduct: async () => {},
  deleteProduct: async () => {},
  addBlogPost: async () => ({ id: 0 }) as BlogPost,
  updateBlogPost: async () => {},
  deleteBlogPost: async () => {},
  refreshData: async () => {},
})

// Provider component
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    products: [],
    orders: [],
    blogPosts: [],
    lastUpdated: {
      products: 0,
      orders: 0,
      blogPosts: 0,
    },
  })

  // Load products from localStorage or mock data
  const loadProducts = useCallback(async () => {
    try {
      const storedProducts = localStorage.getItem("yammy-products")
      if (storedProducts) {
        setState((prev) => ({
          ...prev,
          products: JSON.parse(storedProducts),
          lastUpdated: {
            ...prev.lastUpdated,
            products: Date.now(),
          },
        }))
      } else {
        setState((prev) => ({
          ...prev,
          products: mockProducts,
          lastUpdated: {
            ...prev.lastUpdated,
            products: Date.now(),
          },
        }))
        localStorage.setItem("yammy-products", JSON.stringify(mockProducts))
      }
    } catch (error) {
      console.error("Failed to load products:", error)
    }
  }, [])

  // Load orders from localStorage or mock data
  const loadOrders = useCallback(async () => {
    try {
      const storedOrders = localStorage.getItem("yammy-orders")
      if (storedOrders) {
        setState((prev) => ({
          ...prev,
          orders: JSON.parse(storedOrders),
          lastUpdated: {
            ...prev.lastUpdated,
            orders: Date.now(),
          },
        }))
      } else {
        setState((prev) => ({
          ...prev,
          orders: mockOrders,
          lastUpdated: {
            ...prev.lastUpdated,
            orders: Date.now(),
          },
        }))
        localStorage.setItem("yammy-orders", JSON.stringify(mockOrders))
      }
    } catch (error) {
      console.error("Failed to load orders:", error)
    }
  }, [])

  // Load blog posts from localStorage or mock data
  const loadBlogPosts = useCallback(async () => {
    try {
      const storedBlogPosts = localStorage.getItem("yammy-blog-posts")
      if (storedBlogPosts) {
        setState((prev) => ({
          ...prev,
          blogPosts: JSON.parse(storedBlogPosts),
          lastUpdated: {
            ...prev.lastUpdated,
            blogPosts: Date.now(),
          },
        }))
      } else {
        setState((prev) => ({
          ...prev,
          blogPosts: mockBlogPosts,
          lastUpdated: {
            ...prev.lastUpdated,
            blogPosts: Date.now(),
          },
        }))
        localStorage.setItem("yammy-blog-posts", JSON.stringify(mockBlogPosts))
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error)
    }
  }, [])

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([loadProducts(), loadOrders(), loadBlogPosts()])
  }, [loadProducts, loadOrders, loadBlogPosts])

  // Add a new product
  const addProduct = useCallback(
    async (product: Omit<Product, "id">): Promise<Product> => {
      try {
        const products = [...state.products]
        const maxId = Math.max(...products.map((p) => p.id), 0)
        const newProduct = {
          ...product,
          id: maxId + 1,
        } as Product

        products.push(newProduct)
        localStorage.setItem("yammy-products", JSON.stringify(products))

        setState((prev) => ({
          ...prev,
          products,
          lastUpdated: {
            ...prev.lastUpdated,
            products: Date.now(),
          },
        }))

        // Make sure we return the newly created product with its ID
        return newProduct
      } catch (error) {
        console.error("Failed to add product:", error)
        throw error
      }
    },
    [state.products],
  )

  // Update an existing product
  const updateProduct = useCallback(
    async (product: Product) => {
      try {
        const products = [...state.products]
        const index = products.findIndex((p) => p.id === product.id)

        if (index !== -1) {
          products[index] = product
          localStorage.setItem("yammy-products", JSON.stringify(products))

          setState((prev) => ({
            ...prev,
            products,
            lastUpdated: {
              ...prev.lastUpdated,
              products: Date.now(),
            },
          }))
        }
      } catch (error) {
        console.error("Failed to update product:", error)
        throw error
      }
    },
    [state.products],
  )

  // Delete a product
  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        const products = state.products.filter((p) => p.id !== id)
        localStorage.setItem("yammy-products", JSON.stringify(products))

        setState((prev) => ({
          ...prev,
          products,
          lastUpdated: {
            ...prev.lastUpdated,
            products: Date.now(),
          },
        }))
      } catch (error) {
        console.error("Failed to delete product:", error)
        throw error
      }
    },
    [state.products],
  )

  // Add a new blog post
  const addBlogPost = useCallback(
    async (blogPost: Omit<BlogPost, "id">): Promise<BlogPost> => {
      try {
        const blogPosts = [...state.blogPosts]
        const maxId = Math.max(...blogPosts.map((p) => p.id), 0)
        const newBlogPost = {
          ...blogPost,
          id: maxId + 1,
        } as BlogPost

        blogPosts.push(newBlogPost)
        localStorage.setItem("yammy-blog-posts", JSON.stringify(blogPosts))

        setState((prev) => ({
          ...prev,
          blogPosts,
          lastUpdated: {
            ...prev.lastUpdated,
            blogPosts: Date.now(),
          },
        }))

        return newBlogPost
      } catch (error) {
        console.error("Failed to add blog post:", error)
        throw error
      }
    },
    [state.blogPosts],
  )

  // Update an existing blog post
  const updateBlogPost = useCallback(
    async (blogPost: BlogPost) => {
      try {
        const blogPosts = [...state.blogPosts]
        const index = blogPosts.findIndex((p) => p.id === blogPost.id)

        if (index !== -1) {
          blogPosts[index] = blogPost
          localStorage.setItem("yammy-blog-posts", JSON.stringify(blogPosts))

          setState((prev) => ({
            ...prev,
            blogPosts,
            lastUpdated: {
              ...prev.lastUpdated,
              blogPosts: Date.now(),
            },
          }))
        }
      } catch (error) {
        console.error("Failed to update blog post:", error)
        throw error
      }
    },
    [state.blogPosts],
  )

  // Delete a blog post
  const deleteBlogPost = useCallback(
    async (id: number) => {
      try {
        const blogPosts = state.blogPosts.filter((p) => p.id !== id)
        localStorage.setItem("yammy-blog-posts", JSON.stringify(blogPosts))

        setState((prev) => ({
          ...prev,
          blogPosts,
          lastUpdated: {
            ...prev.lastUpdated,
            blogPosts: Date.now(),
          },
        }))
      } catch (error) {
        console.error("Failed to delete blog post:", error)
        throw error
      }
    },
    [state.blogPosts],
  )

  return (
    <StoreContext.Provider
      value={{
        state,
        loadProducts,
        loadOrders,
        loadBlogPosts,
        addProduct,
        updateProduct,
        deleteProduct,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

// Custom hook to use the store context
export const useStore = () => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

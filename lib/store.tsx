"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react"

// Define types for our data models
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
  author: string
}

// Define the state shape
type StoreState = {
  products: Product[]
  orders: Order[]
  blogPosts: BlogPost[]
  isLoading: boolean
  error: string | null
  lastUpdated: number
}

// Define action types
type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: number }
  | { type: "SET_ORDERS"; payload: Order[] }
  | { type: "ADD_ORDER"; payload: Order }
  | { type: "UPDATE_ORDER"; payload: Order }
  | { type: "DELETE_ORDER"; payload: string }
  | { type: "SET_BLOG_POSTS"; payload: BlogPost[] }
  | { type: "ADD_BLOG_POST"; payload: BlogPost }
  | { type: "UPDATE_BLOG_POST"; payload: BlogPost }
  | { type: "DELETE_BLOG_POST"; payload: number }
  | { type: "SET_FEATURED_PRODUCT"; payload: { id: number; featured: boolean } }
  | { type: "SET_FEATURED_BLOG_POST"; payload: { id: number; featured: boolean } }

// Initial state
const initialState: StoreState = {
  products: [],
  orders: [],
  blogPosts: [],
  isLoading: false,
  error: null,
  lastUpdated: Date.now(),
}

// Create reducer
const storeReducer = (state: StoreState, action: Action): StoreState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_PRODUCTS":
      return { ...state, products: action.payload, lastUpdated: Date.now() }
    case "ADD_PRODUCT":
      return {
        ...state,
        products: [...state.products, action.payload],
        lastUpdated: Date.now(),
      }
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) => (product.id === action.payload.id ? action.payload : product)),
        lastUpdated: Date.now(),
      }
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
        lastUpdated: Date.now(),
      }
    case "SET_ORDERS":
      return { ...state, orders: action.payload, lastUpdated: Date.now() }
    case "ADD_ORDER":
      return {
        ...state,
        orders: [...state.orders, action.payload],
        lastUpdated: Date.now(),
      }
    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map((order) => (order.id === action.payload.id ? action.payload : order)),
        lastUpdated: Date.now(),
      }
    case "DELETE_ORDER":
      return {
        ...state,
        orders: state.orders.filter((order) => order.id !== action.payload),
        lastUpdated: Date.now(),
      }
    case "SET_BLOG_POSTS":
      return { ...state, blogPosts: action.payload, lastUpdated: Date.now() }
    case "ADD_BLOG_POST":
      return {
        ...state,
        blogPosts: [...state.blogPosts, action.payload],
        lastUpdated: Date.now(),
      }
    case "UPDATE_BLOG_POST":
      return {
        ...state,
        blogPosts: state.blogPosts.map((post) => (post.id === action.payload.id ? action.payload : post)),
        lastUpdated: Date.now(),
      }
    case "DELETE_BLOG_POST":
      return {
        ...state,
        blogPosts: state.blogPosts.filter((post) => post.id !== action.payload),
        lastUpdated: Date.now(),
      }
    case "SET_FEATURED_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? { ...product, featured: action.payload.featured } : product,
        ),
        lastUpdated: Date.now(),
      }
    case "SET_FEATURED_BLOG_POST":
      return {
        ...state,
        blogPosts: state.blogPosts.map((post) =>
          post.id === action.payload.id ? { ...post, featured: action.payload.featured } : post,
        ),
        lastUpdated: Date.now(),
      }
    default:
      return state
  }
}

// Create context
type StoreContextType = {
  state: StoreState
  dispatch: React.Dispatch<Action>
  loadProducts: () => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  setFeaturedProduct: (id: number, featured: boolean) => Promise<void>
  loadOrders: () => Promise<void>
  addOrder: (order: Omit<Order, "id">) => Promise<void>
  updateOrder: (order: Order) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
  loadBlogPosts: () => Promise<void>
  addBlogPost: (post: Omit<BlogPost, "id">) => Promise<void>
  updateBlogPost: (post: BlogPost) => Promise<void>
  deleteBlogPost: (id: number) => Promise<void>
  setFeaturedBlogPost: (id: number, featured: boolean) => Promise<void>
  getFeaturedProducts: (limit?: number) => Product[]
  getFeaturedBlogPosts: (limit?: number) => BlogPost[]
  refreshData: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Mock data for initial load
import { mockProducts } from "@/data/mock-products"
import { mockOrders } from "@/data/mock-orders"
import { mockBlogPosts } from "@/data/mock-blog-posts"

// Provider component
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState)

  // Load data from localStorage or initialize with mock data
  const initializeData = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      // Products
      const storedProducts = localStorage.getItem("yammy-products")
      let products: Product[]
      if (storedProducts) {
        products = JSON.parse(storedProducts)
      } else {
        products = mockProducts
        localStorage.setItem("yammy-products", JSON.stringify(products))
      }
      dispatch({ type: "SET_PRODUCTS", payload: products })

      // Orders
      const storedOrders = localStorage.getItem("yammy-orders")
      let orders: Order[]
      if (storedOrders) {
        orders = JSON.parse(storedOrders)
      } else {
        orders = mockOrders
        localStorage.setItem("yammy-orders", JSON.stringify(orders))
      }
      dispatch({ type: "SET_ORDERS", payload: orders })

      // Blog posts
      const storedPosts = localStorage.getItem("yammy-blog-posts")
      let posts: BlogPost[]
      if (storedPosts) {
        posts = JSON.parse(storedPosts)
      } else {
        posts = mockBlogPosts
        localStorage.setItem("yammy-blog-posts", JSON.stringify(posts))
      }
      dispatch({ type: "SET_BLOG_POSTS", payload: posts })
    } catch (error) {
      console.error("Failed to initialize data:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to initialize data" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // Initialize data on mount
  useEffect(() => {
    initializeData()
  }, [initializeData])

  // Refresh data function
  const refreshData = useCallback(async () => {
    await initializeData()
  }, [initializeData])

  // Products CRUD operations
  // Make sure these functions are memoized with useCallback
  const loadProducts = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const storedProducts = localStorage.getItem("yammy-products")
      let products: Product[]

      if (storedProducts) {
        products = JSON.parse(storedProducts)
      } else {
        products = mockProducts
        localStorage.setItem("yammy-products", JSON.stringify(products))
      }

      dispatch({ type: "SET_PRODUCTS", payload: products })
      return products
    } catch (error) {
      console.error("Failed to load products:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load products" })
      return []
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [dispatch])

  const addProduct = useCallback(
    async (product: Omit<Product, "id">) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Generate a new ID
        const newId = state.products.length > 0 ? Math.max(...state.products.map((p) => p.id)) + 1 : 1
        const newProduct = { ...product, id: newId } as Product

        // Add to state
        dispatch({ type: "ADD_PRODUCT", payload: newProduct })

        // Update localStorage
        localStorage.setItem("yammy-products", JSON.stringify([...state.products, newProduct]))
      } catch (error) {
        console.error("Failed to add product:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to add product" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.products],
  )

  const updateProduct = useCallback(
    async (product: Product) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Update in state
        dispatch({ type: "UPDATE_PRODUCT", payload: product })

        // Update localStorage
        const updatedProducts = state.products.map((p) => (p.id === product.id ? product : p))
        localStorage.setItem("yammy-products", JSON.stringify(updatedProducts))
      } catch (error) {
        console.error("Failed to update product:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to update product" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.products],
  )

  const deleteProduct = useCallback(
    async (id: number) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Delete from state
        dispatch({ type: "DELETE_PRODUCT", payload: id })

        // Update localStorage
        const updatedProducts = state.products.filter((p) => p.id !== id)
        localStorage.setItem("yammy-products", JSON.stringify(updatedProducts))
      } catch (error) {
        console.error("Failed to delete product:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to delete product" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.products],
  )

  const setFeaturedProduct = useCallback(
    async (id: number, featured: boolean) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Update in state
        dispatch({ type: "SET_FEATURED_PRODUCT", payload: { id, featured } })

        // Update localStorage
        const updatedProducts = state.products.map((p) => (p.id === id ? { ...p, featured } : p))
        localStorage.setItem("yammy-products", JSON.stringify(updatedProducts))
      } catch (error) {
        console.error("Failed to update featured status:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to update featured status" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.products],
  )

  // Orders CRUD operations
  const loadOrders = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const storedOrders = localStorage.getItem("yammy-orders")
      let orders: Order[]

      if (storedOrders) {
        orders = JSON.parse(storedOrders)
      } else {
        orders = mockOrders
        localStorage.setItem("yammy-orders", JSON.stringify(orders))
      }

      dispatch({ type: "SET_ORDERS", payload: orders })
    } catch (error) {
      console.error("Failed to load orders:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load orders" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const addOrder = useCallback(
    async (order: Omit<Order, "id">) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Generate a new ID
        const orderId = `ORD-${String(state.orders.length + 1).padStart(3, "0")}`
        const newOrder = { ...order, id: orderId } as Order

        // Add to state
        dispatch({ type: "ADD_ORDER", payload: newOrder })

        // Update localStorage
        localStorage.setItem("yammy-orders", JSON.stringify([...state.orders, newOrder]))
      } catch (error) {
        console.error("Failed to add order:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to add order" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.orders],
  )

  const updateOrder = useCallback(
    async (order: Order) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Update in state
        dispatch({ type: "UPDATE_ORDER", payload: order })

        // Update localStorage
        const updatedOrders = state.orders.map((o) => (o.id === order.id ? order : o))
        localStorage.setItem("yammy-orders", JSON.stringify(updatedOrders))
      } catch (error) {
        console.error("Failed to update order:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to update order" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.orders],
  )

  const deleteOrder = useCallback(
    async (id: string) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Delete from state
        dispatch({ type: "DELETE_ORDER", payload: id })

        // Update localStorage
        const updatedOrders = state.orders.filter((o) => o.id !== id)
        localStorage.setItem("yammy-orders", JSON.stringify(updatedOrders))
      } catch (error) {
        console.error("Failed to delete order:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to delete order" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.orders],
  )

  // Blog posts CRUD operations
  const loadBlogPosts = useCallback(async () => {
    try {
      // Simulate API call
      const posts = mockBlogPosts
      dispatch({ type: "SET_BLOG_POSTS", payload: posts })
      return posts
    } catch (error) {
      console.error("Error loading blog posts:", error)
      return []
    }
  }, [dispatch])

  const addBlogPost = useCallback(
    async (post: Omit<BlogPost, "id">) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Generate a new ID
        const newId = state.blogPosts.length > 0 ? Math.max(...state.blogPosts.map((p) => p.id)) + 1 : 1
        const newPost = { ...post, id: newId } as BlogPost

        // Add to state
        dispatch({ type: "ADD_BLOG_POST", payload: newPost })

        // Update localStorage
        localStorage.setItem("yammy-blog-posts", JSON.stringify([...state.blogPosts, newPost]))
      } catch (error) {
        console.error("Failed to add blog post:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to add blog post" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.blogPosts],
  )

  const updateBlogPost = useCallback(
    async (post: BlogPost) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Update in state
        dispatch({ type: "UPDATE_BLOG_POST", payload: post })

        // Update localStorage
        const updatedPosts = state.blogPosts.map((p) => (p.id === post.id ? post : p))
        localStorage.setItem("yammy-blog-posts", JSON.stringify(updatedPosts))
      } catch (error) {
        console.error("Failed to update blog post:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to update blog post" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.blogPosts],
  )

  const deleteBlogPost = useCallback(
    async (id: number) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Delete from state
        dispatch({ type: "DELETE_BLOG_POST", payload: id })

        // Update localStorage
        const updatedPosts = state.blogPosts.filter((p) => p.id !== id)
        localStorage.setItem("yammy-blog-posts", JSON.stringify(updatedPosts))
      } catch (error) {
        console.error("Failed to delete blog post:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to delete blog post" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.blogPosts],
  )

  const setFeaturedBlogPost = useCallback(
    async (id: number, featured: boolean) => {
      dispatch({ type: "SET_LOADING", payload: true })
      try {
        // Update in state
        dispatch({ type: "SET_FEATURED_BLOG_POST", payload: { id, featured } })

        // Update localStorage
        const updatedPosts = state.blogPosts.map((p) => (p.id === id ? { ...p, featured } : p))
        localStorage.setItem("yammy-blog-posts", JSON.stringify(updatedPosts))
      } catch (error) {
        console.error("Failed to update featured status:", error)
        dispatch({ type: "SET_ERROR", payload: "Failed to update featured status" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.blogPosts],
  )

  // Helper functions to get featured items
  const getFeaturedProducts = useCallback(
    (limit?: number) => {
      const featured = state.products.filter((p) => p.featured).sort((a, b) => b.id - a.id)
      return limit ? featured.slice(0, limit) : featured
    },
    [state.products],
  )

  const getFeaturedBlogPosts = useCallback(
    (limit?: number) => {
      const featured = state.blogPosts
        .filter((p) => p.featured)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      return limit ? featured.slice(0, limit) : featured
    },
    [state.blogPosts],
  )

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        setFeaturedProduct,
        loadOrders,
        addOrder,
        updateOrder,
        deleteOrder,
        loadBlogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        setFeaturedBlogPost,
        getFeaturedProducts,
        getFeaturedBlogPosts,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

// Custom hook to use the store
export const useStore = () => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

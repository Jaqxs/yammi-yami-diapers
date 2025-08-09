"use client"
import type React from "react"

import { createContext, useContext, useCallback, useState, useMemo } from "react"
import { mockProducts } from "@/data/mock-products"
import { mockOrders } from "@/data/mock-orders"
import { mockBlogPosts } from "@/data/mock-blog-posts"
import { mockAgents } from "@/data/mock-agents"
import { mockRegistrations } from "@/data/mock-registrations"

// Define types
export interface Product {
  id: number
  name: {
    en: string
    sw: string
  }
  description: {
    en: string
    sw: string
  }
  price: number
  wholesalePrice?: number
  image: string
  category: string
  size?: string
  bundleSize?: number
  cartonSize?: string
  weightRange?: string
  hipSize?: string
  inStock?: boolean
  isCarton?: boolean
  featured?: boolean
  tags?: string[]
  status: "active" | "low_stock" | "out_of_stock" | "draft"
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
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

export interface Registration {
  id: number
  name: string
  email: string
  phone: string
  region: string
  date: string
  paymentReference: string
  status: "pending" | "approved" | "rejected"
  reviewedBy?: string
  reviewDate?: string
  notes?: string
}

export interface Agent {
  id: number
  name: string
  location: string
  phone: string
  region: string
  registrationDate: string
  status: "active" | "inactive"
  tier: "bronze" | "silver" | "gold" | "platinum"
  salesVolume: number
  lastOrderDate: string
}

interface AppState {
  products: Product[]
  orders: Order[]
  blogPosts: BlogPost[]
  agents: Agent[]
  registrations: Registration[]
  lastUpdated: {
    products: number
    orders: number
    blogPosts: number
    agents: number
    registrations: number
  }
}

type NotifyChange = (payload: { type: string; action: string; id: number }) => void

interface StoreContextType {
  state: AppState
  loadProducts: () => Promise<void>
  loadOrders: () => Promise<void>
  loadBlogPosts: () => Promise<void>
  loadAgents: () => Promise<void>
  loadRegistrations: () => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<Product>
  updateProduct: (product: Product) => Promise<void>
  deleteProduct: (id: number) => Promise<void>
  addBlogPost: (blogPost: Omit<BlogPost, "id">) => Promise<BlogPost>
  updateBlogPost: (blogPost: BlogPost) => Promise<void>
  deleteBlogPost: (id: number) => Promise<void>
  addAgent: (agent: Omit<Agent, "id">) => Promise<Agent>
  updateAgent: (agent: Agent) => Promise<void>
  deleteAgent: (id: number) => Promise<void>
  addRegistration: (registration: Omit<Registration, "id" | "date" | "status">) => Promise<Registration>
  updateRegistration: (registration: Registration) => Promise<void>
  deleteRegistration: (id: number) => Promise<void>
  approveRegistration: (id: number, reviewedBy: string, notes?: string) => Promise<void>
  rejectRegistration: (id: number, reviewedBy: string, notes?: string) => Promise<void>
  refreshData: () => Promise<void>
  notifyChange?: NotifyChange
}

// Create context
const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Provider component
export function StoreProvider({ children, notifyChange }: { children: React.ReactNode; notifyChange?: NotifyChange }) {
  const [appState, setState] = useState<AppState>({
    products: [],
    orders: [],
    blogPosts: [],
    agents: [],
    registrations: [],
    lastUpdated: {
      products: 0,
      orders: 0,
      blogPosts: 0,
      agents: 0,
      registrations: 0,
    },
  })

  // Load products from localStorage or mock data
  const loadProducts = useCallback(async () => {
    try {
      // Try to get from localStorage first
      const storedProducts = localStorage.getItem("yammy-products")
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts)
        setState((prev) => ({
          ...prev,
          products: parsedProducts,
          lastUpdated: {
            ...prev.lastUpdated,
            products: Date.now(),
          },
        }))
        return
      }

      // If not in localStorage, use mock data
      // Add timestamp to image URLs to prevent caching
      const productsWithTimestamp = mockProducts.map((product) => ({
        ...product,
        image: product.image ? `${product.image}?t=${Date.now()}` : undefined,
      }))

      setState((prev) => ({
        ...prev,
        products: productsWithTimestamp,
        lastUpdated: {
          ...prev.lastUpdated,
          products: Date.now(),
        },
      }))

      // Store in localStorage for persistence
      localStorage.setItem("yammy-products", JSON.stringify(productsWithTimestamp))
    } catch (error) {
      console.error("Failed to load products:", error)
    }
  }, [])

  // Load orders
  const loadOrders = useCallback(async () => {
    try {
      // Try to get from localStorage first
      const storedOrders = localStorage.getItem("yammy-orders")
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders)
        setState((prev) => ({
          ...prev,
          orders: parsedOrders,
          lastUpdated: {
            ...prev.lastUpdated,
            orders: Date.now(),
          },
        }))
        return
      }

      // If not in localStorage, use mock data
      setState((prev) => ({
        ...prev,
        orders: mockOrders,
        lastUpdated: {
          ...prev.lastUpdated,
          orders: Date.now(),
        },
      }))
      localStorage.setItem("yammy-orders", JSON.stringify(mockOrders))
    } catch (error) {
      console.error("Failed to load orders:", error)
    }
  }, [])

  // Load blog posts
  const loadBlogPosts = useCallback(async () => {
    try {
      // Try to get from localStorage first
      const storedBlogPosts = localStorage.getItem("yammy-blog-posts")
      if (storedBlogPosts) {
        const parsedBlogPosts = JSON.parse(storedBlogPosts)
        setState((prev) => ({
          ...prev,
          blogPosts: parsedBlogPosts,
          lastUpdated: {
            ...prev.lastUpdated,
            blogPosts: Date.now(),
          },
        }))
        return
      }

      // If not in localStorage, use mock data
      setState((prev) => ({
        ...prev,
        blogPosts: mockBlogPosts,
        lastUpdated: {
          ...prev.lastUpdated,
          blogPosts: Date.now(),
        },
      }))
      localStorage.setItem("yammy-blog-posts", JSON.stringify(mockBlogPosts))
    } catch (error) {
      console.error("Failed to load blog posts:", error)
    }
  }, [])

  // Load agents
  const loadAgents = useCallback(async () => {
    try {
      // Try to get from localStorage first
      const storedAgents = localStorage.getItem("yammy-agents")
      if (storedAgents) {
        const parsedAgents = JSON.parse(storedAgents)
        setState((prev) => ({
          ...prev,
          agents: parsedAgents,
          lastUpdated: {
            ...prev.lastUpdated,
            agents: Date.now(),
          },
        }))
        return
      }

      // If not in localStorage, use mock data
      setState((prev) => ({
        ...prev,
        agents: mockAgents,
        lastUpdated: {
          ...prev.lastUpdated,
          agents: Date.now(),
        },
      }))
      localStorage.setItem("yammy-agents", JSON.stringify(mockAgents))
    } catch (error) {
      console.error("Failed to load agents:", error)
    }
  }, [])

  // Load registrations
  const loadRegistrations = useCallback(async () => {
    try {
      // Try to get from localStorage first
      const storedRegistrations = localStorage.getItem("yammy-registrations")
      if (storedRegistrations) {
        const parsedRegistrations = JSON.parse(storedRegistrations)
        setState((prev) => ({
          ...prev,
          registrations: parsedRegistrations,
          lastUpdated: {
            ...prev.lastUpdated,
            registrations: Date.now(),
          },
        }))
        return
      }

      // If not in localStorage, use mock data
      setState((prev) => ({
        ...prev,
        registrations: mockRegistrations,
        lastUpdated: {
          ...prev.lastUpdated,
          registrations: Date.now(),
        },
      }))
      localStorage.setItem("yammy-registrations", JSON.stringify(mockRegistrations))
    } catch (error) {
      console.error("Failed to load registrations:", error)
    }
  }, [])

  // Refresh all data
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([loadProducts(), loadOrders(), loadBlogPosts(), loadAgents(), loadRegistrations()])
      console.log("All data refreshed successfully")
    } catch (error) {
      console.error("Error refreshing data:", error)
    }
  }, [loadProducts, loadOrders, loadBlogPosts, loadAgents, loadRegistrations])

  // Add a new product
  const addProduct = useCallback(
    async (product: Omit<Product, "id">): Promise<Product> => {
      try {
        const products = [...appState.products]
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

        return newProduct
      } catch (error) {
        console.error("Failed to add product:", error)
        throw error
      }
    },
    [appState.products],
  )

  // Update an existing product
  const updateProduct = useCallback(
    async (product: Product) => {
      try {
        const products = [...appState.products]
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
    [appState.products],
  )

  // Delete a product
  const deleteProduct = useCallback(
    async (id: number) => {
      try {
        const products = appState.products.filter((p) => p.id !== id)
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
    [appState.products],
  )

  // Add a new blog post
  const addBlogPost = useCallback(
    async (blogPost: Omit<BlogPost, "id">): Promise<BlogPost> => {
      try {
        const blogPosts = [...appState.blogPosts]
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
    [appState.blogPosts],
  )

  // Update an existing blog post
  const updateBlogPost = useCallback(
    async (blogPost: BlogPost) => {
      try {
        const blogPosts = [...appState.blogPosts]
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
    [appState.blogPosts],
  )

  // Delete a blog post
  const deleteBlogPost = useCallback(
    async (id: number) => {
      try {
        const blogPosts = appState.blogPosts.filter((p) => p.id !== id)
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
    [appState.blogPosts],
  )

  // Add a new agent
  const addAgent = useCallback(
    async (agent: Omit<Agent, "id">): Promise<Agent> => {
      try {
        const agents = [...appState.agents]
        const maxId = Math.max(...agents.map((a) => a.id), 0)
        const newAgent = {
          ...agent,
          id: maxId + 1,
        } as Agent

        agents.push(newAgent)
        localStorage.setItem("yammy-agents", JSON.stringify(agents))

        setState((prev) => ({
          ...prev,
          agents,
          lastUpdated: {
            ...prev.lastUpdated,
            agents: Date.now(),
          },
        }))

        return newAgent
      } catch (error) {
        console.error("Failed to add agent:", error)
        throw error
      }
    },
    [appState.agents],
  )

  // Update an existing agent
  const updateAgent = useCallback(
    async (agent: Agent) => {
      try {
        const agents = [...appState.agents]
        const index = agents.findIndex((a) => a.id === agent.id)

        if (index !== -1) {
          agents[index] = agent
          localStorage.setItem("yammy-agents", JSON.stringify(agents))

          setState((prev) => ({
            ...prev,
            agents,
            lastUpdated: {
              ...prev.lastUpdated,
              agents: Date.now(),
            },
          }))
        }
      } catch (error) {
        console.error("Failed to update agent:", error)
        throw error
      }
    },
    [appState.agents],
  )

  // Delete an agent
  const deleteAgent = useCallback(
    async (id: number) => {
      try {
        const agents = appState.agents.filter((a) => a.id !== id)
        localStorage.setItem("yammy-agents", JSON.stringify(agents))

        setState((prev) => ({
          ...prev,
          agents,
          lastUpdated: {
            ...prev.lastUpdated,
            agents: Date.now(),
          },
        }))
      } catch (error) {
        console.error("Failed to delete agent:", error)
        throw error
      }
    },
    [appState.agents],
  )

  // Add a new registration
  const addRegistration = useCallback(
    async (registration: Omit<Registration, "id" | "date" | "status">): Promise<Registration> => {
      try {
        const registrations = [...appState.registrations]
        const maxId = Math.max(...registrations.map((r) => r.id), 0)
        const newRegistration = {
          ...registration,
          id: maxId + 1,
          date: new Date().toISOString(),
          status: "pending" as const,
        }

        registrations.push(newRegistration)
        localStorage.setItem("yammy-registrations", JSON.stringify(registrations))

        setState((prev) => ({
          ...prev,
          registrations,
          lastUpdated: {
            ...prev.lastUpdated,
            registrations: Date.now(),
          },
        }))

        // Notify about the change
        if (notifyChange) {
          notifyChange({
            type: "registration",
            action: "add",
            id: newRegistration.id,
          })
        }

        return newRegistration
      } catch (error) {
        console.error("Failed to add registration:", error)
        throw error
      }
    },
    [appState.registrations, notifyChange],
  )

  // Update an existing registration
  const updateRegistration = useCallback(
    async (registration: Registration) => {
      try {
        const registrations = [...appState.registrations]
        const index = registrations.findIndex((r) => r.id === registration.id)

        if (index !== -1) {
          registrations[index] = registration
          localStorage.setItem("yammy-registrations", JSON.stringify(registrations))

          setState((prev) => ({
            ...prev,
            registrations,
            lastUpdated: {
              ...prev.lastUpdated,
              registrations: Date.now(),
            },
          }))
        }
      } catch (error) {
        console.error("Failed to update registration:", error)
        throw error
      }
    },
    [appState.registrations],
  )

  // Delete a registration
  const deleteRegistration = useCallback(
    async (id: number) => {
      try {
        const registrations = appState.registrations.filter((r) => r.id !== id)
        localStorage.setItem("yammy-registrations", JSON.stringify(registrations))

        setState((prev) => ({
          ...prev,
          registrations,
          lastUpdated: {
            ...prev.lastUpdated,
            registrations: Date.now(),
          },
        }))
      } catch (error) {
        console.error("Failed to delete registration:", error)
        throw error
      }
    },
    [appState.registrations],
  )

  // Approve a registration
  const approveRegistration = useCallback(
    async (id: number, reviewedBy: string, notes?: string) => {
      try {
        const registrations = [...appState.registrations]
        const index = registrations.findIndex((r) => r.id === id)

        if (index !== -1) {
          registrations[index] = {
            ...registrations[index],
            status: "approved",
            reviewedBy,
            notes,
            reviewDate: new Date().toISOString(),
          }
          localStorage.setItem("yammy-registrations", JSON.stringify(registrations))

          setState((prev) => ({
            ...prev,
            registrations,
            lastUpdated: {
              ...prev.lastUpdated,
              registrations: Date.now(),
            },
          }))

          // Notify about the change
          if (notifyChange) {
            notifyChange({
              type: "registration",
              action: "update",
              id,
            })
          }
        }
      } catch (error) {
        console.error("Failed to approve registration:", error)
        throw error
      }
    },
    [appState.registrations, notifyChange],
  )

  // Reject a registration
  const rejectRegistration = useCallback(
    async (id: number, reviewedBy: string, notes?: string) => {
      try {
        const registrations = [...appState.registrations]
        const index = registrations.findIndex((r) => r.id === id)

        if (index !== -1) {
          registrations[index] = {
            ...registrations[index],
            status: "rejected",
            reviewedBy,
            notes,
            reviewDate: new Date().toISOString(),
          }
          localStorage.setItem("yammy-registrations", JSON.stringify(registrations))

          setState((prev) => ({
            ...prev,
            registrations,
            lastUpdated: {
              ...prev.lastUpdated,
              registrations: Date.now(),
            },
          }))

          // Notify about the change
          if (notifyChange) {
            notifyChange({
              type: "registration",
              action: "update",
              id,
            })
          }
        }
      } catch (error) {
        console.error("Failed to reject registration:", error)
        throw error
      }
    },
    [appState.registrations, notifyChange],
  )

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      state: appState,
      loadProducts,
      loadOrders,
      loadBlogPosts,
      loadAgents,
      loadRegistrations,
      addProduct,
      updateProduct,
      deleteProduct,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addAgent,
      updateAgent,
      deleteAgent,
      addRegistration,
      updateRegistration,
      deleteRegistration,
      approveRegistration,
      rejectRegistration,
      refreshData,
      notifyChange,
    }),
    [
      appState,
      loadProducts,
      loadOrders,
      loadBlogPosts,
      loadAgents,
      loadRegistrations,
      addProduct,
      updateProduct,
      deleteProduct,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addAgent,
      updateAgent,
      deleteAgent,
      addRegistration,
      updateRegistration,
      deleteRegistration,
      approveRegistration,
      rejectRegistration,
      refreshData,
      notifyChange,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// Custom hook to use the store
export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

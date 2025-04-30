"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { mockProducts } from "@/data/mock-products"
import { mockOrders } from "@/data/mock-orders"
import { mockBlogPosts } from "@/data/mock-blog-posts"
import { mockAgents } from "@/data/mock-agents"
import { mockRegistrations } from "@/data/mock-registrations"

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

export type Agent = {
  id: number
  name: string
  location: string
  phone: string
  region: string
}

export type Registration = {
  id: number
  name: string
  email: string
  phone: string
  paymentReference: string
  status: "pending" | "approved" | "rejected"
  date: string
  notes?: string
  reviewedBy?: string
  reviewDate?: string
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

// Store context
const StoreContext = createContext<StoreContextType>({
  state: {
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
  },
  loadProducts: async () => {},
  loadOrders: async () => {},
  loadBlogPosts: async () => {},
  loadAgents: async () => {},
  loadRegistrations: async () => {},
  addProduct: async () => ({ id: 0 }) as Product,
  updateProduct: async () => {},
  deleteProduct: async () => {},
  addBlogPost: async () => ({ id: 0 }) as BlogPost,
  updateBlogPost: async () => {},
  deleteBlogPost: async () => {},
  addAgent: async () => ({ id: 0 }) as Agent,
  updateAgent: async () => {},
  deleteAgent: async () => {},
  addRegistration: async () => ({ id: 0 }) as Registration,
  updateRegistration: async () => {},
  deleteRegistration: async () => {},
  approveRegistration: async () => {},
  rejectRegistration: async () => {},
  refreshData: async () => {},
})

// Provider component
export function StoreProvider({ children, notifyChange }: { children: ReactNode; notifyChange?: NotifyChange }) {
  const [state, setState] = useState<AppState>({
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

  // Load agents from localStorage or mock data
  const loadAgents = useCallback(async () => {
    try {
      const storedAgents = localStorage.getItem("yammy-agents")
      if (storedAgents) {
        setState((prev) => ({
          ...prev,
          agents: JSON.parse(storedAgents),
          lastUpdated: {
            ...prev.lastUpdated,
            agents: Date.now(),
          },
        }))
      } else {
        setState((prev) => ({
          ...prev,
          agents: mockAgents,
          lastUpdated: {
            ...prev.lastUpdated,
            agents: Date.now(),
          },
        }))
        localStorage.setItem("yammy-agents", JSON.stringify(mockAgents))
      }
    } catch (error) {
      console.error("Failed to load agents:", error)
    }
  }, [])

  // Load registrations from localStorage or mock data
  const loadRegistrations = useCallback(async () => {
    try {
      const storedRegistrations = localStorage.getItem("yammy-registrations")
      if (storedRegistrations) {
        setState((prev) => ({
          ...prev,
          registrations: JSON.parse(storedRegistrations),
          lastUpdated: {
            ...prev.lastUpdated,
            registrations: Date.now(),
          },
        }))
      } else {
        setState((prev) => ({
          ...prev,
          registrations: mockRegistrations,
          lastUpdated: {
            ...prev.lastUpdated,
            registrations: Date.now(),
          },
        }))
        localStorage.setItem("yammy-registrations", JSON.stringify(mockRegistrations))
      }
    } catch (error) {
      console.error("Failed to load registrations:", error)
    }
  }, [])

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([loadProducts(), loadOrders(), loadBlogPosts(), loadAgents(), loadRegistrations()])
  }, [loadProducts, loadOrders, loadBlogPosts, loadAgents, loadRegistrations])

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

  // Add a new agent
  const addAgent = useCallback(
    async (agent: Omit<Agent, "id">): Promise<Agent> => {
      try {
        const agents = [...state.agents]
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
    [state.agents],
  )

  // Update an existing agent
  const updateAgent = useCallback(
    async (agent: Agent) => {
      try {
        const agents = [...state.agents]
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
    [state.agents],
  )

  // Delete an agent
  const deleteAgent = useCallback(
    async (id: number) => {
      try {
        const agents = state.agents.filter((a) => a.id !== id)
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
    [state.agents],
  )

  // Add a new registration
  const addRegistration = useCallback(
    async (registration: Omit<Registration, "id" | "date" | "status">): Promise<Registration> => {
      try {
        const registrations = [...state.registrations]
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
    [state.registrations, notifyChange],
  )

  // Update an existing registration
  const updateRegistration = useCallback(
    async (registration: Registration) => {
      try {
        const registrations = [...state.registrations]
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
    [state.registrations],
  )

  // Delete a registration
  const deleteRegistration = useCallback(
    async (id: number) => {
      try {
        const registrations = state.registrations.filter((r) => r.id !== id)
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
    [state.registrations],
  )

  // Approve a registration
  const approveRegistration = useCallback(
    async (id: number, reviewedBy: string, notes?: string) => {
      try {
        const registrations = [...state.registrations]
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
    [state.registrations, notifyChange],
  )

  // Reject a registration
  const rejectRegistration = useCallback(
    async (id: number, reviewedBy: string, notes?: string) => {
      try {
        const registrations = [...state.registrations]
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
    [state.registrations, notifyChange],
  )

  return (
    <StoreContext.Provider
      value={{
        state,
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

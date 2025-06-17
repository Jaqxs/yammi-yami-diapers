"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockProducts } from "@/data/mock-products"
import { mockBlogPosts } from "@/data/mock-blog-posts"
import { mockAgents } from "@/data/mock-agents"

// Define the types
export type Product = {
  id: number | string
  name: {
    en: string
    sw: string
  }
  description?: {
    en: string
    sw: string
  }
  price: number
  wholesalePrice?: number
  image?: string
  images?: string[]
  category: string
  size?: string
  bundleSize?: number
  cartonSize?: string | number
  weightRange?: string
  hipSize?: string
  inStock?: boolean
  isCarton?: boolean
  featured?: boolean
  tags?: string[]
  status?: "active" | "low_stock" | "out_of_stock" | "draft" | "inactive"
  stock?: number
  type?: string
}

export type BlogPost = {
  id: number
  title: {
    en: string
    sw: string
  }
  content?: {
    en: string
    sw: string
  }
  excerpt: {
    en: string
    sw: string
  }
  image?: string
  author?:
    | string
    | {
        name: string
        avatar: string
      }
  date: string
  featured?: boolean
  readTime: number
  category?: string
  tags?: string[]
  status?: "published" | "draft"
}

export type Agent = {
  id: number
  name: string
  location: string
  phone: string
  region: string
  registrationDate?: string
  status?: "active" | "inactive"
  tier?: "bronze" | "silver" | "gold" | "platinum"
  salesVolume?: number
  lastOrderDate?: string
}

export type CartItem = {
  id: number | string
  name: {
    en: string
    sw: string
  }
  price: number
  quantity: number
  image?: string
  size?: string
  bundleSize?: number
}

export type StoreState = {
  products: Product[]
  blogPosts: BlogPost[]
  agents: Agent[]
  isLoading: boolean
  error: string | null
  lastSync: Date | null
  dataSource: "database" | "fallback" | "cache" | null
  loadProducts: () => Promise<void>
  loadBlogPosts: () => Promise<void>
  loadAgents: () => Promise<void>
  getProductById: (id: number | string) => Product | undefined
  getBlogPostById: (id: number) => BlogPost | undefined
  refreshProducts: () => Promise<void>
}

// Create store with persist middleware
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: [],
      blogPosts: [],
      agents: [],
      isLoading: false,
      error: null,
      lastSync: null,
      dataSource: null,

      loadProducts: async () => {
        set({ isLoading: true, error: null })

        try {
          console.log("🔍 Loading products from live database...")

          const response = await fetch("/api/products", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          })

          if (response.ok) {
            const data = await response.json()
            console.log("📦 API Response:", data)

            if (data.success && Array.isArray(data.products) && data.products.length > 0) {
              console.log(`✅ Loaded ${data.products.length} products from ${data.source}`)

              set({
                products: data.products,
                isLoading: false,
                error: data.warning || null,
                lastSync: new Date(),
                dataSource: data.source,
              })

              // Cache the live data
              localStorage.setItem("yammy-products", JSON.stringify(data.products))
              localStorage.setItem("yammy-products-sync", new Date().toISOString())
              localStorage.setItem("yammy-products-source", data.source)

              return
            } else {
              console.warn("⚠️ API returned success but no valid products array")
              throw new Error(data.error || "No products returned")
            }
          } else {
            console.warn(`⚠️ API returned status ${response.status}`)
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
        } catch (error) {
          console.warn("⚠️ API fetch failed, using mock data:", error)

          set({
            products: mockProducts,
            isLoading: false,
            error: `Live database unavailable - using mock products`,
            lastSync: new Date(),
            dataSource: "fallback",
          })
        }
      },

      refreshProducts: async () => {
        // Clear cache and force refresh
        localStorage.removeItem("yammy-products")
        localStorage.removeItem("yammy-products-sync")
        localStorage.removeItem("yammy-products-source")
        await get().loadProducts()
      },

      loadBlogPosts: async () => {
        set({ isLoading: true, error: null })
        try {
          const storedPosts = localStorage.getItem("yammy-blog-posts")
          if (storedPosts) {
            try {
              const parsedPosts = JSON.parse(storedPosts)
              set({ blogPosts: parsedPosts, isLoading: false })
            } catch (parseError) {
              console.error("Error parsing stored blog posts:", parseError)
              set({ blogPosts: mockBlogPosts, isLoading: false })
              localStorage.setItem("yammy-blog-posts", JSON.stringify(mockBlogPosts))
            }
          } else {
            set({ blogPosts: mockBlogPosts, isLoading: false })
            localStorage.setItem("yammy-blog-posts", JSON.stringify(mockBlogPosts))
          }
        } catch (error) {
          console.error("Error loading blog posts:", error)
          set({
            blogPosts: mockBlogPosts,
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to load blog posts",
          })
        }
      },

      loadAgents: async () => {
        set({ isLoading: true, error: null })
        try {
          const storedAgents = localStorage.getItem("yammy-agents")
          if (storedAgents) {
            try {
              const parsedAgents = JSON.parse(storedAgents)
              set({ agents: parsedAgents, isLoading: false })
            } catch (parseError) {
              console.error("Error parsing stored agents:", parseError)
              set({ agents: mockAgents, isLoading: false })
              localStorage.setItem("yammy-agents", JSON.stringify(mockAgents))
            }
          } else {
            set({ agents: mockAgents, isLoading: false })
            localStorage.setItem("yammy-agents", JSON.stringify(mockAgents))
          }
        } catch (error) {
          console.error("Error loading agents:", error)
          set({
            agents: mockAgents,
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to load agents",
          })
        }
      },

      getProductById: (id) => {
        return get().products.find((product) => product.id === id)
      },

      getBlogPostById: (id) => {
        return get().blogPosts.find((post) => post.id === id)
      },
    }),
    {
      name: "yammy-store",
      partialize: (state) => ({
        products: state.products,
        blogPosts: state.blogPosts,
        agents: state.agents,
        lastSync: state.lastSync,
        dataSource: state.dataSource,
      }),
    },
  ),
)

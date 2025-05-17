"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { motion } from "framer-motion"
import { Search, Calendar, Clock, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"
import { useStore } from "@/lib/store"
import { useStoreSync } from "@/lib/store-sync"
import { AdminChangeNotification } from "@/components/admin-change-notification"
import { useIsMobile } from "@/hooks/use-media-query"
import { throttle } from "@/lib/performance"

// Dynamically import the modal for better performance
const BlogPostModal = dynamic(() => import("@/components/blog-post-modal").then((mod) => mod.BlogPostModal), {
  ssr: false,
  loading: () => null,
})

// Language translations
const translations = {
  en: {
    blog: "Blog",
    allPosts: "All Posts",
    latestPosts: "Latest Articles",
    featuredPosts: "Featured Articles",
    search: "Search articles...",
    filter: "Filter By",
    category: "Category",
    allCategories: "All Categories",
    babyHealth: "Baby Health",
    parentingTips: "Parenting Tips",
    productInfo: "Product Info",
    latestNews: "Latest News",
    readMore: "Read More",
    minutes: "min read",
    noPosts: "No articles found",
    loading: "Loading articles...",
  },
  sw: {
    blog: "Blogu",
    allPosts: "Makala Zote",
    latestPosts: "Makala za Hivi Karibuni",
    featuredPosts: "Makala Zilizoangaziwa",
    search: "Tafuta makala...",
    filter: "Chuja Kwa",
    category: "Jamii",
    allCategories: "Jamii Zote",
    babyHealth: "Afya ya Mtoto",
    parentingTips: "Vidokezo vya Uzazi",
    productInfo: "Maelezo ya Bidhaa",
    latestNews: "Habari za Hivi Karibuni",
    readMore: "Soma Zaidi",
    minutes: "dakika za kusoma",
    noPosts: "Hakuna makala zilizopatikana",
    loading: "Inapakia makala...",
  },
}

// Blog post skeleton component
function BlogPostSkeleton() {
  const isMobile = useIsMobile()
  const columns = isMobile ? 1 : 3

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-8`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BlogPage() {
  const { language } = useLanguage()
  const { state, loadBlogPosts } = useStore()
  const { lastEvent } = useStoreSync()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useIsMobile()
  const t = translations[language || "en"]
  const [imageKey, setImageKey] = useState(Date.now())
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Load blog posts on component mount
  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true)
      try {
        await loadBlogPosts()
      } catch (error) {
        console.error("Error loading blog posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [loadBlogPosts])

  // Force re-render images every 30 seconds to prevent stale images
  useEffect(() => {
    const interval = setInterval(() => {
      setImageKey(Date.now())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Listen for sync events
  useEffect(() => {
    if (lastEvent && lastEvent.type === "blogPost") {
      // Refresh blog posts when a blog-related event occurs
      const refreshBlogPosts = async () => {
        setIsLoading(true)
        try {
          await loadBlogPosts()
        } catch (error) {
          console.error("Error refreshing blog posts:", error)
        } finally {
          setIsLoading(false)
        }
      }

      refreshBlogPosts()
    }
  }, [lastEvent, loadBlogPosts])

  // Format date function
  const formatDate = useCallback(
    (dateString: string) => {
      const date = new Date(dateString)
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
      return date.toLocaleDateString(language === "en" ? "en-US" : "sw-TZ", options)
    },
    [language],
  )

  // Handle opening the modal with the selected post
  const handleOpenModal = useCallback((post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }, [])

  // Handle closing the modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    // Wait for animation to complete before clearing the selected post
    setTimeout(() => setSelectedPost(null), 300)
  }, [])

  // Throttled search handler
  const handleSearchChange = throttle((e) => {
    setSearchQuery(e.target.value)
  }, 300)

  // Add timestamp to image URL to prevent caching
  const getImageUrl = (url: string, postId: string) => {
    if (!url || imageErrors[postId]) return "/blog-post-concept.png"

    // If URL already has a query parameter, add timestamp
    if (url.includes("?")) {
      return `${url}&t=${imageKey}`
    }

    // Otherwise add timestamp as a new query parameter
    return `${url}?t=${imageKey}`
  }

  const handleImageError = (postId: string) => {
    console.error("Error loading blog post image for post:", postId)
    setImageErrors((prev) => ({ ...prev, [postId]: true }))
  }

  // Filter blog posts based on search, category, and active tab
  const filteredPosts = state.blogPosts.filter((post) => {
    // Only show published posts
    if (post.status !== "published") return false

    // Filter by search query
    if (
      searchQuery &&
      !post.title[language || "en"].toLowerCase().includes(searchQuery.toLowerCase()) &&
      !post.excerpt[language || "en"].toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (categoryFilter !== "all" && post.category !== categoryFilter) {
      return false
    }

    // Filter by tab
    if (activeTab === "featured" && !post.featured) {
      return false
    }

    return true
  })

  // Sort by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bubblegum mb-8 text-yammy-dark-blue text-center">{t.blog}</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === "all" ? "bg-yammy-blue text-white" : "bg-white text-yammy-blue hover:bg-yammy-light-blue"
              }`}
              onClick={() => setActiveTab("all")}
            >
              {t.allPosts}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === "featured"
                  ? "bg-yammy-blue text-white"
                  : "bg-white text-yammy-blue hover:bg-yammy-light-blue"
              }`}
              onClick={() => setActiveTab("featured")}
            >
              {t.featuredPosts}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yammy-blue h-4 w-4" />
            <Input
              type="text"
              placeholder={t.search}
              className="pl-10 border-yammy-blue/30 focus:ring-yammy-blue"
              onChange={handleSearchChange}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px] border-yammy-blue/30 focus:ring-yammy-blue">
              <SelectValue placeholder={t.category} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCategories}</SelectItem>
              <SelectItem value="babyHealth">{t.babyHealth}</SelectItem>
              <SelectItem value="parentingTips">{t.parentingTips}</SelectItem>
              <SelectItem value="productInfo">{t.productInfo}</SelectItem>
              <SelectItem value="latestNews">{t.latestNews}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blog Posts */}
        {isLoading ? (
          <BlogPostSkeleton />
        ) : sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="block h-full flex flex-col">
                  <div className="relative h-48">
                    <Image
                      src={getImageUrl(post.image || "/blog-post-concept.png", post.id)}
                      alt={post.title[language || "en"]}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(post.id)}
                      unoptimized={true}
                    />
                    {post.featured && (
                      <Badge className="absolute top-2 left-2 bg-yammy-orange text-white">
                        {language === "en" ? "Featured" : "Iliyoangaziwa"}
                      </Badge>
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="font-bubblegum text-xl mb-2 text-yammy-dark-blue">{post.title[language || "en"]}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">{post.excerpt[language || "en"]}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime} {t.minutes}
                      </div>
                    </div>
                    <div className="flex justify-end mt-auto">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-yammy-blue hover:text-yammy-dark-blue font-medium"
                        onClick={() => handleOpenModal(post)}
                      >
                        {t.readMore} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-bubblegum text-xl">{t.noPosts}</p>
          </div>
        )}
      </div>

      {/* Blog Post Modal */}
      <Suspense fallback={null}>
        {selectedPost && <BlogPostModal post={selectedPost} isOpen={isModalOpen} onClose={handleCloseModal} />}
      </Suspense>

      {/* Admin Change Notification */}
      <AdminChangeNotification />
    </PageWrapper>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Calendar, Clock, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"
import { useStore } from "@/lib/store"
import { useStoreSync } from "@/lib/store-sync"
import { AdminChangeNotification } from "@/components/admin-change-notification"

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

export default function BlogPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const { state, loadBlogPosts } = useStore()
  const { lastEvent } = useStoreSync()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const t = translations[language || "en"]

  // Load blog posts on component mount
  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true)
      await loadBlogPosts()
      setIsLoading(false)
    }

    fetchBlogPosts()
  }, [loadBlogPosts])

  // Listen for sync events
  useEffect(() => {
    if (lastEvent && lastEvent.type === "blogPost") {
      // Refresh blog posts when a blog-related event occurs
      const refreshBlogPosts = async () => {
        setIsLoading(true)
        await loadBlogPosts()
        setIsLoading(false)
      }

      refreshBlogPosts()
    }
  }, [lastEvent, loadBlogPosts])

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString(language === "en" ? "en-US" : "sw-TZ", options)
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="text-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-yammy-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 font-bubblegum text-xl">{t.loading}</p>
          </div>
        ) : sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <Link href={`/blog/${post.id}`} className="block">
                  <div className="relative h-48">
                    <Image
                      src={post.image || "/placeholder.svg?height=300&width=500&query=blog post"}
                      alt={post.title[language || "en"]}
                      fill
                      className="object-cover"
                    />
                    {post.featured && (
                      <Badge className="absolute top-2 left-2 bg-yammy-orange text-white">
                        {language === "en" ? "Featured" : "Iliyoangaziwa"}
                      </Badge>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bubblegum text-xl mb-2 text-yammy-dark-blue">{post.title[language || "en"]}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt[language || "en"]}</p>
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
                    <div className="flex justify-end">
                      <Button
                        variant="link"
                        className="p-0 h-auto text-yammy-blue hover:text-yammy-dark-blue font-medium"
                      >
                        {t.readMore} <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-bubblegum text-xl">{t.noPosts}</p>
          </div>
        )}
      </div>
      {/* Admin Change Notification */}
      <AdminChangeNotification />
    </PageWrapper>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, ChevronRight, Bookmark, Eye } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"

interface BlogCardProps {
  post: any
  onOpenModal: (post: any) => void
  formatDate: (date: string) => string
  getImageUrl: (url: string, postId: string) => string
  handleImageError: (postId: string) => void
  getCategoryIcon: (category: string) => React.ReactNode
}

export function BlogCard({
  post,
  onOpenModal,
  formatDate,
  getImageUrl,
  handleImageError,
  getCategoryIcon,
}: BlogCardProps) {
  const { language } = useLanguage()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const translations = {
    en: {
      readMore: "Read Article",
      minutes: "min read",
      featured: "Featured",
      bookmark: "Bookmark",
      views: "views",
    },
    sw: {
      readMore: "Soma Makala",
      minutes: "dakika za kusoma",
      featured: "Iliyoangaziwa",
      bookmark: "Hifadhi",
      views: "miwani",
    },
  }

  const t = translations[language || "en"]

  const getCategoryName = (category: string) => {
    const categoryNames = {
      en: {
        babyHealth: "Baby Health",
        parentingTips: "Parenting Tips",
        productInfo: "Product Info",
        latestNews: "Latest News",
      },
      sw: {
        babyHealth: "Afya ya Mtoto",
        parentingTips: "Vidokezo vya Uzazi",
        productInfo: "Maelezo ya Bidhaa",
        latestNews: "Habari za Hivi Karibuni",
      },
    }
    return categoryNames[language || "en"][category] || category
  }

  return (
    <motion.article
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={getImageUrl(post.image || "/blog-post-concept.png", post.id.toString())}
          alt={post.title[language || "en"]}
          fill
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "scale-100" : "scale-110"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => handleImageError(post.id.toString())}
          unoptimized={true}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsBookmarked(!isBookmarked)
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
        >
          <Bookmark
            className={`h-4 w-4 transition-colors ${
              isBookmarked ? "fill-yammy-blue text-yammy-blue" : "text-gray-600"
            }`}
          />
        </button>

        {/* Featured badge */}
        {post.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-yammy-orange text-white font-medium">{t.featured}</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-yammy-blue">
            {getCategoryIcon(post.category)}
            <span className="text-sm font-medium">{getCategoryName(post.category)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-3 text-gray-900 leading-tight group-hover:text-yammy-blue transition-colors">
          {post.title[language || "en"]}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow text-sm leading-relaxed">
          {post.excerpt[language || "en"]}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.date)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime} {t.minutes}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {Math.floor(Math.random() * 500) + 100} {t.views}
          </div>
        </div>

        {/* Read more button */}
        <Button
          variant="ghost"
          onClick={() => onOpenModal(post)}
          className="w-full justify-between text-yammy-blue hover:text-yammy-dark-blue hover:bg-yammy-blue/5 font-medium p-3 rounded-lg border border-yammy-blue/20 hover:border-yammy-blue/40 transition-all"
        >
          {t.readMore}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.article>
  )
}

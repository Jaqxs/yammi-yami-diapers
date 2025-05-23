"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, ChevronRight, Heart, Bookmark } from "lucide-react"
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
  const [imageLoaded, setImageLoaded] = useState(false)

  const translations = {
    en: {
      readMore: "Read More",
      minutes: "min read",
      featured: "Featured",
      babyHealth: "Baby Health",
      parentingTips: "Parenting Tips",
      productInfo: "Product Info",
      latestNews: "Latest News",
    },
    sw: {
      readMore: "Soma Zaidi",
      minutes: "dakika za kusoma",
      featured: "Iliyoangaziwa",
      babyHealth: "Afya ya Mtoto",
      parentingTips: "Vidokezo vya Uzazi",
      productInfo: "Maelezo ya Bidhaa",
      latestNews: "Habari za Hivi Karibuni",
    },
  }

  const t = translations[language || "en"]

  const getCategoryName = (category: string) => {
    switch (category) {
      case "babyHealth":
        return t.babyHealth
      case "parentingTips":
        return t.parentingTips
      case "productInfo":
        return t.productInfo
      case "latestNews":
        return t.latestNews
      default:
        return category
    }
  }

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col group"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="block h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={getImageUrl(post.image || "/blog-post-concept.png", post.id.toString())}
            alt={post.title[language || "en"]}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? "scale-100" : "scale-110"}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => handleImageError(post.id.toString())}
            unoptimized={true}
          />
          <div className="absolute top-2 left-2 flex gap-2">
            {post.featured && <Badge className="bg-yammy-orange text-white">{t.featured}</Badge>}
          </div>
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:text-yammy-orange hover:bg-white/20 backdrop-blur-sm"
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            {getCategoryIcon(post.category)}
            <span className="text-sm text-yammy-blue font-medium">{getCategoryName(post.category)}</span>
          </div>

          <h3 className="font-bubblegum text-xl mb-2 text-yammy-dark-blue group-hover:text-yammy-blue transition-colors">
            {post.title[language || "en"]}
          </h3>

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

          <div className="flex items-center justify-between mt-auto">
            <Button
              variant="link"
              className="p-0 h-auto text-yammy-blue hover:text-yammy-dark-blue font-medium"
              onClick={() => onOpenModal(post)}
            >
              {t.readMore} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>

            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 hover:bg-red-50">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

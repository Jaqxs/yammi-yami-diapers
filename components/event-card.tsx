"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Heart, Share2, ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

interface EventCardProps {
  post: any
  onOpenModal: (post: any) => void
  formatDate: (date: string) => string
  getImageUrl: (url: string, postId: string) => string
  handleImageError: (postId: string) => void
}

export function EventCard({ post, onOpenModal, formatDate, getImageUrl, handleImageError }: EventCardProps) {
  const { language } = useLanguage()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const translations = {
    en: {
      joinEvent: "Join Event",
      minutes: "min read",
      community: "Community",
      event: "Event",
      upcoming: "Upcoming",
      past: "Past Event",
      featured: "⭐ Featured",
      participants: "Expected Participants",
      location: "Location",
      share: "Share Event",
      learnMore: "Learn More",
      free: "FREE",
    },
    sw: {
      joinEvent: "Jiunge na Tukio",
      minutes: "dakika za kusoma",
      community: "Jamii",
      event: "Tukio",
      upcoming: "Linakuja",
      past: "Tukio la Zamani",
      featured: "⭐ Iliyoangaziwa",
      participants: "Washiriki Wanatarajiwa",
      location: "Mahali",
      share: "Shiriki Tukio",
      learnMore: "Jifunze Zaidi",
      free: "BURE",
    },
  }

  const t = translations[language || "en"]

  // Determine if event is upcoming or past
  const eventDate = new Date(post.date)
  const now = new Date()
  const isUpcoming = eventDate > now

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -10 }}
    >
      {/* Event Ticket Style Card */}
      <div className="bg-white rounded-t-3xl rounded-b-none shadow-2xl overflow-hidden border-l-8 border-yammy-orange">
        {/* Header Image with Overlay */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={getImageUrl(post.image || "/blog-post-concept.png", post.id.toString())}
            alt={post.title[language || "en"]}
            fill
            className={`object-cover transition-all duration-700 ${imageLoaded ? "scale-100" : "scale-110"}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => handleImageError(post.id.toString())}
            unoptimized={true}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-yammy-blue/80 via-transparent to-yammy-orange/60" />

          {/* Status badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {post.featured && (
              <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                {t.featured}
              </div>
            )}
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isUpcoming ? "bg-green-500 text-white" : "bg-gray-500 text-white"
              }`}
            >
              {isUpcoming ? t.upcoming : t.past}
            </div>
          </div>

          {/* Free badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-yammy-orange text-white px-4 py-2 rounded-full font-bold text-sm transform rotate-12">
              {t.free}
            </div>
          </div>

          {/* Date circle */}
          <div className="absolute bottom-4 right-4">
            <div className="bg-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg">
              <div className="text-2xl font-bold text-yammy-dark-blue">{eventDate.getDate()}</div>
              <div className="text-xs text-yammy-blue font-medium uppercase">
                {eventDate.toLocaleDateString(language === "en" ? "en-US" : "sw-TZ", { month: "short" })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Community tag */}
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-yammy-blue text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Users className="h-3 w-3" />
              {t.community}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bubblegum text-xl mb-3 text-yammy-dark-blue leading-tight">
            {post.title[language || "en"]}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">{post.excerpt[language || "en"]}</p>

          {/* Event details */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 text-yammy-blue" />
              {formatDate(post.date)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-yammy-blue" />
              {post.readTime} {t.minutes}
            </div>
            {post.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-yammy-blue" />
                {post.location || "Dar es Salaam, Tanzania"}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <Button
              onClick={() => onOpenModal(post)}
              className="bg-yammy-blue hover:bg-yammy-dark-blue text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 transition-all"
            >
              {t.learnMore}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all ${
                  isLiked ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-400"
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title[language || "en"],
                      text: post.excerpt[language || "en"],
                      url: window.location.href,
                    })
                  }
                }}
                className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-yammy-blue hover:text-white transition-all"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket stub */}
      <div className="bg-yammy-orange h-4 relative">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="flex space-x-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full opacity-60" />
            ))}
          </div>
        </div>
        {/* Circular cuts */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-gray-50 rounded-full" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-50 rounded-full" />
      </div>
    </motion.div>
  )
}

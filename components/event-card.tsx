"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Heart, Share2, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

  const translations = {
    en: {
      readMore: "Learn More",
      minutes: "min read",
      community: "Community",
      event: "Event",
      upcoming: "Upcoming",
      past: "Past Event",
      featured: "Featured",
      participants: "Expected Participants",
      location: "Location",
      share: "Share Event",
    },
    sw: {
      readMore: "Jifunze Zaidi",
      minutes: "dakika za kusoma",
      community: "Jamii",
      event: "Tukio",
      upcoming: "Linakuja",
      past: "Tukio la Zamani",
      featured: "Iliyoangaziwa",
      participants: "Washiriki Wanatarajiwa",
      location: "Mahali",
      share: "Shiriki Tukio",
    },
  }

  const t = translations[language || "en"]

  // Determine if event is upcoming or past
  const eventDate = new Date(post.date)
  const now = new Date()
  const isUpcoming = eventDate > now

  return (
    <motion.div
      className="bg-gradient-to-br from-white to-yammy-light-blue/10 rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-yammy-blue/10"
      whileHover={{ y: -8, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with date and status */}
      <div className="relative">
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <Badge className={`${isUpcoming ? "bg-green-500" : "bg-gray-500"} text-white font-medium`}>
            {isUpcoming ? t.upcoming : t.past}
          </Badge>
          {post.featured && <Badge className="bg-yammy-orange text-white font-medium">{t.featured}</Badge>}
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 text-center shadow-lg">
            <div className="text-2xl font-bold text-yammy-dark-blue">{eventDate.getDate()}</div>
            <div className="text-xs text-yammy-blue font-medium uppercase">
              {eventDate.toLocaleDateString(language === "en" ? "en-US" : "sw-TZ", { month: "short" })}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={getImageUrl(post.image || "/blog-post-concept.png", post.id.toString())}
            alt={post.title[language || "en"]}
            fill
            className={`object-cover transition-all duration-500 ${imageLoaded ? "scale-100" : "scale-110"}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => handleImageError(post.id.toString())}
            unoptimized={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Category and Community Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-yammy-blue/10 text-yammy-blue px-3 py-1 rounded-full text-sm font-medium">
            <Users className="h-4 w-4" />
            {t.community}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bubblegum text-xl mb-3 text-yammy-dark-blue leading-tight">
          {post.title[language || "en"]}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow leading-relaxed">{post.excerpt[language || "en"]}</p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
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
              {post.location}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-yammy-blue/10">
          <Button
            variant="ghost"
            size="sm"
            className="text-yammy-blue hover:text-yammy-dark-blue hover:bg-yammy-blue/10 font-medium"
            onClick={() => onOpenModal(post)}
          >
            {t.readMore}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-yammy-blue hover:bg-yammy-blue/10"
              onClick={() => {
                // Share functionality
                if (navigator.share) {
                  navigator.share({
                    title: post.title[language || "en"],
                    text: post.excerpt[language || "en"],
                    url: window.location.href,
                  })
                }
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 hover:bg-red-50">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-yammy-blue to-yammy-orange" />
    </motion.div>
  )
}

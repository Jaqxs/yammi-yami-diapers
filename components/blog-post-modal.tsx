"use client"

import { useEffect, useRef, useState } from "react"
import { Calendar, Clock, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useIsMobile } from "@/hooks/use-media-query"
import type { BlogPost } from "@/lib/store"

interface BlogPostModalProps {
  post: BlogPost | null
  isOpen: boolean
  onClose: () => void
}

export function BlogPostModal({ post, isOpen, onClose }: BlogPostModalProps) {
  const { language } = useLanguage()
  const modalRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [imageKey, setImageKey] = useState(Date.now())
  const [imageError, setImageError] = useState(false)

  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString(language === "en" ? "en-US" : "sw-TZ", options)
  }

  // Convert markdown-like content to HTML
  const renderContent = (content: string) => {
    // Simple markdown parsing for headings, paragraphs, lists
    const html = content
      // Handle headings
      .replace(/## (.*?)$/gm, '<h2 class="text-xl font-bold mt-6 mb-2">$1</h2>')
      .replace(/### (.*?)$/gm, '<h3 class="text-lg font-bold mt-5 mb-2">$1</h3>')
      // Handle lists
      .replace(/- (.*?)$/gm, '<li class="ml-6 list-disc">$1</li>')
      .replace(/\d+\. (.*?)$/gm, '<li class="ml-6 list-decimal">$1</li>')
      // Handle paragraphs (must come last)
      .split("\n\n")
      .map((paragraph) => {
        if (paragraph.startsWith("<h2") || paragraph.startsWith("<h3") || paragraph.startsWith("<li")) {
          return paragraph
        }
        return `<p class="mb-4">${paragraph}</p>`
      })
      .join("")

    return { __html: html }
  }

  // Add timestamp to image URL to prevent caching
  const getImageUrl = (url: string) => {
    if (!url) return "/blog-post-concept.png"

    // If URL already has a query parameter, add timestamp
    if (url.includes("?")) {
      return `${url}&t=${imageKey}`
    }

    // Otherwise add timestamp as a new query parameter
    return `${url}?t=${imageKey}`
  }

  const handleImageError = () => {
    console.error("Error loading blog post image:", post?.image)
    setImageError(true)
  }

  if (!post) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>

            {/* Header image */}
            <div className="relative h-48 md:h-64 w-full">
              <Image
                src={imageError ? "/blog-post-concept.png" : getImageUrl(post.image || "/blog-post-concept.png")}
                alt={post.title[language || "en"]}
                fill
                className="object-cover"
                onError={handleImageError}
                unoptimized={true}
                priority
              />
            </div>

            {/* Content */}
            <div className="p-4 md:p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
              <h1 className="font-bubblegum text-2xl md:text-3xl mb-4 text-yammy-dark-blue">
                {post.title[language || "en"]}
              </h1>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(post.date)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readTime} {language === "en" ? "min read" : "dakika za kusoma"}
                </div>
              </div>

              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={renderContent(post.content[language || "en"])}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

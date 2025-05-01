"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Calendar, Clock, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import type { BlogPost } from "@/lib/store"

interface BlogPostModalProps {
  post: BlogPost | null
  isOpen: boolean
  onClose: () => void
}

export function BlogPostModal({ post, isOpen, onClose }: BlogPostModalProps) {
  const { language } = useLanguage()

  // Close modal on escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
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

  if (!post) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
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
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>

            {/* Header image */}
            <div className="relative h-64 w-full">
              <Image
                src={post.image || "/placeholder.svg?height=300&width=500&query=blog post"}
                alt={post.title[language || "en"]}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
              <h1 className="font-bubblegum text-3xl mb-4 text-yammy-dark-blue">{post.title[language || "en"]}</h1>

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

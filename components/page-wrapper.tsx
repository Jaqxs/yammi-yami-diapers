"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-media-query"

interface PageWrapperProps {
  children: React.ReactNode
}

export function PageWrapper({ children }: PageWrapperProps) {
  const isMobile = useIsMobile()

  // Use simpler animations on mobile for better performance
  const variants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: isMobile ? 10 : 20,
      transition: {
        duration: isMobile ? 0.2 : 0.3,
      },
    },
  }

  return (
    <motion.div variants={variants} initial="hidden" animate="enter" exit="exit" className="w-full">
      {children}
    </motion.div>
  )
}

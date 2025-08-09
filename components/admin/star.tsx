"use client"

import type React from "react"

import { StarIcon } from "lucide-react"

export function Star({ className, ...props }: React.ComponentProps<typeof StarIcon>) {
  return <StarIcon className={className} {...props} />
}

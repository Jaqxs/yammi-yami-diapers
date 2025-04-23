import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"

const NextLink = React.forwardRef(({ className, children, href, ...props }, ref) => {
  return (
    <Link className={cn("text-yammy-blue hover:underline", className)} href={href} ref={ref} {...props}>
      {children}
    </Link>
  )
})
NextLink.displayName = "NextLink"

export { NextLink as Link }

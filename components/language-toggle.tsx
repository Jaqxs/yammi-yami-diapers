"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")} className={cn(language === "en" && "bg-muted")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("sw")} className={cn(language === "sw" && "bg-muted")}>
          Kiswahili
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

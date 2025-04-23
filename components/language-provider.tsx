"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Language types
export type Language = "en" | "sw"

// Language context type
type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (keys: { en: string; sw: string }) => string
}

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Helper function to get translation
  const t = (keys: { en: string; sw: string }) => {
    return keys[language]
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Hook to use language
export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

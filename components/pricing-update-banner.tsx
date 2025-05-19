"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function PricingUpdateBanner() {
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the banner has been dismissed before
    const bannerDismissed = localStorage.getItem("pricing-banner-dismissed")
    if (!bannerDismissed) {
      setIsVisible(true)
    }
  }, [])

  const dismissBanner = () => {
    setIsVisible(false)
    localStorage.setItem("pricing-banner-dismissed", "true")
  }

  if (!isVisible) return null

  return (
    <div className="bg-yammy-blue text-white p-3 text-center relative">
      <button
        onClick={dismissBanner}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
        aria-label={language === "en" ? "Close" : "Funga"}
      >
        <X size={18} />
      </button>
      <p className="text-sm font-medium">
        {language === "en"
          ? "🎉 Updated pricing! Baby Diapers now at 20,000 TZS and Baby Pants at 20,000 TZS. Special Premium Pants with red cup at 19,000 TZS!"
          : "🎉 Bei mpya! Diapers za Watoto sasa ni 20,000 TZS na Pants za Watoto ni 20,000 TZS. Pants Bora Maalum na kikombe chekundu ni 19,000 TZS!"}
      </p>
    </div>
  )
}

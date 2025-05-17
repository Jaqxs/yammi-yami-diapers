"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useCart } from "@/components/cart-provider"
import { OptimizedImage } from "@/components/optimized-image"
import type { Product } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"

interface ProductCardProps {
  product: Product
  onWhatsAppOrder: (product: Product) => void
}

export function ProductCard({ product, onWhatsAppOrder }: ProductCardProps) {
  const { language } = useLanguage()
  const { addItem, openCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [imageKey, setImageKey] = useState(Date.now())

  // Force image refresh when product changes
  useEffect(() => {
    setImageKey(Date.now())
  }, [product.id, product.image])

  const formatPrice = (price: number) => {
    return `TZS ${price.toLocaleString()}`
  }

  const handleAddToCart = () => {
    // Add item to cart
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: product.size,
      bundleSize: product.bundleSize,
    })

    // Explicitly open the cart
    openCart()

    // Show confirmation toast
    toast({
      title: language === "en" ? "Added to Cart" : "Imeongezwa kwenye Kikapu",
      description:
        language === "en"
          ? `${product.name.en} has been added to your cart`
          : `${product.name.sw} imeongezwa kwenye kikapu chako`,
      variant: "default",
      duration: 3000,
    })
  }

  // Get appropriate fallback image based on product category
  const getFallbackImage = () => {
    if (product.category === "babyDiapers") {
      return "/images/baby-diapers.png"
    } else if (product.category === "babyPants") {
      return "/images/baby-diapers.png"
    } else if (product.category === "adultDiapers") {
      return "/images/diaper-features.png"
    } else if (product.category === "ladyPads") {
      return "/images/lady-pads.png"
    }
    return "/assorted-products-display.png"
  }

  const t = {
    en: {
      retailPrice: "Retail Price",
      wholesalePrice: "Wholesale Price",
      pieces: "pieces",
      addToCart: "Add to Cart",
      orderViaWhatsApp: "Order via WhatsApp",
      bestSeller: "Best Seller",
      newArrival: "New Arrival",
      small: "Small",
      medium: "Medium",
      large: "Large",
      extraLarge: "Extra Large",
    },
    sw: {
      retailPrice: "Bei ya Rejareja",
      wholesalePrice: "Bei ya Jumla",
      pieces: "vipande",
      addToCart: "Ongeza kwenye Kikapu",
      orderViaWhatsApp: "Agiza kupitia WhatsApp",
      bestSeller: "Inayouzwa Zaidi",
      newArrival: "Mpya Sokoni",
      small: "Ndogo",
      medium: "Wastani",
      large: "Kubwa",
      extraLarge: "Kubwa Zaidi",
    },
  }

  // Process image URL to ensure it's not cached
  const getProcessedImageUrl = (url: string | undefined) => {
    if (!url) return undefined

    // If it's already a placeholder, return as is
    if (url.includes("placeholder.svg")) return url

    // Handle relative paths for local images
    if (url.startsWith("/")) {
      // For local images, ensure they're properly referenced
      return url
    }

    // Add cache-busting parameter
    const timestamp = imageKey
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}v=${timestamp}`
  }

  // Get the final image URL
  const getFinalImageUrl = (url: string | undefined) => {
    return getProcessedImageUrl(url)
  }

  return (
    <motion.div
      className="product-card bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-64 bg-yammy-light-blue">
        <OptimizedImage
          key={`product-image-${product.id}-${imageKey}`}
          src={getFinalImageUrl(product.image) || "/placeholder.svg?height=300&width=300&query=diaper product"}
          alt={product.name[language || "en"]}
          fill
          className="object-cover md:object-contain p-0"
          fallbackSrc={getFallbackImage()}
          quality={90}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={isHovered}
        />

        {/* Product tags */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.tags && Array.isArray(product.tags) && product.tags.includes("bestSeller") && (
            <Badge className="bg-yammy-orange text-white">{t[language].bestSeller}</Badge>
          )}
          {product.tags && Array.isArray(product.tags) && product.tags.includes("newArrival") && (
            <Badge className="bg-yammy-pink text-white">{t[language].newArrival}</Badge>
          )}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-bubblegum text-xl mb-1 text-yammy-dark-blue line-clamp-2">
          {(product.name[language || "en"] || "").replace("XXXL", "")}
        </h3>

        {/* Product details */}
        <div className="mb-3 text-sm text-gray-600">
          {product.size && (
            <div>
              {product.category === "babyDiapers" ? (
                language === "en" ? (
                  "Size:S,M,L,XL(5-19KG)"
                ) : (
                  "Ukubwa:S,M,L,XL(5-19KG)"
                )
              ) : (
                <>
                  {language === "en" ? "Size" : "Ukubwa"}:{" "}
                  {t[language][product.size as keyof typeof t.en] || product.size}
                  {product.weightRange && ` (${product.weightRange})`}
                  {product.hipSize && ` (${product.hipSize})`}
                </>
              )}
            </div>
          )}
          <div>
            {language === "en" ? "Bundle Size" : "Ukubwa wa Kifurushi"}: {product.bundleSize} {t[language].pieces}
            {product.cartonSize && ` (${product.cartonSize})`}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 mt-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">{t[language].retailPrice}:</span>
            <span className="text-yammy-blue font-bold">{formatPrice(product.price)}</span>
          </div>
          {product.wholesalePrice && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{t[language].wholesalePrice}:</span>
              <span className="text-yammy-orange font-medium">{formatPrice(product.wholesalePrice)}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            className="w-full bg-yammy-blue hover:bg-yammy-dark-blue rounded-full"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            <span>{t[language].addToCart}</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-yammy-blue text-yammy-blue hover:bg-yammy-blue hover:text-white rounded-full"
            onClick={() => onWhatsAppOrder(product)}
          >
            {t[language].orderViaWhatsApp}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

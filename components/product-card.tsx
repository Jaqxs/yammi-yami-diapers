"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, Package, Tag, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import type { Product } from "@/lib/store"
import { useCart } from "@/components/cart-provider"

interface ProductCardProps {
  product: Product
}

const translations = {
  en: {
    bundle: "Bundle",
    carton: "Carton",
    pieces: "pcs",
    weight: "Weight",
    hipSize: "Hip Size",
    addToCart: "Add to Cart",
    orderViaWhatsApp: "Order via WhatsApp",
    wholesale: "Wholesale",
    retail: "Retail",
    outOfStock: "Out of Stock",
    lowStock: "Low Stock",
    inStock: "In Stock",
    bestSeller: "Best Seller",
    newArrival: "New Arrival",
    premium: "Premium",
    japanStandard: "Japan Standard",
    internationalQuality: "International Quality",
    royal: "Royal Quality",
  },
  sw: {
    bundle: "Kifurushi",
    carton: "Kartoni",
    pieces: "vipande",
    weight: "Uzito",
    hipSize: "Ukubwa wa Nyonga",
    addToCart: "Ongeza kwenye Kikapu",
    orderViaWhatsApp: "Agiza kupitia WhatsApp",
    wholesale: "Jumla",
    retail: "Rejareja",
    outOfStock: "Haipatikani",
    lowStock: "Inakaribia Kuisha",
    inStock: "Inapatikana",
    bestSeller: "Inayouzwa Zaidi",
    newArrival: "Mpya Sokoni",
    premium: "Bora",
    japanStandard: "Kiwango cha Japani",
    internationalQuality: "Ubora wa Kimataifa",
    royal: "Ubora wa Kifalme",
  },
}

export function ProductCard({ product }: ProductCardProps) {
  const { language } = useLanguage()
  const t = translations[language || "en"]
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isImageError, setIsImageError] = useState(false)

  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name[language || "en"],
      price: product.price,
      quantity: 1,
      image: product.image || getPlaceholderImage(),
      size: product.size,
      bundleSize: product.bundleSize,
    })

    // Show success message (you can add toast notification here)
    console.log(`Added ${product.name[language || "en"]} to cart`)
  }

  // Get placeholder image based on category
  const getPlaceholderImage = () => {
    if (product.category === "babyDiapers") {
      return "/images/baby-diapers.png"
    } else if (product.category === "adultDiapers") {
      return "/images/diaper-features.png"
    } else if (product.category === "ladyPads") {
      return "/images/lady-pads.png"
    } else if (product.category === "babyPants") {
      return "/images/baby-diapers.png"
    } else {
      return "/assorted-products-display.png"
    }
  }

  // Get image source
  const imageSource = isImageError || !product.image ? getPlaceholderImage() : product.image

  // Get tag badge
  const getTagBadge = (tag: string) => {
    switch (tag) {
      case "bestSeller":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
            {t.bestSeller}
          </Badge>
        )
      case "newArrival":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            {t.newArrival}
          </Badge>
        )
      case "premium":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
            {t.premium}
          </Badge>
        )
      case "japanStandard":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            {t.japanStandard}
          </Badge>
        )
      case "internationalQuality":
        return (
          <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 border-indigo-200">
            {t.internationalQuality}
          </Badge>
        )
      case "royal":
        return (
          <Badge variant="secondary" className="bg-pink-100 text-pink-800 border-pink-200">
            {t.royal}
          </Badge>
        )
      default:
        return null
    }
  }

  // Get stock status
  const getStockStatus = () => {
    if (product.status === "outOfStock" || product.status === "inactive") {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          {t.outOfStock}
        </Badge>
      )
    } else if (product.status === "low_stock") {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          {t.lowStock}
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          {t.inStock}
        </Badge>
      )
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-yammy-blue/10">
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {isImageLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}
        <Image
          src={imageSource || "/placeholder.svg"}
          alt={product.name[language || "en"]}
          fill
          className={`object-cover transition-opacity duration-300 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setIsImageLoading(false)}
          onError={() => {
            setIsImageLoading(false)
            setIsImageError(true)
          }}
        />
        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-yammy-blue text-white">
              <Tag className="h-3 w-3 mr-1" />
              {language === "en" ? "Featured" : "Maalum"}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="flex-grow p-4">
        <div className="flex flex-wrap gap-2 mb-3">
          {product.tags?.map((tag) => (
            <div key={tag}>{getTagBadge(tag)}</div>
          ))}
          {getStockStatus()}
        </div>

        <h3 className="text-lg font-semibold mb-2 text-yammy-dark-blue">{product.name[language || "en"]}</h3>

        <div className="space-y-2 mb-4">
          {/* Price information */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yammy-blue">TZS {product.price.toLocaleString()}</p>
              {product.wholesalePrice && (
                <p className="text-sm text-gray-600">
                  {t.wholesale}: TZS {product.wholesalePrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Bundle information */}
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-4 w-4 mr-1" />
            <span>
              {t.bundle}: {product.bundleSize} {t.pieces}
            </span>
          </div>

          {/* Carton information */}
          {product.cartonSize && (
            <div className="flex items-center text-sm text-gray-600">
              <Package className="h-4 w-4 mr-1" />
              <span>
                {t.carton}: {product.cartonSize}
              </span>
            </div>
          )}

          {/* Weight range */}
          {product.weightRange && (
            <div className="flex items-center text-sm text-gray-600">
              <Info className="h-4 w-4 mr-1" />
              <span>
                {t.weight}: {product.weightRange}
              </span>
            </div>
          )}

          {/* Hip size for adult diapers */}
          {product.hipSize && (
            <div className="flex items-center text-sm text-gray-600">
              <Info className="h-4 w-4 mr-1" />
              <span>
                {t.hipSize}: {product.hipSize}
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="grid grid-cols-1 gap-2 w-full">
          <Button
            className="w-full bg-yammy-blue hover:bg-yammy-dark-blue"
            onClick={handleAddToCart}
            disabled={product.status === "outOfStock" || product.status === "inactive"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t.addToCart}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

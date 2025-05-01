"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ShoppingCart, Filter, Search, Tag, Star, RefreshCw } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"
import { useCart } from "@/components/cart-provider"
import { useStore } from "@/lib/store"
import { useStoreSync } from "@/lib/store-sync"
import { AdminChangeNotification } from "@/components/admin-change-notification"

// Language translations
const translations = {
  en: {
    products: "Products",
    allProducts: "All Products",
    babyDiapers: "Baby Diapers",
    babyPants: "Baby Pants",
    ladyPads: "Lady Pads",
    adultDiapers: "Adult Pants",
    filter: "Filter",
    search: "Search products...",
    sort: "Sort By",
    price: "Price",
    size: "Size",
    apply: "Apply Filters",
    reset: "Reset",
    priceRange: "Price Range",
    addToCart: "Add to Cart",
    orderViaWhatsApp: "Order via WhatsApp",
    noProducts: "No products found",
    newest: "Newest",
    priceHighToLow: "Price: High to Low",
    priceLowToHigh: "Price: Low to High",
    small: "Small",
    medium: "Medium",
    large: "Large",
    extraLarge: "Extra Large",
    viewPricing: "View Pricing",
    wholesale: "Wholesale Available",
    japanStandard: "Japan Standard",
    highAbsorption: "High Absorption",
    viewDetails: "View Details",
    pieces: "pieces",
    bestSeller: "Best Seller",
    newArrival: "New Arrival",
    internationalQuality: "International Quality",
    viewAllPricing: "View All Pricing",
    retailPrice: "Retail Price",
    wholesalePrice: "Wholesale Price",
    perBundle: "per bundle",
    bundleSize: "Bundle Size",
    priceNote: "* Prices in Dar es Salaam/Kariakoo. See Pricing page for details.",
    loading: "Loading products...",
    refresh: "Refresh Products",
  },
  sw: {
    products: "Bidhaa",
    allProducts: "Bidhaa Zote",
    babyDiapers: "Diapers za Watoto",
    babyPants: "Pants za Watoto",
    ladyPads: "Pedi za Wanawake",
    adultDiapers: "Pants za Watu Wazima",
    filter: "Chuja",
    search: "Tafuta bidhaa...",
    sort: "Panga Kwa",
    price: "Bei",
    size: "Ukubwa",
    apply: "Tumia Vichujio",
    reset: "Anza Upya",
    priceRange: "Kipimo cha Bei",
    addToCart: "Ongeza kwenye Kikapu",
    orderViaWhatsApp: "Agiza kupitia WhatsApp",
    noProducts: "Hakuna bidhaa zilizopatikana",
    newest: "Mpya Zaidi",
    priceHighToLow: "Bei: Juu hadi Chini",
    priceLowToHigh: "Bei: Chini hadi Chini",
    small: "Ndogo",
    medium: "Wastani",
    large: "Kubwa",
    extraLarge: "Kubwa Zaidi",
    viewPricing: "Tazama Bei",
    wholesale: "Jumla Inapatikana",
    japanStandard: "Kiwango cha Japan",
    highAbsorption: "Unyonywaji wa Hali ya Juu",
    viewDetails: "Tazama Maelezo",
    pieces: "vipande",
    bestSeller: "Inayouzwa Zaidi",
    newArrival: "Mpya Sokoni",
    internationalQuality: "Ubora wa Kimataifa",
    viewAllPricing: "Tazama Bei Zote",
    retailPrice: "Bei ya Rejareja",
    wholesalePrice: "Bei ya Jumla",
    perBundle: "kwa kifurushi",
    bundleSize: "Ukubwa wa Kifurushi",
    priceNote: "* Bei hizi ni za Dar es Salaam/Kariakoo. Tazama ukurasa wa Bei kwa maelezo zaidi.",
    loading: "Inapakia bidhaa...",
    refresh: "Onyesha Upya Bidhaa",
  },
}

export default function ProductsPage() {
  const { language } = useLanguage()
  const { addItem } = useCart()
  const { state, loadProducts } = useStore()
  const { lastEvent } = useStoreSync()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 30000])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("newest")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [imageLoadError, setImageLoadError] = useState<Record<number, boolean>>({})

  const t = translations[language || "en"]

  // Load products on component mount and when sync events occur
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        await loadProducts()
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [loadProducts])

  // Listen for sync events
  useEffect(() => {
    if (lastEvent && lastEvent.type === "product") {
      // Refresh products when a product-related event occurs
      const refreshProducts = async () => {
        setIsRefreshing(true)
        try {
          await loadProducts()

          // If we received an "add" action, show a subtle notification
          if (lastEvent.action === "add") {
            // Reset filters to help user see the new product
            if (searchQuery || activeTab !== "all" || selectedSize) {
              // Optional: Show a toast or notification that filters are being reset to show new content
              setSearchQuery("")
              setActiveTab("all")
              setSelectedSize(null)
              setPriceRange([0, 30000])
            }
          }
        } catch (error) {
          console.error("Error refreshing products:", error)
        } finally {
          setIsRefreshing(false)
        }
      }

      refreshProducts()
    }
  }, [lastEvent, loadProducts, activeTab, searchQuery, selectedSize])

  // Function to refresh products
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await loadProducts()
    } catch (error) {
      console.error("Error refreshing products:", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [loadProducts])

  const formatPrice = (price: number) => {
    return `TZS ${price.toLocaleString()}`
  }

  // Handle image load error
  const handleImageError = (productId: number) => {
    console.log(`Image load error for product ${productId}`)
    setImageLoadError((prev) => ({
      ...prev,
      [productId]: true,
    }))
  }

  // Filter products based on active filters
  const filteredProducts = state.products.filter((product) => {
    // Filter by category
    if (activeTab !== "all") {
      if (activeTab === "wholesale") {
        // For wholesale tab, show products with wholesalePrice
        if (!product.wholesalePrice) {
          return false
        }
      } else if (product.category !== activeTab) {
        // For other tabs, filter by category
        return false
      }
    }

    // Filter by search query
    if (searchQuery && !product.name[language || "en"].toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false
    }

    // Filter by size
    if (selectedSize && product.size !== selectedSize) {
      return false
    }

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "priceHighToLow") {
      return b.price - a.price
    } else if (sortOption === "priceLowToHigh") {
      return a.price - b.price
    }
    // Default: newest (by id in this demo)
    return b.id - a.id
  })

  // Handle WhatsApp order
  const handleWhatsAppOrder = (product: (typeof state.products)[0]) => {
    const message = `Hello, I would like to order: ${product.name[language || "en"]} - ${formatPrice(product.price)}`
    const whatsappUrl = `https://wa.me/255773181863?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleAddToCart = (product: (typeof state.products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: product.size,
      bundleSize: product.bundleSize,
    })
  }

  // Get fallback image based on product category
  const getFallbackImage = (product: (typeof state.products)[0]) => {
    if (product.category === "babyDiapers") {
      return "/images/products/baby-diaper-m.png"
    } else if (product.category === "babyPants") {
      return "/images/products/baby-diaper-l.png"
    } else if (product.category === "adultDiapers") {
      return "/images/products/adult-pants-l.png"
    }
    return "/assorted-products-display.png"
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bubblegum mb-8 text-yammy-dark-blue text-center">{t.products}</h1>

        {/* Featured banner */}
        <div className="relative w-full mb-8 p-6 rounded-xl bg-gradient-to-r from-yammy-blue to-yammy-dark-blue text-white">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bubblegum mb-3">
              {language === "en" ? "High-Quality Products at Affordable Prices" : "Bidhaa Bora kwa Bei Nafuu"}
            </h2>
            <p className="mb-4">
              {language === "en"
                ? "Twice as cost-effective as typical market offerings while maintaining international quality standards."
                : "Mara mbili ya gharama nafuu kuliko bidhaa za kawaida za soko huku zikidumisha viwango vya kimataifa."}
            </p>
            <Button asChild variant="secondary">
              <Link href="/pricing">{t.viewAllPricing}</Link>
            </Button>
          </div>
          <div className="absolute right-6 bottom-0 hidden lg:block">
            <div className="relative w-32 h-32">
              <Tag className="h-8 w-8 text-white absolute -top-4 -right-4" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yammy-blue h-4 w-4" />
              <Input
                type="text"
                placeholder={t.search}
                className="pl-10 border-yammy-blue/30 focus-visible:ring-yammy-blue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="border-yammy-blue/30 text-yammy-blue">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="font-bubblegum text-yammy-dark-blue text-2xl">{t.filter}</SheetTitle>
                  <SheetDescription>
                    {language === "en"
                      ? "Adjust filters to find the perfect products for you."
                      : "Rekebisha vichujio kupata bidhaa zinazokufaa."}
                  </SheetDescription>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-yammy-dark-blue">{t.priceRange}</h3>
                    <Slider
                      defaultValue={[0, 30000]}
                      max={30000}
                      step={1000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="[&>span]:bg-yammy-blue"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>

                  {/* Size Filter */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-yammy-dark-blue">{t.size}</h3>
                    <Select
                      value={selectedSize || "all"}
                      onValueChange={(value) => setSelectedSize(value === "all" ? null : value)}
                    >
                      <SelectTrigger className="border-yammy-blue/30 focus:ring-yammy-blue">
                        <SelectValue placeholder={language === "en" ? "Select size" : "Chagua ukubwa"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{language === "en" ? "All sizes" : "Ukubwa wote"}</SelectItem>
                        <SelectItem value="small">{t.small}</SelectItem>
                        <SelectItem value="medium">{t.medium}</SelectItem>
                        <SelectItem value="large">{t.large}</SelectItem>
                        <SelectItem value="extraLarge">{t.extraLarge}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-yammy-blue/30 text-yammy-blue"
                      onClick={() => {
                        setPriceRange([0, 30000])
                        setSelectedSize(null)
                      }}
                    >
                      {t.reset}
                    </Button>
                    <Button className="flex-1 bg-yammy-blue hover:bg-yammy-dark-blue">{t.apply}</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="border-yammy-blue/30 text-yammy-blue"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {t.refresh}
            </Button>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[180px] border-yammy-blue/30 focus:ring-yammy-blue">
                <SelectValue placeholder={t.sort} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t.newest}</SelectItem>
                <SelectItem value="priceHighToLow">{t.priceHighToLow}</SelectItem>
                <SelectItem value="priceLowToHigh">{t.priceLowToHigh}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 bg-yammy-light-blue">
            <TabsTrigger
              value="all"
              className="font-bubblegum data-[state=active]:bg-yammy-blue data-[state=active]:text-white"
            >
              {t.allProducts}
            </TabsTrigger>
            <TabsTrigger
              value="babyDiapers"
              className="font-bubblegum data-[state=active]:bg-yammy-blue data-[state=active]:text-white"
            >
              {t.babyDiapers}
            </TabsTrigger>
            <TabsTrigger
              value="babyPants"
              className="font-bubblegum data-[state=active]:bg-yammy-blue data-[state=active]:text-white"
            >
              {t.babyPants}
            </TabsTrigger>
            <TabsTrigger
              value="adultDiapers"
              className="font-bubblegum data-[state=active]:bg-yammy-blue data-[state=active]:text-white"
            >
              {t.adultDiapers}
            </TabsTrigger>
            <TabsTrigger
              value="wholesale"
              className="font-bubblegum data-[state=active]:bg-yammy-blue data-[state=active]:text-white"
            >
              {t.wholesale}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        {isLoading || isRefreshing ? (
          <div className="text-center py-12">
            <div className="animate-spin w-10 h-10 border-4 border-yammy-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 font-bubblegum text-xl">{t.loading}</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                className="product-card bg-white rounded-2xl shadow-md overflow-hidden"
                whileHover={{ y: -10 }}
              >
                <div className="relative h-64 bg-yammy-light-blue">
                  {imageLoadError[product.id] ? (
                    <Image
                      src={`${getFallbackImage(product)}?v=${Date.now()}`}
                      alt={product.name[language || "en"]}
                      fill
                      className="object-contain p-4"
                      onError={() => {
                        // If even the fallback fails, use a generic placeholder
                        const img = document.getElementById(`product-img-${product.id}`) as HTMLImageElement
                        if (img) {
                          img.src = `/assorted-products-display.png?v=${Date.now()}`
                        }
                      }}
                    />
                  ) : (
                    <Image
                      id={`product-img-${product.id}`}
                      src={`${product.image || "/placeholder.svg"}?v=${Date.now()}`}
                      alt={product.name[language || "en"]}
                      fill
                      className="object-contain p-4"
                      onError={() => handleImageError(product.id)}
                    />
                  )}
                  {/* Product tags */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.tags && Array.isArray(product.tags) && product.tags.includes("bestSeller") && (
                      <Badge className="bg-yammy-orange text-white">{t.bestSeller}</Badge>
                    )}
                    {product.tags && Array.isArray(product.tags) && product.tags.includes("newArrival") && (
                      <Badge className="bg-yammy-pink text-white">{t.newArrival}</Badge>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bubblegum text-xl mb-1 text-yammy-dark-blue">{product.name[language || "en"]}</h3>

                  {/* Product details */}
                  <div className="mb-3 text-sm text-gray-600">
                    {product.size && (
                      <div>
                        {language === "en" ? "Size" : "Ukubwa"}: {t[product.size as keyof typeof t] || product.size}
                        {product.weightRange && ` (${product.weightRange})`}
                        {product.hipSize && ` (${product.hipSize})`}
                      </div>
                    )}
                    <div>
                      {language === "en" ? "Bundle Size" : "Ukubwa wa Kifurushi"}: {product.bundleSize} {t.pieces}
                      {product.cartonSize && ` (${product.cartonSize})`}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{t.retailPrice}:</span>
                      <span className="text-yammy-blue font-bold">{formatPrice(product.price)}</span>
                    </div>
                    {product.wholesalePrice && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">{t.wholesalePrice}:</span>
                        <span className="text-yammy-orange font-medium">{formatPrice(product.wholesalePrice)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="w-full bg-yammy-blue hover:bg-yammy-dark-blue rounded-full"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t.addToCart}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-yammy-blue text-yammy-blue hover:bg-yammy-blue hover:text-white rounded-full"
                      onClick={() => handleWhatsAppOrder(product)}
                    >
                      {t.orderViaWhatsApp}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 font-bubblegum text-xl">{t.noProducts}</p>
          </div>
        )}

        {/* Price note */}
        <div className="mt-8 text-sm text-gray-500 text-center">{t.priceNote}</div>

        {/* CTA to pricing page */}
        <div className="mt-12 text-center">
          <Button asChild className="bg-yammy-blue hover:bg-yammy-dark-blue">
            <Link href="/pricing">{t.viewAllPricing}</Link>
          </Button>
        </div>
      </div>

      {/* Brand Ambassador Testimonial */}
      <section className="py-12 bg-yammy-light-blue">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-[400px]">
              <Image
                src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-21%20at%2004.17.11_e98c889a.jpg-qImS0ea607vm0WJyywYVFZ0KBHG2zi.jpeg?v=${Date.now()}`}
                alt="Brand Ambassador with Yammy Yami Products"
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `/images/ambassador-6.png?v=${Date.now()}`
                }}
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bubblegum text-yammy-dark-blue mb-4">
                {language === "en" ? "Trusted by Our Ambassadors" : "Inaaminiwa na Mabalozi Wetu"}
              </h2>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yammy-orange text-yammy-orange" />
                ))}
              </div>
              <blockquote className="text-lg italic text-gray-700 mb-6">
                {language === "en"
                  ? "I love Yammy Yami products because they provide the perfect combination of comfort, quality, and affordability. As a brand ambassador, I'm proud to represent a company that truly cares about Tanzanian families."
                  : "Ninapenda bidhaa za Yammy Yami kwa sababu zinatoa mchanganyiko kamili wa faraja, ubora, na bei nafuu. Kama balozi wa bidhaa, ninajivunia kuwakilisha kampuni inayojali kweli familia za Kitanzania."}
              </blockquote>
              <p className="font-bold text-yammy-dark-blue">
                {language === "en" ? "Brand Ambassador" : "Balozi wa Bidhaa"}
              </p>
              <p className="text-yammy-blue">Yammy Yami Diaper TZ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Change Notification */}
      <AdminChangeNotification />
    </PageWrapper>
  )
}

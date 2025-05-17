"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { Filter, Search, Tag, RefreshCw } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"
import { useStore } from "@/lib/store"
import { useStoreSync } from "@/lib/store-sync"
import { AdminChangeNotification } from "@/components/admin-change-notification"
import { ProductCard } from "@/components/product-card"
import { useIsMobile, useIsTablet } from "@/hooks/use-media-query"
import { toast } from "@/components/ui/use-toast"
import { CriticalImagesLoader } from "@/components/critical-images-loader"

// Dynamically import heavy components
const BrandAmbassadorSection = dynamic(() => import("@/components/brand-ambassador-section"), {
  loading: () => <div className="h-[400px] bg-yammy-light-blue animate-pulse rounded-lg"></div>,
  ssr: false,
})

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
    noProducts: "No products found",
    newest: "Newest",
    priceHighToLow: "Price: High to Low",
    priceLowToHigh: "Price: Low to High",
    viewAllPricing: "View All Pricing",
    priceNote: "* Prices in Dar es Salaam/Kariakoo. See Pricing page for details.",
    loading: "Loading products...",
    refresh: "Refresh Products",
    clearCache: "Clear Image Cache",
    imageCacheCleared: "Image cache cleared successfully",
    productsRefreshed: "Products refreshed successfully",
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
    size: "Size",
    apply: "Tumia Vichujio",
    reset: "Anza Upya",
    priceRange: "Kipimo cha Bei",
    noProducts: "Hakuna bidhaa zilizopatikana",
    newest: "Mpya Zaidi",
    priceHighToLow: "Bei: Juu hadi Chini",
    priceLowToHigh: "Bei: Chini hadi Chini",
    viewAllPricing: "Tazama Bei Zote",
    priceNote: "* Bei hizi ni za Dar es Salaam/Kariakoo. Tazama ukurasa wa Bei kwa maelezo zaidi.",
    loading: "Inapakia bidhaa...",
    refresh: "Onyesha Upya Bidhaa",
    clearCache: "Futa Picha zilizohifadhiwa",
    imageCacheCleared: "Picha zilizohifadhiwa zimefutwa kwa mafanikio",
    productsRefreshed: "Bidhaa zimeonyeshwa upya kwa mafanikio",
  },
}

// Loading skeleton component
function ProductsSkeleton() {
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  let columns = 4
  if (isMobile) columns = 1
  else if (isTablet) columns = 2

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden h-[500px]">
          <div className="h-64 bg-gray-200 animate-pulse"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProductsPage() {
  const { language } = useLanguage()
  const { state, loadProducts } = useStore()
  const { lastEvent } = useStoreSync()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 30000])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("newest")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [imageVersion, setImageVersion] = useState(Date.now())
  const isMobile = useIsMobile()
  const t = translations[language || "en"]

  // Preload category-specific images when tab changes

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
          // Force image refresh by updating the version
          setImageVersion(Date.now())

          // If we received an "add" action, show a subtle notification
          if (lastEvent.action === "add") {
            // Optional: Show a toast or notification that filters are being reset to show new content
            if (searchQuery || activeTab !== "all" || selectedSize) {
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
      // Force image refresh by updating the version
      setImageVersion(Date.now())

      // Show success toast
      toast({
        title: language === "en" ? "Success" : "Mafanikio",
        description: t.productsRefreshed,
        variant: "default",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error refreshing products:", error)
    } finally {
      setIsRefreshing(false)
    }
  }, [loadProducts, language, t])

  // Function to clear image cache
  const clearImageCache = useCallback(() => {
    // Update image version to force refresh
    setImageVersion(Date.now())

    // Clear browser cache for images if possible
    if ("caches" in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (cacheName.includes("image")) {
            caches.delete(cacheName)
          }
        })
      })
    }

    // Clear localStorage image cache if any exists
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.includes("image-cache")) {
        localStorage.removeItem(key)
      }
    })

    // Force reload images by updating state
    setIsRefreshing(true)

    // Show success toast
    toast({
      title: language === "en" ? "Success" : "Mafanikio",
      description: t.imageCacheCleared,
      variant: "default",
      duration: 3000,
    })

    // Reload products to refresh images
    loadProducts().then(() => {
      setTimeout(() => setIsRefreshing(false), 500)
    })

    // Try to clear service worker cache if available
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_IMAGE_CACHE",
      })
    }
  }, [loadProducts, language, t])

  // Handle WhatsApp order
  const handleWhatsAppOrder = useCallback(
    (product) => {
      const message = `Hello, I would like to order: ${product.name[language || "en"]} - TZS ${product.price.toLocaleString()}`
      const whatsappUrl = `https://wa.me/255773181863?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    },
    [language],
  )

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

  // Process product images to ensure they have proper URLs
  const processedProducts = sortedProducts.map((product) => {
    // Make a copy of the product to avoid mutating the original
    const processedProduct = { ...product }

    // Ensure image has a valid URL or use a placeholder
    if (!processedProduct.image || processedProduct.image.trim() === "") {
      // Set category-specific placeholder
      if (processedProduct.category === "babyDiapers") {
        processedProduct.image = "/images/baby-diapers.png"
      } else if (processedProduct.category === "adultDiapers") {
        processedProduct.image = "/images/diaper-features.png"
      } else if (processedProduct.category === "ladyPads") {
        processedProduct.image = "/images/lady-pads.png"
      } else if (processedProduct.category === "babyPants") {
        processedProduct.image = "/images/baby-diapers.png"
      } else {
        processedProduct.image = "/assorted-products-display.png"
      }
    }

    // Add version to image URL to prevent caching
    if (processedProduct.image && !processedProduct.image.includes("placeholder")) {
      const separator = processedProduct.image.includes("?") ? "&" : "?"
      processedProduct.image = `${processedProduct.image}${separator}v=${imageVersion}`
    }

    return processedProduct
  })

  return (
    <PageWrapper>
      {/* Preload critical images */}
      <CriticalImagesLoader />

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
                      <span>TZS {priceRange[0].toLocaleString()}</span>
                      <span>TZS {priceRange[1].toLocaleString()}</span>
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
                        <SelectItem value="small">{language === "en" ? "Small" : "Ndogo"}</SelectItem>
                        <SelectItem value="medium">{language === "en" ? "Medium" : "Wastani"}</SelectItem>
                        <SelectItem value="large">{language === "en" ? "Large" : "Kubwa"}</SelectItem>
                        <SelectItem value="extraLarge">{language === "en" ? "Extra Large" : "Kubwa Zaidi"}</SelectItem>
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

            <Button
              variant="outline"
              size="sm"
              className="border-yammy-blue/30 text-yammy-blue"
              onClick={clearImageCache}
            >
              {t.clearCache}
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
          <TabsList className={`grid w-full ${isMobile ? "grid-cols-2 gap-2" : "grid-cols-5"} bg-yammy-light-blue`}>
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
            {!isMobile && (
              <>
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
                  {language === "en" ? "Wholesale" : "Jumla"}
                </TabsTrigger>
              </>
            )}
            {isMobile && (
              <>
                <TabsTrigger
                  value="more"
                  className="font-bubblegum data-[state=active]:bg-yammy-blue data-[state=active]:text-white"
                  onClick={() => {
                    // Show a sheet with more category options for mobile
                    document.getElementById("more-categories-trigger")?.click()
                  }}
                >
                  {language === "en" ? "More..." : "Zaidi..."}
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>

        {/* Mobile: More Categories Sheet */}
        {isMobile && (
          <Sheet>
            <SheetTrigger id="more-categories-trigger" className="hidden"></SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>{language === "en" ? "Categories" : "Jamii"}</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-1 gap-2 py-4">
                <Button
                  variant={activeTab === "babyPants" ? "default" : "outline"}
                  className={activeTab === "babyPants" ? "bg-yammy-blue" : ""}
                  onClick={() => {
                    setActiveTab("babyPants")
                    document.getElementById("more-categories-close")?.click()
                  }}
                >
                  {t.babyPants}
                </Button>
                <Button
                  variant={activeTab === "adultDiapers" ? "default" : "outline"}
                  className={activeTab === "adultDiapers" ? "bg-yammy-blue" : ""}
                  onClick={() => {
                    setActiveTab("adultDiapers")
                    document.getElementById("more-categories-close")?.click()
                  }}
                >
                  {t.adultDiapers}
                </Button>
                <Button
                  variant={activeTab === "wholesale" ? "default" : "outline"}
                  className={activeTab === "wholesale" ? "bg-yammy-blue" : ""}
                  onClick={() => {
                    setActiveTab("wholesale")
                    document.getElementById("more-categories-close")?.click()
                  }}
                >
                  {language === "en" ? "Wholesale" : "Jumla"}
                </Button>
              </div>
              <Button id="more-categories-close" className="hidden">
                Close
              </Button>
            </SheetContent>
          </Sheet>
        )}

        {/* Products Grid */}
        {isLoading || isRefreshing ? (
          <ProductsSkeleton />
        ) : processedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedProducts.map((product) => (
              <div key={`${product.id}-${imageVersion}`} className="h-full">
                <ProductCard product={product} onWhatsAppOrder={handleWhatsAppOrder} />
              </div>
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
      <Suspense fallback={<div className="h-[400px] bg-yammy-light-blue animate-pulse rounded-lg"></div>}>
        <BrandAmbassadorSection />
      </Suspense>

      {/* Admin Change Notification */}
      <AdminChangeNotification />
    </PageWrapper>
  )
}

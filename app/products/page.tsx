"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { Filter, Search, Tag, RefreshCw, Database, WifiOff, Clock, Package, TrendingUp } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"
import { useStore } from "@/lib/store"
import { ProductCard } from "@/components/product-card"
import { useIsMobile } from "@/hooks/use-media-query"
import { toast } from "@/components/ui/use-toast"
import { DebugProductsButton } from "@/components/debug-products-button"

// Dynamically import heavy components
const BrandAmbassadorSection = dynamic(() => import("@/components/brand-ambassador-section"), {
  loading: () => <div className="h-[400px] bg-yammy-light-blue animate-pulse rounded-lg"></div>,
  ssr: false,
})

// Language translations
const translations = {
  en: {
    products: "Our Products",
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
    viewAllPricing: "View Complete Price List",
    priceNote: "* Prices shown are for Dar es Salaam/Kariakoo. Contact us for other regions.",
    loading: "Loading products...",
    refresh: "Refresh Products",
    clearCache: "Clear Cache",
    imageCacheCleared: "Cache cleared successfully",
    productsRefreshed: "Products refreshed successfully",
    liveData: "Live Data",
    cachedData: "Cached Data",
    fallbackData: "Offline Mode",
    offline: "Offline",
    synced: "Last Updated",
    totalProducts: "Total Products",
    categories: "Categories",
    priceRange: "Price Range",
    wholesale: "Wholesale",
    retail: "Retail",
    featuredProducts: "Featured Products",
    premiumQuality: "Premium Quality Products",
    qualityDescription: "International standard baby care products with superior absorption and comfort",
    japanStandard: "Japan Standard",
    internationalQuality: "International Quality",
    bestSeller: "Best Seller",
    newArrival: "New Arrival",
    premium: "Premium",
    royal: "Royal Quality",
  },
  sw: {
    products: "Bidhaa Zetu",
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
    noProducts: "Hakuna bidhaa zilizopatikana",
    newest: "Mpya Zaidi",
    priceHighToLow: "Bei: Juu hadi Chini",
    priceLowToHigh: "Bei: Chini hadi Juu",
    viewAllPricing: "Tazama Orodha Kamili ya Bei",
    priceNote: "* Bei hizi ni za Dar es Salaam/Kariakoo. Wasiliana nasi kwa mikoa mingine.",
    loading: "Inapakia bidhaa...",
    refresh: "Onyesha Upya Bidhaa",
    clearCache: "Futa Cache",
    imageCacheCleared: "Cache imefutwa kwa mafanikio",
    productsRefreshed: "Bidhaa zimeonyeshwa upya kwa mafanikio",
    liveData: "Data ya Moja kwa Moja",
    cachedData: "Data iliyohifadhiwa",
    fallbackData: "Hali ya Nje ya Mtandao",
    offline: "Nje ya Mtandao",
    synced: "Ilisasishwa Mwisho",
    totalProducts: "Jumla ya Bidhaa",
    categories: "Aina",
    priceRange: "Kipimo cha Bei",
    wholesale: "Jumla",
    retail: "Rejareja",
    featuredProducts: "Bidhaa Maalum",
    premiumQuality: "Bidhaa za Ubora wa Hali ya Juu",
    qualityDescription: "Bidhaa za utunzaji wa watoto za kiwango cha kimataifa zenye unyonywaji bora na faraja",
    japanStandard: "Kiwango cha Japani",
    internationalQuality: "Ubora wa Kimataifa",
    bestSeller: "Inayouzwa Zaidi",
    newArrival: "Mpya Sokoni",
    premium: "Bora",
    royal: "Ubora wa Kifalme",
  },
}

// Loading skeleton component
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
  const { products, loadProducts, isLoading, error, lastSync, dataSource, refreshProducts } = useStore()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 35000])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("featured")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [imageVersion, setImageVersion] = useState(Date.now())
  const isMobile = useIsMobile()
  const t = translations[language || "en"]

  // Load products on component mount
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Function to refresh products
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refreshProducts()
      setImageVersion(Date.now())

      toast({
        title: language === "en" ? "Success" : "Mafanikio",
        description: t.productsRefreshed,
        variant: "default",
        duration: 3000,
      })
    } catch (error) {
      console.error("Error refreshing products:", error)
      toast({
        title: language === "en" ? "Error" : "Hitilafu",
        description: language === "en" ? "Failed to refresh products" : "Imeshindwa kusasisha bidhaa",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsRefreshing(false)
    }
  }, [language, t, refreshProducts])

  // Function to clear cache
  const clearCache = useCallback(() => {
    setImageVersion(Date.now())
    localStorage.clear()

    toast({
      title: language === "en" ? "Success" : "Mafanikio",
      description: t.imageCacheCleared,
      variant: "default",
      duration: 3000,
    })

    setTimeout(() => window.location.reload(), 1000)
  }, [language, t])

  // Handle WhatsApp order
  const handleWhatsAppOrder = useCallback(
    (product) => {
      const message = `Hello, I would like to order: ${product.name[language || "en"]} - TZS ${product.price.toLocaleString()}`
      const whatsappUrl = `https://wa.me/255773181863?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    },
    [language],
  )

  // Get data source badge
  const getDataSourceBadge = () => {
    switch (dataSource) {
      case "database":
        return (
          <Badge variant="default" className="text-xs bg-green-100 text-green-800 border-green-200">
            <Database className="h-3 w-3 mr-1" />
            {t.liveData}
          </Badge>
        )
      case "cache":
        return (
          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            {t.cachedData}
          </Badge>
        )
      case "fallback":
        return (
          <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
            <WifiOff className="h-3 w-3 mr-1" />
            {t.fallbackData}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-xs">
            <WifiOff className="h-3 w-3 mr-1" />
            {t.offline}
          </Badge>
        )
    }
  }

  // Filter products based on active filters
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (activeTab !== "all") {
      if (activeTab === "wholesale") {
        if (!product.wholesalePrice) {
          return false
        }
      } else if (product.category !== activeTab) {
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
    if (sortOption === "featured") {
      // Featured first, then by category, then by price
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      if (a.category !== b.category) return a.category.localeCompare(b.category)
      return a.price - b.price
    } else if (sortOption === "priceHighToLow") {
      return b.price - a.price
    } else if (sortOption === "priceLowToHigh") {
      return a.price - b.price
    }
    // Default: newest (by id)
    return b.id - a.id
  })

  // Process product images
  const processedProducts = sortedProducts.map((product) => {
    const processedProduct = { ...product }

    if (!processedProduct.image || processedProduct.image.trim() === "") {
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

    if (processedProduct.image && !processedProduct.image.includes("placeholder")) {
      const separator = processedProduct.image.includes("?") ? "&" : "?"
      processedProduct.image = `${processedProduct.image}${separator}v=${imageVersion}`
    }

    return processedProduct
  })

  // Get product statistics
  const stats = {
    total: products.length,
    categories: Array.from(new Set(products.map((p) => p.category))).length,
    priceRange: {
      min: Math.min(...products.map((p) => p.price)),
      max: Math.max(...products.map((p) => p.price)),
    },
    featured: products.filter((p) => p.featured).length,
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bubblegum mb-4 text-yammy-dark-blue">{t.products}</h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">{t.qualityDescription}</p>

          {/* Product Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Package className="h-5 w-5 text-yammy-blue mr-2" />
                  <span className="text-2xl font-bold text-yammy-dark-blue">{stats.total}</span>
                </div>
                <p className="text-sm text-gray-600">{t.totalProducts}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Tag className="h-5 w-5 text-yammy-blue mr-2" />
                  <span className="text-2xl font-bold text-yammy-dark-blue">{stats.categories}</span>
                </div>
                <p className="text-sm text-gray-600">{t.categories}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-yammy-blue mr-2" />
                  <span className="text-2xl font-bold text-yammy-dark-blue">{stats.featured}</span>
                </div>
                <p className="text-sm text-gray-600">{t.featuredProducts}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-yammy-dark-blue">
                    TZS {stats.priceRange.min.toLocaleString()} - {stats.priceRange.max.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{t.priceRange}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured banner */}
        <div className="relative w-full mb-8 p-6 rounded-xl bg-gradient-to-r from-yammy-blue to-yammy-dark-blue text-white">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bubblegum mb-3">{t.premiumQuality}</h2>
            <p className="mb-4">
              {language === "en"
                ? "From baby diapers to adult pants - complete range of hygiene products with international quality standards."
                : "Kutoka diapers za watoto hadi pants za watu wazima - mfumo kamili wa bidhaa za usafi zenye viwango vya kimataifa."}
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

        {/* Controls Section */}
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
                      defaultValue={[0, 35000]}
                      max={35000}
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
                        <SelectItem value="small">{language === "en" ? "Small (S)" : "Ndogo (S)"}</SelectItem>
                        <SelectItem value="medium">{language === "en" ? "Medium (M)" : "Wastani (M)"}</SelectItem>
                        <SelectItem value="large">{language === "en" ? "Large (L)" : "Kubwa (L)"}</SelectItem>
                        <SelectItem value="extraLarge">
                          {language === "en" ? "Extra Large (XL)" : "Kubwa Zaidi (XL)"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      className="flex-1 border-yammy-blue/30 text-yammy-blue"
                      onClick={() => {
                        setPriceRange([0, 35000])
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

            <Button variant="outline" size="sm" className="border-yammy-blue/30 text-yammy-blue" onClick={clearCache}>
              {t.clearCache}
            </Button>

            <DebugProductsButton />

            {/* Data Source Status */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {getDataSourceBadge()}

              {lastSync && (
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>
                    {t.synced}:{" "}
                    {lastSync.toLocaleString(language === "en" ? "en-US" : "sw-TZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              )}
            </div>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[180px] border-yammy-blue/30 focus:ring-yammy-blue">
                <SelectValue placeholder={t.sort} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">{language === "en" ? "Featured First" : "Maalum Kwanza"}</SelectItem>
                <SelectItem value="newest">{t.newest}</SelectItem>
                <SelectItem value="priceHighToLow">{t.priceHighToLow}</SelectItem>
                <SelectItem value="priceLowToHigh">{t.priceLowToHigh}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Error/Warning Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-800">
              <WifiOff className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

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
                  {t.wholesale}
                </TabsTrigger>
              </>
            )}
            {isMobile && (
              <TabsTrigger
                value="more"
                className="font-bubblegum data-[state=active]:bg-yammy-blue data-[state=active]:text-white"
                onClick={() => {
                  document.getElementById("more-categories-trigger")?.click()
                }}
              >
                {language === "en" ? "More..." : "Zaidi..."}
              </TabsTrigger>
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
                  {t.wholesale}
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

        {/* Results Summary */}
        {processedProducts.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p>
              {language === "en"
                ? `Showing ${processedProducts.length} of ${products.length} products`
                : `Inaonyesha ${processedProducts.length} kati ya ${products.length} bidhaa`}
            </p>
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
    </PageWrapper>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ChevronRight, ChevronDown, Package, DollarSign, MapPin } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

// Define interfaces for our data structure
interface ProductPrice {
  id: string
  name: string
  itemsPerPackage: number
  packagesPerCarton: number
  agentPrice: string
  darPrice: string
  regionPrice: string
  category: string
}

interface PriceTier {
  id: string
  name: string
  description: string
  products: ProductPrice[]
}

// Define the pricing tiers
const priceTiers: PriceTier[] = [
  {
    id: "tier-a",
    name: "KUNDI 'A'",
    description: "< 10 CTNS",
    products: [
      // Baby Pants
      {
        id: "101",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "17,000",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "102",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "17,000",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "103",
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "17,000",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "104",
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "17,000",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        itemsPerPackage: 100,
        packagesPerCarton: 5,
        agentPrice: "34,500",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        itemsPerPackage: 100,
        packagesPerCarton: 4,
        agentPrice: "34,500",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "107",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,400",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },
      {
        id: "108",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,400",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },

      // Baby Diapers
      {
        id: "201",
        name: "BABY DIAPER SMALL SIZE [4-8 KG] [S]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "202",
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "16,000",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "203",
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "16,000",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "204",
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "16,000",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },

      // Adult Pants
      {
        id: "301",
        name: "ADULT PANT LARGE HIP SIZE [80-105 CM] [L]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,800",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "302",
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,800",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "303",
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,800",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },

      // Baby Wipes
      {
        id: "401",
        name: "BABY WIPES",
        itemsPerPackage: 120,
        packagesPerCarton: 12,
        agentPrice: "3,500",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY WIPES",
      },

      // Lady Pads
      {
        id: "501",
        name: "LADY PAD",
        itemsPerPackage: 10,
        packagesPerCarton: 24,
        agentPrice: "1,450",
        darPrice: "2,500",
        regionPrice: "2,500",
        category: "LADY PADS",
      },
    ],
  },
  {
    id: "tier-b",
    name: "KUNDI 'B'",
    description: "< 20 CTNS",
    products: [
      // Baby Pants
      {
        id: "101",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,835",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "102",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,835",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "103",
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,835",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "104",
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,835",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        itemsPerPackage: 100,
        packagesPerCarton: 5,
        agentPrice: "34,500",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        itemsPerPackage: 100,
        packagesPerCarton: 4,
        agentPrice: "34,500",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "107",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,300",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },
      {
        id: "108",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,300",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },

      // Baby Diapers
      {
        id: "201",
        name: "BABY DIAPER SMALL SIZE [4-8 KG] [S]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,375",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "202",
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,880",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "203",
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,880",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "204",
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,880",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },

      // Adult Pants
      {
        id: "301",
        name: "ADULT PANT LARGE HIP SIZE [80-105 CM] [L]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,600",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "302",
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,600",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "303",
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,600",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },

      // Baby Wipes
      {
        id: "401",
        name: "BABY WIPES",
        itemsPerPackage: 120,
        packagesPerCarton: 12,
        agentPrice: "3,500",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY WIPES",
      },

      // Lady Pads
      {
        id: "501",
        name: "LADY PAD",
        itemsPerPackage: 10,
        packagesPerCarton: 24,
        agentPrice: "1,400",
        darPrice: "2,500",
        regionPrice: "2,500",
        category: "LADY PADS",
      },
    ],
  },
  {
    id: "tier-c",
    name: "KUNDI 'C'",
    description: "< 30 CTNS",
    products: [
      // Baby Pants
      {
        id: "101",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,670",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "102",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,670",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "103",
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,670",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "104",
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,670",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      // More products for tier C...
    ],
  },
  {
    id: "tier-d",
    name: "KUNDI 'D'",
    description: "< 40 CTNS",
    products: [
      // Baby Pants
      {
        id: "101",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,500",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "102",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,500",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      // More products for tier D...
    ],
  },
  {
    id: "tier-e",
    name: "KUNDI 'E'",
    description: "< 50 CTNS",
    products: [
      // Baby Pants
      {
        id: "101",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,340",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "102",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,340",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      // More products for tier E...
    ],
  },
  {
    id: "tier-f",
    name: "KUNDI 'F'",
    description: "50≥ CTNS<100",
    products: [
      // Baby Pants
      {
        id: "101",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,170",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "102",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,170",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      // More products for tier F...
    ],
  },
  {
    id: "tier-g",
    name: "KUNDI 'G'",
    description: "≥ 100 CTNS",
    products: [
      // Baby Pants
      {
        id: "101",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,000",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "102",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,000",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      // More products for tier G...
    ],
  },
]

// Get unique categories from the first tier
const categories = Array.from(new Set(priceTiers[0].products.map((product) => product.category)))

// Mobile-optimized product card component
function MobileProductCard({ product, isRegistered }: { product: ProductPrice; isRegistered: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-lg shadow mb-4 overflow-hidden border border-gray-200">
      <div
        className="p-4 flex justify-between items-center cursor-pointer bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-xs text-gray-500 mt-1">Tap to {isExpanded ? "collapse" : "view"} details</p>
        </div>
        <div className="flex items-center">
          <span className="text-yammy-blue font-bold mr-2">TZS {product.agentPrice}</span>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Package className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Package Details</p>
                <p className="font-medium">
                  {product.itemsPerPackage} items × {product.packagesPerCarton} packages per carton
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-yammy-blue mr-2" />
                  <p className="text-sm">Agent Price</p>
                </div>
                <p className="font-bold text-yammy-blue">TZS {product.agentPrice}/=</p>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-sm">Dar Price</p>
                </div>
                <p className="font-medium">TZS {product.darPrice}/=</p>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <p className="text-sm">Regional Price</p>
                </div>
                <p className="font-medium">TZS {product.regionPrice}/=</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface AgentPricingProps {
  showFullPricing?: boolean
}

export function AgentPricing({ showFullPricing = false }: AgentPricingProps) {
  const [isRegistered, setIsRegistered] = useState(false)
  const [activeTier, setActiveTier] = useState("tier-a")
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Check if user is registered on component mount
  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("yammy-current-user") || "{}")
      setIsRegistered(!!currentUser.isRegistered || showFullPricing)
    } catch (error) {
      console.error("Error checking registration status:", error)
      setIsRegistered(showFullPricing)
    }
  }, [showFullPricing])

  const handleDownload = () => {
    // In a real app, this would download the price list PDF
    const link = document.createElement("a")
    link.href = "/documents/agent-price-list.pdf"
    link.download = "Yammy-Yami-Agent-Price-List.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get the current tier data
  const currentTier = priceTiers.find((tier) => tier.id === activeTier) || priceTiers[0]

  // Filter products by the selected category
  const filteredProducts = currentTier.products.filter((product) => product.category === activeCategory)

  // If not registered and not showing full pricing, show registration prompt
  if (!isRegistered && !showFullPricing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agent Pricing</CardTitle>
          <CardDescription>Register as an agent to access exclusive pricing and resources</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
            <h3 className="font-semibold text-yellow-800">Access Restricted</h3>
            <p className="text-yellow-700 mt-1">You need to register as an agent to access full pricing details.</p>
          </div>

          <Button
            onClick={() => (window.location.href = "/agents#register")}
            className="w-full bg-yammy-blue hover:bg-yammy-blue/90"
          >
            Register as Agent
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Agent Pricing</CardTitle>
          <CardDescription>Exclusive pricing for registered agents</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload} className="mt-2 sm:mt-0">
          <Download className="mr-2 h-4 w-4" />
          Download Price List
        </Button>
      </CardHeader>
      <CardContent>
        {/* Mobile-optimized tier selection */}
        {isMobile ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Tier:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-white"
              value={activeTier}
              onChange={(e) => setActiveTier(e.target.value)}
            >
              {priceTiers.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name} - {tier.description}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground mt-2">
              {currentTier.name} - {currentTier.description}
            </p>
          </div>
        ) : (
          <Tabs value={activeTier} onValueChange={setActiveTier} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1">
              {priceTiers.map((tier) => (
                <TabsTrigger key={tier.id} value={tier.id} className="text-xs md:text-sm">
                  {tier.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {priceTiers.map((tier) => (
              <TabsContent key={tier.id} value={tier.id}>
                <div className="text-sm text-muted-foreground mb-4">
                  {tier.name} - {tier.description}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Mobile-optimized category selection */}
        {isMobile ? (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Category:</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`p-3 text-center rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-yammy-blue text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Product display - mobile or desktop */}
        {categories.map((category) => (
          <div key={category} className={activeCategory === category ? "block mt-4" : "hidden"}>
            {isMobile ? (
              // Mobile view - card-based layout
              <div className="space-y-1">
                {filteredProducts.map((product) => (
                  <MobileProductCard
                    key={`${product.id}-${product.itemsPerPackage}`}
                    product={product}
                    isRegistered={isRegistered}
                  />
                ))}
              </div>
            ) : (
              // Desktop view - table layout
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Items Per Package</TableHead>
                      <TableHead className="text-center">Packages Per Carton</TableHead>
                      <TableHead className="text-right">Agent Price (TZS)</TableHead>
                      <TableHead className="text-right">Dar Price (TZS)</TableHead>
                      <TableHead className="text-right">Regional Price (TZS)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={`${product.id}-${product.itemsPerPackage}`}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-center">{product.itemsPerPackage}</TableCell>
                        <TableCell className="text-center">{product.packagesPerCarton}</TableCell>
                        <TableCell className="text-right text-yammy-blue font-medium">
                          TZS {product.agentPrice}/=
                        </TableCell>
                        <TableCell className="text-right">TZS {product.darPrice}/=</TableCell>
                        <TableCell className="text-right">TZS {product.regionPrice}/=</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        ))}

        <div className="text-sm text-muted-foreground mt-6">
          <p className="font-semibold">Notes:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>All prices include VAT</li>
            <li>Agent prices are for registered agents only</li>
            <li>Tier pricing is based on order volume (number of cartons)</li>
            <li>Regional prices apply to areas outside of Dar es Salaam</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

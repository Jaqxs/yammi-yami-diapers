"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"

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
]

// Get unique categories from the first tier
const categories = Array.from(new Set(priceTiers[0].products.map((product) => product.category)))

interface AgentPricingProps {
  showPreview?: boolean
}

export function AgentPricing({ showPreview = false }: AgentPricingProps) {
  const [isRegistered, setIsRegistered] = useState(false)
  const [activeTier, setActiveTier] = useState("tier-a")
  const [activeCategory, setActiveCategory] = useState(categories[0])

  // Check if user is registered on component mount
  useEffect(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("yammy-current-user") || "{}")
      setIsRegistered(!!currentUser.isRegistered)
    } catch (error) {
      console.error("Error checking registration status:", error)
    }
  }, [])

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

  // If not registered and not in preview mode, show limited preview
  const shouldShowLimitedPreview = !isRegistered && !showPreview

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Agent Pricing</CardTitle>
          <CardDescription>
            {shouldShowLimitedPreview
              ? "Sample pricing preview - Register to see full pricing"
              : "Exclusive pricing for registered agents"}
          </CardDescription>
        </div>
        {!shouldShowLimitedPreview && (
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Price List
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {shouldShowLimitedPreview && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
            <h3 className="font-semibold text-blue-800">Preview Mode</h3>
            <p className="text-blue-700 mt-1">
              This is a limited preview. Register to see full pricing details and all tiers.
            </p>
            <Button
              onClick={() => (window.location.href = "/agents#register")}
              className="mt-2 bg-yammy-blue hover:bg-yammy-blue/90"
            >
              Register Now
            </Button>
          </div>
        )}

        <Tabs value={activeTier} onValueChange={setActiveTier} className="w-full mb-6">
          <TabsList
            className="grid w-full"
            style={{ gridTemplateColumns: `repeat(${shouldShowLimitedPreview ? 2 : priceTiers.length}, 1fr)` }}
          >
            {priceTiers.slice(0, shouldShowLimitedPreview ? 2 : priceTiers.length).map((tier) => (
              <TabsTrigger key={tier.id} value={tier.id}>
                {tier.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {priceTiers.slice(0, shouldShowLimitedPreview ? 2 : priceTiers.length).map((tier) => (
            <TabsContent key={tier.id} value={tier.id}>
              <div className="text-sm text-muted-foreground mb-4">
                {tier.name} - {tier.description}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
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
                  {filteredProducts.slice(0, shouldShowLimitedPreview ? 3 : filteredProducts.length).map((product) => (
                    <TableRow key={`${product.id}-${product.itemsPerPackage}`}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-center">{product.itemsPerPackage}</TableCell>
                      <TableCell className="text-center">{product.packagesPerCarton}</TableCell>
                      <TableCell className="text-right">
                        {shouldShowLimitedPreview ? "Login to view" : `TZS ${product.agentPrice}/=`}
                      </TableCell>
                      <TableCell className="text-right">TZS {product.darPrice}/=</TableCell>
                      <TableCell className="text-right">TZS {product.regionPrice}/=</TableCell>
                    </TableRow>
                  ))}

                  {shouldShowLimitedPreview && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        <p className="text-gray-500 mb-2">Register to see full pricing details</p>
                        <Button
                          onClick={() => (window.location.href = "/agents#register")}
                          className="bg-yammy-blue hover:bg-yammy-blue/90"
                        >
                          Register as Agent
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>

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

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"
import { useRegistrationStore } from "@/lib/registration-store"

interface PricingTier {
  tier: string
  minOrder: number
  discount: number
}

interface ProductPrice {
  product: string
  retailPrice: number
  agentPrice: number
  bulkPrice: number
}

const tiers: PricingTier[] = [
  { tier: "Standard Agent", minOrder: 10, discount: 10 },
  { tier: "Silver Agent", minOrder: 50, discount: 15 },
  { tier: "Gold Agent", minOrder: 100, discount: 20 },
  { tier: "Platinum Agent", minOrder: 500, discount: 25 },
]

const productPrices: ProductPrice[] = [
  { product: "Baby Diapers (Small)", retailPrice: 15000, agentPrice: 13500, bulkPrice: 12000 },
  { product: "Baby Diapers (Medium)", retailPrice: 17000, agentPrice: 15300, bulkPrice: 13600 },
  { product: "Baby Diapers (Large)", retailPrice: 19000, agentPrice: 17100, bulkPrice: 15200 },
  { product: "Baby Diapers (XL)", retailPrice: 21000, agentPrice: 18900, bulkPrice: 16800 },
  { product: "Adult Diapers (Medium)", retailPrice: 25000, agentPrice: 22500, bulkPrice: 20000 },
  { product: "Adult Diapers (Large)", retailPrice: 28000, agentPrice: 25200, bulkPrice: 22400 },
  { product: "Lady Pads (Regular)", retailPrice: 5000, agentPrice: 4500, bulkPrice: 4000 },
  { product: "Lady Pads (Night)", retailPrice: 6000, agentPrice: 5400, bulkPrice: 4800 },
]

export function AgentPricing() {
  const { status, email, checkRegistrationStatus } = useRegistrationStore()
  const [currentStatus, setCurrentStatus] = useState(status)
  const [activeTab, setActiveTab] = useState("pricing")

  // Check for status updates
  useEffect(() => {
    if (email) {
      const updatedStatus = checkRegistrationStatus(email)
      setCurrentStatus(updatedStatus)
    } else {
      setCurrentStatus(status)
    }
  }, [status, email, checkRegistrationStatus])

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      if (email) {
        const updatedStatus = checkRegistrationStatus(email)
        setCurrentStatus(updatedStatus)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [email, checkRegistrationStatus])

  const handleDownload = () => {
    // In a real app, this would download the price list PDF
    const link = document.createElement("a")
    link.href = "/documents/agent-price-list.pdf"
    link.download = "Yammy-Yami-Agent-Price-List.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (currentStatus !== "approved") {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Agent Pricing</CardTitle>
          <CardDescription>Exclusive pricing for registered agents</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download Price List
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pricing">Product Pricing</TabsTrigger>
            <TabsTrigger value="tiers">Agent Tiers</TabsTrigger>
          </TabsList>
          <TabsContent value="pricing" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Retail Price (TZS)</TableHead>
                  <TableHead className="text-right">Agent Price (TZS)</TableHead>
                  <TableHead className="text-right">Bulk Price (TZS)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productPrices.map((item) => (
                  <TableRow key={item.product}>
                    <TableCell className="font-medium">{item.product}</TableCell>
                    <TableCell className="text-right">{item.retailPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.agentPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.bulkPrice.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-sm text-gray-500 mt-4">
              * Bulk prices apply for orders of 100+ units of the same product
            </p>
          </TabsContent>
          <TabsContent value="tiers" className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent Tier</TableHead>
                  <TableHead className="text-right">Minimum Order</TableHead>
                  <TableHead className="text-right">Discount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier) => (
                  <TableRow key={tier.tier}>
                    <TableCell className="font-medium">{tier.tier}</TableCell>
                    <TableCell className="text-right">{tier.minOrder} boxes</TableCell>
                    <TableCell className="text-right">{tier.discount}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-sm text-gray-500 mt-4">
              * Tier discounts are applied on top of agent pricing for qualifying orders
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

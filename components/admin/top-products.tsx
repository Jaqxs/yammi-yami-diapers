"use client"

import { Star } from "lucide-react"

import { Progress } from "@/components/ui/progress"

// Mock data for top products
const topProducts = [
  {
    id: 1,
    name: "Baby Diapers (M)",
    sales: 1245,
    percentage: 85,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Baby Wipes",
    sales: 1100,
    percentage: 75,
    rating: 4.7,
  },
  {
    id: 3,
    name: "Lady Pads",
    sales: 980,
    percentage: 67,
    rating: 4.5,
  },
  {
    id: 4,
    name: "Baby Diapers (L)",
    sales: 870,
    percentage: 59,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Baby Diapers (S)",
    sales: 760,
    percentage: 52,
    rating: 4.4,
  },
]

export function TopProducts() {
  return (
    <div className="space-y-6">
      {topProducts.map((product) => (
        <div key={product.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{product.name}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>{product.sales} sales</span>
                <span className="text-xs">•</span>
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1">{product.rating}</span>
                </div>
              </div>
            </div>
            <div className="text-sm font-medium">{product.percentage}%</div>
          </div>
          <Progress value={product.percentage} className="h-2" />
        </div>
      ))}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"
import { useRegistrationStore } from "@/lib/registration-store"

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
        id: "105",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,300",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
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
      {
        id: "105",
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        itemsPerPackage: 100,
        packagesPerCarton: 5,
        agentPrice: "34,250",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        itemsPerPackage: 100,
        packagesPerCarton: 4,
        agentPrice: "34,250",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,200",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,200",
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
        agentPrice: "15,250",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "202",
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,750",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "203",
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,750",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "204",
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,750",
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
        agentPrice: "24,400",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "302",
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,400",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "303",
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,400",
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
      {
        id: "103",
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,500",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "104",
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,500",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        itemsPerPackage: 100,
        packagesPerCarton: 5,
        agentPrice: "34,250",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        itemsPerPackage: 100,
        packagesPerCarton: 4,
        agentPrice: "34,250",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,100",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,100",
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
        agentPrice: "15,125",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "202",
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,625",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "203",
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,625",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "204",
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,625",
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
        agentPrice: "24,200",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "302",
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,200",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "303",
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,200",
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
      {
        id: "103",
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,340",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "104",
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,340",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        itemsPerPackage: 100,
        packagesPerCarton: 5,
        agentPrice: "34,000",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        itemsPerPackage: 100,
        packagesPerCarton: 4,
        agentPrice: "34,000",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,000",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,000",
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
        agentPrice: "15,000",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "202",
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "203",
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "204",
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
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
        agentPrice: "24,000",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "302",
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,000",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "303",
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "24,000",
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
      {
        id: "103",
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,170",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "104",
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,170",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        itemsPerPackage: 100,
        packagesPerCarton: 5,
        agentPrice: "34,000",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        itemsPerPackage: 100,
        packagesPerCarton: 4,
        agentPrice: "34,000",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,000",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,000",
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
        agentPrice: "15,000",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "202",
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "203",
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "204",
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
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
        agentPrice: "23,800",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "302",
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "23,800",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "303",
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "23,800",
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
      {
        id: "103",
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,000",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "104",
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        itemsPerPackage: 50,
        packagesPerCarton: 6,
        agentPrice: "16,000",
        darPrice: "21,000",
        regionPrice: "23,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        itemsPerPackage: 100,
        packagesPerCarton: 5,
        agentPrice: "34,000",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        itemsPerPackage: 100,
        packagesPerCarton: 4,
        agentPrice: "34,000",
        darPrice: "41,000",
        regionPrice: "45,000",
        category: "BABY PANTS",
      },
      {
        id: "105",
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,000",
        darPrice: "4,500",
        regionPrice: "5,000",
        category: "BABY PANTS",
      },
      {
        id: "106",
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 10,
        packagesPerCarton: 10,
        agentPrice: "3,000",
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
        agentPrice: "15,000",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "202",
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "203",
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
        darPrice: "20,000",
        regionPrice: "21,000",
        category: "BABY DIAPERS",
      },
      {
        id: "204",
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        itemsPerPackage: 50,
        packagesPerCarton: 8,
        agentPrice: "15,500",
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
        agentPrice: "23,600",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "302",
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "23,600",
        darPrice: "29,000",
        regionPrice: "30,000",
        category: "ADULT PANTS",
      },
      {
        id: "303",
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        itemsPerPackage: 20,
        packagesPerCarton: 5,
        agentPrice: "23,600",
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

// Get unique categories from the first tier (all tiers have the same categories)
const categories = Array.from(new Set(priceTiers[0].products.map((product) => product.category)))

export function AgentPricing() {
  const { status, email, checkRegistrationStatus } = useRegistrationStore()
  const [currentStatus, setCurrentStatus] = useState(status)
  const [activeTier, setActiveTier] = useState("tier-a")
  const [activeCategory, setActiveCategory] = useState(categories[0])

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

  // Get the current tier data
  const currentTier = priceTiers.find((tier) => tier.id === activeTier) || priceTiers[0]

  // Filter products by the selected category
  const filteredProducts = currentTier.products.filter((product) => product.category === activeCategory)

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
        <Tabs value={activeTier} onValueChange={setActiveTier} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-7">
            {priceTiers.map((tier) => (
              <TabsTrigger key={tier.id} value={tier.id}>
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
                  {filteredProducts.map((product) => (
                    <TableRow key={`${product.id}-${product.itemsPerPackage}`}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-center">{product.itemsPerPackage}</TableCell>
                      <TableCell className="text-center">{product.packagesPerCarton}</TableCell>
                      <TableCell className="text-right">TZS {product.agentPrice}/=</TableCell>
                      <TableCell className="text-right">TZS {product.darPrice}/=</TableCell>
                      <TableCell className="text-right">TZS {product.regionPrice}/=</TableCell>
                    </TableRow>
                  ))}
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

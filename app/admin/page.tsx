"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import {
  Package,
  AlertTriangle,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Database,
  Eye,
  Trash2,
  TrendingUp,
  Upload,
  Bug,
  CheckCircle,
  Loader2,
  Settings,
  BarChart3,
  ShoppingCart,
  Info,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"
import Link from "next/link"
import { OptimizedImage } from "@/components/optimized-image"
import { useLanguage } from "@/components/language-provider"
import { AdminChangeNotification, AdminSyncStatus } from "@/components/admin-change-notification"
import { useStoreSync } from "@/lib/store-sync"

interface Product {
  id: number
  name_en: string
  name_sw: string
  description_en?: string
  description_sw?: string
  price: number
  wholesale_price?: number
  category: string
  size?: string
  bundle_size?: number
  weight_range?: string
  hip_size?: string
  stock: number
  featured: boolean
  status: string
  image_url?: string
  tags?: string[]
  created_at: string
  updated_at?: string
}

interface DatabaseStatus {
  success: boolean
  status: string
  message: string
  tableExists: boolean
  productCount: number
  sampleProducts?: any[]
  categoryBreakdown?: any[]
}

interface DebugInfo {
  success: boolean
  tableExists: boolean
  tableStructure: any[]
  products: any[]
  categoryBreakdown: any[]
  totalProducts: number
  message: string
}

export default function AdminDashboard() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const { queueChange, isOnline } = useStoreSync()

  // Your Neon connection string
  const neonConnectionString =
    "postgresql://neondb_owner:npg_tAfX7Kbxzvw6@ep-old-darkness-a47yzb5i-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isImporting, setIsImporting] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [copied, setCopied] = useState(false)

  // Add this function after the other functions
  const setupCompleteDatabase = async () => {
    setIsInitializing(true)
    try {
      console.log("🚀 Setting up complete database...")
      const response = await fetch("/api/admin/setup-database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("📥 Setup result:", result)

      if (result.success) {
        toast({
          title: "Database Setup Complete!",
          description: `Created ${result.tables?.length || 0} tables and ${result.categoriesCount || 0} categories`,
          variant: "default",
        })

        // Queue the change for sync
        queueChange("DATABASE_SETUP", { result })

        // Refresh status after setup
        setTimeout(async () => {
          await fetchDatabaseStatus()
          await fetchDebugInfo()
        }, 1000)
      } else {
        throw new Error(result.error || "Database setup failed")
      }
    } catch (error) {
      console.error("❌ Database setup error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      toast({
        title: "Database Setup Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  // Fetch database status with proper error handling
  const fetchDatabaseStatus = async () => {
    try {
      console.log("🔍 Fetching database status...")
      const response = await fetch("/api/admin/db-status", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("📊 Database status:", data)
      setDbStatus(data)

      if (data.success && data.status === "connected") {
        setError(null)
      } else if (!data.success) {
        setError(data.message || "Database connection failed")
      }
    } catch (error) {
      console.error("❌ Error fetching database status:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setDbStatus({
        success: false,
        status: "error",
        message: `Database connection failed: ${errorMessage}`,
        tableExists: false,
        productCount: 0,
      })
      setError(`Database connection failed: ${errorMessage}`)
    }
  }

  // Fetch debug info with proper error handling
  const fetchDebugInfo = async () => {
    try {
      console.log("🐛 Fetching debug info...")
      const response = await fetch("/api/admin/debug-db", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("🐛 Debug info received:", data)
      setDebugInfo(data)
    } catch (error) {
      console.error("❌ Error fetching debug info:", error)
      setDebugInfo({
        success: false,
        tableExists: false,
        tableStructure: [],
        products: [],
        categoryBreakdown: [],
        totalProducts: 0,
        message: error instanceof Error ? error.message : "Failed to fetch debug info",
      })
    }
  }

  // Fetch products from database with proper error handling
  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔍 Fetching products...")
      const response = await fetch("/api/admin/products?limit=100", {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("📦 Products response:", data)

      if (data.success && Array.isArray(data.products)) {
        console.log(`✅ Loaded ${data.products.length} products`)
        setProducts(data.products)
        setFilteredProducts(data.products)
        setError(null)

        toast({
          title: "Products Loaded",
          description: `Successfully loaded ${data.products.length} products`,
          variant: "default",
        })
      } else {
        throw new Error(data.error || "Invalid response format")
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(`Failed to fetch products: ${errorMessage}`)
      setProducts([])
      setFilteredProducts([])

      toast({
        title: "Error Loading Products",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize database
  const initializeDatabase = async () => {
    setIsInitializing(true)
    try {
      console.log("🚀 Initializing database...")
      const response = await fetch("/api/admin/init-database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("📥 Initialize result:", result)

      if (result.success) {
        toast({
          title: "Database Initialized!",
          description: result.message,
          variant: "default",
        })

        // Queue the change for sync
        queueChange("DATABASE_INIT", { result })

        // Refresh status after initialization
        setTimeout(async () => {
          await fetchDatabaseStatus()
          await fetchDebugInfo()
        }, 1000)
      } else {
        throw new Error(result.error || "Initialization failed")
      }
    } catch (error) {
      console.error("❌ Database initialization error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      toast({
        title: "Initialization Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  // Simple database initialization
  const simpleInitDatabase = async () => {
    setIsInitializing(true)
    try {
      console.log("🚀 Simple database initialization...")
      const response = await fetch("/api/admin/simple-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("📥 Simple init result:", result)

      if (result.success) {
        toast({
          title: "Database Initialized!",
          description: result.message,
          variant: "default",
        })

        // Queue the change for sync
        queueChange("DATABASE_SIMPLE_INIT", { result })

        // Refresh status after initialization
        setTimeout(async () => {
          await fetchDatabaseStatus()
          await fetchDebugInfo()
        }, 1000)
      } else {
        throw new Error(result.error || "Initialization failed")
      }
    } catch (error) {
      console.error("❌ Simple database initialization error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      toast({
        title: "Initialization Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsInitializing(false)
    }
  }

  // Import products from mock data
  const importProducts = async () => {
    setIsImporting(true)
    try {
      console.log("🚀 Starting product import...")
      const response = await fetch("/api/admin/reimport-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("📥 Import result:", result)

      if (result.success) {
        const stats = result.stats || {}
        toast({
          title: "Products Imported Successfully!",
          description: `Imported ${stats.totalProducts || result.count || 0} products across ${stats.categoryBreakdown?.length || 0} categories`,
          variant: "default",
        })

        // Queue the change for sync
        queueChange("PRODUCTS_IMPORT", { result })

        // Refresh everything after import
        setTimeout(async () => {
          await fetchProducts()
          await fetchDatabaseStatus()
          await fetchDebugInfo()
        }, 1500)
      } else {
        throw new Error(result.error || "Import failed")
      }
    } catch (error) {
      console.error("❌ Import error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"

      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  // Refresh all data
  const refreshAllData = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([fetchDatabaseStatus(), fetchProducts(), fetchDebugInfo()])

      toast({
        title: "Data Refreshed",
        description: "All data has been refreshed successfully",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Some data could not be refreshed",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Copy connection string
  const copyConnectionString = async () => {
    try {
      await navigator.clipboard.writeText(`DATABASE_URL=${neonConnectionString}`)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Database URL copied to clipboard",
        variant: "default",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  // Delete product
  const deleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Queue the change for sync
      queueChange("PRODUCT_DELETE", { id, name })

      toast({
        title: "Product Deleted",
        description: `"${name}" has been deleted successfully`,
        variant: "default",
      })

      await fetchProducts()
      await fetchDatabaseStatus()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      console.log("🚀 Initializing admin dashboard...")
      await fetchDatabaseStatus()
      await fetchProducts()
      await fetchDebugInfo()
    }
    initializeData()
  }, [])

  // Filter products
  useEffect(() => {
    let filtered = Array.isArray(products) ? [...products] : []

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (product) =>
          product.name_en.toLowerCase().includes(query) ||
          product.name_sw.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => product.status === statusFilter)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, categoryFilter, statusFilter])

  // Helper functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("TZS", "TZS ")
  }

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, { en: string; sw: string }> = {
      babyDiapers: { en: "Baby Diapers", sw: "Nepi za Watoto" },
      babyPants: { en: "Baby Pants", sw: "Pants za Watoto" },
      adultDiapers: { en: "Adult Diapers", sw: "Nepi za Watu Wazima" },
    }
    return categoryMap[category]?.[language || "en"] || category
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "low_stock":
        return "secondary"
      case "out_of_stock":
        return "destructive"
      case "draft":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusBadgeText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "low_stock":
        return "Low Stock"
      case "out_of_stock":
        return "Out of Stock"
      case "draft":
        return "Draft"
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-yammy-dark-blue">Yammy Yami Admin Dashboard</h1>
          <p className="text-gray-600">Manage your diaper products and business operations</p>
          <div className="mt-2">
            <AdminSyncStatus />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={refreshAllData} variant="outline" disabled={isRefreshing} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh All"}
          </Button>
          <Button onClick={fetchDebugInfo} variant="outline" size="sm">
            <Bug className="h-4 w-4 mr-2" />
            Debug
          </Button>
        </div>
      </div>

      {/* Status Alerts */}
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {dbStatus?.status === "connected" && dbStatus.tableExists && dbStatus.productCount > 0 && (
        <Alert className="mb-6">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>System Ready!</strong> Database connected with {dbStatus.productCount} products loaded.
          </AlertDescription>
        </Alert>
      )}

      {dbStatus?.status === "connected" && !dbStatus.tableExists && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Setup Required:</strong> Database connected but products table doesn't exist. Click "Initialize
            Database" below.
          </AlertDescription>
        </Alert>
      )}

      {dbStatus?.status === "connected" && dbStatus.tableExists && dbStatus.productCount === 0 && (
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Import Needed:</strong> Database ready but no products found. Click "Import Products" to add your
            products.
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Status</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dbStatus?.status === "connected" ? "✅" : dbStatus?.status === "error" ? "❌" : "⏳"}
            </div>
            <p className="text-xs text-muted-foreground">
              {dbStatus?.status === "connected" ? "Connected" : dbStatus?.status === "error" ? "Error" : "Checking..."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Table</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStatus?.tableExists ? "✅" : "❌"}</div>
            <p className="text-xs text-muted-foreground">{dbStatus?.tableExists ? "Table exists" : "Not created"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStatus?.productCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Frontend: {products.length} | DB: {dbStatus?.productCount || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStatus?.categoryBreakdown?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Product categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="debug">Debug</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup">
          <div className="space-y-6">
            {/* Database Connection Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Connection Setup
                </CardTitle>
                <CardDescription>Configure your Neon database connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1.5: Complete Database Setup */}
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Step 1.5: Complete Database Setup</h3>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Set up all database tables (products, orders, categories, reviews) with proper relationships and
                    indexes.
                  </p>
                  <Button
                    onClick={setupCompleteDatabase}
                    disabled={isInitializing || dbStatus?.status !== "connected"}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isInitializing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4 mr-2" />
                    )}
                    {isInitializing ? "Setting up..." : "Setup Complete Database"}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    This will create all necessary tables with proper relationships
                  </p>
                </div>

                {/* Step 1: Environment Variable */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Step 1: Environment Variable</h3>
                    <Badge variant={dbStatus?.status === "connected" ? "default" : "destructive"}>
                      {dbStatus?.status === "connected" ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Add this DATABASE_URL to your environment variables:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 p-3 rounded text-sm font-mono break-all">
                      DATABASE_URL={neonConnectionString}
                    </div>
                    <Button onClick={copyConnectionString} size="sm" variant="outline">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Step 2: Initialize Database */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Step 2: Initialize Database</h3>
                    <Badge variant={dbStatus?.tableExists ? "default" : "destructive"}>
                      {dbStatus?.tableExists ? "Table Exists" : "Table Missing"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Create the products table in your database.</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={simpleInitDatabase}
                      disabled={isInitializing || !dbStatus?.status || dbStatus.status !== "connected"}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isInitializing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Database className="h-4 w-4 mr-2" />
                      )}
                      {isInitializing ? "Initializing..." : "Simple Init"}
                    </Button>
                    <Button
                      onClick={initializeDatabase}
                      disabled={isInitializing || !dbStatus?.status || dbStatus.status !== "connected"}
                      variant="outline"
                      size="sm"
                    >
                      Advanced Init
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Use "Simple Init" if you're having connection issues</p>
                </div>

                {/* Step 3: Import Products */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Step 3: Import Products</h3>
                    <Badge variant={dbStatus?.productCount > 0 ? "default" : "destructive"}>
                      {dbStatus?.productCount > 0 ? `${dbStatus.productCount} Products` : "No Products"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Import all Yammy Yami products into your database.</p>
                  <Button
                    onClick={importProducts}
                    disabled={isImporting || !dbStatus?.tableExists}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isImporting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isImporting ? "Importing..." : "Import Products"}
                  </Button>
                </div>

                {/* Step 4: Verify */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Step 4: Verify Setup</h3>
                    <Badge
                      variant={
                        dbStatus?.status === "connected" && dbStatus?.tableExists && dbStatus?.productCount > 0
                          ? "default"
                          : "secondary"
                      }
                    >
                      {dbStatus?.status === "connected" && dbStatus?.tableExists && dbStatus?.productCount > 0
                        ? "Ready"
                        : "Setup Needed"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Test your setup and view your products.</p>
                  <div className="flex gap-2">
                    <Button onClick={refreshAllData} variant="outline" disabled={isRefreshing}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                      Check Status
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/products" target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Products Page
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="babyDiapers">Baby Diapers</SelectItem>
                  <SelectItem value="babyPants">Baby Pants</SelectItem>
                  <SelectItem value="adultDiapers">Adult Diapers</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="low_stock">Low Stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Products Table */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <OptimizedImage
                              src={product.image_url || "/placeholder.svg?height=64&width=64&text=No+Image"}
                              alt={product.name_en}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name_en}</div>
                            <div className="text-sm text-gray-500">{product.name_sw}</div>
                            {product.size && <div className="text-xs text-gray-400">Size: {product.size}</div>}
                            {product.weight_range && (
                              <div className="text-xs text-gray-400">Weight: {product.weight_range}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryDisplayName(product.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatPrice(product.price)}</div>
                          {product.wholesale_price && (
                            <div className="text-sm text-gray-500">
                              Wholesale: {formatPrice(product.wholesale_price)}
                            </div>
                          )}
                          {product.bundle_size && (
                            <div className="text-xs text-gray-400">Bundle: {product.bundle_size} pcs</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${product.stock < 20 ? "text-red-600" : ""}`}>{product.stock}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(product.status)}>{getStatusBadgeText(product.status)}</Badge>
                      </TableCell>
                      <TableCell>{product.featured && <Badge variant="secondary">Featured</Badge>}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href="/products" target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProduct(product.id, product.name_en)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                  ? "No products match your current filters."
                  : dbStatus?.productCount === 0
                    ? "Import your products to start managing them here."
                    : "Products exist in database but not loading. Try refreshing."}
              </p>
              <div className="flex gap-2 justify-center">
                {!searchQuery && categoryFilter === "all" && statusFilter === "all" && (
                  <Button onClick={importProducts} disabled={isImporting}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Products
                  </Button>
                )}
                <Button onClick={fetchProducts} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Business Analytics
                </CardTitle>
                <CardDescription>Insights into your product catalog and business performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {dbStatus?.categoryBreakdown?.map((category) => (
                    <div key={category.category} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{getCategoryDisplayName(category.category)}</h4>
                      <p className="text-3xl font-bold text-yammy-blue">{category.count}</p>
                      <p className="text-sm text-gray-500">products available</p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yammy-blue h-2 rounded-full"
                            style={{
                              width: `${(category.count / (dbStatus?.productCount || 1)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {Math.round((category.count / (dbStatus?.productCount || 1)) * 100)}% of total
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {(!dbStatus?.categoryBreakdown || dbStatus.categoryBreakdown.length === 0) && (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No analytics data available. Import products to see insights.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Products Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Products</CardTitle>
                <CardDescription>Products currently featured on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yammy-blue mb-2">
                  {products.filter((p) => p.featured).length}
                </div>
                <p className="text-sm text-gray-500">
                  out of {products.length} total products (
                  {Math.round((products.filter((p) => p.featured).length / (products.length || 1)) * 100)}%)
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Debug Tab */}
        <TabsContent value="debug">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Debug Information
              </CardTitle>
              <CardDescription>Technical details for troubleshooting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Database Status</h4>
                  <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-64">
                    {JSON.stringify(dbStatus, null, 2)}
                  </pre>
                </div>

                {debugInfo && (
                  <div>
                    <h4 className="font-medium mb-2">Debug Information</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={fetchDebugInfo} size="sm">
                    <Bug className="h-4 w-4 mr-2" />
                    Refresh Debug Info
                  </Button>
                  <Button onClick={refreshAllData} size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Database Management
              </CardTitle>
              <CardDescription>Manage your product database and system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Database Operations</h4>
                  <div className="flex flex-col gap-2">
                    <Button onClick={initializeDatabase} disabled={isInitializing} className="justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      {isInitializing ? "Initializing..." : "Initialize Database"}
                    </Button>
                    <Button onClick={importProducts} disabled={isImporting} className="justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      {isImporting ? "Importing..." : "Import Products"}
                    </Button>
                    <Button onClick={fetchProducts} variant="outline" className="justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Products
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">System Information</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Database Status:</span>
                      <Badge variant={dbStatus?.status === "connected" ? "default" : "destructive"}>
                        {dbStatus?.status || "Unknown"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Table Exists:</span>
                      <Badge variant={dbStatus?.tableExists ? "default" : "destructive"}>
                        {dbStatus?.tableExists ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Products in DB:</span>
                      <span className="font-medium">{dbStatus?.productCount || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Products in Frontend:</span>
                      <span className="font-medium">{products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categories:</span>
                      <span className="font-medium">{dbStatus?.categoryBreakdown?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Current Status</h4>
                <p className="text-sm text-gray-600">{dbStatus?.message || "No status message available"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Admin Change Notification */}
      <AdminChangeNotification />
    </div>
  )
}

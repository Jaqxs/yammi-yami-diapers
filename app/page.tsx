"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  Phone,
  Instagram,
  Star,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRightIcon,
  Award,
  Users,
  ShoppingBag,
  Globe,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { PageWrapper } from "@/components/page-wrapper"
import { useStore } from "@/lib/store"
import { useCart } from "@/components/cart-provider"
import { OptimizedImage } from "@/components/optimized-image"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { CountUp } from "@/components/count-up"

// Language translations
const translations = {
  en: {
    heroTitle: "Love Your Baby, Love Your Family",
    heroSubtitle: "Quality diapers for every family member",
    shopNow: "Shop Now",
    featuredProducts: "Featured Products",
    viewAll: "View All Products",
    aboutTitle: "About Yammy Yami Diaper TZ",
    aboutText:
      "We provide high-quality, affordable diapers for all family members. Based in Kariakoo/Mkunguni and Sukuma, Tanzania, we're committed to family care and comfort.",
    learnMore: "Learn More",
    whyChooseUs: "Why Choose Us",
    comfort: "Comfort",
    quality: "Quality",
    affordability: "Affordability",
    comfortText: "Our products are designed for maximum comfort and softness.",
    qualityText: "We use premium materials to ensure reliability and performance.",
    affordabilityText: "Quality products at prices every Tanzanian family can afford.",
    contactUs: "Contact Us",
    orderViaWhatsApp: "Order via WhatsApp",
    locations: "Our Locations",
    kariakoo: "Kariakoo/Mkunguni",
    sukuma: "Sukuma",
    stayDry: "Stay dry, stay worry-free",
    happyAndComfort: "Happy and Comfort",
    allSizesAvailable: "All Sizes Available",
    highAbsorption: "High Absorption",
    japanStandard: "Japan Standard",
    latestBlogPosts: "Latest Blog Posts",
    readMore: "Read More",
    minutes: "min read",
    noFeaturedProducts: "No featured products available",
    noFeaturedPosts: "No featured blog posts available",
    addToCart: "Add to Cart",
    viewAllBlogPosts: "View All Blog Posts",
    addedToCart: "Added to Cart",
    productAddedToCart: "Product has been added to your cart",
    prevImage: "Previous image",
    nextImage: "Next image",
    achievements: "Our Achievements",
    happyCustomers: "Happy Customers",
    productsDelivered: "Products Delivered",
    regions: "Regions Covered",
    yearsOfExperience: "Years of Experience",
    ourImpact: "Our Impact Across Tanzania",
    loading: "Loading...",
    errorLoading: "Error loading data. Please try again.",
    retry: "Retry",
  },
  sw: {
    heroTitle: "Penda Mtoto Wako, Penda Familia Yako",
    heroSubtitle: "Diapers bora kwa kila mwanafamilia",
    shopNow: "Nunua Sasa",
    featuredProducts: "Bidhaa Maarufu",
    viewAll: "Tazama Bidhaa Zote",
    aboutTitle: "Kuhusu Yammy Yami Diaper TZ",
    aboutText:
      "Tunatoa diapers bora na za bei nafuu kwa wanafamilia wote. Tukiwa na ofisi Kariakoo/Mkunguni na Sukuma, Tanzania, tumejitolea kwa utunzaji na faraja ya familia.",
    learnMore: "Jifunze Zaidi",
    whyChooseUs: "Kwa Nini Uchague Sisi",
    comfort: "Faraja",
    quality: "Ubora",
    affordability: "Bei Nafuu",
    comfortText: "Bidhaa zetu zimeundwa kwa faraja na ulaini wa hali ya juu.",
    qualityText: "Tunatumia vifaa bora kuhakikisha utegemezi na utendaji.",
    affordabilityText: "Bidhaa bora kwa bei ambayo kila familia ya Kitanzania inaweza kumudu.",
    contactUs: "Wasiliana Nasi",
    orderViaWhatsApp: "Agiza kupitia WhatsApp",
    locations: "Maeneo Yetu",
    kariakoo: "Kariakoo/Mkunguni",
    sukuma: "Sukuma",
    stayDry: "Kaa mkavu, kaa bila wasiwasi",
    happyAndComfort: "Furaha na Faraja",
    allSizesAvailable: "Ukubwa Wote Unapatikana",
    highAbsorption: "Unyonywaji wa Hali ya Juu",
    japanStandard: "Kiwango cha Japan",
    latestBlogPosts: "Makala za Hivi Karibuni",
    readMore: "Soma Zaidi",
    minutes: "dakika za kusoma",
    noFeaturedProducts: "Hakuna bidhaa zilizoangaziwa zinazopatikana",
    noFeaturedPosts: "Hakuna makala zilizoangaziwa zinazopatikana",
    addToCart: "Ongeza kwenye Kikapu",
    viewAllBlogPosts: "Tazama Makala Zote",
    addedToCart: "Imeongezwa kwenye Kikapu",
    productAddedToCart: "Bidhaa imeongezwa kwenye kikapu chako",
    prevImage: "Picha iliyopita",
    nextImage: "Picha inayofuata",
    achievements: "Mafanikio Yetu",
    happyCustomers: "Wateja Wenye Furaha",
    productsDelivered: "Bidhaa Zilizosambazwa",
    regions: "Mikoa Inayofikiwa",
    yearsOfExperience: "Miaka ya Uzoefu",
    ourImpact: "Athari Yetu Katika Tanzania",
    loading: "Inapakia...",
    errorLoading: "Hitilafu katika kupakia data. Tafadhali jaribu tena.",
    retry: "Jaribu tena",
  },
}

// Dynamically import the modal for better performance
const BlogPostModal = dynamic(() => import("@/components/blog-post-modal").then((mod) => mod.BlogPostModal), {
  ssr: false,
  loading: () => null,
})

// Features
const features = [
  {
    icon: "💧",
    title: { en: "High Absorption", sw: "Unyonywaji wa Hali ya Juu" },
    description: {
      en: "Our diapers feature advanced absorption technology to keep your baby dry and comfortable.",
      sw: "Diapers zetu zina teknolojia ya unyonywaji ya hali ya juu kuweka mtoto wako mkavu na mfaraja.",
    },
  },
  {
    icon: "🌙",
    title: { en: "Overnight Protection", sw: "Ulinzi wa Usiku" },
    description: {
      en: "Designed for all-night comfort and leak protection for peaceful sleep.",
      sw: "Imeundwa kwa faraja ya usiku wote na ulinzi dhidi ya kuvuja kwa usingizi wa amani.",
    },
  },
  {
    icon: "🌈",
    title: { en: "Soft Materials", sw: "Vifaa Laini" },
    description: {
      en: "Made with gentle, skin-friendly materials for sensitive baby skin.",
      sw: "Imetengenezwa kwa vifaa laini, rafiki kwa ngozi kwa ngozi nyeti ya mtoto.",
    },
  },
  {
    icon: "✨",
    title: { en: "Japan Standard", sw: "Kiwango cha Japan" },
    description: {
      en: "Manufactured to meet high Japanese quality standards for reliability.",
      sw: "Imetengenezwa kukidhi viwango vya juu vya ubora vya Kijapani kwa utegemezi.",
    },
  },
]

// Testimonials
const testimonials = [
  {
    name: "Mama Amina",
    text: {
      en: "Yammy Yami diapers have been a blessing for my baby. They're so comfortable and never leak!",
      sw: "Diapers za Yammy Yami zimekuwa baraka kwa mtoto wangu. Ni za faraja sana na hazivuji kamwe!",
    },
    rating: 5,
  },
  {
    name: "Baba Hassan",
    text: {
      en: "The quality is excellent and the price is affordable. My family loves Yammy Yami products!",
      sw: "Ubora ni bora na bei ni nafuu. Familia yangu inapenda bidhaa za Yammy Yami!",
    },
    rating: 5,
  },
  {
    name: "Mama Grace",
    text: {
      en: "I've tried many brands, but Yammy Yami is the best for my baby's sensitive skin.",
      sw: "Nimejaribu bidhaa nyingi, lakini Yammy Yami ni bora kwa ngozi nyeti ya mtoto wangu.",
    },
    rating: 5,
  },
]

// Hero carousel images - removed the third image
const heroImages = [
  {
    src: "/images/yammy-yami-mother-daughter-hero.jpeg",
    alt: "Yammy Yami Brand Ambassador",
  },
  {
    src: "/images/baby-with-products.png",
    alt: "Yammy Yami Product Showcase",
  },
]

// Achievement stats
const achievements = [
  {
    icon: <Users className="h-8 w-8 text-white" />,
    value: 50000,
    title: { en: "Happy Customers", sw: "Wateja Wenye Furaha" },
  },
  {
    icon: <ShoppingBag className="h-8 w-8 text-white" />,
    value: 1000000,
    title: { en: "Products Delivered", sw: "Bidhaa Zilizosambazwa" },
  },
  {
    icon: <Globe className="h-8 w-8 text-white" />,
    value: 26,
    title: { en: "Regions Covered", sw: "Mikoa Inayofikiwa" },
  },
  {
    icon: <Award className="h-8 w-8 text-white" />,
    value: 5,
    title: { en: "Years of Experience", sw: "Miaka ya Uzoefu" },
  },
]

// Transition variants for hero carousel
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 30 : -30,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 },
      rotateY: { duration: 0.5 },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 30 : -30,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.5 },
      scale: { duration: 0.5 },
      rotateY: { duration: 0.5 },
    },
  }),
}

export default function Home() {
  const { language } = useLanguage()
  const { products, blogPosts, loadProducts, loadBlogPosts, isLoading, error } = useStore()
  const { addItem } = useCart()
  const [bubbles, setBubbles] = useState<Array<{ id: number; size: number; left: string; delay: number }>>([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredBlogPosts, setFeaturedBlogPosts] = useState([])
  const [imageVersion, setImageVersion] = useState(Date.now())
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [localLoading, setLocalLoading] = useState(true)
  const t = translations[language || "en"]

  // Set up hero image carousel
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [isPaused])

  const nextImage = () => {
    setDirection(1)
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
  }

  const prevImage = () => {
    setDirection(-1)
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroImages.length) % heroImages.length)
  }

  useEffect(() => {
    // Create random bubbles for background effect
    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 50) + 20,
      left: `${Math.floor(Math.random() * 100)}%`,
      delay: Math.random() * 5,
    }))
    setBubbles(newBubbles)
  }, [])

  // Load featured products and blog posts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLocalLoading(true)

        // Load products and blog posts
        await Promise.all([loadProducts(), loadBlogPosts()])

        // Get current products from store
        const currentProducts = useStore.getState().products
        const currentBlogPosts = useStore.getState().blogPosts

        // Filter featured items from the loaded data
        const featured = currentProducts.filter((product) => product.featured === true)
        setFeaturedProducts(featured.slice(0, 4))

        const featuredPosts = currentBlogPosts.filter((post) => post.featured === true)
        setFeaturedBlogPosts(featuredPosts.slice(0, 3))
      } catch (error) {
        console.error("Error fetching data:", error)

        // Fallback to current store state
        const currentProducts = useStore.getState().products
        const currentBlogPosts = useStore.getState().blogPosts

        const featured = currentProducts.filter((product) => product.featured === true)
        setFeaturedProducts(featured.slice(0, 4))

        const featuredPosts = currentBlogPosts.filter((post) => post.featured === true)
        setFeaturedBlogPosts(featuredPosts.slice(0, 3))
      } finally {
        setLocalLoading(false)
      }
    }

    fetchData()
  }, [loadProducts, loadBlogPosts])

  // Update featured items when products or blog posts change
  useEffect(() => {
    if (products.length > 0) {
      const featured = products.filter((product) => product.featured === true)
      setFeaturedProducts(featured.slice(0, 4))
    }

    if (blogPosts.length > 0) {
      const featuredPosts = blogPosts.filter((post) => post.featured === true)
      setFeaturedBlogPosts(featuredPosts.slice(0, 3))
    }
  }, [products, blogPosts])

  // Force image refresh by updating the version
  useEffect(() => {
    setImageVersion(Date.now())
  }, [products, blogPosts])

  const formatPrice = (price: number) => {
    return `TZS ${price.toLocaleString()}`
  }

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return date.toLocaleDateString(language === "en" ? "en-US" : "sw-TZ", options)
  }

  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: product.size,
      bundleSize: product.bundleSize,
    })

    // Show confirmation toast
    toast({
      title: t.addedToCart,
      description: t.productAddedToCart,
      variant: "default",
      duration: 3000,
    })
  }

  // Handle opening the modal with the selected post
  const handleOpenModal = useCallback((post) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }, [])

  // Handle closing the modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    // Wait for animation to complete before clearing the selected post
    setTimeout(() => setSelectedPost(null), 300)
  }, [])

  // Process image URL to ensure it's not cached
  const getProcessedImageUrl = (url: string | undefined) => {
    if (!url) return undefined

    // If it's already a placeholder, return as is
    if (url.includes("placeholder.svg")) return url

    // Add cache-busting parameter
    const timestamp = imageVersion
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}v=${timestamp}`
  }

  // Handle retry loading
  const handleRetry = async () => {
    setLocalLoading(true)
    try {
      await Promise.all([loadProducts(), loadBlogPosts()])
    } catch (error) {
      console.error("Error retrying data load:", error)
    } finally {
      setLocalLoading(false)
    }
  }

  // Show loading state
  if (localLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 text-yammy-blue animate-spin mb-4" />
        <p className="text-yammy-dark-blue font-medium">{t.loading}</p>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <p className="text-red-600 mb-4">{t.errorLoading}</p>
          <Button onClick={handleRetry} className="bg-yammy-blue hover:bg-yammy-dark-blue">
            {t.retry}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper>
      {/* Decorative bubbles */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="bubble hidden md:block"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: bubble.left,
            top: `${Math.random() * 100}%`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bubblegum text-yammy-dark-blue mb-6 leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-xl text-yammy-blue mb-8">{t.heroSubtitle}</p>
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-yammy-blue hover:bg-yammy-dark-blue text-white font-medium text-lg px-8 py-6 rounded-full"
                >
                  {t.shopNow}
                </Button>
              </Link>
            </motion.div>
            <div
              className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-lg perspective-1000"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentImageIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                  style={{
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <Image
                    src={heroImages[currentImageIndex].src || "/placeholder.svg"}
                    alt={heroImages[currentImageIndex].alt}
                    fill
                    className="object-contain"
                    priority
                  />

                  {/* Image caption */}
                  <div className="absolute bottom-16 left-0 right-0 text-center">
                    <div className="inline-block bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <p className="text-yammy-dark-blue font-medium">{heroImages[currentImageIndex].alt}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label={t.prevImage}
              >
                <ChevronLeft className="h-6 w-6 text-yammy-dark-blue" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                aria-label={t.nextImage}
              >
                <ChevronRightIcon className="h-6 w-6 text-yammy-dark-blue" />
              </button>

              <div className="absolute -bottom-4 -right-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                <p className="text-yammy-blue font-bubblegum text-lg">{t.japanStandard}</p>
              </div>

              {/* Hero image navigation dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentImageIndex ? 1 : -1)
                      setCurrentImageIndex(index)
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex ? "bg-yammy-blue scale-125" : "bg-white/60 hover:bg-white/90"
                    }`}
                    aria-label={`Show image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-yammy-blue/10 via-transparent to-yammy-blue/10 animate-gradient-x pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 text-4xl cloud-animation hidden lg:block">☁️</div>
        <div className="absolute bottom-10 right-10 w-20 h-20 text-4xl cloud-animation hidden lg:block">☁️</div>
        <div className="absolute top-20 right-20 w-10 h-10 text-2xl star-animation hidden lg:block">⭐</div>
        <div className="absolute bottom-20 left-20 w-10 h-10 text-2xl star-animation hidden lg:block">⭐</div>
      </section>

      {/* Tagline Banner */}
      <section className="bg-yammy-blue py-8 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bubblegum text-center">{t.stayDry}</h2>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bubblegum text-center mb-12 text-yammy-dark-blue">
            {t.featuredProducts}
          </h2>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  className="product-card bg-white rounded-2xl shadow-md overflow-hidden"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-64 bg-yammy-light-blue">
                    <OptimizedImage
                      src={getProcessedImageUrl(product.image) || "/placeholder.svg?height=300&width=300&query=product"}
                      alt={product.name[language || "en"]}
                      fill
                      className="object-contain p-4"
                      fallbackSrc="/assorted-products-display.png"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bubblegum text-xl mb-2 text-yammy-dark-blue">
                      {product.name[language || "en"]}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-yammy-blue font-bold">{formatPrice(product.price)}</span>
                      <Button
                        size="sm"
                        className="rounded-full bg-yammy-blue hover:bg-yammy-dark-blue"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        <span>{t.addToCart}</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t.noFeaturedProducts}</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button
                variant="outline"
                className="group border-yammy-blue text-yammy-blue hover:bg-yammy-blue hover:text-white"
              >
                {t.viewAll}
                <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-yammy-light-blue">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bubblegum text-center mb-12 text-yammy-dark-blue">
            {t.happyAndComfort}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4 animate-bounce-slow">{feature.icon}</div>
                <h3 className="text-xl font-bubblegum mb-3 text-yammy-dark-blue">{feature.title[language || "en"]}</h3>
                <p className="text-gray-600">{feature.description[language || "en"]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/yammy-yami-mother-baby.png"
            alt="Mother and baby with Yammy Yami products"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-yammy-dark-blue/70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bubblegum text-center mb-4 text-white">{t.achievements}</h2>
          <p className="text-xl text-center text-white/90 mb-12 max-w-3xl mx-auto">{t.ourImpact}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-yammy-blue/30 backdrop-blur-sm rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {achievement.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  <CountUp end={achievement.value} duration={2.5} />
                  {achievement.value >= 1000 ? "+" : ""}
                </div>
                <h3 className="text-xl font-bubblegum text-white">{achievement.title[language || "en"]}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bubblegum text-center mb-12 text-yammy-dark-blue">
            {t.latestBlogPosts}
          </h2>

          {featuredBlogPosts && featuredBlogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredBlogPosts.map((post) => (
                <motion.div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                  whileHover={{ y: -10 }}
                >
                  <div className="relative h-48">
                    <OptimizedImage
                      src={getProcessedImageUrl(post.image) || "/placeholder.svg?height=300&width=500&query=blog post"}
                      alt={post.title[language || "en"]}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bubblegum text-xl mb-2 text-yammy-dark-blue">{post.title[language || "en"]}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt[language || "en"]}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime} {t.minutes}
                      </div>
                    </div>
                    <Button
                      className="mt-4 w-full bg-yammy-blue hover:bg-yammy-dark-blue"
                      onClick={() => handleOpenModal(post)}
                    >
                      {t.readMore} <ChevronRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">{t.noFeaturedPosts}</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/blog">
              <Button
                variant="outline"
                className="group border-yammy-blue text-yammy-blue hover:bg-yammy-blue hover:text-white"
              >
                {t.viewAllBlogPosts}
                <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bubblegum mb-6 text-yammy-dark-blue">{t.allSizesAvailable}</h2>
              <p className="text-gray-600 mb-6">
                {language === "en"
                  ? "We offer a complete range of sizes from Newborn (NB) to XXXXXL to fit babies and adults of all ages and stages."
                  : "Tunatoa ukubwa kamili kutoka Newborn (NB) hadi XXXXXL kufaa watoto na watu wazima wa umri na hatua zote."}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">NB (≤5kg)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">S (4-8kg)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">M (7-10kg)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">L (9-14kg)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">XL (12-17kg)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">XXL (15kg+)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">XXXL (17kg+)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">XXXXL (19kg+)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">XXXXXL (21kg+)</span>
                </div>
              </div>
              <Link href="/products">
                <Button className="bg-yammy-blue hover:bg-yammy-dark-blue text-white rounded-full">{t.shopNow}</Button>
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative h-[400px]"
              >
                <OptimizedImage src="/images/diaper-sizes.png" alt="Diaper sizes" fill className="object-contain" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-yammy-light-blue">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bubblegum text-center mb-12 text-yammy-dark-blue">
            {language === "en" ? "What Parents Say" : "Wazazi Wanasema Nini"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yammy-orange text-yammy-orange" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text[language || "en"]}"</p>
                <p className="font-bold text-yammy-dark-blue">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bubblegum text-center mb-12 text-yammy-dark-blue">{t.contactUs}</h2>

          <div className="max-w-lg mx-auto bg-yammy-light-blue rounded-2xl shadow-lg p-8">
            <div className="flex flex-col space-y-4">
              <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center py-6">
                <Phone className="w-5 h-5 mr-2" />
                +255 658 181 863
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center py-6">
                <Phone className="w-5 h-5 mr-2" />
                +255 754 089 447
              </Button>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <Button variant="outline" size="icon" className="rounded-full border-yammy-blue text-yammy-blue">
                  <Instagram className="h-5 w-5" />
                </Button>
                <p className="text-yammy-dark-blue">@yammy_diaperstz</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-bubblegum text-xl mb-4 text-yammy-dark-blue">{t.locations}</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-yammy-blue mt-2 mr-2"></div>
                  <div>
                    <p className="font-medium text-yammy-dark-blue">{t.kariakoo}</p>
                    <p className="text-sm text-gray-600">Kariakoo Market, Dar es Salaam</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-yammy-blue mt-2 mr-2"></div>
                  <div>
                    <p className="font-medium text-yammy-dark-blue">{t.sukuma}</p>
                    <p className="text-sm text-gray-600">Sukuma Street, Dar es Salaam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Post Modal */}
      <Suspense fallback={null}>
        {selectedPost && <BlogPostModal post={selectedPost} isOpen={isModalOpen} onClose={handleCloseModal} />}
      </Suspense>
    </PageWrapper>
  )
}

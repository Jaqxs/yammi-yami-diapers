"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"

// Language translations
const translations = {
  en: {
    blog: "Blog",
    latestArticles: "Latest Articles",
    readMore: "Read More",
    searchPlaceholder: "Search articles...",
    search: "Search",
    featured: "Featured",
    categories: "Categories",
    babyHealth: "Baby Health",
    parentingTips: "Parenting Tips",
    productInfo: "Product Info",
    latestNews: "Latest News",
    popularTags: "Popular Tags",
    newborn: "Newborn",
    tips: "Tips",
    skinCare: "Skin Care",
    nutrition: "Nutrition",
    sleep: "Sleep",
    pottyTraining: "Potty Training",
    minutes: "min read",
  },
  sw: {
    blog: "Blogu",
    latestArticles: "Makala za Hivi Karibuni",
    readMore: "Soma Zaidi",
    searchPlaceholder: "Tafuta makala...",
    search: "Tafuta",
    featured: "Zilizoangaziwa",
    categories: "Makundi",
    babyHealth: "Afya ya Mtoto",
    parentingTips: "Vidokezo vya Ulezi",
    productInfo: "Habari za Bidhaa",
    latestNews: "Habari za Hivi Karibuni",
    popularTags: "Lebo Maarufu",
    newborn: "Mtoto Mchanga",
    tips: "Vidokezo",
    skinCare: "Utunzaji wa Ngozi",
    nutrition: "Lishe",
    sleep: "Usingizi",
    pottyTraining: "Kufundisha Choo",
    minutes: "dakika za kusoma",
  },
}

// Blog post data
const blogPosts = [
  {
    id: 1,
    title: {
      en: "How to Choose the Right Diaper Size for Your Baby",
      sw: "Jinsi ya Kuchagua Ukubwa Sahihi wa Diaper kwa Mtoto Wako",
    },
    excerpt: {
      en: "Learn how to measure your baby and choose the perfect diaper size to ensure comfort and prevent leaks.",
      sw: "Jifunze jinsi ya kupima mtoto wako na kuchagua ukubwa sahihi wa diaper kuhakikisha faraja na kuzuia kuvuja.",
    },
    date: "2023-06-15",
    readTime: 5,
    category: "babyHealth",
    image: "/images/baby-diapers.png",
    tags: ["newborn", "tips"],
    featured: true,
  },
  {
    id: 2,
    title: {
      en: "Understanding Diaper Rash: Causes and Prevention",
      sw: "Kuelewa Upele wa Diaper: Sababu na Kuzuia",
    },
    excerpt: {
      en: "Discover the common causes of diaper rash and effective strategies to prevent it and keep your baby comfortable.",
      sw: "Gundua sababu za kawaida za upele wa diaper na mikakati yenye ufanisi ya kuzuia na kuweka mtoto wako mfaraja.",
    },
    date: "2023-07-20",
    readTime: 8,
    category: "babyHealth",
    image: "/images/baby-with-products.png",
    tags: ["skinCare", "tips"],
    featured: false,
  },
  {
    id: 3,
    title: {
      en: "The Benefits of High-Absorption Diapers for Overnight Use",
      sw: "Faida za Diapers za Unyonywaji wa Juu kwa Matumizi ya Usiku",
    },
    excerpt: {
      en: "Learn why high-absorption diapers are essential for peaceful nights and how they help improve your baby's sleep quality.",
      sw: "Jifunze kwa nini diapers za unyonywaji wa juu ni muhimu kwa usiku wa amani na jinsi zinavyosaidia kuboresha ubora wa usingizi wa mtoto wako.",
    },
    date: "2023-08-05",
    readTime: 6,
    category: "productInfo",
    image: "/images/diaper-features.png",
    tags: ["sleep", "tips"],
    featured: true,
  },
  {
    id: 4,
    title: {
      en: "Potty Training: Signs Your Child is Ready",
      sw: "Kufundisha Choo: Dalili Mtoto Wako Yuko Tayari",
    },
    excerpt: {
      en: "Recognize the signs that indicate your child is ready to start potty training and learn tips for a smooth transition.",
      sw: "Tambua dalili zinazoonyesha mtoto wako yuko tayari kuanza kufundishwa choo na jifunze vidokezo kwa mpito laini.",
    },
    date: "2023-09-10",
    readTime: 10,
    category: "parentingTips",
    image: "/images/baby-with-products.png",
    tags: ["pottyTraining", "tips"],
    featured: false,
  },
  {
    id: 5,
    title: {
      en: "Nutrition for Healthy Skin: Foods That Help Prevent Diaper Rash",
      sw: "Lishe kwa Ngozi Yenye Afya: Vyakula Vinavyosaidia Kuzuia Upele wa Diaper",
    },
    excerpt: {
      en: "Discover how your baby's diet can impact skin health and which foods can help reduce the risk of diaper rash.",
      sw: "Gundua jinsi lishe ya mtoto wako inavyoweza kuathiri afya ya ngozi na vyakula gani vinaweza kusaidia kupunguza hatari ya upele wa diaper.",
    },
    date: "2023-10-15",
    readTime: 7,
    category: "babyHealth",
    image: "/images/model-with-diapers.png",
    tags: ["nutrition", "skinCare"],
    featured: false,
  },
  {
    id: 6,
    title: {
      en: "New Product Launch: Introducing Our Eco-Friendly Diaper Line",
      sw: "Uzinduzi wa Bidhaa Mpya: Tunatanguliza Laini Yetu ya Diaper Rafiki kwa Mazingira",
    },
    excerpt: {
      en: "Learn about our new eco-friendly diaper line that offers the same quality and comfort while being better for the environment.",
      sw: "Jifunze kuhusu laini yetu mpya ya diaper rafiki kwa mazingira inayotoa ubora na faraja sawa wakati ikiwa bora kwa mazingira.",
    },
    date: "2023-11-20",
    readTime: 5,
    category: "latestNews",
    image: "/images/diaper-sizes.png",
    tags: ["productInfo"],
    featured: true,
  },
]

// Format date function
function formatDate(dateString: string, language: "en" | "sw") {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString(language === "en" ? "en-US" : "sw-TZ", options)
}

export default function BlogPage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const t = translations[language]

  // Filter posts based on search query
  const filteredPosts = blogPosts.filter((post) => {
    if (!searchQuery) return true
    return (
      post.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt[language].toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Get featured posts
  const featuredPosts = blogPosts.filter((post) => post.featured)

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bubblegum text-center mb-12 text-yammy-dark-blue">{t.blog}</h1>

        {/* Featured Posts Slider */}
        <div className="mb-16">
          <h2 className="text-2xl font-bubblegum mb-6 text-yammy-dark-blue">{t.featured}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
                whileHover={{ y: -10 }}
              >
                <div className="relative h-48">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title[language]}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <span className="text-xs bg-yammy-blue px-2 py-1 rounded-full">
                      {t[post.category as keyof typeof t]}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bubblegum text-xl mb-2 text-yammy-dark-blue">{post.title[language]}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt[language]}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(post.date, language)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime} {t.minutes}
                    </div>
                  </div>
                  <Button className="mt-4 w-full bg-yammy-blue hover:bg-yammy-dark-blue" asChild>
                    <Link href={`/blog/${post.id}`}>
                      {t.readMore} <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content - Blog Posts */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bubblegum mb-6 text-yammy-dark-blue">{t.latestArticles}</h2>
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="md:flex">
                    <div className="relative h-64 md:h-auto md:w-1/3">
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt={post.title[language]}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <CardHeader className="p-0 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-yammy-light-blue text-yammy-blue px-2 py-1 rounded-full">
                            {t[post.category as keyof typeof t]}
                          </span>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.readTime} {t.minutes}
                          </div>
                        </div>
                        <CardTitle className="font-bubblegum text-xl text-yammy-dark-blue">
                          {post.title[language]}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.date, language)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 pb-4">
                        <p className="text-gray-600">{post.excerpt[language]}</p>
                      </CardContent>
                      <CardFooter className="p-0">
                        <Button
                          variant="outline"
                          className="border-yammy-blue text-yammy-blue hover:bg-yammy-blue hover:text-white"
                          asChild
                        >
                          <Link href={`/blog/${post.id}`}>{t.readMore}</Link>
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Search */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-bubblegum text-yammy-dark-blue">{t.search}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-yammy-blue/30"
                  />
                  <Button className="bg-yammy-blue hover:bg-yammy-dark-blue">{t.search}</Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="font-bubblegum text-yammy-dark-blue">{t.categories}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {["babyHealth", "parentingTips", "productInfo", "latestNews"].map((category) => (
                    <li key={category}>
                      <Link
                        href={`/blog/category/${category}`}
                        className="flex items-center justify-between text-gray-700 hover:text-yammy-blue"
                      >
                        <span>{t[category as keyof typeof t]}</span>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="font-bubblegum text-yammy-dark-blue">{t.popularTags}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["newborn", "tips", "skinCare", "nutrition", "sleep", "pottyTraining"].map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog/tag/${tag}`}
                      className="bg-yammy-light-blue text-yammy-blue px-3 py-1 rounded-full text-sm hover:bg-yammy-blue hover:text-white transition-colors"
                    >
                      {t[tag as keyof typeof t]}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

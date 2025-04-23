"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, ChevronRight, Phone, Instagram, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { PageWrapper } from "@/components/page-wrapper"

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
  },
}

// Product data
const products = [
  {
    id: 1,
    name: {
      en: "Premium Baby Diapers - Small",
      sw: "Diapers Bora za Watoto - Ndogo",
    },
    price: 15000,
    image: "/images/baby-diapers.png",
  },
  {
    id: 2,
    name: {
      en: "Ultra Soft Lady Pads - Pack of 10",
      sw: "Pedi Laini za Wanawake - Pakiti ya 10",
    },
    price: 8000,
    image: "/images/lady-pads.png",
  },
  {
    id: 3,
    name: {
      en: "Baby Diapers - All Sizes",
      sw: "Diapers za Watoto - Ukubwa Wote",
    },
    price: 20000,
    image: "/images/diaper-sizes.png",
  },
  {
    id: 4,
    name: {
      en: "High Absorption Baby Diapers",
      sw: "Diapers za Watoto za Unyonywaji wa Juu",
    },
    price: 25000,
    image: "/images/diaper-features.png",
  },
]

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

export default function Home() {
  const { language } = useLanguage()
  const [bubbles, setBubbles] = useState<Array<{ id: number; size: number; left: string; delay: number }>>([])
  const t = translations[language]

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

  const formatPrice = (price: number) => {
    return `TZS ${price.toLocaleString()}`
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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative h-[500px] w-full">
                <Image
                  src="/images/ambassador-1.png"
                  alt="Yammy Yami Brand Ambassador"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                <p className="text-yammy-blue font-bubblegum text-lg">{t.japanStandard}</p>
              </div>
            </motion.div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="product-card bg-white rounded-2xl shadow-md overflow-hidden"
                whileHover={{ y: -10 }}
              >
                <div className="relative h-64 bg-yammy-light-blue">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name[language]}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bubblegum text-xl mb-2 text-yammy-dark-blue">{product.name[language]}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-yammy-blue font-bold">{formatPrice(product.price)}</span>
                    <Button size="sm" className="rounded-full bg-yammy-blue hover:bg-yammy-dark-blue">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      <span>{language === "en" ? "Add" : "Ongeza"}</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button
                variant="outline"
                className="group border-yammy-blue text-yammy-blue hover:bg-yammy-blue hover:text-white"
              >
                {t.viewAll}
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                <h3 className="text-xl font-bubblegum mb-3 text-yammy-dark-blue">{feature.title[language]}</h3>
                <p className="text-gray-600">{feature.description[language]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Ambassadors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bubblegum text-center mb-12 text-yammy-dark-blue">
            {language === "en" ? "Our Brand Ambassadors" : "Mabalozi Wetu wa Bidhaa"}
          </h2>

          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            {language === "en"
              ? "Meet the faces behind Yammy Yami Diaper TZ. Our ambassadors represent the quality, comfort, and style that our products bring to Tanzanian families."
              : "Wafahamu nyuso nyuma ya Yammy Yami Diaper TZ. Mabalozi wetu wanawakilisha ubora, faraja, na mtindo ambao bidhaa zetu huleta kwa familia za Kitanzania."}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 5, 6, 8].map((num) => (
              <motion.div
                key={num}
                className="relative rounded-xl overflow-hidden shadow-md group"
                whileHover={{ y: -10 }}
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={`/images/ambassador-${num}.png`}
                    alt={`Yammy Yami Brand Ambassador ${num}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yammy-dark-blue/80 to-transparent p-4">
                  <p className="text-white font-medium text-center">
                    {language === "en" ? "Brand Ambassador" : "Balozi wa Bidhaa"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/about">
              <Button
                variant="outline"
                className="group border-yammy-blue text-yammy-blue hover:bg-yammy-blue hover:text-white"
              >
                {language === "en" ? "Learn More About Us" : "Jifunze Zaidi Kutuhusu"}
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                  ? "We offer a complete range of sizes from S to XL to fit babies of all ages and stages."
                  : "Tunatoa ukubwa kamili kutoka S hadi XL kufaa watoto wa umri na hatua zote."}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">S (4-8kg)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">M (6-11kg)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">L (9-14kg)</span>
                </div>
                <div className="bg-yammy-light-blue rounded-lg p-3 text-center">
                  <span className="font-bubblegum text-lg text-yammy-dark-blue">XL (12-17kg)</span>
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
                <Image src="/images/diaper-sizes.png" alt="Diaper sizes" fill className="object-contain" />
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
                <p className="text-gray-600 mb-4">"{testimonial.text[language]}"</p>
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
    </PageWrapper>
  )
}

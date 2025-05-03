"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { OptimizedImage } from "@/components/optimized-image"
import { useLanguage } from "@/components/language-provider"

export default function BrandAmbassadorSection() {
  const { language } = useLanguage()
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <section className="py-12 bg-yammy-light-blue">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-[400px]">
            <OptimizedImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-21%20at%2004.17.11_e98c889a.jpg-qImS0ea607vm0WJyywYVFZ0KBHG2zi.jpeg"
              alt="Brand Ambassador with Yammy Yami Products"
              fill
              className="object-contain"
              fallbackSrc="/images/ambassador-6.png"
              onLoad={() => setImageLoaded(true)}
              quality={90}
              priority
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bubblegum text-yammy-dark-blue mb-4">
              {language === "en" ? "Trusted by Our Ambassadors" : "Inaaminiwa na Mabalozi Wetu"}
            </h2>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yammy-orange text-yammy-orange" />
              ))}
            </div>
            <blockquote className="text-lg italic text-gray-700 mb-6">
              {language === "en"
                ? "I love Yammy Yami products because they provide the perfect combination of comfort, quality, and affordability. As a brand ambassador, I'm proud to represent a company that truly cares about Tanzanian families."
                : "Ninapenda bidhaa za Yammy Yami kwa sababu zinatoa mchanganyiko kamili wa faraja, ubora, na bei nafuu. Kama balozi wa bidhaa, ninajivunia kuwakilisha kampuni inayojali kweli familia za Kitanzania."}
            </blockquote>
            <p className="font-bold text-yammy-dark-blue">{language === "en" ? "Nasma Hassan" : "Nasma Hassan"}</p>
            <p className="text-yammy-blue">Nana_dollz</p>
          </div>
        </div>
      </div>
    </section>
  )
}

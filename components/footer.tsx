"use client"

import Link from "next/link"
import { Phone, Instagram } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

// Translations for footer
const footerTranslations = {
  en: {
    products: "Products",
    babyDiapers: "Baby Diapers",
    ladyPads: "Lady Pads",
    adultDiapers: "Adult Diapers",
    quickLinks: "Quick Links",
    about: "About Us",
    blog: "Blog",
    contact: "Contact Us",
    copyright: "© 2025 Yammy Yami Diaper TZ. All rights reserved.",
    quality: "Quality diapers for every family member",
  },
  sw: {
    products: "Bidhaa",
    babyDiapers: "Diapers za Watoto",
    ladyPads: "Pedi za Wanawake",
    adultDiapers: "Diapers za Watu Wazima",
    quickLinks: "Viungo vya Haraka",
    about: "Kuhusu Sisi",
    blog: "Blogu",
    contact: "Wasiliana Nasi",
    copyright: "© 2025 Yammy Yami Diaper TZ. Haki zote zimehifadhiwa.",
    quality: "Diapers bora kwa kila mwanafamilia",
  },
}

export function Footer() {
  const { language } = useLanguage()
  const t = footerTranslations[language]

  return (
    <footer className="bg-yammy-dark-blue text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-yammy-blue flex items-center justify-center text-white font-bubblegum text-xl">
                YY
              </div>
              <span className="font-bubblegum text-2xl">Yammy Yami</span>
            </div>
            <p className="text-gray-300 text-sm">{t.quality}</p>
          </div>

          <div>
            <h3 className="font-bubblegum text-xl mb-4">{t.products}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  {t.babyDiapers}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  {t.ladyPads}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  {t.adultDiapers}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bubblegum text-xl mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t.about}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  {t.blog}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bubblegum text-xl mb-4">{t.contact}</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +255 658 181 863
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +255 754 089 447
              </li>
              <li className="flex items-center">
                <Instagram className="w-4 h-4 mr-2" />
                @yammy_diaperstz
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}

"use client"

import Link from "next/link"
import { Phone, Instagram, Mail, MapPin, Facebook, Twitter, Linkedin, ArrowRight, Heart } from "lucide-react"
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
    subscribe: "Subscribe to our newsletter",
    subscribeText: "Stay updated with our latest products and offers",
    yourEmail: "Your email",
    joinUs: "Join Us",
    followUs: "Follow Us",
    address: "Dar es Salaam, Tanzania",
    madeWith: "Made with",
    inTanzania: "in Tanzania",
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
    subscribe: "Jiandikishe kupokea taarifa",
    subscribeText: "Pokea taarifa za bidhaa mpya na matoleo",
    yourEmail: "Barua pepe yako",
    joinUs: "Jiunge Nasi",
    followUs: "Tufuate",
    address: "Dar es Salaam, Tanzania",
    madeWith: "Imetengenezwa kwa",
    inTanzania: "Tanzania",
  },
}

export function Footer() {
  const { language } = useLanguage()
  const t = footerTranslations[language]

  return (
    <footer className="relative bg-gradient-to-br from-yammy-dark-blue to-blue-900 text-white pt-16 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yammy-blue via-pink-400 to-purple-500"></div>
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yammy-blue/10 -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-pink-500/10 -ml-32 -mb-32 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter section */}
        <div className="bg-gradient-to-r from-yammy-blue/20 to-purple-600/20 backdrop-blur-sm p-6 rounded-xl mb-12 border border-white/10 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="font-bubblegum text-2xl mb-2">{t.subscribe}</h3>
              <p className="text-gray-300 text-sm max-w-md">{t.subscribeText}</p>
            </div>
            <div className="w-full md:w-auto flex-1 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={t.yourEmail}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yammy-blue text-white placeholder-gray-400"
              />
              <button className="bg-yammy-blue hover:bg-yammy-blue/80 transition-colors px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 whitespace-nowrap">
                {t.joinUs}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yammy-blue to-purple-500 flex items-center justify-center text-white font-bubblegum text-xl shadow-lg">
                YY
              </div>
              <span className="font-bubblegum text-2xl">Yammy Yami</span>
            </div>
            <p className="text-gray-300 text-sm mb-6">{t.quality}</p>
            <div className="flex items-center gap-1 text-sm text-gray-300">
              <MapPin className="w-4 h-4 text-yammy-blue" />
              <span>{t.address}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-300 mt-2">
              <Mail className="w-4 h-4 text-yammy-blue" />
              <span>info@yammyyami.co.tz</span>
            </div>
          </div>

          {/* Products column */}
          <div>
            <h3 className="font-bubblegum text-xl mb-4 relative inline-block">
              {t.products}
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-yammy-blue rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yammy-blue group-hover:w-2 transition-all"></span>
                  {t.babyDiapers}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yammy-blue group-hover:w-2 transition-all"></span>
                  {t.ladyPads}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yammy-blue group-hover:w-2 transition-all"></span>
                  {t.adultDiapers}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links column */}
          <div>
            <h3 className="font-bubblegum text-xl mb-4 relative inline-block">
              {t.quickLinks}
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-yammy-blue rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yammy-blue group-hover:w-2 transition-all"></span>
                  {t.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yammy-blue group-hover:w-2 transition-all"></span>
                  {t.blog}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-yammy-blue group-hover:w-2 transition-all"></span>
                  {t.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="font-bubblegum text-xl mb-4 relative inline-block">
              {t.contact}
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-yammy-blue rounded-full"></span>
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-yammy-blue" />
                </div>
                +255 658 181 863
              </li>
              <li className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-yammy-blue" />
                </div>
                +255 754 089 447
              </li>
            </ul>

            <h4 className="text-sm font-medium mb-3">{t.followUs}</h4>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/yammy_diaperstz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-yammy-blue transition-colors flex items-center justify-center"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-yammy-blue transition-colors flex items-center justify-center"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-yammy-blue transition-colors flex items-center justify-center"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-yammy-blue transition-colors flex items-center justify-center"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">{t.copyright}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{t.madeWith}</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>{t.inTanzania}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

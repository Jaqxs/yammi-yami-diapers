"use client"

import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Baby,
  Download,
  Gift,
  Instagram,
  Mail,
  Phone,
  ShoppingBag,
  Star,
  Users,
  Check,
  Sparkles,
  Package,
  BadgePercent,
  TrendingUp,
} from "lucide-react"
import { motion } from "framer-motion"
import { PageWrapper } from "@/components/page-wrapper"

// Translations
const translations = {
  en: {
    title: "Become a Yammy Yami Agent!",
    subtitle: "Join our family and sell Yammy Yamy products!",
    registerButton: "Register as an Agent",
    registrationFee: "Registration Fee: TZS 50,000",
    formTitle: "Agent Registration Form",
    formName: "Full Name",
    formEmail: "Email",
    formPhone: "Phone Number",
    formPayment: "Payment Confirmation Number",
    formSubmit: "Submit Registration",
    formCancel: "Cancel",
    confirmationTitle: "Registration Successful!",
    confirmationMessage: "Thank you for registering! Check your email for agent instructions.",
    instructionsTitle: "How to Become a Yammy Yamy Agent",
    instruction1: "No specific requirements to become an agent.",
    instruction2: "You will purchase products at agent prices from Group A to Group G.",
    instruction3:
      "Price groups depend on the quantity purchased, e.g., Group A for 1 to 10 cartons. You can mix any sizes and types (diaper pants, taped diapers, adult pants, baby wipes, or lady pads) to reach 10 cartons.",
    instruction4: "The same applies to Groups B, C, D, E, F, and G (Super Agent).",
    instruction5:
      "Various gifts and offers are provided free based on the group, e.g., candy, t-shirts, caps, balloons, fans, and carrying bags during gift distributions.",
    pricingTitle: "Agent Pricing for Yammy Yamy Products",
    groupA: "Group A: 1-10 Cartons",
    groupB: "Group B: <20 Cartons",
    groupC: "Group C: <30 Cartons",
    groupD: "Group D: <40 Cartons",
    groupE: "Group E: <50 Cartons",
    groupF: "Group F: <100 Cartons",
    groupG: "Group G: ≥100 Cartons (Super Agent)",
    productName: "Product Name",
    quantityPerPack: "Quantity per Pack",
    packsPerCarton: "Packs per Carton",
    agentPrice: "Agent Price (incl. VAT)",
    sellingPriceDar: "Suggested Selling Price (Dar)",
    sellingPriceRegions: "Suggested Selling Price (Regions)",
    babyPants: "Baby Pants",
    babyDiapers: "Baby Diapers",
    adultPants: "Adult Pants",
    babyWipes: "Baby Wipes",
    ladyPads: "Lady Pads",
    downloadPriceList: "Download Price List",
    footerCta: "Ready to join? Register now and start selling!",
    contactUs: "Contact Us",
    email: "Email",
    phone: "Phone",
    website: "Visit our website",
    socialMedia: "Follow us on social media",
    benefits: "Benefits of Becoming an Agent",
    benefit1: "Competitive Pricing",
    benefit1Desc: "Access to wholesale prices across all product categories",
    benefit2: "Exclusive Promotions",
    benefit2Desc: "Special offers and discounts available only to registered agents",
    benefit3: "Business Growth",
    benefit3Desc: "Opportunity to expand your business with high-demand products",
    benefit4: "Free Gifts",
    benefit4Desc: "Receive complimentary items based on your purchase volume",
    whyJoin: "Why Join Our Agent Network?",
    whyJoinDesc:
      "Yammy Yami offers a lucrative opportunity for entrepreneurs looking to grow their business with quality products that customers love.",
    sizeGuide: "Size Guide",
    weightRange: "Weight Range",
    hipSize: "Ukubwa wa Nyonga",
  },
  sw: {
    title: "Kuwa Wakala wa Yammy Yamy!",
    subtitle: "Jiunge na familia yetu na uuze bidhaa za Yammy Yamy!",
    registerButton: "Jisajili kama Wakala",
    registrationFee: "Ada ya Usajili: TZS 50,000",
    formTitle: "Fomu ya Usajili wa Wakala",
    formName: "Jina Kamili",
    formEmail: "Barua Pepe",
    formPhone: "Namba ya Simu",
    formPayment: "Namba ya Uthibitisho wa Malipo",
    formSubmit: "Wasilisha Usajili",
    formCancel: "Ghairi",
    confirmationTitle: "Usajili Umefanikiwa!",
    confirmationMessage: "Asante kwa kujisajili! Angalia barua pepe yako kwa maelekezo ya wakala.",
    instructionsTitle: "Kuwa Wakala wa Yammy Yamy Products",
    instruction1: "Hakuna masharti yeyote ya kuwa wakala.",
    instruction2: "Utauziwa mzigo kwa bei za mawakala ambazo zipo bei za Wakala Kundi A hadi Kundi G.",
    instruction3:
      "Haya makundi ya bei yanatokana na wingi wa mzigo unaochukua mfano Kundi A kuanzia carton 1 hadi 10 ambapo unaweza kuchanganya size na aina yeyote iwe diaper za chupi, za kufunga, adult, baby wipes au ladypads as much as unafikia carton 10.",
    instruction4: "Ni hivyo hivyo na makundi ya yanayoendelea B, C, D, E, F na G (Super Agent).",
    instruction5:
      "Zawadi na ofa mbali mbali pia zinatolewa bure kulingana na kundi husika mfano: candy, t-shirt, cap, baloons, vipepeo na mifuko ya kubebea pindi kukiwa na mgao wa zawadi.",
    pricingTitle: "Bei za Wakala za Bidhaa za Yammy Yamy",
    groupA: "Kundi A: Carton 1-10",
    groupB: "Kundi B: <Carton 20",
    groupC: "Kundi C: <Carton 30",
    groupD: "Kundi D: <Carton 40",
    groupE: "Kundi E: <Carton 50",
    groupF: "Kundi F: <Carton 100",
    groupG: "Kundi G: ≥Carton 100 (Super Agent)",
    productName: "Jina la Bidhaa",
    quantityPerPack: "Idadi kwa Pakiti",
    packsPerCarton: "Pakiti kwa Carton",
    agentPrice: "Bei ya Wakala (pamoja na VAT)",
    sellingPriceDar: "Bei ya Kuuzia Inayopendekezwa (Dar)",
    sellingPriceRegions: "Bei ya Kuuzia Inayopendekezwa (Mikoa)",
    babyPants: "Diaper za Chupi za Watoto",
    babyDiapers: "Diaper za Watoto",
    adultPants: "Diaper za Watu Wazima",
    babyWipes: "Baby Wipes",
    ladyPads: "Pedi za Wanawake",
    downloadPriceList: "Pakuwa Orodha ya Bei",
    footerCta: "Uko tayari kujiunga? Jisajili sasa na uanze kuuza!",
    contactUs: "Wasiliana Nasi",
    email: "Barua Pepe",
    phone: "Simu",
    website: "Tembelea tovuti yetu",
    socialMedia: "Tufuate kwenye mitandao ya kijamii",
    benefits: "Faida za Kuwa Wakala",
    benefit1: "Bei za Ushindani",
    benefit1Desc: "Upatikanaji wa bei za jumla katika kategoria zote za bidhaa",
    benefit2: "Promosheni za Kipekee",
    benefit2Desc: "Ofa maalum na punguzo zinazopatikana kwa mawakala waliosajiliwa tu",
    benefit3: "Ukuaji wa Biashara",
    benefit3Desc: "Fursa ya kupanua biashara yako na bidhaa zenye mahitaji makubwa",
    benefit4: "Zawadi za Bure",
    benefit4Desc: "Pokea vitu vya bure kulingana na kiasi cha ununuzi wako",
    whyJoin: "Kwa Nini Ujiunga na Mtandao Wetu wa Wakala?",
    whyJoinDesc:
      "Yammy Yami inatoa fursa ya faida kwa wajasiriamali wanaotafuta kukuza biashara yao na bidhaa bora ambazo wateja wanapenda.",
    sizeGuide: "Mwongozo wa Ukubwa",
    weightRange: "Kipimo cha Uzito",
    hipSize: "Ukubwa wa Nyonga",
  },
}

// Actual pricing data from the provided tables
const pricingData = {
  groupA: {
    babyPants: [
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 50,
        packs: 6,
        price: 17000,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 6,
        price: 17000,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        quantity: 50,
        packs: 6,
        price: 17000,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        quantity: 50,
        packs: 6,
        price: 17000,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        quantity: 100,
        packs: 5,
        price: 34500,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        quantity: 100,
        packs: 4,
        price: 34500,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 10,
        packs: 10,
        price: 3400,
        priceDar: 4500,
        priceRegions: 5000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 10,
        packs: 10,
        price: 3400,
        priceDar: 4500,
        priceRegions: 5000,
      },
    ],
    babyDiapers: [
      {
        name: "BABY DIAPER SMALL SIZE [4-8 KG] [S]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        quantity: 50,
        packs: 8,
        price: 16000,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 8,
        price: 16000,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        quantity: 50,
        packs: 8,
        price: 16000,
        priceDar: 20000,
        priceRegions: 21000,
      },
    ],
    adultPants: [
      {
        name: "ADULT PANT LARGE HIP SIZE [80-105 CM] [L]",
        quantity: 20,
        packs: 5,
        price: 24800,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        quantity: 20,
        packs: 5,
        price: 24800,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        quantity: 20,
        packs: 5,
        price: 24800,
        priceDar: 29000,
        priceRegions: 30000,
      },
    ],
    babyWipes: [{ name: "BABY WIPES", quantity: 120, packs: 12, price: 3500, priceDar: 4500, priceRegions: 5000 }],
    ladyPads: [{ name: "LADY PAD", quantity: 10, packs: 24, price: 1450, priceDar: 2500, priceRegions: 2500 }],
  },
  groupB: {
    babyPants: [
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 50,
        packs: 6,
        price: 16835,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 6,
        price: 16835,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        quantity: 50,
        packs: 6,
        price: 16835,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        quantity: 50,
        packs: 6,
        price: 16835,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        quantity: 100,
        packs: 5,
        price: 34500,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        quantity: 100,
        packs: 4,
        price: 34500,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 10,
        packs: 10,
        price: 3300,
        priceDar: 4500,
        priceRegions: 5000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 10,
        packs: 10,
        price: 3300,
        priceDar: 4500,
        priceRegions: 5000,
      },
    ],
    babyDiapers: [
      {
        name: "BABY DIAPER SMALL SIZE [4-8 KG] [S]",
        quantity: 50,
        packs: 8,
        price: 15375,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        quantity: 50,
        packs: 8,
        price: 15880,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 8,
        price: 15880,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        quantity: 50,
        packs: 8,
        price: 15880,
        priceDar: 20000,
        priceRegions: 21000,
      },
    ],
    adultPants: [
      {
        name: "ADULT PANT LARGE HIP SIZE [80-105 CM] [L]",
        quantity: 20,
        packs: 5,
        price: 24600,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        quantity: 20,
        packs: 5,
        price: 24600,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        quantity: 20,
        packs: 5,
        price: 24600,
        priceDar: 29000,
        priceRegions: 30000,
      },
    ],
    babyWipes: [{ name: "BABY WIPES", quantity: 120, packs: 12, price: 3500, priceDar: 4500, priceRegions: 5000 }],
    ladyPads: [{ name: "LADY PAD", quantity: 10, packs: 24, price: 1400, priceDar: 2500, priceRegions: 2500 }],
  },
  groupC: {
    babyPants: [
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 50,
        packs: 6,
        price: 16670,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 6,
        price: 16670,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        quantity: 50,
        packs: 6,
        price: 16670,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        quantity: 50,
        packs: 6,
        price: 16670,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        quantity: 100,
        packs: 5,
        price: 34250,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        quantity: 100,
        packs: 4,
        price: 34250,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 10,
        packs: 10,
        price: 3200,
        priceDar: 4500,
        priceRegions: 5000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 10,
        packs: 10,
        price: 3200,
        priceDar: 4500,
        priceRegions: 5000,
      },
    ],
    babyDiapers: [
      {
        name: "BABY DIAPER SMALL SIZE [4-8 KG] [S]",
        quantity: 50,
        packs: 8,
        price: 15250,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        quantity: 50,
        packs: 8,
        price: 15750,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 8,
        price: 15750,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        quantity: 50,
        packs: 8,
        price: 15750,
        priceDar: 20000,
        priceRegions: 21000,
      },
    ],
    adultPants: [
      {
        name: "ADULT PANT LARGE HIP SIZE [80-105 CM] [L]",
        quantity: 20,
        packs: 5,
        price: 24400,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        quantity: 20,
        packs: 5,
        price: 24400,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        quantity: 20,
        packs: 5,
        price: 24400,
        priceDar: 29000,
        priceRegions: 30000,
      },
    ],
    babyWipes: [{ name: "BABY WIPES", quantity: 120, packs: 12, price: 3500, priceDar: 4500, priceRegions: 5000 }],
    ladyPads: [{ name: "LADY PAD", quantity: 10, packs: 24, price: 1400, priceDar: 2500, priceRegions: 2500 }],
  },
  groupD: {
    babyPants: [
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 50,
        packs: 6,
        price: 16500,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 6,
        price: 16500,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        quantity: 50,
        packs: 6,
        price: 16500,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        quantity: 50,
        packs: 6,
        price: 16500,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        quantity: 100,
        packs: 5,
        price: 34250,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        quantity: 100,
        packs: 4,
        price: 34250,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 10,
        packs: 10,
        price: 3100,
        priceDar: 4500,
        priceRegions: 5000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 10,
        packs: 10,
        price: 3100,
        priceDar: 4500,
        priceRegions: 5000,
      },
    ],
    babyDiapers: [
      {
        name: "BABY DIAPER SMALL SIZE [4-8 KG] [S]",
        quantity: 50,
        packs: 8,
        price: 15125,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        quantity: 50,
        packs: 8,
        price: 15625,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 8,
        price: 15625,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        quantity: 50,
        packs: 8,
        price: 15625,
        priceDar: 20000,
        priceRegions: 21000,
      },
    ],
    adultPants: [
      {
        name: "ADULT PANT LARGE HIP SIZE [80-105 CM] [L]",
        quantity: 20,
        packs: 5,
        price: 24200,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        quantity: 20,
        packs: 5,
        price: 24200,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        quantity: 20,
        packs: 5,
        price: 24200,
        priceDar: 29000,
        priceRegions: 30000,
      },
    ],
    babyWipes: [{ name: "BABY WIPES", quantity: 120, packs: 12, price: 3500, priceDar: 4500, priceRegions: 5000 }],
    ladyPads: [{ name: "LADY PAD", quantity: 10, packs: 24, price: 1400, priceDar: 2500, priceRegions: 2500 }],
  },
  groupE: {
    babyPants: [
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 50,
        packs: 6,
        price: 16340,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 6,
        price: 16340,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        quantity: 50,
        packs: 6,
        price: 16340,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        quantity: 50,
        packs: 6,
        price: 16340,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        quantity: 100,
        packs: 5,
        price: 34000,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        quantity: 100,
        packs: 4,
        price: 34000,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 10,
        packs: 10,
        price: 3000,
        priceDar: 4500,
        priceRegions: 5000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 10,
        packs: 10,
        price: 3000,
        priceDar: 4500,
        priceRegions: 5000,
      },
    ],
    babyDiapers: [
      {
        name: "BABY DIAPER SMALL SIZE [4-8 KG] [S]",
        quantity: 50,
        packs: 8,
        price: 15000,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
    ],
    adultPants: [
      {
        name: "ADULT PANT LARGE HIP SIZE [80-105 CM] [L]",
        quantity: 20,
        packs: 5,
        price: 24000,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        quantity: 20,
        packs: 5,
        price: 24000,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        quantity: 20,
        packs: 5,
        price: 24000,
        priceDar: 29000,
        priceRegions: 30000,
      },
    ],
    babyWipes: [{ name: "BABY WIPES", quantity: 120, packs: 12, price: 3500, priceDar: 4500, priceRegions: 5000 }],
    ladyPads: [{ name: "LADY PAD", quantity: 10, packs: 24, price: 1400, priceDar: 2500, priceRegions: 2500 }],
  },
  groupF: {
    babyPants: [
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 50,
        packs: 6,
        price: 16170,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 6,
        price: 16170,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        quantity: 50,
        packs: 6,
        price: 16170,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        quantity: 50,
        packs: 6,
        price: 16170,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        quantity: 100,
        packs: 5,
        price: 34000,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        quantity: 100,
        packs: 4,
        price: 34000,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 10,
        packs: 10,
        price: 3000,
        priceDar: 4500,
        priceRegions: 5000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 10,
        packs: 10,
        price: 3000,
        priceDar: 4500,
        priceRegions: 5000,
      },
    ],
    babyDiapers: [
      {
        name: "BABY DIAPER SMALL SIZE [4-8 KG] [S]",
        quantity: 50,
        packs: 8,
        price: 15000,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
    ],
    adultPants: [
      {
        name: "ADULT PANT LARGE HIP SIZE [80-105 CM] [L]",
        quantity: 20,
        packs: 5,
        price: 23800,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        quantity: 20,
        packs: 5,
        price: 23800,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        quantity: 20,
        packs: 5,
        price: 23800,
        priceDar: 29000,
        priceRegions: 30000,
      },
    ],
    babyWipes: [{ name: "BABY WIPES", quantity: 120, packs: 12, price: 3500, priceDar: 4500, priceRegions: 5000 }],
    ladyPads: [{ name: "LADY PAD", quantity: 10, packs: 24, price: 1400, priceDar: 2500, priceRegions: 2500 }],
  },
  groupG: {
    babyPants: [
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 50,
        packs: 6,
        price: 16000,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 6,
        price: 16000,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [12-17 KG] [XL]",
        quantity: 50,
        packs: 6,
        price: 16000,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS XX-LARGE SIZE [≥15 KG] [XX-L]",
        quantity: 50,
        packs: 6,
        price: 16000,
        priceDar: 21000,
        priceRegions: 23000,
      },
      {
        name: "BABY PANTS SMALL SIZE [4-8 KG] [S]",
        quantity: 100,
        packs: 5,
        price: 34000,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS X-LARGE SIZE [13-17 KG] [XL]",
        quantity: 100,
        packs: 4,
        price: 34000,
        priceDar: 41000,
        priceRegions: 45000,
      },
      {
        name: "BABY PANTS MEDIUM SIZE [7-10 KG] [M]",
        quantity: 10,
        packs: 10,
        price: 3000,
        priceDar: 4500,
        priceRegions: 5000,
      },
      {
        name: "BABY PANTS LARGE SIZE [9-14 KG] [L]",
        quantity: 10,
        packs: 10,
        price: 3000,
        priceDar: 4500,
        priceRegions: 5000,
      },
    ],
    babyDiapers: [
      {
        name: "BABY DIAPER SMALL SIZE [4-8 KG] [S]",
        quantity: 50,
        packs: 8,
        price: 15000,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER MEDIUM SIZE [6-11 KG] [M]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER LARGE SIZE [9-14 KG] [L]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
      {
        name: "BABY DIAPER X-LARGE SIZE [12-17 KG]",
        quantity: 50,
        packs: 8,
        price: 15500,
        priceDar: 20000,
        priceRegions: 21000,
      },
    ],
    adultPants: [
      {
        name: "ADULT PANT LARGE HIP SIZE [80-105 CM] [L]",
        quantity: 20,
        packs: 5,
        price: 23600,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT X-LARGE HIP SIZE [95-120 CM] [XL]",
        quantity: 20,
        packs: 5,
        price: 23600,
        priceDar: 29000,
        priceRegions: 30000,
      },
      {
        name: "ADULT PANT XXL HIP SIZE [≥110 CM]",
        quantity: 20,
        packs: 5,
        price: 23600,
        priceDar: 29000,
        priceRegions: 30000,
      },
    ],
    babyWipes: [{ name: "BABY WIPES", quantity: 120, packs: 12, price: 3500, priceDar: 4500, priceRegions: 5000 }],
    ladyPads: [{ name: "LADY PAD", quantity: 10, packs: 24, price: 1400, priceDar: 2500, priceRegions: 2500 }],
  },
}

// Size guide data
const sizeGuideData = {
  babyPants: [
    { size: "S", weight: "4-8 kg" },
    { size: "M", weight: "7-10 kg" },
    { size: "L", weight: "9-14 kg" },
    { size: "XL", weight: "12-17 kg" },
    { size: "XXL", weight: "≥15 kg" },
  ],
  adultPants: [
    { size: "L", hip: "80-105 cm" },
    { size: "XL", hip: "95-120 cm" },
    { size: "XXL", hip: "≥110 cm" },
  ],
}

export default function AgentsPage() {
  const { language } = useLanguage()
  const t = translations[language]

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    payment: "",
  })

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [activeTab, setActiveTab] = useState("groupA")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setShowConfirmation(true)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gradient-to-b from-yammy-light-blue/10 to-yammy-pink/10">
        {/* Hero Section */}
        <section className="py-16 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-20 h-20 bg-yammy-pink/10 rounded-full animate-float-slow"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-yammy-blue/10 rounded-full animate-float-medium"></div>
            <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yammy-orange/10 rounded-full animate-float-fast"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bubblegum text-yammy-blue mb-4"
            >
              {t.title}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-yammy-dark-blue mb-8"
            >
              {t.subtitle}
            </motion.p>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-yammy-orange hover:bg-yammy-orange/90 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all hover:scale-105"
                  >
                    {t.registerButton}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bubblegum text-yammy-blue">{t.formTitle}</DialogTitle>
                    <DialogDescription>{t.registrationFee}</DialogDescription>
                  </DialogHeader>

                  {!showConfirmation ? (
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">{t.formName}</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">{t.formEmail}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">{t.formPhone}</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="payment">{t.formPayment}</Label>
                          <Input
                            id="payment"
                            name="payment"
                            value={formData.payment}
                            onChange={handleInputChange}
                            required
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-yammy-blue hover:bg-yammy-blue/90">
                          {t.formSubmit}
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-green-600 mb-2">{t.confirmationTitle}</h3>
                      <p className="text-gray-600">{t.confirmationMessage}</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bubblegum text-yammy-blue mb-8 text-center"
            >
              {t.benefits}
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div
                variants={itemVariants}
                className="bg-yammy-light-blue/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-yammy-blue/20 rounded-full flex items-center justify-center mb-4">
                  <BadgePercent className="w-6 h-6 text-yammy-blue" />
                </div>
                <h3 className="text-xl font-bold text-yammy-blue mb-2">{t.benefit1}</h3>
                <p className="text-gray-600">{t.benefit1Desc}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-yammy-pink/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-yammy-pink/20 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-yammy-pink" />
                </div>
                <h3 className="text-xl font-bold text-yammy-pink mb-2">{t.benefit2}</h3>
                <p className="text-gray-600">{t.benefit2Desc}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-yammy-orange/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-yammy-orange/20 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-yammy-orange" />
                </div>
                <h3 className="text-xl font-bold text-yammy-orange mb-2">{t.benefit3}</h3>
                <p className="text-gray-600">{t.benefit3Desc}</p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-yammy-light-blue/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-yammy-blue/20 rounded-full flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6 text-yammy-blue" />
                </div>
                <h3 className="text-xl font-bold text-yammy-blue mb-2">{t.benefit4}</h3>
                <p className="text-gray-600">{t.benefit4Desc}</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Instructions Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bubblegum text-yammy-blue mb-8 text-center"
            >
              {t.instructionsTitle}
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-md"
            >
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-10 right-10 w-16 h-16 bg-yammy-pink/5 rounded-full"></div>
                  <div className="absolute bottom-20 left-10 w-20 h-20 bg-yammy-blue/5 rounded-full"></div>
                </div>

                <ol className="space-y-6 relative z-10">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yammy-pink/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Users className="w-5 h-5 text-yammy-pink" />
                    </div>
                    <div>
                      <p className="text-lg">{t.instruction1}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yammy-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <ShoppingBag className="w-5 h-5 text-yammy-blue" />
                    </div>
                    <div>
                      <p className="text-lg">{t.instruction2}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yammy-orange/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Package className="w-5 h-5 text-yammy-orange" />
                    </div>
                    <div>
                      <p className="text-lg">{t.instruction3}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yammy-pink/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Star className="w-5 h-5 text-yammy-pink" />
                    </div>
                    <div>
                      <p className="text-lg">{t.instruction4}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yammy-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Gift className="w-5 h-5 text-yammy-blue" />
                    </div>
                    <div>
                      <p className="text-lg">{t.instruction5}</p>
                    </div>
                  </li>
                </ol>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Size Guide Section */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bubblegum text-yammy-blue mb-8 text-center"
            >
              {t.sizeGuide}
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-yammy-light-blue/10 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-yammy-blue mb-4">{t.babyPants}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-2">Size</th>
                        <th className="text-left py-2">{t.weightRange}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuideData.babyPants.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 font-medium">{item.size}</td>
                          <td className="py-2">{item.weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-yammy-pink/10 rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-yammy-pink mb-4">{t.adultPants}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-2">Size</th>
                        <th className="text-left py-2">{t.hipSize}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuideData.adultPants.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 font-medium">{item.size}</td>
                          <td className="py-2">{item.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bubblegum text-yammy-blue mb-8 text-center"
            >
              {t.pricingTitle}
            </motion.h2>

            <Tabs defaultValue="groupA" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-8 bg-white rounded-xl p-1 shadow-sm">
                <TabsTrigger value="groupA" className="font-medium rounded-lg">
                  A
                </TabsTrigger>
                <TabsTrigger value="groupB" className="font-medium rounded-lg">
                  B
                </TabsTrigger>
                <TabsTrigger value="groupC" className="font-medium rounded-lg">
                  C
                </TabsTrigger>
                <TabsTrigger value="groupD" className="font-medium rounded-lg">
                  D
                </TabsTrigger>
                <TabsTrigger value="groupE" className="font-medium rounded-lg">
                  E
                </TabsTrigger>
                <TabsTrigger value="groupF" className="font-medium rounded-lg">
                  F
                </TabsTrigger>
                <TabsTrigger value="groupG" className="font-medium rounded-lg">
                  G
                </TabsTrigger>
              </TabsList>

              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">
                    {activeTab === "groupA" && t.groupA}
                    {activeTab === "groupB" && t.groupB}
                    {activeTab === "groupC" && t.groupC}
                    {activeTab === "groupD" && t.groupD}
                    {activeTab === "groupE" && t.groupE}
                    {activeTab === "groupF" && t.groupF}
                    {activeTab === "groupG" && (
                      <span className="flex items-center gap-2">
                        {t.groupG} <Sparkles className="w-5 h-5 text-yellow-500" />
                      </span>
                    )}
                  </h3>
                </div>

                <TabsContent value="groupA" className="mt-0">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupA.babyPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyDiapers}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupA.babyDiapers.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-orange flex items-center gap-2">
                        <Users className="w-5 h-5" /> {t.adultPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupA.adultPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.babyWipes}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupA.babyWipes.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.ladyPads}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupA.ladyPads.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="groupG" className="mt-0">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupG.babyPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium text-green-600">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyDiapers}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupG.babyDiapers.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium text-green-600">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-orange flex items-center gap-2">
                        <Users className="w-5 h-5" /> {t.adultPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupG.adultPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium text-green-600">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.babyWipes}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupG.babyWipes.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium text-green-600">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.ladyPads}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupG.ladyPads.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium text-green-600">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="groupB" className="mt-0">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupB.babyPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyDiapers}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupB.babyDiapers.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-orange flex items-center gap-2">
                        <Users className="w-5 h-5" /> {t.adultPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupB.adultPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.babyWipes}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupB.babyWipes.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.ladyPads}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupB.ladyPads.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="groupC" className="mt-0">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupC.babyPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyDiapers}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupC.babyDiapers.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-orange flex items-center gap-2">
                        <Users className="w-5 h-5" /> {t.adultPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupC.adultPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.babyWipes}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupC.babyWipes.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.ladyPads}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupC.ladyPads.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="groupD" className="mt-0">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupD.babyPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyDiapers}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupD.babyDiapers.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-orange flex items-center gap-2">
                        <Users className="w-5 h-5" /> {t.adultPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupD.adultPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.babyWipes}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupD.babyWipes.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.ladyPads}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupD.ladyPads.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="groupE" className="mt-0">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupE.babyPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyDiapers}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupE.babyDiapers.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-orange flex items-center gap-2">
                        <Users className="w-5 h-5" /> {t.adultPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupE.adultPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.babyWipes}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupE.babyWipes.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.ladyPads}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupE.ladyPads.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="groupF" className="mt-0">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupF.babyPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Baby className="w-5 h-5" /> {t.babyDiapers}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupF.babyDiapers.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-orange flex items-center gap-2">
                        <Users className="w-5 h-5" /> {t.adultPants}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupF.adultPants.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-blue flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.babyWipes}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupF.babyWipes.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-3 text-yammy-pink flex items-center gap-2">
                        <Package className="w-5 h-5" /> {t.ladyPads}
                      </h3>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>{t.productName}</TableHead>
                              <TableHead className="text-center">{t.quantityPerPack}</TableHead>
                              <TableHead className="text-center">{t.packsPerCarton}</TableHead>
                              <TableHead className="text-center">{t.agentPrice}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceDar}</TableHead>
                              <TableHead className="text-center">{t.sellingPriceRegions}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pricingData.groupF.ladyPads.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-center">{item.packs}</TableCell>
                                <TableCell className="text-center font-medium">
                                  TZS {item.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-center">TZS {item.priceDar.toLocaleString()}</TableCell>
                                <TableCell className="text-center">TZS {item.priceRegions.toLocaleString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/documents/agent-price-list.pdf"
                  download
                  className="inline-flex items-center gap-2 bg-yammy-blue hover:bg-yammy-blue/90 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  {t.downloadPriceList}
                </Link>
              </div>
            </Tabs>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-yammy-blue/10 to-yammy-pink/10 rounded-2xl p-8 shadow-md"
            >
              <h2 className="text-3xl font-bubblegum text-yammy-blue mb-4 text-center">{t.whyJoin}</h2>
              <p className="text-lg text-center mb-8">{t.whyJoinDesc}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yammy-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-yammy-blue" />
                  </div>
                  <p>Access to wholesale prices across all product categories</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yammy-pink/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-yammy-pink" />
                  </div>
                  <p>Special offers and discounts available only to registered agents</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yammy-blue/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-yammy-blue" />
                  </div>
                  <p>Opportunity to expand your business with high-demand products</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yammy-pink/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-yammy-pink" />
                  </div>
                  <p>Receive complimentary items based on your purchase volume</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-yammy-blue/20 to-yammy-pink/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bubblegum text-yammy-pink mb-6"
            >
              {t.footerCta}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-yammy-orange hover:bg-yammy-orange/90 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all hover:scale-105"
                  >
                    {t.registerButton}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-xl bg-white">
                  {/* Same dialog content as above */}
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bubblegum text-yammy-blue">{t.formTitle}</DialogTitle>
                    <DialogDescription>{t.registrationFee}</DialogDescription>
                  </DialogHeader>

                  {!showConfirmation ? (
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name2">{t.formName}</Label>
                          <Input
                            id="name2"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email2">{t.formEmail}</Label>
                          <Input
                            id="email2"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone2">{t.formPhone}</Label>
                          <Input
                            id="phone2"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="payment2">{t.formPayment}</Label>
                          <Input
                            id="payment2"
                            name="payment"
                            value={formData.payment}
                            onChange={handleInputChange}
                            required
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-yammy-blue hover:bg-yammy-blue/90">
                          {t.formSubmit}
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-green-600 mb-2">{t.confirmationTitle}</h3>
                      <p className="text-gray-600">{t.confirmationMessage}</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-yammy-dark-blue text-white py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bubblegum mb-4">{t.contactUs}</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-yammy-pink" />
                  <span>info@yammyyami.co.tz</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-yammy-pink" />
                  <span>+255 658 181 863</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-yammy-pink" />
                  <span>+255 754 089 447</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bubblegum mb-4">{t.website}</h3>
              <Link href="/" className="text-yammy-pink hover:underline">
                www.yammyyami.co.tz
              </Link>
            </div>

            <div>
              <h3 className="text-xl font-bubblegum mb-4">{t.socialMedia}</h3>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Instagram className="w-5 h-5 text-yammy-pink" />
                </Link>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
            © 2025 Yammy Yami Diaper TZ. All rights reserved.
          </div>
        </footer>
      </main>
    </PageWrapper>
  )
}

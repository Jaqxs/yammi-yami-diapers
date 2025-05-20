import type { Product } from "@/lib/store"

export const mockProducts: Product[] = [
  {
    id: 1,
    name: {
      en: "Premium Baby Diapers",
      sw: "Diapers Bora za Watoto",
    },
    category: "babyDiapers",
    price: 20000,
    wholesalePrice: 16000,
    size: "small",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1024.jpg-94bnV5nZQDqKIH6o41Ex8XXXAC8IUa.jpeg?v=1",
    tags: ["bestSeller", "highAbsorption"],
    weightRange: "4-8kg",
    description: {
      en: "High-quality baby diapers for newborns and small babies with side-tape closure for a secure fit.",
      sw: "Diapers bora za watoto wachanga na watoto wadogo zenye utepe wa pembeni kwa usalama zaidi.",
    },
    stock: 120,
    status: "active",
    featured: true,
  },
  {
    id: 2,
    name: {
      en: "Baby Pull-up Pants",
      sw: "Pants za Watoto",
    },
    category: "babyPants",
    price: 20000,
    wholesalePrice: 17000,
    size: "medium",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1012.jpg-ES0dluaBooNTot5s1D4osLe125JMM4.jpeg?v=1",
    tags: ["japanStandard", "highAbsorption"],
    weightRange: "6-11kg",
    description: {
      en: "Medium-sized pull-up pants designed for active babies who need comfort and mobility.",
      sw: "Pants za ukubwa wa kati zimeundwa kwa watoto wanaocheza wanaohitaji faraja na urahisi wa kutembea.",
    },
    stock: 85,
    status: "active",
  },
  // Product with ID 3 (Baby Pull-up Pants size Large 9-14kg) has been removed
  {
    id: 4,
    name: {
      en: "Baby Pull-up Pants",
      sw: "Pants za Watoto",
    },
    category: "babyPants",
    price: 20000,
    wholesalePrice: 17000,
    size: "extraLarge",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1009.jpg-BIK0Z64A1WCzCs1Id2cgiGSKGHHL2Z.jpeg?v=1",
    tags: ["japanStandard"],
    weightRange: "12-17kg",
    description: {
      en: "Extra-large pull-up pants for bigger toddlers. Maximum absorption and comfort.",
      sw: "Pants za ukubwa mkubwa zaidi kwa watoto wakubwa. Unyonywaji na faraja ya hali ya juu.",
    },
    stock: 42,
    status: "active",
  },
  {
    id: 5,
    name: {
      en: "Adult Pants",
      sw: "Pants za Watu Wazima",
    },
    category: "adultDiapers",
    price: 25000,
    wholesalePrice: 22000,
    size: "large",
    bundleSize: 20,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1022.jpg-ACW4aUFuZSJnBBpx7KHHpriGFYTAgE.jpeg?v=1",
    tags: ["internationalQuality"],
    hipSize: "80-105cm",
    description: {
      en: "Comfortable adult pants for those with mobility issues, incontinence, or post-operation recovery.",
      sw: "Pants za watu wazima zenye faraja kwa wenye matatizo ya kutembea, kukojoa bila kujizuia, au wanaopona baada ya upasuaji.",
    },
    stock: 30,
    status: "active",
    featured: true,
  },
  {
    id: 6,
    name: {
      en: "Baby Wipes",
      sw: "Wipes za Watoto",
    },
    category: "babyDiapers",
    price: 4000,
    wholesalePrice: 3500,
    bundleSize: 120,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1025.jpg-AhNojXnbDx5fyKY8p4xiXzW0sMdXk0.jpeg?v=1",
    tags: ["newArrival"],
    description: {
      en: "Soft and gentle baby wipes for cleaning your baby's delicate skin. Pack of 120 sheets.",
      sw: "Wipes laini na nyororo kwa kusafisha ngozi nyeti ya mtoto wako. Pakiti ya karatasi 120.",
    },
    stock: 200,
    status: "active",
    featured: true,
  },
  {
    id: 7,
    name: {
      en: "Royal Baby Pants with red cup",
      sw: "Pants za Kifalme za Watoto na kikombe chekundu",
    },
    category: "babyPants",
    price: 19000,
    wholesalePrice: 22000,
    size: "large",
    bundleSize: 50,
    image: "/images/yammy-yami-pullup-baby-diaper.jpeg",
    tags: ["bestSeller", "internationalQuality", "highAbsorption", "premiumPackage"],
    weightRange: "12-17kg",
    description: {
      en: "Our highest quality pants with premium absorption and extra softness. Royal quality with a special red cup.",
      sw: "Pants zetu za ubora wa juu zaidi zenye unyonywaji wa hali ya juu na ulaini wa ziada. Ubora wa kifalme na kikombe maalum chekundu.",
    },
    stock: 15,
    status: "low_stock",
  },
  {
    id: 8,
    name: {
      en: "Adult Pants XXL",
      sw: "Pants za Watu Wazima XXL",
    },
    category: "adultDiapers",
    price: 28000,
    wholesalePrice: 25000,
    size: "extraLarge",
    bundleSize: 20,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3E5A1020.jpg-d0BiyLZoj7T35mr3ZDsASJHCNLsn9j.jpeg?v=1",
    tags: ["internationalQuality"],
    hipSize: ">110cm",
    description: {
      en: "Extra-large adult pants for maximum comfort and protection. Ideal for those with mobility issues or incontinence.",
      sw: "Pants kubwa zaidi za watu wazima kwa faraja na ulinzi wa hali ya juu. Nzuri kwa wenye matatizo ya kutembea au kukojoa bila kujizuia.",
    },
    stock: 25,
    status: "active",
  },
  // Product with ID 9 (Baby Diaper XXXL size extraLarge 19kg+) has been removed
]

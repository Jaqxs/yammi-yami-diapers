import type { Product } from "@/lib/store"

export const mockProducts: Product[] = [
  {
    id: 1,
    name: {
      en: "Premium Baby Diapers",
      sw: "Diapers Bora za Watoto",
    },
    category: "babyDiapers",
    price: 18000,
    wholesalePrice: 16000,
    size: "small",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/baby%20diaper.jpg-8TUQ8NXCalui3IondSW0pGQKZezKI1.jpeg",
    tags: ["bestSeller", "highAbsorption"],
    weightRange: "4-8kg",
    description: {
      en: "High-quality baby diapers for newborns and small babies with side-tape closure for a secure fit.",
      sw: "Diapers bora za watoto wachanga na watoto wadogo zenye utepe wa pembeni kwa usalama zaidi.",
    },
    stock: 120,
    status: "active",
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.41_542754ce.jpg-SYaYX5HxpNniNUoMc0trj7485kedRl.jpeg",
    tags: ["japanStandard", "highAbsorption"],
    weightRange: "9-14kg",
    description: {
      en: "Medium-sized pull-up pants designed for active babies who need comfort and mobility.",
      sw: "Pants za ukubwa wa kati zimeundwa kwa watoto wanaocheza wanaohitaji faraja na urahisi wa kutembea.",
    },
    stock: 85,
    status: "active",
  },
  {
    id: 3,
    name: {
      en: "Baby Pull-up Pants",
      sw: "Pants za Watoto",
    },
    category: "babyPants",
    price: 20000,
    wholesalePrice: 17000,
    size: "large",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.43_dd271f0f.jpg-EYQ4FIQyCghuaa0E0kwbpKWsBDNaPZ.jpeg",
    tags: ["bestSeller", "highAbsorption"],
    weightRange: "12-17kg",
    description: {
      en: "Large-sized pull-up pants for growing toddlers. Easy to put on and take off.",
      sw: "Pants za ukubwa mkubwa kwa watoto wanaokua. Rahisi kuvaa na kuvua.",
    },
    stock: 65,
    status: "active",
  },
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.43_3881eb83.jpg-ZdF7ILkVtnX1FsSUkScmxFA9hZhGVe.jpeg",
    tags: ["japanStandard"],
    weightRange: ">15kg",
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adult%20pants.jpg-eYvgmKtmGCITzb488aMf7pcNvB16Y2.jpeg",
    tags: ["internationalQuality"],
    hipSize: "80-105cm",
    description: {
      en: "Comfortable adult pants for those with mobility issues, incontinence, or post-operation recovery.",
      sw: "Pants za watu wazima zenye faraja kwa wenye matatizo ya kutembea, kukojoa bila kujizuia, au wanaopona baada ya upasuaji.",
    },
    stock: 30,
    status: "active",
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.35_9bc82b01.jpg-UGTLfNsjPhFwjcUEg1g1UZu7SxWXrS.jpeg",
    tags: ["newArrival"],
    description: {
      en: "Soft and gentle baby wipes for cleaning your baby's delicate skin. Pack of 120 sheets.",
      sw: "Wipes laini na nyororo kwa kusafisha ngozi nyeti ya mtoto wako. Pakiti ya karatasi 120.",
    },
    stock: 200,
    status: "active",
  },
  {
    id: 7,
    name: {
      en: "Premium Royal Baby Pants",
      sw: "Pants Bora za Kifalme za Watoto",
    },
    category: "babyPants",
    price: 22000,
    wholesalePrice: 19000,
    size: "large",
    bundleSize: 50,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.41_542754ce.jpg-SYaYX5HxpNniNUoMc0trj7485kedRl.jpeg",
    tags: ["bestSeller", "internationalQuality", "highAbsorption"],
    weightRange: "9-14kg",
    description: {
      en: "Our highest quality pants with premium absorption and extra softness. Royal quality.",
      sw: "Pants zetu za ubora wa juu zaidi zenye unyonywaji wa hali ya juu na ulaini wa ziada. Ubora wa kifalme.",
    },
    stock: 15,
    status: "low_stock",
  },
  {
    id: 8,
    name: {
      en: "Wholesale Carton - Baby Pants",
      sw: "Kartoni ya Jumla - Pants za Watoto",
    },
    category: "babyPants",
    price: 103000,
    isCarton: true,
    size: "medium",
    cartonSize: "50pcs x 6 packs",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.33_052ce928.jpg-JNRalaEhieJuq7sRcGf2ZHIm0Erups.jpeg",
    tags: ["wholesale", "internationalQuality"],
    description: {
      en: "Wholesale carton containing 6 packs of 50 medium-sized baby pants each. Great value for retailers.",
      sw: "Kartoni ya jumla yenye pakiti 6 za pants 50 za watoto, ukubwa wa kati. Thamani kubwa kwa wafanyabiashara.",
    },
    stock: 8,
    status: "active",
  },
]

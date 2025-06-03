"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, Tag, Info, Package, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"
import { useCart } from "@/components/cart-provider"

// Language translations
const translations = {
  en: {
    pageTitle: "Pricing",
    introTitle: "High-Quality Products at Affordable Prices",
    introText:
      "Karibu Sana! Discover premium baby and adult care products at unbeatable prices. Our products are twice as cost-effective as typical market offerings while maintaining international quality standards.",
    wholesaleTitle: "Wholesale Prices (Dar es Salaam - Kariakoo)",
    wholesalePerPieceTitle: "Per-Piece Wholesale Pricing",
    wholesalePerCartonTitle: "Per-Carton Wholesale Pricing",
    retailTitle: "Retail Prices",
    retailDarTitle: "Dar es Salaam (Kariakoo)",
    retailOtherTitle: "Other Regions (Outside Dar es Salaam)",
    product: "Product",
    price: "Price",
    minOrder: "Min. Order",
    sizes: "Sizes",
    perPiece: "Per Piece",
    perCarton: "Per Carton",
    babyDiapers: "Baby Diapers",
    babyPants: "Baby Pants",
    adultPants: "Adult Pants",
    babyWipes: "Baby Wipes",
    pcs: "pcs",
    bundles: "bundles",
    carton: "carton",
    box: "box",
    goodQuality: "good quality",
    bestQuality: "best quality",
    royalQuality: "royal quality",
    standardQuality: "standard quality",
    premiumQuality: "premium quality",
    outlineText: "All prices listed in Tanzanian Shillings (TZS)",
    note: "Note:",
    wholesaleNote: "Wholesale prices apply exclusively in Kariakoo.",
    closingMessage: "Yammy Yami - Love Your Baby, Love Your Family.",
    callToAction: "Visit us in Kariakoo for the best deals on premium baby and adult care products!",
    qualityMessage: "We are committed to providing high-quality, affordable products for Tanzanian families.",
    visitLocations: "Visit Our Locations",
    contactUs: "Contact Us for Bulk Orders",
    sideNote: "Quality care at affordable prices",
    compareTitle: "Compare & Save",
    compareText: "Yammy Yami products offer twice the value of typical market products at the same price point.",
    qualityAssured: "Quality Assured",
    qualityAssuredText: "All our products meet international quality standards for comfort and performance.",
    familyFirst: "Family First",
    familyFirstText: "Designed with the entire family in mind, from newborns to adults.",
  },
  sw: {
    pageTitle: "Bei",
    introTitle: "Bidhaa Bora kwa Bei Nafuu",
    introText:
      "Karibu Sana! Gundua bidhaa bora za watoto na watu wazima kwa bei isiyoshindika. Bidhaa zetu ni mara mbili ya gharama nafuu kuliko bidhaa za kawaida za soko huku zikidumisha viwango vya kimataifa.",
    wholesaleTitle: "Bei za Jumla (Dar es Salaam - Kariakoo)",
    wholesalePerPieceTitle: "Bei za Jumla kwa Kipande",
    wholesalePerCartonTitle: "Bei za Jumla kwa Kartoni",
    retailTitle: "Bei za Rejareja",
    retailDarTitle: "Dar es Salaam (Kariakoo)",
    retailOtherTitle: "Mikoa Mingine (Nje ya Dar es Salaam)",
    product: "Bidhaa",
    price: "Bei",
    minOrder: "Oda Ndogo",
    sizes: "Ukubwa",
    perPiece: "Kwa Kipande",
    perCarton: "Kwa Kartoni",
    babyDiapers: "Diapers za Watoto",
    babyPants: "Pants za Watoto",
    adultPants: "Pants za Watu Wazima",
    babyWipes: "Wipes za Watoto",
    pcs: "vipande",
    bundles: "mifuko",
    carton: "kartoni",
    box: "boksi",
    goodQuality: "ubora mzuri",
    bestQuality: "ubora bora",
    royalQuality: "ubora wa kifalme",
    standardQuality: "ubora wa kawaida",
    premiumQuality: "ubora wa juu",
    outlineText: "Bei zote zimeandikwa kwa Shilingi za Tanzania (TZS)",
    note: "Kumbuka:",
    wholesaleNote: "Bei za jumla zinatumika tu Kariakoo.",
    closingMessage: "Yammy Yami - Penda Mtoto Wako, Penda Familia Yako.",
    callToAction: "Tembelea Kariakoo kwa bidhaa bora za uangalizi wa watoto na watu wazima!",
    qualityMessage: "Tumejitolea kutoa bidhaa bora na za bei nafuu kwa familia za Tanzania.",
    visitLocations: "Tembelea Maeneo Yetu",
    contactUs: "Wasiliana Nasi kwa Oda Kubwa",
    sideNote: "Utunzaji bora kwa bei nafuu",
    compareTitle: "Linganisha & Okoa",
    compareText: "Bidhaa za Yammy Yami zinatoa thamani mara mbili ya bidhaa za kawaida za soko kwa bei sawa.",
    qualityAssured: "Ubora Uliohakikishwa",
    qualityAssuredText: "Bidhaa zetu zote zinakidhi viwango vya kimataifa vya starehe na utendaji.",
    familyFirst: "Familia Kwanza",
    familyFirstText: "Zimebuniwa kwa kuzingatia familia nzima, kuanzia watoto wachanga hadi watu wazima.",
  },
}

export default function PricingPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const [activeTab, setActiveTab] = useState("wholesale")
  const { addItem } = useCart()

  // Format price function
  const formatPrice = (price: number) => {
    return `TZS ${price.toLocaleString()}`
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bubblegum text-center mb-4 text-yammy-dark-blue">{t.pageTitle}</h1>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-2xl font-bubblegum text-yammy-blue mb-4">{t.introTitle}</h2>
          <p className="text-gray-700">{t.introText}</p>
        </motion.div>

        {/* Price tag side note */}
        <div className="fixed right-4 top-28 z-10 hidden lg:block">
          <div className="bg-yammy-pink text-white p-3 rounded-lg shadow-lg transform rotate-6 max-w-[180px]">
            <Tag className="h-5 w-5 mb-1" />
            <p className="text-sm font-bold">{t.sideNote}</p>
          </div>
        </div>

        {/* Tabs for Wholesale and Retail */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger
              value="wholesale"
              className="font-bubblegum data-[state=active]:bg-yammy-blue data-[state=active]:text-white text-lg"
            >
              {t.wholesaleTitle}
            </TabsTrigger>
            <TabsTrigger
              value="retail"
              className="font-bubblegum data-[state=active]:bg-yammy-blue data-[state=active]:text-white text-lg"
            >
              {t.retailTitle}
            </TabsTrigger>
          </TabsList>

          {/* Wholesale Content */}
          <TabsContent value="wholesale" className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-yammy-blue/10">
              <h3 className="text-xl font-bubblegum text-yammy-dark-blue mb-6">{t.wholesalePerPieceTitle}</h3>

              <Table>
                <TableCaption>{t.wholesaleNote}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t.product}</TableHead>
                    <TableHead>{t.price}</TableHead>
                    <TableHead>{t.minOrder}</TableHead>
                    <TableHead>{t.sizes}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyDiapers}</TableCell>
                    <TableCell>
                      {formatPrice(16000)} / 50 {t.pcs}
                    </TableCell>
                    <TableCell>8 {t.bundles}</TableCell>
                    <TableCell>S, M, L, XL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyPants}</TableCell>
                    <TableCell>
                      {formatPrice(17000)} / 50 {t.pcs}
                    </TableCell>
                    <TableCell>6 {t.bundles}</TableCell>
                    <TableCell>S, M, L, XL, XXL, XXXL, XXXXL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.adultPants}</TableCell>
                    <TableCell>
                      {formatPrice(22000)} / 20 {t.pcs}
                    </TableCell>
                    <TableCell>5 {t.bundles}</TableCell>
                    <TableCell>L, XL, XXL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyWipes}</TableCell>
                    <TableCell>
                      {formatPrice(3500)} / 120 {t.pcs}
                    </TableCell>
                    <TableCell>12 {t.bundles}</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-yammy-blue/10">
              <h3 className="text-xl font-bubblegum text-yammy-dark-blue mb-6">{t.wholesalePerCartonTitle}</h3>

              <Table>
                <TableCaption>{t.outlineText}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t.product}</TableHead>
                    <TableHead>{t.price}</TableHead>
                    <TableHead>{t.sizes}</TableHead>
                    <TableHead>Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyPants} (50/6)</TableCell>
                    <TableCell>
                      {formatPrice(103000)} / {t.carton}
                    </TableCell>
                    <TableCell>M, L, XL, XXL</TableCell>
                    <TableCell>{t.goodQuality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyPants} (50/6)</TableCell>
                    <TableCell>
                      {formatPrice(105000)} / {t.carton}
                    </TableCell>
                    <TableCell>3XL, 4XL, 5XL</TableCell>
                    <TableCell>{t.goodQuality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyPants} (50/6)</TableCell>
                    <TableCell>
                      {formatPrice(114000)} / {t.carton}
                    </TableCell>
                    <TableCell>L</TableCell>
                    <TableCell>
                      {t.bestQuality}, {t.royalQuality}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyDiapers} (50/8)</TableCell>
                    <TableCell>
                      {formatPrice(124000)} / {t.carton}
                    </TableCell>
                    <TableCell>S/Newborn</TableCell>
                    <TableCell>{t.goodQuality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyDiapers} (50/8)</TableCell>
                    <TableCell>
                      {formatPrice(128000)} / {t.carton}
                    </TableCell>
                    <TableCell>M, L, XL</TableCell>
                    <TableCell>{t.goodQuality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyWipes} (120/12)</TableCell>
                    <TableCell>
                      {formatPrice(42000)} / {t.box}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{t.goodQuality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.adultPants} (20/5)</TableCell>
                    <TableCell>
                      {formatPrice(110000)} / {t.carton}
                    </TableCell>
                    <TableCell>L, XL, XXL</TableCell>
                    <TableCell>{t.goodQuality}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <p className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700">
              <strong>{t.note}</strong> {t.wholesaleNote}
            </p>
          </TabsContent>

          {/* Retail Content */}
          <TabsContent value="retail" className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-yammy-blue/10">
              <h3 className="text-xl font-bubblegum text-yammy-dark-blue mb-6">{t.retailDarTitle}</h3>

              <Table>
                <TableCaption>{t.outlineText}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t.product}</TableHead>
                    <TableHead>{t.price}</TableHead>
                    <TableHead>{t.sizes}</TableHead>
                    <TableHead>Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyDiapers}</TableCell>
                    <TableCell>
                      {formatPrice(18000)} / 50 {t.pcs}
                    </TableCell>
                    <TableCell>Newborn - S</TableCell>
                    <TableCell>side-tape diapers</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      {t.babyDiapers} & {t.babyPants}
                    </TableCell>
                    <TableCell>
                      {formatPrice(20000)} / 50 {t.pcs}
                    </TableCell>
                    <TableCell>M, L, XL, XXL, 3XL, 4XL, 5XL</TableCell>
                    <TableCell>{t.standardQuality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Premium Package</TableCell>
                    <TableCell>
                      {formatPrice(22000)} / 50 {t.pcs}
                    </TableCell>
                    <TableCell>L size</TableCell>
                    <TableCell>{t.royalQuality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.adultPants}</TableCell>
                    <TableCell>
                      {formatPrice(25000)} / 20 {t.pcs}
                    </TableCell>
                    <TableCell>L, XL, XXL</TableCell>
                    <TableCell>{t.premiumQuality}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t.babyWipes}</TableCell>
                    <TableCell>
                      {formatPrice(4000)} / 120 {t.pcs}
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>standard pack</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-yammy-blue/10">
              <h3 className="text-xl font-bubblegum text-yammy-dark-blue mb-6">{t.retailOtherTitle}</h3>

              <Table>
                <TableCaption>{t.outlineText}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">{t.product}</TableHead>
                    <TableHead>{t.price}</TableHead>
                    <TableHead colSpan={2}>Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {t.babyDiapers} & {t.babyPants}
                    </TableCell>
                    <TableCell>
                      {formatPrice(23000)} - {formatPrice(24000)} / 50 {t.pcs}
                    </TableCell>
                    <TableCell colSpan={2}>Price varies by region and retailer</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Showcase */}
        <div className="mb-12">
          <h3 className="text-2xl font-bubblegum text-yammy-dark-blue text-center mb-8">
            {language === "en" ? "Our Premium Products" : "Bidhaa Zetu Bora"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div whileHover={{ y: -10 }} className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="relative h-64 bg-yammy-light-blue">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/baby%20diaper.jpg-8TUQ8NXCalui3IondSW0pGQKZezKI1.jpeg"
                  alt="Baby Diaper S Size"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bubblegum text-yammy-dark-blue text-lg">
                  {language === "en" ? "Baby Diapers - Size S" : "Diapers za Watoto - Ukubwa S"}
                </h4>
                <p className="text-gray-600 text-sm mb-2">4-8kg, 50 pcs</p>
                <p className="text-yammy-blue font-bold mb-3">{formatPrice(18000)}</p>
                <Button
                  size="sm"
                  className="w-full bg-yammy-blue hover:bg-yammy-dark-blue"
                  onClick={() =>
                    addItem({
                      id: 101,
                      name: {
                        en: "Baby Diapers - Size S",
                        sw: "Diapers za Watoto - Ukubwa S",
                      },
                      price: 18000,
                      quantity: 1,
                      image:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/baby%20diaper.jpg-8TUQ8NXCalui3IondSW0pGQKZezKI1.jpeg",
                      size: "S",
                      bundleSize: 50,
                    })
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {language === "en" ? "Order Now" : "Agiza Sasa"}
                </Button>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="relative h-64 bg-yammy-light-blue">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.41_542754ce.jpg-SYaYX5HxpNniNUoMc0trj7485kedRl.jpeg"
                  alt="Baby Pants L Size"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bubblegum text-yammy-dark-blue text-lg">
                  {language === "en" ? "Baby Pants - Size L" : "Pants za Watoto - Ukubwa L"}
                </h4>
                <p className="text-gray-600 text-sm mb-2">9-14kg, 50 pcs</p>
                <p className="text-yammy-blue font-bold mb-3">{formatPrice(20000)}</p>
                <Button
                  size="sm"
                  className="w-full bg-yammy-blue hover:bg-yammy-dark-blue"
                  onClick={() =>
                    addItem({
                      id: 102,
                      name: {
                        en: "Baby Pants - Size L",
                        sw: "Pants za Watoto - Ukubwa L",
                      },
                      price: 20000,
                      quantity: 1,
                      image:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.41_542754ce.jpg-SYaYX5HxpNniNUoMc0trj7485kedRl.jpeg",
                      size: "L",
                      bundleSize: 50,
                    })
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {language === "en" ? "Order Now" : "Agiza Sasa"}
                </Button>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="relative h-64 bg-yammy-light-blue">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.43_dd271f0f.jpg-EYQ4FIQyCghuaa0E0kwbpKWsBDNaPZ.jpeg"
                  alt="Baby Pants XL Size"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bubblegum text-yammy-dark-blue text-lg">
                  {language === "en" ? "Baby Pants - Size XL" : "Pants za Watoto - Ukubwa XL"}
                </h4>
                <p className="text-gray-600 text-sm mb-2">12-17kg, 50 pcs</p>
                <p className="text-yammy-blue font-bold mb-3">{formatPrice(20000)}</p>
                <Button
                  size="sm"
                  className="w-full bg-yammy-blue hover:bg-yammy-dark-blue"
                  onClick={() =>
                    addItem({
                      id: 103,
                      name: {
                        en: "Baby Pants - Size XL",
                        sw: "Pants za Watoto - Ukubwa XL",
                      },
                      price: 20000,
                      quantity: 1,
                      image:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-19%20at%2015.34.43_dd271f0f.jpg-EYQ4FIQyCghuaa0E0kwbpKWsBDNaPZ.jpeg",
                      size: "XL",
                      bundleSize: 50,
                    })
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {language === "en" ? "Order Now" : "Agiza Sasa"}
                </Button>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="relative h-64 bg-yammy-light-blue">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adult%20pants.jpg-eYvgmKtmGCITzb488aMf7pcNvB16Y2.jpeg"
                  alt="Adult Pants L Size"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-4">
                <h4 className="font-bubblegum text-yammy-dark-blue text-lg">
                  {language === "en" ? "Adult Pants - Size L" : "Pants za Watu Wazima - Ukubwa L"}
                </h4>
                <p className="text-gray-600 text-sm mb-2">80-105cm, 20 pcs</p>
                <p className="text-yammy-blue font-bold mb-3">{formatPrice(25000)}</p>
                <Button
                  size="sm"
                  className="w-full bg-yammy-blue hover:bg-yammy-dark-blue"
                  onClick={() =>
                    addItem({
                      id: 104,
                      name: {
                        en: "Adult Pants - Size L",
                        sw: "Pants za Watu Wazima - Ukubwa L",
                      },
                      price: 25000,
                      quantity: 1,
                      image:
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/adult%20pants.jpg-eYvgmKtmGCITzb488aMf7pcNvB16Y2.jpeg",
                      size: "L",
                      bundleSize: 20,
                    })
                  }
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {language === "en" ? "Order Now" : "Agiza Sasa"}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-yammy-light-blue rounded-full w-12 h-12 flex items-center justify-center mb-2">
                  <Package className="h-6 w-6 text-yammy-blue" />
                </div>
                <CardTitle className="font-bubblegum text-yammy-dark-blue">{t.compareTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.compareText}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="bg-yammy-light-blue rounded-full w-12 h-12 flex items-center justify-center mb-2">
                  <Info className="h-6 w-6 text-yammy-blue" />
                </div>
                <CardTitle className="font-bubblegum text-yammy-dark-blue">{t.qualityAssured}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.qualityAssuredText}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="bg-yammy-light-blue rounded-full w-12 h-12 flex items-center justify-center mb-2">
                  <Truck className="h-6 w-6 text-yammy-blue" />
                </div>
                <CardTitle className="font-bubblegum text-yammy-dark-blue">{t.familyFirst}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.familyFirstText}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-yammy-blue text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bubblegum mb-4">{t.closingMessage}</h3>
          <p className="mb-6">{t.callToAction}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">{t.contactUs}</Link>
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-yammy-blue"
              size="lg"
              asChild
            >
              <Link href="/about">{t.visitLocations}</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

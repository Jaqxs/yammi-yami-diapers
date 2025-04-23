"use client"
import Image from "next/image"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"

// Language translations
const translations = {
  en: {
    aboutUs: "About Us",
    ourStory: "Our Story",
    storyContent:
      "Yammy Yami Diaper TZ was founded with a simple mission: to provide high-quality, affordable diapers for all family members. Based in Kariakoo/Mkunguni and Sukuma, Tanzania, we've grown from a small family business to a trusted provider of baby diapers, lady pads, and adult diapers across Tanzania.",
    ourMission: "Our Mission",
    missionContent:
      "We believe that every family deserves access to comfortable, reliable, and affordable hygiene products. Our mission is to enhance the quality of life for Tanzanian families by providing premium diapers and pads that meet the highest standards of comfort and protection.",
    ourValues: "Our Values",
    qualityTitle: "Quality",
    qualityContent:
      "We source the finest materials and employ rigorous quality control to ensure our products meet international standards.",
    affordabilityTitle: "Affordability",
    affordabilityContent:
      "We believe quality shouldn't come at a premium price. Our products are priced to be accessible to all Tanzanian families.",
    familyTitle: "Family-Focused",
    familyContent:
      "Everything we do is centered around the needs of families, from product design to customer service.",
    tanzanianTitle: "Tanzanian Pride",
    tanzanianContent:
      "We're proud to be a Tanzanian company serving Tanzanian families with products that reflect our cultural values.",
    locations: "Our Locations",
    kariakooTitle: "Kariakoo/Mkunguni",
    kariakooAddress: "Kariakoo Market, Dar es Salaam",
    sukumaTitle: "Sukuma",
    sukumaAddress: "Sukuma Street, Dar es Salaam",
    contactUs: "Contact Us",
    phoneNumber1: "+255 658 181 863",
    phoneNumber2: "+255 754 089 447",
    emailUs: "Email Us",
    visitUs: "Visit Us",
  },
  sw: {
    aboutUs: "Kuhusu Sisi",
    ourStory: "Historia Yetu",
    storyContent:
      "Yammy Yami Diaper TZ ilianzishwa na dhamira rahisi: kutoa diapers bora na za bei nafuu kwa wanafamilia wote. Tukiwa na ofisi Kariakoo/Mkunguni na Sukuma, Tanzania, tumekua kutoka biashara ndogo ya familia hadi mtoa huduma anayeaminika wa diapers za watoto, pedi za wanawake, na diapers za watu wazima katika Tanzania nzima.",
    ourMission: "Dhamira Yetu",
    missionContent:
      "Tunaamini kuwa kila familia inastahili kupata bidhaa za usafi zinazofaa, za kuaminika, na za bei nafuu. Dhamira yetu ni kuboresha ubora wa maisha kwa familia za Kitanzania kwa kutoa diapers na pedi bora zinazokidhi viwango vya juu vya faraja na ulinzi.",
    ourValues: "Maadili Yetu",
    qualityTitle: "Ubora",
    qualityContent:
      "Tunatumia vifaa bora na tunatumia udhibiti wa ubora mkali kuhakikisha bidhaa zetu zinakidhi viwango vya kimataifa.",
    affordabilityTitle: "Bei Nafuu",
    affordabilityContent:
      "Tunaamini ubora haupaswi kuja kwa bei ya juu. Bidhaa zetu zina bei inayofikika kwa familia zote za Kitanzania.",
    familyTitle: "Kulenga Familia",
    familyContent:
      "Kila tunachofanya kinazingatia mahitaji ya familia, kuanzia ubunifu wa bidhaa hadi huduma kwa wateja.",
    tanzanianTitle: "Fahari ya Kitanzania",
    tanzanianContent:
      "Tunajivunia kuwa kampuni ya Kitanzania inayohudumia familia za Kitanzania kwa bidhaa zinazoakisi maadili yetu ya kitamaduni.",
    locations: "Maeneo Yetu",
    kariakooTitle: "Kariakoo/Mkunguni",
    kariakooAddress: "Soko la Kariakoo, Dar es Salaam",
    sukumaTitle: "Sukuma",
    sukumaAddress: "Mtaa wa Sukuma, Dar es Salaam",
    contactUs: "Wasiliana Nasi",
    phoneNumber1: "+255 658 181 863",
    phoneNumber2: "+255 754 089 447",
    emailUs: "Tuma Barua Pepe",
    visitUs: "Tembelea",
  },
}

export default function AboutPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">{t.aboutUs}</h1>

        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold mb-6">{t.ourStory}</h2>
            <p className="text-gray-600 mb-6">{t.storyContent}</p>
            <h3 className="text-2xl font-bold mb-4">{t.ourMission}</h3>
            <p className="text-gray-600">{t.missionContent}</p>
          </motion.div>
          <motion.div
            className="relative h-80 rounded-xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image src="/images/mother-with-baby.png" alt="Yammy Yami Diaper TZ team" fill className="object-cover" />
          </motion.div>
        </div>

        {/* Our Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">{t.ourValues}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: t.qualityTitle, content: t.qualityContent, icon: "✨", color: "from-pink-500 to-pink-300" },
              {
                title: t.affordabilityTitle,
                content: t.affordabilityContent,
                icon: "💰",
                color: "from-blue-500 to-blue-300",
              },
              {
                title: t.familyTitle,
                content: t.familyContent,
                icon: "👨‍👩‍👧‍👦",
                color: "from-purple-500 to-purple-300",
              },
              {
                title: t.tanzanianTitle,
                content: t.tanzanianContent,
                icon: "🇹🇿",
                color: "from-green-500 to-green-300",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full">
                  <CardHeader className={`bg-gradient-to-r ${value.color} text-white`}>
                    <div className="text-4xl mb-2">{value.icon}</div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-gray-600">{value.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Brand Ambassadors Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            {language === "en" ? "Our Brand Ambassadors" : "Mabalozi Wetu wa Bidhaa"}
          </h2>

          <div className="max-w-3xl mx-auto text-center mb-10">
            <p className="text-gray-600">
              {language === "en"
                ? "We're proud to partner with these amazing individuals who represent our brand values and help us connect with families across Tanzania. Our ambassadors are passionate about quality, comfort, and family care."
                : "Tunajivunia kushirikiana na watu hawa wa ajabu ambao wanawakilisha maadili yetu ya biashara na kutusaidia kuunganisha na familia kote Tanzania. Mabalozi wetu wana shauku juu ya ubora, faraja, na utunzaji wa familia."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[2, 3, 4, 7, 9, 10].map((num) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (num % 6) }}
                className="bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={`/images/ambassador-${num}.png`}
                    alt={`Yammy Yami Brand Ambassador ${num}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 bg-yammy-light-blue">
                  <h3 className="font-bold text-yammy-dark-blue text-lg text-center">
                    {language === "en" ? "Brand Ambassador" : "Balozi wa Bidhaa"}
                  </h3>
                  <p className="text-center text-yammy-blue">
                    {language === "en" ? "Yammy Yami Diaper TZ" : "Yammy Yami Diaper TZ"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              {language === "en"
                ? "Interested in becoming a Yammy Yami brand ambassador? Contact us to learn more about partnership opportunities."
                : "Una nia ya kuwa balozi wa bidhaa za Yammy Yami? Wasiliana nasi kujifunza zaidi kuhusu fursa za ushirikiano."}
            </p>
            <Button className="bg-yammy-blue hover:bg-yammy-dark-blue text-white">
              {language === "en" ? "Contact Us" : "Wasiliana Nasi"}
            </Button>
          </div>
        </div>

        {/* Locations Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">{t.locations}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t.kariakooTitle}</CardTitle>
                  <CardDescription>{t.kariakooAddress}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    <Image src="/images/model-with-diapers.png" alt="Kariakoo location" fill className="object-cover" />
                  </div>
                  <Button className="mt-4 w-full">{t.visitUs}</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t.sukumaTitle}</CardTitle>
                  <CardDescription>{t.sukumaAddress}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    <Image src="/images/baby-with-products.png" alt="Sukuma location" fill className="object-cover" />
                  </div>
                  <Button className="mt-4 w-full">{t.visitUs}</Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-10">{t.contactUs}</h2>
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-9.5h-2v5h2v-5z" />
                    </svg>
                    {t.phoneNumber1}
                  </Button>
                  <Button className="w-full bg-green-500 hover:bg-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 mr-2"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm1-9.5h-2v5h2v-5z" />
                    </svg>
                    {t.phoneNumber2}
                  </Button>
                  <Button className="w-full" variant="outline">
                    {t.emailUs}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

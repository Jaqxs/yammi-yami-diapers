"use client"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ChevronRight,
  Quote,
  MapPin,
  Phone,
  Mail,
  Users,
  Heart,
  Shield,
  TrendingUp,
  ShoppingBag,
  Award,
} from "lucide-react"
import CountUp from "@/components/count-up"

import { Button } from "@/components/ui/button"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"
import ImageSlider from "@/components/image-slider"

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
    brandAmbassadors: "Our Brand Ambassador",
    brandInfluencers: "Our Brand Influencer",
    ambassadorsDescription:
      "We're proud to partner with these amazing individuals who represent our brand values and help us connect with families across Tanzania. Our ambassador is passionate about quality, comfort, and family care.",
    influencersDescription:
      "Our influencer helps spread the word about Yammy Yami products across Tanzania. They share their authentic experiences with our products and help us reach new customers.",
    brandAmbassador: "Brand Ambassador",
    brandInfluencer: "Brand Influencer",
    ambassadorInterest:
      "Interested in becoming a Yammy Yami brand ambassador? Contact us to learn more about partnership opportunities.",
    influencerInterest:
      "Want to collaborate with us as an influencer? We're always looking for authentic voices to share our products.",
    leadershipTeam: "Our Leadership Team",
    leadershipDescription:
      "Meet the dedicated professionals leading Yammy Yami Diaper TZ. Our leadership team brings together decades of experience and a shared passion for improving family care across Tanzania.",
    ourJourney: "Our Journey",
    founded: "Founded",
    expansion: "Expansion",
    nationwide: "Nationwide",
    international: "International",
    foundedDesc:
      "Yammy Yami Diaper TZ was established in Dar es Salaam with a vision to provide quality hygiene products.",
    expansionDesc: "Expanded operations to multiple locations in Dar es Salaam and increased product range.",
    nationwideDesc: "Achieved nationwide distribution across Tanzania with a network of dedicated agents.",
    internationalDesc: "Looking forward to expanding to neighboring East African countries.",
    testimonials: "What People Say",
    testimonial1:
      "Yammy Yami diapers have been a game-changer for my family. The quality is excellent and the price is affordable.",
    testimonial2:
      "As a brand ambassador, I'm proud to represent Yammy Yami. Their commitment to quality and community is unmatched.",
    testimonial3:
      "The team at Yammy Yami truly understands the needs of Tanzanian families. Their products are reliable and comfortable.",
    meetOurTeam: "Meet Our Team",
    ourCommunity: "Our Community",
    communityDesc:
      "At Yammy Yami, we believe in giving back to the communities we serve. Through various initiatives, we support local families and contribute to community development.",
    joinUs: "Join Our Community",
    ourProducts: "Our Products",
    babyDiapers: "Baby Diapers",
    ladyPads: "Lady Pads",
    adultDiapers: "Adult Diapers",
    productDesc:
      "We offer a comprehensive range of hygiene products designed to meet the needs of every family member.",
    ourAmbassadors: "Our Brand Representatives",
    ambassadorQuote: "I'm proud to represent a brand that truly cares about Tanzanian families.",
    becomeAmbassador: "Become an Ambassador",
    becomeInfluencer: "Become an Influencer",
    ourAgents: "Our Agents",
    becomeAgent: "Become an Agent",
    agentDesc:
      "Our network of dedicated agents helps us reach families across Tanzania. Join our team and be part of our success story.",
    ourHistory: "Our History",
    historyDesc:
      "From humble beginnings to becoming a trusted household name, our journey has been driven by a commitment to quality and affordability.",
    readMore: "Read More",
    ambassadorName: "Nasma Hassan",
    influencerName: "Evanche Dange",
    ourAchievements: "Our Achievements",
    achievementsDesc:
      "Since our founding in 2018, Yammy Yami has grown to become a trusted household name across Tanzania.",
    happyCustomers: "Happy Customers",
    regionsServed: "Regions Served",
    productTypes: "Product Types",
    yearsOfExcellence: "Years of Excellence",
    ourGrowth: "Our Growth Journey",
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
    brandAmbassadors: "Balozi Wetu wa Bidhaa",
    brandInfluencers: "Mshawishi Wetu wa Bidhaa",
    ambassadorsDescription:
      "Tunajivunia kushirikiana na watu hawa wa ajabu ambao wanawakilisha maadili yetu ya biashara na kutusaidia kuunganisha na familia kote Tanzania. Balozi wetu ana shauku juu ya ubora, faraja, na utunzaji wa familia.",
    influencersDescription:
      "Mshawishi wetu husaidia kueneza habari kuhusu bidhaa za Yammy Yami kote Tanzania. Wanashiriki uzoefu wao halisi na bidhaa zetu na kutusaidia kufikia wateja wapya.",
    brandAmbassador: "Brand Ambassador",
    brandInfluencer: "Mshawishi wa Bidhaa",
    ambassadorInterest:
      "Una nia ya kuwa balozi wa bidhaa za Yammy Yami? Wasiliana nasi kujifunza zaidi kuhusu fursa za ushirikiano.",
    influencerInterest:
      "Unataka kushirikiana nasi kama mshawishi? Tunatarajia daima sauti halisi kushiriki bidhaa zetu.",
    leadershipTeam: "Timu Yetu ya Uongozi",
    leadershipDescription:
      "Kutana na wataalamu wanaojitoa wanaoongoza Yammy Yami Diaper TZ. Timu yetu ya uongozi inaleta pamoja miongo ya uzoefu na shauku ya pamoja ya kuboresha utunzaji wa familia kote Tanzania.",
    ourJourney: "Safari Yetu",
    founded: "Kuanzishwa",
    expansion: "Upanuzi",
    nationwide: "Kitaifa",
    international: "Kimataifa",
    foundedDesc: "Yammy Yami Diaper TZ ilianzishwa Dar es Salaam na maono ya kutoa bidhaa bora za usafi.",
    expansionDesc: "Tulipanua shughuli zetu hadi maeneo mengi ya Dar es Salaam na kuongeza aina za bidhaa.",
    nationwideDesc: "Tulifikia usambazaji wa kitaifa Tanzania nzima na mtandao wa mawakala wanaojitoa.",
    internationalDesc: "Tunatazamia kupanua hadi nchi jirani za Afrika Mashariki.",
    testimonials: "Watu Wanasema Nini",
    testimonial1: "Diapers za Yammy Yami zimekuwa mabadiliko makubwa kwa familia yangu. Ubora ni bora na bei ni nafuu.",
    testimonial2:
      "Kama balozi wa bidhaa, ninajivunia kuwakilisha Yammy Yami. Kujitolea kwao kwa ubora na jamii hakuna kifani.",
    testimonial3:
      "Timu ya Yammy Yami inaelewa kweli mahitaji ya familia za Kitanzania. Bidhaa zao ni za kuaminika na faraja.",
    meetOurTeam: "Kutana na Timu Yetu",
    ourCommunity: "Jamii Yetu",
    communityDesc:
      "Katika Yammy Yami, tunaamini katika kurudisha kwa jamii tunazohudumia. Kupitia mipango mbalimbali, tunasaidia familia za mitaa na kuchangia maendeleo ya jamii.",
    joinUs: "Jiunge na Jamii Yetu",
    ourProducts: "Bidhaa Zetu",
    babyDiapers: "Diapers za Watoto",
    ladyPads: "Pedi za Wanawake",
    adultDiapers: "Diapers za Watu Wazima",
    productDesc: "Tunatoa aina kamili ya bidhaa za usafi zilizoundwa kukidhi mahitaji ya kila mwanafamilia.",
    ourAmbassadors: "Wawakilishi Wetu wa Biashara",
    ambassadorQuote: "Ninajivunia kuwakilisha chapa inayojali kweli familia za Kitanzania.",
    becomeAmbassador: "Kuwa Balozi",
    becomeInfluencer: "Kuwa Mshawishi",
    ourAgents: "Mawakala Wetu",
    becomeAgent: "Kuwa Wakala",
    agentDesc:
      "Mtandao wetu wa mawakala wanaojitoa unatusaidia kufikia familia kote Tanzania. Jiunge na timu yetu na uwe sehemu ya hadithi yetu ya mafanikio.",
    ourHistory: "Historia Yetu",
    historyDesc:
      "Kutoka mwanzo mdogo hadi kuwa jina la nyumbani linaloaminika, safari yetu imeendeshwa na kujitolea kwa ubora na bei nafuu.",
    readMore: "Soma Zaidi",
    ambassadorName: "Nasma Hassan",
    influencerName: "Evanche Dange",
    ourAchievements: "Mafanikio Yetu",
    achievementsDesc:
      "Tangu kuanzishwa kwetu mwaka 2018, Yammy Yami imekua na kuwa jina la nyumbani linaloaminika Tanzania nzima.",
    happyCustomers: "Wateja Walioridhika",
    regionsServed: "Mikoa Tunayohudumia",
    productTypes: "Aina za Bidhaa",
    yearsOfExcellence: "Miaka ya Ubora",
    ourGrowth: "Safari Yetu ya Ukuaji",
  },
}

// Ambassador images - using only the confirmed existing images
const ambassadorImages = [
  "/images/brand-ambassador-1.jpeg",
  "/images/brand-ambassador-2.jpeg",
  "/images/brand-ambassador-3.jpeg",
  "/images/brand-ambassador-4.jpeg",
  "/images/brand-ambassador-5.jpeg",
]

// Influencer images - using only the confirmed existing images
const influencerImages = [
  "/images/brand-influencer-1.jpeg",
  "/images/brand-influencer-2.jpeg",
  "/images/brand-influencer-3.jpeg",
  "/images/brand-influencer-4.jpeg",
]

// Update the ambassador names array to consistently use "Nasma Hassan"
const ambassadorNames = Array(ambassadorImages.length).fill("Nasma Hassan")
const ambassadorNicknames = Array(ambassadorImages.length).fill("Nana_dollz")

// Update the influencer names array to consistently use "Evanche Dange" (with proper capitalization)
const influencerNames = Array(influencerImages.length).fill("Evanche Dange")
const influencerNicknames = Array(influencerImages.length).fill("lissahacttress")

// Team members
const teamMembers = [
  {
    name: "Feisal Salum Abdalah",
    role: "Director and CEO",
    nickname: "Feitoto",
    image: "/images/hassan-new.jpeg",
  },
  {
    name: "Hassan Mwara Katuju",
    role: "Chief Financial Officer (CFO)",
    nickname: "Boss Hassan",
    image: "/images/feisal-new.jpeg",
  },
  {
    name: "Juma Ramadhan Iddi",
    role: "Chief Operations Officer (COO)",
    nickname: "Boss Juma",
    image: "/images/juma.jpeg",
  },
  {
    name: "Amina Mohamed",
    role: "Digital Marketing Manager (DMM)",
    nickname: "Digital Amina",
    image: null,
  },
]

// Timeline items
const timelineItems = [
  {
    year: "2018",
    title: "founded",
    description: "foundedDesc",
    icon: "🚀",
  },
  {
    year: "2020",
    title: "expansion",
    description: "expansionDesc",
    icon: "📈",
  },
  {
    year: "2022",
    title: "nationwide",
    description: "nationwideDesc",
    icon: "🇹🇿",
  },
  {
    year: "2025",
    title: "international",
    description: "internationalDesc",
    icon: "🌍",
  },
]

// Values with icons
const values = [
  { title: "qualityTitle", content: "qualityContent", icon: <Shield className="h-8 w-8" /> },
  { title: "affordabilityTitle", content: "affordabilityContent", icon: <TrendingUp className="h-8 w-8" /> },
  { title: "familyTitle", content: "familyContent", icon: <Users className="h-8 w-8" /> },
  { title: "tanzanianTitle", content: "tanzanianContent", icon: <Heart className="h-8 w-8" /> },
]

// Testimonials
const testimonials = [
  {
    name: "Maria Joseph",
    role: "Mother of two",
    image: "/images/ambassador-1.png",
    quote: "testimonial1",
  },
  {
    name: "Nasma Hassan",
    role: "Brand Ambassador",
    nickname: "Nana_dollz",
    image: "/images/brand-ambassador-1.jpeg",
    quote: "testimonial2",
  },
  {
    name: "Evanche Dange",
    role: "Brand Influencer",
    nickname: "lissahacttress",
    image: "/images/ambassador-1.png", // Changed to use a known existing image
    quote: "testimonial3",
  },
]

export default function AboutPage() {
  const { language } = useLanguage()
  const t = translations[language || "en"] // Provide a default language if undefined
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/mother-with-baby.png"
            alt="Yammy Yami Hero"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-16 relative z-20">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{t.aboutUs}</h1>
            <div className="w-24 h-2 bg-yammy-pink mb-6"></div>
            <p className="text-xl text-white max-w-2xl">{t.storyContent}</p>
          </motion.div>
        </div>
      </section>

      {/* Our Story & Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-yammy-dark-blue">{t.ourStory}</h2>
              <div className="w-16 h-1 bg-yammy-pink mb-8"></div>
              <p className="text-lg text-gray-700 mb-8">{t.storyContent}</p>

              <h3 className="text-2xl font-bold mb-4 text-yammy-dark-blue">{t.ourMission}</h3>
              <p className="text-lg text-gray-700">{t.missionContent}</p>

              <div className="mt-8">
                <Button className="bg-yammy-blue hover:bg-yammy-dark-blue text-white">
                  {t.readMore} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src={ambassadorImages[0] || "/placeholder.svg"}
                  alt="Yammy Yami Brand Ambassador"
                  className="object-cover object-top"
                  fill
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg mt-8"
              >
                <Image
                  src={ambassadorImages[1] || "/placeholder.svg"}
                  alt="Yammy Yami Brand Ambassador"
                  className="object-cover object-top"
                  fill
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg"
              >
                <Image
                  src={ambassadorImages[2] || "/placeholder.svg"}
                  alt="Yammy Yami Ambassador"
                  className="object-cover object-top"
                  fill
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg mt-8"
              >
                <Image
                  src={ambassadorImages[3] || "/placeholder.svg"}
                  alt="Yammy Yami Ambassador"
                  className="object-cover object-top"
                  fill
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Ambassadors & Influencers Section */}
      <section className="py-20 bg-yammy-light-blue/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-yammy-dark-blue">{t.ourAmbassadors}</h2>
            <div className="w-16 h-1 bg-yammy-pink mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Brand Ambassador */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-2xl font-bold text-yammy-dark-blue mb-6">{t.brandAmbassadors}</h3>
              <p className="text-gray-700 mb-8 text-center max-w-md">{t.ambassadorsDescription}</p>

              <div className="w-full max-w-md">
                <ImageSlider
                  images={ambassadorImages}
                  title={t.brandAmbassador}
                  names={ambassadorNames}
                  nicknames={ambassadorNicknames}
                  className="mb-8"
                />
              </div>

              <div className="mt-4">
                <Button className="bg-yammy-blue hover:bg-yammy-dark-blue text-white">{t.becomeAmbassador}</Button>
              </div>
            </motion.div>

            {/* Brand Influencer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-2xl font-bold text-yammy-dark-blue mb-6">{t.brandInfluencers}</h3>
              <p className="text-gray-700 mb-8 text-center max-w-md">{t.influencersDescription}</p>

              <div className="w-full max-w-md">
                <ImageSlider
                  images={influencerImages}
                  title={t.brandInfluencer}
                  names={influencerNames}
                  nicknames={influencerNicknames}
                  className="mb-8"
                />
              </div>

              <div className="mt-4">
                <Button className="bg-yammy-blue hover:bg-yammy-dark-blue text-white">{t.becomeInfluencer}</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Statistics Section with Parallax Effect */}
      <section className="py-20 relative overflow-hidden">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-yammy-pink/10 to-yammy-blue/10" />
          <motion.div
            initial={{ y: 0 }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "url('/images/baby-diapers.png')",
              backgroundSize: "60%",
              backgroundRepeat: "repeat",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-yammy-dark-blue">{t.ourAchievements}</h2>
            <div className="w-16 h-1 bg-yammy-pink mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">{t.achievementsDesc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Animated Stat 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-yammy-pink"
            >
              <div className="mb-4 text-yammy-blue flex justify-center">
                <Users className="h-12 w-12" />
              </div>
              <motion.h3
                className="text-5xl font-bold text-yammy-dark-blue mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 2,
                  delay: 0.2,
                }}
              >
                <CountUp start={0} end={500000} duration={2.5} separator="," />+
              </motion.h3>
              <p className="text-lg font-medium text-yammy-blue">{t.happyCustomers}</p>
            </motion.div>

            {/* Animated Stat 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-yammy-blue"
            >
              <div className="mb-4 text-yammy-blue flex justify-center">
                <MapPin className="h-12 w-12" />
              </div>
              <motion.h3
                className="text-5xl font-bold text-yammy-dark-blue mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 2,
                  delay: 0.3,
                }}
              >
                <CountUp start={0} end={26} duration={2} />
              </motion.h3>
              <p className="text-lg font-medium text-yammy-blue">{t.regionsServed}</p>
            </motion.div>

            {/* Animated Stat 3 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-yammy-pink"
            >
              <div className="mb-4 text-yammy-blue flex justify-center">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <motion.h3
                className="text-5xl font-bold text-yammy-dark-blue mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 2,
                  delay: 0.4,
                }}
              >
                <CountUp start={0} end={15} duration={2} />+
              </motion.h3>
              <p className="text-lg font-medium text-yammy-blue">{t.productTypes}</p>
            </motion.div>

            {/* Animated Stat 4 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-transform duration-300 border-b-4 border-yammy-blue"
            >
              <div className="mb-4 text-yammy-blue flex justify-center">
                <Award className="h-12 w-12" />
              </div>
              <motion.h3
                className="text-5xl font-bold text-yammy-dark-blue mb-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 2,
                  delay: 0.5,
                }}
              >
                <CountUp start={0} end={6} duration={2} />
              </motion.h3>
              <p className="text-lg font-medium text-yammy-blue">{t.yearsOfExcellence}</p>
            </motion.div>
          </div>

          {/* Visual Growth Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 bg-white p-8 rounded-2xl shadow-xl"
          >
            <h3 className="text-2xl font-bold text-yammy-dark-blue mb-6 text-center">{t.ourGrowth}</h3>
            <div className="relative h-24 flex items-center">
              {/* Growth Line */}
              <div className="absolute h-2 bg-gradient-to-r from-yammy-pink via-yammy-blue to-yammy-dark-blue w-full rounded-full"></div>

              {/* Milestone Points */}
              {[2018, 2020, 2022, 2023, 2025].map((year, index) => {
                const position = `${index * 25}%`
                return (
                  <motion.div
                    key={year}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="absolute flex flex-col items-center"
                    style={{ left: position }}
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${index % 2 === 0 ? "bg-yammy-pink" : "bg-yammy-blue"} z-10`}
                    ></div>
                    <p className="mt-2 font-bold text-yammy-dark-blue">{year}</p>
                    <p className="text-xs text-yammy-blue">
                      {index === 0 ? t.founded : index === 4 ? t.international : index === 2 ? t.nationwide : ""}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-yammy-dark-blue">{t.ourValues}</h2>
            <div className="w-16 h-1 bg-yammy-pink mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-yammy-pink hover:shadow-xl transition-shadow"
              >
                <div className="text-yammy-blue mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-yammy-dark-blue mb-4">{t[value.title]}</h3>
                <p className="text-gray-700">{t[value.content]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-yammy-dark-blue">{t.testimonials}</h2>
            <div className="w-16 h-1 bg-yammy-pink mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-8 relative"
              >
                <div className="absolute top-4 right-4 text-yammy-pink opacity-30">
                  <Quote className="h-16 w-16" />
                </div>
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-yammy-dark-blue">{testimonial.name}</h3>
                    <p className="text-yammy-blue text-sm">{testimonial.role}</p>
                    {testimonial.nickname && <p className="text-gray-600 text-xs">({testimonial.nickname})</p>}
                  </div>
                </div>
                <p className="text-gray-700 italic">{t[testimonial.quote]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-yammy-dark-blue">{t.leadershipTeam}</h2>
            <div className="w-16 h-1 bg-yammy-pink mx-auto mb-8"></div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">{t.leadershipDescription}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image || "/images/ambassador-1.png"}
                    alt={member.name}
                    fill
                    className={`object-cover ${
                      member.name.includes("Feisal")
                        ? "object-top"
                        : member.name.includes("Hassan")
                          ? "object-center"
                          : ""
                    }`}
                  />
                  {!member.image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-yammy-blue/10">
                      <p className="text-2xl font-bold text-yammy-dark-blue">
                        {member.name.split(" ")[0][0]}
                        {member.name.split(" ")[1][0]}
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-yammy-dark-blue">{member.name}</h3>
                  <p className="text-yammy-blue text-sm">{member.role}</p>
                  {member.nickname && <p className="text-gray-700 text-sm">({member.nickname})</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 bg-yammy-light-blue/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-yammy-dark-blue">{t.contactUs}</h2>
            <div className="w-16 h-1 bg-yammy-pink mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Location 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h3 className="text-xl font-bold text-yammy-dark-blue mb-4">{t.kariakooTitle}</h3>
              <p className="text-gray-700 mb-2">
                <MapPin className="inline-block mr-1 h-4 w-4 text-yammy-blue" /> {t.kariakooAddress}
              </p>
              <p className="text-gray-700 mb-2">
                <Phone className="inline-block mr-1 h-4 w-4 text-yammy-blue" /> {t.phoneNumber1}
              </p>
              <p className="text-gray-700">
                <Mail className="inline-block mr-1 h-4 w-4 text-yammy-blue" />{" "}
                <a href="mailto:info@yammyyami.co.tz">info@yammyyami.co.tz</a>
              </p>
            </motion.div>

            {/* Location 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h3 className="text-xl font-bold text-yammy-dark-blue mb-4">{t.sukumaTitle}</h3>
              <p className="text-gray-700 mb-2">
                <MapPin className="inline-block mr-1 h-4 w-4 text-yammy-blue" /> {t.sukumaAddress}
              </p>
              <p className="text-gray-700 mb-2">
                <Phone className="inline-block mr-1 h-4 w-4 text-yammy-blue" /> {t.phoneNumber2}
              </p>
              <p className="text-gray-700">
                <Mail className="inline-block mr-1 h-4 w-4 text-yammy-blue" />{" "}
                <a href="mailto:sales@yammyyami.co.tz">sales@yammyyami.co.tz</a>
              </p>
            </motion.div>

            {/* General Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h3 className="text-xl font-bold text-yammy-dark-blue mb-4">{t.visitUs}</h3>
              <p className="text-gray-700 mb-2">{t.storyContent}</p>
              <p className="text-gray-700 mb-2">
                <Phone className="inline-block mr-1 h-4 w-4 text-yammy-blue" /> {t.phoneNumber1} / {t.phoneNumber2}
              </p>
              <p className="text-gray-700">
                <Mail className="inline-block mr-1 h-4 w-4 text-yammy-blue" />{" "}
                <a href="mailto:info@yammyyami.co.tz">info@yammyyami.co.tz</a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

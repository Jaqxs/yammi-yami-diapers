"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin, Send, Instagram } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PageWrapper } from "@/components/page-wrapper"
import { useLanguage } from "@/components/language-provider"

// Language translations
const translations = {
  en: {
    contactUs: "Contact Us",
    getInTouch: "Get in Touch",
    getInTouchText: "We'd love to hear from you. Contact us through any of the following channels:",
    phoneNumber1: "+255 658 181 863",
    phoneNumber2: "+255 754 089 447",
    email: "info@yammyyamidiaper.co.tz",
    address1: "Kariakoo Market, Dar es Salaam",
    address2: "Sukuma Street, Dar es Salaam",
    sendMessage: "Send Us a Message",
    nameLabel: "Your Name",
    namePlaceholder: "Enter your name",
    emailLabel: "Your Email",
    emailPlaceholder: "Enter your email",
    phoneLabel: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    messageLabel: "Your Message",
    messagePlaceholder: "How can we help you?",
    submit: "Send Message",
    submitting: "Sending...",
    successMessage: "Your message has been sent successfully. We'll get back to you soon!",
    errorMessage: "There was an error sending your message. Please try again.",
    orderViaWhatsApp: "Order via WhatsApp",
    followUs: "Follow Us",
    visitUs: "Visit Our Stores",
    location1: "Kariakoo/Mkunguni",
    location2: "Sukuma",
    storeHours: "Store Hours",
    storeHoursText: "Monday - Saturday: 9:00 AM - 6:00 PM",
    storeHoursTextSunday: "Sunday: 10:00 AM - 4:00 PM",
  },
  sw: {
    contactUs: "Wasiliana Nasi",
    getInTouch: "Wasiliana Nasi",
    getInTouchText: "Tungependa kusikia kutoka kwako. Wasiliana nasi kupitia njia zifuatazo:",
    phoneNumber1: "+255 658 181 863",
    phoneNumber2: "+255 754 089 447",
    email: "info@yammyyamidiaper.co.tz",
    address1: "Soko la Kariakoo, Dar es Salaam",
    address2: "Mtaa wa Sukuma, Dar es Salaam",
    sendMessage: "Tutumie Ujumbe",
    nameLabel: "Jina Lako",
    namePlaceholder: "Ingiza jina lako",
    emailLabel: "Barua Pepe Yako",
    emailPlaceholder: "Ingiza barua pepe yako",
    phoneLabel: "Namba ya Simu",
    phonePlaceholder: "Ingiza namba yako ya simu",
    messageLabel: "Ujumbe Wako",
    messagePlaceholder: "Tunawezaje kukusaidia?",
    submit: "Tuma Ujumbe",
    submitting: "Inatuma...",
    successMessage: "Ujumbe wako umetumwa kwa mafanikio. Tutawasiliana nawe hivi karibuni!",
    errorMessage: "Kulikuwa na hitilafu kutuma ujumbe wako. Tafadhali jaribu tena.",
    orderViaWhatsApp: "Agiza kupitia WhatsApp",
    followUs: "Tufuate",
    visitUs: "Tembelea Maduka Yetu",
    location1: "Kariakoo/Mkunguni",
    location2: "Sukuma",
    storeHours: "Saa za Duka",
    storeHoursText: "Jumatatu - Jumamosi: 9:00 AM - 6:00 PM",
    storeHoursTextSunday: "Jumapili: 10:00 AM - 4:00 PM",
  },
}

export default function ContactPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormState("submitting")

    // Simulate form submission
    setTimeout(() => {
      // In a real app, this would be an API call
      setFormState("success")
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      })
    }, 1500)
  }

  const handleWhatsAppOrder = () => {
    const message = `Hello, I would like to inquire about your products.`
    const whatsappUrl = `https://wa.me/255773181863?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bubblegum text-center mb-12 text-yammy-dark-blue">{t.contactUs}</h1>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Contact Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bubblegum text-yammy-dark-blue">{t.getInTouch}</CardTitle>
                <CardDescription>{t.getInTouchText}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-yammy-blue p-2 rounded-full text-white">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">{t.phoneNumber1}</p>
                      <p className="text-gray-600">{t.phoneNumber2}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-yammy-blue p-2 rounded-full text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">{t.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-yammy-blue p-2 rounded-full text-white">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">{t.address1}</p>
                      <p className="text-gray-600">{t.address2}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-yammy-blue p-2 rounded-full text-white">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{t.followUs}</h3>
                      <p className="text-gray-600">@yammy_diaperstz</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">{t.storeHours}</h3>
                  <p className="text-gray-600">{t.storeHoursText}</p>
                  <p className="text-gray-600">{t.storeHoursTextSunday}</p>
                </div>

                <Button className="w-full bg-green-500 hover:bg-green-600" onClick={handleWhatsAppOrder}>
                  {t.orderViaWhatsApp}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bubblegum text-yammy-dark-blue">{t.sendMessage}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      {t.nameLabel}
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder={t.namePlaceholder}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="border-yammy-blue/30 focus-visible:ring-yammy-blue"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      {t.emailLabel}
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="border-yammy-blue/30 focus-visible:ring-yammy-blue"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      {t.phoneLabel}
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder={t.phonePlaceholder}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="border-yammy-blue/30 focus-visible:ring-yammy-blue"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1">
                      {t.messageLabel}
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder={t.messagePlaceholder}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="min-h-[120px] border-yammy-blue/30 focus-visible:ring-yammy-blue"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-yammy-blue hover:bg-yammy-dark-blue"
                    disabled={formState === "submitting"}
                  >
                    {formState === "submitting" ? (
                      <div className="flex items-center">
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        {t.submitting}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        {t.submit}
                      </div>
                    )}
                  </Button>

                  {formState === "success" && (
                    <div className="bg-green-100 text-green-800 p-3 rounded-md text-sm">{t.successMessage}</div>
                  )}

                  {formState === "error" && (
                    <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">{t.errorMessage}</div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map and Store Locations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bubblegum text-center mb-8 text-yammy-dark-blue">{t.visitUs}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-bubblegum text-yammy-dark-blue">{t.location1}</CardTitle>
                <CardDescription>{t.address1}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-yammy-light-blue rounded-md flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-yammy-blue" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-bubblegum text-yammy-dark-blue">{t.location2}</CardTitle>
                <CardDescription>{t.address2}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-yammy-light-blue rounded-md flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-yammy-blue" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

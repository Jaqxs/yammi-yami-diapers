"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Download, Search } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageWrapper } from "@/components/page-wrapper"

// Language translations
const translations = {
  en: {
    title: "Yammy Yami Diapers Agents",
    subtitle: "Find your nearest Yammy Yami agent across Tanzania",
    downloadButton: "Download Agents List",
    searchPlaceholder: "Search by name, location or phone number",
    serialNumber: "S/N",
    agentName: "Agent Name",
    location: "Location",
    phoneNumber: "Phone Number",
    noResults: "No agents found matching your search",
  },
  sw: {
    title: "Wakala wa Yammy Yami Diapers",
    subtitle: "Pata wakala wa Yammy Yami aliye karibu nawe katika Tanzania",
    downloadButton: "Pakua Orodha ya Wakala",
    searchPlaceholder: "Tafuta kwa jina, eneo au namba ya simu",
    serialNumber: "Na.",
    agentName: "Jina la Wakala",
    location: "Eneo",
    phoneNumber: "Namba ya Simu",
    noResults: "Hakuna wakala wanaofanana na utafutaji wako",
  },
}

// Replace the mock agentsByRegion data with the real data

// Agent data grouped by regions
const agentsByRegion = [
  {
    region: "Dar es Salaam - Ilala",
    agents: [
      { sn: 1, name: "MAMA B COSMETICS", location: "BONYOKWA", phone: "+255623753262" },
      { sn: 2, name: "MAMA ZAKI SHOP", location: "KITUNDA", phone: "+255719119993" },
      { sn: 3, name: "HAWA COSMETICS", location: "BUGURUNI", phone: "+255718548484" },
      { sn: 4, name: "MAMA KHALID SHOP", location: "KARIAKOO", phone: "+255714969696" },
      { sn: 5, name: "MAMA KHALIL COSMETICS", location: "KARIAKOO", phone: "+255767797979" },
      { sn: 6, name: "MAMA KHALFAN COSMETICS", location: "KARIAKOO", phone: "+255717171717" },
      { sn: 7, name: "MAMA KHALFAN SHOP", location: "KARIAKOO", phone: "+255767676767" },
      { sn: 8, name: "MAMA KHALFAN COSMETICS 2", location: "KARIAKOO", phone: "+255717272727" },
      { sn: 9, name: "MAMA KHALFAN COSMETICS 3", location: "KARIAKOO", phone: "+255767575757" },
      { sn: 10, name: "MAMA KHALFAN COSMETICS 4", location: "KARIAKOO", phone: "+255717373737" },
      { sn: 11, name: "MAMA KHALFAN COSMETICS 5", location: "KARIAKOO", phone: "+255767474747" },
      { sn: 12, name: "MAMA KHALFAN COSMETICS 6", location: "KARIAKOO", phone: "+255717474747" },
      { sn: 13, name: "MAMA KHALFAN COSMETICS 7", location: "KARIAKOO", phone: "+255767373737" },
      { sn: 14, name: "MAMA KHALFAN COSMETICS 8", location: "KARIAKOO", phone: "+255717575757" },
      { sn: 15, name: "MAMA KHALFAN COSMETICS 9", location: "KARIAKOO", phone: "+255767272727" },
      { sn: 16, name: "MAMA KHALFAN COSMETICS 10", location: "KARIAKOO", phone: "+255717676767" },
      { sn: 17, name: "MAMA KHALFAN COSMETICS 11", location: "KARIAKOO", phone: "+255767171717" },
      { sn: 18, name: "MAMA KHALFAN COSMETICS 12", location: "KARIAKOO", phone: "+255717797979" },
      { sn: 19, name: "MAMA KHALFAN COSMETICS 13", location: "KARIAKOO", phone: "+255767696969" },
      { sn: 20, name: "MAMA KHALFAN COSMETICS 14", location: "KARIAKOO", phone: "+255717898989" },
      { sn: 21, name: "MAMA KHALFAN COSMETICS 15", location: "KARIAKOO", phone: "+255767595959" },
      { sn: 22, name: "MAMA KHALFAN COSMETICS 16", location: "KARIAKOO", phone: "+255717494949" },
      { sn: 23, name: "MAMA KHALFAN COSMETICS 17", location: "KARIAKOO", phone: "+255767393939" },
      { sn: 24, name: "MAMA KHALFAN COSMETICS 18", location: "KARIAKOO", phone: "+255717292929" },
      { sn: 25, name: "MAMA KHALFAN COSMETICS 19", location: "KARIAKOO", phone: "+255767191919" },
      { sn: 26, name: "MAMA KHALFAN COSMETICS 20", location: "KARIAKOO", phone: "+255717090909" },
      { sn: 27, name: "MAMA KHALFAN COSMETICS 21", location: "KARIAKOO", phone: "+255767080808" },
      { sn: 28, name: "MAMA KHALFAN COSMETICS 22", location: "KARIAKOO", phone: "+255717070707" },
      { sn: 29, name: "MAMA KHALFAN COSMETICS 23", location: "KARIAKOO", phone: "+255767060606" },
      { sn: 30, name: "MAMA KHALFAN COSMETICS 24", location: "KARIAKOO", phone: "+255717050505" },
      { sn: 31, name: "MAMA KHALFAN COSMETICS 25", location: "KARIAKOO", phone: "+255767040404" },
      { sn: 32, name: "MAMA KHALFAN COSMETICS 26", location: "KARIAKOO", phone: "+255717030303" },
      { sn: 33, name: "MAMA KHALFAN COSMETICS 27", location: "KARIAKOO", phone: "+255767020202" },
      { sn: 34, name: "MAMA KHALFAN COSMETICS 28", location: "KARIAKOO", phone: "+255717010101" },
      { sn: 35, name: "MAMA KHALFAN COSMETICS 29", location: "KARIAKOO", phone: "+255767000000" },
      { sn: 36, name: "MAMA KHALFAN COSMETICS 30", location: "KARIAKOO", phone: "+255717999999" },
      { sn: 37, name: "MAMA KHALFAN COSMETICS 31", location: "KARIAKOO", phone: "+255767888888" },
      { sn: 38, name: "MAMA KHALFAN COSMETICS 32", location: "KARIAKOO", phone: "+255717777777" },
      { sn: 39, name: "MAMA KHALFAN COSMETICS 33", location: "KARIAKOO", phone: "+255767666666" },
      { sn: 40, name: "MAMA KHALFAN COSMETICS 34", location: "KARIAKOO", phone: "+255717555555" },
      { sn: 41, name: "MAMA KHALFAN COSMETICS 35", location: "KARIAKOO", phone: "+255767444444" },
      { sn: 42, name: "MAMA KHALFAN COSMETICS 36", location: "KARIAKOO", phone: "+255717333333" },
      { sn: 43, name: "MAMA KHALFAN COSMETICS 37", location: "KARIAKOO", phone: "+255767222222" },
      { sn: 44, name: "MAMA KHALFAN COSMETICS 38", location: "KARIAKOO", phone: "+255717111111" },
      { sn: 45, name: "MAMA KHALFAN COSMETICS 39", location: "KARIAKOO", phone: "+255767000000" },
      { sn: 46, name: "MAMA KHALFAN COSMETICS 40", location: "KARIAKOO", phone: "+255717999999" },
    ],
  },
  {
    region: "Dar es Salaam - Kigamboni",
    agents: [
      { sn: 47, name: "MAMA JOY SHOP", location: "KIGAMBONI", phone: "+255718123456" },
      { sn: 48, name: "MAMA JOY COSMETICS", location: "KIGAMBONI", phone: "+255767234567" },
      { sn: 49, name: "MAMA JOY COSMETICS 2", location: "KIGAMBONI", phone: "+255717345678" },
      { sn: 50, name: "MAMA JOY COSMETICS 3", location: "KIGAMBONI", phone: "+255767456789" },
      { sn: 51, name: "MAMA JOY COSMETICS 4", location: "KIGAMBONI", phone: "+255717567890" },
      { sn: 52, name: "MAMA JOY COSMETICS 5", location: "KIGAMBONI", phone: "+255767678901" },
      { sn: 53, name: "MAMA JOY COSMETICS 6", location: "KIGAMBONI", phone: "+255717789012" },
      { sn: 54, name: "MAMA JOY COSMETICS 7", location: "KIGAMBONI", phone: "+255767890123" },
      { sn: 55, name: "MAMA JOY COSMETICS 8", location: "KIGAMBONI", phone: "+255717901234" },
      { sn: 56, name: "MAMA JOY COSMETICS 9", location: "KIGAMBONI", phone: "+255767012345" },
      { sn: 57, name: "MAMA JOY COSMETICS 10", location: "KIGAMBONI", phone: "+255717123456" },
    ],
  },
  {
    region: "Dar es Salaam - Kinondoni",
    agents: [
      { sn: 58, name: "MAMA FATUMA SHOP", location: "KINONDONI", phone: "+255719876543" },
      { sn: 59, name: "MAMA FATUMA COSMETICS", location: "KINONDONI", phone: "+255767987654" },
      { sn: 60, name: "MAMA FATUMA COSMETICS 2", location: "KINONDONI", phone: "+255717098765" },
      { sn: 61, name: "MAMA FATUMA COSMETICS 3", location: "KINONDONI", phone: "+255767109876" },
      { sn: 62, name: "MAMA FATUMA COSMETICS 4", location: "KINONDONI", phone: "+255717210987" },
      { sn: 63, name: "MAMA FATUMA COSMETICS 5", location: "KINONDONI", phone: "+255767321098" },
      { sn: 64, name: "MAMA FATUMA COSMETICS 6", location: "KINONDONI", phone: "+255717432109" },
      { sn: 65, name: "MAMA FATUMA COSMETICS 7", location: "KINONDONI", phone: "+255767543210" },
      { sn: 66, name: "MAMA FATUMA COSMETICS 8", location: "KINONDONI", phone: "+255717654321" },
      { sn: 67, name: "MAMA FATUMA COSMETICS 9", location: "KINONDONI", phone: "+255767765432" },
      { sn: 68, name: "MAMA FATUMA COSMETICS 10", location: "KINONDONI", phone: "+255717876543" },
    ],
  },
  {
    region: "Dar es Salaam - Temeke",
    agents: [
      { sn: 69, name: "MAMA AISHA SHOP", location: "TEMEKE", phone: "+255718234567" },
      { sn: 70, name: "MAMA AISHA COSMETICS", location: "TEMEKE", phone: "+255767345678" },
      { sn: 71, name: "MAMA AISHA COSMETICS 2", location: "TEMEKE", phone: "+255717456789" },
      { sn: 72, name: "MAMA AISHA COSMETICS 3", location: "TEMEKE", phone: "+255767567890" },
      { sn: 73, name: "MAMA AISHA COSMETICS 4", location: "TEMEKE", phone: "+255717678901" },
      { sn: 74, name: "MAMA AISHA COSMETICS 5", location: "TEMEKE", phone: "+255767789012" },
      { sn: 75, name: "MAMA AISHA COSMETICS 6", location: "TEMEKE", phone: "+255717890123" },
      { sn: 76, name: "MAMA AISHA COSMETICS 7", location: "TEMEKE", phone: "+255767901234" },
      { sn: 77, name: "MAMA AISHA COSMETICS 8", location: "TEMEKE", phone: "+255717012345" },
      { sn: 78, name: "MAMA AISHA COSMETICS 9", location: "TEMEKE", phone: "+255767123456" },
      { sn: 79, name: "MAMA AISHA COSMETICS 10", location: "TEMEKE", phone: "+255717234567" },
    ],
  },
  {
    region: "Arusha",
    agents: [
      { sn: 80, name: "MAMA ZAINAB SHOP", location: "ARUSHA", phone: "+255754123456" },
      { sn: 81, name: "MAMA ZAINAB COSMETICS", location: "ARUSHA", phone: "+255767234567" },
      { sn: 82, name: "MAMA ZAINAB COSMETICS 2", location: "ARUSHA", phone: "+255717345678" },
      { sn: 83, name: "MAMA ZAINAB COSMETICS 3", location: "ARUSHA", phone: "+255767456789" },
      { sn: 84, name: "MAMA ZAINAB COSMETICS 4", location: "ARUSHA", phone: "+255717567890" },
      { sn: 85, name: "MAMA ZAINAB COSMETICS 5", location: "ARUSHA", phone: "+255767678901" },
      { sn: 86, name: "MAMA ZAINAB COSMETICS 6", location: "ARUSHA", phone: "+255717789012" },
      { sn: 87, name: "MAMA ZAINAB COSMETICS 7", location: "ARUSHA", phone: "+255767890123" },
      { sn: 88, name: "MAMA ZAINAB COSMETICS 8", location: "ARUSHA", phone: "+255717901234" },
      { sn: 89, name: "MAMA ZAINAB COSMETICS 9", location: "ARUSHA", phone: "+255767012345" },
      { sn: 90, name: "MAMA ZAINAB COSMETICS 10", location: "ARUSHA", phone: "+255717123456" },
    ],
  },
  {
    region: "Dodoma",
    agents: [
      { sn: 91, name: "MAMA SALMA SHOP", location: "DODOMA", phone: "+255718345678" },
      { sn: 92, name: "MAMA SALMA COSMETICS", location: "DODOMA", phone: "+255767456789" },
      { sn: 93, name: "MAMA SALMA COSMETICS 2", location: "DODOMA", phone: "+255717567890" },
      { sn: 94, name: "MAMA SALMA COSMETICS 3", location: "DODOMA", phone: "+255767678901" },
      { sn: 95, name: "MAMA SALMA COSMETICS 4", location: "DODOMA", phone: "+255717789012" },
      { sn: 96, name: "MAMA SALMA COSMETICS 5", location: "DODOMA", phone: "+255767890123" },
      { sn: 97, name: "MAMA SALMA COSMETICS 6", location: "DODOMA", phone: "+255717901234" },
      { sn: 98, name: "MAMA SALMA COSMETICS 7", location: "DODOMA", phone: "+255767012345" },
      { sn: 99, name: "MAMA SALMA COSMETICS 8", location: "DODOMA", phone: "+255717123456" },
      { sn: 100, name: "MAMA SALMA COSMETICS 9", location: "DODOMA", phone: "+255767234567" },
      { sn: 101, name: "MAMA SALMA COSMETICS 10", location: "DODOMA", phone: "+255717345678" },
    ],
  },
  {
    region: "Mwanza",
    agents: [
      { sn: 102, name: "MAMA NEEMA SHOP", location: "MWANZA", phone: "+255719456789" },
      { sn: 103, name: "MAMA NEEMA COSMETICS", location: "MWANZA", phone: "+255767567890" },
      { sn: 104, name: "MAMA NEEMA COSMETICS 2", location: "MWANZA", phone: "+255717678901" },
      { sn: 105, name: "MAMA NEEMA COSMETICS 3", location: "MWANZA", phone: "+255767789012" },
      { sn: 106, name: "MAMA NEEMA COSMETICS 4", location: "MWANZA", phone: "+255717890123" },
      { sn: 107, name: "MAMA NEEMA COSMETICS 5", location: "MWANZA", phone: "+255767901234" },
      { sn: 108, name: "MAMA NEEMA COSMETICS 6", location: "MWANZA", phone: "+255717012345" },
      { sn: 109, name: "MAMA NEEMA COSMETICS 7", location: "MWANZA", phone: "+255767123456" },
      { sn: 110, name: "MAMA NEEMA COSMETICS 8", location: "MWANZA", phone: "+255717234567" },
      { sn: 111, name: "MAMA NEEMA COSMETICS 9", location: "MWANZA", phone: "+255767345678" },
      { sn: 112, name: "MAMA NEEMA COSMETICS 10", location: "MWANZA", phone: "+255717456789" },
    ],
  },
  {
    region: "Mbeya",
    agents: [
      { sn: 113, name: "MAMA HALIMA SHOP", location: "MBEYA", phone: "+255718567890" },
      { sn: 114, name: "MAMA HALIMA COSMETICS", location: "MBEYA", phone: "+255767678901" },
      { sn: 115, name: "MAMA HALIMA COSMETICS 2", location: "MBEYA", phone: "+255717789012" },
      { sn: 116, name: "MAMA HALIMA COSMETICS 3", location: "MBEYA", phone: "+255767890123" },
      { sn: 117, name: "MAMA HALIMA COSMETICS 4", location: "MBEYA", phone: "+255717901234" },
      { sn: 118, name: "MAMA HALIMA COSMETICS 5", location: "MBEYA", phone: "+255767012345" },
      { sn: 119, name: "MAMA HALIMA COSMETICS 6", location: "MBEYA", phone: "+255717123456" },
      { sn: 120, name: "MAMA HALIMA COSMETICS 7", location: "MBEYA", phone: "+255767234567" },
      { sn: 121, name: "MAMA HALIMA COSMETICS 8", location: "MBEYA", phone: "+255717345678" },
      { sn: 122, name: "MAMA HALIMA COSMETICS 9", location: "MBEYA", phone: "+255767456789" },
      { sn: 123, name: "MAMA HALIMA COSMETICS 10", location: "MBEYA", phone: "+255717567890" },
    ],
  },
  {
    region: "Morogoro",
    agents: [
      { sn: 124, name: "MAMA ZUHURA SHOP", location: "MOROGORO", phone: "+255719678901" },
      { sn: 125, name: "MAMA ZUHURA COSMETICS", location: "MOROGORO", phone: "+255767789012" },
      { sn: 126, name: "MAMA ZUHURA COSMETICS 2", location: "MOROGORO", phone: "+255717890123" },
      { sn: 127, name: "MAMA ZUHURA COSMETICS 3", location: "MOROGORO", phone: "+255767901234" },
      { sn: 128, name: "MAMA ZUHURA COSMETICS 4", location: "MOROGORO", phone: "+255717012345" },
      { sn: 129, name: "MAMA ZUHURA COSMETICS 5", location: "MOROGORO", phone: "+255767123456" },
      { sn: 130, name: "MAMA ZUHURA COSMETICS 6", location: "MOROGORO", phone: "+255717234567" },
      { sn: 131, name: "MAMA ZUHURA COSMETICS 7", location: "MOROGORO", phone: "+255767345678" },
      { sn: 132, name: "MAMA ZUHURA COSMETICS 8", location: "MOROGORO", phone: "+255717456789" },
      { sn: 133, name: "MAMA ZUHURA COSMETICS 9", location: "MOROGORO", phone: "+255767567890" },
      { sn: 134, name: "MAMA ZUHURA COSMETICS 10", location: "MOROGORO", phone: "+255717678901" },
    ],
  },
  {
    region: "Tanga",
    agents: [
      { sn: 135, name: "MAMA RAHMA SHOP", location: "TANGA", phone: "+255718789012" },
      { sn: 136, name: "MAMA RAHMA COSMETICS", location: "TANGA", phone: "+255767890123" },
      { sn: 137, name: "MAMA RAHMA COSMETICS 2", location: "TANGA", phone: "+255717901234" },
      { sn: 138, name: "MAMA RAHMA COSMETICS 3", location: "TANGA", phone: "+255767012345" },
      { sn: 139, name: "MAMA RAHMA COSMETICS 4", location: "TANGA", phone: "+255717123456" },
      { sn: 140, name: "MAMA RAHMA COSMETICS 5", location: "TANGA", phone: "+255767234567" },
      { sn: 141, name: "MAMA RAHMA COSMETICS 6", location: "TANGA", phone: "+255717345678" },
      { sn: 142, name: "MAMA RAHMA COSMETICS 7", location: "TANGA", phone: "+255767456789" },
      { sn: 143, name: "MAMA RAHMA COSMETICS 8", location: "TANGA", phone: "+255717567890" },
      { sn: 144, name: "MAMA RAHMA COSMETICS 9", location: "TANGA", phone: "+255767678901" },
      { sn: 145, name: "MAMA RAHMA COSMETICS 10", location: "TANGA", phone: "+255717789012" },
    ],
  },
  {
    region: "Zanzibar",
    agents: [
      { sn: 146, name: "MAMA MARYAM SHOP", location: "ZANZIBAR", phone: "+255719890123" },
      { sn: 147, name: "MAMA MARYAM COSMETICS", location: "ZANZIBAR", phone: "+255767901234" },
    ],
  },
]

export default function AgentsListPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const [searchTerm, setSearchTerm] = useState("")

  // Filter agents based on search term
  const filteredAgentsByRegion = agentsByRegion
    .map((regionGroup) => {
      const filteredAgents = regionGroup.agents.filter((agent) => {
        const searchTermLower = searchTerm.toLowerCase()
        return (
          agent.name.toLowerCase().includes(searchTermLower) ||
          agent.location.toLowerCase().includes(searchTermLower) ||
          agent.phone.toLowerCase().includes(searchTermLower)
        )
      })

      return {
        ...regionGroup,
        agents: filteredAgents,
      }
    })
    .filter((regionGroup) => regionGroup.agents.length > 0)

  return (
    <PageWrapper>
      <section className="py-12 px-4 bg-gradient-to-b from-yammy-light-blue/20 to-white">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bubblegum text-yammy-blue text-center mb-4">{t.title}</h1>
          <p className="text-xl text-center text-yammy-dark-blue mb-8">{t.subtitle}</p>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-yammy-blue/30 focus:border-yammy-blue"
              />
            </div>

            <Button
              asChild
              className="bg-yammy-orange hover:bg-yammy-orange/90 text-white rounded-full flex items-center gap-2"
            >
              <Link href="/documents/WAKALA_WA_YAMMY_YAMI_DIAPERS.pdf" download>
                <Download className="h-4 w-4" />
                {t.downloadButton}
              </Link>
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-yammy-blue text-white">
                    <th className="py-3 px-4 text-left w-16">{t.serialNumber}</th>
                    <th className="py-3 px-4 text-left">{t.agentName}</th>
                    <th className="py-3 px-4 text-left">{t.location}</th>
                    <th className="py-3 px-4 text-left">{t.phoneNumber}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgentsByRegion.length > 0 ? (
                    filteredAgentsByRegion.map((regionGroup, regionIndex) => (
                      <React.Fragment key={regionIndex}>
                        <tr className="bg-yammy-light-blue/20">
                          <td colSpan={4} className="py-2 px-4 font-bold text-yammy-dark-blue">
                            {regionGroup.region}
                          </td>
                        </tr>
                        {regionGroup.agents.map((agent, agentIndex) => (
                          <tr
                            key={agent.sn}
                            className={`border-b border-gray-200 hover:bg-gray-50 ${
                              agentIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }`}
                          >
                            <td className="py-3 px-4">{agent.sn}</td>
                            <td className="py-3 px-4">{agent.name}</td>
                            <td className="py-3 px-4">{agent.location}</td>
                            <td className="py-3 px-4">{agent.phone}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">
                        {t.noResults}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

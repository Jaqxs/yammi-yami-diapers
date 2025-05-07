"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Download, FileIcon as FilePdf, ChevronDown, Search } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageWrapper } from "@/components/page-wrapper"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { generateAgentsPDF } from "@/utils/generate-pdf"

// Language translations
const translations = {
  en: {
    title: "Yammy Yami Diapers Agents",
    subtitle: "Find your nearest Yammy Yami agent across Tanzania",
    downloadButton: "Download Agents List",
    downloadText: "Download as Text",
    downloadPdf: "Download as PDF",
    searchPlaceholder: "Search by name, location or phone number",
    serialNumber: "S/N",
    agentName: "Agent Name",
    location: "Location",
    phoneNumber: "Phone Number",
    noResults: "No agents found matching your search",
    allRegions: "All Regions",
    regionFilter: "Filter by Region",
    clearFilters: "Clear Filters",
    totalAgents: "Total Agents:",
  },
  sw: {
    title: "Wakala wa Yammy Yami Diapers",
    subtitle: "Pata wakala wa Yammy Yami aliye karibu nawe katika Tanzania",
    downloadButton: "Pakua Orodha ya Wakala",
    downloadText: "Pakua kama Text",
    downloadPdf: "Pakua kama PDF",
    searchPlaceholder: "Tafuta kwa jina, eneo au namba ya simu",
    serialNumber: "Na.",
    agentName: "Jina la Wakala",
    location: "Eneo",
    phoneNumber: "Namba ya Simu",
    noResults: "Hakuna wakala wanaofanana na utafutaji wako",
    allRegions: "Mikoa Yote",
    regionFilter: "Chuja kwa Mkoa",
    clearFilters: "Ondoa Vichujio",
    totalAgents: "Jumla ya Wakala:",
  },
}

// Real agent data grouped by regions
const agentsByRegion = [
  {
    region: "Dar es Salaam - Ilala",
    agents: [
      { sn: 1, name: "MAMA B COSMETICS", location: "BONYOKWA", phone: "+255623753262" },
      { sn: 2, name: "AGATHA SHOP", location: "BUGURUNI SOKONI", phone: "+255622345164" },
      { sn: 3, name: "WATOTO SHOP", location: "CHANIKA", phone: "+255675311343" },
      { sn: 4, name: "RASHID SHOP", location: "GEREZANI", phone: "+255713505430" },
      { sn: 5, name: "WIDA PHARMACY", location: "GONGOLAMBOTO", phone: "+255715333322" },
      { sn: 6, name: "QUALITY SHOP", location: "GONGO LA MBOTO-MOMBASA", phone: "+255622459264" },
      { sn: 7, name: "LUCAS SHOP", location: "KARIAKOO", phone: "+255746556644" },
      { sn: 8, name: "MAMA SAM SHOP", location: "KARIAKOO", phone: "+255763929820" },
      { sn: 9, name: "GRACE SHOP", location: "KARIAKOO", phone: "+255714675765" },
      { sn: 10, name: "HUSSAISA KID'S PALACE", location: "KATA YA ILALA-MTAA WA ARUSHA", phone: "+255718588588" },
      { sn: 11, name: "MARASHI SHOP", location: "KATA YA ILALA-BUNGONI", phone: "+255777918171" },
      { sn: 12, name: "ROCKY SHOPPING CENTER", location: "KIMANGA", phone: "+255688704876" },
      { sn: 13, name: "WIN KOBE SHOP", location: "KIMANGA", phone: "+255782869984" },
      { sn: 14, name: "MIRIAMU SHOP", location: "KIMANGA", phone: "+255694969636, +255714276967" },
      { sn: 15, name: "BH SUPERMARKET", location: "KINYEREZI GEREJI", phone: "+255653157921" },
      { sn: 16, name: "IKUPA SUPERMARKET", location: "KINYEREZI MWISHO", phone: "+255656892161" },
      { sn: 17, name: "QUALITY 3 SHOP", location: "KITUNDA", phone: "+255717567064" },
      { sn: 18, name: "SAIMONI SHOP", location: "KITUNDA", phone: "+255677888205" },
      { sn: 19, name: "ABDULLAH SHOP", location: "KITUNDA", phone: "+255627800349" },
      { sn: 20, name: "HAMOAL INFANT & BABY COLLECTION", location: "MNYAMANI-VINGUNGUTI", phone: "+255776654543" },
      { sn: 21, name: "MPEMBA SHOP", location: "SEGEREA", phone: "+255714229319" },
      { sn: 22, name: "NEW SABRINA COSMETICS", location: "SEGEREA", phone: "+255654271896" },
      { sn: 23, name: "RAMLA PHARMACY", location: "SEGEREA", phone: "+255768814141" },
      { sn: 24, name: "BABY ESSENTIAL", location: "SEGEREA", phone: "+255759088830" },
      { sn: 25, name: "DAR MUNI PHARMACY", location: "SEGEREA-CHAMA", phone: "+255687512077" },
      { sn: 26, name: "G.P PHARMACY", location: "SEGEREA STAND", phone: "+255624060287" },
      { sn: 27, name: "MROSA SHOP", location: "TABATA-MAGENGENI", phone: "+255788751324" },
    ],
  },
  {
    region: "Dar es Salaam - Kigamboni",
    agents: [
      { sn: 28, name: "BEFRAN SHOP", location: "KIBUGUMO", phone: "+255628357877" },
      { sn: 29, name: "GMK SUPERMARKET", location: "GEZA JUU", phone: "+255785666000" },
      { sn: 30, name: "GIL GAL PHARMACY", location: "GEZA KWA MCHINA", phone: "+255623341216" },
      { sn: 31, name: "SMILE SUPERMARKET", location: "GEZA JUU-MATIKITI HOUSE", phone: "+255784490238" },
      { sn: 32, name: "GEZA DISCOUNT SHOP", location: "GEZA JUU-KWA MCHINA", phone: "+255758282098, +255753372919" },
      { sn: 33, name: "DIAPERING WORLD", location: "KIBADA", phone: "+255715865154" },
      { sn: 34, name: "KIBADA SUPERMARKET", location: "KIBADA", phone: "+255766347584" },
      { sn: 35, name: "MASHARIKI MART SUPERMARKET", location: "KIBADA", phone: "+255683139312" },
      { sn: 36, name: "HAFIDH BABY SHOP", location: "KIGAMBONI FERRY", phone: "+255679689868" },
      { sn: 37, name: "KIBUGUMO MINI SUPERMARKET", location: "KIBUGUMO", phone: "+255786042135" },
      { sn: 38, name: "KIHOGONI SUPERMARKET", location: "MAWENI", phone: "+255763061774" },
      { sn: 39, name: "SEIF SHOP", location: "MAWENI", phone: "+255655580996" },
      { sn: 40, name: "STOP & SHOP SUPERMARKET", location: "MAWENI", phone: "+255788394525" },
      { sn: 41, name: "ZUPERMART SUPERMARKET", location: "MAWENI", phone: "+255762297001" },
      { sn: 42, name: "KIVON SUPERMARKET", location: "MBUTU", phone: "+255654820171" },
      { sn: 43, name: "MPEMBA TOTO SHOP", location: "KIGAMBONI FERRY", phone: "+255653903163" },
      { sn: 44, name: "MSOSE SHOP", location: "TUNGI", phone: "+255652155848" },
    ],
  },
  {
    region: "Dar es Salaam - Kinondoni",
    agents: [
      { sn: 45, name: "G SHOP", location: "BAHARI BEACH", phone: "+255676322488" },
      { sn: 46, name: "MUSA MASHALLAH", location: "BAHARI BEACH", phone: "+255712950268" },
      { sn: 47, name: "RICH MINI SUPERMARKET", location: "BAHARI BEACH", phone: "+255745407417" },
      { sn: 48, name: "ESTER SHOP", location: "BUNJU 'A'", phone: "+255714590074" },
      { sn: 49, name: "MAKONA SHOP", location: "BUNJU", phone: "+255758400697" },
      { sn: 50, name: "TUPENDANE SHOP", location: "BUNJU", phone: "+255716582437" },
      { sn: 51, name: "RAHIM SHOP", location: "KINONDONI", phone: "+255716081261" },
      { sn: 52, name: "TX MARKET SHOP", location: "KINONDONI TX", phone: "+255715403602" },
      { sn: 53, name: "URASSA SHOP", location: "KIJITONYAMA", phone: "+255654057744" },
      { sn: 54, name: "MADALE SUPERMARKET", location: "MADALE", phone: "+255710468872" },
      { sn: 55, name: "HOMEPLUS SUPERMARKET", location: "MADALE", phone: "+255756594695" },
      { sn: 56, name: "HAJI SIMBA SHOP", location: "MAGOMENI MIKUMI DARAJANI", phone: "+255653444403" },
      { sn: 57, name: "KIMARIO SHOP", location: "MAGOMENI MAPIPA", phone: "+255784433107" },
      { sn: 58, name: "MOROCCO PHARMACY", location: "MAGOMENI MAPIPA", phone: "+255784837035" },
      { sn: 59, name: "KIMARIO SHOP", location: "MAGOMENI MAPIPA", phone: "+255784433107" },
      { sn: 60, name: "IKRI SHOP", location: "MAGOMENI MAKUTI", phone: "+255713248757" },
      { sn: 61, name: "MAMA HAKEEM SHOP", location: "MAGOMENI MWEMBECHAI", phone: "+255714147779" },
      { sn: 62, name: "KAGERA BABY SHOP", location: "MAGOMENI KAGERA", phone: "+255742300072, +255656842140" },
      { sn: 63, name: "GOGAM SUPERMARKET", location: "MAKONGO", phone: "+255653287548" },
      { sn: 64, name: "JEMBE SHOP", location: "MAKONGO JUU", phone: "+255764167755" },
      { sn: 65, name: "WIN SHOP", location: "MAKONGO JUU", phone: "+255674459311" },
      { sn: 66, name: "MAMA LILIAN", location: "MAKUMBUSHO - MILLENIUM TOWER", phone: "+255628707296" },
      { sn: 67, name: "YASSIR SUPERMARKET", location: "MASAKI", phone: "+255657601843" },
      { sn: 68, name: "AZIZA SUPERMARKET", location: "MBEZI BEACH-MASSANA", phone: "+255713543489, +255623270749" },
      { sn: 69, name: "MASHALLAH SUPERMARKET", location: "MBEZI BEACH", phone: "+255787037642" },
      { sn: 70, name: "MASSANA SHOP", location: "MBEZI BEACH", phone: "+255684848236" },
      { sn: 71, name: "MVULENI SUPERMARKET", location: "MBEZI BEACH", phone: "+255763104765" },
      { sn: 72, name: "SHAMO TOWER SHOP", location: "MBEZI BEACH", phone: "+255658568208" },
      { sn: 73, name: "M SHOPPING CENTER", location: "MBEZI BEACH", phone: "+255692580029, +255689665448" },
      { sn: 74, name: "LANDE MARKET", location: "MBEZI BEACH KWA ZENA", phone: "+255712535312" },
      { sn: 75, name: "LINCARE SUPERMARKET", location: "MBEZI BEACH KWA ZENA", phone: "+255766603187" },
      { sn: 76, name: "MBEZI SHOP", location: "MBEZI JUU-MAKONDE", phone: "+255717913060" },
      { sn: 77, name: "NEAR SUPERMARKET", location: "MBWENI", phone: "+255757962163" },
      { sn: 78, name: "OSAMA SHOP", location: "MIKOCHENI 'B'", phone: "+255676434309" },
      { sn: 79, name: "OTHMAN SHOP", location: "MIKOCHENI 'B'", phone: "+255623355767" },
      { sn: 80, name: "TWALIB SHOP", location: "MIKOCHENI", phone: "+255784408657" },
      { sn: 81, name: "MACHO SHOP", location: "MSASANI MACHO", phone: "+255772549869" },
      { sn: 82, name: "MSASANI SHOP", location: "MSASANI", phone: "+255673434990" },
      { sn: 83, name: "MWENGI PHARMACY", location: "MWANANYAMALA", phone: "+255764278918" },
      { sn: 84, name: "WATOTO SHOP", location: "MWANANYAMALA", phone: "+255693301111" },
      { sn: 85, name: "BM SUPERMARKET", location: "MWANANYAMALA", phone: "+255714406332" },
      { sn: 86, name: "CHID BABY SHOP", location: "MWANANYAMALA 'A'", phone: "+255715582995" },
      { sn: 87, name: "MATHIAS SHOP", location: "MWENGE SOKONI", phone: "+255764201810" },
      { sn: 88, name: "ELIETI SHOP", location: "MWENGE", phone: "+255717335880" },
      { sn: 89, name: "IBRAHIM SUPERMARKET", location: "NAMANGA", phone: "+255773433370" },
      { sn: 90, name: "JUMEIRAH SHOP", location: "NAMANGA", phone: "+255627615169" },
      { sn: 91, name: "MPEMBA SUPERMARKET", location: "NAMANGA", phone: "+255712213515" },
      { sn: 92, name: "NAMANGA MINI SUPERMARKET", location: "NAMANGA", phone: "+255689160709" },
      { sn: 93, name: "MAMA NEWTON SHOP", location: "SALASALA", phone: "+255659718571" },
      { sn: 94, name: "SALASALA SHOP", location: "SALASALA", phone: "+255748655274" },
      { sn: 95, name: "SALASALA SHOPPING CENTER", location: "SALASALA", phone: "+255692134624" },
      { sn: 96, name: "TINA SHOP", location: "SALASALA", phone: "+255715376148" },
      { sn: 97, name: "CHUTAZ SHOP", location: "SALASALA", phone: "+255712175000" },
      { sn: 98, name: "G COSMETICS", location: "SALASALA", phone: "+255718665581" },
      { sn: 99, name: "TEGETA SHOP", location: "TEGETA NYUKI", phone: "+255752521950" },
      { sn: 100, name: "ISSA BABY SHOP", location: "TEGETA KWA NDEVU", phone: "+255658134900" },
    ],
  },
  {
    region: "Dar es Salaam - Temeke",
    agents: [
      { sn: 101, name: "ANANIA AGENT", location: "BUZA", phone: "+255759561491" },
      { sn: 102, name: "GATCO SHOP", location: "BUZA", phone: "+255767742215" },
      { sn: 103, name: "QUALITY 2 SHOP", location: "BUZA", phone: "+255625628205" },
      { sn: 104, name: "CHAMAZI BABY SHOP", location: "CHAMAZI", phone: "+255758091781" },
      { sn: 105, name: "ABUU SHOP", location: "JETI MWISHO WA LAMI", phone: "+255658289029" },
      { sn: 106, name: "KIJICHI SHOP", location: "KIJICHI", phone: "+255692257928" },
      { sn: 107, name: "MAMA GEBY MINI SUPERMARKET", location: "KIJICHI", phone: "+255715863139" },
      { sn: 108, name: "MASANGURA DIAPER", location: "KIJICHI", phone: "+255659593741" },
      { sn: 109, name: "JOY TOTO SHOP", location: "MAJUMBA SITA", phone: "+255784707957" },
      { sn: 110, name: "MBAGALA GENERAL SHOP", location: "MBAGALA - RANGI TATU", phone: "+255719083674" },
      { sn: 111, name: "SASA KIDS", location: "MBAGALA-KIZUIANI", phone: "+255652932181" },
      { sn: 112, name: "MAMA MUNIRA SHOP", location: "MBAGARA KUU NJIA YA N'GOMBE", phone: "+255714453200" },
      { sn: 113, name: "KIVON SUPERMARKET", location: "MBAGALA ZAKHEM", phone: "+255621371886" },
      { sn: 114, name: "MOHAMMED SHOP", location: "TANDIKA", phone: "+255716348959" },
      { sn: 115, name: "MOHAMMED SHOP", location: "TANDIKA", phone: "+255676885155" },
      { sn: 116, name: "NEW SHOP", location: "TEMEKE-FOMA", phone: "+255657381440" },
      { sn: 117, name: "ZANZIBAR BABY SHOP", location: "TEMEKE FOMA", phone: "+255772846862" },
      { sn: 118, name: "HEKJOSH SHOP", location: "TOANGOMA", phone: "+255687794783" },
      { sn: 119, name: "PEMPASI SHOP", location: "TOANGOMA", phone: "+255713885353" },
      { sn: 120, name: "QUALITY 1 SHOP", location: "JETI RUMO MWISHO WA LAMI", phone: "+255675656777" },
    ],
  },
  {
    region: "Dar es Salaam - Ubungo",
    agents: [
      { sn: 121, name: "GOBA SHOP", location: "GOBA", phone: "+255767282855" },
      { sn: 122, name: "YAMMY YAMI DIAPERS", location: "GOBA", phone: "+255710644456, +255778871000" },
      { sn: 123, name: "GWANZOUH PHARMACY", location: "GOBA", phone: "+255717449116" },
      { sn: 124, name: "ISHIMWE SHOP", location: "GOBA-CENTER", phone: "+255788594857" },
      { sn: 125, name: "KIMOSO SUPERMARKET", location: "GOBA-CENTER", phone: "+255658404575" },
      { sn: 126, name: "LEILA PHARMACY", location: "GOBA-MAGETI", phone: "+255767629633" },
      { sn: 127, name: "MAMA JANELI SHOP", location: "GOBA", phone: "+255763372450" },
      { sn: 128, name: "ZAHORO SHOP", location: "GOBA CENTER", phone: "+255687606349" },
      { sn: 129, name: "KIBWEGERE SUPERMARKET", location: "KIBAMBA-KIBWEGERE", phone: "+255713522577" },
      { sn: 130, name: "KIMARA MINI SUPERMARKET", location: "KIMARA-MWISHO", phone: "+255715809055" },
      { sn: 131, name: "MSAMI SHOP", location: "KIMARA-MWISHO", phone: "+255544274244" },
      { sn: 132, name: "SHABANI BABY SHOP", location: "KIMARA-MWISHO", phone: "+255719641717" },
      { sn: 133, name: "CONSO SHOP", location: "KIMARA-MWISHO", phone: "+255688419904" },
      { sn: 134, name: "SEPI AGENT", location: "MABIBO-SOKONI", phone: "+255754587766" },
      { sn: 135, name: "PRISCA SHOP", location: "MBEZI-MWISHO", phone: "+255719137497" },
      { sn: 136, name: "NAJMA INFANT & BABY STORE", location: "MBEZI-MWISHO", phone: "+255684898080" },
      { sn: 137, name: "REA TOTO SHOP", location: "MBEZI-MWISHO", phone: "+255713966896" },
      { sn: 138, name: "TUKU AGENT", location: "MBEZI-MWISHO", phone: "+255786555573" },
      { sn: 139, name: "YUSUPH SHOP", location: "MBEZI-KWA ROBERT", phone: "+255673580516" },
      { sn: 140, name: "BTOTO SHOP", location: "MBEZI MWISHO", phone: "+255686289448" },
      { sn: 141, name: "SKYMART SUPERMARKET", location: "NJIA PANDA YA TEGETA 'A'", phone: "+255655485155" },
      { sn: 142, name: "ALLEN AGENT", location: "SINZA", phone: "+255714718137" },
      { sn: 143, name: "BOL-V PHARMACY", location: "SINZA PALESTINE", phone: "+255675270557" },
      { sn: 144, name: "KAVISHE SHOP", location: "STOPOVER", phone: "+255759979743" },
      { sn: 145, name: "KAVISHE SHOP", location: "SURVEY", phone: "+255654496994" },
      { sn: 146, name: "GOBA SHOP", location: "GOBA", phone: "+255767282855" },
      { sn: 147, name: "MUMMY KIDS", location: "UBUNGO-MABIBO HOSTEL", phone: "+255712658369" },
    ],
  },
  {
    region: "Pwani",
    agents: [{ sn: 148, name: "KIBAHA SHOP", location: "KIBAHA KWA MATHIAS", phone: "+255718207869" }],
  },
  {
    region: "Mwanza",
    agents: [{ sn: 149, name: "IDA TOTO SHOP", location: "BUSWELU ZEMBELWA", phone: "+255754060920" }],
  },
  {
    region: "Manyara",
    agents: [
      { sn: 150, name: "GS SHOP", location: "N/A", phone: "+255767404635, +255756530299" },
      { sn: 151, name: "HEKIMA SHOP", location: "N/A", phone: "+255768262149" },
    ],
  },
  {
    region: "Dodoma",
    agents: [
      { sn: 152, name: "CHACHA AGENT", location: "CHAKO NI CHAKO", phone: "+255788087628" },
      { sn: 153, name: "DEO WHITE SHOP", location: "CHAKO NI CHAKO", phone: "+255762733752" },
      { sn: 154, name: "UPENDO SHOP", location: "KITASA", phone: "+255678105330" },
      { sn: 155, name: "YAMMY YAMI SHOP", location: "IHUMWA", phone: "+255756465355" },
    ],
  },
  {
    region: "Mbeya",
    agents: [
      { sn: 156, name: "MAMA AMAR SHOP", location: "MWANJERWA SOKONI", phone: "+255627739213" },
      { sn: 157, name: "MAMA CLINTON SHOP", location: "MBEYA MJINI", phone: "+255754277096" },
      { sn: 158, name: "YAMMY YAMI SHOP", location: "MWANJERWA SOKONI", phone: "+255757166260" },
    ],
  },
  {
    region: "Iringa",
    agents: [{ sn: 159, name: "NYAMANDE KITCHEN WARE", location: "IRINGA MJINI-MASHINE TATU", phone: "+255714562559" }],
  },
  {
    region: "Kilimanjaro",
    agents: [
      { sn: 160, name: "ASSENGA COSMETIC SHOP", location: "MOSHI BUS STAND", phone: "+255743461497, +255766552267" },
      { sn: 161, name: "MAJOH AGENT", location: "MOSHI MBUYUNI", phone: "+255715405585" },
    ],
  },
  {
    region: "Arusha",
    agents: [
      { sn: 162, name: "ARUSHA DIAPERS", location: "UWANJA WA FISI", phone: "+255718860760" },
      { sn: 163, name: "MAMA SPARELLT", location: "DARAJA MBILI", phone: "+255655290959" },
      { sn: 164, name: "MAPACHA SHOP", location: "ARUSHA STAND", phone: "+255757041816" },
      { sn: 165, name: "SHEKINAH DIAPERS & BABY STORE", location: "CROCON-SAMUNGE", phone: "+255769888277" },
      { sn: 166, name: "ZALLY COLLECTION", location: "SOKO KUU LA ARUSHA", phone: "+255765750757, +255717347414" },
    ],
  },
  {
    region: "Kianga",
    agents: [{ sn: 167, name: "MAMA YA AGENT", location: "KIANGA", phone: "+255787471230" }],
  },
  {
    region: "Lindi",
    agents: [
      { sn: 168, name: "ARAFA SUPPLIER", location: "MASASI, NACHINGEWA, NDANDA & TUNDURU", phone: "+255655462038" },
    ],
  },
  {
    region: "Morogoro",
    agents: [
      { sn: 169, name: "MIRA DIAPERS", location: "MASIKA", phone: "+255754575027" },
      { sn: 170, name: "ERNEST SHOP", location: "NUNGE", phone: "+255765022538" },
    ],
  },
  {
    region: "Tanga",
    agents: [
      { sn: 171, name: "SHEMHINA SHOP", location: "KOROGWE-MAGUNGA HOSPITAL", phone: "+255754060920" },
      { sn: 172, name: "LAKWETU SHOP", location: "MKWAJUNI", phone: "+255763771161" },
    ],
  },
  {
    region: "Singida",
    agents: [
      { sn: 173, name: "HOSSANA", location: "SINGIDA MJINI NEAR DTB BANK", phone: "+255656252874, +255748480817" },
    ],
  },
  {
    region: "Kenya",
    agents: [{ sn: 174, name: "LINDA SUPPLIER", location: "KISUMU", phone: "+254718829129" }],
  },
]

export default function AgentsListPage() {
  const { language } = useLanguage()
  const t = translations[language]
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Function to handle text download
  const handleTextDownload = () => {
    // Create a link element
    const link = document.createElement("a")

    // Set the href to the text file
    link.href = "/documents/WAKALA_WA_YAMMY_YAMI_DIAPERS.txt"

    // Set the download attribute with a filename
    link.download = "WAKALA_WA_YAMMY_YAMI_DIAPERS.txt"

    // Append the link to the body
    document.body.appendChild(link)

    // Trigger the click event
    link.click()

    // Remove the link from the body
    document.body.removeChild(link)
  }

  // Function to handle PDF download
  const handlePdfDownload = () => {
    try {
      // Always use the full data for PDF generation, not the filtered data
      // This ensures all agents are included in the PDF
      const dataForPdf = agentsByRegion

      // Use a try-catch block specifically for the PDF generation
      try {
        // Generate the PDF
        const doc = generateAgentsPDF(dataForPdf, language as "en" | "sw")

        // Use a more direct approach to trigger download
        doc.save("Yammy_Yami_Agents_List.pdf")
      } catch (pdfError) {
        console.error("PDF Generation Error:", pdfError)

        // Fallback: Create a simple text version if PDF fails
        let textContent = `Yammy Yami Diapers Agents List\n\n`

        dataForPdf.forEach((region) => {
          textContent += `\n${region.region}\n`
          textContent += `${"=".repeat(region.region.length)}\n\n`

          region.agents.forEach((agent) => {
            textContent += `${agent.sn}. ${agent.name} - ${agent.location} - ${agent.phone}\n`
          })
          textContent += "\n"
        })

        // Create a blob from the text content
        const textBlob = new Blob([textContent], { type: "text/plain" })
        const textUrl = URL.createObjectURL(textBlob)

        // Create download link
        const link = document.createElement("a")
        link.href = textUrl
        link.download = "Yammy_Yami_Agents_List.txt"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Clean up
        setTimeout(() => URL.revokeObjectURL(textUrl), 100)

        alert("PDF generation failed. A text file has been downloaded instead.")
      }
    } catch (error) {
      console.error("Overall Error:", error)
      alert("Failed to generate the agents list. Please try again or contact support.")
    }
  }

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Get unique regions for filter dropdown
  const regions = agentsByRegion.map((region) => region.region)

  // Filter agents based on search term and selected region
  const filteredAgentsByRegion = agentsByRegion
    .filter((regionGroup) => selectedRegion === "" || regionGroup.region === selectedRegion)
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

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-full border-yammy-blue/30 focus:border-yammy-blue"
                  />
                </div>

                <div className="w-full md:w-auto">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full rounded-full border-yammy-blue/30 focus:border-yammy-blue px-4 py-2"
                    aria-label={t.regionFilter}
                  >
                    <option value="">{t.allRegions}</option>
                    {regions.map((region, index) => (
                      <option key={index} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-yammy-orange hover:bg-yammy-orange/90 text-white rounded-full flex items-center gap-2 w-full md:w-auto">
                    <Download className="h-4 w-4" />
                    {t.downloadButton}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handlePdfDownload} className="cursor-pointer flex items-center gap-2">
                    <FilePdf className="h-4 w-4" />
                    {t.downloadPdf}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-yammy-dark-blue">
                {t.totalAgents}{" "}
                <span className="font-bold">
                  {filteredAgentsByRegion.reduce((acc, region) => acc + region.agents.length, 0)}
                </span>
              </div>

              {(searchTerm || selectedRegion) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedRegion("")
                  }}
                  className="text-yammy-blue border-yammy-blue/30 hover:bg-yammy-light-blue/10"
                >
                  {t.clearFilters}
                </Button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yammy-blue"></div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

import fs from "fs"
import path from "path"
import { format } from "date-fns"

// Base URL of the website
const BASE_URL = "https://yammyyamidiapers.co.tz"

// Main pages with their priorities and change frequencies
const MAIN_PAGES = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/products", priority: 0.9, changefreq: "daily" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/blog", priority: 0.8, changefreq: "weekly" },
  { path: "/contact", priority: 0.7, changefreq: "monthly" },
  { path: "/pricing", priority: 0.8, changefreq: "weekly" },
  { path: "/agents", priority: 0.8, changefreq: "weekly" },
  { path: "/agents-list", priority: 0.7, changefreq: "weekly" },
  { path: "/projects", priority: 0.6, changefreq: "monthly" },
  { path: "/checkout", priority: 0.5, changefreq: "monthly" },
]

// Product categories
const PRODUCT_CATEGORIES = [
  {
    category: "babyDiapers",
    priority: 0.8,
    changefreq: "weekly",
    image: "/images/baby-diapers.png",
    title: "Yammy Yami Baby Diapers",
  },
  {
    category: "babyPants",
    priority: 0.8,
    changefreq: "weekly",
    image: "/images/baby-diapers.png",
    title: "Yammy Yami Baby Pants",
  },
  {
    category: "adultDiapers",
    priority: 0.8,
    changefreq: "weekly",
    image: "/images/diaper-features.png",
    title: "Yammy Yami Adult Diapers",
  },
  {
    category: "ladyPads",
    priority: 0.8,
    changefreq: "weekly",
    image: "/images/lady-pads.png",
    title: "Yammy Yami Lady Pads",
  },
]

// Team members
const TEAM_MEMBERS = [
  { image: "/images/hassan-new.jpeg", title: "Hassan - Yammy Yami Team" },
  { image: "/images/feisal-new.jpeg", title: "Feisal - Yammy Yami Team" },
  { image: "/images/dericko-moghela.jpeg", title: "Dericko Moghela - Yammy Yami Team" },
]

// Documents
const DOCUMENTS = [
  { path: "/documents/agent-price-list.pdf", priority: 0.5, changefreq: "monthly" },
  { path: "/documents/WAKALA_WA_YAMMY_YAMI_DIAPERS.pdf", priority: 0.5, changefreq: "monthly" },
]

// Main images for pages
const PAGE_IMAGES = {
  "/": [{ loc: "/images/yammy-yami-mother-baby.png", title: "Yammy Yami Diapers" }],
  "/products": [
    { loc: "/images/baby-diapers.png", title: "Yammy Yami Baby Diapers" },
    { loc: "/images/lady-pads.png", title: "Yammy Yami Lady Pads" },
  ],
  "/about": [{ loc: "/confident-leader.png", title: "Yammy Yami Leadership" }],
  "/blog": [{ loc: "/blog-post-concept.png", title: "Yammy Yami Blog" }],
  "/projects": [
    { loc: "/zanzibar-ocean-view.png", title: "Yammy Yami Projects - Zanzibar" },
    { loc: "/football-team-action.png", title: "Yammy Yami Projects - Football Team" },
  ],
}

// Generate sitemap XML
function generateSitemap() {
  const today = format(new Date(), "yyyy-MM-dd")

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`

  // Add main pages
  MAIN_PAGES.forEach((page) => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`

    // Add images for this page if available
    if (PAGE_IMAGES[page.path]) {
      PAGE_IMAGES[page.path].forEach((image) => {
        sitemap += `    <image:image>
      <image:loc>${BASE_URL}${image.loc}</image:loc>
      <image:title>${image.title}</image:title>
    </image:image>
`
      })
    }

    sitemap += `  </url>
`
  })

  // Add product categories
  PRODUCT_CATEGORIES.forEach((category) => {
    sitemap += `  <url>
    <loc>${BASE_URL}/products?category=${category.category}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${category.changefreq}</changefreq>
    <priority>${category.priority}</priority>
    <image:image>
      <image:loc>${BASE_URL}${category.image}</image:loc>
      <image:title>${category.title}</image:title>
    </image:image>
  </url>
`
  })

  // Add team section
  sitemap += `  <url>
    <loc>${BASE_URL}/about#team</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
`

  TEAM_MEMBERS.forEach((member) => {
    sitemap += `    <image:image>
      <image:loc>${BASE_URL}${member.image}</image:loc>
      <image:title>${member.title}</image:title>
    </image:image>
`
  })

  sitemap += `  </url>
`

  // Add documents
  DOCUMENTS.forEach((doc) => {
    sitemap += `  <url>
    <loc>${BASE_URL}${doc.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${doc.changefreq}</changefreq>
    <priority>${doc.priority}</priority>
  </url>
`
  })

  sitemap += `</urlset>`

  // Write sitemap to file
  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap)
  console.log("Sitemap generated successfully!")
}

// Run the generator
generateSitemap()

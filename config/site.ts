export type SiteConfig = {
  name: string
  description: string
  mainNav: {
    title: string
    href: string
  }[]
}

export const siteConfig: SiteConfig = {
  name: "Yammy Yami Diaper",
  description: "High-quality diapers for all family members",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Products",
      href: "/products",
    },
    {
      title: "Agents",
      href: "/agents",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
}

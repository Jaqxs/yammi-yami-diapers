import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageWrapper } from "@/components/page-wrapper"
import { CountUp } from "@/components/count-up"

export const metadata = {
  title: "Projects | Yammy Yami Diapers",
  description:
    "Explore our current and upcoming projects at Yammy Yami Diapers. Learn about our initiatives and sponsorship opportunities.",
}

export default function ProjectsPage() {
  return (
    <PageWrapper>
      <div className="relative bg-gradient-to-b from-yammy-blue/10 to-white">
        <div className="container mx-auto py-16 px-4">
          {/* Hero Section */}
          <div className="relative text-center mb-16 py-12 px-4 bg-gradient-to-r from-yammy-blue/10 to-transparent rounded-xl">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] rounded-xl"></div>
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-yammy-blue mb-4 font-nunito">
                Our <span className="text-yammy-orange">Initiatives</span> & Projects
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                Beyond diapers, we're building a better future through strategic investments and community development
                projects.
              </p>
            </div>
          </div>

          {/* Current Projects Section */}
          <section className="mb-20">
            <div className="flex items-center mb-8">
              <div className="h-1 w-10 bg-yammy-orange mr-3"></div>
              <h2 className="text-3xl font-bold text-yammy-blue font-nunito">Current Projects</h2>
            </div>

            <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative h-[400px] overflow-hidden">
                  <Image
                    src="/zanzibar-ocean-view.png"
                    alt="Zanzibar Land Project"
                    fill
                    className="object-cover brightness-[0.85] transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 bg-yammy-blue/80 text-white py-2 px-4 rounded-tr-lg">
                    <p className="font-semibold">Zanzibar, Tanzania</p>
                  </div>
                </div>

                <CardContent className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-yammy-blue mb-4">Hectare of Land in Zanzibar</h3>
                  <p className="text-gray-700 mb-6">
                    We've acquired strategic land properties in the beautiful island of Zanzibar. This investment
                    represents our commitment to sustainable development and expansion in Tanzania.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-yammy-light-blue/10 p-4 rounded-lg border border-yammy-blue/20">
                      <h4 className="font-semibold text-yammy-blue">Paje, Zanzibar</h4>
                      <p className="text-2xl font-bold text-yammy-blue">63,700 m²</p>
                      <p className="text-sm text-gray-600">Prime coastal location</p>
                    </div>
                    <div className="bg-yammy-orange/10 p-4 rounded-lg border border-yammy-orange/20">
                      <h4 className="font-semibold text-yammy-orange">Kigamboni-Dar es salaam</h4>
                      <p className="text-2xl font-bold text-yammy-orange">9,800 m²</p>
                      <p className="text-sm text-gray-600">Strategic development area</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-yammy-light-blue/20 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-yammy-blue">
                        <CountUp end={73500} />+
                      </p>
                      <p className="text-sm text-gray-600">Total Square Meters</p>
                    </div>
                    <div className="bg-yammy-orange/20 p-4 rounded-lg text-center">
                      <p className="text-3xl font-bold text-yammy-orange">
                        <CountUp end={100} />%
                      </p>
                      <p className="text-sm text-gray-600">Ownership</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6">
                    This property will serve as a foundation for future expansion of our manufacturing capabilities and
                    distribution network.
                  </p>
                  <Button className="w-fit bg-yammy-blue hover:bg-yammy-dark-blue">Learn More</Button>
                </CardContent>
              </div>
            </Card>
          </section>

          {/* Upcoming Projects Section */}
          <section className="mb-20">
            <div className="flex items-center mb-8">
              <div className="h-1 w-10 bg-yammy-pink mr-3"></div>
              <h2 className="text-3xl font-bold text-yammy-blue font-nunito">Upcoming Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Football Club Card */}
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-[250px]">
                  <Image
                    src="/placeholder.svg?key=psok6"
                    alt="Yammy Yami Football Club"
                    fill
                    className="object-cover brightness-[0.85] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Yammy Yami Football Club</h3>
                    <p className="text-white/90">Coming Soon</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">
                    We're establishing a professional football club to compete at the highest levels of Tanzanian
                    football, bringing pride to our community and creating opportunities for talented athletes.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-2 h-2 rounded-full bg-yammy-orange"></div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="border-yammy-blue text-yammy-blue hover:bg-yammy-blue hover:text-white"
                    >
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Football Academy Card */}
              <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-[250px]">
                  <Image
                    src="/placeholder.svg?key=nc9f9"
                    alt="Yammy Yami Football Academy"
                    fill
                    className="object-cover brightness-[0.85] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">Yammy Yami Football Academy</h3>
                    <p className="text-white/90">Coming Soon</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">
                    Our youth academy will nurture the next generation of football talent in Tanzania, providing
                    world-class training, education, and pathways to professional careers.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-2 h-2 rounded-full bg-yammy-pink"></div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className="border-yammy-pink text-yammy-pink hover:bg-yammy-pink hover:text-white"
                    >
                      Coming Soon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Sponsorship Section */}
          <section className="mb-10">
            <div className="flex items-center mb-8">
              <div className="h-1 w-10 bg-yammy-orange mr-3"></div>
              <h2 className="text-3xl font-bold text-yammy-blue font-nunito">Become a Sponsor</h2>
            </div>

            <Card className="overflow-hidden border-none shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CardContent className="p-8 flex flex-col justify-center order-2 lg:order-1">
                  <h3 className="text-2xl font-bold text-yammy-blue mb-4">Partner With Us</h3>
                  <p className="text-gray-700 mb-6">
                    Join Yammy Yami as a sponsor and align your brand with our growing portfolio of impactful projects.
                    We offer various sponsorship tiers with unique benefits and exposure opportunities.
                  </p>
                  <div className="bg-gradient-to-r from-yammy-blue/20 to-yammy-blue/40 p-6 rounded-lg border border-yammy-blue/20 shadow-sm text-yammy-blue mb-6">
                    <h4 className="font-bold text-xl mb-2">Sponsorship Benefits</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yammy-orange mr-2"></div>
                        Brand visibility across our platforms
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yammy-orange mr-2"></div>
                        Access to exclusive events and networking
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yammy-orange mr-2"></div>
                        Community impact and CSR opportunities
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yammy-orange mr-2"></div>
                        Co-branded marketing campaigns
                      </li>
                    </ul>
                  </div>
                  <Link href="/contact">
                    <Button className="w-fit bg-yammy-orange hover:bg-yammy-orange/90">
                      Contact Us About Sponsorship
                    </Button>
                  </Link>
                </CardContent>

                <div className="relative h-[400px] overflow-hidden order-1 lg:order-2">
                  <Image
                    src="/images/fei-toto.jpg"
                    alt="CEO of Yammy Yami"
                    fill
                    className="object-contain brightness-[0.85]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <p className="font-medium text-lg">Message from our CEO</p>
                    <h3 className="text-2xl font-bold mb-2">Feisal Salum</h3>
                    <p className="text-white/90 max-w-md">
                      "We invite visionary partners to join us in our mission to create lasting impact through our
                      projects."
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Call to Action */}
          <div className="text-center mt-16 bg-gradient-to-r from-yammy-light-blue to-yammy-blue p-10 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
            <p className="text-xl mb-6 max-w-2xl mx-auto">
              Whether you're interested in our current projects, excited about our upcoming initiatives, or looking to
              become a sponsor, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-yammy-blue hover:bg-gray-100">Learn More About Our Vision</Button>
              <Link href="/contact">
                <Button className="bg-yammy-orange hover:bg-yammy-orange/90">Contact Our Team</Button>
              </Link>
            </div>
          </div>

          {/* Floating Elements for Style */}
          <div className="absolute top-20 right-10 w-24 h-24 bg-yammy-orange/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-10 w-32 h-32 bg-yammy-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-yammy-pink/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </PageWrapper>
  )
}

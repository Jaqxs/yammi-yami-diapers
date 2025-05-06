import type { Metadata } from "next"
import Link from "next/link"
import { Phone, Download, MapPin, Mail } from "lucide-react"
import { mockAgents } from "@/data/mock-agents"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PageWrapper } from "@/components/page-wrapper"

export const metadata: Metadata = {
  title: "Agents List | Yammy Yami Diapers",
  description: "Find Yammy Yami Diaper agents across Tanzania",
}

export default function AgentsListPage() {
  return (
    <PageWrapper>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">Our Agents Network</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600">
            Find Yammy Yami Diaper agents across Tanzania. Our agents provide quality products and excellent service.
          </p>
        </div>

        {/* Mobile Filter - Simple dropdown for region selection */}
        <div className="mb-6 md:hidden">
          <select
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mobile-input"
            aria-label="Filter agents by region"
          >
            <option value="">All Regions</option>
            <option value="dar-es-salaam">Dar es Salaam</option>
            <option value="arusha">Arusha</option>
            <option value="mwanza">Mwanza</option>
            <option value="zanzibar">Zanzibar</option>
          </select>
        </div>

        {/* Desktop Filter - Tabs for region selection */}
        <div className="hidden md:flex mb-8 border-b">
          <button className="px-6 py-3 font-medium text-blue-600 border-b-2 border-blue-600">All Regions</button>
          <button className="px-6 py-3 font-medium text-gray-500 hover:text-blue-600">Dar es Salaam</button>
          <button className="px-6 py-3 font-medium text-gray-500 hover:text-blue-600">Arusha</button>
          <button className="px-6 py-3 font-medium text-gray-500 hover:text-blue-600">Mwanza</button>
          <button className="px-6 py-3 font-medium text-gray-500 hover:text-blue-600">Zanzibar</button>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {mockAgents.map((agent) => (
            <Card key={agent.id} className="overflow-hidden border border-gray-200 shadow-md">
              <CardHeader className="p-4 bg-blue-50">
                <CardTitle className="text-lg font-bold text-blue-700">{agent.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    {agent.address}, {agent.region}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{agent.phone}</span>
                </div>
                {agent.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{agent.email}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <a
                  href={`tel:${agent.phone.replace(/\s/g, "")}`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 mobile-button"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Agent</span>
                </a>
                <Button variant="outline" className="w-full mobile-button">
                  <Download className="h-4 w-4 mr-2" />
                  <span>Price List</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Agent Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Region
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Address
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{agent.region}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{agent.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{agent.phone}</div>
                    {agent.email && <div className="text-sm text-gray-500">{agent.email}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${agent.phone.replace(/\s/g, "")}`}>
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </a>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Price List
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Want to become an agent? Join our network and grow your business with Yammy Yami Diapers.
          </p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 mobile-button">
            <Link href="/agents">Apply to Become an Agent</Link>
          </Button>
        </div>
      </div>
    </PageWrapper>
  )
}

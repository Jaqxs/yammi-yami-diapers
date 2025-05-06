import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import Link from "next/link"

export default function PriceListPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Yammy Yami Agent Price List</h1>

      <p className="mb-6">You can download our agent price list using the button below:</p>

      <div className="flex flex-col space-y-4">
        <Link href="/documents/agent-price-list.pdf" target="_blank" download>
          <Button className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download Price List (PDF)
          </Button>
        </Link>

        <p className="text-sm text-muted-foreground">
          If the download button doesn't work, you can also{" "}
          <Link href="/documents/agent-price-list.pdf" target="_blank" className="text-primary underline">
            view the price list in your browser
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

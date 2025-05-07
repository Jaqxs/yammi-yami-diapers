import jsPDF from "jspdf"
import "jspdf-autotable"

// Define the type for the agent data
interface Agent {
  sn: number
  name: string
  location: string
  phone: string
}

interface RegionGroup {
  region: string
  agents: Agent[]
}

// Function to generate PDF from agents data
export function generateAgentsPDF(agentsByRegion: RegionGroup[], language: "en" | "sw") {
  try {
    // Create a new PDF document with more explicit configuration
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    // Set font size and style
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")

    // Add title
    const title = language === "en" ? "Yammy Yami Diapers Agents List" : "Orodha ya Wakala wa Yammy Yami Diapers"
    doc.text(title, 105, 15, { align: "center" })

    // Set initial y position
    let yPos = 25

    // Column headers
    const headers =
      language === "en"
        ? [["S/N", "Agent Name", "Location", "Phone Number"]]
        : [["Na.", "Jina la Wakala", "Eneo", "Namba ya Simu"]]

    // Process each region
    agentsByRegion.forEach((regionGroup) => {
      // Add region header
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")

      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage()
        yPos = 15
      }

      doc.text(regionGroup.region, 14, yPos)
      yPos += 10

      // Add table for this region
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      // Prepare data for this region
      const data = regionGroup.agents.map((agent) => [agent.sn.toString(), agent.name, agent.location, agent.phone])

      try {
        // Add table with explicit error handling
        // @ts-ignore - jspdf-autotable extends jsPDF but TypeScript doesn't know about it
        doc.autoTable({
          head: headers,
          body: data,
          startY: yPos,
          margin: { top: 10, right: 10, left: 10, bottom: 10 },
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          alternateRowStyles: { fillColor: [240, 240, 240] },
          tableWidth: "auto",
          columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: "auto" },
            2: { cellWidth: "auto" },
            3: { cellWidth: "auto" },
          },
          didDrawPage: (data) => {
            // Add page number at the bottom
            doc.setFontSize(8)
            doc.text(`Page ${doc.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 10)
          },
        })
      } catch (tableError) {
        console.error("Error creating table for region:", regionGroup.region, tableError)
        // Continue with the next region if a table fails
      }

      // @ts-ignore - accessing lastAutoTable which is added by the plugin
      yPos = doc.lastAutoTable?.finalY + 10 || yPos + 10
    })

    // Add footer with total count
    const totalAgents = agentsByRegion.reduce((acc, region) => acc + region.agents.length, 0)
    const totalText = language === "en" ? `Total Agents: ${totalAgents}` : `Jumla ya Wakala: ${totalAgents}`

    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text(totalText, 14, doc.internal.pageSize.height - 20)

    return doc
  } catch (error) {
    console.error("PDF Generation Error:", error)
    throw new Error("Failed to generate PDF: " + (error instanceof Error ? error.message : String(error)))
  }
}

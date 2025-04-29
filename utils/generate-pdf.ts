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
  // Create a new PDF document
  const doc = new jsPDF()

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

    // Add table
    // @ts-ignore - jspdf-autotable extends jsPDF but TypeScript doesn't know about it
    doc.autoTable({
      head: headers,
      body: data,
      startY: yPos,
      margin: { top: 10 },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    })

    // @ts-ignore - accessing lastAutoTable which is added by the plugin
    yPos = doc.lastAutoTable.finalY + 10
  })

  return doc
}

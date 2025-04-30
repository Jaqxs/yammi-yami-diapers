import type { Metadata } from "next"
import AgentClientPage from "./AgentClientPage"

export const metadata: Metadata = {
  title: "Become an Agent | Yammy Yami Diapers",
  description: "Join our network of agents and distributors. Access exclusive pricing and resources.",
}

export default function AgentsPage() {
  return <AgentClientPage />
}

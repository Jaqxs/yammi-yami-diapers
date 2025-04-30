"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Search, X, Edit } from "lucide-react"
import { useStore, type Agent } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// List of regions for the dropdown
const regions = [
  "DAR ES SALAAM - ILALA",
  "DAR ES SALAAM - KIGAMBONI",
  "DAR ES SALAAM - KINONDONI",
  "DAR ES SALAAM - TEMEKE",
  "DAR ES SALAAM - UBUNGO",
  "PWANI",
  "MWANZA",
  "MANYARA",
  "DODOMA",
  "MBEYA",
  "IRINGA",
  "KILIMANJARO",
  "ARUSHA",
  "MTWARA",
  "LINDI",
  "MOROGORO",
  "TANGA",
  "SONGWE",
  "SINGIDA",
  "KENYA",
]

export default function AgentsPage() {
  const { state, loadAgents, addAgent, updateAgent, deleteAgent } = useStore()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newAgent, setNewAgent] = useState({
    name: "",
    location: "",
    phone: "",
    region: "",
  })
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadAgents()
  }, [loadAgents])

  if (!mounted) return null

  // Filter agents based on search term
  const filteredAgents = state.agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle adding a new agent
  const handleAddAgent = async () => {
    try {
      // Validate form
      if (!newAgent.name || !newAgent.location || !newAgent.phone || !newAgent.region) {
        toast({
          title: "Validation Error",
          description: "All fields are required",
          variant: "destructive",
        })
        return
      }

      await addAgent(newAgent)
      setIsAddDialogOpen(false)
      setNewAgent({
        name: "",
        location: "",
        phone: "",
        region: "",
      })
      toast({
        title: "Agent Added",
        description: "The agent has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add agent",
        variant: "destructive",
      })
    }
  }

  // Handle editing an agent
  const handleEditAgent = async () => {
    try {
      if (!editingAgent) return

      // Validate form
      if (!editingAgent.name || !editingAgent.location || !editingAgent.phone || !editingAgent.region) {
        toast({
          title: "Validation Error",
          description: "All fields are required",
          variant: "destructive",
        })
        return
      }

      await updateAgent(editingAgent)
      setIsEditDialogOpen(false)
      setEditingAgent(null)
      toast({
        title: "Agent Updated",
        description: "The agent information has been updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      })
    }
  }

  // Handle deleting an agent
  const handleDeleteAgent = async () => {
    if (deleteId === null) return

    try {
      await deleteAgent(deleteId)
      setIsDeleteDialogOpen(false)
      setDeleteId(null)
      toast({
        title: "Agent Deleted",
        description: "The agent has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      })
    }
  }

  // Open edit dialog with agent data
  const openEditDialog = (agent: Agent) => {
    setEditingAgent({ ...agent })
    setIsEditDialogOpen(true)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-yammy-dark-blue font-bubblegum">Agents</h1>
        <p className="text-muted-foreground">Manage your agents and distributors.</p>
      </div>

      <Card className="mt-6 border-yammy-blue/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Agents List</CardTitle>
            <CardDescription>Manage your agents across all regions</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yammy-blue hover:bg-yammy-blue/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Agent</DialogTitle>
                <DialogDescription>Enter the details of the new agent below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                    placeholder="Enter agent name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newAgent.location}
                    onChange={(e) => setNewAgent({ ...newAgent, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newAgent.phone}
                    onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="region">Region</Label>
                  <Select
                    value={newAgent.region}
                    onValueChange={(value) => setNewAgent({ ...newAgent, region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-yammy-blue hover:bg-yammy-blue/90" onClick={handleAddAgent}>
                  Add Agent
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            {searchTerm && (
              <Button variant="ghost" size="icon" onClick={() => setSearchTerm("")} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No agents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>{agent.id}</TableCell>
                      <TableCell>{agent.name}</TableCell>
                      <TableCell>{agent.location}</TableCell>
                      <TableCell>{agent.phone}</TableCell>
                      <TableCell>{agent.region}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => openEditDialog(agent)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <AlertDialog
                            open={isDeleteDialogOpen && deleteId === agent.id}
                            onOpenChange={(open) => {
                              setIsDeleteDialogOpen(open)
                              if (!open) setDeleteId(null)
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => {
                                  setDeleteId(agent.id)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this agent? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteAgent}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>Update the agent's information below.</DialogDescription>
          </DialogHeader>
          {editingAgent && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Agent Name</Label>
                <Input
                  id="edit-name"
                  value={editingAgent.name}
                  onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  placeholder="Enter agent name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingAgent.location}
                  onChange={(e) => setEditingAgent({ ...editingAgent, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editingAgent.phone}
                  onChange={(e) => setEditingAgent({ ...editingAgent, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-region">Region</Label>
                <Select
                  value={editingAgent.region}
                  onValueChange={(value) => setEditingAgent({ ...editingAgent, region: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-yammy-blue hover:bg-yammy-blue/90" onClick={handleEditAgent}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

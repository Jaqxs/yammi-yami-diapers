"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Database, CheckCircle, Circle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function NeonSetupGuide() {
  const { toast } = useToast()
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    })
  }

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
  }

  const steps = [
    {
      id: 1,
      title: "Create Neon Account",
      description: "Sign up for a free Neon account",
      action: "Visit neon.tech and create account",
      link: "https://neon.tech",
    },
    {
      id: 2,
      title: "Create New Project",
      description: "Create a new project for Yammy Yami Diapers",
      action: "Click 'New Project' in Neon dashboard",
    },
    {
      id: 3,
      title: "Get Connection String",
      description: "Copy your database connection string",
      action: "Go to Dashboard → Connection Details → Copy connection string",
    },
    {
      id: 4,
      title: "Add to Environment Variables",
      description: "Add the connection string to your project",
      action: "Add DATABASE_URL to your environment variables",
      code: "DATABASE_URL=postgresql://username:password@host/database",
    },
    {
      id: 5,
      title: "Run Database Setup",
      description: "Execute the SQL script to create tables and data",
      action: "Copy and run the SQL script in Neon SQL Editor",
    },
    {
      id: 6,
      title: "Test Connection",
      description: "Verify everything is working",
      action: "Use the admin dashboard to test the connection",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Neon Database Setup Guide
          </CardTitle>
          <CardDescription>
            Follow these steps to set up your dedicated Neon PostgreSQL database for Yammy Yami Diapers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <Button variant="ghost" size="sm" onClick={() => markStepComplete(step.id)} className="mt-0 p-1">
                  {completedSteps.includes(step.id) ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </Button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Step {step.id}</Badge>
                    <h3 className="font-medium">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <p className="text-sm font-medium text-blue-600">{step.action}</p>

                  {step.code && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono flex items-center justify-between">
                      <span>{step.code}</span>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(step.code!)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {step.link && (
                    <Button size="sm" variant="outline" className="mt-2" asChild>
                      <a href={step.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open {step.title}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-6">
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> After completing these steps, your Yammy Yami website will use a dedicated
              PostgreSQL database instead of mock data. This provides better performance, data persistence, and
              scalability.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits of Neon Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">✅ Advantages</h4>
              <ul className="text-sm space-y-1">
                <li>• Real database persistence</li>
                <li>• Better performance</li>
                <li>• Scalable architecture</li>
                <li>• Backup and recovery</li>
                <li>• Production-ready</li>
                <li>• Free tier available</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">🚀 Features</h4>
              <ul className="text-sm space-y-1">
                <li>• PostgreSQL compatibility</li>
                <li>• Automatic scaling</li>
                <li>• Branching for development</li>
                <li>• Point-in-time recovery</li>
                <li>• Connection pooling</li>
                <li>• SSL encryption</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

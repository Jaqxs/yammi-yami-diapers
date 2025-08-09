"use client"

import { useState } from "react"
import { Bold, Italic, List, ListOrdered, Link, ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mode, setMode] = useState<"visual" | "html">("visual")

  // This is a simplified rich text editor for demo purposes
  // In a real app, you would use a proper rich text editor library

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Link className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <div className="border-l h-6 mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Tabs value={mode} onValueChange={(value) => setMode(value as "visual" | "html")}>
          <TabsList className="h-8">
            <TabsTrigger value="visual" className="text-xs px-2 py-1">
              Visual
            </TabsTrigger>
            <TabsTrigger value="html" className="text-xs px-2 py-1">
              HTML
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-2">
        <textarea
          className="w-full min-h-[200px] p-2 focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your content here..."
        />
      </div>
    </div>
  )
}

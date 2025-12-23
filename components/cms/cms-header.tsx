"use client"

import { Plus, ChevronDown, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CMSHeaderProps {
  onCreateCollection: () => void
  onImportData: () => void
  onExportData: () => void
}

export function CMSHeader({ onCreateCollection, onImportData, onExportData }: CMSHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground"> FC Mobile Forum CMS</h1>
          <p className="text-sm text-muted-foreground">Store and manage content to display anywhere on your site.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              More Actions
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onImportData}>Import Data</DropdownMenuItem>
            <DropdownMenuItem onClick={onExportData}>Export All Collections</DropdownMenuItem>
            <DropdownMenuItem>Bulk Edit</DropdownMenuItem>
            <DropdownMenuItem>API Documentation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onCreateCollection} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Create Collection
        </Button>
      </div>
    </header>
  )
}

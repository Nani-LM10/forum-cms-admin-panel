"use client"

import { MoreHorizontal, Trash2, Edit, Copy, FileDown } from "lucide-react"
import type { Collection } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface CollectionCardProps {
  collection: Collection
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function CollectionCard({ collection, onClick, onEdit, onDelete, onDuplicate }: CollectionCardProps) {
  return (
    <div
      className="group relative flex h-32 cursor-pointer flex-col justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-medium text-foreground uppercase tracking-wide text-sm">{collection.name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Collection
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-primary">
        {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
      </p>
    </div>
  )
}

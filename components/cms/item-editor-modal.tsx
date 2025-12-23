"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Collection, CollectionItem, Field } from "@/lib/types"

interface ItemEditorModalProps {
  open: boolean
  onClose: () => void
  collection: Collection
  item?: CollectionItem | null
  onSubmit: (data: Record<string, unknown>) => void
}

export function ItemEditorModal({ open, onClose, collection, item, onSubmit }: ItemEditorModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (item) {
      setFormData(item.data)
    } else {
      const initialData: Record<string, unknown> = {}
      collection.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialData[field.key] = field.defaultValue
        } else {
          switch (field.type) {
            case "boolean":
              initialData[field.key] = false
              break
            case "number":
              initialData[field.key] = 0
              break
            default:
              initialData[field.key] = ""
          }
        }
      })
      setFormData(initialData)
    }
  }, [item, collection])

  const updateField = (key: string, value: unknown) => {
    setFormData({ ...formData, [key]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const renderFieldInput = (field: Field) => {
    const value = formData[field.key]

    switch (field.type) {
      case "text":
      case "url":
      case "email":
      case "reference":
        return (
          <Input
            type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
            value={String(value || "")}
            onChange={(e) => updateField(field.key, e.target.value)}
            required={field.required}
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={Number(value) || 0}
            onChange={(e) => updateField(field.key, Number(e.target.value))}
            required={field.required}
          />
        )
      case "boolean":
        return (
          <div className="flex items-center gap-2">
            <Switch checked={Boolean(value)} onCheckedChange={(checked) => updateField(field.key, checked)} />
            <span className="text-sm text-muted-foreground">{value ? "Yes" : "No"}</span>
          </div>
        )
      case "date":
        return (
          <Input
            type="datetime-local"
            value={value ? new Date(String(value)).toISOString().slice(0, 16) : ""}
            onChange={(e) => updateField(field.key, new Date(e.target.value).toISOString())}
            required={field.required}
          />
        )
      case "image":
        return (
          <div className="space-y-2">
            <Input
              type="url"
              value={String(value || "")}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder="Enter image URL"
              required={field.required}
            />
            {value && (
              <img
                src={String(value) || "/placeholder.svg"}
                alt="Preview"
                className="h-24 w-24 rounded-lg object-cover border border-border"
              />
            )}
            <Button type="button" variant="outline" size="sm">
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </div>
        )
      case "richtext":
        return (
          <Textarea
            value={String(value || "")}
            onChange={(e) => updateField(field.key, e.target.value)}
            rows={6}
            required={field.required}
            placeholder="Enter rich text content..."
          />
        )
      default:
        return (
          <Input
            type="text"
            value={String(value || "")}
            onChange={(e) => updateField(field.key, e.target.value)}
            required={field.required}
          />
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {collection.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.key} className="flex items-center gap-2">
                {field.name}
                {field.required && <span className="text-destructive">*</span>}
              </Label>
              {renderFieldInput(field)}
            </div>
          ))}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{item ? "Save Changes" : "Create Item"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

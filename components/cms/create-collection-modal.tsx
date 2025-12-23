"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Field } from "@/lib/types"

interface CreateCollectionModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; slug: string; fields: Omit<Field, "id">[] }) => void
  editData?: { name: string; slug: string; fields: Field[] } | null
}

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "image", label: "Image" },
  { value: "richtext", label: "Rich Text" },
  { value: "url", label: "URL" },
  { value: "email", label: "Email" },
  { value: "reference", label: "Reference" },
]

export function CreateCollectionModal({ open, onClose, onSubmit, editData }: CreateCollectionModalProps) {
  const [name, setName] = useState(editData?.name || "")
  const [slug, setSlug] = useState(editData?.slug || "")
  const [fields, setFields] = useState<Omit<Field, "id">[]>(
    editData?.fields.map(({ id, ...rest }) => rest) || [{ name: "Title", key: "title", type: "text", required: true }],
  )

  const handleNameChange = (value: string) => {
    setName(value)
    if (!editData) {
      setSlug(
        value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
      )
    }
  }

  const addField = () => {
    setFields([...fields, { name: "", key: "", type: "text", required: false }])
  }

  const updateField = (index: number, updates: Partial<Omit<Field, "id">>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    if (updates.name && !editData) {
      newFields[index].key = updates.name
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "")
    }
    setFields(newFields)
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, slug, fields })
    setName("")
    setSlug("")
    setFields([{ name: "Title", key: "title", type: "text", required: true }])
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Collection" : "Create New Collection"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Blog Posts"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g., blog-posts"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Fields</Label>
              <Button type="button" variant="outline" size="sm" onClick={addField}>
                <Plus className="mr-2 h-4 w-4" />
                Add Field
              </Button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-border bg-accent/50 p-3">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <Input
                      value={field.name}
                      onChange={(e) => updateField(index, { name: e.target.value })}
                      placeholder="Field name"
                      required
                    />
                    <Input
                      value={field.key}
                      onChange={(e) => updateField(index, { key: e.target.value })}
                      placeholder="Field key"
                      required
                    />
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(index, { type: value as Field["type"] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">Required</Label>
                    <Switch
                      checked={field.required}
                      onCheckedChange={(checked) => updateField(index, { required: checked })}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{editData ? "Save Changes" : "Create Collection"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

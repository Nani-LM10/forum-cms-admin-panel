"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import type { Collection, Field } from "@/lib/types"

interface FieldManagerModalProps {
  open: boolean
  onClose: () => void
  collection: Collection
  onAddField: (field: Omit<Field, "id">) => void
  onUpdateField: (fieldId: string, data: Partial<Field>) => void
  onDeleteField: (fieldId: string) => void
}

const fieldTypes = [
  { value: "text", label: "Text", icon: "Aa" },
  { value: "number", label: "Number", icon: "#" },
  { value: "boolean", label: "Boolean", icon: "✓" },
  { value: "date", label: "Date", icon: "📅" },
  { value: "image", label: "Image", icon: "🖼" },
  { value: "richtext", label: "Rich Text", icon: "¶" },
  { value: "url", label: "URL", icon: "🔗" },
  { value: "email", label: "Email", icon: "@" },
  { value: "reference", label: "Reference", icon: "→" },
]

export function FieldManagerModal({
  open,
  onClose,
  collection,
  onAddField,
  onUpdateField,
  onDeleteField,
}: FieldManagerModalProps) {
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [newField, setNewField] = useState<Omit<Field, "id">>({
    name: "",
    key: "",
    type: "text",
    required: false,
  })
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddField = () => {
    if (newField.name && newField.key) {
      onAddField(newField)
      setNewField({ name: "", key: "", type: "text", required: false })
      setShowAddForm(false)
    }
  }

  const handleNameChange = (value: string) => {
    setNewField({
      ...newField,
      name: value,
      key: value
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, ""),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Fields - {collection.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Existing Fields */}
          <div className="space-y-2">
            {collection.fields.map((field) => (
              <div key={field.id} className="flex items-center gap-3 rounded-lg border border-border bg-accent/30 p-3">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{field.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {field.type}
                    </Badge>
                    {field.required && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{field.key}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setEditingField(field)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteField(field.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Field Form */}
          {showAddForm ? (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4">
              <h4 className="font-medium">Add New Field</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Field Name</Label>
                  <Input
                    value={newField.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field Key</Label>
                  <Input
                    value={newField.key}
                    onChange={(e) => setNewField({ ...newField, key: e.target.value })}
                    placeholder="e.g., description"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select
                    value={newField.type}
                    onValueChange={(value) => setNewField({ ...newField, type: value as Field["type"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span className="text-xs">{type.icon}</span>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Required</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch
                      checked={newField.required}
                      onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                    />
                    <span className="text-sm text-muted-foreground">{newField.required ? "Required" : "Optional"}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddField}>Add Field</Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Field
            </Button>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Done</Button>
        </div>

        {/* Edit Field Dialog */}
        {editingField && (
          <Dialog open={!!editingField} onOpenChange={() => setEditingField(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Field</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Field Name</Label>
                  <Input
                    value={editingField.name}
                    onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select
                    value={editingField.type}
                    onValueChange={(value) => setEditingField({ ...editingField, type: value as Field["type"] })}
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
                  <Switch
                    checked={editingField.required}
                    onCheckedChange={(checked) => setEditingField({ ...editingField, required: checked })}
                  />
                  <Label>Required</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingField(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      onUpdateField(editingField.id, editingField)
                      setEditingField(null)
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}

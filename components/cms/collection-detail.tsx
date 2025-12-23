import React, { useState } from "react"
import {
  ChevronRight,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Settings,
  Download,
  Upload,
  RefreshCw,
  TableIcon,
  Hash,
  Type,
  ImageIcon,
  Calendar,
  ToggleLeft,
  Link,
  Mail,
  FileText,
  ArrowRight,
  ChevronDown,
  Key,
  GripVertical,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { Collection, CollectionItem } from "@/lib/types"

interface CollectionDetailProps {
  collection: Collection
  items: CollectionItem[]
  onBack: () => void
  onAddItem: () => void
  onEditItem: (item: CollectionItem) => void
  onDeleteItem: (item: CollectionItem) => void
  onManageFields: () => void
  onAddField: () => void
  onQuickAdd?: () => void
  onInlineUpdate?: (item: CollectionItem, key: string, value: unknown) => Promise<void>
  onImportItems?: (items: Record<string, unknown>[]) => Promise<void>
}

const fieldTypeIcons: Record<string, React.ReactNode> = {
  text: <Type className="h-3.5 w-3.5" />,
  number: <Hash className="h-3.5 w-3.5" />,
  boolean: <ToggleLeft className="h-3.5 w-3.5" />,
  date: <Calendar className="h-3.5 w-3.5" />,
  image: <ImageIcon className="h-3.5 w-3.5" />,
  richtext: <FileText className="h-3.5 w-3.5" />,
  url: <Link className="h-3.5 w-3.5" />,
  email: <Mail className="h-3.5 w-3.5" />,
  reference: <ArrowRight className="h-3.5 w-3.5" />,
}

export function CollectionDetail({
  collection,
  items,
  onBack,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onManageFields,
  onAddField,
  onQuickAdd,
  onInlineUpdate,
  onImportItems,
}: CollectionDetailProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [activeView, setActiveView] = useState("default")
  const [editingCell, setEditingCell] = useState<{ itemId: string; fieldKey: string } | null>(null)
  const importInputRef = React.useRef<HTMLInputElement>(null)

  // Focus input when editing starts
  const inputRef = (node: HTMLInputElement | null) => {
    if (node) {
      node.focus()
    }
  }

  const filteredItems = items.filter((item) =>
    Object.values(item.data).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => item.id))
    }
  }

  const toggleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const formatCellValue = (value: unknown, type: string): React.ReactNode => {
    if (value === null || value === undefined || value === "") return <span className="text-muted-foreground">-</span>
    switch (type) {
      case "boolean":
        return <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>
      case "date":
        return new Date(String(value)).toLocaleDateString()
      case "image":
        return (
          <img
            src={String(value) || "/placeholder.svg"}
            alt=""
            className="h-8 w-8 rounded object-cover border border-border"
          />
        )
      case "richtext":
        return <span className="line-clamp-1 max-w-[150px]">{String(value).replace(/<[^>]*>/g, "")}</span>
      case "number":
        return <span className="font-mono">{String(value)}</span>
      default:
        return <span className="line-clamp-1 max-w-[150px]">{String(value)}</span>
    }
  }

  const primaryField = collection.fields.find((f) => f.isPrimary) || collection.fields[0]

  const handleExportCSV = () => {
    // Header row
    const headers = collection.fields.map((f) => f.name).join(",")

    // Data rows
    const rows = items.map((item) => {
      return collection.fields
        .map((field) => {
          let value = item.data[field.key]
          if (value === null || value === undefined) value = ""

          // Escape quotes and wrap in quotes if contains comma or quote
          const stringValue = String(value)
          if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        .join(",")
    })

    const csvContent = [headers, ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${collection.slug}_export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success("Export downloaded")
  }

  const handleImportClick = () => {
    importInputRef.current?.click()
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !onImportItems) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target?.result as string
      if (!text) return

      try {
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "")
        if (lines.length < 2) {
          toast.error("CSV file must have a header row and at least one data row")
          return
        }

        const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))
        const fieldMap: Record<number, string> = {}

        // Map headers to field keys
        headers.forEach((header, index) => {
          const field = collection.fields.find(
            (f) => f.name.toLowerCase() === header.toLowerCase() || f.key.toLowerCase() === header.toLowerCase()
          )
          if (field) {
            fieldMap[index] = field.key
          }
        })

        const newItems: Record<string, unknown>[] = []

        for (let i = 1; i < lines.length; i++) {
          // Robust regex split for CSV to handle quoted commas
          // Matches: "quoted string" OR non-comma-sequence
          const rowData: string[] = []
          const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g
          let match
          while ((match = regex.exec(lines[i])) !== null) {
            // Index 1 is quoted value (unescape double quotes), Index 2 is unquoted value
            let val = match[1] ? match[1].replace(/""/g, '"') : match[2]
            rowData.push(val)
          }
          // The regex might push an empty string at the end loop or behave slightly off depending on engine, 
          // simpler split for now if we assume simple CSV to avoid complexity, but let's try to stick to a slightly simpler logic or just standard split if regex fails.
          // Fallback to simple split for robustness in this environment
          const rowValues = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)

          const itemData: Record<string, unknown> = {}
          rowValues.forEach((val, index) => {
            const key = fieldMap[index]
            if (key) {
              // Clean quotes if start/end
              let paramValue = val.trim().replace(/^"|"$/g, "").replace(/""/g, '"')
              itemData[key] = paramValue
            }
          })

          if (Object.keys(itemData).length > 0) {
            newItems.push(itemData)
          }
        }

        if (newItems.length > 0) {
          await onImportItems(newItems)
          toast.success(`Imported ${newItems.length} items`)
        } else {
          toast.warning("No valid items found to import")
        }
      } catch (err) {
        console.error("Import error:", err)
        toast.error("Failed to parse CSV file")
      }

      // Reset input
      if (importInputRef.current) importInputRef.current.value = ""
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <input
        type="file"
        ref={importInputRef}
        onChange={handleImportFile}
        accept=".csv"
        className="hidden"
      />
      {/* Breadcrumb - fixed height */}
      <div className="flex items-center gap-2 text-sm flex-shrink-0">
        <button onClick={onBack} className="text-primary hover:underline font-medium">
          CMS
        </button>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">{collection.name}</span>
      </div>

      {/* Header - fixed height */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h1 className="text-3xl font-bold text-foreground">{collection.name}</h1>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                More Actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onManageFields}>
                <Settings className="mr-2 h-4 w-4" />
                Manage Fields
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Import CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={onAddItem} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Info banner - fixed height */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex-shrink-0">
        <p className="text-sm text-amber-900">
          You can add <strong>{4000 - items.length}</strong> more items across all your collections under this plan. To
          get more items,{" "}
          <a href="#" className="text-primary underline hover:no-underline">
            upgrade your site
          </a>
          .
        </p>
      </div>

      {/* View tabs - fixed height */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${activeView === "default"
            ? "border-primary bg-primary/5 text-primary"
            : "border-border bg-card hover:bg-accent"
            }`}
          onClick={() => setActiveView("default")}
        >
          <span className="block">Default view</span>
          <span className="text-xs text-muted-foreground">{items.length} items</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-sm text-primary hover:bg-accent transition-colors">
          <Plus className="h-4 w-4" />
          New View
        </button>
      </div>

      {/* Toolbar - fixed height */}
      <div className="flex items-center justify-between gap-4 py-2 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-medium text-sm">Default view</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-8 bg-transparent">
                <TableIcon className="h-4 w-4" />
                Table
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <TableIcon className="mr-2 h-4 w-4" />
                Table
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ImageIcon className="mr-2 h-4 w-4" />
                Gallery
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="gap-2 h-8 text-primary">
            <RefreshCw className="h-4 w-4" />
            Refresh order
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 bg-transparent" onClick={onManageFields}>
            Manage Fields
          </Button>
          <Button variant="outline" size="sm" className="h-8 bg-transparent">
            Sort
          </Button>
          <Button variant="outline" size="sm" className="h-8 bg-transparent">
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-8 bg-transparent">
            Mirror on Site
          </Button>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="h-8 w-40 pl-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions - fixed height when visible */}
      {selectedItems.length > 0 && (
        <div className="flex items-center gap-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 flex-shrink-0">
          <span className="text-sm font-medium">
            {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              selectedItems.forEach((id) => {
                const item = items.find((i) => i.id === id)
                if (item) onDeleteItem(item)
              })
              setSelectedItems([])
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-auto flex-1 cms-table-scroll">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-10 border-r border-border left-0 bg-muted/30 z-10">
                  <Checkbox
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="mx-5"
                  />
                </TableHead>
                <TableHead className="w-12 border-r border-border text-center text-muted-foreground left-10 bg-muted/30 z-10 px-5">
                  # srno
                </TableHead>
                {collection.fields.map((field) => (
                  <TableHead key={field.id} className="border-r border-border min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{fieldTypeIcons[field.type]}</span>
                      <span>{field.name}</span>
                      {field.isPrimary && <Key className="h-3 w-3 text-amber-500" title="Primary field" />}
                    </div>
                  </TableHead>
                ))}
                <TableHead className="w-28 text-primary right-0 bg-muted/30 z-10">
                  <button
                    onClick={onAddField}
                    className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Add Field
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={collection.fields.length + 3} className="h-32 text-center">
                    <p className="text-muted-foreground">
                      {searchQuery ? "No items found matching your search." : "No items yet. Add your first item!"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item, index) => (
                  <TableRow key={item.id} className="group hover:bg-accent/50">
                    <TableCell
                      className="border-r border-border left-0 bg-card group-hover:bg-accent/50 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1">
                        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => toggleSelectItem(item.id)}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-border text-center text-muted-foreground text-sm  left-10 bg-card group-hover:bg-accent/50 z-10">
                      {index + 1}
                    </TableCell>
                    {collection.fields.map((field) => (
                      <TableCell
                        key={field.id}
                        className="border-r border-border cursor-pointer min-w-[150px]"
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          if (onInlineUpdate) {
                            setEditingCell({ itemId: item.id, fieldKey: field.key })
                          }
                        }}
                      >
                        {editingCell?.itemId === item.id && editingCell?.fieldKey === field.key ? (
                          <div onClick={(e) => e.stopPropagation()}>
                            {field.type === "boolean" ? (
                              <Select
                                defaultValue={String(item.data[field.key]) === "true" ? "true" : "false"}
                                onValueChange={async (value) => {
                                  if (onInlineUpdate) {
                                    await onInlineUpdate(item, field.key, value === "true")
                                    setEditingCell(null)
                                  }
                                }}
                                defaultOpen={true}
                              >
                                <SelectTrigger className="h-8 w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Yes</SelectItem>
                                  <SelectItem value="false">No</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : field.type === "date" ? (
                              <Popover open={true} onOpenChange={() => setEditingCell(null)}>
                                <PopoverTrigger asChild>
                                  <div className="h-8 w-full flex items-center px-2 border rounded-md text-sm cursor-pointer">
                                    {item.data[field.key] ? format(new Date(String(item.data[field.key])), "PPP") : "Pick date"}
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={item.data[field.key] ? new Date(String(item.data[field.key])) : undefined}
                                    onSelect={async (date) => {
                                      if (date && onInlineUpdate) {
                                        await onInlineUpdate(item, field.key, date.toISOString())
                                        setEditingCell(null)
                                      }
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            ) : field.type === "image" ? (
                              <Popover open={true} onOpenChange={() => setEditingCell(null)}>
                                <PopoverTrigger asChild>
                                  <div className="h-8 w-full flex items-center px-2 border rounded-md text-sm cursor-pointer truncate">
                                    {String(item.data[field.key] || "Enter URL")}
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-3" align="start">
                                  <div className="space-y-3">
                                    <h4 className="font-medium leading-none">Image Source</h4>
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="Image URL"
                                        defaultValue={String(item.data[field.key] || "")}
                                        onKeyDown={async (e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault()
                                            if (onInlineUpdate) {
                                              await onInlineUpdate(item, field.key, e.currentTarget.value)
                                              setEditingCell(null)
                                            }
                                          }
                                        }}
                                      />
                                    </div>
                                    <div className="relative">
                                      <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files?.[0]
                                          if (file && onInlineUpdate) {
                                            const reader = new FileReader()
                                            reader.onload = async (e) => {
                                              const result = e.target?.result as string
                                              if (result) {
                                                await onInlineUpdate(item, field.key, result)
                                                setEditingCell(null)
                                                toast.success("Image uploaded")
                                              }
                                            }
                                            reader.readAsDataURL(file)
                                          }
                                        }}
                                      />
                                      <Button variant="outline" className="w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Image
                                      </Button>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <Input
                                ref={inputRef}
                                defaultValue={String(item.data[field.key] ?? "")}
                                className="h-8 w-full"
                                onKeyDown={async (e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault()
                                    const value = e.currentTarget.value
                                    if (onInlineUpdate) {
                                      await onInlineUpdate(item, field.key, value)
                                      setEditingCell(null)
                                    }
                                  } else if (e.key === "Escape") {
                                    setEditingCell(null)
                                  }
                                }}
                                onBlur={() => setEditingCell(null)}
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </div>
                        ) : (
                          formatCellValue(item.data[field.key], field.type)
                        )}
                      </TableCell>
                    ))}
                    <TableCell
                      className="right-0 bg-card group-hover:bg-accent/50 z-10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditItem(item)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDeleteItem(item)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
              <TableRow className="hover:bg-accent/30">
                <TableCell colSpan={collection.fields.length + 1} className="left-0 bg-card z-10">
                  <button
                    onClick={onQuickAdd}
                    className="border border-border border-primary hover:bg-primary/20 flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium py-3 px-3 rounded-lg"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

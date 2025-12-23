"use client"

import { useState, useEffect } from "react"
import useSWR, { mutate } from "swr"
import { CMSHeader } from "@/components/cms/cms-header"
import { CMSSidebar, SidebarToggleButton } from "@/components/cms/cms-sidebar"
import { SearchBar } from "@/components/cms/search-bar"
import { StatsBanner } from "@/components/cms/stats-banner"
import { CollectionsGrid } from "@/components/cms/collections-grid"
import { CollectionDetail } from "@/components/cms/collection-detail"
import { CreateCollectionModal } from "@/components/cms/create-collection-modal"
import { DeleteConfirmationModal } from "@/components/cms/delete-confirmation-modal"
import { ItemEditorModal } from "@/components/cms/item-editor-modal"
import { FieldManagerModal } from "@/components/cms/field-manager-modal"
import type { Collection, CollectionItem, CMSStats, Field } from "@/lib/types"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CMSPage() {
  const [activeView, setActiveView] = useState("collections")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const globalImportInputRef = useState<{ current: HTMLInputElement | null }>({ current: null })[0]
  const setGlobalImportRef = (element: HTMLInputElement | null) => { globalImportInputRef.current = element }

  const handleExportData = async () => {
    try {
      const collectionsRes = await fetch("/api/collections")
      if (!collectionsRes.ok) throw new Error("Failed to fetch collections")
      const { collections } = await collectionsRes.json()

      const exportData: { collections: Collection[]; items: CollectionItem[] } = {
        collections,
        items: []
      }

      for (const col of collections) {
        const itemsRes = await fetch(`/api/collections/${col.id}/items`)
        if (itemsRes.ok) {
          const items = await itemsRes.json()
          exportData.items.push(...items)
        }
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `cms-export-${new Date().toISOString().split('T')[0]}.json`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success("All data exported successfully")
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("Failed to export data")
    }
  }

  const handleGlobalImportClick = () => {
    globalImportInputRef.current?.click()
  }

  const handleGlobalImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const content = event.target?.result as string
      if (!content) return

      try {
        if (file.name.endsWith(".json")) {
          const data = JSON.parse(content)
          if (!data.collections) { toast.error("Invalid format"); return }

          let restoreCount = 0
          for (const col of data.collections) {
            const newColRes = await fetch("/api/collections", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: col.name + " (Imported)",
                slug: col.slug + "-imported-" + Date.now(),
                fields: col.fields.map(({ id, ...f }: any) => f)
              })
            })
            if (newColRes.ok) restoreCount++
          }
          toast.success(`Restored ${restoreCount} collections`)
          mutate("/api/collections")

        } else if (file.name.endsWith(".csv")) {
          const lines = content.split(/\r?\n/).filter(line => line.trim() !== "")
          if (lines.length < 2) { toast.error("Invalid CSV"); return }

          const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""))
          const collectionName = file.name.replace(".csv", "")

          const fields = headers.map(h => ({
            name: h,
            key: h.toLowerCase().replace(/[^a-z0-9]/g, "_"),
            type: "text",
            required: false
          }))

          const colRes = await fetch("/api/collections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: collectionName,
              slug: collectionName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
              fields
            })
          })

          if (colRes.ok) {
            const newCollection = await colRes.json()
            const fieldMap: Record<number, string> = {}
            headers.forEach((h, i) => fieldMap[i] = fields[i].key)

            const newItems: any[] = []
            for (let i = 1; i < lines.length; i++) {
              const rowValues = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
              const itemData: any = {}
              rowValues.forEach((val, index) => {
                const key = fieldMap[index]
                if (key) itemData[key] = val.trim().replace(/^"|"$/g, "").replace(/""/g, '"')
              })
              if (Object.keys(itemData).length > 0) newItems.push(itemData)
            }

            await Promise.all(newItems.map(item =>
              fetch(`/api/collections/${newCollection.id}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item)
              })
            ))
            toast.success(`Created "${collectionName}" with ${newItems.length} items`)
            mutate("/api/collections")
          }
        }
      } catch (err) {
        console.error("Global import failed:", err)
        toast.error("Import failed")
      }
      if (globalImportInputRef.current) globalImportInputRef.current.value = ""
    }
    reader.readAsText(file)
  }

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [deletingCollection, setDeletingCollection] = useState<Collection | null>(null)
  const [showItemEditor, setShowItemEditor] = useState(false)
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<CollectionItem | null>(null)
  const [showFieldManager, setShowFieldManager] = useState(false)

  const { data, error, isLoading } = useSWR<{ collections: Collection[]; stats: CMSStats }>("/api/collections", fetcher)

  const collections = data?.collections || []
  const stats = data?.stats || { totalItems: 0, itemLimit: 4000, totalCollections: 0 }

  useEffect(() => {
    if (selectedCollection) {
      fetch(`/api/collections/${selectedCollection.id}/items`)
        .then((res) => res.json())
        .then((items) => setCollectionItems(items))
    }
  }, [selectedCollection])

  const handleCreateCollection = async (data: { name: string; slug: string; fields: Omit<Field, "id">[] }) => {
    const response = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      mutate("/api/collections")
      toast.success("Collection created successfully")
    }
  }

  const handleEditCollection = async (data: { name: string; slug: string; fields: Omit<Field, "id">[] }) => {
    if (!editingCollection) return
    const response = await fetch(`/api/collections/${editingCollection.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      mutate("/api/collections")
      if (selectedCollection?.id === editingCollection.id) {
        const updated = await response.json()
        setSelectedCollection(updated)
      }
      toast.success("Collection updated successfully")
    }
    setEditingCollection(null)
  }

  const handleDeleteCollection = async () => {
    if (!deletingCollection) return
    const response = await fetch(`/api/collections/${deletingCollection.id}`, {
      method: "DELETE",
    })
    if (response.ok) {
      mutate("/api/collections")
      if (selectedCollection?.id === deletingCollection.id) {
        setSelectedCollection(null)
      }
      toast.success("Collection deleted successfully")
    }
    setDeletingCollection(null)
  }

  const handleDuplicateCollection = async (collection: Collection) => {
    const duplicateData = {
      name: `${collection.name} (Copy)`,
      slug: `${collection.slug}-copy`,
      fields: collection.fields.map(({ id, ...rest }) => rest),
    }
    await handleCreateCollection(duplicateData)
    toast.success("Collection duplicated successfully")
  }

  const handleAddItem = async (data: Record<string, unknown>) => {
    if (!selectedCollection) return
    const response = await fetch(`/api/collections/${selectedCollection.id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const newItem = await response.json()
      setCollectionItems([...collectionItems, newItem])
      mutate("/api/collections")
      toast.success("Item created successfully")
    }
  }

  const handleEditItem = async (data: Record<string, unknown>) => {
    if (!editingItem) return
    const response = await fetch(`/api/items/${editingItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const updated = await response.json()
      setCollectionItems(collectionItems.map((item) => (item.id === updated.id ? updated : item)))
      toast.success("Item updated successfully")
    }
    setEditingItem(null)
  }

  const handleDeleteItem = async () => {
    if (!deletingItem) return
    const response = await fetch(`/api/items/${deletingItem.id}`, {
      method: "DELETE",
    })
    if (response.ok) {
      setCollectionItems(collectionItems.filter((item) => item.id !== deletingItem.id))
      mutate("/api/collections")
      toast.success("Item deleted successfully")
    }
    setDeletingItem(null)
  }

  const handleAddField = async (field: Omit<Field, "id">) => {
    if (!selectedCollection) return
    const response = await fetch(`/api/collections/${selectedCollection.id}/fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(field),
    })
    if (response.ok) {
      const newField = await response.json()
      const updatedCollection = {
        ...selectedCollection,
        fields: [...selectedCollection.fields, newField],
      }
      setSelectedCollection(updatedCollection)
      mutate("/api/collections")
      toast.success("Field added successfully")
    }
  }

  const handleUpdateField = async (fieldId: string, data: Partial<Field>) => {
    if (!selectedCollection) return
    const updatedFields = selectedCollection.fields.map((f) => (f.id === fieldId ? { ...f, ...data } : f))
    setSelectedCollection({ ...selectedCollection, fields: updatedFields })
    toast.success("Field updated successfully")
  }

  const handleDeleteField = async (fieldId: string) => {
    if (!selectedCollection) return
    const updatedFields = selectedCollection.fields.filter((f) => f.id !== fieldId)
    setSelectedCollection({ ...selectedCollection, fields: updatedFields })
    toast.success("Field deleted successfully")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading CMS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-[90%] mx-auto bg-background overflow-hidden">
      {sidebarCollapsed && <SidebarToggleButton onClick={() => setSidebarCollapsed(false)} />}

      <CMSSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className={cn(
          "flex-1 p-8 transition-all duration-300 overflow-hidden flex flex-col",
          sidebarCollapsed ? "ml-0" : "ml-16",
        )}
      >
        {selectedCollection ? (
          <CollectionDetail
            collection={selectedCollection}
            items={collectionItems}
            onBack={() => setSelectedCollection(null)}
            onAddItem={() => {
              setEditingItem(null)
              setShowItemEditor(true)
            }}
            onEditItem={(item) => {
              setEditingItem(item)
              setShowItemEditor(true)
            }}
            onDeleteItem={(item) => setDeletingItem(item)}
            onManageFields={() => setShowFieldManager(true)}
            onAddField={() => setShowFieldManager(true)}
            onQuickAdd={async () => {
              if (!selectedCollection) return

              // Generate default values based on field types
              const defaultData: Record<string, unknown> = {}
              selectedCollection.fields.forEach(field => {
                switch (field.type) {
                  case 'boolean': defaultData[field.key] = false; break;
                  case 'number': defaultData[field.key] = 0; break;
                  case 'date': defaultData[field.key] = new Date().toISOString(); break;
                  default: defaultData[field.key] = "";
                }
              })

              const response = await fetch(`/api/collections/${selectedCollection.id}/items`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(defaultData),
              })

              if (response.ok) {
                const newItem = await response.json()
                setCollectionItems([...collectionItems, newItem])
                mutate("/api/collections")
                toast.success("New row added")
              }
            }}
            onInlineUpdate={async (item, fieldKey, value) => {
              const updatedData = { ...item.data, [fieldKey]: value }

              // Optimistic update
              setCollectionItems(collectionItems.map((i) =>
                i.id === item.id ? { ...i, data: updatedData } : i
              ))

              const response = await fetch(`/api/items/${item.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
              })

              if (response.ok) {
                const serverUpdated = await response.json()
                // Confirm update with server data
                setCollectionItems(collectionItems.map((i) =>
                  i.id === item.id ? serverUpdated : i
                ))
                toast.success("Item updated")
              } else {
                // Revert on failure
                setCollectionItems(collectionItems)
                toast.error("Failed to update item")
              }
            }}
            onImportItems={async (items) => {
              if (!selectedCollection) return

              try {
                // In a real app, this would be a single batch API call
                // For now, we simulate batch by parallel requests
                await Promise.all(
                  items.map(async (itemData) => {
                    await fetch(`/api/collections/${selectedCollection.id}/items`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(itemData),
                    })
                  })
                )

                // Refresh data
                mutate("/api/collections")
                mutate(`/api/collections/${selectedCollection.id}`)

                // We also need to refresh the local items list if we want immediate feedback without waiting for SWR revalidation
                // A full refresh is better to get IDs from server.
                // We'll trust SWR mutation or invalidation.
                // To be safe, we can manually fetch the new list or just wait for SWR.
                // Re-fetching manually to be sure:
                // Actually mutation should be enough if using useSWR properly.
                // Let's force a fetch on the key used by SWR.
                // The SWR key is likely "/api/collections/${selectedCollection.id}/items" or similar 
                // Wait, SWR is used for collections but maybe not for items in this page component?
                // Looking at page.tsx, items are passed as `collectionItems` state.
                // So we need to update that state or re-fetch.
                // Let's assume re-fetching since we don't return all new items easily here.

                const res = await fetch(`/api/collections/${selectedCollection.id}`)
                if (res.ok) {
                  const data = await res.json()
                  // Assuming the API returns items? Or checking previous code...
                  // Actually `CollectionDetail` takes `items={collectionItems}`.
                  // The page seems to fetch items differently?
                  // Let's look at how items are loaded.
                  // It seems `selectedCollection` might not have items array if it comes from `collections` list.
                  // Actually, `items` are passed separately.
                }

                // Simple fix: Reload the page context or fetch items manually.
                // The `page.tsx` likely has an effect to load items when `selectedCollection` changes.
                // Let's just trigger that logic or directly fetch.

                const itemsRes = await fetch(`/api/collections/${selectedCollection.id}/items`)
                if (itemsRes.ok) {
                  const newItems = await itemsRes.json()
                  setCollectionItems(newItems)
                }

                toast.success(`Import completed successfully`)
              } catch (error) {
                console.error("Import failed:", error)
                toast.error("Failed to import items")
              }
            }}
          />
        ) : (
          <div className="space-y-8 overflow-y-auto flex-1">
            <input
              type="file"
              ref={setGlobalImportRef}
              onChange={handleGlobalImportFile}
              accept=".csv,.json"
              className="hidden"
            />
            <CMSHeader
              onCreateCollection={() => setShowCreateModal(true)}
              onImportData={handleGlobalImportClick}
              onExportData={handleExportData}
            />
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search collections..." />
            <CollectionsGrid
              collections={collections}
              searchQuery={searchQuery}
              stats={stats}
              onCollectionClick={(collection) => setSelectedCollection(collection)}
              onEditCollection={(collection) => setEditingCollection(collection)}
              onDeleteCollection={(collection) => setDeletingCollection(collection)}
              onDuplicateCollection={handleDuplicateCollection}
            />
          </div>
        )}
      </main>

      <CreateCollectionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCollection}
      />

      <CreateCollectionModal
        open={!!editingCollection}
        onClose={() => setEditingCollection(null)}
        onSubmit={handleEditCollection}
        editData={
          editingCollection
            ? {
              name: editingCollection.name,
              slug: editingCollection.slug,
              fields: editingCollection.fields,
            }
            : null
        }
      />

      <DeleteConfirmationModal
        open={!!deletingCollection}
        onClose={() => setDeletingCollection(null)}
        onConfirm={handleDeleteCollection}
        title="Delete Collection"
        description={`Are you sure you want to delete "${deletingCollection?.name}"? This will permanently remove all ${deletingCollection?.itemCount || 0} items in this collection.`}
      />

      {selectedCollection && (
        <>
          <ItemEditorModal
            open={showItemEditor}
            onClose={() => {
              setShowItemEditor(false)
              setEditingItem(null)
            }}
            collection={selectedCollection}
            item={editingItem}
            onSubmit={editingItem ? handleEditItem : handleAddItem}
          />

          <DeleteConfirmationModal
            open={!!deletingItem}
            onClose={() => setDeletingItem(null)}
            onConfirm={handleDeleteItem}
            title="Delete Item"
            description="Are you sure you want to delete this item? This action cannot be undone."
          />

          <FieldManagerModal
            open={showFieldManager}
            onClose={() => setShowFieldManager(false)}
            collection={selectedCollection}
            onAddField={handleAddField}
            onUpdateField={handleUpdateField}
            onDeleteField={handleDeleteField}
          />
        </>
      )}

      <Toaster position="bottom-right" />
    </div>
  )
}

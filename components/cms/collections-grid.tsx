"use client"

import type { Collection } from "@/lib/types"
import { CollectionCard } from "./collection-card"
// ... imports
import { CMSStats } from "@/lib/types" // Ensure this import is correct based on file content
import { StatsBanner } from "./stats-banner"

interface CollectionsGridProps {
  collections: Collection[]
  searchQuery: string
  stats: CMSStats
  onCollectionClick: (collection: Collection) => void
  onEditCollection: (collection: Collection) => void
  onDeleteCollection: (collection: Collection) => void
  onDuplicateCollection: (collection: Collection) => void
}

export function CollectionsGrid({
  collections,
  searchQuery,
  stats,
  onCollectionClick,
  onEditCollection,
  onDeleteCollection,
  onDuplicateCollection,
}: CollectionsGridProps) {
  const filteredCollections = collections.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-4 mt-15">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold text-foreground">Your Collections</h2>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm text-muted-foreground">
          {filteredCollections.length}
        </span>
      </div>
      <hr className="w-full border border-[#e5e7eb]/50" />
      <StatsBanner stats={stats} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredCollections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            onClick={() => onCollectionClick(collection)}
            onEdit={() => onEditCollection(collection)}
            onDelete={() => onDeleteCollection(collection)}
            onDuplicate={() => onDuplicateCollection(collection)}
          />
        ))}
      </div>
      {filteredCollections.length === 0 && (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
          <p className="text-muted-foreground">
            {searchQuery
              ? "No collections found matching your search."
              : "No collections yet. Create your first collection!"}
          </p>
        </div>
      )}
    </div>
  )
}

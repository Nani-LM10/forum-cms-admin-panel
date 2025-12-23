import type { Collection, CollectionItem, Field, CMSStats } from "@/lib/types"

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15)

// Initial collections data with the 4 requested collections
const initialCollections: Collection[] = [
  {
    id: "col_players",
    name: "Players",
    slug: "players",
    fields: [
      { id: "f1", name: "Name", key: "name", type: "text", required: true },
      { id: "f2", name: "Position", key: "position", type: "text", required: true },
      { id: "f3", name: "Team", key: "team", type: "text", required: false },
      { id: "f4", name: "Overall Rating", key: "overall_rating", type: "number", required: true },
      { id: "f5", name: "Nationality", key: "nationality", type: "text", required: false },
      { id: "f6", name: "Photo", key: "photo", type: "image", required: false },
      { id: "f7", name: "Age", key: "age", type: "number", required: false },
      { id: "f8", name: "Active", key: "active", type: "boolean", required: false },
    ],
    itemCount: 4,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "col_cards",
    name: "Cards",
    slug: "cards",
    fields: [
      { id: "f1", name: "Card Name", key: "card_name", type: "text", required: true },
      { id: "f2", name: "Player", key: "player", type: "reference", required: true },
      { id: "f3", name: "Card Type", key: "card_type", type: "text", required: true },
      { id: "f4", name: "Rating", key: "rating", type: "number", required: true },
      { id: "f5", name: "Card Image", key: "card_image", type: "image", required: false },
      { id: "f6", name: "Release Date", key: "release_date", type: "date", required: false },
      { id: "f7", name: "Is Special", key: "is_special", type: "boolean", required: false },
      { id: "f8", name: "Price", key: "price", type: "number", required: false },
    ],
    itemCount: 3,
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "col_renders",
    name: "Renders",
    slug: "renders",
    fields: [
      { id: "f1", name: "Title", key: "title", type: "text", required: true },
      { id: "f2", name: "Player", key: "player", type: "reference", required: true },
      { id: "f3", name: "Image URL", key: "image_url", type: "image", required: true },
      { id: "f4", name: "Category", key: "category", type: "text", required: false },
      { id: "f5", name: "Description", key: "description", type: "richtext", required: false },
      { id: "f6", name: "Is Featured", key: "is_featured", type: "boolean", required: false },
    ],
    itemCount: 2,
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "col_player_reviews",
    name: "Player Reviews",
    slug: "player-reviews",
    fields: [
      { id: "f1", name: "Review Title", key: "review_title", type: "text", required: true },
      { id: "f2", name: "Player", key: "player", type: "reference", required: true },
      { id: "f3", name: "Rating", key: "rating", type: "number", required: true },
      { id: "f4", name: "Review Content", key: "review_content", type: "richtext", required: true },
      { id: "f5", name: "Reviewer Name", key: "reviewer_name", type: "text", required: false },
      { id: "f6", name: "Reviewer Email", key: "reviewer_email", type: "email", required: false },
      { id: "f7", name: "Review Date", key: "review_date", type: "date", required: false },
      { id: "f8", name: "Is Verified", key: "is_verified", type: "boolean", required: false },
    ],
    itemCount: 3,
    createdAt: "2024-04-20T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
]

// Initial items data
const initialItems: CollectionItem[] = [
  // Players
  {
    id: "item_p1",
    collectionId: "col_players",
    data: {
      name: "Lionel Messi",
      position: "RW",
      team: "Inter Miami",
      overall_rating: 91,
      nationality: "Argentina",
      photo: "/messi-football-player.jpg",
      age: 36,
      active: true,
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_p2",
    collectionId: "col_players",
    data: {
      name: "Cristiano Ronaldo",
      position: "ST",
      team: "Al Nassr",
      overall_rating: 88,
      nationality: "Portugal",
      photo: "/ronaldo-football-player.jpg",
      age: 39,
      active: true,
    },
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_p3",
    collectionId: "col_players",
    data: {
      name: "Kylian Mbappe",
      position: "ST",
      team: "Real Madrid",
      overall_rating: 91,
      nationality: "France",
      photo: "/mbappe-football-player.jpg",
      age: 25,
      active: true,
    },
    createdAt: "2024-01-17T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_p4",
    collectionId: "col_players",
    data: {
      name: "Erling Haaland",
      position: "ST",
      team: "Manchester City",
      overall_rating: 91,
      nationality: "Norway",
      photo: "/haaland-football-player.jpg",
      age: 24,
      active: true,
    },
    createdAt: "2024-01-18T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  // Cards
  {
    id: "item_c1",
    collectionId: "col_cards",
    data: {
      card_name: "TOTY Messi",
      player: "Lionel Messi",
      card_type: "Team of the Year",
      rating: 98,
      card_image: "/toty-messi-football-card.jpg",
      release_date: "2024-01-20",
      is_special: true,
      price: 5000000,
    },
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_c2",
    collectionId: "col_cards",
    data: {
      card_name: "TOTS Haaland",
      player: "Erling Haaland",
      card_type: "Team of the Season",
      rating: 99,
      card_image: "/tots-haaland-football-card.jpg",
      release_date: "2024-05-15",
      is_special: true,
      price: 8000000,
    },
    createdAt: "2024-02-11T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_c3",
    collectionId: "col_cards",
    data: {
      card_name: "Icon Ronaldo",
      player: "Cristiano Ronaldo",
      card_type: "Icon",
      rating: 95,
      card_image: "/icon-ronaldo-football-card.jpg",
      release_date: "2024-03-10",
      is_special: true,
      price: 3500000,
    },
    createdAt: "2024-02-12T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  // Renders
  {
    id: "item_r1",
    collectionId: "col_renders",
    data: {
      title: "Messi Celebration",
      player: "Lionel Messi",
      image_url: "/messi-celebration-render.jpg",
      category: "Celebrations",
      description: "<p>Iconic Messi celebration render with arms wide open</p>",
      is_featured: true,
    },
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_r2",
    collectionId: "col_renders",
    data: {
      title: "Haaland Goal",
      player: "Erling Haaland",
      image_url: "/haaland-goal-celebration-render.jpg",
      category: "Goals",
      description: "<p>Haaland meditation celebration render</p>",
      is_featured: true,
    },
    createdAt: "2024-03-06T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  // Player Reviews
  {
    id: "item_pr1",
    collectionId: "col_player_reviews",
    data: {
      review_title: "Messi - The GOAT",
      player: "Lionel Messi",
      rating: 10,
      review_content: "<p>Incredible dribbling and vision. The best player of all time.</p>",
      reviewer_name: "John Smith",
      reviewer_email: "john@example.com",
      review_date: "2024-04-20",
      is_verified: true,
    },
    createdAt: "2024-04-20T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_pr2",
    collectionId: "col_player_reviews",
    data: {
      review_title: "Haaland - Goal Machine",
      player: "Erling Haaland",
      rating: 9,
      review_content: "<p>Unstoppable in front of goal. A true predator in the box.</p>",
      reviewer_name: "Mike Johnson",
      reviewer_email: "mike@example.com",
      review_date: "2024-04-21",
      is_verified: true,
    },
    createdAt: "2024-04-21T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
  {
    id: "item_pr3",
    collectionId: "col_player_reviews",
    data: {
      review_title: "Mbappe - Speed Demon",
      player: "Kylian Mbappe",
      rating: 9,
      review_content: "<p>Lightning fast and clinical finisher. Future GOAT candidate.</p>",
      reviewer_name: "Sarah Williams",
      reviewer_email: "sarah@example.com",
      review_date: "2024-04-22",
      is_verified: false,
    },
    createdAt: "2024-04-22T10:00:00Z",
    updatedAt: "2024-12-18T10:00:00Z",
  },
]

// In-memory store (simulating database)
const collections: Collection[] = [...initialCollections]
let items: CollectionItem[] = [...initialItems]

// Collection CRUD operations
export function getCollections(): Collection[] {
  return collections
}

export function getCollection(id: string): Collection | undefined {
  return collections.find((c) => c.id === id)
}

export function createCollection(data: { name: string; slug: string; fields: Omit<Field, "id">[] }): Collection {
  const now = new Date().toISOString()
  const newCollection: Collection = {
    id: `col_${generateId()}`,
    name: data.name,
    slug: data.slug,
    fields: data.fields.map((f) => ({ ...f, id: `f_${generateId()}` })),
    itemCount: 0,
    createdAt: now,
    updatedAt: now,
  }
  collections.push(newCollection)
  return newCollection
}

export function updateCollection(
  id: string,
  data: Partial<{ name: string; slug: string; fields: Omit<Field, "id">[] }>,
): Collection | null {
  const index = collections.findIndex((c) => c.id === id)
  if (index === -1) return null

  const existing = collections[index]
  const updated: Collection = {
    ...existing,
    ...data,
    fields: data.fields ? data.fields.map((f) => ({ ...f, id: `f_${generateId()}` })) : existing.fields,
    updatedAt: new Date().toISOString(),
  }
  collections[index] = updated
  return updated
}

export function deleteCollection(id: string): boolean {
  const index = collections.findIndex((c) => c.id === id)
  if (index === -1) return false

  collections.splice(index, 1)
  // Delete associated items
  items = items.filter((i) => i.collectionId !== id)
  return true
}

// Items CRUD operations
export function getItems(collectionId: string): CollectionItem[] {
  return items.filter((i) => i.collectionId === collectionId)
}

export function getItem(id: string): CollectionItem | undefined {
  return items.find((i) => i.id === id)
}

export function createItem(collectionId: string, data: Record<string, unknown>): CollectionItem {
  const now = new Date().toISOString()
  const newItem: CollectionItem = {
    id: `item_${generateId()}`,
    collectionId,
    data,
    createdAt: now,
    updatedAt: now,
  }
  items.push(newItem)

  // Update collection item count
  const collection = collections.find((c) => c.id === collectionId)
  if (collection) {
    collection.itemCount = items.filter((i) => i.collectionId === collectionId).length
    collection.updatedAt = now
  }

  return newItem
}

export function updateItem(id: string, data: Record<string, unknown>): CollectionItem | null {
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null

  const updated: CollectionItem = {
    ...items[index],
    data,
    updatedAt: new Date().toISOString(),
  }
  items[index] = updated
  return updated
}

export function deleteItem(id: string): boolean {
  const item = items.find((i) => i.id === id)
  if (!item) return false

  const collectionId = item.collectionId
  items = items.filter((i) => i.id !== id)

  // Update collection item count
  const collection = collections.find((c) => c.id === collectionId)
  if (collection) {
    collection.itemCount = items.filter((i) => i.collectionId === collectionId).length
    collection.updatedAt = new Date().toISOString()
  }

  return true
}

// Field operations
export function addFieldToCollection(collectionId: string, field: Omit<Field, "id">): Field | null {
  const collection = collections.find((c) => c.id === collectionId)
  if (!collection) return null

  const newField: Field = {
    ...field,
    id: `f_${generateId()}`,
  }
  collection.fields.push(newField)
  collection.updatedAt = new Date().toISOString()
  return newField
}

// Stats
export function getCMSStats(): CMSStats {
  const totalItems = collections.reduce((sum, c) => sum + c.itemCount, 0)
  return {
    totalItems,
    itemLimit: 4000,
    totalCollections: collections.length,
  }
}

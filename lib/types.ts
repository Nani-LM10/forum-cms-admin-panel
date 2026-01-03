export interface Field {
  id: string
  name: string
  key: string
  type: "text" | "number" | "boolean" | "date" | "image" | "richtext" | "reference" | "url" | "email"
  required: boolean
  defaultValue?: string | number | boolean
  isPrimary?: boolean
}

export interface Collection {
  id: string
  name: string
  slug: string
  fields: Field[]
  itemCount: number
  createdAt: string
  updatedAt: string
}

export interface CollectionItem {
  id: string
  collectionId: string
  data: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CMSStats {
  totalItems: number
  itemLimit: number
  totalCollections: number
}

// Cloudflare D1 Integration Types
export interface CloudflareConfig {
  accountId: string
  databaseId: string
  apiToken: string
}

export interface CloudflareSyncResult {
  success: boolean
  message: string
  recordsInserted?: number
  error?: CloudflareSyncError
}

export interface CloudflareSyncError {
  code: string
  message: string
  details?: string
}

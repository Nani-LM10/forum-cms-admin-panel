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

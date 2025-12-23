import { type NextRequest, NextResponse } from "next/server"
import { addFieldToCollection, getCollection } from "@/lib/cms-store"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const collection = getCollection(id)
  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }
  return NextResponse.json(collection.fields)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const field = addFieldToCollection(id, body)
  if (!field) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }
  return NextResponse.json(field, { status: 201 })
}

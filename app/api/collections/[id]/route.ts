import { type NextRequest, NextResponse } from "next/server"
import { getCollection, updateCollection, deleteCollection } from "@/lib/cms-store"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const collection = getCollection(id)
  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }
  return NextResponse.json(collection)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const collection = updateCollection(id, body)
  if (!collection) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }
  return NextResponse.json(collection)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const success = deleteCollection(id)
  if (!success) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}

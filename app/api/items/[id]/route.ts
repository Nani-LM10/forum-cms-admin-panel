import { type NextRequest, NextResponse } from "next/server"
import { getItem, updateItem, deleteItem } from "@/lib/cms-store"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = getItem(id)
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }
  return NextResponse.json(item)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const item = updateItem(id, body)
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }
  return NextResponse.json(item)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const success = deleteItem(id)
  if (!success) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}

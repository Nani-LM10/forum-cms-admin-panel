import { type NextRequest, NextResponse } from "next/server"
import { getItems, createItem } from "@/lib/cms-store"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const items = getItems(id)
  return NextResponse.json(items)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const item = createItem(id, body)
  return NextResponse.json(item, { status: 201 })
}

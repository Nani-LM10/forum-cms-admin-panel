import { type NextRequest, NextResponse } from "next/server"
import { getCollections, createCollection, getCMSStats } from "@/lib/cms-store"

export async function GET() {
  const collections = getCollections()
  const stats = getCMSStats()
  return NextResponse.json({ collections, stats })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const collection = createCollection(body)
  return NextResponse.json(collection, { status: 201 })
}

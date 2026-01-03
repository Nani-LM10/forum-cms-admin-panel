import type { Collection, CollectionItem, CloudflareConfig, CloudflareSyncResult, Field } from "./types"

/**
 * Cloudflare D1 Service
 * Handles synchronization of CMS data to Cloudflare D1 database
 */

/**
 * Get Cloudflare configuration from environment variables
 */
export function getCloudflareConfig(): CloudflareConfig | null {
    const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID
    const databaseId = process.env.NEXT_PUBLIC_CLOUDFLARE_DATABASE_ID
    const apiToken = process.env.NEXT_PUBLIC_CLOUDFLARE_API_TOKEN

    if (!accountId || !databaseId || !apiToken) {
        return null
    }

    return {
        accountId,
        databaseId,
        apiToken,
    }
}

/**
 * Map CMS field type to SQL type
 */
function mapFieldTypeToSQL(fieldType: Field["type"]): string {
    switch (fieldType) {
        case "number":
            return "REAL"
        case "boolean":
            return "INTEGER" // SQLite uses 0/1 for boolean
        case "date":
            return "TEXT" // ISO 8601 format
        case "text":
        case "email":
        case "url":
        case "richtext":
        case "reference":
        case "image":
        default:
            return "TEXT"
    }
}

/**
 * Convert CMS value to SQL-compatible value
 */
function convertValueForSQL(value: unknown, fieldType: Field["type"]): string | number | null {
    if (value === null || value === undefined || value === "") {
        return null
    }

    switch (fieldType) {
        case "boolean":
            return value ? 1 : 0
        case "number":
            return typeof value === "number" ? value : parseFloat(String(value))
        case "date":
            // Ensure ISO 8601 format
            if (value instanceof Date) {
                return value.toISOString()
            }
            return String(value)
        default:
            return String(value)
    }
}

/**
 * Escape SQL string values
 */
function escapeSQLString(value: string): string {
    return value.replace(/'/g, "''")
}

/**
 * Generate SQL INSERT statement for a single item
 */
function generateInsertSQL(
    tableName: string,
    fields: Field[],
    item: CollectionItem
): string {
    const columns = fields.map((f) => f.key).join(", ")

    const values = fields
        .map((field) => {
            const value = convertValueForSQL(item.data[field.key], field.type)

            if (value === null) {
                return "NULL"
            }

            if (typeof value === "number") {
                return value.toString()
            }

            return `'${escapeSQLString(String(value))}'`
        })
        .join(", ")

    return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`
}

/**
 * Sync collection data to Cloudflare D1
 */
export async function syncCollectionToCloudflare(
    collection: Collection,
    items: CollectionItem[],
    config?: CloudflareConfig
): Promise<CloudflareSyncResult> {
    // Get configuration
    const cloudflareConfig = config || getCloudflareConfig()

    if (!cloudflareConfig) {
        return {
            success: false,
            message: "Cloudflare configuration is missing. Please set environment variables.",
            error: {
                code: "CONFIG_MISSING",
                message: "Missing CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, or CLOUDFLARE_API_TOKEN",
            },
        }
    }

    // Validate collection has items
    if (items.length === 0) {
        return {
            success: false,
            message: "No items to sync",
            error: {
                code: "NO_ITEMS",
                message: "Collection has no items to sync to Cloudflare",
            },
        }
    }

    try {
        // Use collection slug as table name
        const tableName = collection.slug.replace(/-/g, "_")

        // Generate SQL statements for all items
        const sqlStatements = items.map((item) =>
            generateInsertSQL(tableName, collection.fields, item)
        )

        // Combine into a single SQL batch
        const batchSQL = sqlStatements.join("\n")

        // Custom Cloudflare Worker endpoint
        const endpoint = "https://d1-demo.eafcmobileforum.workers.dev"

        // Execute with retry logic
        let lastError: Error | null = null
        const maxRetries = 3

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Add cache-busting parameter to bypass browser cache
                const cacheBuster = `?t=${Date.now()}`
                const response = await fetch(endpoint + cacheBuster, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sql: batchSQL,
                    }),
                })

                const responseData = await response.json()

                if (!response.ok) {
                    throw new Error(
                        `Cloudflare API error: ${responseData.errors?.[0]?.message || responseData.error || response.statusText}`
                    )
                }

                // Success
                return {
                    success: true,
                    message: `Successfully synced ${items.length} item(s) to Cloudflare D1`,
                    recordsInserted: items.length,
                }
            } catch (error) {
                lastError = error as Error

                // If this is not the last attempt, wait before retrying
                if (attempt < maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
                }
            }
        }

        // All retries failed
        return {
            success: false,
            message: `Failed to sync to Cloudflare after ${maxRetries} attempts`,
            error: {
                code: "SYNC_FAILED",
                message: lastError?.message || "Unknown error",
                details: `Attempted ${maxRetries} times`,
            },
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to sync to Cloudflare",
            error: {
                code: "SYNC_ERROR",
                message: error instanceof Error ? error.message : "Unknown error",
            },
        }
    }
}

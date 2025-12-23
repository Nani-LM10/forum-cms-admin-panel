"use client"

import { AlertTriangle } from "lucide-react"
import type { CMSStats } from "@/lib/types"

interface StatsBannerProps {
  stats: CMSStats
}

export function StatsBanner({ stats }: StatsBannerProps) {
  const usagePercentage = (stats.totalItems / stats.itemLimit) * 100
  const isNearLimit = usagePercentage >= 90

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          You have{" "}
          <span className="font-medium text-foreground">
            {stats.totalItems.toLocaleString()}/{stats.itemLimit.toLocaleString()}
          </span>{" "}
          items.
        </span>
      </div>
      {isNearLimit && (
        <div className="flex items-center gap-3 rounded-lg border border-warning-border bg-warning px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-warning-foreground" />
          <p className="text-sm">
            <span className="font-medium text-warning-foreground">{"You're about to reach your item limit."}</span>
            <span className="text-warning-foreground"> Need more? </span>
            <button className="font-medium text-primary underline hover:no-underline">Upgrade your site.</button>
          </p>
        </div>
      )}
    </div>
  )
}

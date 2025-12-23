"use client"

import { Database, Layers, Settings, HelpCircle, Zap, BarChart3, PanelLeftClose, PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface CMSSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

const navItems = [
  { id: "collections", label: "Collections", icon: Database },
  { id: "content", label: "All Content", icon: Layers },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "automation", label: "Automation", icon: Zap },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "help", label: "Help", icon: HelpCircle },
]

export function CMSSidebar({ activeView, onViewChange, collapsed, onToggleCollapse }: CMSSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card flex flex-col items-center py-4 transition-all duration-300",
        collapsed ? "w-0 overflow-hidden border-r-0" : "w-16",
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-8">
        <Database className="h-5 w-5" />
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              activeView === item.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
            title={item.label}
          >
            <item.icon className="h-5 w-5" />
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={onToggleCollapse}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          title={collapsed ? "Show sidebar" : "Hide sidebar"}
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>
      </div>
    </aside>
  )
}

export function SidebarToggleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shadow-sm"
      title="Show sidebar"
    >
      <PanelLeft className="h-5 w-5" />
    </button>
  )
}

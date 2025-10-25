// Navigation item component
"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface NavItemProps {
  label: string
  path: string
  icon?: React.ComponentType<{ className?: string }>
  isActive: boolean
  badge?: number
  onClick?: () => void
}

export function NavItem({ label, path, icon: Icon, isActive, badge, onClick }: NavItemProps) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0" />}
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant="secondary" className="ml-auto h-5 min-w-5 px-1 text-xs">
          {badge}
        </Badge>
      )}
    </Link>
  )
}

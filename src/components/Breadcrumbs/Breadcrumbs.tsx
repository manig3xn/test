// Breadcrumbs component
"use client"

import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { useUIStore } from "@/stores/ui.store"

export function Breadcrumbs() {
  const { breadcrumbs } = useUIStore()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4" />}
              {isLast ? (
                <span className="font-medium text-foreground" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

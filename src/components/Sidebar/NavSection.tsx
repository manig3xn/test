// Navigation section component
"use client"

import type React from "react"

interface NavSectionProps {
  label: string
  children: React.ReactNode
}

export function NavSection({ label, children }: NavSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h3>
      <nav className="space-y-1" role="navigation" aria-label={label}>
        {children}
      </nav>
    </div>
  )
}

"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilterChipProps {
  label: string
  value: string
  onRemove: () => void
}

export function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
      <span className="font-medium text-primary">{label}:</span>
      <span className="text-foreground">{value}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 rounded-full p-0 hover:bg-primary/20"
        onClick={onRemove}
        aria-label={`Remover filtro ${label}`}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}

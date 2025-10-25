"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import type { ConsentState, ConsentMedium, ConsentPurpose, ConsentObjective } from "@/repos/types"

export interface ConsentFilters {
  search?: string
  states?: ConsentState[]
  medios?: ConsentMedium[]
  finalidades?: ConsentPurpose[]
  objetivos?: ConsentObjective[]
  fromDate?: string
  toDate?: string
  sucursal?: string
  ubicacion?: string
  rutEjecutivo?: string
}

interface FiltersPanelProps {
  filters: ConsentFilters
  onChange: (filters: ConsentFilters) => void
  onClear: () => void
}

const STATE_OPTIONS: { value: ConsentState; label: string }[] = [
  { value: "ACTIVE", label: "Activo" },
  { value: "EXPIRING_SOON", label: "Por vencer" },
  { value: "EXPIRED", label: "Vencido" },
  { value: "REVOKED", label: "Revocado" },
]

const MEDIO_OPTIONS: { value: ConsentMedium; label: string }[] = [
  { value: "ELECTRONIC", label: "Electrónico" },
  { value: "VERBAL", label: "Verbal" },
  { value: "WRITTEN", label: "Escrito" },
]

const FINALIDAD_OPTIONS: { value: ConsentPurpose; label: string }[] = [
  { value: "RISK_COMMERCIAL", label: "Riesgo Comercial" },
  { value: "RISK_CREDIT", label: "Riesgo Crediticio" },
]

const OBJETIVO_OPTIONS: { value: ConsentObjective; label: string }[] = [
  { value: "CREDITO_COMERCIAL", label: "Crédito Comercial" },
  { value: "CONSUMO", label: "Consumo" },
  { value: "VIVIENDA", label: "Vivienda" },
  { value: "FINANCIERO", label: "Financiero" },
  { value: "INSTRUMENTO_DEUDA", label: "Instrumento de Deuda" },
  { value: "CONTINGENTE", label: "Contingente" },
  { value: "LINEA_LIBRE", label: "Línea Libre" },
]

export function FiltersPanel({ filters, onChange, onClear }: FiltersPanelProps) {
  const [expanded, setExpanded] = useState(false)

  const handleSearchChange = (value: string) => {
    onChange({ ...filters, search: value || undefined })
  }

  const handleMultiSelectChange = <T extends string>(key: keyof ConsentFilters, value: T, checked: boolean) => {
    const current = (filters[key] as T[]) || []
    const updated = checked ? [...current, value] : current.filter((v) => v !== value)
    onChange({ ...filters, [key]: updated.length > 0 ? updated : undefined })
  }

  const handleInputChange = (key: keyof ConsentFilters, value: string) => {
    onChange({ ...filters, [key]: value || undefined })
  }

  const activeFilterCount = Object.values(filters).filter((v) => {
    if (Array.isArray(v)) return v.length > 0
    return v !== undefined && v !== ""
  }).length

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Search bar - always visible */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por RUT, nombre, email, ID interno..."
              value={filters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
              aria-label="Buscar consentimientos"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            aria-label="Filtros avanzados"
            aria-expanded={expanded}
          >
            <Filter className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Filtros</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClear} aria-label="Limpiar filtros">
              <X className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Limpiar</span>
            </Button>
          )}
        </div>

        {/* Advanced filters - collapsible */}
        {expanded && (
          <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Estado */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Estado</Label>
              <div className="space-y-1">
                {STATE_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.states?.includes(option.value) || false}
                      onChange={(e) => handleMultiSelectChange("states", option.value, e.target.checked)}
                      className="rounded border-input"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Medio */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Medio</Label>
              <div className="space-y-1">
                {MEDIO_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.medios?.includes(option.value) || false}
                      onChange={(e) => handleMultiSelectChange("medios", option.value, e.target.checked)}
                      className="rounded border-input"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Finalidad */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Finalidad</Label>
              <div className="space-y-1">
                {FINALIDAD_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.finalidades?.includes(option.value) || false}
                      onChange={(e) => handleMultiSelectChange("finalidades", option.value, e.target.checked)}
                      className="rounded border-input"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Objetivo */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Objetivo</Label>
              <div className="space-y-1">
                {OBJETIVO_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.objetivos?.includes(option.value) || false}
                      onChange={(e) => handleMultiSelectChange("objetivos", option.value, e.target.checked)}
                      className="rounded border-input"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Date range */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Fecha de otorgamiento</Label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={filters.fromDate || ""}
                  onChange={(e) => handleInputChange("fromDate", e.target.value)}
                  placeholder="Desde"
                  aria-label="Fecha desde"
                />
                <Input
                  type="date"
                  value={filters.toDate || ""}
                  onChange={(e) => handleInputChange("toDate", e.target.value)}
                  placeholder="Hasta"
                  aria-label="Fecha hasta"
                />
              </div>
            </div>

            {/* Additional filters */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Otros filtros</Label>
              <div className="space-y-2">
                <Input
                  type="text"
                  value={filters.sucursal || ""}
                  onChange={(e) => handleInputChange("sucursal", e.target.value)}
                  placeholder="Sucursal"
                  aria-label="Sucursal"
                />
                <Input
                  type="text"
                  value={filters.ubicacion || ""}
                  onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                  placeholder="Ubicación"
                  aria-label="Ubicación"
                />
                <Input
                  type="text"
                  value={filters.rutEjecutivo || ""}
                  onChange={(e) => handleInputChange("rutEjecutivo", e.target.value)}
                  placeholder="RUT Ejecutivo"
                  aria-label="RUT Ejecutivo"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

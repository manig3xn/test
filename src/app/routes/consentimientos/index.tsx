"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { list as listConsents, revoke as revokeConsent, getStats } from "@/repos/consents.repo"
import { create as createAuditLog } from "@/repos/audit.repo"
import { getCurrentUser } from "@/repos/users.repo"
import { saveToStorage, loadFromStorage } from "@/utils/localStorage"
import { formatRDCDate } from "@/utils/date"
import type { Consent } from "@/repos/consents.repo"
import { FiltersPanel, type ConsentFilters } from "./components/FiltersPanel"
import { ColumnPicker, type ColumnConfig } from "./components/ColumnPicker"
import { FilterChip } from "./components/FilterChip"
import { TableConsentimientos } from "./components/TableConsentimientos"
import { Pagination } from "./components/Pagination"
import { EmptyState } from "./components/EmptyState"
import { LoadingSkeleton } from "./components/LoadingSkeleton"

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "rut", label: "RUT", group: "identificacion", visible: true, required: true },
  { id: "name", label: "Nombre", group: "identificacion", visible: true },
  { id: "email", label: "Email", group: "identificacion", visible: true },
  { id: "idInterno", label: "ID Interno", group: "identificacion", visible: false },
  { id: "idExterno", label: "ID Externo", group: "identificacion", visible: false },
  { id: "otorgamiento", label: "Fecha Otorgamiento", group: "temporalidad", visible: true },
  { id: "fin", label: "Fecha Fin", group: "temporalidad", visible: false },
  { id: "revocacion", label: "Fecha Revocación", group: "temporalidad", visible: false },
  { id: "medio", label: "Medio", group: "regulacion", visible: true },
  { id: "finalidad", label: "Finalidad", group: "regulacion", visible: true },
  { id: "objetivo", label: "Objetivo", group: "regulacion", visible: false },
  { id: "rutEjecutivo", label: "RUT Ejecutivo", group: "regulacion", visible: false },
  { id: "codigoInstitucion", label: "Código Institución", group: "regulacion", visible: false },
  { id: "ip", label: "IP", group: "tecnicos", visible: false },
  { id: "navegador", label: "Navegador", group: "tecnicos", visible: false },
  { id: "versionTC", label: "Versión T&C", group: "tecnicos", visible: false },
  { id: "sucursal", label: "Sucursal", group: "tecnicos", visible: false },
  { id: "ubicacion", label: "Ubicación", group: "tecnicos", visible: false },
  { id: "state", label: "Estado", group: "estado", visible: true, required: true },
]

export default function ConsentimientosPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentUser = getCurrentUser()

  // State
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ConsentFilters>({})
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [successMessage, setSuccessMessage] = useState<string>()

  // Load persisted state
  useEffect(() => {
    if (currentUser) {
      const savedFilters = loadFromStorage<ConsentFilters>("filters_consentimientos", currentUser.id, "default")
      const savedColumns = loadFromStorage<ColumnConfig[]>("columns_consentimientos", currentUser.id, "default")

      if (savedFilters) setFilters(savedFilters)
      if (savedColumns) setColumns(savedColumns)
    }
    setLoading(false)
  }, [currentUser])

  // Persist filters and columns
  useEffect(() => {
    if (currentUser && !loading) {
      saveToStorage("filters_consentimientos", filters, currentUser.id, "default")
    }
  }, [filters, currentUser, loading])

  useEffect(() => {
    if (currentUser && !loading) {
      saveToStorage("columns_consentimientos", columns, currentUser.id, "default")
    }
  }, [columns, currentUser, loading])

  // Fetch and filter consents
  const allConsents = useMemo(() => {
    return listConsents(filters)
  }, [filters])

  // Pagination
  const totalPages = Math.ceil(allConsents.length / pageSize)
  const paginatedConsents = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return allConsents.slice(start, start + pageSize)
  }, [allConsents, currentPage, pageSize])

  // Stats
  const stats = getStats()

  // Handlers
  const handleFiltersChange = (newFilters: ConsentFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({})
    setCurrentPage(1)
  }

  const handleColumnsChange = (newColumns: ColumnConfig[]) => {
    setColumns(newColumns)
  }

  const handleRowClick = (consent: Consent) => {
    setSearchParams({ id: consent.id })
  }

  const handleRevoke = (consent: Consent) => {
    if (!currentUser) return
    if (!confirm(`¿Está seguro de revocar el consentimiento de ${consent.person.name}?`)) return

    const revoked = revokeConsent(consent.id, currentUser.id)
    if (revoked) {
      createAuditLog({
        action: "REVOKE",
        resourceType: "CONSENT",
        resourceId: consent.id,
        userId: currentUser.id,
        details: `Consentimiento revocado: ${consent.person.rut}`,
      })
      setSuccessMessage("Consentimiento revocado exitosamente")
      setTimeout(() => setSuccessMessage(undefined), 3000)
    }
  }

  const handleEdit = (consent: Consent) => {
    // TODO: Open edit modal (Feature 4)
    console.log("[v0] Edit consent:", consent.id)
  }

  const handleDownload = (consent: Consent) => {
    // Mock download
    console.log("[v0] Download consent PDF:", consent.id)
    const link = document.createElement("a")
    link.href = `/assets/mock/consentimiento_${consent.id}.pdf`
    link.download = `consentimiento_${consent.person.rut}_${formatRDCDate(new Date())}.pdf`
    link.click()
  }

  const handleExportRDC30 = () => {
    // Mock RDC30 export
    console.log("[v0] Export RDC30 with filters:", filters)
    const link = document.createElement("a")
    link.href = `/assets/mock/rdc30_${formatRDCDate(new Date())}.txt`
    link.download = `rdc30_${formatRDCDate(new Date())}.txt`
    link.click()
  }

  // Active filter chips
  const activeFilterChips = useMemo(() => {
    const chips: Array<{ key: string; label: string; value: string; onRemove: () => void }> = []

    if (filters.search) {
      chips.push({
        key: "search",
        label: "Búsqueda",
        value: filters.search,
        onRemove: () => setFilters({ ...filters, search: undefined }),
      })
    }

    if (filters.states && filters.states.length > 0) {
      filters.states.forEach((state) => {
        chips.push({
          key: `state-${state}`,
          label: "Estado",
          value: state,
          onRemove: () => setFilters({ ...filters, states: filters.states?.filter((s) => s !== state) }),
        })
      })
    }

    if (filters.medios && filters.medios.length > 0) {
      filters.medios.forEach((medio) => {
        chips.push({
          key: `medio-${medio}`,
          label: "Medio",
          value: medio,
          onRemove: () => setFilters({ ...filters, medios: filters.medios?.filter((m) => m !== medio) }),
        })
      })
    }

    return chips
  }, [filters])

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consentimientos</h1>
          <p className="text-muted-foreground">Gestión de consentimientos con estructura RDC30</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportRDC30}>
            <FileText className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Exportar RDC30</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Activos</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Por vencer</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.expiringSoon}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Vencidos</div>
          <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.expired}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Revocados</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.revoked}</div>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <Alert>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <FiltersPanel filters={filters} onChange={handleFiltersChange} onClear={handleClearFilters} />

      {/* Active filter chips */}
      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilterChips.map((chip) => (
            <FilterChip key={chip.key} label={chip.label} value={chip.value} onRemove={chip.onRemove} />
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {allConsents.length} {allConsents.length === 1 ? "resultado" : "resultados"}
        </div>
        <ColumnPicker columns={columns} onChange={handleColumnsChange} />
      </div>

      {/* Table */}
      {paginatedConsents.length > 0 ? (
        <>
          <TableConsentimientos
            consents={paginatedConsents}
            columns={columns}
            onRowClick={handleRowClick}
            onRevoke={handleRevoke}
            onEdit={handleEdit}
            onDownload={handleDownload}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={allConsents.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
          />
        </>
      ) : (
        <EmptyState
          title="No se encontraron consentimientos"
          description="Intenta ajustar los filtros para ver más resultados"
          icon={<FileText className="h-12 w-12" />}
        />
      )}
    </div>
  )
}

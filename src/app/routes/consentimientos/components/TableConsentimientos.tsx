"use client"

import { MoreHorizontal, Download, Ban, Edit, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDisplayDate, formatDisplayDateTime } from "@/utils/date"
import { canPerformAction } from "@/utils/roles"
import { getCurrentUser } from "@/repos/users.repo"
import type { Consent } from "@/repos/consents.repo"
import type { ColumnConfig } from "./ColumnPicker"

interface TableConsentimientosProps {
  consents: Consent[]
  columns: ColumnConfig[]
  onRowClick: (consent: Consent) => void
  onRevoke: (consent: Consent) => void
  onEdit: (consent: Consent) => void
  onDownload: (consent: Consent) => void
}

const STATE_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ACTIVE: { label: "Activo", variant: "default" },
  EXPIRING_SOON: { label: "Por vencer", variant: "secondary" },
  EXPIRED: { label: "Vencido", variant: "outline" },
  REVOKED: { label: "Revocado", variant: "destructive" },
}

const MEDIO_LABELS: Record<string, string> = {
  ELECTRONIC: "Electrónico",
  VERBAL: "Verbal",
  WRITTEN: "Escrito",
}

const FINALIDAD_LABELS: Record<string, string> = {
  RISK_COMMERCIAL: "Riesgo Comercial",
  RISK_CREDIT: "Riesgo Crediticio",
}

const OBJETIVO_LABELS: Record<string, string> = {
  CREDITO_COMERCIAL: "Crédito Comercial",
  CONSUMO: "Consumo",
  VIVIENDA: "Vivienda",
  FINANCIERO: "Financiero",
  INSTRUMENTO_DEUDA: "Instrumento de Deuda",
  CONTINGENTE: "Contingente",
  LINEA_LIBRE: "Línea Libre",
}

export function TableConsentimientos({
  consents,
  columns,
  onRowClick,
  onRevoke,
  onEdit,
  onDownload,
}: TableConsentimientosProps) {
  const currentUser = getCurrentUser()
  const visibleColumns = columns.filter((col) => col.visible)

  const canRevoke = canPerformAction(currentUser?.role, "revoke_consent")
  const canEdit = canPerformAction(currentUser?.role, "edit_consent")

  const renderCell = (consent: Consent, columnId: string) => {
    switch (columnId) {
      case "rut":
        return <span className="font-mono text-sm">{consent.person.rut}</span>
      case "name":
        return <span className="font-medium">{consent.person.name}</span>
      case "email":
        return <span className="text-sm text-muted-foreground">{consent.person.email}</span>
      case "idInterno":
        return <span className="font-mono text-xs">{consent.idInterno}</span>
      case "idExterno":
        return <span className="font-mono text-xs">{consent.idExterno || "-"}</span>
      case "otorgamiento":
        return (
          <div className="text-sm">
            <div>{formatDisplayDate(consent.timestamps.otorgamientoFecha)}</div>
            <div className="text-xs text-muted-foreground">{consent.timestamps.otorgamientoHora}</div>
          </div>
        )
      case "fin":
        return consent.timestamps.finFecha ? (
          <div className="text-sm">
            <div>{formatDisplayDate(consent.timestamps.finFecha)}</div>
            <div className="text-xs text-muted-foreground">{consent.timestamps.finHora}</div>
          </div>
        ) : (
          "-"
        )
      case "revocacion":
        return consent.timestamps.revokedAt ? (
          <span className="text-sm">{formatDisplayDateTime(consent.timestamps.revokedAt)}</span>
        ) : (
          "-"
        )
      case "medio":
        return <span className="text-sm">{MEDIO_LABELS[consent.medio]}</span>
      case "finalidad":
        return <span className="text-sm">{FINALIDAD_LABELS[consent.finalidad]}</span>
      case "objetivo":
        return <span className="text-sm">{OBJETIVO_LABELS[consent.objetivo]}</span>
      case "rutEjecutivo":
        return <span className="font-mono text-sm">{consent.rutEjecutivo || "-"}</span>
      case "codigoInstitucion":
        return <span className="font-mono text-sm">{consent.codigoInstitucion}</span>
      case "ip":
        return <span className="font-mono text-xs">{consent.ip || "-"}</span>
      case "navegador":
        return (
          <span className="truncate text-xs" title={consent.navegador}>
            {consent.navegador?.substring(0, 30) || "-"}
          </span>
        )
      case "versionTC":
        return <span className="text-sm">{consent.versionTC}</span>
      case "sucursal":
        return <span className="text-sm">{consent.sucursal || "-"}</span>
      case "ubicacion":
        return <span className="text-sm">{consent.ubicacion || "-"}</span>
      case "state":
        const stateConfig = STATE_LABELS[consent.state]
        return <Badge variant={stateConfig.variant}>{stateConfig.label}</Badge>
      default:
        return "-"
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {visibleColumns.map((column) => (
              <th key={column.id} className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                {column.label}
              </th>
            ))}
            <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {consents.map((consent) => (
            <tr
              key={consent.id}
              className="cursor-pointer border-b border-border transition-colors hover:bg-muted/30"
              onClick={() => onRowClick(consent)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  onRowClick(consent)
                }
              }}
            >
              {visibleColumns.map((column) => (
                <td key={column.id} className="px-4 py-3">
                  {renderCell(consent, column.id)}
                </td>
              ))}
              <td className="px-4 py-3 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" aria-label="Acciones">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick(consent)
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver detalle
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onDownload(consent)
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </DropdownMenuItem>
                    {canEdit && consent.state !== "REVOKED" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(consent)
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar metadatos
                        </DropdownMenuItem>
                      </>
                    )}
                    {canRevoke && consent.state === "ACTIVE" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onRevoke(consent)
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Revocar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

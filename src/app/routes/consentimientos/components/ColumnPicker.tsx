"use client"

import { useState, useEffect } from "react"
import { Settings2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export interface ColumnConfig {
  id: string
  label: string
  group: string
  visible: boolean
  required?: boolean
}

interface ColumnPickerProps {
  columns: ColumnConfig[]
  onChange: (columns: ColumnConfig[]) => void
}

const COLUMN_GROUPS = {
  identificacion: "Identificación",
  temporalidad: "Temporalidad",
  regulacion: "Regulación RDC30",
  tecnicos: "Campos Técnicos",
  estado: "Estado y Acciones",
}

export function ColumnPicker({ columns, onChange }: ColumnPickerProps) {
  const [open, setOpen] = useState(false)
  const [localColumns, setLocalColumns] = useState(columns)

  useEffect(() => {
    setLocalColumns(columns)
  }, [columns])

  const handleToggle = (columnId: string) => {
    const updated = localColumns.map((col) => {
      if (col.id === columnId && !col.required) {
        return { ...col, visible: !col.visible }
      }
      return col
    })

    // Ensure at least 3 columns are visible
    const visibleCount = updated.filter((col) => col.visible).length
    if (visibleCount >= 3) {
      setLocalColumns(updated)
    }
  }

  const handleApply = () => {
    onChange(localColumns)
    setOpen(false)
  }

  const handleReset = () => {
    const reset = columns.map((col) => ({ ...col, visible: true }))
    setLocalColumns(reset)
  }

  const groupedColumns = Object.entries(COLUMN_GROUPS).map(([groupId, groupLabel]) => ({
    id: groupId,
    label: groupLabel,
    columns: localColumns.filter((col) => col.group === groupId),
  }))

  const visibleCount = localColumns.filter((col) => col.visible).length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Configurar columnas">
          <Settings2 className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Columnas</span>
          <span className="ml-1 text-xs text-muted-foreground">({visibleCount})</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configurar columnas visibles</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {groupedColumns.map((group) => (
            <div key={group.id} className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">{group.label}</h4>
              <div className="space-y-2">
                {group.columns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={column.id}
                      checked={column.visible}
                      onCheckedChange={() => handleToggle(column.id)}
                      disabled={column.required}
                      aria-label={`Mostrar columna ${column.label}`}
                    />
                    <Label
                      htmlFor={column.id}
                      className="flex-1 cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {column.label}
                      {column.required && <span className="ml-1 text-xs text-muted-foreground">(requerida)</span>}
                    </Label>
                    {column.visible && <Check className="h-4 w-4 text-primary" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Restaurar por defecto
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleApply}>
              Aplicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

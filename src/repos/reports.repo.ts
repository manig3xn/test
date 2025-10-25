// Reports repository - RDC30 and other reports
import { faker } from "@faker-js/faker"
import { initSeed, pastDate } from "@/utils/seed.utils"
import { list as listConsents, getStats } from "./consents.repo"
import type { ReportType } from "./types"

export interface Report {
  id: string
  type: ReportType
  params: {
    from: string
    to: string
    productId?: string
  }
  rows: Record<string, unknown>[]
  generatedAt: string
  generatedBy: string
}

// In-memory storage
let reports: Report[] = []

/**
 * Seed reports with deterministic data
 */
export function seed(count = 10): void {
  initSeed()
  reports = []

  for (let i = 0; i < count; i++) {
    const generatedAt = pastDate(90).toISOString()
    const from = pastDate(120).toISOString()
    const to = pastDate(30).toISOString()

    reports.push({
      id: `report-${i + 1}`,
      type: "RDC30",
      params: {
        from,
        to,
        productId: faker.datatype.boolean({ probability: 0.5 })
          ? faker.helpers.arrayElement(["cuenta-corriente", "tarjeta-credito", "credito-consumo"])
          : undefined,
      },
      rows: buildRdc30Rows(from, to),
      generatedAt,
      generatedBy: faker.helpers.arrayElement(["1", "2"]),
    })
  }

  // Sort by date descending
  reports.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
}

/**
 * Build RDC30 report rows based on consent data
 */
function buildRdc30Rows(from: string, to: string): Record<string, unknown>[] {
  const consents = listConsents({
    fromDate: from,
    toDate: to,
  })

  const stats = getStats()

  return [
    {
      metric: "Total Consentimientos",
      value: stats.total,
    },
    {
      metric: "Consentimientos Activos",
      value: stats.active,
    },
    {
      metric: "Consentimientos por Vencer",
      value: stats.expiringSoon,
    },
    {
      metric: "Consentimientos Vencidos",
      value: stats.expired,
    },
    {
      metric: "Consentimientos Revocados",
      value: stats.revoked,
    },
    {
      metric: "Tasa de Revocación",
      value: `${((stats.revoked / stats.total) * 100).toFixed(2)}%`,
    },
  ]
}

/**
 * List reports with optional filters
 */
export function list(filter?: {
  type?: ReportType
  generatedBy?: string
}): Report[] {
  let results = [...reports]

  if (filter) {
    if (filter.type) {
      results = results.filter((r) => r.type === filter.type)
    }

    if (filter.generatedBy) {
      results = results.filter((r) => r.generatedBy === filter.generatedBy)
    }
  }

  return results
}

/**
 * Get report by ID
 */
export function getById(id: string): Report | undefined {
  return reports.find((r) => r.id === id)
}

/**
 * Generate new RDC30 report
 */
export function generateRdc30(params: { from: string; to: string; productId?: string }, userId: string): Report {
  const newReport: Report = {
    id: `report-${Date.now()}`,
    type: "RDC30",
    params,
    rows: buildRdc30Rows(params.from, params.to),
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
  }

  reports.unshift(newReport) // Add to beginning
  return newReport
}

// Initialize seed on module load
seed()

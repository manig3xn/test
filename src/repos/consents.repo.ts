// Consents repository - Main consent management with RDC30 compliance
import { faker } from "@faker-js/faker"
import { initSeed, generateRut, randomItem, pastDate, futureDate } from "@/utils/seed.utils"
import { formatRDCDate, formatRDCTime } from "@/utils/date"
import { list as listWidgets } from "./widgets.repo"
import { list as listTcVersions } from "./tc.repo"
import type { ConsentState, ConsentMedium, ConsentPurpose, ConsentObjective, Person, RDC30Timestamps } from "./types"

export interface Consent {
  // Internal IDs
  id: string
  idInterno: string
  idExterno?: string

  // Person data
  person: Person

  // RDC30 required fields
  codigoInstitucion: string
  medio: ConsentMedium
  finalidad: ConsentPurpose
  objetivo: ConsentObjective
  rutEjecutivo?: string

  // Technical fields
  sucursal?: string
  ubicacion?: string
  ip?: string
  navegador?: string

  // T&C and Widget references
  versionTC: string
  widgetId?: string
  tcVersionId?: string

  // Timestamps (RDC30 format)
  timestamps: RDC30Timestamps

  // State and metadata
  state: ConsentState
  meta?: Record<string, string>

  // Audit fields
  createdBy: string
  lastUpdatedBy?: string
}

// In-memory storage
let consents: Consent[] = []

const CODIGO_INSTITUCION = "001" // Mock institution code
const SUCURSALES = [
  "Sucursal Centro",
  "Sucursal Providencia",
  "Sucursal Las Condes",
  "Sucursal Vitacura",
  "Sucursal Ñuñoa",
]
const UBICACIONES = ["Santiago", "Valparaíso", "Concepción", "La Serena", "Temuco"]

/**
 * Seed consents with deterministic RDC30-compliant data
 */
export function seed(count = 300): void {
  initSeed()
  consents = []

  const widgets = listWidgets()
  const tcVersions = listTcVersions({ status: "PUBLISHED" })

  if (widgets.length === 0 || tcVersions.length === 0) {
    console.warn("[consents.repo] No widgets or T&C versions available for seeding")
    return
  }

  for (let i = 0; i < count; i++) {
    const widget = randomItem(widgets)
    const tcVersion = tcVersions.find((tc) => tc.id === widget.activeTcVersionId) || randomItem(tcVersions)

    const createdAtDate = pastDate(180)
    const expiresAtDate = futureDate(faker.number.int({ min: 30, max: 365 }))

    const otorgamientoFecha = formatRDCDate(createdAtDate)
    const otorgamientoHora = formatRDCTime(createdAtDate)
    const finFecha = formatRDCDate(expiresAtDate)
    const finHora = formatRDCTime(expiresAtDate)

    // Determine state based on dates
    let state: ConsentState = "ACTIVE"
    let revokedAt: string | undefined

    const now = new Date()
    const daysUntilExpiry = Math.floor((expiresAtDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // 10% chance of being revoked
    if (faker.datatype.boolean({ probability: 0.1 })) {
      state = "REVOKED"
      revokedAt = new Date(
        createdAtDate.getTime() + faker.number.int({ min: 1, max: 90 }) * 24 * 60 * 60 * 1000,
      ).toISOString()
    } else if (expiresAtDate < now) {
      state = "EXPIRED"
    } else if (daysUntilExpiry <= 30) {
      state = "EXPIRING_SOON"
    }

    const medio = randomItem<ConsentMedium>(["ELECTRONIC", "VERBAL", "WRITTEN"])
    const finalidad = randomItem<ConsentPurpose>(["RISK_COMMERCIAL", "RISK_CREDIT"])
    const objetivo = randomItem<ConsentObjective>([
      "CREDITO_COMERCIAL",
      "CONSUMO",
      "VIVIENDA",
      "FINANCIERO",
      "INSTRUMENTO_DEUDA",
      "CONTINGENTE",
      "LINEA_LIBRE",
    ])

    // Generate optional fields based on medio
    const rutEjecutivo = medio === "VERBAL" || medio === "WRITTEN" ? generateRut() : undefined
    const sucursal = medio === "WRITTEN" ? randomItem(SUCURSALES) : undefined
    const ubicacion = randomItem(UBICACIONES)

    // Technical metadata
    const ip = faker.internet.ip()
    const navegador = faker.internet.userAgent()

    const meta: Record<string, string> = {
      productId: widget.productId,
      channel: medio === "ELECTRONIC" ? "WEB" : medio === "VERBAL" ? "CALL_CENTER" : "BRANCH",
    }

    if (sucursal) {
      meta.sucursal = sucursal
    }

    consents.push({
      id: `consent-${i + 1}`,
      idInterno: `INT-${String(i + 1).padStart(8, "0")}`,
      idExterno: faker.datatype.boolean({ probability: 0.7 })
        ? `EXT-${faker.string.alphanumeric(10).toUpperCase()}`
        : undefined,
      person: {
        rut: generateRut(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
      },
      codigoInstitucion: CODIGO_INSTITUCION,
      medio,
      finalidad,
      objetivo,
      rutEjecutivo,
      sucursal,
      ubicacion,
      ip,
      navegador,
      versionTC: tcVersion.version,
      widgetId: widget.id,
      tcVersionId: tcVersion.id,
      timestamps: {
        otorgamientoFecha,
        otorgamientoHora,
        finFecha,
        finHora,
        revokedAt,
      },
      state,
      meta,
      createdBy: randomItem(["1", "2", "3"]), // User IDs
      lastUpdatedBy: state === "REVOKED" ? randomItem(["1", "2"]) : undefined,
    })
  }
}

/**
 * List consents with optional filters
 */
export function list(
  filter?: Partial<Consent> & {
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
  },
): Consent[] {
  let results = [...consents]

  if (filter) {
    if (filter.search) {
      const search = filter.search.toLowerCase()
      results = results.filter(
        (c) =>
          c.person.name.toLowerCase().includes(search) ||
          c.person.rut.includes(search) ||
          c.person.email.toLowerCase().includes(search) ||
          c.idInterno.toLowerCase().includes(search) ||
          c.idExterno?.toLowerCase().includes(search),
      )
    }

    if (filter.states && filter.states.length > 0) {
      results = results.filter((c) => filter.states!.includes(c.state))
    }

    if (filter.medios && filter.medios.length > 0) {
      results = results.filter((c) => filter.medios!.includes(c.medio))
    }

    if (filter.finalidades && filter.finalidades.length > 0) {
      results = results.filter((c) => filter.finalidades!.includes(c.finalidad))
    }

    if (filter.objetivos && filter.objetivos.length > 0) {
      results = results.filter((c) => filter.objetivos!.includes(c.objetivo))
    }

    if (filter.sucursal) {
      results = results.filter((c) => c.sucursal === filter.sucursal)
    }

    if (filter.ubicacion) {
      results = results.filter((c) => c.ubicacion === filter.ubicacion)
    }

    if (filter.rutEjecutivo) {
      results = results.filter((c) => c.rutEjecutivo === filter.rutEjecutivo)
    }

    if (filter.fromDate) {
      results = results.filter((c) => c.timestamps.otorgamientoFecha >= filter.fromDate!)
    }

    if (filter.toDate) {
      results = results.filter((c) => c.timestamps.otorgamientoFecha <= filter.toDate!)
    }
  }

  return results.sort((a, b) => b.timestamps.otorgamientoFecha.localeCompare(a.timestamps.otorgamientoFecha))
}

/**
 * Get consent by ID
 */
export function getById(id: string): Consent | undefined {
  return consents.find((c) => c.id === id)
}

/**
 * Get consents by person RUT
 */
export function getByPersonRut(rut: string): Consent[] {
  return consents.filter((c) => c.person.rut === rut)
}

/**
 * Create new consent
 */
export function create(data: Omit<Consent, "id" | "idInterno">): Consent {
  const newConsent: Consent = {
    ...data,
    id: `consent-${Date.now()}`,
    idInterno: `INT-${String(consents.length + 1).padStart(8, "0")}`,
  }
  consents.push(newConsent)
  return newConsent
}

/**
 * Update consent
 */
export function update(id: string, patch: Partial<Consent>): Consent | undefined {
  const index = consents.findIndex((c) => c.id === id)
  if (index === -1) return undefined

  consents[index] = {
    ...consents[index],
    ...patch,
  }

  return consents[index]
}

/**
 * Revoke consent
 */
export function revoke(id: string, revokedBy: string): Consent | undefined {
  const consent = consents.find((c) => c.id === id)
  if (!consent) return undefined

  return update(id, {
    state: "REVOKED",
    timestamps: {
      ...consent.timestamps,
      revokedAt: new Date().toISOString(),
    },
    lastUpdatedBy: revokedBy,
  })
}

/**
 * Get consent statistics
 */
export function getStats(): {
  total: number
  active: number
  expiringSoon: number
  expired: number
  revoked: number
  byMedio: Record<ConsentMedium, number>
  byFinalidad: Record<ConsentPurpose, number>
} {
  return {
    total: consents.length,
    active: consents.filter((c) => c.state === "ACTIVE").length,
    expiringSoon: consents.filter((c) => c.state === "EXPIRING_SOON").length,
    expired: consents.filter((c) => c.state === "EXPIRED").length,
    revoked: consents.filter((c) => c.state === "REVOKED").length,
    byMedio: {
      ELECTRONIC: consents.filter((c) => c.medio === "ELECTRONIC").length,
      VERBAL: consents.filter((c) => c.medio === "VERBAL").length,
      WRITTEN: consents.filter((c) => c.medio === "WRITTEN").length,
    },
    byFinalidad: {
      RISK_COMMERCIAL: consents.filter((c) => c.finalidad === "RISK_COMMERCIAL").length,
      RISK_CREDIT: consents.filter((c) => c.finalidad === "RISK_CREDIT").length,
    },
  }
}

// Initialize seed on module load
seed()

// Alerts repository - System alerts and notifications
import { faker } from "@faker-js/faker"
import { initSeed, randomItem, pastDate } from "@/utils/seed.utils"
import { list as listConsents } from "./consents.repo"
import type { AlertType, AlertState, ResourceType } from "./types"

export interface Alert {
  id: string
  type: AlertType
  createdAt: string
  state: AlertState
  resourceType?: ResourceType
  resourceId?: string
  message: string
  acknowledgedBy?: string
  acknowledgedAt?: string
}

// In-memory storage
let alerts: Alert[] = []

/**
 * Seed alerts with deterministic data
 */
export function seed(count = 20): void {
  initSeed()
  alerts = []

  const consents = listConsents()
  const alertTypes: AlertType[] = ["EXPIRING_SOON", "EXPIRED", "UNUSUAL_REVOKE", "JOB_ERROR", "WEBHOOK_FAIL"]

  for (let i = 0; i < count; i++) {
    const type = randomItem(alertTypes)
    const isAcknowledged = faker.datatype.boolean({ probability: 0.3 })
    const createdAt = pastDate(30).toISOString()

    let message = ""
    let resourceType: ResourceType | undefined
    let resourceId: string | undefined

    switch (type) {
      case "EXPIRING_SOON":
        const expiringSoonConsent = consents.find((c) => c.state === "EXPIRING_SOON")
        if (expiringSoonConsent) {
          resourceType = "CONSENT"
          resourceId = expiringSoonConsent.id
          message = `Consentimiento ${expiringSoonConsent.id} está por vencer`
        } else {
          message = "Hay consentimientos próximos a vencer"
        }
        break

      case "EXPIRED":
        const expiredConsent = consents.find((c) => c.state === "EXPIRED")
        if (expiredConsent) {
          resourceType = "CONSENT"
          resourceId = expiredConsent.id
          message = `Consentimiento ${expiredConsent.id} ha vencido`
        } else {
          message = "Hay consentimientos vencidos"
        }
        break

      case "UNUSUAL_REVOKE":
        message = `Pico inusual de revocaciones detectado: ${faker.number.int({ min: 10, max: 50 })} en las últimas 24h`
        break

      case "JOB_ERROR":
        resourceType = "JOB"
        resourceId = `job-${faker.number.int({ min: 1, max: 100 })}`
        message = `Error en trabajo de ${randomItem(["importación", "exportación"])}: ${faker.lorem.sentence()}`
        break

      case "WEBHOOK_FAIL":
        message = `Fallo en webhook: ${faker.internet.url()} - ${faker.lorem.sentence()}`
        break
    }

    alerts.push({
      id: `alert-${i + 1}`,
      type,
      createdAt,
      state: isAcknowledged ? "ACK" : "OPEN",
      resourceType,
      resourceId,
      message,
      acknowledgedBy: isAcknowledged ? randomItem(["1", "2"]) : undefined,
      acknowledgedAt: isAcknowledged
        ? new Date(new Date(createdAt).getTime() + faker.number.int({ min: 1, max: 24 }) * 60 * 60 * 1000).toISOString()
        : undefined,
    })
  }

  // Sort by date descending
  alerts.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/**
 * List alerts with optional filters
 */
export function list(filter?: {
  type?: AlertType
  state?: AlertState
  resourceType?: ResourceType
  resourceId?: string
}): Alert[] {
  let results = [...alerts]

  if (filter) {
    if (filter.type) {
      results = results.filter((a) => a.type === filter.type)
    }

    if (filter.state) {
      results = results.filter((a) => a.state === filter.state)
    }

    if (filter.resourceType) {
      results = results.filter((a) => a.resourceType === filter.resourceType)
    }

    if (filter.resourceId) {
      results = results.filter((a) => a.resourceId === filter.resourceId)
    }
  }

  return results
}

/**
 * Get alert by ID
 */
export function getById(id: string): Alert | undefined {
  return alerts.find((a) => a.id === id)
}

/**
 * Get open alerts count
 */
export function getOpenCount(): number {
  return alerts.filter((a) => a.state === "OPEN").length
}

/**
 * Create new alert
 */
export function create(data: Omit<Alert, "id" | "createdAt" | "state">): Alert {
  const newAlert: Alert = {
    ...data,
    id: `alert-${Date.now()}`,
    createdAt: new Date().toISOString(),
    state: "OPEN",
  }
  alerts.unshift(newAlert) // Add to beginning
  return newAlert
}

/**
 * Acknowledge alert
 */
export function acknowledge(id: string, userId: string): Alert | undefined {
  const index = alerts.findIndex((a) => a.id === id)
  if (index === -1) return undefined

  alerts[index] = {
    ...alerts[index],
    state: "ACK",
    acknowledgedBy: userId,
    acknowledgedAt: new Date().toISOString(),
  }

  return alerts[index]
}

// Initialize seed on module load
seed()

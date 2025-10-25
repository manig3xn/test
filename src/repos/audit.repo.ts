// Audit repository - Centralized audit trail
import { faker } from "@faker-js/faker"
import { initSeed, randomItem, pastDate } from "@/utils/seed.utils"
import type { AuditAction, ResourceType } from "./types"

export interface AuditEvent {
  id: string
  at: string
  actorUserId: string
  action: AuditAction
  resourceType: ResourceType
  resourceId: string
  payload?: Record<string, unknown>
}

// In-memory storage
let auditEvents: AuditEvent[] = []

/**
 * Seed audit events with deterministic data
 */
export function seed(count = 100): void {
  initSeed()
  auditEvents = []

  const actions: AuditAction[] = ["CREATE", "UPDATE", "DELETE", "REVOKE", "EXPORT", "IMPORT", "LOGIN", "LOGOUT"]
  const resourceTypes: ResourceType[] = ["CONSENT", "TC", "WIDGET", "USER", "JOB", "ALERT", "REPORT"]

  for (let i = 0; i < count; i++) {
    const action = randomItem(actions)
    const resourceType = randomItem(resourceTypes)

    auditEvents.push({
      id: `audit-${i + 1}`,
      at: pastDate(90).toISOString(),
      actorUserId: randomItem(["1", "2", "3"]),
      action,
      resourceType,
      resourceId: `${resourceType.toLowerCase()}-${faker.number.int({ min: 1, max: 100 })}`,
      payload:
        action === "UPDATE"
          ? {
              field: faker.database.column(),
              oldValue: faker.lorem.word(),
              newValue: faker.lorem.word(),
            }
          : undefined,
    })
  }

  // Sort by date descending
  auditEvents.sort((a, b) => b.at.localeCompare(a.at))
}

/**
 * List audit events with optional filters
 */
export function list(filter?: {
  actorUserId?: string
  action?: AuditAction
  resourceType?: ResourceType
  resourceId?: string
  fromDate?: string
  toDate?: string
}): AuditEvent[] {
  let results = [...auditEvents]

  if (filter) {
    if (filter.actorUserId) {
      results = results.filter((e) => e.actorUserId === filter.actorUserId)
    }

    if (filter.action) {
      results = results.filter((e) => e.action === filter.action)
    }

    if (filter.resourceType) {
      results = results.filter((e) => e.resourceType === filter.resourceType)
    }

    if (filter.resourceId) {
      results = results.filter((e) => e.resourceId === filter.resourceId)
    }

    if (filter.fromDate) {
      results = results.filter((e) => e.at >= filter.fromDate!)
    }

    if (filter.toDate) {
      results = results.filter((e) => e.at <= filter.toDate!)
    }
  }

  return results
}

/**
 * Get audit event by ID
 */
export function getById(id: string): AuditEvent | undefined {
  return auditEvents.find((e) => e.id === id)
}

/**
 * Get audit events for a specific resource
 */
export function getByResource(resourceType: ResourceType, resourceId: string): AuditEvent[] {
  return auditEvents.filter((e) => e.resourceType === resourceType && e.resourceId === resourceId)
}

/**
 * Create new audit event
 */
export function create(data: Omit<AuditEvent, "id" | "at">): AuditEvent {
  const newEvent: AuditEvent = {
    ...data,
    id: `audit-${Date.now()}`,
    at: new Date().toISOString(),
  }
  auditEvents.unshift(newEvent) // Add to beginning for chronological order
  return newEvent
}

// Initialize seed on module load
seed()

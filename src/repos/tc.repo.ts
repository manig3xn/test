// Terms & Conditions repository
import { faker } from "@faker-js/faker"
import { initSeed, pastDate } from "@/utils/seed.utils"
import type { TcStatus, Timestamps } from "./types"

export interface TcVersion {
  id: string
  productId: string
  version: string
  title: string
  content: string
  status: TcStatus
  publishedAt?: string
  createdBy: string
  timestamps: Timestamps
}

// In-memory storage
let tcVersions: TcVersion[] = []

// Products for Chilean financial institution
const PRODUCTS = ["cuenta-corriente", "cuenta-vista", "tarjeta-credito", "credito-consumo", "credito-hipotecario"]

/**
 * Seed T&C versions with deterministic data
 */
export function seed(count = 15): void {
  initSeed()
  tcVersions = []

  PRODUCTS.forEach((productId) => {
    // Each product has 2-4 versions
    const versionCount = faker.number.int({ min: 2, max: 4 })

    for (let v = 1; v <= versionCount; v++) {
      const createdAt = pastDate(365 * 2).toISOString()
      const isPublished = v === versionCount // Latest version is published

      tcVersions.push({
        id: `tc-${productId}-v${v}`,
        productId,
        version: `${v}.0`,
        title: `Términos y Condiciones - ${productId.replace(/-/g, " ")} v${v}.0`,
        content: faker.lorem.paragraphs(5),
        status: isPublished ? "PUBLISHED" : "DRAFT",
        publishedAt: isPublished ? createdAt : undefined,
        createdBy: faker.helpers.arrayElement(["1", "2"]), // Admin or Ops
        timestamps: {
          createdAt,
          updatedAt: createdAt,
        },
      })
    }
  })
}

/**
 * List all T&C versions with optional filters
 */
export function list(filter?: Partial<TcVersion>): TcVersion[] {
  let results = [...tcVersions]

  if (filter) {
    if (filter.productId) {
      results = results.filter((tc) => tc.productId === filter.productId)
    }
    if (filter.status) {
      results = results.filter((tc) => tc.status === filter.status)
    }
  }

  return results.sort((a, b) => b.timestamps.createdAt.localeCompare(a.timestamps.createdAt))
}

/**
 * Get T&C version by ID
 */
export function getById(id: string): TcVersion | undefined {
  return tcVersions.find((tc) => tc.id === id)
}

/**
 * Get published T&C for a product
 */
export function getPublishedByProduct(productId: string): TcVersion | undefined {
  return tcVersions.find((tc) => tc.productId === productId && tc.status === "PUBLISHED")
}

/**
 * Create new T&C version
 */
export function create(data: Omit<TcVersion, "id" | "timestamps">): TcVersion {
  const newTc: TcVersion = {
    ...data,
    id: `tc-${data.productId}-v${Date.now()}`,
    timestamps: {
      createdAt: new Date().toISOString(),
    },
  }
  tcVersions.push(newTc)
  return newTc
}

/**
 * Update T&C version
 */
export function update(id: string, patch: Partial<TcVersion>): TcVersion | undefined {
  const index = tcVersions.findIndex((tc) => tc.id === id)
  if (index === -1) return undefined

  tcVersions[index] = {
    ...tcVersions[index],
    ...patch,
    timestamps: {
      ...tcVersions[index].timestamps,
      updatedAt: new Date().toISOString(),
    },
  }

  return tcVersions[index]
}

/**
 * Get all products
 */
export function getProducts(): string[] {
  return [...PRODUCTS]
}

// Initialize seed on module load
seed()

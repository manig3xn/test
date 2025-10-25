// Widgets repository - Consent collection widgets
import { faker } from "@faker-js/faker"
import { initSeed } from "@/utils/seed.utils"
import { getPublishedByProduct, getProducts } from "./tc.repo"
import type { Timestamps } from "./types"

export interface Widget {
  id: string
  productId: string
  name: string
  brand: {
    logoUrl?: string
    primaryColor?: string
  }
  texts: {
    title: string
    subtitle?: string
  }
  activeTcVersionId: string
  isActive: boolean
  timestamps: Timestamps
}

// In-memory storage
let widgets: Widget[] = []

const BRAND_COLORS = [
  "#0066CC", // Blue
  "#00A651", // Green
  "#E31837", // Red
  "#FF6B00", // Orange
  "#6B4C9A", // Purple
]

/**
 * Seed widgets with deterministic data
 */
export function seed(count = 10): void {
  initSeed()
  widgets = []

  const products = getProducts()

  products.forEach((productId, index) => {
    // Each product has 1-2 widgets
    const widgetCount = faker.number.int({ min: 1, max: 2 })

    for (let w = 0; w < widgetCount; w++) {
      const publishedTc = getPublishedByProduct(productId)
      if (!publishedTc) continue

      const createdAt = new Date(
        Date.now() - faker.number.int({ min: 30, max: 365 }) * 24 * 60 * 60 * 1000,
      ).toISOString()

      widgets.push({
        id: `widget-${productId}-${w + 1}`,
        productId,
        name: `Widget ${productId.replace(/-/g, " ")} ${w > 0 ? `(${w + 1})` : ""}`,
        brand: {
          logoUrl: faker.image.urlLoremFlickr({ category: "business", width: 200, height: 80 }),
          primaryColor: BRAND_COLORS[index % BRAND_COLORS.length],
        },
        texts: {
          title: `Autorización de ${productId.replace(/-/g, " ")}`,
          subtitle: faker.lorem.sentence(),
        },
        activeTcVersionId: publishedTc.id,
        isActive: true,
        timestamps: {
          createdAt,
          updatedAt: createdAt,
        },
      })
    }
  })
}

/**
 * List all widgets with optional filters
 */
export function list(filter?: Partial<Widget>): Widget[] {
  let results = [...widgets]

  if (filter) {
    if (filter.productId) {
      results = results.filter((w) => w.productId === filter.productId)
    }
    if (filter.isActive !== undefined) {
      results = results.filter((w) => w.isActive === filter.isActive)
    }
  }

  return results.sort((a, b) => b.timestamps.createdAt.localeCompare(a.timestamps.createdAt))
}

/**
 * Get widget by ID
 */
export function getById(id: string): Widget | undefined {
  return widgets.find((w) => w.id === id)
}

/**
 * Create new widget
 */
export function create(data: Omit<Widget, "id" | "timestamps">): Widget {
  const newWidget: Widget = {
    ...data,
    id: `widget-${data.productId}-${Date.now()}`,
    timestamps: {
      createdAt: new Date().toISOString(),
    },
  }
  widgets.push(newWidget)
  return newWidget
}

/**
 * Update widget
 */
export function update(id: string, patch: Partial<Widget>): Widget | undefined {
  const index = widgets.findIndex((w) => w.id === id)
  if (index === -1) return undefined

  widgets[index] = {
    ...widgets[index],
    ...patch,
    timestamps: {
      ...widgets[index].timestamps,
      updatedAt: new Date().toISOString(),
    },
  }

  return widgets[index]
}

// Initialize seed on module load
seed()

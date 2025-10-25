// Deterministic seed generator utility
import { faker } from "@faker-js/faker"

/**
 * Initialize faker with a deterministic seed
 * Uses VITE_MOCK_SEED env var or defaults to 123
 */
export function initSeed(customSeed?: number): void {
  const seed = customSeed ?? Number(import.meta.env.VITE_MOCK_SEED) ?? 123
  faker.seed(seed)
}

/**
 * Generate a Chilean RUT (simplified, not validated)
 */
export function generateRut(): string {
  const num = faker.number.int({ min: 5000000, max: 25000000 })
  const dv = faker.number.int({ min: 0, max: 9 })
  return `${num}-${dv}`
}

/**
 * Generate a random date within a range
 */
export function randomDate(start: Date, end: Date): Date {
  return faker.date.between({ from: start, to: end })
}

/**
 * Generate a random date in the past (days ago)
 */
export function pastDate(days: number): Date {
  return faker.date.recent({ days })
}

/**
 * Generate a random date in the future (days ahead)
 */
export function futureDate(days: number): Date {
  return faker.date.soon({ days })
}

/**
 * Pick a random item from an array
 */
export function randomItem<T>(items: T[]): T {
  return faker.helpers.arrayElement(items)
}

/**
 * Generate a random subset of items
 */
export function randomSubset<T>(items: T[], min: number, max: number): T[] {
  const count = faker.number.int({ min, max })
  return faker.helpers.arrayElements(items, count)
}

import { faker } from "@faker-js/faker"
import { initSeed } from "@/utils/seed.utils"
import type { Role } from "./types"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  lastLoginAt?: string
}

// In-memory storage
let users: User[] = []
let currentUser: User | null = null

/**
 * Seed users with deterministic data
 */
export function seed(count = 50): void {
  initSeed()
  users = []

  // Always create the 3 main users for POC
  users.push(
    {
      id: "1",
      name: "Admin Usuario",
      email: "admin@banco.cl",
      role: "ADMIN",
      lastLoginAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Operador Usuario",
      email: "ops@banco.cl",
      role: "OPS",
      lastLoginAt: faker.date.recent({ days: 7 }).toISOString(),
    },
    {
      id: "3",
      name: "Mandatario Usuario",
      email: "mandatario@banco.cl",
      role: "MANDATARY",
      lastLoginAt: faker.date.recent({ days: 7 }).toISOString(),
    },
  )

  // Generate additional users
  const roles: Role[] = ["ADMIN", "OPS", "MANDATARY"]
  for (let i = 4; i <= count; i++) {
    users.push({
      id: String(i),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: faker.helpers.arrayElement(roles),
      lastLoginAt: faker.datatype.boolean({ probability: 0.7 })
        ? faker.date.recent({ days: 30 }).toISOString()
        : undefined,
    })
  }

  // Default to Admin user for POC
  currentUser = users[0]
}

/**
 * List all users with optional filters
 */
export function list(filter?: { role?: Role }): User[] {
  let results = [...users]

  if (filter?.role) {
    results = results.filter((u) => u.role === filter.role)
  }

  return results.sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Get user by ID
 */
export function getById(id: string): User | undefined {
  return users.find((u) => u.id === id)
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return currentUser
}

/**
 * Set current user
 */
export function setCurrentUser(user: User): void {
  currentUser = user
}

/**
 * Update user
 */
export function update(id: string, patch: Partial<User>): User | undefined {
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) return undefined

  users[index] = {
    ...users[index],
    ...patch,
  }

  return users[index]
}

// Initialize seed on module load
seed()

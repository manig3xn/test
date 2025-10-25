import { initSeed } from "@/utils/seed.utils"
import { list as listConsents } from "./consents.repo"

export interface ConsumerProfile {
  personId: string
  rut: string
  name: string
  email: string
  consentIds: string[]
}

// In-memory storage
let consumerProfiles: ConsumerProfile[] = []

/**
 * Seed consumer profiles based on existing consents
 */
export function seed(): void {
  initSeed()
  consumerProfiles = []

  const consents = listConsents()
  const uniquePersons = new Map<string, ConsumerProfile>()

  // Group consents by person
  consents.forEach((consent) => {
    const key = consent.person.rut

    if (!uniquePersons.has(key)) {
      uniquePersons.set(key, {
        personId: `person-${uniquePersons.size + 1}`,
        rut: consent.person.rut,
        name: consent.person.name,
        email: consent.person.email,
        consentIds: [],
      })
    }

    uniquePersons.get(key)!.consentIds.push(consent.id)
  })

  consumerProfiles = Array.from(uniquePersons.values())
}

/**
 * Get consumer profile by RUT
 */
export function getByRut(rut: string): ConsumerProfile | undefined {
  return consumerProfiles.find((p) => p.rut === rut)
}

/**
 * Get consumer profile by email
 */
export function getByEmail(email: string): ConsumerProfile | undefined {
  return consumerProfiles.find((p) => p.email.toLowerCase() === email.toLowerCase())
}

/**
 * List all consumer profiles
 */
export function list(): ConsumerProfile[] {
  return [...consumerProfiles]
}

/**
 * Authenticate consumer (mock)
 */
export function authenticate(rut: string, email: string): ConsumerProfile | null {
  const profile = consumerProfiles.find((p) => p.rut === rut && p.email.toLowerCase() === email.toLowerCase())
  return profile || null
}

// Initialize seed on module load
seed()

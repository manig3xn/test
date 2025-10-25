// Jobs repository - Import/Export job tracking
import { faker } from "@faker-js/faker"
import { initSeed, randomItem, pastDate } from "@/utils/seed.utils"
import type { JobType, JobStatus } from "./types"

export interface Job {
  id: string
  type: JobType
  format: "CSV" | "XLSX" | "JSON"
  status: JobStatus
  createdAt: string
  createdBy: string
  completedAt?: string
  errorMessage?: string
  recordsProcessed?: number
  recordsTotal?: number
}

// In-memory storage
let jobs: Job[] = []

/**
 * Seed jobs with deterministic data
 */
export function seed(count = 30): void {
  initSeed()
  jobs = []

  const jobTypes: JobType[] = ["IMPORT", "EXPORT"]
  const formats: ("CSV" | "XLSX" | "JSON")[] = ["CSV", "XLSX", "JSON"]
  const statuses: JobStatus[] = ["QUEUED", "RUNNING", "SUCCESS", "ERROR"]

  for (let i = 0; i < count; i++) {
    const type = randomItem(jobTypes)
    const format = randomItem(formats)
    const status = randomItem(statuses)
    const createdAt = pastDate(60).toISOString()

    const recordsTotal = faker.number.int({ min: 10, max: 1000 })
    const recordsProcessed =
      status === "SUCCESS"
        ? recordsTotal
        : status === "RUNNING"
          ? faker.number.int({ min: 0, max: recordsTotal })
          : status === "ERROR"
            ? faker.number.int({ min: 0, max: recordsTotal })
            : 0

    jobs.push({
      id: `job-${i + 1}`,
      type,
      format,
      status,
      createdAt,
      createdBy: randomItem(["1", "2"]),
      completedAt: ["SUCCESS", "ERROR"].includes(status)
        ? new Date(new Date(createdAt).getTime() + faker.number.int({ min: 1, max: 60 }) * 60 * 1000).toISOString()
        : undefined,
      errorMessage: status === "ERROR" ? faker.lorem.sentence() : undefined,
      recordsProcessed: status !== "QUEUED" ? recordsProcessed : undefined,
      recordsTotal,
    })
  }

  // Sort by date descending
  jobs.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/**
 * List jobs with optional filters
 */
export function list(filter?: {
  type?: JobType
  status?: JobStatus
  createdBy?: string
}): Job[] {
  let results = [...jobs]

  if (filter) {
    if (filter.type) {
      results = results.filter((j) => j.type === filter.type)
    }

    if (filter.status) {
      results = results.filter((j) => j.status === filter.status)
    }

    if (filter.createdBy) {
      results = results.filter((j) => j.createdBy === filter.createdBy)
    }
  }

  return results
}

/**
 * Get job by ID
 */
export function getById(id: string): Job | undefined {
  return jobs.find((j) => j.id === id)
}

/**
 * Create new job
 */
export function create(data: Omit<Job, "id" | "createdAt" | "status">): Job {
  const newJob: Job = {
    ...data,
    id: `job-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "QUEUED",
  }
  jobs.unshift(newJob) // Add to beginning
  return newJob
}

/**
 * Update job status
 */
export function updateStatus(
  id: string,
  status: JobStatus,
  options?: {
    errorMessage?: string
    recordsProcessed?: number
  },
): Job | undefined {
  const index = jobs.findIndex((j) => j.id === id)
  if (index === -1) return undefined

  jobs[index] = {
    ...jobs[index],
    status,
    completedAt: ["SUCCESS", "ERROR"].includes(status) ? new Date().toISOString() : undefined,
    errorMessage: options?.errorMessage,
    recordsProcessed: options?.recordsProcessed,
  }

  return jobs[index]
}

// Initialize seed on module load
seed()

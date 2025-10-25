// Consents repository hook
import { useRepo } from "./useRepo"
import * as consentsRepo from "@/repos/consents.repo"
import type { Consent } from "@/repos/consents.repo"

export function useConsentsRepo() {
  return useRepo<Consent>(consentsRepo.list, consentsRepo.getById, consentsRepo.create, consentsRepo.update)
}

export function useConsentStats() {
  return consentsRepo.getStats()
}

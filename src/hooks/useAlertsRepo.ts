// Alerts repository hook
import { useRepo } from "./useRepo"
import * as alertsRepo from "@/repos/alerts.repo"
import type { Alert } from "@/repos/alerts.repo"

export function useAlertsRepo() {
  return useRepo<Alert>(alertsRepo.list, alertsRepo.getById, alertsRepo.create)
}

export function useOpenAlertsCount() {
  return alertsRepo.getOpenCount()
}

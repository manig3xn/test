// Reports repository hook
import { useRepo } from "./useRepo"
import * as reportsRepo from "@/repos/reports.repo"
import type { Report } from "@/repos/reports.repo"

export function useReportsRepo() {
  return useRepo<Report>(reportsRepo.list, reportsRepo.getById)
}

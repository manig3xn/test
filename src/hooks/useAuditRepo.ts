// Audit repository hook
import { useRepo } from "./useRepo"
import * as auditRepo from "@/repos/audit.repo"
import type { AuditEvent } from "@/repos/audit.repo"

export function useAuditRepo() {
  return useRepo<AuditEvent>(auditRepo.list, auditRepo.getById, auditRepo.create)
}

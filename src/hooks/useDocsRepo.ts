// Documentation repository hook
import { useRepo } from "./useRepo"
import * as docsRepo from "@/repos/docs.repo"
import type { Doc } from "@/repos/docs.repo"

export function useDocsRepo() {
  return useRepo<Doc>(docsRepo.list, docsRepo.getById)
}

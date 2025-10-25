// Jobs repository hook
import { useRepo } from "./useRepo"
import * as jobsRepo from "@/repos/jobs.repo"
import type { Job } from "@/repos/jobs.repo"

export function useJobsRepo() {
  return useRepo<Job>(jobsRepo.list, jobsRepo.getById, jobsRepo.create)
}

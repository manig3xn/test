// T&C repository hook
import { useRepo } from "./useRepo"
import * as tcRepo from "@/repos/tc.repo"
import type { TcVersion } from "@/repos/tc.repo"

export function useTcRepo() {
  return useRepo<TcVersion>(tcRepo.list, tcRepo.getById, tcRepo.create, tcRepo.update)
}

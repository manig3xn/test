// Widgets repository hook
import { useRepo } from "./useRepo"
import * as widgetsRepo from "@/repos/widgets.repo"
import type { Widget } from "@/repos/widgets.repo"

export function useWidgetsRepo() {
  return useRepo<Widget>(widgetsRepo.list, widgetsRepo.getById, widgetsRepo.create, widgetsRepo.update)
}

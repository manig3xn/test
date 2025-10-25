import type { Role } from "@/repos/types"

export type { Role }

export interface User {
  id: string
  name: string
  email: string
  role: Role
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  ADMIN: 3,
  OPS: 2,
  MANDATARY: 1,
}

export function canAccess(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole)
}

export function hasMinimumRole(userRole: Role, minimumRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole]
}

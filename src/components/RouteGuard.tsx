// Route guard component for role-based access control
"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { getCurrentUser } from "@/repos/users.repo"
import { type Role, canAccess } from "@/utils/roles"

interface RouteGuardProps {
  allowedRoles: Role[]
  children: React.ReactNode
}

export function RouteGuard({ allowedRoles, children }: RouteGuardProps) {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    return <Navigate to="/dashboard" replace />
  }

  if (!canAccess(currentUser.role, allowedRoles)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

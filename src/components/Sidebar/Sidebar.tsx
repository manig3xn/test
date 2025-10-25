// Desktop sidebar component
"use client"

import { useLocation } from "react-router-dom"
import { usersRepo } from "@/repos/users.repo"
import { filterNavByRole } from "@/utils/nav"
import { NavSection } from "./NavSection"
import { NavItem } from "./NavItem"

export function Sidebar() {
  const location = useLocation()
  const currentUser = usersRepo.getCurrentUser()

  if (!currentUser) return null

  const navSections = filterNavByRole(currentUser.role)

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:w-[280px] border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
      aria-label="Navegación principal"
    >
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <h1 className="text-lg font-semibold">Gestión de Consentimientos</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6">
        {navSections.map((section) => (
          <NavSection key={section.id} label={section.label}>
            {section.items.map((item) => (
              <NavItem
                key={item.id}
                label={item.label}
                path={item.path}
                icon={item.icon}
                isActive={location.pathname === item.path}
                badge={item.badgeSelector?.()}
              />
            ))}
          </NavSection>
        ))}
      </div>
    </aside>
  )
}

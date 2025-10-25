// Mobile navigation drawer component
"use client"

import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { X } from "lucide-react"
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react"
import { useUIStore } from "@/stores/ui.store"
import { usersRepo } from "@/repos/users.repo"
import { filterNavByRole } from "@/utils/nav"
import { NavSection } from "./NavSection"
import { NavItem } from "./NavItem"
import { Button } from "@/components/ui/button"

export function MobileNavDrawer() {
  const location = useLocation()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const currentUser = usersRepo.getCurrentUser()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const navSections = currentUser ? filterNavByRole(currentUser.role) : []

  const handleClose = () => {
    setSidebarOpen(false)
  }

  const handleNavItemClick = () => {
    setSidebarOpen(false)
  }

  // Close drawer on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname, setSidebarOpen])

  return (
    <Dialog open={sidebarOpen} onClose={handleClose} className="relative z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Drawer */}
      <div className="fixed inset-0 flex">
        <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 flex-col bg-sidebar text-sidebar-foreground">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
            <DialogTitle className="text-lg font-semibold">Gestión de Consentimientos</DialogTitle>
            <Button ref={closeButtonRef} variant="ghost" size="icon" onClick={handleClose} aria-label="Cerrar menú">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
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
                    onClick={handleNavItemClick}
                  />
                ))}
              </NavSection>
            ))}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

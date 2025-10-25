// App shell component - main layout container
"use client"

import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { useUIStore } from "@/stores/ui.store"
import { buildBreadcrumbs } from "@/utils/nav"
import { Sidebar } from "./Sidebar/Sidebar"
import { MobileNavDrawer } from "./Sidebar/MobileNavDrawer"
import { Header } from "./Header/Header"
import { Breadcrumbs } from "./Breadcrumbs/Breadcrumbs"

export function AppShell() {
  const location = useLocation()
  const { setActivePath, setBreadcrumbs } = useUIStore()

  // Update active path and breadcrumbs on route change
  useEffect(() => {
    setActivePath(location.pathname)
    setBreadcrumbs(buildBreadcrumbs(location.pathname))
  }, [location.pathname, setActivePath, setBreadcrumbs])

  return (
    <div className="flex min-h-dvh">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileNavDrawer />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-4 lg:p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>
    </div>
  )
}

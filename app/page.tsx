"use client"

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppShell } from "@/components/AppShell"
import { RouteGuard } from "@/components/RouteGuard"

// Pages
import DashboardPage from "@/app/routes/dashboard"
import ConsentimientosPage from "@/app/routes/consentimientos"
import CargasPage from "@/app/routes/cargas"
import ReportesRDC30Page from "@/app/routes/reportes/rdc30"
import WidgetsPage from "@/app/routes/widgets"
import TCPage from "@/app/routes/tc"
import DocsPage from "@/app/routes/docs"
import UsuariosPage from "@/app/routes/usuarios"
import BitacoraPage from "@/app/routes/bitacora"
import AlertasPage from "@/app/routes/alertas"
import ConfigPage from "@/app/routes/config"
import PortalConsumidorPage from "@/app/routes/portal-consumidor"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Main app routes */}
        <Route element={<AppShell />}>
          {/* Public routes (all roles) */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/consentimientos" element={<ConsentimientosPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/portal-consumidor" element={<PortalConsumidorPage />} />

          {/* Admin & Ops only */}
          <Route
            path="/cargas"
            element={
              <RouteGuard allowedRoles={["ADMIN", "OPS"]}>
                <CargasPage />
              </RouteGuard>
            }
          />
          <Route
            path="/reportes/rdc30"
            element={
              <RouteGuard allowedRoles={["ADMIN", "OPS"]}>
                <ReportesRDC30Page />
              </RouteGuard>
            }
          />
          <Route
            path="/widgets"
            element={
              <RouteGuard allowedRoles={["ADMIN", "OPS"]}>
                <WidgetsPage />
              </RouteGuard>
            }
          />
          <Route
            path="/tc"
            element={
              <RouteGuard allowedRoles={["ADMIN", "OPS"]}>
                <TCPage />
              </RouteGuard>
            }
          />
          <Route
            path="/bitacora"
            element={
              <RouteGuard allowedRoles={["ADMIN", "OPS"]}>
                <BitacoraPage />
              </RouteGuard>
            }
          />
          <Route
            path="/alertas"
            element={
              <RouteGuard allowedRoles={["ADMIN", "OPS"]}>
                <AlertasPage />
              </RouteGuard>
            }
          />

          {/* Admin only */}
          <Route
            path="/usuarios"
            element={
              <RouteGuard allowedRoles={["ADMIN"]}>
                <UsuariosPage />
              </RouteGuard>
            }
          />
          <Route
            path="/config"
            element={
              <RouteGuard allowedRoles={["ADMIN"]}>
                <ConfigPage />
              </RouteGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

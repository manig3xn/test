// Dashboard page
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Vista general de la plataforma de gestión de consentimientos</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Consentimientos Activos</CardTitle>
            <CardDescription>Total de consentimientos vigentes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pendientes de Revisión</CardTitle>
            <CardDescription>Requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">56</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas</CardTitle>
            <CardDescription>Notificaciones activas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">8</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

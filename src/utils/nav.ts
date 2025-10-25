import type React from "react"
// Navigation tree and breadcrumb utilities
import type { Role } from "./roles"
import {
  LayoutDashboard,
  FileCheck,
  Upload,
  BarChart3,
  Puzzle,
  BookOpen,
  Users,
  ScrollText,
  Bell,
  Settings,
  Globe,
} from "lucide-react"

export interface NavItem {
  id: string
  label: string
  path: string
  icon?: React.ComponentType<{ className?: string }>
  roleAccess: Role[]
  badgeSelector?: () => number
  children?: NavItem[]
}

export interface NavSection {
  id: string
  label: string
  items: NavItem[]
}

export const NAV_TREE: NavSection[] = [
  {
    id: "main",
    label: "Principal",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        roleAccess: ["ADMIN", "OPS", "MANDATARY"],
      },
      {
        id: "consentimientos",
        label: "Consentimientos",
        path: "/consentimientos",
        icon: FileCheck,
        roleAccess: ["ADMIN", "OPS", "MANDATARY"],
      },
      {
        id: "cargas",
        label: "Cargas & Descargas",
        path: "/cargas",
        icon: Upload,
        roleAccess: ["ADMIN", "OPS"],
      },
    ],
  },
  {
    id: "reports",
    label: "Reportes & Análisis",
    items: [
      {
        id: "reportes",
        label: "Reportes RDC30",
        path: "/reportes/rdc30",
        icon: BarChart3,
        roleAccess: ["ADMIN", "OPS"],
      },
      {
        id: "widgets",
        label: "Widgets & T&C",
        path: "/widgets",
        icon: Puzzle,
        roleAccess: ["ADMIN", "OPS"],
      },
    ],
  },
  {
    id: "system",
    label: "Sistema",
    items: [
      {
        id: "docs",
        label: "Documentación",
        path: "/docs",
        icon: BookOpen,
        roleAccess: ["ADMIN", "OPS", "MANDATARY"],
      },
      {
        id: "usuarios",
        label: "Usuarios & Accesos",
        path: "/usuarios",
        icon: Users,
        roleAccess: ["ADMIN"],
      },
      {
        id: "bitacora",
        label: "Bitácora",
        path: "/bitacora",
        icon: ScrollText,
        roleAccess: ["ADMIN", "OPS"],
      },
      {
        id: "alertas",
        label: "Alertas",
        path: "/alertas",
        icon: Bell,
        roleAccess: ["ADMIN", "OPS"],
        badgeSelector: () => 0, // Will be connected to alerts.repo later
      },
      {
        id: "config",
        label: "Configuración",
        path: "/config",
        icon: Settings,
        roleAccess: ["ADMIN"],
      },
    ],
  },
  {
    id: "consumer",
    label: "Portal",
    items: [
      {
        id: "portal-consumidor",
        label: "Portal del Consumidor",
        path: "/portal-consumidor",
        icon: Globe,
        roleAccess: ["ADMIN", "OPS", "MANDATARY"],
      },
    ],
  },
]

export function getAllNavItems(): NavItem[] {
  return NAV_TREE.flatMap((section) => section.items)
}

export function findNavItemByPath(path: string): NavItem | undefined {
  return getAllNavItems().find((item) => item.path === path)
}

export function buildBreadcrumbs(path: string): { label: string; path: string }[] {
  const breadcrumbs: { label: string; path: string }[] = [{ label: "Inicio", path: "/dashboard" }]

  const navItem = findNavItemByPath(path)
  if (navItem && navItem.path !== "/dashboard") {
    breadcrumbs.push({ label: navItem.label, path: navItem.path })
  }

  return breadcrumbs
}

export function filterNavByRole(role: Role): NavSection[] {
  return NAV_TREE.map((section) => ({
    ...section,
    items: section.items.filter((item) => item.roleAccess.includes(role)),
  })).filter((section) => section.items.length > 0)
}

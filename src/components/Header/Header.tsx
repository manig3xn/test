// Header component with hamburger, search, theme toggle, and user menu
"use client"

import { Menu, Search } from "lucide-react"
import { useUIStore } from "@/stores/ui.store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "./ThemeToggle"
import { UserMenu } from "./UserMenu"

export function Header() {
  const { toggleSidebar } = useUIStore()

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
      {/* Mobile hamburger */}
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden" aria-label="Abrir menú">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search (placeholder) */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Buscar..." className="pl-9" aria-label="Buscar en la plataforma" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}

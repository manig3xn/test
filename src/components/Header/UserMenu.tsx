// User menu component
"use client"

import { ChevronDown, User, LogOut } from "lucide-react"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { usersRepo } from "@/repos/users.repo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function UserMenu() {
  const currentUser = usersRepo.getCurrentUser()

  if (!currentUser) return null

  const handleLogout = () => {
    // Mock logout - in real app would clear session
    console.log("Logout clicked")
  }

  return (
    <Menu as="div" className="relative">
      <MenuButton as={Button} variant="ghost" className="gap-2">
        <User className="h-5 w-5" />
        <span className="hidden sm:inline">{currentUser.name}</span>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {currentUser.role}
        </Badge>
        <ChevronDown className="h-4 w-4" />
      </MenuButton>

      <MenuItems
        className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-border bg-popover p-1 shadow-lg focus:outline-none"
        transition
      >
        <div className="px-3 py-2 border-b border-border">
          <p className="text-sm font-medium">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground">{currentUser.email}</p>
        </div>

        <MenuItem>
          {({ focus }) => (
            <button
              onClick={handleLogout}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${
                focus ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}

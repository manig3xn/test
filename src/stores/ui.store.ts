// UI Store - Centralized state for theme, sidebar, navigation
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "light" | "dark"

interface Breadcrumb {
  label: string
  path: string
}

interface UIStore {
  theme: Theme
  sidebarOpen: boolean
  activePath: string
  breadcrumbs: Breadcrumb[]

  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setActivePath: (path: string) => void
  setBreadcrumbs: (breadcrumbs: Breadcrumb[]) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      sidebarOpen: false,
      activePath: "/",
      breadcrumbs: [],

      setTheme: (theme) => {
        set({ theme })
        // Apply theme to document
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", theme === "dark")
        }
      },

      toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light"
        get().setTheme(newTheme)
      },

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setActivePath: (path) => set({ activePath: path }),

      setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)

// Initialize theme on mount
if (typeof window !== "undefined") {
  const store = useUIStore.getState()
  document.documentElement.classList.toggle("dark", store.theme === "dark")
}

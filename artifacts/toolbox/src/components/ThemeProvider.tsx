import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Toolora is a dark-first brand. Light mode is intentionally disabled —
  // every page is hand-tuned for dark editorial styling with photo backgrounds.
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light")
    root.classList.add("dark")
    // Clear any legacy stored preference so users never get stuck on light again.
    try { localStorage.removeItem("vite-ui-theme"); localStorage.removeItem("toolora-theme") } catch {}
  }, [])

  const value: ThemeProviderState = {
    theme: "dark",
    setTheme: () => {
      // no-op: theme switching is intentionally disabled
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

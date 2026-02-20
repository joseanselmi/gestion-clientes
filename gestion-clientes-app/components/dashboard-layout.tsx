"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Users, UserPlus, List, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isClientesOpen, setIsClientesOpen] = React.useState(true)

  const getBreadcrumbs = () => {
    if (pathname === "/clientes/listado") return ["Clientes", "Listado"]
    if (pathname === "/clientes/crear-cliente") return ["Clientes", "Crear cliente"]
    if (
      pathname?.startsWith("/clientes/") &&
      pathname !== "/clientes/listado" &&
      pathname !== "/clientes/crear-cliente"
    )
      return ["Clientes", "Detalle"]
    return ["Clientes"]
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-72 border-r border-sidebar-border bg-sidebar flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/clientes/listado" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground tracking-tight">Eglow Studio</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {/* Clientes Section */}
            <div>
              <button
                onClick={() => setIsClientesOpen(!isClientesOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold rounded-xl text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Clientes</span>
                </div>
                <ChevronRight
                  className={cn("w-4 h-4 transition-transform duration-200", isClientesOpen && "rotate-90")}
                />
              </button>

              {/* Submenu */}
              {isClientesOpen && (
                <div className="ml-3 mt-2 space-y-1 border-l-2 border-sidebar-border pl-3">
                  <Link
                    href="/clientes/crear-cliente"
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200",
                      pathname === "/clientes/crear-cliente"
                        ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1",
                    )}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Crear cliente</span>
                  </Link>
                  <Link
                    href="/clientes/listado"
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200",
                      pathname === "/clientes/listado"
                        ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1",
                    )}
                  >
                    <List className="w-4 h-4" />
                    <span>Listado de clientes</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card/80 backdrop-blur-sm px-8 py-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                <span
                  className={cn(
                    "transition-colors",
                    index === breadcrumbs.length - 1 ? "text-foreground font-semibold" : "text-muted-foreground",
                  )}
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-muted/30">{children}</div>
      </main>
    </div>
  )
}

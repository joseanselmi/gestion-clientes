"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Plus, Eye, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { clientesApi, type Cliente } from "@/lib/api"

export function ClientesListado() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [clientes, setClientes] = React.useState<Cliente[]>([])

  React.useEffect(() => {
    clientesApi
      .getAll(searchQuery.trim() || undefined)
      .then((res) => setClientes(res.data))
      .catch(() => setClientes([]))
  }, [searchQuery])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleViewEdit = (id: string) => {
    router.push(`/clientes/${id}`)
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold text-foreground text-balance tracking-tight">Listado de clientes</h1>
        <p className="text-muted-foreground mt-2 text-lg">Gestiona y visualiza todos tus clientes</p>
      </div>

      <Card className="p-5 shadow-lg border-border/50">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 shadow-sm"
            />
          </div>
          <Button asChild className="w-full sm:w-auto h-11 shadow-md hover:shadow-lg transition-shadow">
            <Link href="/clientes/crear-cliente">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo cliente
            </Link>
          </Button>
        </div>
      </Card>

      {clientes.length > 0 ? (
        <Card className="shadow-lg border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Código</TableHead>
                  <TableHead className="font-semibold">Nombre</TableHead>
                  <TableHead className="font-semibold">Teléfono</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Fecha de alta</TableHead>
                  <TableHead className="text-right font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {cliente.codigo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">{cliente.nombreCompleto}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {cliente.telefono}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{cliente.email || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(cliente.fechaAlta)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEdit(cliente.id)}
                        className="hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        Ver/Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      ) : (
        <Card className="p-16 shadow-lg border-border/50">
          <div className="flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                {searchQuery ? "No se encontraron clientes" : "No hay clientes registrados"}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {searchQuery ? "Intenta con otro término de búsqueda" : "Comienza agregando tu primer cliente"}
              </p>
            </div>
            {!searchQuery && (
              <Button asChild size="lg" className="mt-2 shadow-md hover:shadow-lg transition-shadow">
                <Link href="/clientes/crear-cliente">
                  <Plus className="w-4 h-4 mr-2" />
                  Crear primer cliente
                </Link>
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}

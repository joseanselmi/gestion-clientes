import { DashboardLayout } from "@/components/dashboard-layout"
import { ClientesListado } from "@/components/clientes-listado"

export default function ClientesPage() {
  return (
    <DashboardLayout>
      <ClientesListado />
    </DashboardLayout>
  )
}

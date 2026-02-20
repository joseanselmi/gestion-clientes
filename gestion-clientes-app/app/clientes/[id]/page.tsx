import { ClienteDetalle } from "@/components/cliente-detalle"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClienteDetallePage({ params }: PageProps) {
  const { id } = await params
  return <ClienteDetalle clienteId={id} />
}

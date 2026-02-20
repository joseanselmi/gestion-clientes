export interface Cliente {
  id: string
  codigo: string // Added unique client code
  nombreCompleto: string
  telefono: string
  email?: string
  fechaNacimiento?: string
  observaciones?: string
  fechaAlta: string
}

function generateClientCode(): string {
  const prefix = "CLI"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}-${timestamp}-${random}`
}

// Mock data storage
const clientes: Cliente[] = [
  {
    id: "1",
    codigo: "CLI-001234-567", // Added client codes to existing clients
    nombreCompleto: "María García López",
    telefono: "+34 612 345 678",
    email: "maria.garcia@example.com",
    fechaNacimiento: "1990-05-15",
    observaciones: "Cliente regular, prefiere citas por la tarde",
    fechaAlta: "2024-01-15",
  },
  {
    id: "2",
    codigo: "CLI-001235-789",
    nombreCompleto: "Carlos Rodríguez Pérez",
    telefono: "+34 623 456 789",
    email: "carlos.rodriguez@example.com",
    fechaNacimiento: "1985-08-22",
    observaciones: "Alérgico a productos con parabenos",
    fechaAlta: "2024-02-20",
  },
  {
    id: "3",
    codigo: "CLI-001236-123",
    nombreCompleto: "Ana Martínez Sánchez",
    telefono: "+34 634 567 890",
    email: "ana.martinez@example.com",
    fechaNacimiento: "1992-11-30",
    fechaAlta: "2024-03-10",
  },
]

export function getClientes(): Cliente[] {
  return clientes
}

export function getClienteById(id: string): Cliente | undefined {
  return clientes.find((c) => c.id === id)
}

export function createCliente(cliente: Omit<Cliente, "id" | "fechaAlta" | "codigo">): Cliente {
  const newCliente: Cliente = {
    ...cliente,
    id: Date.now().toString(),
    codigo: generateClientCode(), // Auto-generate unique code for new clients
    fechaAlta: new Date().toISOString().split("T")[0],
  }
  clientes.push(newCliente)
  return newCliente
}

export function updateCliente(id: string, updates: Partial<Cliente>): Cliente | null {
  const index = clientes.findIndex((c) => c.id === id)
  if (index === -1) return null

  clientes[index] = { ...clientes[index], ...updates }
  return clientes[index]
}

export function searchClientes(query: string): Cliente[] {
  const lowerQuery = query.toLowerCase()
  return clientes.filter(
    (c) =>
      c.nombreCompleto.toLowerCase().includes(lowerQuery) ||
      c.telefono.includes(query) ||
      c.email?.toLowerCase().includes(lowerQuery),
  )
}

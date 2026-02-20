const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

export interface Cliente {
  id: string
  codigo: string
  nombreCompleto: string
  telefono: string
  email?: string | null
  fechaNacimiento?: string | null
  observaciones?: string | null
  fechaAlta: string
}

export interface ClientesResponse {
  data: Cliente[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CreateClienteData {
  nombreCompleto: string
  telefono: string
  email?: string
  fechaNacimiento?: string
  observaciones?: string
}

export type UpdateClienteData = Partial<CreateClienteData>

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const msg = Array.isArray(err.message) ? err.message.join(", ") : err.message || `Error ${res.status}`
    throw new Error(msg)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const clientesApi = {
  getAll: (search?: string): Promise<ClientesResponse> => {
    const params = new URLSearchParams({ limit: "100" })
    if (search) params.set("search", search)
    return fetch(`${API_URL}/clientes?${params}`).then((res) => handleResponse<ClientesResponse>(res))
  },

  getById: (id: string): Promise<Cliente> =>
    fetch(`${API_URL}/clientes/${id}`).then((res) => handleResponse<Cliente>(res)),

  create: (data: CreateClienteData): Promise<Cliente> =>
    fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<Cliente>(res)),

  update: (id: string, data: UpdateClienteData): Promise<Cliente> =>
    fetch(`${API_URL}/clientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((res) => handleResponse<Cliente>(res)),

  delete: (id: string): Promise<void> =>
    fetch(`${API_URL}/clientes/${id}`, { method: "DELETE" }).then((res) => handleResponse<void>(res)),
}

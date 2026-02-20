# Cambios necesarios en el Frontend

Este documento describe exactamente qué cambiar en `gestion-clientes-app` para conectarlo al backend real.

---

## 1. Variable de entorno

Crear el archivo `/mnt/c/dev/gestion-clientes-app/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 2. Crear cliente API en lib/api.ts

Crear el archivo `/mnt/c/dev/gestion-clientes-app/lib/api.ts`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Cliente {
  id: string;
  codigo: string;
  nombreCompleto: string;
  telefono: string;
  email?: string | null;
  fechaNacimiento?: string | null;
  observaciones?: string | null;
  fechaAlta: string;
}

export interface ClientesResponse {
  data: Cliente[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateClienteData {
  nombreCompleto: string;
  telefono: string;
  email?: string;
  fechaNacimiento?: string;
  observaciones?: string;
}

export type UpdateClienteData = Partial<CreateClienteData>;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const clientesApi = {
  getAll: (search?: string): Promise<ClientesResponse> => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('limit', '100');
    return fetch(`${API_URL}/clientes?${params}`)
      .then(res => handleResponse<ClientesResponse>(res));
  },

  getById: (id: string): Promise<Cliente> =>
    fetch(`${API_URL}/clientes/${id}`)
      .then(res => handleResponse<Cliente>(res)),

  create: (data: CreateClienteData): Promise<Cliente> =>
    fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => handleResponse<Cliente>(res)),

  update: (id: string, data: UpdateClienteData): Promise<Cliente> =>
    fetch(`${API_URL}/clientes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => handleResponse<Cliente>(res)),

  delete: (id: string): Promise<void> =>
    fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' })
      .then(res => handleResponse<void>(res)),
};
```

---

## 3. Modificar lib/mock-data.ts

Reemplazar el contenido por re-exports que usen la API real.
**O bien**, mantener mock-data.ts sin tocar y reemplazar las llamadas directamente en los componentes (ver sección 4).

---

## 4. Modificar componentes

### 4.1 components/clientes-listado.tsx

Reemplazar las llamadas a `getClientes()` / `searchClientes()` por llamadas a la API:

```typescript
// Cambiar:
import { getClientes, searchClientes } from '@/lib/mock-data';

// Por:
import { clientesApi } from '@/lib/api';

// En useEffect:
useEffect(() => {
  clientesApi.getAll(searchQuery || undefined)
    .then(res => setClientes(res.data))
    .catch(err => toast({ title: 'Error', description: err.message, variant: 'destructive' }));
}, [searchQuery]);
```

### 4.2 components/cliente-form.tsx

Reemplazar `createCliente()` / `updateCliente()` por llamadas a la API:

```typescript
// Cambiar:
import { createCliente, updateCliente, getClienteById } from '@/lib/mock-data';

// Por:
import { clientesApi } from '@/lib/api';

// En handleSubmit:
if (isEditing) {
  await clientesApi.update(clienteId!, {
    nombreCompleto: formData.nombreCompleto,
    telefono: formData.telefono,
    email: formData.email || undefined,
    fechaNacimiento: formData.fechaNacimiento || undefined,
    observaciones: formData.observaciones || undefined,
  });
} else {
  await clientesApi.create({
    nombreCompleto: formData.nombreCompleto,
    telefono: formData.telefono,
    email: formData.email || undefined,
    fechaNacimiento: formData.fechaNacimiento || undefined,
    observaciones: formData.observaciones || undefined,
  });
}
```

### 4.3 components/cliente-detalle.tsx

Reemplazar `getClienteById()` / `updateCliente()` por llamadas a la API:

```typescript
// Cambiar:
import { getClienteById, updateCliente } from '@/lib/mock-data';

// Por:
import { clientesApi } from '@/lib/api';

// En useEffect:
useEffect(() => {
  clientesApi.getById(clienteId)
    .then(setCliente)
    .catch(() => toast({ title: 'Error', description: 'Cliente no encontrado', variant: 'destructive' }));
}, [clienteId]);

// En handleSave:
const updated = await clientesApi.update(clienteId, {
  nombreCompleto: formData.nombreCompleto,
  telefono: formData.telefono,
  email: formData.email || undefined,
  fechaNacimiento: formData.fechaNacimiento || undefined,
  observaciones: formData.observaciones || undefined,
});
setCliente(updated);
```

---

## 5. Ajuste de fechas

El backend devuelve `fechaAlta` como ISO string completo: `"2024-01-15T10:30:00.000Z"`

En los componentes donde se muestre `fechaAlta`, asegurarse de parsear correctamente:

```typescript
// Si usas date-fns:
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

format(new Date(cliente.fechaAlta), 'dd/MM/yyyy', { locale: es })

// Si usas Intl:
new Date(cliente.fechaAlta).toLocaleDateString('es-ES')
```

---

## 6. Tipo Cliente actualizado

El tipo de `id` cambia de string de timestamp a CUID. No requiere cambios funcionales en el frontend — los componentes ya manejan `id` como `string` opaco.

---

## Resumen de archivos a cambiar

| Archivo | Cambio |
|---------|--------|
| `.env.local` | Crear con `NEXT_PUBLIC_API_URL=http://localhost:4000` |
| `lib/api.ts` | Crear nuevo archivo con cliente API |
| `components/clientes-listado.tsx` | Reemplazar mock-data por clientesApi |
| `components/cliente-form.tsx` | Reemplazar mock-data por clientesApi |
| `components/cliente-detalle.tsx` | Reemplazar mock-data por clientesApi |

# API Contract - Gestión de Clientes

**Base URL:** `http://localhost:4000`
**Swagger UI:** `http://localhost:4000/api/docs`

---

## Entidad: Cliente

```typescript
{
  id: string;              // CUID - generado por servidor
  codigo: string;          // "CLI-XXXXXX-XXX" - generado por servidor
  nombreCompleto: string;  // Requerido
  telefono: string;        // Requerido
  email: string | null;    // Opcional
  fechaNacimiento: string | null;  // ISO 8601: "1990-03-15T00:00:00.000Z"
  observaciones: string | null;    // Opcional
  fechaAlta: string;       // ISO 8601 - generado por servidor
}
```

---

## Endpoints

### POST /clientes
Crear un nuevo cliente.

**Request Body:**
```json
{
  "nombreCompleto": "María García López",
  "telefono": "+34 612 345 678",
  "email": "maria@example.com",
  "fechaNacimiento": "1990-03-15",
  "observaciones": "Cliente habitual."
}
```

**Campos requeridos:** `nombreCompleto`, `telefono`
**Campos opcionales:** `email`, `fechaNacimiento`, `observaciones`

**Response 201:**
```json
{
  "id": "clg7x2k0000008ml1234abcd",
  "codigo": "CLI-123456-789",
  "nombreCompleto": "María García López",
  "telefono": "+34 612 345 678",
  "email": "maria@example.com",
  "fechaNacimiento": "1990-03-15T00:00:00.000Z",
  "observaciones": "Cliente habitual.",
  "fechaAlta": "2024-01-15T10:30:00.000Z"
}
```

**Response 400 - Validación:**
```json
{
  "statusCode": 400,
  "error": "BadRequest",
  "message": ["El nombre completo es obligatorio", "El teléfono es obligatorio"],
  "path": "/clientes",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response 409 - Email duplicado:**
```json
{
  "statusCode": 409,
  "error": "Conflict",
  "message": "Ya existe un cliente con el email: maria@example.com",
  "path": "/clientes",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### GET /clientes
Listar todos los clientes con búsqueda y paginación.

**Query Parameters:**
| Parámetro | Tipo   | Requerido | Default | Descripción                           |
|-----------|--------|-----------|---------|---------------------------------------|
| search    | string | No        | -       | Búsqueda por nombre, teléfono o email |
| page      | number | No        | 1       | Página actual (empieza en 1)          |
| limit     | number | No        | 20      | Resultados por página (max: 100)      |

**Ejemplos:**
- `GET /clientes`
- `GET /clientes?search=María`
- `GET /clientes?search=612&page=1&limit=10`

**Response 200:**
```json
{
  "data": [
    {
      "id": "clg7x2k0000008ml1234abcd",
      "codigo": "CLI-001234-567",
      "nombreCompleto": "María García López",
      "telefono": "+34 612 345 678",
      "email": "maria@example.com",
      "fechaNacimiento": "1990-03-15T00:00:00.000Z",
      "observaciones": "Cliente habitual.",
      "fechaAlta": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### GET /clientes/:id
Obtener un cliente por su ID.

**Response 200:** (mismo formato que cliente individual arriba)

**Response 404:**
```json
{
  "statusCode": 404,
  "error": "NotFound",
  "message": "Cliente con id \"clg7x2k0000008ml1234abcd\" no encontrado",
  "path": "/clientes/clg7x2k0000008ml1234abcd",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### PATCH /clientes/:id
Actualizar campos de un cliente (todos opcionales).

**Request Body (todos opcionales):**
```json
{
  "nombreCompleto": "María García López Actualizado",
  "telefono": "+34 699 000 111",
  "email": "nuevo@example.com",
  "fechaNacimiento": "1990-03-15",
  "observaciones": "Notas actualizadas"
}
```

**Nota:** `id`, `codigo` y `fechaAlta` NO son actualizables.

**Response 200:** Cliente actualizado completo.

---

### DELETE /clientes/:id
Eliminar un cliente.

**Response 204:** Sin contenido.

**Response 404:** Cliente no encontrado.

---

## Formato de fechas

- Las fechas se envían como string ISO 8601: `"1990-03-15"` o `"1990-03-15T00:00:00.000Z"`
- El servidor devuelve siempre fechas como ISO 8601 con timezone: `"1990-03-15T00:00:00.000Z"`
- `fechaAlta` es generada automáticamente por el servidor

## CORS

Configurado para aceptar requests desde `http://localhost:3000`.

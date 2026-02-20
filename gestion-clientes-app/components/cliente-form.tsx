"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, UserPlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { clientesApi } from "@/lib/api"

interface ClienteFormProps {
  clienteId?: string
}

export function ClienteForm({ clienteId }: ClienteFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = Boolean(clienteId)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [formData, setFormData] = React.useState({
    nombreCompleto: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    observaciones: "",
  })

  const [errors, setErrors] = React.useState({
    nombreCompleto: false,
    telefono: false,
  })

  React.useEffect(() => {
    if (clienteId) {
      clientesApi.getById(clienteId).then((cliente) => {
        setFormData({
          nombreCompleto: cliente.nombreCompleto,
          telefono: cliente.telefono,
          email: cliente.email || "",
          fechaNacimiento: cliente.fechaNacimiento
            ? new Date(cliente.fechaNacimiento).toISOString().split("T")[0]
            : "",
          observaciones: cliente.observaciones || "",
        })
      })
    }
  }, [clienteId])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: false }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      nombreCompleto: !formData.nombreCompleto.trim(),
      telefono: !formData.telefono.trim(),
    }
    setErrors(newErrors)
    return !newErrors.nombreCompleto && !newErrors.telefono
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        nombreCompleto: formData.nombreCompleto,
        telefono: formData.telefono,
        email: formData.email || undefined,
        fechaNacimiento: formData.fechaNacimiento || undefined,
        observaciones: formData.observaciones || undefined,
      }

      if (isEditing && clienteId) {
        await clientesApi.update(clienteId, payload)
        toast({
          title: "Cliente actualizado",
          description: "Los datos del cliente se han actualizado correctamente",
        })
      } else {
        await clientesApi.create(payload)
        toast({
          title: "Cliente creado",
          description: "El nuevo cliente se ha registrado con un código único",
        })
      }

      setTimeout(() => {
        router.push("/clientes/listado")
      }, 1000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Hubo un problema al guardar el cliente",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/clientes/listado")}
            className="mt-1 hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground text-balance tracking-tight">
              {isEditing ? "Editar cliente" : "Crear nuevo cliente"}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {isEditing
                ? "Actualiza la información del cliente"
                : "Completa el formulario para registrar un nuevo cliente"}
            </p>
          </div>
        </div>

        <Card className="p-8 shadow-lg border-border/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nombre completo */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nombreCompleto" className="text-sm font-semibold">
                  Nombre completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nombreCompleto"
                  placeholder="Ej: María García López"
                  value={formData.nombreCompleto}
                  onChange={(e) => handleChange("nombreCompleto", e.target.value)}
                  className={errors.nombreCompleto ? "border-destructive shadow-sm" : "shadow-sm"}
                />
                {errors.nombreCompleto && (
                  <p className="text-sm text-destructive font-medium">Este campo es requerido</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-sm font-semibold">
                  Teléfono <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="Ej: +34 612 345 678"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  className={errors.telefono ? "border-destructive shadow-sm" : "shadow-sm"}
                />
                {errors.telefono && <p className="text-sm text-destructive font-medium">Este campo es requerido</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="cliente@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="shadow-sm"
                />
              </div>

              {/* Fecha de nacimiento */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fechaNacimiento" className="text-sm font-semibold">
                  Fecha de nacimiento
                </Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                  className="shadow-sm"
                />
              </div>
            </div>

            {/* Observaciones */}
            <div className="space-y-2">
              <Label htmlFor="observaciones" className="text-sm font-semibold">
                Observaciones
              </Label>
              <Textarea
                id="observaciones"
                placeholder="Notas adicionales sobre el cliente..."
                rows={4}
                value={formData.observaciones}
                onChange={(e) => handleChange("observaciones", e.target.value)}
                className="shadow-sm resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-border">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none shadow-md hover:shadow-lg transition-shadow"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar cambios
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Guardar cliente
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/clientes/listado")}
                disabled={isSubmitting}
                className="shadow-sm"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
      <Toaster />
    </>
  )
}

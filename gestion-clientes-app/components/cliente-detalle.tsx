"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Pencil, Save, X, User, Phone, Mail, Calendar, FileText, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { clientesApi } from "@/lib/api"

interface ClienteDetalleProps {
  clienteId: string
}

export function ClienteDetalle({ clienteId }: ClienteDetalleProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const savedData = React.useRef<typeof formData | null>(null)

  const [formData, setFormData] = React.useState({
    codigo: "",
    nombreCompleto: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    observaciones: "",
    fechaAlta: "",
  })

  const [errors, setErrors] = React.useState({
    nombreCompleto: false,
    telefono: false,
  })

  React.useEffect(() => {
    clientesApi
      .getById(clienteId)
      .then((cliente) => {
        const data = {
          codigo: cliente.codigo,
          nombreCompleto: cliente.nombreCompleto,
          telefono: cliente.telefono,
          email: cliente.email || "",
          fechaNacimiento: cliente.fechaNacimiento
            ? new Date(cliente.fechaNacimiento).toISOString().split("T")[0]
            : "",
          observaciones: cliente.observaciones || "",
          fechaAlta: cliente.fechaAlta,
        }
        setFormData(data)
        savedData.current = data
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Cliente no encontrado",
          variant: "destructive",
        })
        router.push("/clientes/listado")
      })
  }, [clienteId, router, toast])

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

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (savedData.current) {
      setFormData(savedData.current)
    }
    setErrors({ nombreCompleto: false, telefono: false })
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
      const updated = await clientesApi.update(clienteId, {
        nombreCompleto: formData.nombreCompleto,
        telefono: formData.telefono,
        email: formData.email || undefined,
        fechaNacimiento: formData.fechaNacimiento || undefined,
        observaciones: formData.observaciones || undefined,
      })

      const newData = {
        codigo: updated.codigo,
        nombreCompleto: updated.nombreCompleto,
        telefono: updated.telefono,
        email: updated.email || "",
        fechaNacimiento: updated.fechaNacimiento
          ? new Date(updated.fechaNacimiento).toISOString().split("T")[0]
          : "",
        observaciones: updated.observaciones || "",
        fechaAlta: updated.fechaAlta,
      }
      setFormData(newData)
      savedData.current = newData

      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente se han actualizado correctamente",
      })

      setIsEditing(false)
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <>
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/clientes/listado")}
              className="mt-1 hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-foreground text-balance tracking-tight">
                    Detalle del cliente
                  </h1>
                  <p className="text-muted-foreground mt-2 text-lg">
                    {isEditing ? "Edita la información del cliente" : "Visualiza la información del cliente"}
                  </p>
                </div>
                {!isEditing && (
                  <Button onClick={handleEdit} className="shadow-md hover:shadow-lg transition-shadow">
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Card className="p-8 shadow-lg border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Código de cliente y fecha de alta */}
              <div className="flex flex-wrap gap-4 items-center pb-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">Código:</span>
                  <Badge variant="secondary" className="font-mono">
                    {formData.codigo}
                  </Badge>
                </div>
                <Separator orientation="vertical" className="h-6 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">Fecha de alta:</span>
                  <span className="text-sm font-semibold">{formatDate(formData.fechaAlta)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre completo */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nombreCompleto" className="text-sm font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nombreCompleto"
                    placeholder="Ej: María García López"
                    value={formData.nombreCompleto}
                    onChange={(e) => handleChange("nombreCompleto", e.target.value)}
                    disabled={!isEditing}
                    className={`${errors.nombreCompleto ? "border-destructive" : ""} ${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""} shadow-sm`}
                  />
                  {errors.nombreCompleto && (
                    <p className="text-sm text-destructive font-medium">Este campo es requerido</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="Ej: +34 612 345 678"
                    value={formData.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    disabled={!isEditing}
                    className={`${errors.telefono ? "border-destructive" : ""} ${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""} shadow-sm`}
                  />
                  {errors.telefono && <p className="text-sm text-destructive font-medium">Este campo es requerido</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="cliente@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    disabled={!isEditing}
                    className={`${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""} shadow-sm`}
                  />
                </div>

                {/* Fecha de nacimiento */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="fechaNacimiento" className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Fecha de nacimiento
                  </Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                    disabled={!isEditing}
                    className={`${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""} shadow-sm`}
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-2">
                <Label htmlFor="observaciones" className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Observaciones
                </Label>
                <Textarea
                  id="observaciones"
                  placeholder="Notas adicionales sobre el cliente..."
                  rows={4}
                  value={formData.observaciones}
                  onChange={(e) => handleChange("observaciones", e.target.value)}
                  disabled={!isEditing}
                  className={`${!isEditing ? "bg-muted/50 cursor-not-allowed" : ""} shadow-sm resize-none`}
                />
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 pt-6 border-t border-border">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 sm:flex-none shadow-md hover:shadow-lg transition-shadow"
                  >
                    {isSubmitting ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar cambios
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="shadow-sm bg-transparent"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              )}
            </form>
          </Card>
        </div>
      </div>
      <Toaster />
    </>
  )
}

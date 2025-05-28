'use client'

import { useState } from "react"
import { IUser, Role } from "@/types/auth"
import { Select, SelectItem, Switch } from "@heroui/react"
import { Button } from "@heroui/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { updateUser } from "@/actions/admin/actions"

interface EditUserContentProps {
    user: IUser
    onOpenChange: () => void
}

export default function EditUserContent({ user, onOpenChange }: EditUserContentProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<{ role: Role, status: boolean }>({
        role: user.role!,
        status: user.status!,
    })

    const [initialData] = useState({
        role: user.role,
        status: user.status,
    })

    // Verifica si hay cambios
    const hasChanges = () => {
        return (
            formData.role !== initialData.role ||
            formData.status !== initialData.status
        )
    }

    const handleSubmit = async () => {
        if (!hasChanges()) {
            toast.warning("No se realizaron cambios")
            return
        }

        setIsLoading(true)

        const result = await updateUser(user.id!, formData)

        setIsLoading(false)

        if (result.error) {
            toast.error("No se pudo actualizar la informacion")
            return
        }

        toast.success("Se ha actualizado correctamente")
        onOpenChange()
        router.refresh()
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <Select
                    label="Rol"
                    selectedKeys={[formData.role]}
                    onSelectionChange={(key) =>
                        setFormData((prev) => ({
                            ...prev,
                            role: key.currentKey as Role,
                        }))
                    }
                >
                    <SelectItem key={Role.USER}>Usuario</SelectItem>
                    <SelectItem key={Role.ADMIN}>Administrador</SelectItem>
                    <SelectItem key={Role.EVALUATOR}>Evaluador</SelectItem>
                </Select>

                <div className="flex items-center gap-4">
                    <Switch
                        isSelected={formData.status}
                        onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, status: value }))
                        }
                    >
                        {formData.status ? "Activo" : "Inactivo"}
                    </Switch>
                </div>
            </div>

            <div className="flex justify-end">
                <Button color="primary" onPress={handleSubmit} isLoading={isLoading} >
                    Guardar Cambios
                </Button>
            </div>
        </div>
    )
}

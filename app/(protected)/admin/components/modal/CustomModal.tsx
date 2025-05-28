'use client'


import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, useDisclosure } from "@heroui/react";
import { useState } from "react";
import { toast } from "sonner";
import PasswordModal from "./PasswordModal";
import { IAuthRegister, IUser, Role } from "@/types/auth";
import { KeyOpenModal } from "@/utils/tables/keyOpenModal";
import EditUserContent from "./actions/EditUserContent";
import { validateCedula, validateEmail, validateText } from "@/utils/forms/validateForm";
import { createUser } from "@/actions/admin/actions";

import DeleteUser from "./actions/DeleteUser";
import DeleteModalConfirm from "./DeleteModalConfirm";
import { useRouter } from "next/navigation";

interface CustomModalProps {
    isOpen: boolean
    onOpenChange: () => void
    modalContent: { key: KeyOpenModal, user: IUser }
}

export default function CustomModal({ isOpen, onOpenChange, modalContent }: CustomModalProps) {
    const router = useRouter()

    const [formData, setFormData] = useState<IAuthRegister>({
        national_id: '',
        first_name: '',
        last_name: '',
        email: '',
        role: Role.USER
    });

    const [isLoading, setIsLoading] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState<string>('');

    const { isOpen: isPasswordModalOpen, onOpen: onPasswordModalOpen, onOpenChange: onPasswordModalOpenChange } = useDisclosure();
    const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalChange } = useDisclosure();

    const handleOnReload = () => {
        router.refresh()
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleRoleChange = (role: Role) => {
        setFormData(prev => ({
            ...prev,
            role
        }));
    }

    const handleOnCreateUser = async () => {
        setIsLoading(true);

        // Verificar si algún campo es undefined
        if (!formData.national_id || !formData.first_name || !formData.last_name || !formData.email) {
            toast.error('Todos los campos son obligatorios');
            setIsLoading(false);
            return;
        }

        const newErrors: { national_id?: string; first_name?: string; last_name?: string; email?: string } = {};

        if (!validateCedula(formData.national_id)) newErrors.national_id = 'Cédula inválida';
        if (!validateText(formData.first_name)) newErrors.first_name = 'Nombre inválido';
        if (!validateText(formData.last_name)) newErrors.last_name = 'Apellido inválido';
        if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';

        if (Object.keys(newErrors).length === 0) {
            console.log('Todo se puede enviar');

            const result = await createUser(formData);
            setIsLoading(false);

            if (result.error) return toast.error(result.error.message);

            if (!result.password) return toast.error("No se ha generado la contraseña correctamente")

            toast.success('Usuario creado correctamente');
            setGeneratedPassword(result.password);

            onOpenChange()
            onPasswordModalOpen()
            handleOnReload()
        }
    }

    const handleOnDeleteUser = () => {
        onDeleteModalOpen()

        onOpenChange()
    }

    const contentToRender = () => {
        if (!modalContent.key) return <>No hay contenido</>

        if (modalContent.key === "show") {
            return (
                <div className="flex flex-col gap-4">
                    <h1>Ver Usuario</h1>
                    <p>contenido del show</p>
                </div>
            )
        }

        if (modalContent.key === "edit") {
            return (
                <EditUserContent user={modalContent.user} onOpenChange={onOpenChange} />
            )
        }

        if (modalContent.key === "delete") {
            return (
                <DeleteUser user={modalContent.user} />
            )
        }

        if (modalContent.key === "create") {
            return (
                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">Crear Nuevo Usuario</h1>
                    <form className="flex flex-col gap-4">
                        <Input
                            label="Cédula"
                            placeholder="Ingrese la cédula"
                            name="national_id"
                            value={formData.national_id}
                            onChange={handleInputChange}
                            isRequired
                        />
                        <Input
                            label="Nombre"
                            placeholder="Ingrese el nombre"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            isRequired
                        />
                        <Input
                            label="Apellido"
                            placeholder="Ingrese el apellido"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            isRequired
                        />
                        <Input
                            label="Correo electrónico"
                            placeholder="Ingrese el correo electrónico"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            isRequired
                        />
                        <Select
                            aria-label="Seleccion de rol"
                            label="Rol"
                            placeholder="Seleccione un rol"
                            selectedKeys={[formData.role!]}
                            onSelectionChange={(key) => handleRoleChange(key.currentKey as Role)}
                            isRequired
                        >
                            <SelectItem key={Role.USER}>Usuario</SelectItem>
                            <SelectItem key={Role.ADMIN} >Administrador</SelectItem>
                            <SelectItem key={Role.EVALUATOR}>Evaluador</SelectItem>
                        </Select>
                    </form>
                </div>
            )
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                {modalContent.key === "create" ? "Crear Usuario" :
                                    modalContent.key === "edit" ? "Editar Usuario" :
                                        modalContent.key === "delete" ? "Eliminar Usuario" :
                                            modalContent.key === "show" ? "Ver Usuario" : ""}
                            </ModalHeader>
                            <ModalBody>
                                {contentToRender()}
                            </ModalBody>
                            <ModalFooter>
                                {modalContent.key === "create" && (
                                    <div className="flex gap-2">
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Cancelar
                                        </Button>
                                        <Button color="primary" onPress={handleOnCreateUser} isLoading={isLoading}>
                                            Crear Usuario
                                        </Button>
                                    </div>
                                )}

                                {modalContent.key === "delete" && (
                                    <div className="flex gap-2">
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Cancelar
                                        </Button>
                                        <Button color="primary" onPress={handleOnDeleteUser} isLoading={isLoading}>
                                            Eliminar usuario
                                        </Button>
                                    </div>
                                )}

                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <PasswordModal
                isOpen={isPasswordModalOpen}
                onOpenChange={onPasswordModalOpenChange}
                password={generatedPassword}
            />

            <DeleteModalConfirm
                isOpen={isDeleteModalOpen}
                onOpenChange={onDeleteModalChange}
                id_user={modalContent.user.id!}
                handleOnReload={handleOnReload}
            />
        </>
    )
}
'use client';

import { deleteUser } from "@/actions/admin/actions";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    id_user: string;
}

export default function DeleteModalConfirm({ isOpen, onOpenChange, id_user }: DeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        const response = await deleteUser(id_user);

        if (response.error) return toast.error(response.error.message);

        toast.success("Usuario eliminado con éxito");
        
        setIsDeleting(false);
        onOpenChange();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Confirmar Eliminación</ModalHeader>
                        <ModalBody>
                            <p>¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={handleDelete} isLoading={isDeleting}>
                                Eliminar
                            </Button>
                            <Button onPress={onClose}>
                                Cancelar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
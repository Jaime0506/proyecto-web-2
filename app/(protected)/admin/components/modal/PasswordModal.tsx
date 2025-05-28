'use client'

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import { Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PasswordModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    password: string;
}

export default function PasswordModal({ isOpen, onOpenChange, password }: PasswordModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        toast.success("Contraseña copiada al portapapeles");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>Contraseña Generada</ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-4">
                                <p className="text-sm text-gray-500">
                                    El usuario ha sido creado exitosamente. La contraseña generada es:
                                </p>
                                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                                    <code className="font-mono text-sm">{password}</code>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onPress={handleCopyPassword}
                                        color={copied ? "success" : "primary"}
                                    >
                                        <Copy size={16} />
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Por favor, guarde esta contraseña en un lugar seguro. El usuario deberá cambiarla en su primer inicio de sesión.
                                </p>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                Cerrar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
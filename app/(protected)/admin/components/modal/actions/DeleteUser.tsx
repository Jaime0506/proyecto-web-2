"use client"

import { IUser } from "@/types/auth";
import { Alert, Input } from "@heroui/react";

interface DeleteUserConfirmationProps {
    user: IUser;
}

export default function DeleteUser({ user }: DeleteUserConfirmationProps) {
    return (
        <div className="flex flex-col gap-4">
            <Alert className=" border-primary bg-primary/10 text-primary" variant="faded" title={"Usuario actual a eliminar"} />
            <form className="flex flex-col gap-4">
                <Input
                    label="Cédula"
                    placeholder="Ingrese la cédula"
                    name="national_id"
                    value={user.national_id}
                    isDisabled
                />
                <Input
                    label="Nombre"
                    placeholder="Ingrese el nombre"
                    name="first_name"
                    value={user.first_name}
                    isDisabled
                />
                <Input
                    label="Apellido"
                    placeholder="Ingrese el apellido"
                    name="last_name"
                    value={user.last_name}
                    isDisabled
                />
            </form>
        </div>
    );
}
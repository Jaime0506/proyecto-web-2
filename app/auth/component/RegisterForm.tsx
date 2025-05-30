'use client';

import { Button, Form, Input } from "@heroui/react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeClosed, Mail } from "lucide-react";
import { IErrorRegister } from "@/types/auth";
import { validateCedula, validateEmail, validatePassword, validateText } from "@/utils/forms/validateForm";
import { extractDataFormRegister } from "@/utils/forms/extractDataFormRegister";
import { registerUser } from "@/actions/auth/register";
import { toast } from "sonner";

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [errors, setErrors] = useState<IErrorRegister>({});

    const formRef = useRef<HTMLFormElement>(null);

    const toggleIsVisible = () => setIsVisible(prev => !prev);
    const toggleIsConfirmVisible = () => setIsConfirmVisible(prev => !prev);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formRef.current) return;
        const formData = new FormData(formRef.current);

        
        const { firstName, lastName, cedula, email, password, confirmPassword } = extractDataFormRegister(formData);
        
        const newErrors: IErrorRegister = {};
        
        if (!validateText(firstName)) newErrors.first_name = 'Nombre inválido';
        if (!validateText(lastName)) newErrors.last_name = 'Apellido inválido';
        if (!validateCedula(cedula)) newErrors.national_id = 'Cédula inválida';
        if (!validateEmail(email)) newErrors.email = 'Email inválido';
        if (!validatePassword(password, confirmPassword)) newErrors.password = 'Contraseña inválida';
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            const result = await registerUser({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                national_id: cedula,
            });

            setIsLoading(false);
            formRef.current.reset();
            setErrors({});

            if (result.error) return toast.error(result.error.message)
        }
    };

    useEffect(() => {
        console.log(errors)
    }, [errors]);

    return (
        <Form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-7">
            <section className="flex flex-1 flex-col gap-4 w-full">
                <Input
                    isRequired
                    type="text"
                    name="firstName"
                    label="Nombres"
                    variant="bordered"
                    radius="none"
                    classNames={{ inputWrapper: ["group-data-[focus=true]:border-primary"] }}
                    errorMessage={errors?.first_name}
                    isInvalid={!!errors?.first_name}
                />
                <Input
                    isRequired
                    type="text"
                    name="lastName"
                    label="Apellidos"
                    variant="bordered"
                    radius="none"
                    classNames={{ inputWrapper: ["group-data-[focus=true]:border-primary"] }}
                    errorMessage={errors?.last_name}
                    isInvalid={!!errors?.last_name}
                />
                <Input
                    isRequired
                    type="number"
                    name="cedula"
                    label="Cédula"
                    variant="bordered"
                    radius="none"
                    classNames={{ inputWrapper: ["group-data-[focus=true]:border-primary"] }}
                    errorMessage={errors?.national_id}
                    isInvalid={!!errors?.national_id}
                />
                <Input
                    isRequired
                    type="email"
                    name="email"
                    label="Correo Electrónico"
                    variant="bordered"
                    radius="none"
                    classNames={{ inputWrapper: ["group-data-[focus=true]:border-primary"] }}
                    endContent={<Mail />}
                    errorMessage={errors?.email}
                    isInvalid={!!errors?.email}
                />
                <Input
                    isRequired
                    type={isVisible ? "text" : "password"}
                    name="password"
                    label="Contraseña"
                    variant="bordered"
                    radius="none"
                    classNames={{ inputWrapper: ["group-data-[focus=true]:border-primary"] }}
                    endContent={
                        <button type="button" onClick={toggleIsVisible} className="flex justify-center items-center hover:cursor-pointer">
                            {isVisible ? <Eye /> : <EyeClosed />}
                        </button>
                    }
                    errorMessage={errors?.password}
                    isInvalid={!!errors?.password}
                />
                <Input
                    isRequired
                    type={isConfirmVisible ? "text" : "password"}
                    name="confirmPassword"
                    label="Confirmar Contraseña"
                    variant="bordered"
                    radius="none"
                    classNames={{ inputWrapper: ["group-data-[focus=true]:border-primary"] }}
                    endContent={
                        <button type="button" onClick={toggleIsConfirmVisible} className="flex justify-center items-center hover:cursor-pointer">
                            {isConfirmVisible ? <Eye /> : <EyeClosed />}
                        </button>
                    }
                    errorMessage={errors?.confirm_password}
                    isInvalid={!!errors?.confirm_password}
                />
            </section>

            <div className="text-default-500">
                <p className="inline">¿Ya tienes una cuenta? </p>
                <Link href="login" className="border-b-1 text-black border-b-primary font-bold">Inicia sesión</Link>
            </div>

            <section className="flex gap-5">
                <Button isLoading={isLoading} type="submit" color="primary" radius="none" className="shadow-md">
                    Registrarse
                </Button>
            </section>
        </Form>
    );
}

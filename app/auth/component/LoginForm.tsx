'use client'

import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import { Eye, EyeClosed, Mail } from "lucide-react";
import Link from "next/link";
import { IAuth } from "@/types/auth";
import { loginUser } from "@/actions/auth/login";
import { toast } from "sonner";

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [errors, setErrors] = useState<IAuth>({});

    const toggleIsVisible = () => setIsVisible(prevState => !prevState);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const validatePassword = (password: string) => {
        return password.length >= 6;
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const newErrors: { email?: string; password?: string } = {};

        if (!validateEmail(email)) newErrors.email = 'Email inválido';
        if (!validatePassword(password)) newErrors.password = 'Contraseña inválida';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const result = await loginUser({
                email,
                password,
            });

            setIsLoading(false);

            if (result.error) return toast.error(result.error.message)

            setErrors({});
        }
    }

    return (
        <>
            <Form onSubmit={onSubmit} className="flex flex-col gap-7">
                <section className="flex flex-1 flex-col gap-4 w-full">
                    <Input
                        isRequired
                        type="email"
                        name="email"
                        label="Correo electronico"
                        variant="bordered"
                        radius="none"
                        classNames={{
                            inputWrapper: [
                                "group-data-[focus=true]:border-primary",
                            ]
                        }}
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
                        classNames={{
                            inputWrapper: [
                                "group-data-[focus=true]:border-primary",
                            ]
                        }}
                        endContent={
                            <button type="button" onClick={toggleIsVisible} className="flex justify-center items-center">
                                {isVisible ? <Eye /> : <EyeClosed />}
                            </button>
                        }
                        errorMessage={errors?.password}
                        isInvalid={!!errors?.password}
                    />

                    <div className="text-default-500">
                        <p className="inline">¿Aun no tienes una cuenta? </p>
                        <Link href='register' className="border-b-1 text-black border-b-primary font-bold">Registrate</Link>
                    </div>
                </section>

                <section className="flex gap-5">
                    <Button
                        isLoading={isLoading}
                        type="submit"
                        color="primary"
                        radius="none"
                        className="shadow-md"
                    >
                        {"Iniciar sesion"}
                    </Button>
                </section>
            </Form>
        </>
    )
}
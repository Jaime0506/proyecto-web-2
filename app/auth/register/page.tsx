import Image from "next/image";
import RegisterForm from "../component/RegisterForm";

import Logo from '@/public/assets/register/register.svg'

export default function RegisterPage() {
    return (
        <main className='flex-1 flex'>
            {/* Form section */}
            <section className='flex-1 flex bg-white items-center justify-center'>
                <div className="flex w-[90%] h-auto flex-col justify-center">
                    <div className='text-4xl flex flex-col font-bold'>
                        <h2 className='mb-6'>Crea Tu Cuenta</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h2>Regístrate para comenzar a disfrutar de nuestros servicios</h2>

                        <RegisterForm />
                    </div>
                </div>
            </section>

            {/* Image section */}
            <div className='flex-1 bg-primary flex items-center justify-center'>
                <Image src={Logo} alt='logo' className='w-2/3' />
            </div>
        </main>
    );
}

import Logo from '@/public/assets/login/login.svg'
import Image from 'next/image'
import LoginForm from '../component/LoginForm'

export default async function LoginPage() {
    return (
        <main className='flex-1 flex'>
            {/* Form section */}
            <section className='flex-1 flex bg-white items-center justify-center'>
                <div className="flex w-[90%] h-[90%] flex-col">
                    <div className='text-4xl flex flex-col justify-end font-bold' style={{ flex: 1 / 2 }}>
                        <h1 className='mb-6'>&quot;Se parte de todos nuestros programas y se parte del cambio, se parte de la
                            <p className='text-primary inline'> Fundacion Amigos Como Arroz</p>
                            &quot;</h1>
                    </div>
                    <div className="flex-1 flex flex-col gap-5">
                        <h2>Inicia sesion para empezar a hacer uso de nuestros servicios</h2>

                        <LoginForm />
                    </div>
                </div>
            </section>

            {/* Image section */}
            <div className='flex-1 bg-primary flex items-center justify-center'>
                <Image src={Logo} alt='logo' className='w-2/3' />
            </div>
        </main>
    )
} 
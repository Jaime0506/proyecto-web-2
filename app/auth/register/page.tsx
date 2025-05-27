import RegisterForm from "../component/RegisterForm";

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
                <h2 className="text-white font-bold text-xl">Canvis</h2>
            </div>
        </main>
    );
}

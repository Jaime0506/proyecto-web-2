import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Si no hay sesión → redirige al login
    if (!session) {
        redirect('/auth/login')
    }

    return <>{children}</>
}

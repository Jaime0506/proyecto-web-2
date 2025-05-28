import { createClient } from "@/lib/supabase/server"
import UsersPageWrapper from "../components/UsersPageWrapper"

export default async function AdminUserPage() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('users').select('*')

    if (error) {
        return (
            <div>No se pudo obtener los usuarios</div>
        )
    }

    return (
        <main className="flex flex-col items-center pt-10 p-16">
            <UsersPageWrapper data={data} />
        </main>
    )
}
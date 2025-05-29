import { createClient } from "@/lib/supabase/server"
import ScholarCallsPageWrapper from "../components/ScholarCallsPageWrapper";

export default async function ScholarPage() {
    const supabase = await createClient()

    const { data: sholar_ships, error } = await supabase
        .from("scholarship_calls")
        .select(`*, users (id, national_id, first_name, last_name, role, created_at )
  `)

    if (error) {
        console.log(sholar_ships, error)

        return (
            <div className="flex-1 bg-gray-400 flex">
                No se ha encontrado ninguna convocatoria de becas.
            </div>
        )
    }

    return (
        <ScholarCallsPageWrapper data={sholar_ships} />
    )
}

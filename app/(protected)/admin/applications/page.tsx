import { getApplications } from "@/actions/admin/actions"

export default async function ApplicationsPage() {
    const { data: applications, error } = await getApplications()

    if (error) {
        return <div>No hay aplicaciones</div>;
    }

    return (
        <div>page</div>
    )
}

import Navbar from "@/app/components/Navbar"
import { LIST_HREFS_ADMIN } from "@/utils/navbar/navbarRoutes"
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col h-screen">
            <Navbar list_routes={LIST_HREFS_ADMIN} />

            {children}
        </main>
    )
}
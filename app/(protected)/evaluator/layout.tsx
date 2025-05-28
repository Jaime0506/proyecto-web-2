import Navbar from "@/app/components/Navbar"
import { LIST_HREFS_EVALUATOR } from "@/utils/navbar/navbarRoutes"
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <Navbar list_routes={LIST_HREFS_EVALUATOR} />

            {children}
        </main>
    )
}
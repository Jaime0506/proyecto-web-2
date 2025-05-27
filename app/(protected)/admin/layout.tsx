import LogoutButton from "@/app/components/LogoutButton"
import { LIST_HREFS_ADMIN } from "@/utils/navbar/navbarRole"
import Link from "next/link"


export default async function NavBar() {
    return (
        <header>
            <nav className='bg-primary p-3 flex justify-center'>
                <div className='container flex justify-between items-center px-4 py-4'>
                    <Link href="" className='text-white text-2xl font-bold pb-1.5'>Logo</Link>
                    <ul className='flex items-center'>
                        {
                            LIST_HREFS_ADMIN.map((data) => (
                                <li key={data.name}>
                                    <Link href={data.path} className='text-white px-4'>{data.name}</Link>
                                </li>

                            ))
                        }
                    </ul>
                    <LogoutButton />
                </div>
            </nav>
        </header>
    )
}
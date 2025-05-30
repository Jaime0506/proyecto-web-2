import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { IRouteObject } from "@/utils/navbar/navbarRoutes";
import Logo from "@/public/assets/navbar/logo_2.svg";
import Image from "next/image";

interface NavbarProps {
    list_routes: IRouteObject[]
}

export default function Navbar({ list_routes }: NavbarProps) {
    return (
        <>
            <header>
                <nav className='bg-primary p-3 flex justify-center'>
                    <div className='container flex justify-between items-center px-4 py-4'>
                        <div className='w-1/9'>
                            <Image src={Logo} alt='logo' className='w-2/3' />
                        </div>

                        <ul className='flex items-center'>
                            {
                                list_routes.map((data) => (
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
        </>
    )
}

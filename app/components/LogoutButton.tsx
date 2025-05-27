"use client"

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter()

    const handleOnPress = async () => {

        router.push("auth/login")
    }

    return (
        <button onClick={handleOnPress} className="bg-white flex w-8 h-8 items-center justify-center rounded-full hover:scale-110 hover:cursor-pointer transition-all">
            <LogOut className="text-primary" size={18} />
        </button>
    )
}
'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleOnPress = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error al cerrar sesión:', error.message)
      return
    }

    router.push('/auth/login')
  }

  return (
    <button
      onClick={handleOnPress}
      className="bg-white flex w-8 h-8 items-center justify-center rounded-full hover:scale-110 hover:cursor-pointer transition-all"
    >
      <LogOut className="text-primary" size={18} />
    </button>
  )
}

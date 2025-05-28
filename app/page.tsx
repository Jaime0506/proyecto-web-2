import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppRootRedirect() {
	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()

	if (!user) redirect('/auth/login')

	const { data: userProfile } = await supabase
		.from('users')
		.select('role')
		.eq('id', user.id)
		.single()


	switch (userProfile?.role) {
		case 'ADMIN':
			redirect('/admin')
		case 'EVALUATOR':
			redirect('/evaluator')
		default:
			redirect('/applicant')
	}
}

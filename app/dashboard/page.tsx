import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth-utils'

export const dynamic = 'force-dynamic'

export default async function DashboardLocatorPage() {
  const { profile: user } = await getAuthUser()

  // Admins land on the admin panel first
  if (user?.role === 'admin') {
    redirect('/admin')
  }

  // 3. Redirect matching their role
  if (user?.user_type === 'employer') {
    redirect('/dashboard/employer')
  } else if (user?.user_type === 'jobseeker' || user?.user_type === 'both') {
    redirect('/dashboard/seeker')
  } else {
    redirect('/')
  }
}

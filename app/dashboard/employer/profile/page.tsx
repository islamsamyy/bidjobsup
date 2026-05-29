import { getAuthUserAs } from '@/lib/auth-utils'
import { EmployerProfileClient } from './EmployerProfileClient'

export default async function EmployerProfilePage() {
  const { profile } = await getAuthUserAs('employer')

  if (!profile) {
    return <div>Loading...</div>
  }

  return <EmployerProfileClient profile={profile} />
}
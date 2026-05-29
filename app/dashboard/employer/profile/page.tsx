import { getAuthUserAs } from '@/lib/auth-utils'
import { EmployerProfileClient } from './EmployerProfileClient'

export default async function EmployerProfilePage() {
  const { profile } = await getAuthUserAs('employer')

  return <EmployerProfileClient profile={profile} />
}
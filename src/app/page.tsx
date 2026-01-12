import { createClient } from '@/utils/supabase/server'
import LoginForm from '@/components/auth/login-form'
import DashboardShell from '@/components/dashboard/dashboard-shell'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <LoginForm />
  }

  const { data: items } = await supabase.from('items').select('*').order('created_at', { ascending: false })

  return (
    <DashboardShell user={user} initialItems={items || []} />
  )
}

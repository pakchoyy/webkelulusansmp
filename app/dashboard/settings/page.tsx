import { createClient } from '@/lib/supabase/server'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('id', user!.id)
    .single()

  return <SettingsClient school={school} />
}

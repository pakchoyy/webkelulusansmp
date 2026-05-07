import { createClient } from '@/lib/supabase/server'
import StudentsPageClient from './StudentsPageClient'

export default async function StudentsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: students } = await supabase.from('students').select('*')
    .eq('school_id', user!.id).order('created_at', { ascending: false })
  return <StudentsPageClient initialStudents={students || []} schoolId={user!.id} />
}

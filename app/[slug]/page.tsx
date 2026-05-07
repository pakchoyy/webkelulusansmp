import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PublicPageClient from './PublicPageClient'

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!school) notFound()

  const { count } = await supabase
    .from('students')
    .select('id', { count: 'exact', head: true })
    .eq('school_id', school.id)

  return <PublicPageClient school={school} studentCount={count || 0} />
}

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { userId, namaSekolah, slug, email } = await req.json()

  if (!userId || !namaSekolah || !slug || !email) {
    return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Cek slug belum dipakai
  const { data: existing } = await supabase
    .from('schools')
    .select('id')
    .eq('slug', slug)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Slug sudah dipakai sekolah lain.' }, { status: 409 })
  }

  const { error } = await supabase.from('schools').insert({
    id: userId,
    nama_sekolah: namaSekolah,
    slug,
    email,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

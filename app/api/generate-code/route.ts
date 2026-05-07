import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Route ini hanya untuk kamu — lindungi dengan secret key
// Panggil via: POST /api/generate-code?secret=RAHASIA_KAMU
// Response: { code: "BGY-XXXX-YYYY" }

const SECRET = process.env.ADMIN_SECRET || 'ganti-ini-dengan-secret-kamu'

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const seg = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `BGY-${seg(4)}-${seg(4)}`
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const code = randomCode()

  const { error } = await supabase.from('activation_codes').insert({ code })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ code })
}

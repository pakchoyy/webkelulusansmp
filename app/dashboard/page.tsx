import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: school } = await supabase
    .from('schools')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { count: total }    = await supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', user!.id)
  const { count: lulus }    = await supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', user!.id).eq('status', 'LULUS')
  const { count: tdkLulus } = await supabase.from('students').select('id', { count: 'exact', head: true }).eq('school_id', user!.id).eq('status', 'TIDAK LULUS')

  const countdownDate = school?.countdown_at ? new Date(school.countdown_at).toLocaleString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : '-'

  return (
    <div className="space-y-4">
      <div className="neo-brutal rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
        <h1 className="text-2xl font-black mb-1">👋 Halo!</h1>
        <p className="text-blue-100 font-medium">{school?.nama_sekolah}</p>
        <p className="text-blue-200 text-sm mt-1">
          🔗 <a href={`/${school?.slug}`} target="_blank" className="underline font-bold">
            Lihat halaman publik
          </a>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Siswa', val: total || 0, color: 'bg-blue-50 border-blue-200' },
          { label: 'Lulus', val: lulus || 0, color: 'bg-green-50 border-green-200' },
          { label: 'Tdk Lulus', val: tdkLulus || 0, color: 'bg-red-50 border-red-200' },
        ].map(({ label, val, color }) => (
          <div key={label} className={`neo-brutal-sm rounded-xl p-4 text-center ${color}`}>
            <p className="text-3xl font-black text-gray-900">{val}</p>
            <p className="text-xs font-bold text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="neo-brutal rounded-2xl bg-yellow-50 p-4 border-2 border-yellow-300">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">⏰ Jadwal Pengumuman</p>
        <p className="font-black text-gray-900">{countdownDate}</p>
      </div>

      <div className="neo-brutal rounded-2xl bg-white p-4">
        <p className="font-bold text-gray-700 mb-3">⚡ Aksi Cepat</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { href: '/dashboard/students', label: '➕ Tambah Siswa', bg: 'bg-blue-600 text-white' },
            { href: '/dashboard/upload', label: '📥 Upload Excel', bg: 'bg-green-600 text-white' },
            { href: '/dashboard/settings', label: '⚙️ Pengaturan', bg: 'bg-gray-100 text-gray-900' },
            { href: `/${school?.slug}`, label: '🔗 Halaman Publik', bg: 'bg-yellow-300 text-gray-900', external: true },
          ].map(({ href, label, bg, external }) => (
            <a
              key={href}
              href={href}
              target={external ? '_blank' : undefined}
              className={`neo-brutal-sm rounded-xl px-4 py-3 font-bold text-sm text-center transition-opacity hover:opacity-80 ${bg}`}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

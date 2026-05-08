'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardNav({ namaSekolah, slug }: { namaSekolah: string; slug: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Beranda' },
    { href: '/dashboard/students', label: 'Data Siswa' },
  ]

  return (
    <header className="bg-white border-b-2 border-black sticky top-0 z-30">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          <span className="text-lg">🎓</span>
          <span className="font-black text-gray-900 text-sm truncate max-w-[140px]">{namaSekolah}</span>
        </div>
        <nav className="flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                pathname === l.href ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {l.label}
            </Link>
          ))}
          {slug && (
            <a href={`/${slug}`} target="_blank"
              className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 transition-colors border border-green-200">
              Web Pengumuman
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          )}
          <button onClick={logout}
            className="whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors">
            Keluar
          </button>
        </nav>
      </div>
    </header>
  )
}

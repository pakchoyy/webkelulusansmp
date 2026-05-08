'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import WaHelpFooter from '@/app/components/WaHelpFooter'

export default function RegisterPageClient() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [namaSekolah, setNamaSekolah] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setMsg('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nama_sekolah: namaSekolah } }
    })
    setLoading(false)
    if (error) { setMsg('❌ ' + error.message); return }
    setMsg('✅ Pendaftaran berhasil! Cek email Anda untuk verifikasi.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="neo-brutal rounded-2xl bg-white p-6">
          <div className="text-center mb-6">
            <span className="text-4xl">🎓</span>
            <h1 className="text-xl font-black text-gray-900 mt-2">Daftar Akun</h1>
            <p className="text-sm text-gray-500 mt-1">Buat akun untuk sekolah Anda</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Nama Sekolah</label>
              <input type="text" value={namaSekolah} onChange={e => setNamaSekolah(e.target.value)}
                placeholder="SDN 1 Nusantara" required
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="email@sekolah.sch.id" required
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 karakter" required minLength={8}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            {msg && <p className="text-sm font-bold">{msg}</p>}
            <button type="submit" disabled={loading}
              className="neo-brutal-sm w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60">
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            Sudah punya akun?{' '}
            <a href="/login" className="text-blue-600 font-bold hover:underline">Login di sini</a>
          </p>

          <WaHelpFooter />
        </div>
      </div>
    </div>
  )
}

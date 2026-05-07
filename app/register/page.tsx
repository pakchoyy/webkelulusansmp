'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [step, setStep] = useState<'code' | 'form'>('code')
  const [activationCode, setActivationCode] = useState(searchParams.get('code') || '')

  const [namaSekolah, setNamaSekolah] = useState('')
  const [slug, setSlug] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function checkCode() {
    setLoading(true)
    setError('')
    const { data } = await supabase
      .from('activation_codes')
      .select('id, used')
      .eq('code', activationCode.trim().toUpperCase())
      .single()

    setLoading(false)
    if (!data) return setError('Kode aktivasi tidak ditemukan.')
    if (data.used) return setError('Kode aktivasi sudah digunakan.')
    setStep('form')
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 40)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. Buat akun auth dulu
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    if (signUpError || !authData.user) {
      setError(signUpError?.message || 'Gagal membuat akun.')
      setLoading(false)
      return
    }

    const userId = authData.user.id

    // 2. Insert sekolah via API route (server-side, pakai service role)
    const res = await fetch('/api/register-school', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        namaSekolah: namaSekolah.trim(),
        slug: slug.trim(),
        email: email.trim(),
      }),
    })

    const result = await res.json()

    if (!res.ok) {
      setError(result.error || 'Gagal menyimpan data sekolah.')
      setLoading(false)
      return
    }

    // 3. Tandai kode aktivasi sebagai used
    await supabase
      .from('activation_codes')
      .update({ used: true, used_by: userId, used_at: new Date().toISOString() })
      .eq('code', activationCode.trim().toUpperCase())

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <div className="neo-brutal rounded-2xl bg-white p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full neo-brutal bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-xl font-black text-gray-900">Daftar Sekolah</h1>
          <p className="text-sm text-gray-500 mt-1">Masukkan kode aktivasi dari BGY</p>
        </div>

        {step === 'code' && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Kode Aktivasi</label>
              <input
                type="text"
                value={activationCode}
                onChange={e => setActivationCode(e.target.value.toUpperCase())}
                placeholder="BGY-XXXX-YYYY"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm text-center font-mono font-bold tracking-widest focus:outline-none focus:border-yellow-400"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              onClick={checkCode}
              disabled={loading || !activationCode}
              className="neo-brutal-sm w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-60"
            >
              {loading ? 'Memeriksa...' : 'Validasi Kode'}
            </button>
          </div>
        )}

        {step === 'form' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-3 text-center">
              <p className="text-green-700 font-bold text-sm">✅ Kode valid! Lengkapi data sekolah.</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={namaSekolah}
                onChange={e => {
                  setNamaSekolah(e.target.value)
                  setSlug(generateSlug(e.target.value))
                }}
                placeholder="SD Negeri 1 Nusantara"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Slug URL</label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="sdn1-nusantara"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-mono focus:outline-none focus:border-blue-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                umuminsd.vercel.app/<strong className="text-blue-600">{slug || 'slug-sekolah'}</strong>
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@sekolah.com"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 karakter"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="neo-brutal-sm w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}

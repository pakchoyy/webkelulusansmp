'use client'
import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { School, Student } from '@/types'

type Props = { school: School; studentCount: number }

export default function PublicPageClient({ school, studentCount }: Props) {
  const supabase = createClient()
  const [nisn, setNisn] = useState('')
  const [result, setResult] = useState<Student | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState({ days: '00', hours: '00', mins: '00', secs: '00', passed: false })

  // Countdown timer
  useEffect(() => {
    function tick() {
      const target = new Date(school.countdown_at).getTime()
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) {
        setCountdown(c => ({ ...c, passed: true }))
        return
      }
      const days  = Math.floor(diff / 86400000)
      const hours = Math.floor((diff % 86400000) / 3600000)
      const mins  = Math.floor((diff % 3600000) / 60000)
      const secs  = Math.floor((diff % 60000) / 1000)
      setCountdown({
        days:  String(days).padStart(2,'0'),
        hours: String(hours).padStart(2,'0'),
        mins:  String(mins).padStart(2,'0'),
        secs:  String(secs).padStart(2,'0'),
        passed: false
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [school.countdown_at])

  // Confetti
  const launchConfetti = useCallback(() => {
    const colors = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']
    for (let i = 0; i < 60; i++) {
      setTimeout(() => {
        const el = document.createElement('div')
        el.className = 'confetti-piece'
        el.style.left = Math.random() * 100 + 'vw'
        el.style.background = colors[Math.floor(Math.random() * colors.length)]
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
        el.style.animationDelay = Math.random() * 0.5 + 's'
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 3500)
      }, i * 30)
    }
  }, [])

  async function handleCheck(e: React.FormEvent) {
    e.preventDefault()
    if (!nisn.trim()) return
    setLoading(true)
    setNotFound(false)
    setResult(null)

    const { data } = await supabase
      .from('students')
      .select('*')
      .eq('school_id', school.id)
      .eq('nisn', nisn.trim())
      .single()

    setLoading(false)
    if (!data) {
      setNotFound(true)
    } else {
      setResult(data)
      setShowResult(true)
      if (data.status === 'LULUS') launchConfetti()
    }
  }

  function closeResult() {
    setShowResult(false)
    setResult(null)
  }

  const primary = school.theme_primary || '#2563eb'

  return (
    <div className="h-full w-full overflow-auto relative" style={{
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f3f4f6 100%)',
    }}>
      {/* Decorative glow */}
      <div className="glow-circle w-64 h-64 bg-blue-400 top-0 right-0" />
      <div className="glow-circle w-48 h-48 bg-yellow-300 bottom-20 left-0" />
      <div className="glow-circle w-32 h-32 bg-pink-300 top-1/2 right-1/4" />

      {/* HERO */}
      <section className="relative z-10 px-4 pt-12 pb-8 text-center max-w-lg mx-auto">
        <div className="mx-auto w-24 h-24 rounded-full neo-brutal flex items-center justify-center mb-4 float-anim overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
          {school.logo_url
            ? <img src={school.logo_url} alt="logo" className="w-full h-full object-cover" />
            : <span className="text-4xl">🎓</span>}
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">{school.nama_sekolah}</h1>
        <div className="inline-block px-3 py-1 rounded-full neo-brutal-sm bg-yellow-300 text-xs font-bold mb-4">
          🎓 {school.batch_label}
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight">
          {school.hero_title.split(' ').slice(0, Math.ceil(school.hero_title.split(' ').length / 2)).join(' ')}<br />
          {school.hero_title.split(' ').slice(Math.ceil(school.hero_title.split(' ').length / 2)).join(' ')}
        </h2>
        <p className="text-gray-500 font-medium mb-6">Tahun Ajaran {school.tahun_ajaran}</p>

        {/* Countdown */}
        <div className="neo-brutal rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-400 p-5 mb-6">
          {countdown.passed ? (
            <p className="text-center font-black text-gray-900 text-lg">🎉 Pengumuman Sudah Dibuka!</p>
          ) : (
            <>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">⏰ Pengumuman Dimulai</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: countdown.days, label: 'Hari' },
                  { val: countdown.hours, label: 'Jam' },
                  { val: countdown.mins, label: 'Menit' },
                  { val: countdown.secs, label: 'Detik' },
                ].map(({ val, label }) => (
                  <div key={label} className="bg-gray-900 text-white rounded-xl p-3">
                    <span className="text-2xl font-black">{val}</span>
                    <p className="text-[10px] mt-1 opacity-60">{label}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="text-center mb-4">
          <p className="text-lg font-bold text-gray-700 mb-3">📊 Total Siswa {school.batch_label}</p>
          <p className="text-9xl font-black" style={{ color: primary }}>{studentCount}</p>
          <p className="text-xl text-gray-600 font-bold">{school.nama_sekolah}</p>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="relative z-10 h-1 my-8 max-w-lg mx-auto rounded-full"
        style={{ background: `linear-gradient(90deg, ${primary}, ${primary}88, ${primary})` }} />

      {/* CEK NISN */}
      <section className="relative z-10 px-4 py-8 max-w-lg mx-auto">
        <div className="neo-brutal rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${primary}, ${primary}dd)` }}>
          <h3 className="text-lg font-bold mb-1 text-center text-white">🔍 Cek Hasil Kelulusan</h3>
          <p className="text-sm text-blue-100 text-center mb-5">Masukkan NISN untuk melihat hasil</p>
          <form onSubmit={handleCheck} className="space-y-3">
            <input
              type="text"
              value={nisn}
              onChange={e => setNisn(e.target.value)}
              placeholder="Masukkan NISN..."
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 font-medium text-center text-lg focus:outline-none focus:border-blue-200 bg-blue-50 text-gray-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="neo-brutal-sm rounded-xl bg-white text-blue-600 font-bold px-6 py-3 w-full hover:bg-blue-50 transition-colors disabled:opacity-60"
            >
              {loading ? 'Mencari...' : '🔍 Cek Sekarang'}
            </button>
          </form>

          {notFound && (
            <div className="mt-5 text-center p-4 rounded-xl bg-red-100 border-2 border-red-300">
              <p className="text-red-700 font-semibold">❌ NISN tidak ditemukan</p>
              <p className="text-red-600 text-sm mt-1">Periksa kembali NISN Anda</p>
            </div>
          )}
        </div>
      </section>

      <div className="h-16" />

      {/* RESULT POPUP */}
      {showResult && result && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="scale-in neo-brutal rounded-3xl bg-gradient-to-br from-blue-400 via-blue-300 to-blue-500 p-6 max-w-sm w-full text-center relative overflow-hidden">
            <button onClick={closeResult}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg">
              ✕
            </button>
            <div className={`absolute top-0 left-0 right-0 h-2 ${result.status === 'LULUS' ? 'bg-green-500' : 'bg-red-500'}`} />

            <div className="w-20 h-20 mx-auto rounded-full neo-brutal-sm bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mb-4 mt-3 text-3xl">
              🎓
            </div>

            <h3 className="text-xl font-black text-white mb-1">{result.nama}</h3>
            <p className="text-sm text-blue-100 font-medium mb-3">Kelas {result.kelas}</p>

            <div className={`inline-block px-4 py-2 rounded-full neo-brutal-sm font-bold text-lg mb-4 ${
              result.status === 'LULUS' ? 'bg-green-400' : 'bg-red-400 text-white'
            }`}>
              {result.status === 'LULUS' ? '✅ LULUS' : '❌ TIDAK LULUS'}
            </div>

            {result.pesan && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-yellow-300 mb-4">
                <p className="text-xs text-yellow-600 font-bold mb-1">💌 Pesan Wali Kelas</p>
                <p className="text-sm text-orange-700 font-medium italic">"{result.pesan}"</p>
              </div>
            )}

            <button onClick={() => window.print()}
              className="neo-brutal-sm rounded-xl bg-white text-blue-600 font-bold px-5 py-3 w-full hover:bg-blue-50 transition-colors">
              🖨️ CETAK HASIL
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { School } from '@/types'

type Props = {
  school: School
  total: number
  lulus: number
  tdkLulus: number
  countdownDate: string
}

import dynamic from 'next/dynamic'
const StudentsModal = dynamic(() => import('./modals/StudentsModal'))
const SettingsModal = dynamic(() => import('./modals/SettingsModal'))
const UploadModal   = dynamic(() => import('./modals/UploadModal'))

export default function DashboardPageClient({ school, total, lulus, tdkLulus, countdownDate }: Props) {
  const router  = useRouter()
  const isDemo  = school.is_demo === true
  const [openModal, setOpenModal] = useState<'students' | 'settings' | 'upload' | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  function handleClose() {
    setOpenModal(null)
    router.refresh()
  }

  function handleRefresh() {
    setRefreshing(true)
    router.refresh()
    setTimeout(() => setRefreshing(false), 1500)
  }

  return (
    <div className="space-y-4">

      {/* Banner Demo */}
      {isDemo && (
        <div className="neo-brutal rounded-2xl bg-yellow-300 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🧪</span>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 text-sm">Anda sedang di Mode Demo</p>
              <p className="text-xs text-gray-700 mt-0.5">
                Nama sekolah & alamat web dikunci. Fitur lain bisa dicoba bebas!
              </p>
            </div>
            <a
              href="https://wa.me/6289530713597?text=Halo%20Pak%20Choy%2C%20saya%20tertarik%20beli%20akun%20setelah%20coba%20demo"
              target="_blank"
              className="flex-shrink-0 bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-gray-700 transition-colors whitespace-nowrap"
            >
              Beli Sekarang
            </a>
          </div>
        </div>
      )}

      {/* Hint Refresh */}
      <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl px-4 py-3">
        <span className="text-xl">💡</span>
        <p className="text-xs text-amber-800 font-medium flex-1">
          Data baru belum tampil? Klik refresh untuk memuat ulang.
        </p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 disabled:opacity-60 text-amber-900 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={refreshing ? 'animate-spin' : ''}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
            <path d="M8 16H3v5"/>
          </svg>
          {refreshing ? 'Memuat...' : 'Refresh'}
        </button>
      </div>

      {/* Header */}
      <div className="neo-brutal rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-0.5">Dashboard</p>
            <h1 className="text-lg font-black leading-tight">{school?.nama_sekolah}</h1>
          </div>
          <a href={`/${school?.slug}`} target="_blank"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-3 py-2 rounded-xl text-xs font-bold text-white border border-white/30">
            Web Pengumuman
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',     val: total,    color: 'bg-blue-50 border-blue-200',   text: 'text-blue-700'  },
          { label: 'Lulus',     val: lulus,    color: 'bg-green-50 border-green-200', text: 'text-green-700' },
          { label: 'Tdk Lulus', val: tdkLulus, color: 'bg-red-50 border-red-200',     text: 'text-red-700'   },
        ].map(({ label, val, color, text }) => (
          <div key={label} className={`neo-brutal-sm rounded-xl p-4 text-center border-2 ${color}`}>
            <p className={`text-3xl font-black ${text}`}>{val}</p>
            <p className="text-xs font-bold text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Countdown */}
      <div className="neo-brutal rounded-2xl bg-yellow-50 p-4 border-2 border-yellow-300">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">⏰ Jadwal Pengumuman</p>
        <p className="font-black text-gray-900">{countdownDate}</p>
      </div>

      {/* Aksi Cepat */}
      <div className="neo-brutal rounded-2xl bg-white p-4">
        <p className="font-bold text-gray-700 mb-3">⚡ Aksi Cepat</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setOpenModal('students')}
            className="neo-brutal-sm rounded-xl px-4 py-3 font-bold text-sm text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            ➕ Tambah Siswa
          </button>
          <button onClick={() => setOpenModal('upload')}
            className="neo-brutal-sm rounded-xl px-4 py-3 font-bold text-sm text-center bg-green-600 text-white hover:bg-green-700 transition-colors">
            📥 Upload Excel
          </button>
          <button onClick={() => setOpenModal('settings')}
            className="neo-brutal-sm rounded-xl px-4 py-3 font-bold text-sm text-center bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
            ⚙️ Pengaturan
          </button>
          <a href={`/${school?.slug}`} target="_blank"
            className="neo-brutal-sm rounded-xl px-4 py-3 font-bold text-sm text-center bg-yellow-300 text-gray-900 hover:bg-yellow-400 transition-colors">
            🌐 Web Pengumuman
          </a>
        </div>
      </div>

      {/* Modals */}
      {openModal === 'students' && <StudentsModal schoolId={school.id} onClose={handleClose} />}
      {openModal === 'settings' && <SettingsModal school={school} onClose={handleClose} />}
      {openModal === 'upload'   && <UploadModal schoolId={school.id} onClose={handleClose} />}
    </div>
  )
}

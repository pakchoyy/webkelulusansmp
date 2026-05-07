'use client'
import { useState } from 'react'
import type { School } from '@/types'

type Props = {
  school: School
  total: number
  lulus: number
  tdkLulus: number
  countdownDate: string
}

// Lazy import modal components
import dynamic from 'next/dynamic'
const StudentsModal = dynamic(() => import('./modals/StudentsModal'))
const SettingsModal = dynamic(() => import('./modals/SettingsModal'))
const UploadModal   = dynamic(() => import('./modals/UploadModal'))

export default function DashboardPageClient({ school, total, lulus, tdkLulus, countdownDate }: Props) {
  const [openModal, setOpenModal] = useState<'students' | 'settings' | 'upload' | null>(null)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="neo-brutal rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-0.5">Dashboard</p>
            <h1 className="text-lg font-black leading-tight">{school?.nama_sekolah}</h1>
          </div>
          <a href={`/${school?.slug}`} target="_blank"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-3 py-2 rounded-xl text-xs font-bold text-white border border-white/30">
            Lihat Pengumuman
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', val: total, color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
          { label: 'Lulus', val: lulus, color: 'bg-green-50 border-green-200', text: 'text-green-700' },
          { label: 'Tdk Lulus', val: tdkLulus, color: 'bg-red-50 border-red-200', text: 'text-red-700' },
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

      {/* Aksi Cepat — buka modal */}
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
            🔗 Halaman Pengumuman
          </a>
        </div>
      </div>

      {/* Modals */}
      {openModal === 'students' && (
        <StudentsModal schoolId={school.id} onClose={() => setOpenModal(null)} />
      )}
      {openModal === 'settings' && (
        <SettingsModal school={school} onClose={() => setOpenModal(null)} />
      )}
      {openModal === 'upload' && (
        <UploadModal schoolId={school.id} onClose={() => setOpenModal(null)} />
      )}
    </div>
  )
}

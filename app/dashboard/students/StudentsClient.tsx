'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Student } from '@/types'

const DEFAULT_MESSAGES = [
  'Masa depanmu penuh dengan kemungkinan tak terbatas, percayalah pada dirimu.',
  'Kerja keras dan dedikasi adalah investasi terbaik untuk kesuksesanmu.',
  'Setiap langkah yang kau ambil hari ini akan membentuk masa depan yang cerah.',
  'Teruslah bermimpi besar dan bekerja keras untuk mewujudkannya.',
  'Kamu memiliki potensi luar biasa, gunakan dengan bijak.',
  'Kesuksesan dimulai dari sini, jangan pernah berhenti berkembang.',
]

export default function StudentsClient({ initialStudents, schoolId }: {
  initialStudents: Student[]
  schoolId: string
}) {
  const supabase = createClient()
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Form state
  const [nisn, setNisn] = useState('')
  const [nama, setNama] = useState('')
  const [kelas, setKelas] = useState('IX')
  const [status, setStatus] = useState<'LULUS' | 'TIDAK LULUS'>('LULUS')
  const [pesan, setPesan] = useState('')

  async function addStudent(e: React.FormEvent) {
    e.preventDefault()
    if (!nisn || !nama || !kelas) return
    setLoading(true)

    const finalPesan = pesan || DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)]
    const { data, error } = await supabase
      .from('students')
      .insert({ school_id: schoolId, nisn: nisn.trim(), nama: nama.trim(), kelas: kelas.trim(), status, pesan: finalPesan })
      .select()
      .single()

    setLoading(false)
    if (error) {
      setMsg(error.code === '23505' ? '❌ NISN sudah ada.' : '❌ Gagal: ' + error.message)
    } else {
      setStudents(prev => [data, ...prev])
      setNisn(''); setNama(''); setPesan('')
      setMsg('✅ Siswa berhasil ditambahkan!')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  async function deleteStudent(id: string) {
    if (!confirm('Hapus siswa ini?')) return
    await supabase.from('students').delete().eq('id', id).eq('school_id', schoolId)
    setStudents(prev => prev.filter(s => s.id !== id))
  }

  const filtered = students.filter(s =>
    s.nama.toLowerCase().includes(search.toLowerCase()) ||
    s.nisn.includes(search)
  )

  return (
    <div className="space-y-4">
      {/* Form Tambah */}
      <div className="neo-brutal rounded-2xl bg-white p-5">
        <h2 className="font-black text-gray-900 mb-4">➕ Tambah Siswa</h2>
        <form onSubmit={addStudent} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">NISN</label>
              <input value={nisn} onChange={e => setNisn(e.target.value)}
                placeholder="NISN" required
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Kelas</label>
              <input value={kelas} onChange={e => setKelas(e.target.value)}
                placeholder="IX-A"
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Nama Lengkap</label>
            <input value={nama} onChange={e => setNama(e.target.value)}
              placeholder="Nama Lengkap" required
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value as 'LULUS' | 'TIDAK LULUS')}
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400">
              <option value="LULUS">LULUS</option>
              <option value="TIDAK LULUS">TIDAK LULUS</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 block mb-1">
              Pesan Wali Kelas <span className="font-normal text-gray-400">(kosong = acak)</span>
            </label>
            <input value={pesan} onChange={e => setPesan(e.target.value)}
              placeholder="Pesan motivasi..."
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm focus:outline-none focus:border-blue-400" />
            <div className="flex flex-wrap gap-1 mt-2">
              {DEFAULT_MESSAGES.slice(0,3).map((m, i) => (
                <button type="button" key={i} onClick={() => setPesan(m)}
                  className="text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded px-2 py-1 hover:bg-blue-100 transition-colors">
                  {m.slice(0, 30)}...
                </button>
              ))}
            </div>
          </div>
          {msg && <p className="text-sm font-bold">{msg}</p>}
          <button type="submit" disabled={loading}
            className="neo-brutal-sm w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60">
            {loading ? 'Menyimpan...' : 'Tambah Siswa'}
          </button>
        </form>
      </div>

      {/* Daftar Siswa */}
      <div className="neo-brutal rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-black text-gray-900">📋 Daftar Siswa ({students.length})</h2>
        </div>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Cari nama atau NISN..."
          className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 text-sm mb-3 focus:outline-none focus:border-blue-400"
        />

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">Belum ada data siswa</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-auto">
            {filtered.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{s.nama}</p>
                  <p className="text-xs text-gray-400">{s.nisn} • {s.kelas} •{' '}
                    <span className={s.status === 'LULUS' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                      {s.status}
                    </span>
                  </p>
                </div>
                <button onClick={() => deleteStudent(s.id)}
                  className="ml-2 text-red-400 hover:text-red-600 p-1 rounded transition-colors flex-shrink-0">
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

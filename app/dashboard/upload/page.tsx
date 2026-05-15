'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { parseExcel } from '@/lib/excel'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const supabase = createClient()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{ nisn: string; nama: string; kelas: string; status: string }[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setResult('')
    const { rows, errors } = await parseExcel(f)
    setPreview(rows)
    setErrors(errors)
  }

  async function handleUpload() {
    if (!preview.length) return
    setLoading(true)
    setResult('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const rows = preview.map(r => ({ ...r, school_id: user.id }))

    const { error } = await supabase
      .from('students')
      .upsert(rows, { onConflict: 'school_id,nisn', ignoreDuplicates: false })

    setLoading(false)
    if (error) {
      setResult('❌ Gagal upload: ' + error.message)
    } else {
      setResult(`✅ ${rows.length} siswa berhasil diimpor!`)
      setFile(null)
      setPreview([])
      setTimeout(() => router.push('/dashboard/students'), 1500)
    }
  }

  return (
    <div className="space-y-4">
      <div className="neo-brutal rounded-2xl bg-white p-5">
        <h2 className="font-black text-gray-900 mb-2">📥 Upload Excel Massal</h2>
        <p className="text-sm text-gray-500 mb-4">Format kolom: NISN | Nama | Kelas | Status | Pesan</p>

        {/* Template download */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 mb-4">
          <p className="text-xs font-bold text-yellow-700 mb-2">Format Excel yang benar:</p>
          <div className="overflow-x-auto">
            <table className="text-xs w-full border-collapse">
              <thead>
                <tr className="bg-yellow-200">
                  {['NISN','Nama','Kelas','Status','Pesan'].map(h => (
                    <th key={h} className="border border-yellow-300 px-2 py-1 text-left font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-yellow-200 px-2 py-1">1234567890</td>
                  <td className="border border-yellow-200 px-2 py-1">Budi Santoso</td>
                  <td className="border border-yellow-200 px-2 py-1">IX-A</td>
                  <td className="border border-yellow-200 px-2 py-1">LULUS</td>
                  <td className="border border-yellow-200 px-2 py-1">Tetap semangat!</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-yellow-600 mt-2">⚠️ Status harus: LULUS atau TIDAK LULUS (kapital)</p>
        </div>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          className="w-full text-sm border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-bold file:text-xs"
        />
      </div>

      {errors.length > 0 && (
        <div className="neo-brutal-sm rounded-xl bg-red-50 border-2 border-red-300 p-4">
          <p className="font-bold text-red-700 mb-2">⚠️ {errors.length} baris bermasalah:</p>
          {errors.map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
        </div>
      )}

      {preview.length > 0 && (
        <div className="neo-brutal rounded-2xl bg-white p-5">
          <p className="font-black text-gray-900 mb-3">Preview — {preview.length} siswa valid</p>
          <div className="max-h-64 overflow-auto space-y-1.5">
            {preview.slice(0, 20).map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                <span className="font-medium text-gray-900 truncate">{s.nama}</span>
                <span className={`ml-2 text-xs font-bold flex-shrink-0 ${s.status === 'LULUS' ? 'text-green-600' : 'text-red-600'}`}>
                  {s.status}
                </span>
              </div>
            ))}
            {preview.length > 20 && (
              <p className="text-xs text-gray-400 text-center">...dan {preview.length - 20} siswa lainnya</p>
            )}
          </div>

          {result && <p className="mt-3 font-bold text-sm">{result}</p>}

          <button
            onClick={handleUpload}
            disabled={loading}
            className="neo-brutal-sm w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Mengimpor...' : `Import ${preview.length} Siswa`}
          </button>
        </div>
      )}
    </div>
  )
}

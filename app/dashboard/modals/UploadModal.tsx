'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { parseExcel } from '@/lib/excel'
import Modal from './Modal'

export default function UploadModal({ schoolId, onClose }: { schoolId: string; onClose: () => void }) {
  const supabase = createClient()
  const [preview, setPreview] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setResult('')
    const { rows, errors } = await parseExcel(f)
    setPreview(rows); setErrors(errors)
  }

  async function handleUpload() {
    if (!preview.length) return
    setLoading(true)
    const rows = preview.map(r => ({ ...r, school_id: schoolId }))
    const { error } = await supabase.from('students')
      .upsert(rows, { onConflict: 'school_id,nisn', ignoreDuplicates: false })
    setLoading(false)
    if (error) { setResult('❌ Gagal: ' + error.message); return }
    setResult(`✅ ${rows.length} siswa berhasil diimpor!`)
    setPreview([])
    setTimeout(onClose, 1500)
  }

  return (
    <Modal title="📥 Upload Excel Massal" onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3">
          <p className="text-xs font-bold text-yellow-700 mb-2">Format kolom Excel:</p>
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
          <p className="text-xs text-yellow-600 mt-2">⚠️ Status: LULUS atau TIDAK LULUS (kapital)</p>
        </div>

        <input type="file" accept=".xlsx,.xls" onChange={handleFile}
          className="w-full text-sm border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:border-blue-400 transition-colors file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-bold file:text-xs" />

        {errors.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
            <p className="font-bold text-red-700 text-sm mb-1">⚠️ {errors.length} baris bermasalah:</p>
            {errors.slice(0,5).map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
          </div>
        )}

        {preview.length > 0 && (
          <div>
            <p className="font-bold text-gray-700 text-sm mb-2">{preview.length} siswa siap diimpor:</p>
            <div className="max-h-48 overflow-auto space-y-1.5 mb-3">
              {preview.slice(0,10).map((s, i) => (
                <div key={i} className="flex justify-between p-2 rounded-lg bg-gray-50 border border-gray-200 text-sm">
                  <span className="font-medium truncate">{s.nama}</span>
                  <span className={`ml-2 text-xs font-bold flex-shrink-0 ${s.status === 'LULUS' ? 'text-green-600' : 'text-red-600'}`}>{s.status}</span>
                </div>
              ))}
              {preview.length > 10 && <p className="text-xs text-gray-400 text-center">...+{preview.length-10} lainnya</p>}
            </div>
            {result && <p className="font-bold text-sm mb-3">{result}</p>}
            <button onClick={handleUpload} disabled={loading}
              className="neo-brutal-sm w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-60">
              {loading ? 'Mengimpor...' : `Import ${preview.length} Siswa`}
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

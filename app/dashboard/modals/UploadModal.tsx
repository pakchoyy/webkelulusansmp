'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { parseExcel } from '@/lib/excel'
import { utils, write } from 'xlsx'
import Modal from './Modal'

export default function UploadModal({ schoolId, onClose }: { schoolId: string; onClose: () => void }) {
  const supabase = createClient()
  const [preview, setPreview] = useState<any[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  function downloadTemplate() {
    const data = [
      { NISN: '1234567890', Nama: 'Budi Santoso', Kelas: 'IX-A', Status: 'LULUS', Pesan: 'Selamat atas kelulusannya!' },
      { NISN: '1234567891', Nama: 'Siti Aminah', Kelas: 'IX-B', Status: 'TIDAK LULUS', Pesan: 'Jangan menyerah, tetap semangat!' },
    ]
    const ws = utils.json_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Template Siswa')
    const buf = write(wb, { type: 'array', bookType: 'xlsx' })
    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'Template_Data_Siswa.xlsx'; a.click()
  }

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
    <Modal title="📥 Upload Excel Data Siswa" onClose={onClose}>
      <div className="space-y-4">
        
        {/* Template Section */}
        <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-blue-900">1. Unduh Template</h3>
            <button 
              onClick={downloadTemplate}
              className="bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              📥 Download File Contoh
            </button>
          </div>
          <p className="text-[11px] text-blue-700 mb-3 leading-relaxed">
            Gunakan file contoh ini agar format kolom benar dan data diterima sistem.
          </p>
          <div className="bg-white/60 rounded-xl p-2 border border-blue-200">
            <p className="text-[10px] font-bold text-blue-400 mb-1.5 uppercase tracking-wider">Format Kolom:</p>
            <div className="overflow-x-auto">
              <table className="text-[10px] w-full border-collapse">
                <thead>
                  <tr className="bg-blue-100/50">
                    {['NISN','Nama','Kelas','Status','Pesan'].map(h => (
                      <th key={h} className="border border-blue-200 px-2 py-1 text-left font-bold text-blue-900">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white/40 text-blue-800">
                    <td className="border border-blue-100 px-2 py-1">123...</td>
                    <td className="border border-blue-100 px-2 py-1">Budi...</td>
                    <td className="border border-blue-100 px-2 py-1">IX-A</td>
                    <td className="border border-blue-100 px-2 py-1 font-bold">LULUS</td>
                    <td className="border border-blue-100 px-2 py-1 truncate max-w-[50px]">Selamat!</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[9px] text-blue-500 mt-2 italic">** Status wajib "LULUS" atau "TIDAK LULUS"</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-black text-gray-700 px-1">2. Pilih File Excel</h3>
          <input type="file" accept=".xlsx,.xls" onChange={handleFile}
            className="w-full text-sm border-2 border-dashed border-gray-300 rounded-2xl p-6 cursor-pointer hover:border-blue-500 transition-colors file:mr-3 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:bg-blue-800 file:text-white file:font-bold file:text-xs" />
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3">
            <p className="font-bold text-red-700 text-sm mb-1">⚠️ {errors.length} baris bermasalah:</p>
            {errors.slice(0,5).map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
          </div>
        )}

        {preview.length > 0 && (
          <div className="scale-in">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="font-bold text-gray-700 text-sm">{preview.length} Siswa Terdeteksi</p>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black">Siap Impor</span>
            </div>
            <div className="max-h-40 overflow-auto space-y-1 mb-4 rounded-xl border border-gray-100 p-1">
              {preview.slice(0,20).map((s, i) => (
                <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-100 text-[11px]">
                  <div className="min-w-0">
                    <span className="font-bold text-gray-700 truncate block">{s.nama}</span>
                    <span className="text-gray-400 text-[9px]">{s.nisn} • {s.kelas}</span>
                  </div>
                  <span className={`ml-2 font-black px-2 py-0.5 rounded-md ${s.status === 'LULUS' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {s.status === 'LULUS' ? 'LULUS' : 'GAGAL'}
                  </span>
                </div>
              ))}
              {preview.length > 20 && <p className="text-[10px] text-gray-400 text-center py-1">...+{preview.length-20} siswa lainnya</p>}
            </div>
            {result && <p className="font-black text-sm text-center mb-3 p-3 bg-green-50 text-green-700 rounded-xl border border-green-200">{result}</p>}
            <button onClick={handleUpload} disabled={loading}
              className="neo-brutal-sm w-full bg-blue-800 text-white font-bold py-3.5 rounded-2xl hover:bg-blue-900 transition-colors disabled:opacity-60 text-sm">
              {loading ? 'Sedang Mengimpor...' : `🚀 Proses Impor ${preview.length} Siswa Sekarang`}
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="neo-brutal rounded-2xl bg-white p-8 max-w-sm w-full text-center">
        <p className="text-6xl mb-4">😕</p>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Halaman tidak ditemukan</h1>
        <p className="text-gray-500 text-sm mb-6">
          Sekolah dengan slug ini belum terdaftar, atau URL salah.
        </p>
        <Link href="/login"
          className="neo-brutal-sm inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          Kembali ke Login
        </Link>
      </div>
    </div>
  )
}

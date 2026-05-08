'use client'
import { useEffect } from 'react'
import WaHelpFooter from '@/app/components/WaHelpFooter'

export default function Modal({ title, onClose, children, showWaHelp = true }: {
  title: string
  onClose: () => void
  children: React.ReactNode
  showWaHelp?: boolean
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl neo-brutal max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-black text-gray-900 text-lg">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center font-bold text-gray-600 text-lg">
            ✕
          </button>
        </div>
        <div className="p-5">
          {children}
          {showWaHelp && <WaHelpFooter />}
        </div>
      </div>
    </div>
  )
}

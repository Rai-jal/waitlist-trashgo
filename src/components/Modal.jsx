import { useEffect } from 'react'
import WaitlistForm from './WaitlistForm'

export default function Modal({ open, onClose, onSuccess }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center
                 p-0 sm:p-4 overflow-y-auto"
      style={{ background: 'rgba(8,12,22,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-animate bg-white w-full sm:max-w-[640px]
                      sm:rounded-2xl rounded-none mt-auto sm:mt-0
                      shadow-[0_24px_80px_rgba(0,0,0,0.18)]
                      max-h-screen sm:max-h-[95vh] overflow-y-auto">

        {/* Top accent bar */}
        <div className="h-1.5 w-full sm:rounded-t-2xl bg-gradient-to-r from-brand-blue via-blue-500 to-brand-orange" />

        <div className="px-5 py-6 sm:px-8 sm:py-7">

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <span className="inline-block text-[11px] font-bold tracking-[1.5px] uppercase
                               text-brand-orange bg-orange-50 border border-orange-100
                               px-3 py-1 rounded-full mb-3">
                Early Access
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Secure your spot today
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                We'll reach out when the free pilot launches in your area.
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full
                         bg-gray-100 text-gray-400 text-xl
                         hover:bg-gray-200 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <WaitlistForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  )
}

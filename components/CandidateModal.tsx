import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { Candidate } from '../types/election'

interface CandidateModalProps {
  isOpen: boolean
  onClose: () => void
  candidate: Candidate
  partyName: string
}

export function CandidateModal({ isOpen, onClose, candidate, partyName }: CandidateModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Handle escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl mx-4 bg-slate-800 rounded-lg shadow-xl overflow-hidden animate-modal-enter"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          {/* Candidate Photo */}
          <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-slate-700">
            <img
              src={candidate.photo}
              alt={`${candidate.name} - ${partyName} candidate`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Candidate Info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{candidate.name}</h2>
            <p className="text-slate-400">{partyName}</p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Biography</h3>
            <p className="text-slate-300 leading-relaxed">{candidate.bio}</p>
          </div>

          {/* Party Website Link */}
          <div className="text-center">
            <a
              href={candidate.partyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Visit Party Website
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-enter {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-modal-enter {
          animation: modal-enter 0.2s ease-out;
        }
      `}</style>
    </div>
  )
} 
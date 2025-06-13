"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { PoliticalParty, ElectionData } from "../types/election"
import { getSocket, emitVoteUpdate } from "../lib/socket"
import { CandidateModal } from "./CandidateModal"

interface PoliticalPartiesProps {
  parties: PoliticalParty[]
  onPartiesChange?: (parties: PoliticalParty[]) => void
}

interface PartyVoteUpdate {
  partyId: string
  votes: number
  timestamp: string
}

export function PoliticalParties({ parties: initialParties, onPartiesChange }: PoliticalPartiesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [parties, setParties] = useState<PoliticalParty[]>(initialParties)
  const [selectedCandidate, setSelectedCandidate] = useState<PoliticalParty | null>(null)
  const visibleParties = isExpanded ? parties : parties.slice(0, 3)

  useEffect(() => {
    const socket = getSocket()
    
    // Escuchar actualizaciones de votos por partido
    socket.on('party_vote_update', (data: Partial<ElectionData>) => {
      if (data.parties) {
        setParties(data.parties)
        onPartiesChange?.(data.parties)
      }
    })

    return () => {
      socket.off('party_vote_update')
    }
  }, [onPartiesChange])

  // Sincronizar con props externos
  useEffect(() => {
    setParties(initialParties)
  }, [initialParties])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-BO').format(num)
  }

  const handleVoteUpdate = (partyId: string, newVotes: number) => {
    const updatedParties = parties.map(p => 
      p.id === partyId 
        ? { ...p, votes: newVotes }
        : p
    )
    
    const totalVotes = updatedParties.reduce((sum, p) => sum + p.votes, 0)
    const partiesWithPercentages = updatedParties.map(p => ({
      ...p,
      percentage: (p.votes / totalVotes) * 100
    }))

    const update: Partial<ElectionData> = {
      parties: partiesWithPercentages,
      totalVotes
    }

    emitVoteUpdate(update)
  }

  return (
    <div className="w-full mx-auto">
      <h3 className="text-xl font-bold text-slate-300 mb-6 text-center">Political Parties</h3>

      <div className="space-y-4">
        {visibleParties.map((party, index) => (
          <div
            key={party.id}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
            style={{
              animation: `slideIn 0.3s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="relative w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:ring-2 hover:ring-slate-500 transition-all duration-200"
                  onClick={() => setSelectedCandidate(party)}
                >
                  <img
                    src={party.candidate.photo}
                    alt={`${party.candidate.name} - ${party.name} candidate`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-white">{party.name}</h4>
                  <p className="text-sm text-slate-400">{party.abbreviation}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-white">{party.percentage.toFixed(1)}%</div>
                <div className="text-sm text-slate-400">{formatNumber(party.votes)} votes</div>
              </div>
            </div>

            <div className="mt-3">
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: party.color,
                    width: `${party.percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {parties.length > 3 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-6 bg-slate-700/50 hover:bg-slate-600/50 text-white py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm border border-slate-600/30"
        >
          <span>{isExpanded ? "Show Less" : "See More"}</span>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      )}

      {selectedCandidate && (
        <CandidateModal
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          candidate={selectedCandidate.candidate}
          partyName={selectedCandidate.name}
        />
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

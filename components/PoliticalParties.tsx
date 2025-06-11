"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { PoliticalParty } from "../types/election"

interface PoliticalPartiesProps {
  parties: PoliticalParty[]
}

export function PoliticalParties({ parties }: PoliticalPartiesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const visibleParties = isExpanded ? parties : parties.slice(0, 3)

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
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: party.color }} />
                <div>
                  <h4 className="font-semibold text-white">{party.name}</h4>
                  <p className="text-sm text-slate-400">{party.abbreviation}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-white">{party.percentage.toFixed(1)}%</div>
                <div className="text-sm text-slate-400">{party.votes.toLocaleString()} votes</div>
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

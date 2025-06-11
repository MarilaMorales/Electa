"use client"

import { useState } from "react"
import type { BoliviaRegion } from "../types/election"

interface BoliviaMapProps {
  regions: BoliviaRegion[]
  onRegionClick: (region: BoliviaRegion) => void
}

export function BoliviaMap({ regions, onRegionClick }: BoliviaMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  const getRegionColor = (region: BoliviaRegion) => {
    const partyColors: Record<string, string> = {
      MAS: "#1E40AF",
      MTS: "#DC2626",
      "Unity Block": "#059669",
      AD: "#7C3AED",
    }
    return partyColors[region.leadingParty] || "#6B7280"
  }

  return (
    <div className="w-full mx-auto">
      <h3 className="text-lg font-semibold text-slate-300 mb-4 text-center">Bolivia Interactive Map</h3>
      <div className="relative bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm">
        <svg viewBox="0 0 400 400" className="w-full h-auto" style={{ maxHeight: "500px" }}>
          {regions.map((region) => (
            <g key={region.id}>
              <path
                d={region.coordinates}
                fill={getRegionColor(region)}
                stroke="#1e293b"
                strokeWidth="2"
                className={`cursor-pointer transition-all duration-200 ${
                  hoveredRegion === region.id ? "opacity-100 drop-shadow-lg" : "opacity-80 hover:opacity-100"
                }`}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => onRegionClick(region)}
              />
              {hoveredRegion === region.id && (
                <text
                  x={region.coordinates.includes("150") ? 150 : 200}
                  y={region.coordinates.includes("120") ? 140 : 200}
                  fill="white"
                  fontSize="12"
                  textAnchor="middle"
                  className="pointer-events-none font-medium drop-shadow-md"
                >
                  {region.name}
                </text>
              )}
            </g>
          ))}
        </svg>

        {hoveredRegion && (
          <div className="absolute bottom-2 left-2 bg-slate-900/90 text-white p-2 rounded text-sm backdrop-blur-sm">
            {(() => {
              const region = regions.find((r) => r.id === hoveredRegion)
              return region ? (
                <>
                  <div className="font-semibold">{region.name}</div>
                  <div>Votes: {region.votes.toLocaleString()}</div>
                  <div>Leading: {region.leadingParty}</div>
                </>
              ) : null
            })()}
          </div>
        )}
      </div>
    </div>
  )
}

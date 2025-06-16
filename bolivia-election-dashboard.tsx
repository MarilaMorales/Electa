"use client"

import { useState, useEffect } from "react"
import { CentralNumberDisplay } from "./components/CentralNumberDisplay"
import dynamic from 'next/dynamic'
import { PoliticalParties } from "./components/PoliticalParties"
import { IncidentsFlag } from "./components/IncidentsFlag"
import { mockElectionData } from "./public/data/mockData"
import type { BoliviaRegion, ElectionData } from "./types/election"
import { getSocket } from "./lib/socket"
import { Header } from "./components/Header"

// Dynamically import ECharts components with SSR disabled
const MapWithWebSocket = dynamic(() => import('./components/map2'), { ssr: false })
const BarChart = dynamic(() => import('./components/BarChart'), { ssr: false })

export default function BoliviaElectionDashboard() {
  const [electionData, setElectionData] = useState<ElectionData>({
    ...mockElectionData,
    totalVotes: 0
  })
  const [selectedRegion, setSelectedRegion] = useState<BoliviaRegion | null>(null)
  const [showVisualization, setShowVisualization] = useState(true)

  const handleTotalVotesChange = (newTotal: number) => {
    setElectionData((prev) => ({
      ...prev,
      totalVotes: newTotal,
    }))
  }

  const handleRegionClick = (region: BoliviaRegion) => {
    setSelectedRegion(region)
    console.log("Selected region:", region)
  }

  // Get party vote data for Three.js visualization
  const partyVoteData = electionData.parties.slice(0, 5).map((party) => party.votes)

  useEffect(() => {
    const socket = getSocket()
    
    socket.on('global vote summary', (data: { totalVotes: number }) => {
      setElectionData(prev => ({
        ...prev,
        totalVotes: data.totalVotes
      }))
    })

    return () => {
      socket.off('global vote summary')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #1e40af 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #dc2626 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* New Header Component */}
        <Header />

        {/* Top Priority - Total Votes Counter */}
        <div className="container mx-auto px-4 mb-12 mt-8">
          <div className="flex justify-center">
            <CentralNumberDisplay
              value={electionData.totalVotes}
              onChange={handleTotalVotesChange}
              label="Total Votes Counted"
            />
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Bolivia Map */}
            <div className="lg:col-span-6">
              {/* <BoliviaMap regions={electionData.regions} onRegionClick={handleRegionClick} /> */}
              <MapWithWebSocket />

              {/* Three.js Visualization replaced with BarChart */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-300 mb-4 text-center">Vote Distribution</h3>
                {/* <ThreeVisualization data={partyVoteData} isVisible={showVisualization} /> */}
                <BarChart active={true} />
              </div>
            </div>

            {/* Right Column - Political Parties */}
            <div className="lg:col-span-6">
              <PoliticalParties parties={electionData.parties} />

              {/* Election Stats */}
              <div className="mt-8 bg-slate-800/30 rounded-lg p-6 backdrop-blur-sm border border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-300 mb-4">Election Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Turnout Rate</span>
                    <span className="text-white font-semibold">73.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Polling Stations</span>
                    <span className="text-white font-semibold">34,563</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Registered Voters</span>
                    <span className="text-white font-semibold">7.3M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Processed</span>
                    <span className="text-green-400 font-semibold">89.4%</span>
                  </div>
                </div>
              </div>

              {selectedRegion && (
                <div className="mt-6 bg-slate-800/30 rounded-lg p-6 backdrop-blur-sm border border-slate-700/50">
                  <h3 className="text-lg font-semibold text-slate-300 mb-4">Selected Region</h3>
                  <div className="space-y-2">
                    <div className="text-xl font-bold text-blue-400">{selectedRegion.name}</div>
                    <div className="text-slate-300">Votes: {selectedRegion.votes.toLocaleString()}</div>
                    <div className="text-slate-300">Leading Party: {selectedRegion.leadingParty}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Incidents Flag */}
      <IncidentsFlag incidents={electionData.incidents} />

      {/* Loading Indicator */}
      <div className="fixed bottom-4 left-4 bg-slate-800/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-700/50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-slate-300">Live Updates Active</span>
        </div>
      </div>
    </div>
  )
}

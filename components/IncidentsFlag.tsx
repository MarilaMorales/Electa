"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X, Clock, MapPin } from "lucide-react"
import type { Incident } from "../types/election"
import { getSocket, emitIncidentUpdate } from "../lib/socket"

interface IncidentsFlagProps {
  incidents: Incident[]
  onIncidentsChange?: (incidents: Incident[]) => void
}

export function IncidentsFlag({ incidents: initialIncidents, onIncidentsChange }: IncidentsFlagProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)

  useEffect(() => {
    const socket = getSocket()
    
    // Escuchar actualizaciones de incidentes
    socket.on('incident_update', (data: Incident) => {
      setIncidents(prev => {
        const existing = prev.find(i => i.id === data.id)
        if (existing) {
          const updated = prev.map(i => i.id === data.id ? data : i)
          onIncidentsChange?.(updated)
          return updated
        }
        const newIncidents = [...prev, data]
        onIncidentsChange?.(newIncidents)
        return newIncidents
      })
    })

    return () => {
      socket.off('incident_update')
    }
  }, [onIncidentsChange])

  // Sincronizar con props externos
  useEffect(() => {
    setIncidents(initialIncidents)
  }, [initialIncidents])

  const handleAddIncident = (incident: Omit<Incident, 'id' | 'timestamp'>) => {
    const newIncident: Incident = {
      ...incident,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }
    
    emitIncidentUpdate(newIncident)
    setIncidents(prev => {
      const updated = [...prev, newIncident]
      onIncidentsChange?.(updated)
      return updated
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-orange-400 bg-orange-500/20"
      case "medium":
        return "text-blue-400 bg-blue-500/20"
      case "low":
        return "text-green-400 bg-green-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      {/* Flag Button */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-8 rounded-l-lg shadow-lg transition-all duration-200 flex flex-col items-center space-y-2 min-w-[80px]"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          <AlertTriangle size={24} />
          <span className="font-bold text-sm">INCIDENT LIST</span>
          {incidents.length > 0 && (
            <span className="bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              {incidents.length}
            </span>
          )}
        </button>
      </div>

      {/* Incidents Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div className="w-96 bg-slate-900 border-l border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-300 flex items-center space-x-2">
                <AlertTriangle className="text-orange-500" size={20} />
                <span>Incident Reports</span>
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto h-full pb-20">
              {incidents.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No incidents reported</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {incidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-white text-sm">{incident.title}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(incident.severity)}`}
                        >
                          {incident.severity.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-slate-300 text-sm mb-3">{incident.description}</p>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{formatTime(incident.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin size={12} />
                          <span>{incident.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

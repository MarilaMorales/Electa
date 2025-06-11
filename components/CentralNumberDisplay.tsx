"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Edit3, Check, X } from "lucide-react"

interface CentralNumberDisplayProps {
  value: number
  onChange: (value: number) => void
  label: string
}

export function CentralNumberDisplay({ value, onChange, label }: CentralNumberDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value.toString())
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    setDisplayValue(value)
    setEditValue(value.toString())
  }, [value])

  const handleSave = () => {
    const newValue = Number.parseInt(editValue.replace(/,/g, ""), 10)
    if (!isNaN(newValue) && newValue >= 0) {
      onChange(newValue)
      setDisplayValue(newValue)
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(displayValue.toString())
    setIsEditing(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <div className="text-center max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-300 mb-6">{label}</h2>

      <div className="relative group">
        {!isEditing ? (
          <div
            className="cursor-pointer bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 border border-blue-500/30 min-h-[200px] md:min-h-[300px] lg:min-h-[400px] flex flex-col items-center justify-center"
            onClick={() => setIsEditing(true)}
          >
            <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-black text-white mb-4 font-mono tracking-tight leading-none break-all text-center max-w-full overflow-hidden">
              {formatNumber(displayValue)}
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-auto">
              <Edit3 size={20} />
              <span className="text-lg">Click to edit</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 shadow-2xl border border-slate-600 min-h-[200px] md:min-h-[300px] lg:min-h-[400px] flex flex-col items-center justify-center">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value.replace(/[^0-9]/g, ""))}
              onKeyDown={handleKeyPress}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-black text-white bg-transparent text-center w-full outline-none font-mono tracking-tight leading-none break-all max-w-full"
              autoFocus
              placeholder="Enter number"
            />
            <div className="flex items-center justify-center space-x-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors duration-200"
              >
                <Check size={24} />
              </button>
              <button
                onClick={handleCancel}
                className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-slate-400 text-lg">Last updated: {new Date().toLocaleTimeString()}</div>
    </div>
  )
}

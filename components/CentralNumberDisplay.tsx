// This component needs to run in the browser because it uses browser APIs (Socket.IO)
"use client"

// Import necessary tools from React and our socket connection
import React, { useState, useEffect } from "react"
import { Edit3 } from "lucide-react"
import { getSocket } from "../lib/socket"

// Define what information this component needs to work
interface CentralNumberDisplayProps {
  value: number        // The starting number to show
  onChange: (value: number) => void  // Function to tell parent when number changes
  label: string       // The title to show above the number
}

export function CentralNumberDisplay({ value, onChange, label }: CentralNumberDisplayProps) {
  // State variables that can change and make the component update
  // isConnected: tells us if we're connected to the server (true) or not (false)
  const [isConnected, setIsConnected] = useState(false)
  
  // displayValue: the current number we're showing
  // null means we haven't received any updates from the server yet
  const [displayValue, setDisplayValue] = useState<number | null>(null)
  
  // lastUpdated: stores when we last got an update from the server
  // empty string means we haven't received any updates yet
  const [lastUpdated, setLastUpdated] = useState<string>("")

  // Set up socket connection and handle real-time updates
  useEffect(() => {
    // Get our connection to the server using the socket singleton
    const socket = getSocket()
    
    // When we successfully connect to the server
    socket.on('connect', () => {
      setIsConnected(true)  // Update our connection status to connected
    })

    // When we lose connection to the server
    socket.on('disconnect', () => {
      setIsConnected(false)  // Update our connection status to disconnected
    })
    
    // When we receive a new vote count from the server
    socket.on('vote count', (count: number) => {
      setDisplayValue(count)  // Update the number we're displaying
      setLastUpdated(new Date().toLocaleTimeString('es-BO'))  // Save the current time as last update
      onChange(count)  // Notify the parent component about the new value
    })

    // If we're not connected yet, show the initial value passed as prop
    if (!isConnected) {
      setDisplayValue(value)
    }

    // Cleanup function: remove all event listeners when component unmounts
    // This prevents memory leaks and duplicate listeners
    return () => {
      socket.off('vote count')  // Stop listening for vote updates
      socket.off('connect')     // Stop listening for connection events
      socket.off('disconnect')  // Stop listening for disconnection events
    }
  }, [onChange, value, isConnected])  // Re-run effect if these dependencies change

  // Helper function to format numbers with commas and proper locale
  // Example: 1234567 becomes "1,234,567" in Bolivia format
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-BO').format(num)
  }

  // Render the component UI
  return (
    // Main container with max width and center alignment
    <div className="text-center max-w-6xl mx-auto">
      {/* Title section - shows the label prop */}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-300 mb-6">{label}</h2>

      {/* Container for the big number display with hover effects */}
      <div className="relative group">
        {/* Blue gradient background with responsive padding and rounded corners */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 shadow-2xl border border-blue-500/30 min-h-[200px] md:min-h-[300px] lg:min-h-[400px] flex flex-col items-center justify-center">
          {/* The actual number display - responsive font sizes */}
          <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-black text-white mb-4 font-mono tracking-tight leading-none break-all text-center max-w-full overflow-hidden">
            {/* Show server value if available, otherwise show initial value */}
            {displayValue !== null ? formatNumber(displayValue) : formatNumber(value)}
          </div>
          
          {/* Connection status indicator - only visible on hover */}
          <div className="flex items-center justify-center space-x-2 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-auto">
            <Edit3 size={20} />
            <span className="text-lg">
              {/* Show different text based on connection status */}
              {isConnected ? "Auto-updating" : "Connecting..."}
            </span>
          </div>
        </div>
      </div>

      {/* Last update timestamp - only shown when we have updates */}
      <div className="mt-6 text-slate-400 text-lg">
        {lastUpdated && `Last updated: ${lastUpdated}`}
      </div>
    </div>
  )
}




















// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Edit3, Check, X } from "lucide-react"

// interface CentralNumberDisplayProps {
//   value: number
//   onChange: (value: number) => void
//   label: string
// }

// export function CentralNumberDisplay({ value, onChange, label }: CentralNumberDisplayProps) {
//   const [isEditing, setIsEditing] = useState(false)
//   const [editValue, setEditValue] = useState(value.toString())
//   const [displayValue, setDisplayValue] = useState(value)

//   useEffect(() => {
//     setDisplayValue(value)
//     setEditValue(value.toString())
//   }, [value])

//   const handleSave = () => {
//     const newValue = Number.parseInt(editValue.replace(/,/g, ""), 10)
//     if (!isNaN(newValue) && newValue >= 0) {
//       onChange(newValue)
//       setDisplayValue(newValue)
//       setIsEditing(false)
//     }
//   }

//   const handleCancel = () => {
//     setEditValue(displayValue.toString())
//     setIsEditing(false)
//   }

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter") {
//       handleSave()
//     } else if (e.key === "Escape") {
//       handleCancel()
//     }
//   }

//   const formatNumber = (num: number) => {
//     return num.toLocaleString()
//   }

//   return (
//     <div className="text-center max-w-6xl mx-auto">
//       <h2 className="text-3xl md:text-4xl font-bold text-slate-300 mb-6">{label}</h2>

//       <div className="relative group">
//         {!isEditing ? (
//           <div
//             className="cursor-pointer bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 border border-blue-500/30 min-h-[200px] md:min-h-[300px] lg:min-h-[400px] flex flex-col items-center justify-center"
//             onClick={() => setIsEditing(true)}
//           >
//             <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-black text-white mb-4 font-mono tracking-tight leading-none break-all text-center max-w-full overflow-hidden">
//               {formatNumber(displayValue)}
//             </div>
//             <div className="flex items-center justify-center space-x-2 text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-auto">
//               <Edit3 size={20} />
//               <span className="text-lg">Click to edit</span>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-slate-800 rounded-3xl p-8 md:p-12 lg:p-16 xl:p-20 shadow-2xl border border-slate-600 min-h-[200px] md:min-h-[300px] lg:min-h-[400px] flex flex-col items-center justify-center">
//             <input
//               type="text"
//               value={editValue}
//               onChange={(e) => setEditValue(e.target.value.replace(/[^0-9]/g, ""))}
//               onKeyDown={handleKeyPress}
//               className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-black text-white bg-transparent text-center w-full outline-none font-mono tracking-tight leading-none break-all max-w-full"
//               autoFocus
//               placeholder="Enter number"
//             />
//             <div className="flex items-center justify-center space-x-4 mt-6">
//               <button
//                 onClick={handleSave}
//                 className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors duration-200"
//               >
//                 <Check size={24} />
//               </button>
//               <button
//                 onClick={handleCancel}
//                 className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-colors duration-200"
//               >
//                 <X size={24} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="mt-6 text-slate-400 text-lg">Last updated: {new Date().toLocaleTimeString()}</div>
//     </div>
//   )
// }

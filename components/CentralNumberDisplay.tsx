// This component needs to run in the browser because it uses browser APIs (Socket.IO)
"use client"

// Import necessary tools from React and our socket connection
import React, { useState, useEffect, useRef } from "react"
import { Edit3 } from "lucide-react"
import { getSocket } from "../lib/socket"

interface PartyData {
  name: string;
  count: number;
  percent: number;
}

interface VoteSummary {
  totalVotes: number;
  partyBreakdown: PartyData[];
}

interface CentralNumberDisplayProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const CentralNumberDisplay: React.FC<CentralNumberDisplayProps> = ({ value: initialValue, onChange, label }) => {
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('🔄 [CentralNumberDisplay] Iniciando conexión socket...');
    const socket = getSocket();
    
    socket.on('connect', () => {
      console.log('🟢 [CentralNumberDisplay] Socket conectado, ID:', socket.id);
      setIsConnected(true);
      console.log('📤 [CentralNumberDisplay] Solicitando resumen global...');
      socket.emit('get-global-summary');
    });

    socket.on('global vote summary', (data: VoteSummary) => {
      console.log('📥 [CentralNumberDisplay] Datos recibidos del servidor:', {
        totalVotes: data.totalVotes,
        timestamp: new Date().toISOString()
      });
      if (data && typeof data.totalVotes === 'number') {
        console.log('✅ [CentralNumberDisplay] Actualizando totalVotes:', {
          anterior: totalVotes,
          nuevo: data.totalVotes,
          timestamp: new Date().toISOString()
        });
        
        setTotalVotes(data.totalVotes);
        setLastUpdated(new Date().toLocaleTimeString('es-BO'));
        onChange(data.totalVotes);
      } else {
        console.warn('⚠️ [CentralNumberDisplay] Datos recibidos inválidos:', data);
      }
    });

    socket.on('connect_error', (error: Error) => {
      console.error('❌ [CentralNumberDisplay] Error de conexión:', error.message);
      setIsConnected(false);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('🔴 [CentralNumberDisplay] Socket desconectado. Razón:', reason);
      setIsConnected(false);
    });

    // Solicitar datos iniciales si ya estamos conectados
    if (socket.connected) {
      console.log('📤 [CentralNumberDisplay] Socket ya conectado, solicitando datos iniciales...');
      socket.emit('get-global-summary');
      setIsConnected(true);
    }

    // Solicitar datos cada 5 segundos si estamos conectados
    const interval = setInterval(() => {
      if (socket.connected) {
        console.log('🔄 [CentralNumberDisplay] Solicitando actualización periódica...');
        socket.emit('get-global-summary');
      }
    }, 5000);

    return () => {
      console.log('🧹 [CentralNumberDisplay] Limpiando conexión socket...');
      clearInterval(interval);
      socket.off('global vote summary');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []); // Sin dependencias para evitar re-subscripciones

  // Log para depurar el renderizado
  console.log('🎨 [CentralNumberDisplay] Renderizando con:', {
    totalVotes,
    initialValue,
    isConnected,
    lastUpdated
  });

  return (
    <div className="relative group">
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] border border-blue-500/30 backdrop-blur-sm">
        {/* Indicador de conexión */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-xs text-white/80">
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>

        {/* Número principal */}
        <div className="text-center">
          <div className="relative">
            <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 font-mono tracking-tight leading-none transition-all duration-300 transform hover:scale-105">
              {totalVotes.toLocaleString()}
            </div>
            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Etiqueta */}
          <div className="text-xl md:text-2xl font-semibold text-blue-100 mb-2">
            {label}
          </div>

          {/* Última actualización */}
          {lastUpdated && (
            <div className="text-sm text-blue-200/80 mt-2 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-300 animate-pulse" />
              <span>Última actualización: {lastUpdated}</span>
            </div>
          )}
        </div>

        {/* Efecto de borde brillante */}
        <div className="absolute inset-0 rounded-3xl border-2 border-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
}

export default CentralNumberDisplay;




















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

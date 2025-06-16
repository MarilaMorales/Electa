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

interface VoteSummary {
  totalVotes: number;
  partyBreakdown: {
    name: string;
    count: number;
    percent: number;
  }[];
}

export function CentralNumberDisplay({ value, onChange, label }: CentralNumberDisplayProps) {
  const [displayValue, setDisplayValue] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Efecto para inicializar el valor
  useEffect(() => {
    console.log('🔄 [CentralNumberDisplay] Inicializando con valor:', value);
    setDisplayValue(value);
  }, []);

  useEffect(() => {
    console.log('🔄 [CentralNumberDisplay] Iniciando conexión socket...');
    console.log('📊 [CentralNumberDisplay] Estado actual:', { displayValue, isConnected, lastUpdated });
    
    const socket = getSocket();
    let isComponentMounted = true;
    
    // Configurar listeners del socket
    const setupSocketListeners = () => {
      socket.on('connect', () => {
        if (!isComponentMounted) return;
        console.log('🟢 [CentralNumberDisplay] Socket conectado, ID:', socket.id);
        setIsConnected(true);
        console.log('📤 [CentralNumberDisplay] Solicitando resumen global...');
        socket.emit('get-global-summary');
      });

      socket.on('disconnect', (reason: string) => {
        if (!isComponentMounted) return;
        console.log('🔴 [CentralNumberDisplay] Socket desconectado. Razón:', reason);
        setIsConnected(false);
      });

      socket.on('connect_error', (error: Error) => {
        if (!isComponentMounted) return;
        console.error('❌ [CentralNumberDisplay] Error de conexión:', error.message);
        setIsConnected(false);
      });
      
      socket.on('global vote summary', (data: any) => {
        if (!isComponentMounted) return;
        console.log('📥 [CentralNumberDisplay] Datos recibidos del servidor:', {
          totalVotes: data.totalVotes,
          timestamp: new Date().toISOString(),
          socketId: socket.id,
          isConnected: socket.connected
        });

        // Actualizar el estado local y notificar al padre
        if (data && typeof data.totalVotes === 'number') {
          const newValue = data.totalVotes;
          console.log('✅ [CentralNumberDisplay] Actualizando estados:', {
            displayValue: newValue,
            previousValue: displayValue,
            timestamp: new Date().toISOString()
          });
          setDisplayValue(newValue);
          setLastUpdated(new Date().toLocaleTimeString('es-BO'));
          onChange(newValue);
        } else {
          console.warn('⚠️ [CentralNumberDisplay] Datos recibidos inválidos:', data);
        }
      });
    };

    // Configurar los listeners
    setupSocketListeners();

    // Solicitar datos iniciales si ya estamos conectados
    if (socket.connected) {
      console.log('📤 [CentralNumberDisplay] Socket ya conectado, solicitando datos iniciales...');
      socket.emit('get-global-summary');
    }

    // Solicitar datos cada 5 segundos si estamos conectados
    const interval = setInterval(() => {
      if (socket.connected && isComponentMounted) {
        console.log('🔄 [CentralNumberDisplay] Solicitando actualización periódica...');
        socket.emit('get-global-summary');
      }
    }, 5000);

    // Limpiar listeners y intervalos cuando el componente se desmonta
    return () => {
      console.log('🧹 [CentralNumberDisplay] Limpiando conexión socket...');
      isComponentMounted = false;
      clearInterval(interval);
      socket.off('global vote summary');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [onChange]);

  // Efecto para depurar cambios en displayValue
  useEffect(() => {
    console.log('📊 [CentralNumberDisplay] displayValue actualizado:', displayValue);
  }, [displayValue]);

  return (
    <div className="relative">
      <div className="text-center">
        <div className="text-4xl font-bold text-white mb-2">
          {displayValue?.toLocaleString() ?? value.toLocaleString()}
        </div>
        <div className="text-sm text-slate-400">{label}</div>
        {lastUpdated && (
          <div className="text-xs text-slate-500 mt-1">
            Última actualización: {lastUpdated}
          </div>
        )}
      </div>
      <div className="absolute -top-2 -right-2">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
    </div>
  );
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

import { Socket, Manager } from 'socket.io-client';
import type { Socket as SocketType, Manager as ManagerType } from 'socket.io-client';
import { ElectionData } from '../types/election';

let socket: SocketType | null = null;
let manager: ManagerType | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000;

const socketConfig = {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
  reconnectionDelay: RECONNECT_DELAY,
  timeout: 20000,
  forceNew: true,
  autoConnect: true
} as const;

interface VoteSummary {
  totalVotes: number;
  partyBreakdown: Array<{
    name: string;
    count: number;
    percent: string;
  }>;
}

interface ElectionUpdate {
  totalVotes: number;
  parties: Array<{
    name: string;
    votes: number;
  }>;
}

interface IncidentUpdate {
  id: string;
  type: string;
  description: string;
  location: string;
  timestamp: string;
}

const cleanupSocket = () => {
  if (socket) {
    console.log('Socket: Limpiando socket anterior...');
    socket.disconnect();
    socket = null;
  }
  if (manager) {
    console.log('Socket: Limpiando manager anterior...');
    manager = null;
  }
};

export const getSocket = () => {
  if (socket?.connected) {
    console.log('Socket: Reutilizando conexión existente');
    return socket;
  }

  cleanupSocket();

  console.log('Socket: Iniciando nueva conexión...');
  console.log('Socket: Configuración:', socketConfig);

  try {
    manager = new Manager('http://localhost:4000', {
      ...socketConfig,
      transports: [...socketConfig.transports]
    });
    socket = manager.socket('/');

    socket.on('connect', () => {
      console.log('Socket: Conectado al servidor de votación');
      console.log('Socket: ID de conexión:', socket?.id);
      reconnectAttempts = 0;
      socket?.emit('get-global-summary');
    });

    socket.on('connect_error', (error: Error) => {
      console.error('Socket: Error de conexión:', error.message);
      reconnectAttempts++;
      
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error('Socket: Máximo número de intentos de reconexión alcanzado');
        if (socket) {
          socket.disconnect();
          socket = null;
        }
        manager = null;
      } else {
        console.log(`Socket: Intento de reconexión ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      }
    });

    socket.on('disconnect', (reason: string) => {
      console.log('Socket: Desconectado del servidor. Razón:', reason);
      if (reason === 'io server disconnect') {
        // El servidor forzó la desconexión, intentar reconectar
        socket?.connect();
      }
    });

    socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log(`Socket: Intento de reconexión ${attemptNumber}/${MAX_RECONNECT_ATTEMPTS}`);
    });

    socket.on('reconnect', (attemptNumber: number) => {
      console.log(`Socket: Reconectado después de ${attemptNumber} intentos`);
      socket?.emit('get-global-summary');
    });

    socket.on('reconnect_error', (error: Error) => {
      console.error('Socket: Error en reconexión:', error.message);
    });

    socket.on('reconnect_failed', () => {
      console.error('Socket: Falló la reconexión después de todos los intentos');
    });

    // Eventos de datos
    socket.on('global vote summary', (data: VoteSummary) => {
      console.log('Socket: Resumen global recibido:', {
        totalVotes: data.totalVotes,
        numberOfParties: data.partyBreakdown?.length,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('election update', (data: ElectionUpdate) => {
      console.log('Socket: Actualización de elección recibida:', data);
    });

    socket.on('incident update', (data: IncidentUpdate) => {
      console.log('Socket: Actualización de incidente recibida:', data);
    });

    return socket;
  } catch (error) {
    console.error('Socket: Error al crear conexión:', error);
    throw error;
  }
};

export const disconnectSocket = () => {
  cleanupSocket();
};

export const emitVoteUpdate = (data: Partial<ElectionUpdate>) => {
  if (socket?.connected) {
    console.log('Socket: Enviando actualización de voto:', data);
    socket.emit('vote update', data);
  } else {
    console.warn('Socket: No se puede enviar actualización - socket no conectado');
  }
};

export const emitIncidentUpdate = (data: Partial<IncidentUpdate>) => {
  if (socket?.connected) {
    console.log('Socket: Enviando actualización de incidente:', data);
    socket.emit('incident update', data);
  } else {
    console.warn('Socket: No se puede enviar actualización - socket no conectado');
  }
}; 
import { Manager } from 'socket.io-client';
import { ElectionData } from '../types/election';

const manager = new Manager('http://localhost:4000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

let socket: any = null;

export const getSocket = () => {
  if (!socket) {
    socket = manager.socket('/'); // Responsable of manage the connection Websocket

    socket.on('connect', () => {
      console.log('Conectado al servidor de votación');
    });

    socket.on('connect_error', (error: Error) => {
      console.error('Error de conexión:', error);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
    });

    // Eventos específicos para datos electorales
    socket.on('election_update', (data: Partial<ElectionData>) => {
      console.log('Actualización de datos electorales:', data);
    });

    socket.on('incident_update', (data: any) => {
      console.log('Actualización de incidentes:', data);
    });
  }
  return socket;
};

// Función para desconectar el socket cuando sea necesario
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Función para emitir actualizaciones de votos
export const emitVoteUpdate = (data: Partial<ElectionData>) => {
  const socket = getSocket();
  socket.emit('vote_update', data);
};

// Función para emitir actualizaciones de incidentes
export const emitIncidentUpdate = (data: any) => {
  const socket = getSocket();
  socket.emit('incident_update', data);
}; 
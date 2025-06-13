declare module '*/lib/socket' {
  export function getSocket(): any;
  export function disconnectSocket(): void;
  export function emitVoteUpdate(data: any): void;
  export function emitIncidentUpdate(data: any): void;
} 
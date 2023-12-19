import { createContext } from 'react';
import type { Socket } from 'socket.io-client';

export const WsContext = createContext<Socket | null>(null);

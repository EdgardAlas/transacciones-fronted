import { createContext } from 'react';
import { ITransaccionApp } from '../hooks/useTransaccionApp';

export const TransaccionesContext = createContext<ITransaccionApp>(
  {} as ITransaccionApp
);

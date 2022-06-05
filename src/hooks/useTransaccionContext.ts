import { useContext } from 'react';
import { TransaccionesContext } from '../context/TransaccionesContext';

export const useTransaccionContext = () => {
  return useContext(TransaccionesContext);
};

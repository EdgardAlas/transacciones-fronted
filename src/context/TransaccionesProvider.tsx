import React from 'react';
import { Container } from 'react-bootstrap';
import { useTransaccionApp } from '../hooks/useTransaccionApp';
import { TransaccionesContext } from './TransaccionesContext';

interface Props {
  children: React.ReactNode;
}

export const TransaccionesProvider = ({ children }: Props) => {
  const values = useTransaccionApp();
  return (
    <TransaccionesContext.Provider value={values}>
      <Container
        className='border border-2 rounded-2 shadow-sm p-3 bg-white'
        fluid
      >
        {children}
      </Container>
    </TransaccionesContext.Provider>
  );
};

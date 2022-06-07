import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Play } from 'react-bootstrap-icons';
import { api } from '../api';
import { useTransaccionContext } from '../hooks/useTransaccionContext';

export const NivelAislamiento = () => {
  const {aislamiento,setAislamiento} = useTransaccionContext();
  const { transaccionIniciada, setTransaccionIniciada } =
    useTransaccionContext();

  const iniciarTransaccion = async () => {
    try {
      setTransaccionIniciada((prev) => !prev);
      await api.post('/iniciar-transaccion', {
        aislamiento,
      });
    } catch (error) {}
  };

  return (
    <div className='p-3 d-flex justify-content-center gap-3'>
      <span>
        <Form.Select
          aria-label='Default select example'
          disabled={transaccionIniciada}
          onChange={(e) => setAislamiento(e.target.value)}
          value={aislamiento}
        >
          <option value='READ COMMITTED'>Lectura comprometida</option>
          <option value='REPEATABLE READ'>Lectura repetible</option>
          <option value='SERIALIZABLE'>Serializable</option>
        </Form.Select>
      </span>
      <Button
        variant='success'
        disabled={transaccionIniciada}
        onClick={iniciarTransaccion}
        className='d-flex align-items-center gap-2'
      >
        <Play />
        Iniciar transacción
      </Button>
    </div>
  );
};

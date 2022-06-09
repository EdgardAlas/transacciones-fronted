import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { api } from '../../api';
import { moneda } from '../../helpers/moneda';
import { useTransaccionContext } from '../../hooks/useTransaccionContext';
import { ErrorServidor, Usuario } from '../../interfaces/interfaces';

interface Props {
  show: boolean;
  close: () => void;
}

export const VerUsuario = ({ show, close }: Props) => {
  const { usuarioVer, agregarConsulta, setUsuarioVer, cargarAutomaticamente } =
    useTransaccionContext();
  const [usuario, setUsuario] = useState<Usuario>();

  const cargarUsuario = useCallback(async () => {
    try {
      const { data } = await api.get<Usuario>(`/usuario/${usuarioVer}`);
      agregarConsulta(`Se consulto el usuario con id ${usuarioVer}`);
      setUsuarioVer(-1);
      setUsuario(data);
    } catch (error) {
      const err = error as AxiosError;
      return (
        (err?.response?.data as ErrorServidor).mensaje ||
        (err?.response?.data as ErrorServidor).error?.detail ||
        'Ha ocurrido un error'
      );
    }
  }, [usuarioVer, agregarConsulta, setUsuarioVer]);

  useEffect(() => {
    if (usuarioVer >= 0 && cargarAutomaticamente) {
      cargarUsuario();
    }
  }, [cargarUsuario, usuarioVer, cargarAutomaticamente]);

  return (
    <Modal
      size='lg'
      show={show}
      aria-labelledby='example-modal-sizes-title-lg'
      onHide={close}
    >
      <Modal.Header closeButton>
        <Modal.Title id='example-modal-sizes-title-lg'>Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <span className='fw-bold'>Nombre: </span> {usuario?.nombre}{' '}
          {usuario?.apellido}
        </p>
        <p>
          <span className='fw-bold'>Dirección: </span> {usuario?.direccion}
        </p>
        <p>
          <span className='fw-bold'>Correo: </span> {usuario?.correo}
        </p>
        <p>
          <span className='fw-bold'>Empleo: </span> {usuario?.empleo}
        </p>
        <p>
          <span className='fw-bold'>Saldo en la cuenta: </span>{' '}
          {moneda(usuario?.saldo || 0)}
        </p>
      </Modal.Body>
    </Modal>
  );
};

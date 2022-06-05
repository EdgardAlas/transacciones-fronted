import { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { api } from '../../api';
import { useTransaccionContext } from '../../hooks/useTransaccionContext';
import { Usuario } from '../../interfaces/interfaces';

interface Props {
  show: boolean;
  close: () => void;
}

export const VerUsuario = ({ show, close }: Props) => {
  const { usuarioVer, agregarConsulta } = useTransaccionContext();
  const [usuario, setUsuario] = useState<Usuario>();

  const cargarUsuario = useCallback(async () => {
    try {
      const { data } = await api.get<Usuario>(`/usuario/${usuarioVer}`);
      agregarConsulta(`Se consulto el usuario con id ${usuarioVer}`);
      setUsuario(data);
    } catch (error) {}
  }, [usuarioVer, agregarConsulta]);

  useEffect(() => {
    if (usuarioVer >= 0) {
      cargarUsuario();
    }
  }, [cargarUsuario, usuarioVer]);

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
          <span className='fw-bold'>Saldo en la cuenta: </span> {usuario?.saldo}
        </p>
      </Modal.Body>
    </Modal>
  );
};

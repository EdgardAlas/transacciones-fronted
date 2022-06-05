import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { Button, InputGroup, Table } from 'react-bootstrap';
import {
  ArrowClockwise,
  Cash,
  Eye,
  Pencil,
  Trash,
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { notificacion } from '../../helpers/notificacion';
import { useTransaccionContext } from '../../hooks/useTransaccionContext';
import { ErrorServidor } from '../../interfaces/interfaces';
import { VerUsuario } from './VerUsuario';

export const TablaUsuarios = () => {
  const {
    usuarios,
    agregarConsulta,
    cancelarTransaccion,
    obtenerUsuariosCargando,
    setUsuarioVer,
  } = useTransaccionContext();

  const [show, setShow] = useState(false);

  const toggleShow = () => setShow((prev) => !prev);

  const eliminarUsuario = async (id: number) => {
    try {
      await notificacion(api.delete(`/usuario/${id}`), {
        loading: 'Eliminando usuario',
        success: () => {
          agregarConsulta(`Se eliminó el usuario con id ${id}`);
          obtenerUsuariosCargando();
          return `Se ha eliminado el usuario con id ${id}`;
        },
        error: (error) => {
          cancelarTransaccion();
          const err = error as AxiosError;
          return (
            (err.response?.data as ErrorServidor).error?.detail ||
            'Ha ocurrido un error'
          );
        },
      });

      // if (editar?.id === id) {
      //   setEditar(null);
      // }
    } catch (error) {}
  };

  return (
    <>
      <div className='d-flex pb-2 justify-content-end'>
        <div>
          <InputGroup>
            <InputGroup.Text>Recargar usuarios</InputGroup.Text>
            <Button onClick={obtenerUsuariosCargando}>
              <ArrowClockwise />
            </Button>
          </InputGroup>
        </div>
      </div>

      <div
        style={{
          maxHeight: '500px',
          overflowY: 'auto',
        }}
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Direccón</th>
              <th>Correo</th>
              <th>Saldo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>
                  {usuario.nombre} {usuario.apellido}
                </td>
                <td>{usuario.direccion}</td>
                <td>{usuario.correo}</td>
                <td>${usuario.saldo}</td>
                <td>
                  <div className='d-flex gap-2'>
                    <Button variant='warning'>
                      <Pencil />
                    </Button>
                    <Button
                      variant='danger'
                      onClick={() => eliminarUsuario(usuario?.id || -1)}
                    >
                      <Trash />
                    </Button>
                    <Link to={`/12313/movimientos`} className='btn btn-info'>
                      <Cash />
                    </Link>
                    <Button
                      variant='secondary'
                      onClick={() => {
                        toggleShow();
                        setUsuarioVer(usuario?.id || -1);
                      }}
                    >
                      <Eye />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={6} className='text-center'>
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <VerUsuario show={show} close={toggleShow} />
    </>
  );
};

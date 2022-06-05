import { AxiosError } from 'axios';
import React from 'react';
import { Button, InputGroup, Table } from 'react-bootstrap';
import { ArrowClockwise, Pencil, Trash } from 'react-bootstrap-icons';
import { api } from '../../api';
import { notificacion } from '../../helpers/notificacion';
import { useTransaccionContext } from '../../hooks/useTransaccionContext';
import { ErrorServidor } from '../../interfaces/interfaces';

export const TablaEmpleo = () => {
  const {
    empleos,
    agregarConsulta,
    cancelarTransaccion,
    obtenerEmpleosCargando,
  } = useTransaccionContext();

  const eliminarEmpleo = async (id: number) => {
    try {
      await notificacion(api.delete(`/empleo/${id}`), {
        loading: 'Eliminando empleo',
        success: () => {
          agregarConsulta(`Se eliminó el empleo con id ${id}`);
          obtenerEmpleosCargando();
          return `Se ha eliminado el empleo con id ${id}`;
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
            <InputGroup.Text>Recargar empleos</InputGroup.Text>
            <Button onClick={obtenerEmpleosCargando}>
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
              <th>Empleo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleos.map((empleo) => (
              <tr key={empleo.id}>
                <td>{empleo.id}</td>
                <td>{empleo.empleo}</td>
                <td>
                  <div className='d-flex gap-2'>
                    <Button variant='warning'>
                      <Pencil />
                    </Button>
                    <Button
                      variant='danger'
                      onClick={() => eliminarEmpleo(empleo?.id || -1)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {empleos.length === 0 && (
              <tr>
                <td colSpan={6} className='text-center'>
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

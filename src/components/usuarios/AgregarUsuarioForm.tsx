import { Form, FormikProps } from 'formik';
import React from 'react';
import { Button } from 'react-bootstrap';
import {
  ArrowClockwise,
  Envelope,
  Pencil,
  PersonCircle,
  PersonWorkspace,
  Plus,
  PlusCircle,
  XCircle,
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { useTransaccionContext } from '../../hooks/useTransaccionContext';
import { Usuario } from '../../interfaces/interfaces';
import { MyInput } from '../MyInput';
import { MySelect } from '../MySelect';

export const AgregarUsuarioForm = ({
  handleReset,
  values,
}: FormikProps<Usuario>) => {
  const {
    empleos,
    obtenerEmpleosCargando,
    editando,
    setUsuarioCreando,
    setEditando,
  } = useTransaccionContext();

  return (
    <Form className='border border-2 p-3'>
      <h2 className='h5 text-center mb-4'>Agregar usuario</h2>
      {/* <Field name='nombre'></Field> */}
      <div className='mb-3 d-flex flex-column gap-3'>
        {' '}
        <MyInput
          label='Nombre'
          placeholder='Nombre'
          name='nombre'
          autoFocus
          icon={<PersonCircle />}
        />
        <MyInput
          label='Apellido'
          placeholder='Apellido'
          name='apellido'
          icon={<PersonCircle />}
        />
        <MyInput
          label='Dirección'
          placeholder='Dirección'
          name='direccion'
          icon={<PersonCircle />}
        />
        <MyInput
          label='Correo'
          placeholder='Correo'
          name='correo'
          icon={<Envelope />}
        />
        <MySelect
          label='Empleo'
          placeholder='empleo'
          name='empleo_id'
          icon={<PersonWorkspace />}
          boton={
            <>
              <Link to='/agregar-empleo' className='btn btn-outline-secondary'>
                <Plus />
              </Link>
              <Button
                variant='outline-secondary'
                onClick={obtenerEmpleosCargando}
              >
                <ArrowClockwise />
              </Button>
            </>
          }
        >
          <option value=''>Seleccione</option>
          {empleos.map((empleo) => (
            <option value={`${empleo.id}`} key={empleo.id}>
              {empleo.empleo}
            </option>
          ))}
        </MySelect>
      </div>

      <div className='d-flex gap-3 justify-content-end'>
        <Button
          variant='secondary'
          onClick={() => {
            handleReset();
            setEditando(false);
            setUsuarioCreando({
              id: undefined,
              dui: '',
              nombre: '',
              apellido: '',
              correo: '',
              direccion: '',
              empleo_id: '',
              empleo: '',
              saldo: undefined,
            });
          }}
          className='d-flex gap-2 align-items-center justify-content-center'
        >
          <XCircle /> Cancelar
        </Button>
        <Button
          type='submit'
          className='d-flex gap-2 align-items-center justify-content-center'
        >
          {editando ? (
            <>
              <Pencil /> Editar
            </>
          ) : (
            <>
              <PlusCircle /> Guardar
            </>
          )}
        </Button>
      </div>
    </Form>
  );
};

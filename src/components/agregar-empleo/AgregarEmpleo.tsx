import { AxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import {
  Pencil,
  PersonCircle,
  PlusCircle,
  XCircle,
} from 'react-bootstrap-icons';
import { api } from '../../api';
import { notificacion } from '../../helpers/notificacion';
import { useTransaccionContext } from '../../hooks/useTransaccionContext';
import { Empleo, ErrorServidor } from '../../interfaces/interfaces';
import { MyInput } from '../MyInput';

// const validationSchema = yup.object({
//   empleo: yup.string().required('El empleo no puede quedar vacio'),
// });

export const AgregarEmpleo = () => {
  const {
    // empleos,
    agregarConsulta,
    cancelarTransaccion,
    // obtenerUsuariosCargando,
    obtenerEmpleosCargando,
    editando,
    setEditando,
    empleoCreando,
    setEmpleoCreando,
  } = useTransaccionContext();

  useEffect(() => {
    return () => {
      setEditando(false);
      setEmpleoCreando({
        empleo: '',
        id: undefined,
      });
    };
  }, [setEditando, setEmpleoCreando]);

  const onSubmit = async (
    values: Empleo,
    formikHelpers: FormikHelpers<any>
  ) => {
    try {
      if (editando) {
        await notificacion(api.put(`/empleo/${empleoCreando.id}`, values), {
          loading: `Editando empleo ${empleoCreando.id}`,
          success: (data) => {
            setEditando(false);
            obtenerEmpleosCargando();
            agregarConsulta(`Se editó el empleo  ${values.empleo}`);
            return `Empleo editado con exito`;
          },
          error: (err) => {
            const error = err as AxiosError;
            cancelarTransaccion();
            return (
              (error?.response?.data as ErrorServidor).mensaje ||
              (error.response?.data as ErrorServidor).error?.detail ||
              'Ha ocurrido un error'
            );
          },
        });
      } else {
        await notificacion(api.post('/empleo', values), {
          loading: `Registrando empleo`,
          success: (data) => {
            obtenerEmpleosCargando();
            agregarConsulta(`Se inserto el empleo  ${values.empleo}`);
            return `Empleo insertado con exito`;
          },
          error: (err) => {
            const error = err as AxiosError;
            cancelarTransaccion();
            return (
              (error?.response?.data as ErrorServidor).mensaje ||
              (error.response?.data as ErrorServidor).error?.detail ||
              'Ha ocurrido un error'
            );
          },
        });
      }
      setEmpleoCreando({
        empleo: '',
        id: undefined,
      });
      formikHelpers.resetForm();
    } catch (error) {}
  };

  return (
    <Formik
      initialValues={empleoCreando}
      onSubmit={onSubmit}
      enableReinitialize
      // validationSchema={validationSchema}
    >
      {({ handleReset }) => (
        <Form className='border border-2 p-3'>
          <h2 className='h5 text-center mb-4'>Agregar empleo</h2>
          {/* <Field name='nombre'></Field> */}
          <MyInput
            label='Nombre'
            placeholder='Nombre'
            name='empleo'
            autoFocus
            icon={<PersonCircle />}
          />

          <div className='d-flex gap-3 justify-content-end mt-3'>
            <Button
              variant='secondary'
              onClick={() => {
                setEditando(false);
                setEmpleoCreando({
                  empleo: '',
                  id: undefined,
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
      )}
    </Formik>
  );
};

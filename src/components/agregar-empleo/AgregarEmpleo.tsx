import { AxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';
import { api } from '../../api';
import { notificacion } from '../../helpers/notificacion';
import { useTransaccionContext } from '../../hooks/useTransaccionContext';
import { Empleo, ErrorServidor } from '../../interfaces/interfaces';
import { MyInput } from '../MyInput';
import * as yup from 'yup';

const validationSchema = yup.object({
  empleo: yup.string().required('El empleo no puede quedar vacio'),
});

export const AgregarEmpleo = () => {
  const [initialValues, setInitialValues] = useState<Empleo>({
    empleo: '',
  });

  const {
    // empleos,
    agregarConsulta,
    cancelarTransaccion,
    // obtenerUsuariosCargando,
    obtenerEmpleosCargando,
  } = useTransaccionContext();

  const onSubmit = async (
    values: Empleo,
    formikHelpers: FormikHelpers<any>
  ) => {
    try {
      await notificacion(api.post('/empleo', values), {
        loading: 'Registrando empleo',
        success: (data) => {
          obtenerEmpleosCargando();
          agregarConsulta(`Se inserto el empleo  ${values.empleo}`);
          return `Empleo insertado con exito`;
        },
        error: (err) => {
          const error = err as AxiosError;
          cancelarTransaccion();
          return (
            (error.response?.data as ErrorServidor).error?.detail ||
            'Ha ocurrido un error'
          );
        },
      });

      formikHelpers.resetForm();
    } catch (error) {}
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      enableReinitialize
      validationSchema={validationSchema}
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
            <Button variant='secondary' onClick={handleReset}>
              Limpiar
            </Button>
            <Button type='submit'>Guardar</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

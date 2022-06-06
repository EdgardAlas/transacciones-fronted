import { AxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import { Button } from 'react-bootstrap';
import { CurrencyDollar, PlusCircle, XCircle } from 'react-bootstrap-icons';
import { api } from '../../api';
import { notificacion } from '../../helpers/notificacion';
import { useTransaccionContext } from '../../hooks/useTransaccionContext';
import { ErrorServidor } from '../../interfaces/interfaces';
import { MyInput } from '../MyInput';
import { MySelect } from '../MySelect';

interface InitialValues {
  monto: number;
  tipo: string;
}

const initialValues: InitialValues = {
  monto: 0,
  tipo: '',
};

interface Props {
  id: number;
  onAgregar: () => void;
}

export const AgregarMovimiento = ({ id, onAgregar }: Props) => {
  const { agregarConsulta, cancelarTransaccion } = useTransaccionContext();

  const onSubmit = async (
    values: InitialValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    try {
      await notificacion(
        api.post('/movimiento', { ...values, usuario_id: id }),
        {
          loading: `Registrando movimiento`,
          success: (data) => {
            onAgregar();
            agregarConsulta(`Movimiento registrado al usuario con id ${id}`);
            return `Movimiento registrado`;
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
        }
      );

      formikHelpers.resetForm();
    } catch (error) {}
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        enableReinitialize
        // validationSchema={validationSchema}
      >
        {({ handleReset }) => (
          <Form className='border border-2 p-3'>
            <h2 className='h5 text-center mb-4'>Agregar movimiento</h2>
            {/* <Field name='nombre'></Field> */}
            <div className='d-flex flex-column gap-3'>
              <MyInput
                label='Monto'
                placeholder='0'
                name='monto'
                autoFocus
                icon={<CurrencyDollar />}
              />
              <MySelect
                label='Tipo de movimiento'
                name='tipo'
                icon={<CurrencyDollar />}
              >
                <option value=''>Selecione un tipo de movimiento</option>
                <option value='Ingreso'>Ingreso</option>
                <option value='Retiro'>Retiro</option>
                <option value='Error'>Tipo que genera error</option>
              </MySelect>
            </div>

            <div className='d-flex gap-3 justify-content-end mt-3'>
              <Button
                variant='secondary'
                onClick={handleReset}
                className='d-flex gap-2 align-items-center justify-content-center'
              >
                <XCircle /> Cancelar
              </Button>
              <Button
                type='submit'
                className='d-flex gap-2 align-items-center justify-content-center'
              >
                <PlusCircle />
                Agregar
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

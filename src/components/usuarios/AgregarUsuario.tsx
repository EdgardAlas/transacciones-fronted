import { AxiosError } from 'axios';
import { Formik, FormikHelpers } from 'formik';
import { useEffect } from 'react';
import { api } from '../../api';
import { notificacion } from '../../helpers/notificacion';
import { useTransaccionContext } from '../../hooks/useTransaccionContext';
import { ErrorServidor, Usuario } from '../../interfaces/interfaces';
import { AgregarUsuarioForm } from './AgregarUsuarioForm';

// const validationSchema = yup.object({
//   nombre: yup.string().required('El nombre no puede quedar vacio'),
//   apellido: yup.string().required('El apellido no puede quedar vacio'),
//   direccion: yup.string().required('La dirección no puede quedar vacia'),
//   correo: yup
//     .string()
//     .required('El correo no puede quedar vacio')
//     .email('Revise el correo electronico'),
//   empleo_id: yup.string().required('El empleo no puede quedar vacio'),
// });

export const AgregarUsuario = () => {
  // const [initialValues, setInitialValues] = useState<Usuario>({
  //   apellido: '',
  //   correo: '',
  //   direccion: '',
  //   nombre: '',
  //   empleo_id: '',
  // });

  const {
    agregarConsulta,
    cancelarTransaccion,
    obtenerUsuariosCargando,
    usuarioCreando,
    editando,
    setEditando,
    setUsuarioCreando,
  } = useTransaccionContext();

  useEffect(() => {
    setEditando(false);
  }, [setEditando]);

  useEffect(() => {
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
  }, [setEditando, setUsuarioCreando]);

  const onSubmit = async (
    values: Usuario,
    formikHelpers: FormikHelpers<any>
  ) => {
    try {
      if (editando) {
        await notificacion(api.put(`/usuario/${usuarioCreando.id}`, values), {
          loading: `Editando usuario ${usuarioCreando.id}`,
          success: (data) => {
            setEditando(false);
            obtenerUsuariosCargando();
            agregarConsulta(`Se editó el usuario con id ${usuarioCreando.id}`);
            return `Usuario editado con exito`;
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
        await notificacion(api.post('/usuario', values), {
          loading: `Registrando usuario`,
          success: (data) => {
            obtenerUsuariosCargando();
            agregarConsulta(
              `Se inserto el usuario con correo ${values.correo}`
            );
            return `Usuario insertado con exito`;
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
      formikHelpers.resetForm();
    } catch (error) {}
  };

  return (
    <Formik
      initialValues={usuarioCreando}
      onSubmit={onSubmit}
      enableReinitialize
      // validationSchema={validationSchema}
    >
      {AgregarUsuarioForm}
    </Formik>
  );
};

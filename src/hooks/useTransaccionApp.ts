import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import { notificacion } from '../helpers/notificacion';
import {
  Empleo,
  ErrorServidor,
  TEmpleo,
  TUsuarios,
  Movimientos as LMovimientos,
  Usuario,
} from '../interfaces/interfaces';

export const useTransaccionApp = () => {
  const [usuario, setUsuario] = useState<Usuario>();
  const [listaMovimientos, setListaMovimentos] = useState<LMovimientos>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  const [aislamiento, setAislamiento] = useState('READ COMMITTED');
  const [consultas, setConsultas] = useState<string[]>([]);
  const [usuarios, setUsuarios] = useState<TUsuarios>([]);
  const [usuarioVer, setUsuarioVer] = useState<number>(-1);
  const [usuarioEditar, setusuarioEditar] = useState<number>(-1);
  const [empleoEditar, setEmpleoEditar] = useState<number>(-1);
  const [empleos, setEmpleos] = useState<Empleo[]>([]);
  const [transaccionIniciada, setTransaccionIniciada] =
    useState<boolean>(false);
  const [usuarioCreando, setUsuarioCreando] = useState<Usuario>({
    apellido: '',
    correo: '',
    direccion: '',
    nombre: '',
    empleo_id: '',
  });
  const [empleoCreando, setEmpleoCreando] = useState<Empleo>({
    empleo: '',
  });
  const [editando, setEditando] = useState(false);
  const [savepoints, setSavePoints] = useState<string[]>([]);
  const [cargarAutomaticamente, setCargarAutomaticamente] = useState(true);

  const cancelarTransaccion = () => {
    terminarTransaccion();
    if (transaccionIniciada) {
      toast.error('Se cancelo la transacción');
    }
  };

  const terminarTransaccion = () => {
    setTransaccionIniciada(false);
    setConsultas([]);
    obtenerUsuarios();
    obtenerEmpleos();
  };

  const commitTransaccion = async () => {
    try {
      await api.post('/commit');
      terminarTransaccion();
      toast.success('Se guardaron todos los cambios');
    } catch (error) {
      const err = error as AxiosError;
      toast.error(
        (err.response?.data as ErrorServidor).error?.detail ||
          'Ha ocurrido un error al hacer commit'
      );
      cancelarTransaccion();
    }
  };

  const agregarConsulta = useCallback(
    (consulta: string) => {
      if (transaccionIniciada) {
        setConsultas((prev) => [...prev, consulta]);
      }
    },
    [transaccionIniciada]
  );

  const rollbackTransaccion = async (savepoint: string = '') => {
    try {
      if (savepoint.length > 0) {
        await api.post(`/rollback/${savepoint}`);
        toast.success(`Se reestableció a ${savepoint}`);
      } else {
        await api.post('/rollback');
        terminarTransaccion();
        toast.success('Se deshicieron todos los cambios');
      }
    } catch (error) {
      cancelarTransaccion();
    }
  };

  useEffect(() => {
    const terminarSesion = () => {
      try {
        api.post('/rollback');
      } catch (error) {}
    };

    window.addEventListener('beforeunload', terminarSesion);

    return () => {
      window.removeEventListener('beforeunload', terminarSesion);
    };
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const { data } = await api.get<TUsuarios>('/usuarios');
      setUsuarios(data);
      agregarConsulta(`Se selecionaron todos los usuarios`);
    } catch (error) {}
  };

  const obtenerEmpleos = async () => {
    try {
      const { data } = await api.get<TEmpleo>('/empleos');
      setEmpleos(data);
      agregarConsulta(`Se seleccionaron todos los empleados`);
    } catch (error) {}
  };

  const obtenerUsuariosCargando = async () => {
    try {
      await notificacion(api.get<TUsuarios>('/usuarios'), {
        loading: 'Cargando empleos',
        success: ({ data }) => {
          console.log(data);
          setUsuarios(data);
          agregarConsulta('Se seleccionaron todos los usuarios');
          return 'Empleos cargados con exito';
        },
        error: (data) => 'Ha ocurrido un error al cargar los empleos',
      });
    } catch (error) {}
  };

  const obtenerEmpleosCargando = async () => {
    try {
      const { data } = await notificacion(api.get<TEmpleo>('/empleos'), {
        loading: 'Cargando empleos',
        success: ({ data }) => {
          setEmpleos(data);
          agregarConsulta('Se seleccionaron todos los empleos');

          return 'Empleos cargados con exito';
        },
        error: (data) => 'Ha ocurrido un error al cargar los empleos',
      });
      setEmpleos(data);
    } catch (error) {}
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  useEffect(() => {
    obtenerEmpleos();
  }, []);

  return {
    consultas,
    setConsultas,
    usuarios,
    setUsuarios,
    empleos,
    setEmpleos,
    transaccionIniciada,
    setTransaccionIniciada,
    usuarioEditar,
    setusuarioEditar,
    commitTransaccion,
    rollbackTransaccion,
    agregarConsulta,
    savepoints,
    setSavePoints,
    obtenerUsuarios,
    obtenerEmpleos,
    cancelarTransaccion,
    terminarTransaccion,
    obtenerEmpleosCargando,
    obtenerUsuariosCargando,
    usuarioCreando,
    setUsuarioCreando,
    usuarioVer,
    setUsuarioVer,
    cargarAutomaticamente,
    setCargarAutomaticamente,
    editando,
    setEditando,
    setEmpleoEditar,
    empleoEditar,
    empleoCreando,
    setEmpleoCreando,
    aislamiento,
    setAislamiento,
    usuario, setUsuario,
    listaMovimientos, setListaMovimentos,
    cargando, setCargando,
  };
};

export type ITransaccionApp = ReturnType<typeof useTransaccionApp>;

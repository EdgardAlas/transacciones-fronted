import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import {
  ArrowReturnLeft,
  Check,
  Check2Circle,
  PlusCircle,
} from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import { api } from '../api';
import { notificacion } from '../helpers/notificacion';
import { startsWithNumber } from '../helpers/startsWidthNumber';
import { useTransaccionContext } from '../hooks/useTransaccionContext';
import {
  ErrorServidor,
  Movimientos as LMovimientos,
  Usuario,
} from '../interfaces/interfaces';

export const AccionesBD = () => {
  const [savepoint, setSavePoint] = useState('');
  const [nombreSavepoint, setNombreSavepoint] = useState('');
  const {
    transaccionIniciada,
    commitTransaccion,
    rollbackTransaccion,
    cancelarTransaccion,
    agregarConsulta,
    obtenerUsuarios,
    savepoints,
    setSavePoints,
    obtenerEmpleos,
    consultas,
    usuario,
    setUsuario,
    setListaMovimentos,
    cargarAutomaticamente,
    setCargarAutomaticamente,
  } = useTransaccionContext();

  const cargarUsuario = useCallback(async () => {
    try {
      const { data } = await api.get<Usuario>(
        `/usuario/${usuario ? usuario.id : ''}`
      );

      agregarConsulta(
        `Se consulto el usuario con id ${usuario ? usuario.id : ''}`
      );

      setUsuario(data);
    } catch (error) {
      const err = error as AxiosError;
      return (
        (err?.response?.data as ErrorServidor).mensaje ||
        (err?.response?.data as ErrorServidor).error?.detail ||
        'Ha ocurrido un error'
      );
    }
  }, [agregarConsulta, usuario, setUsuario]);

  const cargarMovimientos = useCallback(async () => {
    try {
      await notificacion(
        api.get<LMovimientos>(`/movimientos/${usuario ? usuario.id : ''}`),
        {
          loading: `Obteniendo movimientos`,
          success: ({ data }) => {
            setListaMovimentos(data);
            agregarConsulta(
              `Se consultaron los movimientos del usuario con id ${
                usuario ? usuario.id : ''
              }`
            );
            return `Movimientos cargados con exito`;
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
    } catch (error) {}
  }, [agregarConsulta, usuario, cancelarTransaccion, setListaMovimentos]);

  const rollbackASavepoint = async () => {
    console.log(savepoint);
    if (savepoint.length > 0) {
      rollbackTransaccion(savepoint);

      const indice = savepoints.indexOf(savepoint);
      setSavePoints((prev) => prev.filter((value, idx) => idx < indice));

      agregarConsulta(`Se regresó al punto ${savepoint}`);
      if (cargarAutomaticamente) {
        if (window.location.href.includes('movimientos')) {
          cargarMovimientos();
          cargarUsuario();
        } else if (window.location.href.includes('empleo')) {
          obtenerEmpleos();
        } else {
          obtenerEmpleos();
          obtenerUsuarios();
        }
      }
      setSavePoint('');
      return;
    }
    if (cargarAutomaticamente) {
      if (window.location.href.includes('movimientos')) {
        cargarMovimientos();
        cargarUsuario();
      } else if (window.location.href.includes('empleo')) {
        obtenerEmpleos();
      } else {
        obtenerEmpleos();
        obtenerUsuarios();
      }
    }

    setSavePoint('');
    rollbackTransaccion();
  };

  const creatSavepoint = async () => {
    try {
      if (transaccionIniciada) {
        if (savepoints.includes(nombreSavepoint)) {
          return toast.error('Este savepoint ya existe');
        }

        if (nombreSavepoint.length === 0) {
          return toast.error('El nombre del savepoint no puede quedar vacio');
        }

        await api.post('/savepoint', {
          savepoint: nombreSavepoint,
        });
        setSavePoints((prev) => [...prev, nombreSavepoint]);
        agregarConsulta(`Se creo el savepoint ${nombreSavepoint}`);
        setNombreSavepoint('');
      }
    } catch (error) {
      cancelarTransaccion();
    }
  };

  return (
    <div className='mt-4 d-flex align-items-center gap-4 justify-content-center'>
      <div className='d-flex align-items-start gap-2'>
        <div>
          <label>Selects automaticos</label>
          <Form.Check
            type={'switch'}
            checked={cargarAutomaticamente}
            onChange={(e) => setCargarAutomaticamente(e.target.checked)}
          />
        </div>
        <div className='vr'></div>
        <div>
          <label>Savepoint</label>
          <Form.Control
            disabled={!transaccionIniciada}
            value={nombreSavepoint}
            onChange={(e) => {
              if (startsWithNumber(e.target.value)) {
                setNombreSavepoint('');
              } else {
                setNombreSavepoint(e.target.value.replace(' ', ''));
              }
            }}
          />
        </div>
        <div>
          <label className='d-block opacity-0'>1</label>
          <Button
            disabled={!transaccionIniciada}
            onClick={creatSavepoint}
            className='d-flex gap-2 align-items-center justify-content-center'
          >
            <PlusCircle />
            Crear
          </Button>
        </div>
      </div>
      <div className='vr'></div>
      <div className='d-flex'>
        <div>
          <label className='d-block opacity-0'>1</label>
          <Button
            disabled={!transaccionIniciada}
            variant='success'
            onClick={commitTransaccion}
            className='d-flex gap-2 align-items-center justify-content-center px-5'
          >
            <Check2Circle />
            Commit
          </Button>
        </div>
      </div>
      <div className='vr'></div>
      <div className='d-flex gap-2'>
        <div>
          <label className='d-block opacity-0'>1</label>
          <Form.Select
            aria-label='Default select example'
            disabled={!transaccionIniciada}
            value={savepoint}
            onChange={(e) => setSavePoint(e.target.value)}
          >
            <option value=''>Deshacer todo</option>
            {savepoints.map((svp, idx) => (
              <option value={svp} key={idx}>
                {svp}
              </option>
            ))}
          </Form.Select>
        </div>
        <div>
          <label className='d-block opacity-0'>1</label>
          <Button
            disabled={!transaccionIniciada}
            variant='danger'
            onClick={rollbackASavepoint}
            className='d-flex gap-2 align-items-center justify-content-center '
          >
            <ArrowReturnLeft />
            Rollback
          </Button>
        </div>
      </div>
      <div className='vr'></div>
      <div
        className='d-flex'
        style={{
          maxHeight: '150px',
          overflowY: 'auto',
        }}
      >
        <ListGroup>
          {[...consultas].reverse().map((consulta, index) => (
            <ListGroup.Item key={index}>
              <Check />
              {consulta}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

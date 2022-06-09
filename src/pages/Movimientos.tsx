import { AxiosError } from 'axios';
import { useCallback, useEffect } from 'react';
import { Button, Col, InputGroup, Row, Spinner } from 'react-bootstrap';
import { ArrowClockwise, ArrowLeft } from 'react-bootstrap-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { AccionesBD } from '../components/AccionesBD';
import { AgregarMovimiento } from '../components/movimientos/AgregarMovimiento';
import { TablaMovimientos } from '../components/movimientos/TablaMovimientos';
import { NivelAislamiento } from '../components/NivelAislamiento';
import { TransaccionIniciada } from '../components/TransaccionIniciada';
import { moneda } from '../helpers/moneda';
import { notificacion } from '../helpers/notificacion';
import { useTransaccionContext } from '../hooks/useTransaccionContext';
import {
  ErrorServidor,
  Movimientos as LMovimientos,
  Usuario,
} from '../interfaces/interfaces';

export const Movimientos = () => {
  const { id } = useParams();

  const {
    agregarConsulta,
    cancelarTransaccion,
    usuario,
    setUsuario,
    listaMovimientos,
    setListaMovimentos,
    cargando,
    setCargando,
    cargarAutomaticamente,
  } = useTransaccionContext();
  const navigate = useNavigate();

  const cargarUsuario = useCallback(async () => {
    try {
      const { data } = await api.get<Usuario>(`/usuario/${id}`);

      agregarConsulta(`Se consulto el usuario con id ${id}`);

      setUsuario(data);
      if (Object.keys(data).length === 0) {
        return navigate('/', { replace: true });
      }
      setCargando(false);
    } catch (error) {
      const err = error as AxiosError;
      return (
        (err?.response?.data as ErrorServidor).mensaje ||
        (err?.response?.data as ErrorServidor).error?.detail ||
        'Ha ocurrido un error'
      );
    }
  }, [agregarConsulta, id, navigate, setCargando, setUsuario]);

  const cargarMovimientos = useCallback(async () => {
    try {
      await notificacion(api.get<LMovimientos>(`/movimientos/${id}`), {
        loading: `Obteniendo movimientos`,
        success: ({ data }) => {
          if (cargarAutomaticamente) {
            cargarUsuario();
          }
          setListaMovimentos(data);
          agregarConsulta(
            `Se consultaron los movimientos del usuario con id ${id}`
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
      });
    } catch (error) {}
  }, [
    agregarConsulta,
    id,
    cancelarTransaccion,
    cargarUsuario,
    setListaMovimentos,
    cargarAutomaticamente,
  ]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<Usuario>(`/usuario/${id}`);
        if (!usuario) {
          agregarConsulta(`Se consulto el usuario con id ${id}`);
        }
        setUsuario(data);
        if (Object.keys(data).length === 0) {
          return navigate('/', { replace: true });
        }
        const { data: Lmovimientos } = await api.get<LMovimientos>(
          `/movimientos/${id}`
        );
        setListaMovimentos(Lmovimientos);
        setCargando(false);
      } catch (error) {
        const err = error as AxiosError;
        return (
          (err?.response?.data as ErrorServidor).mensaje ||
          (err?.response?.data as ErrorServidor).error?.detail ||
          'Ha ocurrido un error'
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <h1 className='h3 text-center d-flex align-items-center justify-content-center gap-3'>
        <Link to='/' className='btn btn-info'>
          <ArrowLeft />
        </Link>
        Movimientos
      </h1>
      <NivelAislamiento />

      {cargando ? (
        <div className='d-flex align-items-center gap-3 justify-content-center'>
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
          <span>Cargando usuario</span>
        </div>
      ) : (
        <>
          <TransaccionIniciada />

          <Row>
            <Col xs={3}>
              <div className='d-flex flex-column mb-4 gap-2'>
                <div>
                  <InputGroup>
                    <InputGroup.Text>Recargar usuario</InputGroup.Text>
                    <Button onClick={cargarUsuario}>
                      <ArrowClockwise />
                    </Button>
                  </InputGroup>
                </div>
                <div className='border border-2 p-2 d-flex flex-column gap-2'>
                  <p className='m-0'>
                    <span className='fw-bold'>Nombre:</span>{' '}
                    {` ${usuario?.nombre} ${usuario?.apellido}`}
                  </p>
                  <p className='m-0'>
                    <span className='fw-bold'>Correo:</span>{' '}
                    {`${usuario?.correo}`}
                  </p>
                  <p className='m-0'>
                    <span className='fw-bold'>Saldo:</span>{' '}
                    {moneda(usuario?.saldo || 0)}
                  </p>
                </div>
              </div>
              <AgregarMovimiento
                id={usuario?.id || -1}
                onAgregar={() => {
                  if (cargarAutomaticamente) {
                    cargarUsuario();
                    cargarMovimientos();
                  }
                }}
              />
            </Col>
            <Col>
              <TablaMovimientos
                movimientos={listaMovimientos}
                recargar={cargarMovimientos}
              />
            </Col>
          </Row>
          <Row>
            <AccionesBD />
          </Row>
        </>
      )}
    </div>
  );
};

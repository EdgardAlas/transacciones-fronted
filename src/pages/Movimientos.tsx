import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { AccionesBD } from '../components/AccionesBD';
import { AgregarMovimiento } from '../components/movimientos/AgregarMovimiento';
import { TablaMovimientos } from '../components/movimientos/TablaMovimientos';
import { NivelAislamiento } from '../components/NivelAislamiento';
import { TransaccionIniciada } from '../components/TransaccionIniciada';
import { AgregarUsuario } from '../components/usuarios/AgregarUsuario';
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
  
  const { agregarConsulta, cancelarTransaccion, usuario, setUsuario,
    listaMovimientos, setListaMovimentos,
    cargando, setCargando, } = useTransaccionContext();
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
  }, [agregarConsulta, id, navigate]);

  const cargarMovimientos = useCallback(async () => {
    try {
      await notificacion(api.get<LMovimientos>(`/movimientos/${id}`), {
        loading: `Obteniendo movimientos`,
        success: ({ data }) => {
          cargarUsuario();
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
  }, [agregarConsulta, id, cancelarTransaccion]);

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
          <div className='d-flex w-25 flex-column mb-4 gap-2'>
            <p className='m-0'>
              <span className='fw-bold'>Nombre:</span>{' '}
              {` ${usuario?.nombre} ${usuario?.apellido}`}
            </p>
            <p className='m-0'>
              <span className='fw-bold'>Correo:</span> {`${usuario?.correo}`}
            </p>
            <p className='m-0'>
              <span className='fw-bold'>Monto:</span>{' '}
              {moneda(usuario?.saldo || 0)}
            </p>
          </div>
          <TransaccionIniciada />
          <Row>
            <Col xs={3}>
              <AgregarMovimiento
                id={usuario?.id || -1}
                onAgregar={() => {
                  //cargarUsuario();
                  //cargarMovimientos();
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

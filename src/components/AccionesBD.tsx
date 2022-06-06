import { useState } from 'react';
import { Button, Form, ListGroup } from 'react-bootstrap';
import {
  ArrowReturnLeft,
  Check,
  Check2Circle,
  PlusCircle,
} from 'react-bootstrap-icons';
import toast from 'react-hot-toast';
import { api } from '../api';
import { startsWithNumber } from '../helpers/startsWidthNumber';
import { useTransaccionContext } from '../hooks/useTransaccionContext';

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
  } = useTransaccionContext();

  const rollbackASavepoint = async () => {
    console.log(savepoint);
    if (savepoint.length > 0) {
      rollbackTransaccion(savepoint);

      const indice = savepoints.indexOf(savepoint);
      setSavePoints((prev) => prev.filter((value, idx) => idx < indice));

      agregarConsulta(`Se regresó al punto ${savepoint}`);
      obtenerUsuarios();
      obtenerEmpleos();
      setSavePoint('');
      return;
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

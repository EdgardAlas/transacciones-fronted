import { Col, Row } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { AccionesBD } from '../components/AccionesBD';
import { AgregarEmpleo } from '../components/agregar-empleo/AgregarEmpleo';
import { TablaEmpleo } from '../components/agregar-empleo/TablaEmpleos';
import { NivelAislamiento } from '../components/NivelAislamiento';
import { TransaccionIniciada } from '../components/TransaccionIniciada';

export const Empleo = () => {
  return (
    <div>
      <h1 className='h3 text-center d-flex align-items-center justify-content-center gap-3'>
        <Link to='/' className='btn btn-info'>
          <ArrowLeft />
        </Link>
        Agregar empleo
      </h1>
      <NivelAislamiento />
      <TransaccionIniciada />
      <Row>
        <Col xs={4}>
          <AgregarEmpleo />
        </Col>
        <Col>
          <TablaEmpleo />
        </Col>
      </Row>
      <Row>
        <AccionesBD />
      </Row>
    </div>
  );
};

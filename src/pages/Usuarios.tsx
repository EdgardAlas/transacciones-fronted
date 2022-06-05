import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { AccionesBD } from '../components/AccionesBD';
import { NivelAislamiento } from '../components/NivelAislamiento';
import { TransaccionIniciada } from '../components/TransaccionIniciada';
import { AgregarUsuario } from '../components/usuarios/AgregarUsuario';
import { TablaUsuarios } from '../components/usuarios/TablaUsuarios';

export const Usuarios = () => {
  return (
    <div>
      <h1 className='h3 text-center'>Usuarios</h1>
      <NivelAislamiento />
      <TransaccionIniciada />
      <Row>
        <Col xs={4}>
          <AgregarUsuario />
        </Col>
        <Col>
          <TablaUsuarios />
        </Col>
      </Row>
      <Row>
        <AccionesBD />
      </Row>
    </div>
  );
};

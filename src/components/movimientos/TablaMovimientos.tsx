import { Badge, Button, InputGroup, Table } from 'react-bootstrap';
import { ArrowClockwise } from 'react-bootstrap-icons';
import { fecha } from '../../helpers/fecha';
import { moneda } from '../../helpers/moneda';
import { Movimientos } from '../../interfaces/interfaces';

interface Props {
  movimientos: Movimientos;
  recargar: () => void;
}

export const TablaMovimientos = ({ movimientos, recargar }: Props) => {
  return (
    <>
      <div className='d-flex pb-2 justify-content-end'>
        <div>
          <InputGroup>
            <InputGroup.Text>Recargar movimientos</InputGroup.Text>
            <Button onClick={recargar}>
              <ArrowClockwise />
            </Button>
          </InputGroup>
        </div>
      </div>

      <div
        style={{
          maxHeight: '350px',
          overflowY: 'auto',
        }}
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Monto</th>
              <th>Tipo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((movimieto) => (
              <tr key={movimieto.id}>
                <td>{movimieto.id}</td>
                <td>{moneda(movimieto?.monto || 0)}</td>
                <td>
                  {' '}
                  <Badge
                    bg={movimieto?.tipo === 'Ingreso' ? 'primary' : 'danger'}
                  >
                    {movimieto?.tipo}
                  </Badge>
                </td>
                <td>
                  {fecha(
                    movimieto?.fecha ? movimieto?.fecha : Date.now()
                  ).format('DD [de] MMMM [de] YYYY [a las] h:mm a')}
                </td>
              </tr>
            ))}
            {movimientos.length === 0 && (
              <tr>
                <td colSpan={6} className='text-center'>
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

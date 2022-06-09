import { Check2 } from 'react-bootstrap-icons';
import { useTransaccionContext } from '../hooks/useTransaccionContext';

export const TransaccionIniciada = () => {
  const { transaccionIniciada, aislamiento } = useTransaccionContext();

  const nivel: { [key: string]: string } = {
    'READ COMMITTED': 'lectura comprometida',
    'REPEATABLE READ': 'lectura repetible',
    SERIALIZABLE: 'serializable',
  };

  if (!transaccionIniciada) {
    return <></>;
  }

  return (
    <div className='d-flex justify-content-center p-2'>
      <h2 className='h4 text-success d-flex gap-2 align-items-center'>
        <Check2 />
        Transaccion iniciada en{' '}
        <span className='fw-bold'>{nivel[aislamiento]}</span>
      </h2>
    </div>
  );
};

import { Check2 } from 'react-bootstrap-icons';
import { useTransaccionContext } from '../hooks/useTransaccionContext';

export const TransaccionIniciada = () => {
  const { transaccionIniciada } = useTransaccionContext();

  if (!transaccionIniciada) {
    return <></>;
  }

  return (
    <div className='d-flex justify-content-center p-2'>
      <h2 className='h4 text-success d-flex gap-2 align-items-center'>
        <Check2 />
        Transaccion iniciada
      </h2>
    </div>
  );
};

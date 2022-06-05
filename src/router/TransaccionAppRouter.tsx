import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TransaccionesProvider } from '../context/TransaccionesProvider';
import { Empleo } from '../pages/Empleos';
import { Movimientos } from '../pages/Movimientos';
import { Usuario } from '../pages/Usuario';
import { Usuarios } from '../pages/Usuarios';

export const TransaccionAppRouter = () => {
  return (
    <div className='min-vh-100 bg-light d-flex justify-content-center align-items-center p-3'>
      <Toaster position='top-center' />
      <TransaccionesProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Usuarios />} />
            <Route path='/agregar-empleo' element={<Empleo />} />
            <Route path='/:id' element={<Usuario />} />
            <Route path='/:id/movimiento' element={<Movimientos />} />
          </Routes>
        </BrowserRouter>
      </TransaccionesProvider>
    </div>
  );
};

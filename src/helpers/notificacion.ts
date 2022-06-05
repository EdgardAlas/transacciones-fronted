import toast from 'react-hot-toast';
import { Renderable, ValueOrFunction } from 'react-hot-toast/dist/core/types';

export const notificacion = async <T>(
  promesa: Promise<T>,
  config: {
    loading: Renderable;
    success: ValueOrFunction<Renderable, T>;
    error: ValueOrFunction<Renderable, any>;
  }
) => {
  return toast.promise(promesa, config, {
    style: {
      minWidth: '250px',
    },
    success: {
      duration: 4000,
    },
  });
};

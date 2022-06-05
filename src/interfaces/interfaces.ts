export interface Usuario {
  id?: number;
  dui?: string;
  nombre?: string;
  apellido?: string;
  correo?: string;
  direccion?: string;
  empleo_id?: string;
  empleo?: string;
  saldo?: number;
}

export interface Empleo {
  id?: number;
  empleo?: string;
}

export type TUsuarios = Usuario[];

export type TEmpleo = Empleo[];

export interface Movimiento {
  id?: number;
  tipo?: string;
  monto?: number;
  fecha?: Date;
  usuario_id?: number;
}

export type Movimientos = Movimiento[];

export interface ErrorServidor {
  error?: Error;
  mensaje?: string;
}

export interface Error {
  length?: number;
  name?: string;
  severity?: string;
  code?: string;
  detail?: string;
  where?: string;
  schema?: string;
  table?: string;
  column?: string;
  file?: string;
  line?: string;
  routine?: string;
}

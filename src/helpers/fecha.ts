import 'dayjs/locale/es';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(LocalizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.locale('es');

type Fecha = Date | string | number;
export const fecha = (fecha: Fecha) => dayjs(fecha).tz(dayjs.tz.guess());

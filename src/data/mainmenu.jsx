import {
  BPJSIkon,
  DompetIkon,
  HandphoneIkon,
  InternetIkon,
  PDAMIkon,
  PLNIkon,
} from '../assets';

export const mainmenus = [
  {
    label: 'Pulsa & Data',
    ikon: HandphoneIkon,
    path: 'Pulsa',
  },
  {
    label: 'PLN',
    ikon: PLNIkon,
    path: 'LayananPLN',
  },
  {
    label: 'Dompet Elektronik',
    ikon: DompetIkon,
    path: 'DompetElektronik',
  },
  {
    label: 'BPJS Kesehatan',
    ikon: BPJSIkon,
    path: 'BpjsKesehatan',
  },
  {
    label: 'PDAM',
    ikon: PDAMIkon,
    path: 'PDAM',
  },
  {
    label: 'Internet',
    ikon: InternetIkon,
    path: 'Internet',
  },
];

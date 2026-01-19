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
    label: 'Games',
    ikon: HandphoneIkon, // Using existing icon temporarily
    path: 'Games',
  },
  {
    label: 'Masa Aktif',
    ikon: HandphoneIkon, // Using existing icon temporarily
    path: 'MasaAktif',
  },
  {
    label: 'TV',
    ikon: InternetIkon, // Using existing icon temporarily
    path: 'TV',
  },
  {
    label: 'Voucher',
    ikon: DompetIkon, // Using existing icon temporarily
    path: 'Voucher',
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

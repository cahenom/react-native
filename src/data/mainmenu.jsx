import {
  BPJSIkon,
  DompetIkon,
  GamesIkon,
  HandphoneIkon,
  InternetIkon,
  PDAMIkon,
  PLNIkon,
  TvIkon,
  VoucherIkon,
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
    ikon: GamesIkon,
    path: 'Games',
  },
  {
    label: 'Masa Aktif',
    ikon: HandphoneIkon, // Using existing icon temporarily
    path: 'MasaAktif',
  },
  {
    label: 'TV',
    ikon: TvIkon,
    path: 'TV',
  },
  {
    label: 'Voucher',
    ikon: VoucherIkon,
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

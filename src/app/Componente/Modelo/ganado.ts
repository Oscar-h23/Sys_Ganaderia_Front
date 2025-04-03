import { Corral } from './corral';
export interface Ganado {
establo: any;
  id?: number;
  codigoUnico: string;
  tiempo: number;
  raza: string;
  peso: number;
  fechaRegistro: string;
  corral?: Corral;
}
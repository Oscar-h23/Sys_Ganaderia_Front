import { Corral } from './corral';

export interface Establo {
  id?: number; // Opcional porque lo genera la BD
  nombre: string;
  ubicacion: string;
  capacidad: number;
  area: number;
  corrales?: Corral[]; // Lista de corrales opcional
}

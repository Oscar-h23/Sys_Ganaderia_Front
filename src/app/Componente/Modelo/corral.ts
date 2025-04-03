


import { Ganado } from './ganado'; // Importar el modelo Establo

export interface Corral {
  id?: number;
  nombre: string;
  establoId: number; // Relación con el establo
  capacidad: number;
  ganado?: Ganado[]; // Relación con el ganado
}

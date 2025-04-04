import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ganado } from '../../Componente/Modelo/ganado';
import { Corral } from '../../Componente/Modelo/corral';

@Injectable({
  providedIn: 'root'
})
export class GanadoService {
  private apiUrl = 'http://localhost:9000/api/ganado';

  constructor(private http: HttpClient) {}

  // Obtener todos los ganados
  getGanados(): Observable<Ganado[]> {
    return this.http.get<Ganado[]>(this.apiUrl);
  }
  // Obtener el ganado de un corral específico
  getGanadoPorCorral(corralId: number): Observable<Ganado[]> {
  return this.http.get<Ganado[]>(`${this.apiUrl}/corral/${corralId}`);
  }


  // Obtener corrales por establo
  getCorralesPorEstablo(establoId: number): Observable<Corral[]> {
    return this.http.get<Corral[]>(`${this.apiUrl}/${establoId}`);
  }

  // Obtener ganado por código único
  getGanadoByCodigo(codigoUnico: string): Observable<Ganado> {
    return this.http.get<Ganado>(`${this.apiUrl}/codigo/${codigoUnico}`);
  }

  // Crear ganado en un corral específico (con JWT automático gracias al interceptor)
  createGanado(corralId: number, ganado: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${corralId}`, ganado);
  }

  // Actualizar ganado
  updateGanado(ganadoId: number, ganado: Ganado): Observable<Ganado> {
    return this.http.put<Ganado>(`${this.apiUrl}/${ganadoId}`, ganado);
  }

  // Eliminar ganado
  deleteGanado(ganadoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${ganadoId}`);
  }

  // Obtener ganado cerca del límite de 90 días
  getGanadoCercaLimite(): Observable<Ganado[]> {
    return this.http.get<Ganado[]>(`${this.apiUrl}/cerca-limite`);
  }
}

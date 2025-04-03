import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Corral } from '../../Componente/Modelo/corral';

@Injectable({
  providedIn: 'root'
})
export class CorralesService {
  private apiUrl = 'http://localhost:9000/establos'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) {}

  // ✅ Obtener corrales por establo
  obtenerCorralesPorEstablo(establoId: number): Observable<Corral[]> {
    return this.http.get<Corral[]>(`${this.apiUrl}/${establoId}/corrales`, { headers: this.getHeaders() });
  }

  // ✅ Crear un corral con token JWT
  createCorral(establoId: number, corral: Corral): Observable<Corral> {
    return this.http.post<Corral>(`${this.apiUrl}/${establoId}/corrales`, corral, { headers: this.getHeaders() });
  }

  // ✅ Eliminar un corral con token JWT
  deleteCorral(corralId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/corrales/${corralId}`, { headers: this.getHeaders() });
  }

  //obtener todo los corales
  getCorrales(): Observable<Corral[]> {
    return this.http.get<Corral[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // ✅ Función para manejar los headers con el token JWT
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken'); // Obtiene el token del localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Agrega el token en los headers
    });
  }
}

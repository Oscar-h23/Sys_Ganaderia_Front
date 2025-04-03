import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Establo } from '../../Componente/Modelo/establo';

@Injectable({
  providedIn: 'root'
})
export class EstablosService {
  private apiUrl = 'http://localhost:9000/api/establos'; // Ajusta la URL según tu API

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('accessToken'); // Obtiene el token del localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` // Agrega el token en los headers
    });
  }

  obtenerEstablos(): Observable<Establo[]> {
    return this.http.get<Establo[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  agregarEstablo(establo: Establo): Observable<Establo> {
    return this.http.post<Establo>(this.apiUrl, establo, { headers: this.getHeaders() });
  }

  eliminarEstablo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}

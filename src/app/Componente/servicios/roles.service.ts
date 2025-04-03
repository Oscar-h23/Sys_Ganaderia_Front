import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = 'http://localhost:9000/api/roles';

  constructor(private http: HttpClient) {}

  private getHeaders(token: string | null): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  obtenerRoles(token: string | null): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders(token) });
  }

  crearRol(rol: any, token: string | null): Observable<any> {
    return this.http.post<any>(this.apiUrl, rol, { headers: this.getHeaders(token) });
  }

  editarRol(id: number, rol: any, token: string | null): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, rol, { headers: this.getHeaders(token) });
  }

  eliminarRol(id: number, token: string | null): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders(token) });
  }
}

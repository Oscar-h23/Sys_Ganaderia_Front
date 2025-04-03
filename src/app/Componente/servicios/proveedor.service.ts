import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export interface Proveedor {
  id?: number;
  ruc: string;
  empresa: string;
  representante: string;
  telefono: string;
  correo: string;
  estado: boolean; // Cambiado a booleano
}

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:9000/api/proveedores';

  constructor(private http: HttpClient) {}

  getProveedores(page: number = 0, size: number = 9): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`, { 
      headers: this.getHeaders() 
    });
  }

  getProveedorById(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  buscarPorEmpresa(empresa: string): Observable<Proveedor[]> {
    return this.http.get<{ content: Proveedor[] }>(`${this.apiUrl}/buscar?empresa=${empresa}`, { 
      headers: this.getHeaders() 
    }).pipe(
      map(response => response.content) // Extrae solo los proveedores del contenido
    );
  }
  

  registrarProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.apiUrl}/register`, proveedor, { 
      headers: this.getHeaders() 
    });
  }

  editarProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, proveedor, { 
      headers: this.getHeaders() 
    });
  }

  eliminarProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}

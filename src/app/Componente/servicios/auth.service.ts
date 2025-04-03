import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
    correo: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  nombreUsuario: string; // Se espera que el backend devuelva el nombre del usuario
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:9000/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials).pipe(
      tap(response => {
        // Guardamos el token y el nombre del usuario en Session Storage
        sessionStorage.setItem('accessToken', response.accessToken);
        sessionStorage.setItem('nombreUsuario', response.nombreUsuario);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('nombreUsuario');
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  getNombreUsuario(): string | null {
    return sessionStorage.getItem('nombreUsuario');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

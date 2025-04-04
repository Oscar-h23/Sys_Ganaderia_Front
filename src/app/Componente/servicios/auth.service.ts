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
  nombreUsuario: string;
  id: number;
  role: string;
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
        // Guardamos todo en sessionStorage
        sessionStorage.setItem('accessToken', response.accessToken);
        sessionStorage.setItem('tokenType', response.tokenType);
        sessionStorage.setItem('nombreUsuario', response.nombreUsuario);
        sessionStorage.setItem('id', response.id.toString());
        sessionStorage.setItem('role', response.role);
      })
    );
  }
  logout(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('tokenType');
    sessionStorage.removeItem('nombreUsuario');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('role');
  }

  getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  getTokenType(): string | null {
    return sessionStorage.getItem('tokenType');
  }

  getNombreUsuario(): string | null {
    return sessionStorage.getItem('nombreUsuario');
  }

  getUserId(): number | null {
    const id = sessionStorage.getItem('id');
    return id ? Number(id) : null;
  }

  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

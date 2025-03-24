import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../servicios/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, NgIf]
})
export class LoginComponent implements OnInit{
  credentials: LoginRequest = { username: '', password: '' };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    // Si ya está autenticado, redirige al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ingresar(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.errorMessage = 'Credenciales incorrectas. Intenta nuevamente.';
        console.error(err);
      }
    });
  }
}

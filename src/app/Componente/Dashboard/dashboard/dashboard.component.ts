import { Component , OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon'; // Importar Angular Material Icons
import { NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, RouterModule, NgIf], // Asegurar que NgIf y NgFor están incluidos
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit{
  nombreUsuario: string | null = '';
  isSidebarClosed = false;
  expandedMenus: { [key: string]: boolean } = {}; // Control de submenús abiertos
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.nombreUsuario = this.authService.getNombreUsuario();
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  toggleSubMenu(menu: string) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

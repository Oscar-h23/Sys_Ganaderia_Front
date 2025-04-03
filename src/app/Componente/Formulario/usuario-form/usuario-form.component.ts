import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegistroUsuariomodalComponent } from "../../modal/registro-usuariomodal/registro-usuariomodal.component";
import { RolesModalComponent } from "../../modal/roles-modal/roles-modal.component";
import { UsuarioService } from '../../servicios/usuario.service';
import { EditarUsuarioModalComponent } from '../../modal/editar-usuariomodal/editar-usuariomodal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrl: './usuario-form.component.css',
  imports: [FormsModule, CommonModule]
})
export class UsuarioFormComponent implements OnInit {
  usuarios: any[] = [];
  filtroNombre: string = '';
  page: number = 0;  // Página actual
  totalPages: number = 1; // Total de páginas

  constructor(private usuarioService: UsuarioService, private dialog: MatDialog) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.getUsuarios(this.page).subscribe(data => {
      console.log('Respuesta del backend:', data); // Debug: Ver estructura recibida
  
      if (data && data.content && Array.isArray(data.content)) {
        this.usuarios = [...data.content]; // Clonamos para evitar referencias directas
      } else {
        this.usuarios = []; // Aseguramos que siempre sea un array
      }
  
      this.totalPages = data.totalPages ?? 1;
    }, error => {
      console.error('Error al obtener usuarios:', error);
      this.usuarios = [];
    });
  }
  

  buscarPorNombre() {
    if (!this.filtroNombre.trim()) {
      this.obtenerUsuarios();
      return;
    }

    this.usuarioService.buscarPorNombre(this.filtroNombre).subscribe(data => {
      this.usuarios = data.content;
      this.totalPages = data.totalPages;
    });
  }

  cambiarPagina(cambio: number) {
    const nuevaPagina = this.page + cambio;
    if (nuevaPagina >= 0 && nuevaPagina < this.totalPages) {
      this.page = nuevaPagina;
      this.obtenerUsuarios();
    }
  }

  abrirModalRegistro() {
    const dialogRef = this.dialog.open(RegistroUsuariomodalComponent, { width: '650px' });
    dialogRef.afterClosed().subscribe(() => {
      this.obtenerUsuarios();
    });
  }

  editarUsuario(usuario: any) {
    const dialogRef = this.dialog.open(EditarUsuarioModalComponent, {
      width: '650px',
      data: { usuario }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.obtenerUsuarios();
    });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).subscribe(() => {
        this.obtenerUsuarios();
      });
    }
  }

  openRolesModal(): void {
    this.dialog.open(RolesModalComponent, { width: '600px' });
  }
}

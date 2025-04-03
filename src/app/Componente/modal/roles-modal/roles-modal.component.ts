import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../../servicios/roles.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css'],
  standalone: true,
  imports: [FormsModule, MatTableModule, MatIconModule,MatFormFieldModule,MatInputModule,
    MatCardModule,MatButtonModule, CommonModule],
})
export class RolesModalComponent implements OnInit {
  roles: any[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  nuevoRol = { nombre: '', descripcion: '' };

  constructor(
    public dialogRef: MatDialogRef<RolesModalComponent>,
    private rolService: RolService
  ) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    const token = localStorage.getItem('accessToken');
    this.rolService.obtenerRoles(token).subscribe((data) => {
      this.roles = data;
    });
  }

  agregarRol(): void {
    if (this.nuevoRol.nombre && this.nuevoRol.descripcion) {
      const token = localStorage.getItem('accessToken');
      this.rolService.crearRol(this.nuevoRol, token).subscribe(() => {
        this.cargarRoles();
        this.nuevoRol = { nombre: '', descripcion: '' };
      });
    }
  }

  editarRol(rol: any): void {
    const nuevoNombre = prompt('Nuevo nombre del rol:', rol.nombre);
    const nuevaDescripcion = prompt('Nueva descripción del rol:', rol.descripcion);
    if (nuevoNombre && nuevaDescripcion) {
      const token = localStorage.getItem('accessToken');
      this.rolService.editarRol(rol.id, { nombre: nuevoNombre, descripcion: nuevaDescripcion }, token)
        .subscribe(() => {
          this.cargarRoles();
        });
    }
  }

  eliminarRol(id: number): void {
    if (confirm('¿Estás seguro de eliminar este rol?')) {
      const token = localStorage.getItem('accessToken');
      this.rolService.eliminarRol(id, token).subscribe(() => {
        this.cargarRoles();
      });
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

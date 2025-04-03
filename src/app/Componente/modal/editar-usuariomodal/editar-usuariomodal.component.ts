import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioService } from '../../servicios/usuario.service';
import { RolService } from '../../servicios/roles.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-editar-usuariomodal',
  templateUrl: './editar-usuariomodal.component.html',
  styleUrls: ['./editar-usuariomodal.component.css'],
  imports: [FormsModule, CommonModule]
})
export class EditarUsuarioModalComponent implements OnInit {
  usuario: any = {};
  roles: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditarUsuarioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {}

  ngOnInit() {
    this.usuario = { ...this.data.usuario }; // Copia el usuario recibido
    this.obtenerRoles();
  }

  obtenerRoles() {
    this.usuarioService.getRoles().subscribe({
      next: (data: any[]) => {
        this.roles = data;
        console.log('Roles cargados:', this.roles);
      },
      error: (error) => {
        console.error('Error obteniendo roles:', error);
      }
    });
  }

  actualizarUsuario() {
    this.usuarioService.editarUsuario(this.usuario.id, this.usuario).subscribe(() => {
      this.dialogRef.close(true); // Cierra el modal y recarga la lista en la tabla
    });
  }

  cerrarModal() {
    this.dialogRef.close();
  }
}

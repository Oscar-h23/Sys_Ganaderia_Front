import { UsuarioService } from '../../servicios/usuario.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro-usuariomodal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './registro-usuariomodal.component.html',
  styleUrl: './registro-usuariomodal.component.css'
})
export class RegistroUsuariomodalComponent implements OnInit {
  usuarioForm!: FormGroup;
  roles: any[] = []; // Almacenará los roles cargados desde el backend
  usuarioId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<RegistroUsuariomodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Recibe datos del usuario seleccionado

  ) {}

  ngOnInit(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      rol: ['', Validators.required] // Se selecciona el ID del rol
    });

    this.obtenerRoles();

    // Si hay datos, es edición y se cargan los valores
    if (this.data && this.data.usuario) {
      this.usuarioId = this.data.usuario.id; // Se asigna el ID del usuario
      this.usuarioForm.patchValue({
        nombre: this.data.usuario.nombre,
        correo: this.data.usuario.correo,
        telefono: this.data.usuario.telefono,
        direccion: this.data.usuario.direccion,
        rol: this.data.usuario.rol.id
      });
    }
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

  onRegistrar() {
    if (this.usuarioForm.invalid) {
      console.warn('Formulario inválido, verifica los campos.');
      return;
    }

    const usuarioNuevo = {
      nombre: this.usuarioForm.value.nombre,
      correo: this.usuarioForm.value.correo,
      contrasena: this.usuarioForm.value.contrasena,
      telefono: this.usuarioForm.value.telefono,
      direccion: this.usuarioForm.value.direccion,
      rol: {
        id: this.usuarioForm.value.rol  // Se envía como objeto { id: ... }
      },
      fechaRegistro: new Date().toISOString(), // Fecha actual
      estado: true // Estado por defecto
    };

    console.log('Enviando usuario:', usuarioNuevo);

    this.usuarioService.registrarUsuario(usuarioNuevo).subscribe({
      next: (response) => {
        console.log('Usuario registrado correctamente:', response);

        // Guardar usuario registrado en LocalStorage (opcional)
        localStorage.setItem('usuarioRegistrado', JSON.stringify(response));

        this.dialogRef.close(true); // Cierra el modal si el registro fue exitoso
      },
      error: (error) => {
        console.error('Error en el registro:', error);
      }
    });
  }
  onEditar() {
    if (this.usuarioForm.invalid) {
      console.warn('Formulario inválido, verifica los campos.');
      return;
    }
  
    if (!this.usuarioId) {
      console.error('No hay usuario seleccionado para editar.');
      return;
    }
  
    const usuarioEditado = {
      nombre: this.usuarioForm.value.nombre,
      correo: this.usuarioForm.value.correo,
      contrasena: this.usuarioForm.value.contrasena,
      telefono: this.usuarioForm.value.telefono,
      direccion: this.usuarioForm.value.direccion,
      rol: {
        id: this.usuarioForm.value.rol // Se envía como objeto { id: ... }
      },
      fechaRegistro: this.data.usuario?.fechaRegistro || new Date().toISOString(), // Mantiene la fecha original si existe
      estado: this.data.usuario?.estado ?? true // Mantiene el estado actual o lo pone en `true`
    };
  
    // Si se ingresó una nueva contraseña, se incluye; si no, se mantiene la existente.
    if (this.usuarioForm.value.contrasena) {
      usuarioEditado.contrasena = this.usuarioForm.value.contrasena;
    }
  
    console.log('Enviando usuario editado:', usuarioEditado);
  
    this.usuarioService.editarUsuario(this.usuarioId, usuarioEditado).subscribe({
      next: (response) => {
        console.log('Usuario editado correctamente:', response);
  
        // Guardar usuario editado en LocalStorage (opcional)
        localStorage.setItem('usuarioEditado', JSON.stringify(response));
  
        this.dialogRef.close(true); // Cierra el modal si la edición fue exitosa
      },
      error: (error) => {
        console.error('Error en la edición:', error);
      }
    });
  }

  onCancelar() {
    this.dialogRef.close(false);
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Establo } from '../../../Componente/Modelo/establo';
import { Corral } from '../../Modelo/corral'; // Importar Corral
import { EstablosService } from '../../servicios/establo.service';
import { CorralesService } from '../../servicios/corrales.service'; // Importar CorralService
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

declare var bootstrap: any; // Asegurar que Bootstrap está definido

@Component({
  selector: 'app-establo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './establo-form.component.html',
  styleUrls: ['./establo-form.component.css']
})
export class EstabloFormComponent implements OnInit {
  establos: Establo[] = [];
  corrales: Corral[] = [];
  establoSeleccionado: Establo | null = null;
  nuevoEstablo: Establo = {
    nombre: '',
    ubicacion: '',
    capacidad: 0,
    area: 0,
    corrales: []
  };
  nuevoCorral: Corral = { nombre: '', capacidad: 0, establoId: 0, ganado: [] };

  constructor(
    private establosService: EstablosService,
    private CorralesService: CorralesService
  ) {}

  ngOnInit(): void {
    this.cargarEstablos();
  }

  cargarEstablos(): void {
    this.establosService.obtenerEstablos().subscribe({
      next: (data: Establo[]) => (this.establos = data),
      error: (err) => {
        console.error('Error al obtener establos:', err);
        Swal.fire('Error', 'No se pudieron cargar los establos.', 'error');
      }
    });
  }

  agregarEstablo(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      Swal.fire('Acceso Denegado', 'Debes iniciar sesión para agregar un establo.', 'error');
      return;
    }

    if (!this.nuevoEstablo.nombre.trim() || 
        !this.nuevoEstablo.ubicacion.trim() || 
        this.nuevoEstablo.capacidad <= 0 || 
        this.nuevoEstablo.area <= 0) { 
      Swal.fire('Campos Incompletos', 'Por favor, completa todos los campos obligatorios.', 'warning');
      return;
    }

    this.nuevoEstablo.corrales = this.nuevoEstablo.corrales || [];

    this.establosService.agregarEstablo(this.nuevoEstablo).subscribe({
      next: (establo) => {
        this.establos.push(establo);
        this.nuevoEstablo = { nombre: '', ubicacion: '', capacidad: 0, area: 0, corrales: [] };
        Swal.fire('Éxito', 'Establo agregado correctamente.', 'success');
      },
      error: (err) => {
        console.error('Error al agregar establo:', err);
        Swal.fire('Error', 'No se pudo agregar el establo.', 'error');
      }
    });
  }

  eliminarEstablo(id?: number): void {
    if (id === undefined) return;

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el establo permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.establosService.eliminarEstablo(id).subscribe({
          next: () => {
            this.establos = this.establos.filter((e) => e.id !== id);
            Swal.fire('Eliminado', 'El establo ha sido eliminado.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar establo:', err);
            Swal.fire('Error', 'No se pudo eliminar el establo.', 'error');
          }
        });
      }
    });
  }

  abrirModalCorrales(establo: Establo): void {
    this.establoSeleccionado = establo;
    this.nuevoCorral = { nombre: '', capacidad: 0, establoId: establo.id!, ganado: [] };
  
    if (!localStorage.getItem('accessToken')) {
      Swal.fire('Acceso Denegado', 'Debes iniciar sesión para ver los corrales.', 'error');
      return;
    }
  
    this.CorralesService.obtenerCorralesPorEstablo(establo.id!).subscribe({
      next: (data) => {
        this.corrales = data;
        const modalCorrales = new bootstrap.Modal(document.getElementById('modalCorrales'));
        modalCorrales.show();
      },
      error: (err) => {
        console.error('Error al obtener corrales:', err);
        Swal.fire('Error', 'No se pudieron cargar los corrales.', 'error');
      }
    });
  }
  
  agregarCorral(): void {
    if (!this.establoSeleccionado) {
      Swal.fire('Error', 'No se ha seleccionado un establo.', 'error');
      return;
    }
  
    if (!this.nuevoCorral.nombre.trim() || this.nuevoCorral.capacidad <= 0) {
      Swal.fire('Campos Incompletos', 'Por favor, completa los datos del corral.', 'warning');
      return;
    }
  
    if (!localStorage.getItem('accessToken')) {
      Swal.fire('Acceso Denegado', 'Debes iniciar sesión para agregar un corral.', 'error');
      return;
    }
  
    this.nuevoCorral.establoId = this.establoSeleccionado.id!;
  
    this.CorralesService.createCorral(this.nuevoCorral.establoId, this.nuevoCorral).subscribe({
      next: (nuevo) => {
        this.corrales.push(nuevo);
        this.nuevoCorral = { nombre: '', capacidad: 0, establoId: this.establoSeleccionado?.id ?? 0, ganado: [] };
        Swal.fire('Éxito', 'Corral agregado correctamente.', 'success');
      },
      error: (err) => {
        console.error('Error al agregar corral:', err);
        Swal.fire('Error', 'No se pudo agregar el corral.', 'error');
      }
    });
  }
  
  eliminarCorral(id?: number): void {
    if (id === undefined) {
      Swal.fire('Error', 'No se pudo eliminar el corral porque no tiene un ID válido.', 'error');
      return;
    }
  
    if (!localStorage.getItem('accessToken')) {
      Swal.fire('Acceso Denegado', 'Debes iniciar sesión para eliminar un corral.', 'error');
      return;
    }
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el corral permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.CorralesService.deleteCorral(id).subscribe({
          next: () => {
            this.corrales = this.corrales.filter(c => c.id !== id);
            Swal.fire('Eliminado', 'El corral ha sido eliminado.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar corral:', err);
            Swal.fire('Error', 'No se pudo eliminar el corral.', 'error');
          }
        });
      }
    });
  }
}  
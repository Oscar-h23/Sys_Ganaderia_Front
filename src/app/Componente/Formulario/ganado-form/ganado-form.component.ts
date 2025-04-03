import { Component, OnInit } from '@angular/core';
import { Ganado } from '../../Modelo/ganado';
import { GanadoService } from '../../servicios/ganado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CorralesService } from '../../servicios/corrales.service';
import { Corral } from '../../Modelo/corral';
import { Establo } from '../../Modelo/establo'; // ✅ Importar modelo de establo
import { EstablosService } from '../../servicios/establo.service'; // ✅ Importar servicio de establo
import Swal from 'sweetalert2';

// Bootstrap = any
declare var bootstrap: any;

@Component({
  selector: 'app-ganado-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './ganado-form.component.html',
  styleUrl: './ganado-form.component.css'
})
export class GanadoFormComponent implements OnInit {
  ganados: Ganado[] = [];
  establos: Establo[] = []; // ✅ Lista de establos
  corrales: Corral[] = [];
  ganadoCercaLimite: Ganado[] = [];
  
  establoSeleccionado: number | null = null; // ✅ Permitir selección dinámica del establo
  ganadoSeleccionado: Ganado = this.nuevoGanado();
  esNuevo: boolean = true;
listaGanado: any;

  constructor(
    private ganadoService: GanadoService,
    private establoService: EstablosService, // ✅ Servicio para traer los establos
    private corralesService: CorralesService
  ) {}

  ngOnInit(): void {
    this.obtenerEstablos(); // ✅ Primero obtener los establos
    this.obtenerGanado(); // ✅ Luego obtener el ganado
  }

  obtenerEstablos(): void {
    this.establoService.obtenerEstablos().subscribe((data) => {
      this.establos = data;
      console.log("✅ Establos cargados:", this.establos);
      
      // Selecciona el primer establo por defecto y carga sus corrales
      if (this.establos.length > 0) {
        this.establoSeleccionado = this.establos[0].id ?? null;
        this.obtenerCorralesPorEstablo();
      }
    });
  }

  obtenerCorralesPorEstablo(): void {
    if (!this.establoSeleccionado) return;
    this.corralesService.obtenerCorralesPorEstablo(this.establoSeleccionado).subscribe((data) => {
      this.corrales = data;
      console.log("✅ Corrales cargados:", this.corrales);
    });
  }

  obtenerGanado(): void {
    this.ganadoService.getGanados().subscribe((data) => {
      this.ganados = data;
      console.log("✅ Ganado cargado:", this.ganados);
    });
  }

  obtenerGanadoCercaLimite(): void {
    this.ganadoService.getGanadoCercaLimite().subscribe((data) => {
      this.ganadoCercaLimite = data;
      console.log("🚨 Ganado cerca del límite:", this.ganadoCercaLimite);
      this.mostrarModal('modalGanadoCercaLimite');
    });
  }

  abrirModalAgregar(): void {
    this.ganadoSeleccionado = this.nuevoGanado();
    this.esNuevo = true;
    this.mostrarModal('modalAgregarEditar');
  }

  abrirModalEditar(ganado: Ganado): void {
    this.ganadoSeleccionado = { ...ganado };
    this.esNuevo = false;
    this.mostrarModal('modalAgregarEditar');
  }

  guardarGanado() {
    const corralId = this.ganadoSeleccionado.corral?.id;
  
    if (!corralId) {
      Swal.fire('Error', '🚨 El corral es requerido', 'error');
      return;
    }
  
    // 🛠️ Verifica si el código único ya existe en otro ganado
    const codigoDuplicado = this.ganados.some(
      (g) => g.codigoUnico === this.ganadoSeleccionado.codigoUnico && g.id !== this.ganadoSeleccionado.id
    );
  
    if (codigoDuplicado) {
      Swal.fire('Error', '🚨 El código único ya está en uso. Ingresa un código diferente.', 'error');
      return;
    }
  
    const { id, corral, establo, ...datosGanado } = this.ganadoSeleccionado;
  
    if (this.esNuevo) {
      // ✅ Crear nuevo ganado
      this.ganadoService.createGanado(corralId, datosGanado).subscribe({
        next: () => {
          Swal.fire('Éxito', '✅ Ganado agregado correctamente', 'success');
          this.cerrarModal('modalAgregarEditar');
          this.obtenerGanado();
        },
        error: (error) => {
          Swal.fire('Error', error.error || "Error al agregar el ganado. Verifica los datos.", 'error');
        }
      });
    } else {
      // ✅ Actualizar ganado existente
      this.actualizarGanado();
    }
  }
  
  actualizarGanado() {
    if (!this.ganadoSeleccionado.id) {
      Swal.fire('Error', '🚨 No se puede actualizar un ganado sin ID', 'error');
      return;
    }
  
    // ✅ Asegurar que 'fechaRegistro' es string y 'establo' está incluido
    const datosGanado = {
      codigoUnico: this.ganadoSeleccionado.codigoUnico,
      tiempo: this.ganadoSeleccionado.tiempo,
      raza: this.ganadoSeleccionado.raza,
      peso: this.ganadoSeleccionado.peso,
      fechaRegistro: this.ganadoSeleccionado.fechaRegistro.toString(), // ✅ Convertir fecha a string si es Date
      establo: this.ganadoSeleccionado.establo?.id ?? null, // ✅ Asegurar que establo se envía correctamente
    };
  
    // 🔹 Llamada al servicio para actualizar
    this.ganadoService.updateGanado(this.ganadoSeleccionado.id, datosGanado).subscribe({
      next: () => {
        Swal.fire('Éxito', '✅ Ganado actualizado correctamente', 'success');
        this.cerrarModal('modalAgregarEditar');
        this.obtenerGanado();
      },
      error: (error) => {
        Swal.fire('Error', error.error || "Error al actualizar el ganado. Verifica los datos.", 'error');
      }
    });
  }
  
  nuevoGanado(): Ganado {
    return {
      corral: undefined,
      codigoUnico: '',
      tiempo: 0,
      raza: '',
      peso: 0,
      fechaRegistro: '',
      establo: { id: null },
    };
  }
  
  /** ✅ FUNCIONES PARA MANEJAR LOS MODALES MANUALMENTE CON BOOTSTRAP 5 */
  mostrarModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  cerrarModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
  // Abre el modal para editar
editarGanado(ganado: any) {
  this.ganadoSeleccionado = { ...ganado };
  this.esNuevo = false;
  const modal = new bootstrap.Modal(document.getElementById('modalAgregarEditar')!);
  modal.show();
}

// Eliminar ganado
eliminarGanado(id: number): void {
    if (id === undefined || id === null) {
        console.error("🚨 Error: Intentando eliminar un ganado sin ID válido");
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            this.ganadoService.deleteGanado(id).subscribe(() => {
                console.log(`✅ Ganado con ID ${id} eliminado`);
                this.obtenerGanado(); // Recargar la lista después de eliminar
                Swal.fire(
                    'Eliminado!',
                    'El ganado ha sido eliminado.',
                    'success'
                );
            }, error => {
                console.error("❌ Error al eliminar ganado:", error);
                Swal.fire(
                    'Error!',
                    'No se pudo eliminar el ganado.',
                    'error'
                );
            });
        }
    });
}

}



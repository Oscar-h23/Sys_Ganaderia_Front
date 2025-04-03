import { Component, OnInit } from '@angular/core';
import { ProveedorService, Proveedor } from '../../servicios/proveedor.service';
import { MatDialog } from '@angular/material/dialog';
import { RegistroProveedormodalComponent } from '../../modal/registro-proveedor-modal/registro-proveedor-modal.component';
import { EditarProveedorModalComponent } from '../../modal/editar-proveedor-modal/editar-proveedor-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proveedor-form',
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ProveedorFormComponent implements OnInit {
  proveedores: Proveedor[] = [];
  filtroEmpresa: string = '';
  page: number = 0;
  size: number = 9;
  totalPages: number = 1;

  constructor(
    private proveedorService: ProveedorService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.obtenerProveedores();
  }

  obtenerProveedores() {
    this.proveedorService.getProveedores(this.page, this.size).subscribe(response => {
      this.proveedores = response.content;
      this.totalPages = response.totalPages;
    });
  }

  buscarPorEmpresa() {
    if (!this.filtroEmpresa) {
      this.obtenerProveedores();
      return;
    }
  
    this.proveedorService.buscarPorEmpresa(this.filtroEmpresa).subscribe(data => {
      this.proveedores = data; // ✅ Sobreescribe correctamente la lista
    }, error => {
      console.error("Error en la búsqueda:", error);
    });
  }

  abrirModalRegistro() {
    const dialogRef = this.dialog.open(RegistroProveedormodalComponent, {
      width: '650px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.obtenerProveedores();
    });
  }

  eliminarProveedor(id: number) {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe(() => {
        this.obtenerProveedores();
      });
    }
  }

  editarProveedor(proveedor: Proveedor) {
    const dialogRef = this.dialog.open(EditarProveedorModalComponent, {
      width: '650px',
      data: { proveedor }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.obtenerProveedores();
    });
  }

  cambiarPagina(incremento: number) {
    if (this.page + incremento >= 0 && this.page + incremento < this.totalPages) {
      this.page += incremento;
      this.obtenerProveedores();
    }
  }
}

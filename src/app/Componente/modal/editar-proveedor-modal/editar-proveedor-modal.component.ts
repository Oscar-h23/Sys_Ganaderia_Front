import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedorService } from '../../servicios/proveedor.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-editar-proveedor-modal',
  templateUrl: './editar-proveedor-modal.component.html',
  styleUrls: ['./editar-proveedor-modal.component.css'],
  imports: [ReactiveFormsModule, MatDialogModule, CommonModule]
})
export class EditarProveedorModalComponent implements OnInit {
  proveedorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    public dialogRef: MatDialogRef<EditarProveedorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.proveedorForm = this.fb.group({
      ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      empresa: ['', Validators.required],
      representante: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      estado: [true]
    });
  }

  ngOnInit(): void {
    this.cargarDatosProveedor();
  }

  cargarDatosProveedor() {
    if (this.data.proveedor) {
      this.proveedorForm.patchValue({
        ruc: this.data.proveedor.ruc,
        empresa: this.data.proveedor.empresa,
        representante: this.data.proveedor.representante,
        telefono: this.data.proveedor.telefono,
        correo: this.data.proveedor.correo,
        estado: this.data.proveedor.estado
      });
    }
  }

  onActualizar() {
    if (this.proveedorForm.valid) {
      const proveedorActualizado = {
        ...this.proveedorForm.value,
        id: this.data.proveedor.id
      };

      this.proveedorService.editarProveedor(
        this.data.proveedor.id, 
        proveedorActualizado
      ).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancelar() {
    this.dialogRef.close(false);
  }
}
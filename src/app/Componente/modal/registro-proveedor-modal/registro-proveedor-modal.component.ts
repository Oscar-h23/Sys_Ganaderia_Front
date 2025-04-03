import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedorService } from '../../servicios/proveedor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-registro-proveedormodal',
  templateUrl: './registro-proveedor-modal.component.html',
  styleUrls: ['./registro-proveedor-modal.component.css'],
  imports: [FormsModule, CommonModule, MatDialogModule, ReactiveFormsModule]
})
export class RegistroProveedormodalComponent {
  proveedorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    public dialogRef: MatDialogRef<RegistroProveedormodalComponent>,
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

  onRegistrar() {
    if (this.proveedorForm.valid) {
      this.proveedorService.registrarProveedor(this.proveedorForm.value)
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }

  onCancelar() {
    this.dialogRef.close(false);
  }
}
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarProveedorModalComponent } from './editar-proveedor-modal.component';

describe('EditarProveedorModalComponent', () => {
  let component: EditarProveedorModalComponent;
  let fixture: ComponentFixture<EditarProveedorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarProveedorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarProveedorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

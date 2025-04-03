import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroProveedorModalComponent } from './registro-proveedor-modal.component';

describe('RegistroProveedorModalComponent', () => {
  let component: RegistroProveedorModalComponent;
  let fixture: ComponentFixture<RegistroProveedorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroProveedorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroProveedorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

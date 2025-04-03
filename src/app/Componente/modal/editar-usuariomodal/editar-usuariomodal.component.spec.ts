import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUsuariomodalComponent } from './editar-usuariomodal.component';

describe('EditarUsuariomodalComponent', () => {
  let component: EditarUsuariomodalComponent;
  let fixture: ComponentFixture<EditarUsuariomodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarUsuariomodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarUsuariomodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

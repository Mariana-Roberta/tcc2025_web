import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarCaminhoesComponent } from './gerenciar-caminhoes.component';

describe('GerenciarCaminhoesComponent', () => {
  let component: GerenciarCaminhoesComponent;
  let fixture: ComponentFixture<GerenciarCaminhoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarCaminhoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarCaminhoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarCarregamentoComponent } from './gerenciar-carregamento.component';

describe('GerenciarCarregamentoComponent', () => {
  let component: GerenciarCarregamentoComponent;
  let fixture: ComponentFixture<GerenciarCarregamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarCarregamentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarCarregamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizaOtimizacaoComponent } from './realiza-otimizacao.component';

describe('RealizaOtimizacaoComponent', () => {
  let component: RealizaOtimizacaoComponent;
  let fixture: ComponentFixture<RealizaOtimizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealizaOtimizacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealizaOtimizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

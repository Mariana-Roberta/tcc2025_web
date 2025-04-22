import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtimizaComponent } from './otimiza.component';

describe('OtimizaComponent', () => {
  let component: OtimizaComponent;
  let fixture: ComponentFixture<OtimizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtimizaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtimizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

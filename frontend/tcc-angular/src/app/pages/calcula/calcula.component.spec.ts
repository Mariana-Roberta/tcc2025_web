import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculaComponent } from './calcula.component';

describe('CalculaComponent', () => {
  let component: CalculaComponent;
  let fixture: ComponentFixture<CalculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

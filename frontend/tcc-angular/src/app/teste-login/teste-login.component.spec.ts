import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteLoginComponent } from './teste-login.component';

describe('TesteLoginComponent', () => {
  let component: TesteLoginComponent;
  let fixture: ComponentFixture<TesteLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
